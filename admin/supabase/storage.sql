-- =====================================================================
--  Intigris Admin Portal — Media Library: bucket + storage policies
--  Dollar-quoted so it is immune to smart-quote conversion on paste.
--  Run this whole file once in the SQL Editor. It creates the public
--  "media" bucket AND lets signed-in users upload / update / delete in it.
--  (No dashboard clicks needed.)
-- =====================================================================

-- Create the public bucket (or make it public if it already exists).
insert into storage.buckets (id, name, public)
values ($q$media$q$, $q$media$q$, true)
on conflict (id) do update set public = true;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = $q$media$q$);

drop policy if exists media_auth_insert on storage.objects;
create policy media_auth_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = $q$media$q$);

drop policy if exists media_auth_update on storage.objects;
create policy media_auth_update on storage.objects
  for update to authenticated
  using (bucket_id = $q$media$q$)
  with check (bucket_id = $q$media$q$);

drop policy if exists media_auth_delete on storage.objects;
create policy media_auth_delete on storage.objects
  for delete to authenticated
  using (bucket_id = $q$media$q$);
