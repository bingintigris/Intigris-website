-- =====================================================================
--  Intigris portal, Connectors registry
--
--  One row per external service the website or portal talks to. This is a
--  register, not a set of live integrations: it records what is connected,
--  what it does, where its credential lives and where to go to manage it,
--  so nobody has to reverse-engineer that from the code six months later.
--
--  Run once. Safe to run again: the seed uses ON CONFLICT.
-- =====================================================================

create table if not exists public.connectors (
  id                  uuid primary key default gen_random_uuid(),
  key                 text not null unique,          -- stable machine name
  name                text not null,
  category            text not null,
  status              text not null default 'not_connected'
                        check (status in ('connected', 'needs_setup', 'not_connected', 'planned')),
  purpose             text,                          -- what it does for us, in plain language
  credential_location text,                          -- where the key or token lives
  console_url         text,                          -- where to go to manage it
  setup_notes         text,                          -- what is left to do
  owner               text,                          -- who at Intigris looks after it
  sort_order          int  not null default 100,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.connectors is
  'Register of external services used by the website and portal. Surfaced in Settings > Connectors.';

-- Keep updated_at honest.
create or replace function public.touch_connectors_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists connectors_touch_updated_at on public.connectors;
create trigger connectors_touch_updated_at
  before update on public.connectors
  for each row execute function public.touch_connectors_updated_at();

-- ---------------------------------------------------------------------
--  Row level security
--  Any signed-in portal user may read the register. Only admins may
--  change it, since these rows describe where credentials live.
-- ---------------------------------------------------------------------
alter table public.connectors enable row level security;

drop policy if exists connectors_read on public.connectors;
create policy connectors_read on public.connectors
  for select to authenticated
  using (true);

drop policy if exists connectors_admin_write on public.connectors;
create policy connectors_admin_write on public.connectors
  for all to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------------------------------------------------------------------
--  Seed
--  Status reflects reality as of today. Update it from the portal, not here.
-- ---------------------------------------------------------------------
insert into public.connectors
  (key, name, category, status, purpose, credential_location, console_url, setup_notes, sort_order)
values
  ('supabase', 'Supabase', 'Infrastructure', 'connected',
   'Database, authentication and file storage behind the website forms and this portal.',
   'Anon key is public and sits in each page. The service role key stays in Edge Function secrets and is never in the browser.',
   'https://supabase.com/dashboard/project/kzonefjyvaedaoodckmj',
   null, 10),

  ('klaviyo', 'Klaviyo', 'Email', 'needs_setup',
   'Sends the newsletter. Subscribers are pushed from the Newsletter page into the Klaviyo list.',
   'KLAVIYO_API_KEY and KLAVIYO_LIST_ID as Supabase Edge Function secrets. Never in the browser.',
   'https://www.klaviyo.com/lists',
   'Create a private API key, add both secrets, and deploy the klaviyo-sync function. Steps in admin/KLAVIYO-SETUP.md.',
   20),

  ('ga4', 'Google Analytics 4', 'Analytics', 'needs_setup',
   'Visitor numbers, popular pages and referrers. Only loads for visitors who accept analytics cookies.',
   'Measurement ID in components/CookieConsent.jsx. Not a secret.',
   'https://analytics.google.com',
   'Create a GA4 property and paste the G- measurement ID into GA4_ID in components/CookieConsent.jsx. One line, nothing else needed.',
   30),

  ('turnstile', 'Cloudflare Turnstile', 'Security', 'not_connected',
   'Blocks bots on the contact, newsletter and job application forms. Invisible to real people and needs no cookie consent.',
   'Site key is public. Secret key belongs in an Edge Function secret.',
   'https://dash.cloudflare.com/?to=/:account/turnstile',
   'Highest priority of the unconnected ones: the public forms have no bot protection today, so spam in Inquiries is a matter of when, not if.',
   40),

  ('salesforce', 'Salesforce', 'CRM', 'not_connected',
   'Push website inquiries into our own org as Leads, so the website feeds the CRM we sell.',
   'Connected App credentials in Edge Function secrets.',
   'https://login.salesforce.com',
   'Needs a Connected App and an Edge Function to create the Lead. Decide first whether inquiries become Leads or Cases.',
   50),

  ('slack', 'Slack', 'Notifications', 'not_connected',
   'Posts to a channel when an inquiry or job application arrives, so nothing sits unseen in the portal.',
   'Incoming webhook URL as an Edge Function secret.',
   'https://api.slack.com/apps',
   'Create an incoming webhook for the target channel. Simplest of the remaining connectors to add.',
   60),

  ('search_console', 'Google Search Console', 'Analytics', 'not_connected',
   'What people searched to find us, and which pages Google has actually indexed.',
   'No key needed. Verified by DNS record or an HTML file.',
   'https://search.google.com/search-console',
   'Verify the domain after the new site goes live, then submit the sitemap. Free, and tells us more about search than GA4 does.',
   70)

on conflict (key) do nothing;

-- Show the result.
select key, name, category, status, sort_order
from public.connectors
order by sort_order;
