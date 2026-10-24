-- Additional privacy hardening for Social Buddy.
-- Run only after reviewing the full migration chain in a disposable project.

begin;

-- Role immutability is enforced by trigger_guard_profile_role_change; avoid
-- querying profiles from its own RLS policy, which can cause policy recursion.
drop policy if exists "Users can update their own profile basic fields" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Organizer rows include private contact and verification evidence. Do not
-- expose every table column through a broad public SELECT grant. The RPC and
-- trusted server-side operations continue to read the base table.
revoke select on table public.organizers from anon, authenticated;

create or replace view public.organizer_directory
with (security_barrier = true)
as
select
  id,
  name,
  slug,
  avatar_url,
  bio,
  website_url,
  verification_tier,
  is_demo,
  created_at
from public.organizers;

grant select on public.organizer_directory to anon, authenticated;

commit;
