-- =====================================================================
--  Intigris — allow public newsletter sign-ups
--  Lets the home-page newsletter form insert into `subscribers` (anon).
--  Reading stays restricted to admins/content editors. Run once.
-- =====================================================================

drop policy if exists subscribers_public_insert on public.subscribers;
create policy subscribers_public_insert on public.subscribers
  for insert to anon with check (true);
