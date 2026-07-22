# Intigris — Design Direction

Visual direction for the Intigris website. Follow this on every existing page and
every new page/component. It sits on top of `colors_and_type.css` (the token source
of truth) and `site.css` — don't contradict those tokens, extend them.

## Inspiration

Built referencing the **Folioblox / Frameblox** portfolio template: dark-first,
warm-orange accented, bold display type, rounded cards, pill buttons with a
circular arrow. The Intigris brand coral (`#ff5f36`) already matches that orange,
and Inter Tight already gives us the bold, tight-set display headings — so the
inspiration layers cleanly onto the existing brand system.

## Theme model — HYBRID per section

The site is **not** uniformly light or dark. Compose pages by alternating section
themes for rhythm, the way the current home page already does:

- **Dark sections** (`theme-brown` / near-black) — heroes, feature statements,
  pricing highlight, contact/CTA. This is where the inspiration's mood lives:
  near-black background, warm orange gradient photography, orange eyebrows.
- **Light sections** (default off-white) — content-heavy blocks, client stories,
  long-form copy, anything that needs comfortable reading.
- Aim for a dark hero → light content → dark CTA cadence. Don't stack many light
  or many dark sections back-to-back.

Use the existing theme classes rather than hardcoding: `.theme-brown` for dark,
default for light, `.theme-coral` / `.theme-green` for occasional accent panels.

## Palette — LOCKED to the brand book (Brandbook_Intigris_2023 p.13)

These six hexes are the entire palette. Do not introduce colors outside this set;
the tints/ramps in `colors_and_type.css` are the only allowed derivations.

| Role | Hex | Token |
|------|-----|-------|
| Dark brown (primary ink) | `#402301` | `--intigris-dark-brown` |
| Chocolate brown | `#6c2a05` | `--intigris-chocolate` |
| Coral red (accent) | `#ff5f36` | `--intigris-coral` |
| Soft blue | `#9ab8e2` | `--intigris-soft-blue` |
| Washed green | `#4c693a` | `--intigris-washed-green` |
| Off-white (main bg) | `#fcf7eb` | `--intigris-off-white` |

(The brand book prints the soft-blue RGB as 154,104,226 — a typo; the hex
`#9ab8e2` is authoritative and is what the CSS uses.)

**Colour-use ratios (brand book p.15) — respect these across a page:**
off-white ~50% (dominant), coral ~20%, chocolate ~10%, soft blue ~10%,
washed green ~10%.

- Accent: coral `#ff5f36` — eyebrows, gradients, active states, the highlighted
  pricing card, button fills. Used deliberately, not everywhere (~20%).
- Dark statement surfaces: build from `--intigris-chocolate` / `--intigris-dark-brown`
  (deepest: `--intigris-brown-700` `#2b1700`). Interpret the inspiration's
  "near-black" as the brand's dark browns — NOT pure `#000`.
- Light surfaces: `--intigris-off-white` `#fcf7eb` base, `--intigris-paper` cards.
  This is the site's dominant background per the brand book.
- Orange gradient heroes: warm-lit / duotone photography fading into a dark-brown
  background (radial or linear coral→transparent→dark-brown overlay).

## Type — Inter Tight, three weight roles (brand book p.16–19)

Weight carries meaning; don't use weights for arbitrary emphasis.

- **Bold (700) — quotes only.** Reserve bold for pull-quotes / statement quotes.
- **Medium (500) — titles.** Headings and display type. This is the most-used
  weight. Tight tracking (`--tracking-tight`), minimal line height (`--lh-tight`).
- **Light (300) — navigation and body text** by brand-book default.
- Section labels ("eyebrows"): uppercase, letter-spaced, **coral**, small
  (pattern in components as `.eyebrow`).
- Legibility override: on dark surfaces, don't drop body below weight 400 or
  below ~85% ink opacity (see the footer fix) — thin light text on dark reads
  poorly. Readability wins over the strict "light body" default on dark panels.
- "Line spacing is always minimal" (brand book) — favor tight line heights.

## Tone of voice (brand book p.04)

"Seriously playful" — slightly cheeky, confident, human, never cold-corporate.
Signature lines: "Smarten up your business.", "We got you.", "We design systems
so you can move forward.", "Level with like-minded." Keep copy warm and direct,
in both EN and NL.

## Signature components

- **Pill button with circular arrow** — the inspiration's hallmark CTA: a pill
  (`--radius-pill`) with a filled coral circle holding a `→` on the right. Reuse
  the existing `.btn` / `.arrow` pattern; keep the circular-arrow affordance.
- **Rounded cards** — generous corners. Use `--radius-xl` (24px) for feature and
  media cards, `--radius-lg` (14px) for smaller UI. Dark cards on dark bg get a
  subtle hairline border (`rgba(252,247,235,0.16)`).
- **Numbered feature rows** — `#01 #02 #03 #04` with short labels, as in the hero.
- **Pricing** — three tiers, the middle one highlighted with a solid coral card.
- **Media grids** — clean 2–3 column image grids with rounded corners and a small
  label + circular "view" arrow per item.

## Rules for new pages

1. Start from a dark hero with an orange gradient + bold display headline + eyebrow.
2. Alternate section themes (dark/light) for rhythm.
3. Reuse tokens and existing component patterns; never hardcode hex values that a
   token already covers.
4. Keep the pill-arrow button as the primary CTA everywhere.
5. Support EN/NL via `window.tx('English', 'Nederlands')` like existing components.
6. Register new component `.jsx` files in `index.html` with the shared `?v=` tag.
