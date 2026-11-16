# Plan: Move intigris.nl to Astro, then launch (deadline Fri 5 Dec 2026)

Approved by Bing on 2026-11-16.

## Context
The new intigris.nl is a static site where every visitor's browser compiles ~10,200 lines of React (Babel standalone + React development builds). Language is switched in the browser (`window.tx` / `?lang=nl`) and is lost on navigation. SEO basics are missing: no `/nl/` URLs, hreflang, canonical, sitemap or OG, and blog posts render client-side. 18 Nov is a soft date; **5 Dec is the hard deadline**. So we move to **Astro** before launch: one migration, faster pages, proper bilingual SEO, and the islands (Vite + React + TS + Tailwind) carry over 1:1. Launch = switching www.intigris.nl from Webflow to Netlify on **Thu 4 Dec** (Fri 5 Dec buffer).

Decisions (Bing, 2026-11-16):
- **Keep the live Webflow URL paths** (`/quickstarts/sales-cloud`, `/company`, `/careers`, `/blog-posts/<slug>`, `/cases/<slug>`, Dutch under `/nl/…`), so rankings and links survive with minimal redirects.
- **Blog + cases: migrate a hand-picked selection** (Bing picks from a list); the rest 301 to the blog / cases overview.
- **Blog posts and vacancies are pre-built pages** (from Supabase at build time); publishing in the admin portal triggers a Netlify rebuild (~1 min).
- **Keep /fluree** (rebuild the page). **ISA page exists but is switched off** (draft flag: not built, not in sitemap; `/isa` 301 → `/careers` until switched on).
- Product naming, proof numbers, informal "je", hero wording and approved designs stay as decided earlier.

## Target setup
- **Astro 5** (static output) + `@astrojs/react` + TypeScript + Tailwind (v3, same config/tokens as `islands/tailwind.config.js`) + `@astrojs/sitemap`. npm: `gsap@3.13` (all plugins), `lenis`, `@supabase/supabase-js`, plus `@lottiefiles/dotlottie-react` and `three` / `@react-three/fiber@8` / `@react-three/drei@9` only where used.
- **Location:** new folder `site/` in this repo (branch `astro`), so the current static site keeps deploying from the repo root until launch. `site/netlify.toml` (build `npm run build`, publish `dist`, redirects, headers).
- **Netlify:** a second Netlify site (e.g. `intigris-astro`, base directory `site`) for previews; at launch the domain moves to it. The old static site stays as rollback.
- **i18n:** Astro i18n routing, `defaultLocale: 'en'`, `locales: ['en','nl']`, no prefix for EN, `/nl/` for NL. One page component per page, rendered twice (EN route + `/nl/` route).
- **Language in components:** replace global `window.tx` / `window.__lang` with a `LangProvider` (React context) + `useTx()` hook; `tx(en, nl)` call sites stay the same (mechanical codemod). Static `.astro` text uses a `t(lang, en, nl)` helper.
- **Rendering:** pages render to HTML at build time; only interactive parts hydrate: header mega menu (`client:load`), contact sheet, newsletter, cookie consent, calculators, FAQ chat, story switcher, scroll scenes (`client:visible`). The contact sheet opens via an `open-contact` browser event instead of per-page `contactOpen` state.

## URL map (live Webflow → Astro route → current source)
| Route (EN; NL under `/nl/…`) | Source to port |
|---|---|
| `/` | `index.html` (AI/Salesforce toggle; Salesforce view = `components/HomeSalesforce.jsx`, Mission Control island) |
| `/services` | `Services.html` (+ `components/Services.jsx` `PRODUCTS`) |
| `/quickstarts` | `Quickstarts.html` |
| `/quickstarts/sales-cloud` | `SalesCloud.html` → `SalesCloudV3` (`CloudPagesV3.jsx`, `CloudKit*.jsx`, `SalesShowcase.jsx`, `StorySpotlight.jsx`) |
| `/quickstarts/field-service` | promote `FieldService-v3.html` (`FieldServiceV3`) |
| `/quickstarts/service-cloud` | `ServiceCloud.html` (`components/Quickstart.jsx`) |
| `/quickstarts/agentforce` | `Agentforce.html` |
| `/company` | `About.html` (Supabase `team_members`) |
| `/careers`, `/culture`, `/benefits`, `/vacancies`, `/vacancies/<slug>`, `/application-procedure` | careers group (`job_openings` pre-built; `job_applications` + `applications` bucket stay client-side) |
| `/isa` | `ISA.html`, **draft** (switched off) |
| `/blog`, `/blog-posts/<slug>` | `Blog.html` (Supabase `blog_posts`, pre-built) |
| `/cases`, `/cases/<slug>` | **new** (selected Webflow cases as an Astro content collection) |
| `/contact` | **new** page around the `ContactSheet.jsx` form |
| `/fluree` | **new** port of the live Webflow page |
| `/industries`, `/ai-readiness-scan`, `/privacy`, `/cookies` | `Industries.html`, `AIReadinessScan.html`, `Privacy.html`, `Cookies.html` |
| `/fieldbuddy` | **new** FieldBuddy page (after launch-critical work) |

Not migrated: the 21 design-round / preview pages (`*Variations.html`, `ConceptBoards.html`, `IslandsTest.html`, `SalesCloud-A/B/-2026-09`, `FieldService-A/B`, `*-preview(s).html`); they stay in git history.

## Phases
**Phase 0 — prerequisites (Bing, day 1)**
- Work in a Claude Code session **with internet** (normal terminal chat, not a background job).
- Push pending commits on `homepage-salesforce`; merge PR #3 or keep it as the source for porting.
- Create the second Netlify site (base dir `site`), add env vars `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY`, and create a Netlify **build hook** for admin publishing.

**Phase 1 — foundation (16–19 Nov)**
- Scaffold `site/`, copy `design-system/` CSS + fonts (Inter Tight TTF → WOFF2), `assets/`, `legal/`, `one-pagers/` to `site/public` (images via `astro:assets` where possible).
- `Layout.astro`: head (title, description, canonical, hreflang EN/NL + x-default, OG/Twitter, favicon), header, footer, newsletter, cookie consent (GA4 only after consent), contact sheet island.
- Convert shared components to ES modules (`Header`, `Footer`, `Newsletter`, `ContactSheet`, `CookieConsent`, `Services`, `Quickstart`, `CloudKit`, `CloudKitV3`, `StorySpotlight`, `SalesShowcase`); `Island.jsx` goes away (islands become normal imports). Guard top-level `window` use (`matchMedia`, `GA4_MEASUREMENT_ID`, `__lang`).
- Every `*.html` link and `onClick` navigation becomes a real locale-aware `<a href>`. Language switcher maps to the same page in the other language.
- Move `islands/src/islands/*` into `site/src/components/islands/`; GSAP/Lenis from npm (one instance).
- Verify the Webflow CMS export of NL fields early via the Webflow connector.

**Phase 2 — port pages (19–25 Nov)** in this order: home (both views) → Sales Cloud → Field Service (v3) → Service Cloud → Agentforce → Quickstarts → Services → Contact → About → careers group (+ vacancy pages) → Industries → AI Readiness Scan → Privacy/Cookies → Fluree → ISA (draft). Inline page code from the `.html` files moves to `site/src/components/pages/<Page>.tsx`. Each page checked against the current version in EN and NL.

**Phase 3 — homepage sections + content (23–28 Nov)**
- Finish homepage Salesforce view: 4 "Waar wil je beginnen?", 6 "Hoe we werken", 8 "Waarom Intigris" (+ Summit badge). One focused design round each.
- Blog/cases: export the full list (titles, dates, EN/NL) from Webflow → **Bing ticks the ones to keep** → import selected posts into Supabase `blog_posts` (add nullable `lang` + `translation_key` columns; small admin editor change) and selected cases into `src/content/cases/`. Re-host images (Webflow CDN links die at switch-over).
- Blog + vacancy pages built from Supabase at build time; admin "Publish" calls the build hook.

**Phase 4 — redirects + SEO (26–30 Nov)**
- `_redirects`: old new-site URLs (`/SalesCloud.html` etc.), non-selected blog posts → `/blog` (`/nl/blog`), non-selected cases → `/cases`, `/isa` → `/careers`, 2023 WordPress→Webflow rules + the current Webflow 301 list (targets rewritten to avoid chains).
- SEO: per-page titles + meta descriptions (from Webflow page SEO where pages match), canonical, hreflang, OG images, sitemap, `robots.txt`, noindex on preview builds.

**Phase 5 — QA + launch (30 Nov–5 Dec)**
- Full check on the Netlify preview, Frank review, fixes.
- **3 Dec:** lower DNS TTL. **4 Dec:** point www.intigris.nl to the new Netlify site, HTTPS check, submit sitemap in Search Console, watch 404s for 48 h. **5 Dec:** buffer. Rollback = point DNS back to Webflow.

## Reuse (don't rebuild)
`CloudPagesV3.jsx`, `CloudKit.jsx` (`CkHead`, `CkTalk`, `CK_STORIES`), `CloudKitV3.jsx` (`V3LogoHub`, `V3Statement`, `V3FaqChat`, `useGsap`), `StorySpotlight.jsx`, `SalesShowcase.jsx`, `HomeSalesforce.jsx`, `islands/src/islands/PlatformMission.tsx` + `platform/*`, `islands/src/lib/cn.ts`, brand tokens in `islands/tailwind.config.js`, Supabase schema/RLS in `admin/supabase/*.sql`, blog markdown renderer in `admin/src/lib/blog.js`.

## Risks
- Biggest effort: removing `window` globals + per-component `tx` codemod across 33 components and ~3,000 lines of inline page code. Mitigation: port the shared kit first, then pages one by one, each verified.
- Blog schema change touches the admin portal: keep it backward compatible (nullable columns).
- Webflow NL (localized) CMS export: verify in Phase 1.

## Verification
- `npm run build` + `astro check` pass; no console errors on any page.
- Visual parity screenshots per page, EN + NL, 1440px + phone width; scroll scenes (Mission Control, "Stop met" lock, logo hub) tested with real scrolling.
- Redirect script: all 129 live Webflow URLs + old `.html` URLs → 200 or one 301 to the right target.
- Forms: contact, newsletter, job application insert into Supabase; CV upload works.
- SEO: hreflang/canonical on every page, sitemap lists EN+NL, `/isa` absent.
- Lighthouse performance ≥ 90 desktop on home + Sales Cloud; no Babel/React dev builds shipped.
- Admin publish → build hook → post live within ~2 minutes.
