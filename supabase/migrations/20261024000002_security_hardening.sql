-- Social Buddy Phase 4 security hardening.
-- Additive follow-up migration: do not rewrite the original migration.
-- Review and test in a disposable Supabase project before production use.

begin;

-- ---------------------------------------------------------------------------
-- Guard privileged fields even if a future RLS policy is accidentally widened.
-- Role/verification/moderation changes are intended to be performed by a
-- trusted admin/moderator workflow or controlled server-side operation.
-- ---------------------------------------------------------------------------

create or replace function public.guard_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if new.role is distinct from old.role
     and coalesce(auth.role(), '') <> 'service_role'
     and not exists (
       select 1 from public.profiles p
       where p.id = auth.uid() and p.role = 'admin'
     )
  then
    raise exception 'Only an administrator can change profile roles'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_guard_profile_role_change on public.profiles;
create trigger trigger_guard_profile_role_change
before update of role on public.profiles
for each row execute function public.guard_profile_role_change();

create or replace function public.guard_organizer_verification()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if (
    new.verification_tier is distinct from old.verification_tier
    or new.verification_evidence is distinct from old.verification_evidence
    or new.verified_by is distinct from old.verified_by
    or new.verified_at is distinct from old.verified_at
  )
  and coalesce(auth.role(), '') <> 'service_role'
  and not exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('moderator', 'admin')
  )
  then
    raise exception 'Only a moderator or administrator can change organizer verification'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_guard_organizer_verification on public.organizers;
create trigger trigger_guard_organizer_verification
before update of verification_tier, verification_evidence, verified_by, verified_at
on public.organizers
for each row execute function public.guard_organizer_verification();

create or replace function public.guard_event_moderation_fields()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  privileged_actor boolean;
begin
  privileged_actor :=
    coalesce(auth.role(), '') = 'service_role'
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('moderator', 'admin')
    );

  if tg_op = 'INSERT' then
    if not privileged_actor and (
      new.moderation_status <> 'pending'
      or new.verification_status <> 'unverified'
      or new.is_featured
      or new.is_trending
      or new.is_demo
      or new.moderated_by is not null
      or new.moderated_at is not null
      or new.rejection_reason is not null
    ) then
      raise exception 'Submitted events must remain pending and unverified'
        using errcode = '42501';
    end if;
  elsif not privileged_actor and (
    new.moderation_status is distinct from old.moderation_status
    or new.verification_status is distinct from old.verification_status
    or new.is_featured is distinct from old.is_featured
    or new.is_trending is distinct from old.is_trending
    or new.is_demo is distinct from old.is_demo
    or new.moderated_by is distinct from old.moderated_by
    or new.moderated_at is distinct from old.moderated_at
    or new.rejection_reason is distinct from old.rejection_reason
  ) then
    raise exception 'Only a moderator or administrator can change moderation fields'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_guard_event_moderation_fields on public.events;
create trigger trigger_guard_event_moderation_fields
before insert or update on public.events
for each row execute function public.guard_event_moderation_fields();

create or replace function public.guard_rsvp_updates()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if new.user_id is distinct from old.user_id
     or new.event_id is distinct from old.event_id
     or new.registration_type is distinct from old.registration_type
     or new.payment_reference is distinct from old.payment_reference
     or new.created_at is distinct from old.created_at
  then
    raise exception 'RSVP identity and payment fields cannot be changed by clients'
      using errcode = '42501';
  end if;

  if old.status <> 'active' or new.status <> 'cancelled' then
    raise exception 'Clients may only cancel an active RSVP'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists trigger_guard_rsvp_updates on public.event_rsvps;
create trigger trigger_guard_rsvp_updates
before update on public.event_rsvps
for each row execute function public.guard_rsvp_updates();

-- ---------------------------------------------------------------------------
-- Replace permissive or incorrect policies.
-- ---------------------------------------------------------------------------

drop policy if exists "Organizer profile owner can update metadata" on public.organizers;
create policy "Organizer owner or moderators can update organizer metadata"
  on public.organizers for update
  using (
    auth.uid() = profile_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('moderator', 'admin')
    )
  )
  with check (
    auth.uid() = profile_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('moderator', 'admin')
    )
  );

drop policy if exists "Approved and demo events are discoverable by public" on public.events;
create policy "Approved and explicit demo-state events are discoverable"
  on public.events for select
  using (
    moderation_status = 'approved'
    or moderation_status = 'demo'
    or auth.uid() = submitted_by
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('moderator', 'admin')
    )
  );

drop policy if exists "Authenticated users can submit events for moderation" on public.events;
create policy "Authenticated users can submit pending unverified events"
  on public.events for insert
  with check (
    auth.uid() is not null
    and submitted_by = auth.uid()
    and moderation_status = 'pending'
    and verification_status = 'unverified'
    and is_featured = false
    and is_trending = false
    and is_demo = false
    and moderated_by is null
    and moderated_at is null
    and rejection_reason is null
  );

drop policy if exists "Users can cancel their own RSVP" on public.event_rsvps;
create policy "Users can cancel their own RSVP"
  on public.event_rsvps for update
  using (auth.uid() = user_id and status = 'active')
  with check (auth.uid() = user_id and status = 'cancelled');

-- ---------------------------------------------------------------------------
-- Harden the SECURITY DEFINER spatial RPC and validate all caller parameters.
-- It returns only approved events and explicitly designated demo-state events;
-- is_demo alone never bypasses moderation.
-- ---------------------------------------------------------------------------

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
language plpgsql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
begin
  if user_lat is null or user_lon is null
     or user_lat < -90 or user_lat > 90
     or user_lon < -180 or user_lon > 180
     or user_lat = 'NaN'::float8 or user_lon = 'NaN'::float8
  then
    raise exception 'Latitude/longitude out of range'
      using errcode = '22023';
  end if;

  if radius_km is null or radius_km < 1 or radius_km > 50
     or max_limit is null or max_limit < 1 or max_limit > 100
     or page_offset is null or page_offset < 0
  then
    raise exception 'Invalid radius, limit, or offset'
      using errcode = '22023';
  end if;

  return query
  select
    e.id, e.title, e.tagline, e.description, e.category_id,
    e.start_time, e.end_time, e.venue_name, e.address,
    st_y(e.location::geometry) as latitude,
    st_x(e.location::geometry) as longitude,
    round((st_distance(e.location, st_makepoint(user_lon, user_lat)::geography) / 1000.0)::numeric, 1)::float8 as distance_km,
    e.image_url, e.price_display, e.is_free, e.ticket_link,
    e.organizer_id,
    coalesce(o.name, 'Community Organizer') as organizer_name,
    o.avatar_url as organizer_avatar,
    coalesce(o.verification_tier in ('partner_verified', 'official_institution'), false) as organizer_verified,
    e.moderation_status, e.verification_status,
    e.is_featured, e.is_trending, e.is_demo,
    count(distinct r.id) as attendee_count
  from public.events e
  left join public.organizers o on o.id = e.organizer_id
  left join public.event_rsvps r on r.event_id = e.id and r.status = 'active'
  where st_dwithin(
      e.location,
      st_makepoint(user_lon, user_lat)::geography,
      radius_km * 1000.0
    )
    and (filter_category is null or filter_category = 'All' or e.category_id = filter_category)
    and (
      e.moderation_status = 'approved'
      or (include_demo and e.moderation_status = 'demo')
    )
    and e.start_time >= (now() - interval '6 hours')
  group by e.id, o.id
  order by e.is_featured desc, distance_km asc, e.start_time asc
  limit max_limit
  offset page_offset;
end;
$$;

revoke all on function public.get_hyperlocal_events(float8, float8, float8, text, boolean, int, int) from public;
grant execute on function public.get_hyperlocal_events(float8, float8, float8, text, boolean, int, int) to anon, authenticated;

commit;
