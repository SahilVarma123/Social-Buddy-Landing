# Social Buddy — Phase 4 Implementation Status

## Approved decisions

- **Authentication:** Google OAuth is preferred. Email/password is the fallback if OAuth configuration delays development. OAuth redirect/deep-link handling must be tested on Expo Go before calling authentication complete.
- **Geocoding:** OpenStreetMap Nominatim. Requests must follow the current usage policy, use a descriptive application identifier where supported, and be rate-limited/cached. Do not send one request per keystroke or treat Nominatim as an unrestricted production geocoder.
- **Demo fallback:** Preserve local demo mode when Supabase configuration is absent. Sample events must remain visibly marked as demo data. Local bookmarks and RSVP indicators must not be presented as server-synced or confirmed attendance.

## Security review of the Phase 3 schema

The initial migration draft was reviewed before backend provisioning. Issues identified include:

- Organizer verification policy had an ambiguous self-comparison.
- Event submission policy did not constrain all privileged/demo fields.
- RSVP update policy did not protect registration/payment fields.
- The SECURITY DEFINER hyperlocal RPC did not explicitly set a search path or validate coordinates/radius/pagination bounds.
- The profile update policy queried the same RLS-protected table and could recurse.
- A public organizer SELECT policy could expose contact and verification-evidence columns.

Additive follow-up migrations were authored:

- `supabase/migrations/20261024000002_security_hardening.sql`
- `supabase/migrations/20261024000003_profile_and_organizer_privacy.sql`

These migrations are **not yet validated against a live or disposable Supabase database**. Do not claim they are production-ready, and do not provision production from them until SQL execution, RLS tests, RPC tests, and role-isolation tests pass.

## Phase 4 execution gates

1. Review the complete migration chain for SQL compatibility, Supabase grants, RLS behavior, PostGIS extension schema, and trigger behavior.
2. Apply migrations to a disposable Supabase project only after review; test anonymous, regular-user, organizer, moderator, admin, and service-role paths.
3. Implement a typed Supabase client that only reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`; never place a service-role key in the Expo bundle.
4. Implement auth session persistence and tested Google OAuth deep links, retaining email/password fallback if needed.
5. Implement an events service with explicit configured/live and unconfigured/demo modes. Network errors must not silently masquerade as successful writes.
6. Implement Nominatim with debounce, caching, rate limiting, clear attribution, and graceful failure.
7. Add community submission UI only after server-side policy tests prove submissions cannot self-approve, self-verify, or expose unapproved events.
8. Validate with TypeScript, Expo Doctor, web/Android bundling, database integration tests, and manual Expo Go testing.
9. Commit and push each coherent validated change directly to `main`, verify the remote SHA, and report the working-tree state. Never force-push.

## Current status

- Decision choices approved.
- Security findings documented and additive SQL hardening drafts committed.
- Supabase is **not provisioned or live**.
- Database migrations and RLS behavior are **not integration-tested**.
- Auth, live event service, submission UI, and Nominatim integration are **not yet implemented**.
