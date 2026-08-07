-- =====================================================================
--  Intigris, allow public contact form submissions
--  Lets the website's "Let's talk" form insert into `inquiries` (anon).
--  Reading and editing stay restricted to logged-in portal users.
--  Run this once in the Supabase SQL editor.
-- =====================================================================

drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert on public.inquiries
  for insert to anon with check (true);
