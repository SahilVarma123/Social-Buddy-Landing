-- ==============================================================================
-- Migration: 20261024000001_initial_hyperlocal_schema.sql
-- Project: Social Buddy (VecnaVerse Hackathon - Problem Statement 1)
-- Target: Supabase (PostgreSQL 15+ with PostGIS)
-- Description: Core schema for multi-user hyperlocal event discovery, community
--              moderation, geospatial queries, saved events, and RSVPs.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists postgis;
create extension if not exists pgcrypto;

-- 2. USER PROFILES
-- Extends Supabase auth.users with public profile metadata and role-based permissions.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  bio text,
  role text not null default 'user' check (role in ('user', 'organizer', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. ORGANIZER PROFILES
-- Entities, student clubs, or venues hosting community activities.
create table if not exists public.organizers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text unique not null,
  avatar_url text,
  bio text,
  contact_email text,
  website_url text,
  verification_tier text not null default 'unverified' 
    check (verification_tier in ('unverified', 'community_vouched', 'partner_verified', 'official_institution')),
  verification_evidence text,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. EVENT CATEGORIES
create table if not exists public.event_categories (
  id text primary key,
  label text not null,
  icon_name text not null,
  sort_order int not null default 0
);

-- Seed standardized categories matching application frontend
insert into public.event_categories (id, label, icon_name, sort_order) values
  ('Music', 'Music', 'musical-notes', 1),
  ('Comedy', 'Comedy', 'happy', 2),
  ('Workshops', 'Workshops', 'build', 3),
  ('College', 'College', 'school', 4),
  ('Sports', 'Sports', 'basketball', 5),
  ('Meetups', 'Meetups', 'people', 6),
  ('Parties', 'Parties', 'flame', 7)
on conflict (id) do update set
  label = excluded.label,
  icon_name = excluded.icon_name,
  sort_order = excluded.sort_order;

-- 5. EVENTS TABLE (Spatial Geography)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) >= 3 and char_length(title) <= 120),
  tagline text check (char_length(tagline) <= 180),
  description text not null check (char_length(description) >= 10),
  category_id text not null references public.event_categories(id),
  start_time timestamptz not null,
  end_time timestamptz,
  timezone text not null default 'Asia/Kolkata',
  venue_name text not null,
  address text not null,
  -- Point coordinates stored as PostGIS Geography (SRID 4326: Lon, Lat)
  location geography(Point, 4326) not null,
  image_url text not null,
  price_display text not null default 'Free',
  is_free boolean not null default true,
  ticket_link text,
  organizer_id uuid references public.organizers(id) on delete set null,
  submitted_by uuid references public.profiles(id) on delete set null,
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected', 'flagged', 'demo')),
  verification_status text not null default 'unverified'
    check (verification_status in ('demo_sample', 'unverified', 'community_vouched', 'partner_verified')),
  rejection_reason text,
  moderated_by uuid references public.profiles(id) on delete set null,
  moderated_at timestamptz,
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. EVENT SOURCES (Provenance & Ingestion Audit)
create table if not exists public.event_sources (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  source_type text not null 
    check (source_type in ('organizer_portal', 'community_submission', 'approved_public_feed', 'partner_import', 'demo_seed')),
  source_identifier text,
  source_url text,
  raw_payload jsonb,
  -- Deduplication fingerprint: SHA256(normalized title + venue + date)
  dedup_fingerprint text unique not null,
  ingested_at timestamptz not null default now()
);

-- 7. SAVED EVENTS (User Bookmarks)
create table if not exists public.saved_events (
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

-- 8. EVENT RSVPs & REGISTRATION STATES
create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  registration_type text not null default 'free_confirmed'
    check (registration_type in ('interest', 'free_confirmed', 'paid_pending', 'paid_confirmed')),
  status text not null default 'active' check (status in ('active', 'cancelled')),
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Prevent multiple active registrations per user per event
  unique (user_id, event_id)
);

-- ==============================================================================
-- INDEXES & PERFORMANCE OPTIMIZATION
-- ==============================================================================

-- Spatial GiST index for fast radius / bounding-box calculations
create index if not exists idx_events_location on public.events using gist(location);

-- B-Tree indexes for status, category, date, and user lookups
create index if not exists idx_events_moderation_start on public.events(moderation_status, start_time);
create index if not exists idx_events_category_start on public.events(category_id, start_time);
create index if not exists idx_events_organizer on public.events(organizer_id);
create index if not exists idx_saved_events_user on public.saved_events(user_id);
create index if not exists idx_rsvps_event on public.event_rsvps(event_id, status);
create index if not exists idx_rsvps_user on public.event_rsvps(user_id, status);

-- ==============================================================================
-- HYPERLOCAL POSTGIS QUERY RPC
-- ==============================================================================

create or replace function public.get_hyperlocal_events(
  user_lat float8,
  user_lon float8,
  radius_km float8 default 15.0,
  filter_category text default 'All',
  include_demo boolean default true,
  max_limit int default 50,
  page_offset int default 0
)
returns table (
  id uuid,
  title text,
  tagline text,
  description text,
  category_id text,
  start_time timestamptz,
  end_time timestamptz,
  venue_name text,
  address text,
  latitude float8,
  longitude float8,
  distance_km float8,
  image_url text,
  price_display text,
  is_free boolean,
  ticket_link text,
  organizer_id uuid,
  organizer_name text,
  organizer_avatar text,
  organizer_verified boolean,
  moderation_status text,
  verification_status text,
  is_featured boolean,
  is_trending boolean,
  is_demo boolean,
  attendee_count bigint
)
language sql
stable
security definer
as $$
  select
    e.id,
    e.title,
    e.tagline,
    e.description,
    e.category_id,
    e.start_time,
    e.end_time,
    e.venue_name,
    e.address,
    st_y(e.location::geometry) as latitude,
    st_x(e.location::geometry) as longitude,
    round((st_distance(e.location, st_makepoint(user_lon, user_lat)::geography) / 1000.0)::numeric, 1)::float8 as distance_km,
    e.image_url,
    e.price_display,
    e.is_free,
    e.ticket_link,
    e.organizer_id,
    coalesce(o.name, 'Community Organizer') as organizer_name,
    o.avatar_url as organizer_avatar,
    coalesce(o.verification_tier in ('partner_verified', 'official_institution'), false) as organizer_verified,
    e.moderation_status,
    e.verification_status,
    e.is_featured,
    e.is_trending,
    e.is_demo,
    count(distinct r.id) as attendee_count
  from public.events e
  left join public.organizers o on o.id = e.organizer_id
  left join public.event_rsvps r on r.event_id = e.id and r.status = 'active'
  where
    -- Spatial radius constraint via PostGIS ST_DWithin
    st_dwithin(
      e.location,
      st_makepoint(user_lon, user_lat)::geography,
      radius_km * 1000.0
    )
    -- Category filter
    and (filter_category is null or filter_category = 'All' or e.category_id = filter_category)
    -- Approved listings or explicitly allowed demonstration data
    and (
      e.moderation_status = 'approved'
      or (include_demo and (e.moderation_status = 'demo' or e.is_demo = true))
    )
    -- Exclude listings that ended more than 6 hours ago
    and e.start_time >= (now() - interval '6 hours')
  group by e.id, o.id
  order by
    e.is_featured desc,
    distance_km asc,
    e.start_time asc
  limit max_limit
  offset page_offset;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.organizers enable row level security;
alter table public.event_categories enable row level security;
alter table public.events enable row level security;
alter table public.event_sources enable row level security;
alter table public.saved_events enable row level security;
alter table public.event_rsvps enable row level security;

-- PROFILES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile basic fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Prevent self-escalation of roles
    and role = (select role from public.profiles where id = auth.uid())
  );

-- ORGANIZERS
create policy "Organizers are viewable by everyone"
  on public.organizers for select using (true);

create policy "Organizer profile owner can update metadata"
  on public.organizers for update
  using (
    auth.uid() = profile_id
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
  )
  with check (
    -- Cannot self-verify
    verification_tier = (select verification_tier from public.organizers where id = id)
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

-- EVENT CATEGORIES
create policy "Categories are viewable by everyone"
  on public.event_categories for select using (true);

-- EVENTS
create policy "Approved and demo events are discoverable by public"
  on public.events for select
  using (
    moderation_status = 'approved'
    or moderation_status = 'demo'
    or is_demo = true
    or auth.uid() = submitted_by
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

create policy "Authenticated users can submit events for moderation"
  on public.events for insert
  with check (
    auth.uid() is not null
    and submitted_by = auth.uid()
    and moderation_status = 'pending'
    and verification_status = 'unverified'
    and is_featured = false
  );

create policy "Moderators and submitters can update pending events"
  on public.events for update
  using (
    (auth.uid() = submitted_by and moderation_status = 'pending')
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
  )
  with check (
    -- Submitter cannot approve their own event or make it featured
    (
      auth.uid() = submitted_by
      and moderation_status = 'pending'
      and is_featured = false
      and verification_status = 'unverified'
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

-- SAVED EVENTS
create policy "Users can view and manage their own bookmarks"
  on public.saved_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- EVENT RSVPs
create policy "Users can view their own RSVPs"
  on public.event_rsvps for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

create policy "Users can register an RSVP for an event"
  on public.event_rsvps for insert
  with check (
    auth.uid() = user_id
    and status = 'active'
    -- Paid registrations must be handled via trusted webhooks, not direct client insert
    and registration_type in ('interest', 'free_confirmed')
  );

create policy "Users can cancel their own RSVP"
  on public.event_rsvps for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS TRIGGER
-- ==============================================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger trigger_organizers_updated_at
  before update on public.organizers
  for each row execute function public.handle_updated_at();

create trigger trigger_events_updated_at
  before update on public.events
  for each row execute function public.handle_updated_at();
