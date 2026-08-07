-- =====================================================================
--  Intigris, FIX for "new row violates row-level security policy"
--  on the website contact form.
--
--  Run this in the Supabase SQL editor of the project whose URL is
--  https://kzonefjyvaedaoodckmj.supabase.co
--  (Project ref: kzonefjyvaedaoodckmj. If the ref in your browser's
--   address bar is different, you are in the wrong project.)
--
--  This is safe to run more than once.
-- =====================================================================

-- 1. Make sure row level security is on (it should already be).
alter table public.inquiries enable row level security;

-- 2. Allow anyone on the website to SUBMIT an inquiry.
--    Covers both anonymous visitors and logged-in users.
--    Reading, editing and deleting stay restricted to portal users.
drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

-- 3. Confirm what now exists. You should see a row named
--    "inquiries_public_insert" with cmd = INSERT and roles {anon,authenticated}.
select
  tablename,
  policyname,
  cmd        as applies_to,
  roles      as for_roles
from pg_policies
where schemaname = 'public'
  and tablename  = 'inquiries'
order by policyname;
