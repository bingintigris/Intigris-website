/* Converted from components/HomeSalesforce.jsx (classic Babel global) by scripts/convert-legacy.mjs */
import { tx } from '../../lib/i18n.js';
import { CK_STORIES, CkStyles, CkTalk } from './CloudKit.jsx';
import React from 'react';
import { Island } from './Island.jsx';
import { V3LogoHub, V3Styles } from './CloudKitV3.jsx';
import { StorySpotlight } from './StorySpotlight.jsx';
import { StartRolesCard, WtsStyles } from '../../components/home/WhereToStart.jsx';
import { CloudsChaos, CpStyles } from '../../components/home/CloudsPick.jsx';
import { WsStyles } from '../../components/home/WhyStack.jsx';
import { WhySettleBento, WsoStyles } from '../../components/home/WhySettle.jsx';
import { StoriesGalleryIndustry, SvStyles } from '../../components/home/StoriesVariants.jsx';
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
      {/* 2 · What we implement: concept A "Chaos to order" (chosen by Bing 2026-11-23), replaces the
             "A day at Havenwerk BV" platform island (islands/src/islands/PlatformMission.tsx, kept as inspiration) */}
      <CloudsChaos />
      {/* 3 · Integrations (approved on the Sales Cloud page); moved up below 'What we implement' by Bing 2026-11-24 */}
      <div className="hsf-int">
      <V3LogoHub center="Salesforce" head={{ eyebrow: tx('INTEGRATIONS', 'KOPPELINGEN'), a: tx('Connected to', 'Gekoppeld aan'), b: tx('everything you use.', 'alles wat je gebruikt.'),
        lede: tx('Salesforce gets stronger when it talks to the rest of your business. These are connections we build and maintain. Hover over a tool to see what it does.', 'Salesforce wordt sterker als het praat met de rest van je bedrijf. Dit zijn koppelingen die wij bouwen en onderhouden. Ga met je muis over een tool om te zien wat het doet.') }}
        items={HSF_INTEGRATIONS()} />
      </div>

      {/* 4 · Why Intigris: "We breathe Salesforce." scroll line along five reasons (chosen by Bing 2026-11-24);
             replaces "Where do you start?" (StartRolesCard, overlapped with section 2) */}
      {/* Bing 2026-11-24: plays once, then settles into the bento overview (round 4, B) */}
      <WhySettleBento />

      {/* 6 · How we work: TODO (variant round) */}

      {/* 7 · Customer stories: horizontal gallery with industry pills (C2, chosen by Bing 2026-11-24);
             replaces the StorySpotlight tabs (WeTransfer / EVBox / De Ridder). De Ridder is left out
             because its story is about FieldBuddy (Bing's rule). Starts on "All". */}
      <StoriesGalleryIndustry />

      {/* 8 · Why Intigris: TODO (variant round) */}

      {/* 9 · Talk to a person (approved) */}
      <CkTalk onCta={onCta} line={tx('30 minutes, and you know what Salesforce can do for you.', 'In 30 minuten weet je wat Salesforce voor jou kan doen.')} />
      <CkStyles />
      <V3Styles />
      <WtsStyles />
      <CpStyles />
      <WsStyles />
      <WsoStyles />
      <SvStyles />
    </React.Fragment>
  );
}

export { HSF_INTEGRATIONS, SiteSalesforceHome };
