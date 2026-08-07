-- =====================================================================
--  Intigris, decisive test: can a website visitor insert an inquiry?
--
--  This impersonates the "anon" role (exactly what the website uses) and
--  tries to insert a row, then rolls it back so nothing is saved.
--
--  Run this in the SAME project the website points at:
--    https://kzonefjyvaedaoodckmj.supabase.co   (ref: kzonefjyvaedaoodckmj)
--
--  RESULT A: "Success. No rows returned"  -> the database is fine, the
--            problem is the browser serving a cached copy of the page.
--  RESULT B: an error about row-level security -> the policy is missing
--            in THIS project (you likely ran it in the other account).
-- =====================================================================

begin;

set local role anon;

insert into public.inquiries (name, email, subject, message, source_page)
values ('Policy test', 'policy-test@example.com', 'Policy test', 'Testing the anon insert permission.', 'sql-editor');

reset role;

rollback;   -- nothing is actually saved
