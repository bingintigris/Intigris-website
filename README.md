# Intigris website (www.intigris.nl)

Code lives on Bing's Mac in `~/Projects/intigris-website` and on GitHub
(`bingintigris/Intigris-website`). Never on Google Drive (Drive sync locks break git).
Documents and image masters live on the shared Drive:
`Sales & Marketing/05 Intigris Website/` (see its `_CONTEXT.md` for the file map).

## What's where
| Folder | What |
|---|---|
| `site/` | The website (Astro). EN pages + `/nl/`. Netlify builds this folder. |
| `site/src/` | Pages, layouts, components. `src/legacy/` = the converted page code (edit here). |
| `site/public/` | Files served as-is: `assets/` (images), `legal/` (terms PDFs), `one-pagers/` (downloads), `design-system/` (CSS + fonts), `islands-dist/` (built islands). |
| `site/islands/` | Source of the interactive "islands" (Vite + React + TS + Tailwind). `npm run build` there writes to `site/public/islands-dist/`. |
| `admin/` | Admin portal (Vite + React + Supabase), its own Netlify site. Start: `start-admin-portal.command`. |
| `docs/` | Plans, design direction, content reference, legal file names. |

## Workflow
1. Work on a branch (never directly on `main`).
2. Preview: double-click `start-preview.command` → http://localhost:8003
   Design review (new section variants A/B/C to choose from): double-click `start-design-review.command` → http://localhost:8004
3. Push: double-click `push-to-github.command` (pushes the branch, shows the pull-request link).
4. Bing merges the pull request on GitHub → Netlify publishes `main` to intigris.netlify.app
   (and to www.intigris.nl after the DNS switch on 4 Dec 2026).

## Files with a master on Drive
When one of these changes, replace the file in `site/public/` with the same name:
- `legal/NLdigital-Terms-EN.pdf`, `legal/NLdigital-Voorwaarden-NL.pdf` ← `03 Brand & Templates/Company info/`
- `one-pagers/Intigris-Agentforce-Kickstart.pdf` ← `01 Initiatives/Agentforce Kickstart/01 Sales material/Intigris Agentforce Kickstart.pdf`
- `one-pagers/Intigris-AI-readiness-scan.pdf` ← `01 Initiatives/AI Readiness Scan/01 Sales material/2026-08_AIReadinessScan_One-pager_v01.pdf`
- `assets/**` images ← `05 Intigris Website/01 New website (2026 redesign)/02 Assets & Media/` (high-res originals in `Originals (high-res)/`)

The old static HTML site (before Astro) is kept in git under tag `old-static-site-2026-11`.
