-- =====================================================================
--  Intigris, remove the seeded demo inquiries
--  The original seed.sql inserted 6 example inquiries so the portal
--  looked populated during development. Run this when you want a clean
--  inbox, so real submissions are immediately obvious.
--
--  Safe: it only deletes those 6 specific example rows by email address.
-- =====================================================================

delete from public.inquiries
where email in (
  'jeroen@opcharge.nl',
  'sanne@feenstra.nl',
  'mathieu@wetransfer.com',
  'lars@ebusco.com',
  'emma@atagwarmte.nl',
  'tom@alphaventilatie.nl'
);
