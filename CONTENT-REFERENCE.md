# Content Reference — current live site (intigris.nl)

The current live site is **https://www.intigris.nl** (Webflow). It's the **content
source** for the new site. When building a new page, pull the substance from the
matching live page — then make it *a lot better* in structure, copy, and design.
Always apply the brand book + `design-system/DESIGN-DIRECTION.md` (hybrid dark/light,
coral accent, pill-arrow CTAs, Inter Tight, "seriously playful" tone).

Mandate: **same substance, far better execution.** Don't copy Webflow layouts —
reimagine them to the new design direction.

## Page inventory (live URLs to pull from)

- Home — https://www.intigris.nl/
- Services — https://www.intigris.nl/services
- Quickstarts — https://www.intigris.nl/quickstarts
- Cases — https://www.intigris.nl/cases
- Blog — https://www.intigris.nl/blog
- About Us / Company — https://www.intigris.nl/company
- Contact — https://www.intigris.nl/contact
- **Careers** (not yet built in the new site):
  - Overview — https://www.intigris.nl/careers
  - Vacancies — https://www.intigris.nl/vacancies
  - Our culture — https://www.intigris.nl/culture
  - Benefits — https://www.intigris.nl/benefits
  - ISA (Intigris Salesforce Academy) — https://www.intigris.nl/isa
  - Application Procedure — https://www.intigris.nl/application-procedure

## Key facts / boilerplate (from the live home page)

- Positioning: "Salesforce Implementation Partner since 2010." Payoff: **"Smarten
  up your business."**
- Services offered: Salesforce Consulting, Integration Development, Field Service
  Consulting (Salesforce Field Service / FieldBuddy), SF App Development,
  Technical Support. Also Quickstarts.
- Value props: Best Quality · On-Time Delivery · Continuous Support.
- "We breathe Salesforce" — certified team, Salesforce partner since 2010.
- Reference customers (logos): WeTransfer, Opcharge, Alpha Ventilatie, ATAG Warmte,
  Ebusco. (New site's home already uses others — reconcile when relevant.)
- Contact: +31 20 624 0027 · info@intigris.nl · Kraanspoor 42, 1033 SE Amsterdam.
- Social: linkedin.com/company/intigris, twitter.com/intigris.

### Company identifiers (verified, use these verbatim)

- **KvK 50050168** — the Chamber of Commerce number.
- **VAT NL822520072B01** — the BTW number.
- **RSIN 822520072** — the fiscal number the VAT number is built from.
- **Kraanspoor 42, 1033 SE Amsterdam** — note SE, not ES.

Two traps worth knowing, because both have already caused an error:

1. A Dutch BV's VAT number is derived from the **RSIN**, not the KvK number.
   Do not shorten 822520072 into an 8-digit "KvK 82252007". That number does
   not exist; it is the RSIN with its last digit removed.
2. The company letterhead in the old PDFs is correct (1033 SE, KvK 50050168),
   but the typed contact blocks inside those same PDFs say "1033 ES". The
   letterhead wins.
- Legal docs (PDFs on the live CDN): Terms & Conditions (NLdigital), Privacy
  Policy, Cookie Policy.

## Notes

- Site is bilingual EN/NL — new pages must support `window.tx('EN','NL')`.
- Testimonials exist on the live site (Opcharge, Alpha Ventilatie, ATAG, WeTransfer)
  with named quotes — reuse/refresh these for social proof.
- When asked for a page, fetch the specific live URL(s) above for current copy
  before building.
