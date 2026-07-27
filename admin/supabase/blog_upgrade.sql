-- =====================================================================
--  Intigris Admin Portal — Blog upgrade
--  Run this in Supabase SQL Editor AFTER schema.sql.
--  Adds the fields a public blog needs, and lets the public website read
--  PUBLISHED posts (drafts stay private). Safe to re-run.
-- =====================================================================

-- Extra fields for a proper blog.
alter table public.blog_posts add column if not exists excerpt         text;
alter table public.blog_posts add column if not exists cover_image_url text;
alter table public.blog_posts add column if not exists author_name     text;
alter table public.blog_posts add column if not exists read_minutes    integer default 4;
alter table public.blog_posts add column if not exists category        text;

-- Public (anonymous) visitors may read ONLY published posts.
-- The website uses the public anon key; this policy is what makes the
-- blog visible to the world without exposing drafts.
drop policy if exists blog_public_read on public.blog_posts;
create policy blog_public_read on public.blog_posts
  for select
  to anon
  using (status = 'published');

-- (The existing blog_rw policy still lets admins/content editors do everything.)
