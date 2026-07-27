# Intigris Admin Portal

Internal operational dashboard for the Intigris website — inquiries, newsletter,
blog CMS, HR, and analytics in one place. Built as a **Vite + React + Tailwind**
single-page app with **Supabase** for authentication, database, and role-based
access (row-level security).

It's a separate app from the marketing site, deployed as its own Netlify site.

## What's built so far (phase 1)

- Secure login (email/password), "Remember me", and password reset flow.
- Role-based access control: Admin, HR Manager, Content Editor, Support Lead.
- App shell: collapsible role-aware sidebar, top bar with search/notifications,
  user menu with sign-out.
- Executive dashboard: KPI cards, "Requires follow-up" queue, quick actions,
  recent-activity feed (live Supabase queries, with sample data before the
  tables have rows).
- **Inquiries manager** — "Let's talk" inbox with status filters + search, and a
  detail drawer to read the message, set status/priority, assign an owner, add
  internal notes, and quick-reply (opens your email client pre-filled).
- Placeholders + routing for the remaining modules (newsletter, blog, HR,
  settings) — built next.

## Setup

### 1. Create a Supabase project
In the Supabase account you want to use, create a new project. Then:
- **SQL Editor → New query** → paste the contents of `supabase/schema.sql` → **Run**.
- Optional but recommended for a live demo: run `supabase/seed.sql` the same way
  to populate realistic sample inquiries, subscribers, posts, and activity you
  can click into and edit.
- For the blog: run `supabase/blog_upgrade.sql` (adds blog fields + lets the
  public website read published posts), then `supabase/blog_import.sql`
  (imports 6 real articles from the current site). Run order overall:
  `schema.sql` → `blog_upgrade.sql` → `blog_import.sql` (→ `seed.sql` optional).
- For Recruitment + Team: run `supabase/hr.sql` (adds `team_members` and
  `job_openings`, extends `job_applications`, sets public-read rules so the
  future careers/team pages work, lets the public careers form submit
  applications, and seeds demo data).
- **Authentication → Users → Add user** — create your login (email + password).
- Back in **SQL Editor**, make yourself an admin (use your email):
  ```sql
  update public.profiles set role = 'admin', full_name = 'Your Name'
  where email = 'you@intigris.nl';
  ```

### 2. Configure the app
- Copy `.env.example` to `.env`.
- From Supabase **Project Settings → API**, copy the **Project URL** and the
  **anon / publishable key** into `.env`:
  ```
  VITE_SUPABASE_URL=https://xxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=xxxx
  ```

### 3. Run locally
```bash
cd admin
npm install
npm run dev
```
Open the printed URL (default http://localhost:5174).

## Deploy to Netlify (separate site)

1. Netlify → **Add new site → Import an existing project** → pick the same GitHub repo.
2. **Base directory:** `admin`
3. Build command and publish dir come from `admin/netlify.toml`
   (`npm run build` → `dist`), including the SPA redirect.
4. **Site settings → Environment variables:** add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`.
5. Deploy. Point the marketing site's footer "Admin" link at this site's URL.
6. In Supabase **Authentication → URL Configuration**, add the Netlify URL to
   the allowed redirect URLs (for the password-reset link to work).

## AI topic suggestions (Blog)

The Blog page has an "AI topic ideas" panel that suggests on-brand article ideas.
The LLM key stays server-side in a Supabase **Edge Function** (never in the browser).

Set it up once:

1. In Supabase: **Edge Functions → Create a new function**, name it exactly
   `suggest-topics`, paste the contents of
   `admin/supabase/functions/suggest-topics/index.ts`, and **Deploy**.
2. Turn **Verify JWT** OFF for this function (it verifies the signed-in user
   itself, and this lets the browser call it without a CORS/preflight failure).
3. **Edge Functions → Manage secrets** (or Project Settings → Edge Functions),
   add:
   - `LLM_PROVIDER` = `anthropic`  (or `openai`)
   - `ANTHROPIC_API_KEY` = your key  (or `OPENAI_API_KEY` if using OpenAI)
   - optional: `ANTHROPIC_MODEL` (default `claude-3-5-haiku-20241022`) /
     `OPENAI_MODEL` (default `gpt-4o-mini`)
   `SUPABASE_URL` and `SUPABASE_ANON_KEY` are provided automatically.

Until it's deployed, the panel shows a friendly "not deployed yet" message; the
rest of the Blog CMS works regardless. Note: these are editorial suggestions from
the model's knowledge, not live search-volume data.

## Media library (Settings)

The Settings → Media library uploads to Supabase Storage. One-time setup:

1. Supabase → **Storage → New bucket** → name it `media` → tick **Public bucket** → Create.
2. Run `supabase/storage.sql` in the SQL Editor (lets signed-in users upload/delete).

Then you can upload images/PDFs and copy their URL into blog covers or team
headshots. Users & Roles and the Activity log need no extra setup.

### Add User button (Users & roles)

The "Add user" button creates a login and sets the role. Creating accounts
needs the admin key, so it runs in an Edge Function (like the AI one, but using
Supabase's built-in service key — no external key to buy):

1. Supabase → **Edge Functions → Create a new function**, name it exactly
   `invite-user`, paste `admin/supabase/functions/invite-user/index.ts`, Deploy.
2. Turn **Verify JWT** OFF (the function verifies the admin caller itself).

No secrets to set. New users get a temporary password to share; they can reset
it via "Forgot password?" on the login screen. Until deployed, the button shows
a friendly "not deployed yet" message.

## Roles & access

| Module      | Admin | HR Manager | Content Editor | Support Lead |
|-------------|:---:|:---:|:---:|:---:|
| Dashboard   | ✓ | ✓ | ✓ | ✓ |
| Inquiries   | ✓ |   |   | ✓ |
| Newsletter  | ✓ |   | ✓ |   |
| Blog        | ✓ |   | ✓ |   |
| HR & Team   | ✓ | ✓ |   |   |
| Settings    | ✓ |   |   |   |

Access is enforced twice: the UI hides what you can't use, and Supabase
row-level security blocks it at the database even if someone crafts a request.

## Security note

The anon key is safe to ship to the browser — it only grants what RLS allows.
Never put the **service_role** key in this app or in `.env`; it bypasses RLS.
