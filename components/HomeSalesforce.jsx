/* ==================================================================== */
/*  HOMEPAGE · SALESFORCE SOLUTIONS view (index.html, mode = salesforce)   */
/*  Built section by section with Bing (plan 2026-11-09):                  */
/*    1 Hero (unchanged, in Hero.jsx) · 2 Proof strip · 3 The platform ·    */
/*    4 Where do you start · 5 Integrations · 6 How we work ·               */
/*    7 Customer stories · 8 Why Intigris · 9 Talk to a person              */
/*  Sections marked TODO are chosen in a variant round first               */
/*  (HomeSfVariations.html) and then added here.                           */
/*  Facts: partner profile numbers (300+ projects, 4.5/5, 25+ certified,  */
/*  since 2010, Summit partner since 2026); only real customers/quotes.   */
/* ==================================================================== */

const HSF_INTEGRATIONS = () => [
  { n: 'Exact Online / Globe', k: 'ERP', d: tx('Customers, orders and invoices in sync.', 'Klanten, orders en facturen in sync.') },
  { n: 'AFAS', k: 'ERP', d: tx('Relations and financial data both ways.', 'Relaties en financiële data in twee richtingen.') },
  { n: 'Business Central', k: 'ERP', d: tx('Orders to invoices without retyping.', 'Orders naar facturen zonder overtypen.') },
  { n: 'NetSuite', k: 'ERP', d: tx('Order-to-cash, as built for WeTransfer.', 'Order-to-cash, zoals voor WeTransfer gebouwd.') },
  { n: 'Outlook & Gmail', k: tx('Mail & calendar', 'Mail & agenda'), d: tx('Mails and meetings logged automatically.', 'Mails en afspraken automatisch vastgelegd.') },
  { n: 'PDF Butler', k: tx('Documents', 'Documenten'), d: tx('Quotes, contracts and work orders as PDF, straight from Salesforce.', 'Offertes, contracten en werkbonnen als pdf, direct vanuit Salesforce.') },
  { n: 'DocuSign', k: tx('E-signing', 'Digitaal tekenen'), d: tx('Signed online; the record updates itself.', 'Online getekend; het record werkt zichzelf bij.') },
  { n: 'Twinfield', k: tx('Accounting', 'Boekhouding'), d: tx('Won deals and finished jobs become invoices.', 'Gewonnen deals en afgeronde klussen worden facturen.') },
];

function SiteSalesforceHome({ onCta }) {
  const S = CK_STORIES();
  return (
    <React.Fragment>
      {/* 2 · Proof strip: TODO (variant round) */}
      {/* 3 · The platform: TODO (variant round) */}
      {/* 4 · Where do you start: TODO (variant round) */}

      {/* 5 · Integrations (approved on the Sales Cloud page) */}
      <V3LogoHub center="Salesforce" head={{ eyebrow: tx('INTEGRATIONS', 'KOPPELINGEN'), a: tx('Connected to', 'Gekoppeld aan'), b: tx('everything you use.', 'alles wat je gebruikt.'),
        lede: tx('Salesforce gets stronger when it talks to the rest of your business. These are connections we build and maintain. Hover over a tool to see what it does.', 'Salesforce wordt sterker als het praat met de rest van je bedrijf. Dit zijn koppelingen die wij bouwen en onderhouden. Ga met je muis over een tool om te zien wat het doet.') }}
        items={HSF_INTEGRATIONS()} />

      {/* 6 · How we work: TODO (variant round) */}

      {/* 7 · Customer stories (approved) */}
      <StorySpotlight variant="pills" head={{ eyebrow: tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN'), a: tx('Teams that run on it.', 'Teams die erop draaien.'), b: '',
        lede: tx('What we built, in their own words. Pick a company or let it play.', 'Wat we bouwden, in hun eigen woorden. Kies een bedrijf of laat het vanzelf lopen.') }}
        stories={[S.wetransfer, S.evbox, S.ridder]} />

      {/* 8 · Why Intigris: TODO (variant round) */}

      {/* 9 · Talk to a person (approved) */}
      <CkTalk onCta={onCta} line={tx('30 minutes, and you know what Salesforce can do for you.', 'In 30 minuten weet je wat Salesforce voor jou kan doen.')} />
      <CkStyles />
      <V3Styles />
    </React.Fragment>
  );
}

Object.assign(window, { SiteSalesforceHome, HSF_INTEGRATIONS });
