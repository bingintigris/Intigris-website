-- =====================================================================
--  Intigris Admin Portal — sample data (optional)
--  Run AFTER schema.sql to populate the portal with realistic demo data
--  you can click into, edit, and show colleagues. Safe to delete later:
--     delete from public.inquiries;  delete from public.subscribers;
--     delete from public.activity_log; delete from public.blog_posts;
--     delete from public.job_applications;
-- =====================================================================

insert into public.inquiries (name, email, company, subject, message, status, priority, source_page) values
  ('Jeroen Prins', 'jeroen@opcharge.nl', 'Opcharge', 'Field Service rollout', 'We''d like to talk about rolling out Salesforce Field Service across our engineers. Can we book a call?', 'new', 'high', '/contact'),
  ('Sanne de Wit', 'sanne@feenstra.nl', 'Feenstra', 'Quote for integration', 'Looking to integrate our ERP with Salesforce. What would a scoping trajectory look like?', 'new', 'medium', '/services'),
  ('Mathieu Kok', 'mathieu@wetransfer.com', 'WeTransfer', 'Data cleanup follow-up', 'Following up on the data migration proposal — do you have availability next month?', 'in_progress', 'medium', '/contact'),
  ('Lars Bakker', 'lars@ebusco.com', 'Ebusco', 'Agentforce pilot', 'Interested in a small Agentforce pilot for our service team. Ballpark cost?', 'new', 'high', '/'),
  ('Emma Visser', 'emma@atagwarmte.nl', 'ATAG Warmte', 'Thanks + next steps', 'Thanks for the demo. Internally aligned — ready to discuss a statement of work.', 'in_progress', 'low', '/cases'),
  ('Tom Jansen', 'tom@alphaventilatie.nl', 'Alpha Ventilatie', 'Support question', 'Quick question about a flow that stopped triggering after the last release.', 'resolved', 'low', '/contact');

insert into public.subscribers (email, source_page) values
  ('info@direct-healthcare.com', '/blog'),
  ('planner@warmgarant.nl', '/careers'),
  ('hr@bouwgroep-schrijver.nl', '/'),
  ('ops@customs-support.com', '/services');

insert into public.blog_posts (title, slug, status, views) values
  ('Agentforce in the field: what actually works', 'agentforce-in-the-field', 'published', 412),
  ('Five signs your Salesforce org needs a cleanup', 'salesforce-org-cleanup', 'published', 268),
  ('Field service, without the chaos', 'field-service-without-chaos', 'draft', 0);

insert into public.job_applications (candidate, email, role_applied, status) values
  ('Nadia El Amrani', 'nadia@example.com', 'Salesforce Consultant', 'new'),
  ('Pieter Vos', 'pieter@example.com', 'Medior Developer', 'reviewed'),
  ('Kim Bakhuis', 'kim@example.com', 'ISA Trainee', 'interview');

insert into public.activity_log (kind, message) values
  ('inquiry', 'New “Let''s talk” inquiry from Opcharge'),
  ('subscriber', 'New newsletter subscriber (careers page)'),
  ('blog', 'Blog post “Agentforce in the field” published'),
  ('application', 'New application — Medior Developer'),
  ('inquiry', 'Inquiry from WeTransfer moved to In progress');
