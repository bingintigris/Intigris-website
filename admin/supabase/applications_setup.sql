-- =====================================================================
--  Intigris Admin Portal — Job application uploads + extra fields
--  Creates a PRIVATE "applications" bucket (CVs/photos are not public),
--  lets the public careers form upload to it, lets admins/HR read it,
--  and adds the new application fields. Dollar-quoted; safe to re-run.
-- =====================================================================

-- Private bucket for CVs and applicant photos (not world-readable).
insert into storage.buckets (id, name, public)
values ($a$applications$a$, $a$applications$a$, false)
on conflict (id) do update set public = false;

-- Public careers form (anon) may upload; admins/HR (authenticated) may read/delete.
drop policy if exists applications_anon_insert on storage.objects;
create policy applications_anon_insert on storage.objects
  for insert to anon with check (bucket_id = $a$applications$a$);

drop policy if exists applications_auth_insert on storage.objects;
create policy applications_auth_insert on storage.objects
  for insert to authenticated with check (bucket_id = $a$applications$a$);

drop policy if exists applications_auth_read on storage.objects;
create policy applications_auth_read on storage.objects
  for select to authenticated using (bucket_id = $a$applications$a$);

drop policy if exists applications_auth_delete on storage.objects;
create policy applications_auth_delete on storage.objects
  for delete to authenticated using (bucket_id = $a$applications$a$);

-- New application fields.
alter table public.job_applications add column if not exists phone                text;
alter table public.job_applications add column if not exists cv_path              text;
alter table public.job_applications add column if not exists photo_path           text;
alter table public.job_applications add column if not exists salesforce_certified boolean;
alter table public.job_applications add column if not exists languages            text;
alter table public.job_applications add column if not exists netherlands_resident boolean;
