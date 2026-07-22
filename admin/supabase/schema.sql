-- =====================================================================
--  Intigris Admin Portal — database schema
--  Run this in your Supabase project: SQL Editor -> New query -> paste -> Run.
--  Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE where possible).
-- =====================================================================

-- ---------- Roles ----------
do $$ begin
  create type public.app_role as enum ('admin', 'hr_manager', 'content_editor', 'support_lead');
exception when duplicate_object then null; end $$;

-- ---------- profiles (1:1 with auth.users) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        public.app_role not null default 'support_lead',
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Helper: current user's role (used by RLS policies below).
create or replace function public.current_role()
returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Business tables ----------
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text,
  company     text,
  subject     text,
  message     text,
  status      text not null default 'new',       -- new | in_progress | resolved
  priority    text not null default 'medium',    -- low | medium | high
  assigned_to uuid references public.profiles(id),
  source_page text,
  created_at  timestamptz not null default now()
);

create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source_page text,
  created_at  timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique,
  body         text,
  status       text not null default 'draft',    -- draft | scheduled | published
  author_id    uuid references public.profiles(id),
  views        integer not null default 0,
  meta_title   text,
  meta_description text,
  og_image_url text,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

create table if not exists public.job_applications (
  id          uuid primary key default gen_random_uuid(),
  candidate   text,
  email       text,
  role_applied text,
  status      text not null default 'new',        -- new | reviewed | interview | rejected | hired
  notes       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.activity_log (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null,                      -- inquiry | subscriber | blog | application | system
  message     text not null,
  actor_id    uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

-- ---------- Row-level security ----------
alter table public.profiles         enable row level security;
alter table public.inquiries        enable row level security;
alter table public.subscribers      enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.job_applications enable row level security;
alter table public.activity_log     enable row level security;

-- profiles: everyone signed in can read; you can edit yourself; admins edit all.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (true);
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- inquiries: admins + support leads.
drop policy if exists inquiries_rw on public.inquiries;
create policy inquiries_rw on public.inquiries for all to authenticated
  using (public.current_role() in ('admin','support_lead'))
  with check (public.current_role() in ('admin','support_lead'));

-- subscribers: admins + content editors.
drop policy if exists subscribers_rw on public.subscribers;
create policy subscribers_rw on public.subscribers for all to authenticated
  using (public.current_role() in ('admin','content_editor'))
  with check (public.current_role() in ('admin','content_editor'));

-- blog_posts: admins + content editors.
drop policy if exists blog_rw on public.blog_posts;
create policy blog_rw on public.blog_posts for all to authenticated
  using (public.current_role() in ('admin','content_editor'))
  with check (public.current_role() in ('admin','content_editor'));

-- job_applications: admins + HR managers.
drop policy if exists applications_rw on public.job_applications;
create policy applications_rw on public.job_applications for all to authenticated
  using (public.current_role() in ('admin','hr_manager'))
  with check (public.current_role() in ('admin','hr_manager'));

-- activity_log: any signed-in user can read; inserts allowed for signed-in users.
drop policy if exists activity_read on public.activity_log;
create policy activity_read on public.activity_log for select to authenticated using (true);
drop policy if exists activity_insert on public.activity_log;
create policy activity_insert on public.activity_log for insert to authenticated with check (true);

-- =====================================================================
--  AFTER RUNNING: create your first admin.
--  1) Authentication -> Users -> Add user (email + password).
--  2) Then run (replace the email):
--     update public.profiles set role = 'admin', full_name = 'Your Name'
--     where email = 'you@intigris.nl';
-- =====================================================================
