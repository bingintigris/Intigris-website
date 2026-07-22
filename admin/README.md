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
- Placeholders + routing for the remaining modules (inquiries, newsletter, blog,
  HR, settings) — built next.

## Setup

### 1. Create a Supabase project
In the Supabase account you want to use, create a new project. Then:
- **SQL Editor → New query** → paste the contents of `supabase/schema.sql` → **Run**.
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
