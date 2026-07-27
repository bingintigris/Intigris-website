-- =====================================================================
--  Intigris Admin Portal — HR (Recruitment + Team)
--  Run in Supabase SQL Editor AFTER schema.sql. Safe to re-run.
--  Uses dollar-quoting ($q$...$q$) so it is immune to editors that convert
--  straight quotes into smart quotes on paste.
-- =====================================================================

-- ---------- Team members (feeds the future public Team section) ----------
create table if not exists public.team_members (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  title        text,
  bio          text,
  skills       text,
  headshot_url text,
  email        text,
  linkedin_url text,
  status       text not null default $q$active$q$,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- Job openings (power the future public careers listings) ----------
create table if not exists public.job_openings (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique,
  department      text,
  location        text,
  employment_type text,
  description     text,
  status          text not null default $q$open$q$,
  created_at      timestamptz not null default now()
);

-- ---------- Extend job_applications ----------
alter table public.job_applications add column if not exists opening_id uuid references public.job_openings(id);
alter table public.job_applications add column if not exists cv_url     text;
alter table public.job_applications add column if not exists cover_note text;

-- ---------- Row-level security ----------
alter table public.team_members enable row level security;
alter table public.job_openings enable row level security;

drop policy if exists team_rw on public.team_members;
create policy team_rw on public.team_members for all to authenticated
  using (public.current_role() in ($q$admin$q$, $q$hr_manager$q$))
  with check (public.current_role() in ($q$admin$q$, $q$hr_manager$q$));
drop policy if exists team_public_read on public.team_members;
create policy team_public_read on public.team_members for select to anon using (status = $q$active$q$);

drop policy if exists openings_rw on public.job_openings;
create policy openings_rw on public.job_openings for all to authenticated
  using (public.current_role() in ($q$admin$q$, $q$hr_manager$q$))
  with check (public.current_role() in ($q$admin$q$, $q$hr_manager$q$));
drop policy if exists openings_public_read on public.job_openings;
create policy openings_public_read on public.job_openings for select to anon using (status = $q$open$q$);

drop policy if exists applications_public_insert on public.job_applications;
create policy applications_public_insert on public.job_applications for insert to anon with check (true);

-- ---------- Seed: team members ----------
insert into public.team_members (name, title, bio, skills, status, sort_order)
select * from (values
  ($q$Hans Nieuwenhuis$q$, $q$Founder$q$, $q$Founded Intigris in 2010 and has guided it from a small team to a leading Salesforce partner.$q$, $q$Leadership, Strategy, Salesforce$q$, $q$active$q$, 1),
  ($q$Carlijn de Haan$q$, $q$COO$q$, $q$Moved into the COO role after several years as a Salesforce Consultant at Intigris.$q$, $q$Operations, Delivery, Salesforce$q$, $q$active$q$, 2),
  ($q$Victor Everaard$q$, $q$Senior Salesforce Consultant$q$, $q$Joined Intigris after 13 years in technical installation and field service consulting.$q$, $q$Field Service, Consulting, Integrations$q$, $q$active$q$, 3),
  ($q$Matthew Beringel$q$, $q$Salesforce Consultant$q$, $q$Consultant focused on building clean, practical Salesforce solutions for clients.$q$, $q$Sales Cloud, Service Cloud, Flow$q$, $q$active$q$, 4)
) as v(name, title, bio, skills, status, sort_order)
where not exists (select 1 from public.team_members where name = v.name);

-- ---------- Seed: job openings ----------
insert into public.job_openings (title, slug, department, location, employment_type, description, status)
select * from (values
  ($q$Salesforce Consultant$q$, $q$salesforce-consultant$q$, $q$Consulting$q$, $q$Amsterdam / Hybrid$q$, $q$Full-time$q$,
   $q$## About the role

Work directly with clients to configure and optimise Salesforce across Sales, Service, and Field Service.

## You bring

- Curiosity and strong problem-solving
- Salesforce experience (or the drive to learn fast)
- Clear communication in Dutch and English$q$, $q$open$q$),
  ($q$Medior Developer$q$, $q$medior-developer$q$, $q$Development$q$, $q$Amsterdam / Hybrid$q$, $q$Full-time$q$,
   $q$## About the role

Build integrations and custom solutions on the Salesforce platform (Apex, LWC) and beyond.

## You bring

- 3+ years development experience
- Apex / JavaScript
- A pragmatic, quality-first mindset$q$, $q$open$q$),
  ($q$ISA Trainee (Intigris Salesforce Academy)$q$, $q$isa-trainee$q$, $q$Academy$q$, $q$Amsterdam$q$, $q$Full-time$q$,
   $q$## About the programme

Start your Salesforce career with little or no experience through our academy, with mentoring and certification support.

## You bring

- A sharp mind and eagerness to learn
- Affinity with technology
- Team spirit$q$, $q$open$q$)
) as v(title, slug, department, location, employment_type, description, status)
where not exists (select 1 from public.job_openings where slug = v.slug);
