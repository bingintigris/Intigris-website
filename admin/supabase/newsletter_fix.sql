-- =====================================================================
--  Intigris, newsletter sign-ups
--
--  1. Lets website visitors subscribe (fixes "new row violates
--     row-level security policy for table subscribers").
--  2. Removes the 4 seeded dummy subscribers, so the list only ever
--     contains people who really signed up.
--
--  Run this in the project the website points at:
--    https://kzonefjyvaedaoodckmj.supabase.co   (ref: kzonefjyvaedaoodckmj)
--
--  Safe to run more than once.
-- =====================================================================

-- 1. Make sure row level security is on (it should already be).
alter table public.subscribers enable row level security;

-- 2. Allow anyone on the website to SUBSCRIBE.
--    Reading and exporting the list stays restricted to portal users.
drop policy if exists subscribers_public_insert on public.subscribers;
create policy subscribers_public_insert
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

-- 3. Remove the seeded example subscribers.
delete from public.subscribers
where email in (
  'info@direct-healthcare.com',
  'planner@warmgarant.nl',
  'hr@bouwgroep-schrijver.nl',
  'ops@customs-support.com'
);

-- 4. Confirm the result. You should see a policy named
--    "subscribers_public_insert" (INSERT, roles {anon,authenticated}),
--    and a subscriber count of only real sign-ups.
select policyname, cmd as applies_to, roles as for_roles
from pg_policies
where schemaname = 'public' and tablename = 'subscribers'
order by policyname;

select count(*) as subscribers_remaining from public.subscribers;
