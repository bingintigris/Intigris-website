-- =====================================================================
--  Intigris Admin Portal — Media Library storage policies
--  Dollar-quoted so it is immune to smart-quote conversion on paste.
--
--  FIRST create the bucket in the dashboard:
--    Storage -> New bucket -> name: media -> tick "Public bucket" -> Create
--
--  Then run this to let signed-in users upload / update / delete in it.
--  (A public bucket already allows public reads, which is what the website
--  needs for image URLs.)
-- =====================================================================

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
