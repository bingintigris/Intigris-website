/* ==================================================================== */
/*  SALES CLOUD v3 and FIELD SERVICE v3 — the service pages (round 3).   */
/*  The page is about the whole cloud; the Quickstart is one "way to     */
/*  start" near the bottom (land and expand). Uses CloudKit + CloudKitV3. */
/*  Exposes window.SalesCloudV3 and window.FieldServiceV3.               */
/* ==================================================================== */

/* ---------------- SALES CLOUD ---------------- */
const sc3 = {
  chaos: () => [
    { kind: 'note', x: 2, y: 4, r: -6, label: 'Post-it', text: tx('Call Havenwerk back!!', 'Havenwerk terugbellen!!') },
    { kind: 'mail', x: 52, y: 0, r: 4, label: tx('Inbox', 'Inbox'), text: 'RE: RE: FW: offerte v3 FINAL' },
    { kind: 'sheet', x: 60, y: 62, r: -3, label: 'Excel', text: 'pipeline_Q4_def_DEF(2).xlsx' },
    { kind: 'chat', x: 4, y: 64, r: 5, label: 'WhatsApp', text: tx('Did anyone speak to Kade?', 'Heeft iemand Kade al gesproken?') },
    { kind: 'card', x: 30, y: 82, r: -4, label: tx('Business card', 'Visitekaartje'), text: tx('Noor, procurement · met at the fair', 'Noor, inkoop · gesproken op de beurs') },
    { kind: 'note', x: 70, y: 30, r: 7, label: 'Post-it', text: tx('Discount 15%?? ask Iris', 'Korting 15%?? Iris vragen') },
  ],
  record: () => ({ initial: 'H', name: 'Havenwerk BV', stage: tx('Quote · 60%', 'Offerte · 60%'),
    rows: [[tx('Next step', 'Volgende stap'), tx('Call back Thursday 10:00', 'Donderdag 10:00 terugbellen')], [tx('Contacts', 'Contactpersonen'), tx('Noor (procurement), Daan (ops)', 'Noor (inkoop), Daan (operatie)')], [tx('Open deal', 'Open deal'), tx('€ 24k · quote v3 sent', '€ 24k · offerte v3 verstuurd')], [tx('Discount', 'Korting'), tx('15% approved by Iris', '15% goedgekeurd door Iris')], [tx('Last activity', 'Laatste activiteit'), tx('Mail from Noor, today', 'Mail van Noor, vandaag')]] }),
  benefits: () => [
    { t: tx('One view of every customer', 'Eén beeld van elke klant'), d: tx('Accounts, contacts, activity and history in one place. No more asking three people what happened last.', 'Accounts, contactpersonen, activiteit en historie op één plek. Nooit meer drie mensen vragen wat er laatst gebeurde.') },
    { t: tx('A pipeline you can trust', 'Een pipeline waar je op kunt bouwen'), d: tx('Every deal has a stage, an owner and a next step. Forecasts stop being a Friday-afternoon guess.', 'Elke deal heeft een fase, een eigenaar en een volgende stap. Forecasts zijn geen vrijdagmiddaggok meer.') },
    { t: tx('Less admin, more selling', 'Minder admin, meer verkopen'), d: tx('Automatic activity capture, guided steps and approvals that route themselves.', 'Automatische vastlegging van activiteit, begeleide stappen en goedkeuringen die vanzelf lopen.') },
    { t: tx('Reports that answer questions', 'Rapporten die antwoord geven'), d: tx('Dashboards for reps, managers and the board, built on the same numbers.', 'Dashboards voor verkopers, managers en directie, op dezelfde cijfers.') },
    { t: tx('Grows with you', 'Groeit met je mee'), d: tx('Start with leads and opportunities. Add quoting, integrations, territories and AI when you are ready.', 'Begin met leads en opportunities. Voeg offertes, koppelingen, regio\'s en AI toe wanneer je er klaar voor bent.') },
  ],
  steps: () => [
    { t: tx('Capture leads', 'Leads binnenhalen'), d: tx('Web forms, mail and events land in one queue.', 'Webformulieren, mail en events komen in één wachtrij.') },
    { t: tx('Know the account', 'Ken het account'), d: tx('Contacts, history and open cases on one record.', 'Contactpersonen, historie en open cases op één kaart.') },
    { t: tx('Run the pipeline', 'Stuur de pipeline'), d: tx('Your own stages with a clear next step.', 'Je eigen fases met een duidelijke volgende stap.') },
    { t: tx('Forecast', 'Forecast'), d: tx('Commit and best case, rolled up per team.', 'Commit en best case, per team opgeteld.') },
    { t: tx('Quote & approve', 'Offreren & akkoord'), d: tx('Quotes from the opportunity, approvals automatic.', 'Offertes uit de opportunity, akkoord automatisch.') },
    { t: tx('See what works', 'Zie wat werkt'), d: tx('Win rate and cycle time on live dashboards.', 'Winratio en doorlooptijd op live dashboards.') },
  ],
  integrations: () => [
    { n: 'Exact Online / Globe', k: 'ERP', d: tx('Customers, orders and invoices in sync.', 'Klanten, orders en facturen in sync.') },
    { n: 'AFAS', k: 'ERP', d: tx('Relations and financial data both ways.', 'Relaties en financiële data in twee richtingen.') },
    { n: 'Business Central', k: 'ERP', d: tx('Orders to invoices without retyping.', 'Orders naar facturen zonder overtypen.') },
    { n: 'NetSuite', k: 'ERP', d: tx('Order-to-cash, as built for WeTransfer.', 'Order-to-cash, zoals voor WeTransfer gebouwd.') },
    { n: 'Outlook & Gmail', k: tx('Mail & calendar', 'Mail & agenda'), d: tx('Mails and meetings logged automatically.', 'Mails en afspraken automatisch vastgelegd.') },
    { n: 'PDF Butler', k: tx('Documents', 'Documenten'), d: tx('Quotes and contracts generated straight from the opportunity.', 'Offertes en contracten direct vanuit de opportunity.') },
    { n: 'DocuSign', k: tx('E-signing', 'Digitaal tekenen'), d: tx('Quotes signed online; the deal updates itself.', 'Offertes online getekend; de deal werkt zichzelf bij.') },
    { n: 'Twinfield', k: tx('Accounting', 'Boekhouding'), d: tx('Won deals become invoices in your accounting.', 'Gewonnen deals worden facturen in je boekhouding.') },
  ],
  faq: () => [
    { label: tx('Cost', 'Kosten'), q: tx('What does a Sales Cloud implementation cost?', 'Wat kost een Sales Cloud-implementatie?'), a: tx('It depends on scope. The Quickstart is a fixed package from €7,000 excluding VAT to get started. A full implementation with integrations and migration is scoped after a short analysis, so you get a number you can plan on. Salesforce licences are billed separately by Salesforce.', 'Dat hangt af van de scope. De Quickstart is een vast pakket vanaf € 7.000 excl. btw om te starten. Een volledige implementatie met koppelingen en migratie scopen we na een korte analyse, zodat je een bedrag krijgt waar je op kunt plannen. Salesforce-licenties lopen apart via Salesforce.') },
    { label: tx('Time', 'Tijd'), q: tx('How long does it take?', 'Hoe lang duurt het?'), a: tx('The Quickstart is live in four weeks. Full implementations usually take eight to sixteen weeks, delivered in sprints, so you see working software every two weeks.', 'De Quickstart staat in vier weken live. Volledige implementaties duren meestal acht tot zestien weken, in sprints, zodat je elke twee weken werkende software ziet.') },
    { label: tx('Adoption', 'Adoptie'), q: tx('Will my team actually use it?', 'Gaat mijn team het echt gebruiken?'), a: tx('We build around how your team sells today, train your key users and check usage 30, 60 and 90 days after go-live.', 'We bouwen rond hoe je team nu verkoopt, trainen je sleutelgebruikers en checken het gebruik 30, 60 en 90 dagen na livegang.') },
    { label: tx('Data & ERP', 'Data & ERP'), q: tx('Can you move our data and connect our ERP?', 'Kunnen jullie onze data overzetten en ons ERP koppelen?'), a: tx('Yes. We migrate from spreadsheets, HubSpot or Dynamics, and connect Sales Cloud to Exact, AFAS, Business Central and NetSuite.', 'Ja. We migreren vanuit spreadsheets, HubSpot of Dynamics, en koppelen Sales Cloud aan Exact, AFAS, Business Central en NetSuite.') },
    { label: tx('Why Intigris', 'Waarom Intigris'), q: tx('Why Salesforce, and why you?', 'Waarom Salesforce, en waarom jullie?'), a: tx('Salesforce grows from five reps to five hundred, with AI built in when you are ready. We have implemented it since 2010 as a Summit partner, with senior consultants from Amsterdam. Everything is built in your own org: no lock-in.', 'Salesforce groeit mee van vijf naar vijfhonderd verkopers, met AI erin als je eraan toe bent. Wij implementeren het sinds 2010 als Summit-partner, met senior consultants uit Amsterdam. Alles staat in je eigen org: geen lock-in.') },
  ],
  /* Calculator: the visitor sets every assumption; defaults are deliberately cautious. */
  calc: () => ({
    head: { eyebrow: tx('WORK IT OUT', 'REKEN HET UIT'), a: tx('What is less admin', 'Wat levert minder admin'), b: tx('worth to you?', 'jou op?'), lede: tx('Your numbers, your assumptions. Every slider is yours to set; the defaults are on the cautious side.', 'Jouw cijfers, jouw aannames. Elke schuif stel je zelf in; de standaardwaarden zijn voorzichtig gekozen.') },
    inputs: [
      { id: 'reps', label: tx('Sales people', 'Verkopers'), v: 6, min: 1, max: 50 },
      { id: 'admin', label: tx('Hours of admin per person per week', 'Uur admin per persoon per week'), v: 8, min: 1, max: 20, hint: tx('Logging calls, updating spreadsheets, chasing information, building reports.', 'Gesprekken vastleggen, spreadsheets bijwerken, informatie zoeken, rapporten bouwen.') },
      { id: 'share', label: tx('Share of that admin Sales Cloud takes over', 'Deel van die admin dat Sales Cloud overneemt'), v: 25, min: 5, max: 60, step: 5, fmt: v => v + '%', hint: tx('Cautious default: 25%. Ask us what we see at comparable customers.', 'Voorzichtige standaard: 25%. Vraag ons wat we bij vergelijkbare klanten zien.') },
      { id: 'rate', label: tx('Cost of an hour of a sales person', 'Kosten van een uur van een verkoper'), v: 60, min: 30, max: 150, step: 5, fmt: v => '€ ' + v },
    ],
    compute: (v) => { const hours = v.reps * v.admin * (v.share / 100) * 46; return { euro: hours * v.rate, label: tx('Time back per year, in euros', 'Tijd terug per jaar, in euro'), line: (f) => tx(f(hours) + ' hours a year back for selling (46 working weeks).', f(hours) + ' uur per jaar terug voor verkopen (46 werkweken).') }; },
    note: tx('Sales people × admin hours × share taken over × 46 weeks × hourly cost. Time only; extra deals from better follow-up are not counted.', 'Verkopers × uren admin × overgenomen deel × 46 weken × uurkosten. Alleen tijd; extra deals door betere opvolging tellen niet mee.'),
  }),
};

function SalesCloudV3({ onCta }) {
  useReveal();
  const S = CK_STORIES();
  return (
    <main style={{ background: 'var(--intigris-off-white)' }}>
      <CkProgress />
      <V3ChaosHero eyebrow={tx('SALES CLOUD · NOW AGENTFORCE SALES', 'SALES CLOUD · NU AGENTFORCE SALES')}
        a={tx('All your clients and deals,', 'Al je klanten en deals,')} b={tx('in one pipeline.', 'in één pipeline.')}
        lede={tx('Salesforce Sales Cloud is the CRM where your team keeps every lead, customer, deal and forecast. No more post-its, inboxes and spreadsheets that only one person understands. We implement it, connected to the systems you already use.', 'Salesforce Sales Cloud is het CRM waarin je team elke lead, klant, deal en forecast bijhoudt. Geen post-its, inboxen en spreadsheets meer die maar één persoon snapt. Wij implementeren het, gekoppeld aan de systemen die je al gebruikt.')}
        onCta={onCta} secondary={{ href: '#start', label: tx('Ways to start', 'Manieren om te starten') }} chaos={sc3.chaos()} record={sc3.record()} />
      <V3WhatItIs head={{ eyebrow: tx('WHAT IT IS', 'WAT HET IS'), a: tx('The CRM your sales team', 'Het CRM waar je salesteam'), b: tx('runs on.', 'op draait.') }} label={tx('With Sales Cloud', 'Met Sales Cloud')} benefits={sc3.benefits()} image="assets/glass-facade-clouds.jpg" />
      <V3SalesShowcase head={{ eyebrow: tx('FROM LEAD TO CLOSED DEAL', 'VAN LEAD TOT GESLOTEN DEAL'), a: tx('Six steps.', 'Zes stappen.'), b: tx('One system.', 'Eén systeem.'), lede: tx('Click a step to see what it looks like in Salesforce.', 'Klik op een stap en zie hoe het eruitziet in Salesforce.') }} />
      <V3Statement lead={tx('Stop', 'Stop met')} words={[
        { w: tx('guessing.', 'gokken.'), d: tx('One forecast, built from the deals themselves.', 'Eén forecast, opgebouwd uit de deals zelf.') },
        { w: tx('retyping.', 'overtypen.'), d: tx('Mail, calendar and quotes logged automatically.', 'Mail, agenda en offertes automatisch vastgelegd.') },
        { w: tx('searching.', 'zoeken.'), d: tx('The whole customer on one screen, also on your phone.', 'De hele klant op één scherm, ook op je telefoon.') },
        { w: tx('losing deals.', 'deals verliezen.'), d: tx('An alert when a deal stalls, before it dies quietly.', 'Een seintje als een deal stilvalt, voordat hij doodgaat.') },
      ]} />
      {/* Six-steps line replaced by the tabbed showcase above (same six steps, with Salesforce screens). To bring it back:
          <CkStepsLine head={{ eyebrow: tx('FROM LEAD TO CLOSED DEAL', 'VAN LEAD TOT GESLOTEN DEAL'), a: tx('Six steps.', 'Zes stappen.'), b: tx('One system.', 'Eén systeem.') }} steps={sc3.steps()} /> */}
      <V3LogoHub center="Sales Cloud" head={{ eyebrow: tx('A FULL IMPLEMENTATION', 'EEN VOLLEDIGE IMPLEMENTATIE'), a: tx('Connected to', 'Gekoppeld aan'), b: tx('everything you use.', 'alles wat je gebruikt.'), lede: tx('Sales Cloud gets stronger when it talks to the rest of your business. These are connections we build and maintain. Hover over a tool to see what it does.', 'Sales Cloud wordt sterker als het praat met de rest van je bedrijf. Dit zijn koppelingen die wij bouwen en onderhouden. Ga met je muis over een tool om te zien wat het doet.') }} items={sc3.integrations()} />
      <V3WaysToStart head={{ eyebrow: tx('TWO WAYS TO START', 'TWEE MANIEREN OM TE STARTEN'), a: tx('Start small,', 'Begin klein,'), b: tx('or go all the way.', 'of ga voor het geheel.') }} onCta={onCta}
        quick={{ eyebrow: 'QUICKSTART', title: tx('Live in four weeks.', 'Live in vier weken.'), price: tx('from €7,000', 'vanaf € 7.000'), priceNote: tx('fixed scope, excl. VAT', 'vaste scope, excl. btw'), d: tx('A basic Sales Cloud to get up and running fast. Expand when you are ready; nothing is redone.', 'Een basis-Sales Cloud om snel van start te gaan. Uitbreiden wanneer je er klaar voor bent; niets wordt overgedaan.'),
          items: [tx('Leads, accounts, contacts, opportunities', 'Leads, accounts, contactpersonen, opportunities'), tx('Up to 3 reports and 1 dashboard', 'Tot 3 rapporten en 1 dashboard'), tx('Training and go-live support', 'Training en livegang-support')], cta: tx('Start with the Quickstart', 'Start met de Quickstart') }}
        full={{ eyebrow: tx('FULL IMPLEMENTATION', 'VOLLEDIGE IMPLEMENTATIE'), title: tx('Designed around you.', 'Ontworpen rond jou.'), d: tx('For teams with integrations, several business units, quoting rules or a migration. Blueprint first, then delivered in sprints.', 'Voor teams met koppelingen, meerdere business units, offerteregels of een migratie. Eerst de blauwdruk, daarna in sprints opgeleverd.'),
          items: [tx('ERP and finance integration', 'ERP- en finance-koppeling'), tx('Data migration and cleaning', 'Datamigratie en opschoning'), tx('CPQ and approvals', 'CPQ en goedkeuringen'), tx('Territories, partners, Agentforce', 'Regio\'s, partners, Agentforce')], cta: tx('Talk to a consultant', 'Praat met een consultant') }} />
      <StorySpotlight variant="pills" head={{ eyebrow: tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN'), a: tx('Teams that run on it.', 'Teams die erop draaien.'), b: '', lede: tx('What we built, in their own words. Pick a company or let it play.', 'Wat we bouwden, in hun eigen woorden. Kies een bedrijf of laat het vanzelf lopen.') }} stories={[S.wetransfer, S.evbox, S.opcharge]} />
      <V3Calculator {...sc3.calc()} />
      <V3FaqChat head={{ eyebrow: tx('QUESTIONS WE GET', 'VRAGEN DIE WE KRIJGEN'), a: tx('Before you', 'Voordat je'), b: tx('book the call.', 'het gesprek plant.') }} items={sc3.faq()} onCta={onCta} />
      <CkTalk onCta={onCta} line={tx('30 minutes, and you know if Sales Cloud fits.', 'In 30 minuten weet je of Sales Cloud past.')} />
      <CkStyles />
      <V3Styles />
    </main>
  );
}

/* ---------------- FIELD SERVICE ---------------- */
const fs3 = {
  problems: () => [
    { pain: tx('Planning by phone, WhatsApp and a whiteboard', 'Plannen via telefoon, WhatsApp en een whiteboard'), gain: tx('One planning board', 'Eén planbord'), d: tx('Every engineer, job and travel time in one view. Sick call? Drag and the day re-plans.', 'Elke monteur, klus en reistijd in één overzicht. Ziekmelding? Slepen en de dag plant opnieuw.') },
    { pain: tx('Second visits for the wrong part', 'Tweede bezoeken door het verkeerde onderdeel'), gain: tx('Fixed first time', 'In één keer goed'), d: tx('Asset history, warranty and the right parts known before the engineer leaves.', 'Assethistorie, garantie en de juiste onderdelen bekend voordat de monteur vertrekt.') },
    { pain: tx('Customers waiting "between 8 and 5"', 'Klanten die wachten "tussen 8 en 5"'), gain: tx('A time window and a live ETA', 'Een tijdvak en een live ETA'), d: tx('Customers get a text with the arrival time, and an update when a job overruns.', 'Klanten krijgen een sms met de aankomsttijd, en een update als een klus uitloopt.') },
    { pain: tx('Work orders typed up at night', '\'s Avonds werkbonnen typen'), gain: tx('Signed on site, invoiced today', 'Getekend op locatie, vandaag gefactureerd'), d: tx('Checklists, photos and F-gas registration in the app; finance invoices the same day.', 'Checklists, foto\'s en F-gassenregistratie in de app; finance factureert dezelfde dag.') },
  ],
  integrations: () => [
    { n: 'Exact Online / Globe', k: 'ERP', d: tx('Finished work orders become invoices.', 'Afgeronde werkbonnen worden facturen.') },
    { n: 'AFAS', k: 'ERP', d: tx('Customers, contracts and invoicing in sync.', 'Klanten, contracten en facturatie in sync.') },
    { n: 'Business Central', k: 'ERP', d: tx('Parts, stock and invoices connected.', 'Onderdelen, voorraad en facturen gekoppeld.') },
    { n: 'PDF Butler', k: tx('Documents', 'Documenten'), d: tx('Work orders and service reports as a PDF, straight to the customer.', 'Werkbonnen en servicerapporten als pdf, direct naar de klant.') },
    { n: tx('F-gas & NEN 3140', 'F-gas & NEN 3140'), k: 'Compliance', d: tx('Registrations and inspections per installation.', 'Registraties en keuringen per installatie.') },
    { n: tx('IoT & sensors', 'IoT & sensoren'), k: 'Assets', d: tx('A fault signal becomes a work order.', 'Een storingssignaal wordt een werkorder.') },
    { n: tx('Appointment portal', 'Klantafsprakenportaal'), k: tx('Customer', 'Klant'), d: tx('Customers book and move their own visit.', 'Klanten plannen en verzetten zelf hun bezoek.') },
    { n: 'Twinfield', k: tx('Accounting', 'Boekhouding'), d: tx('Hours and materials straight into your accounting.', 'Uren en materialen direct in je boekhouding.') },
  ],
  calc: () => ({
    head: { eyebrow: tx('WORK IT OUT', 'REKEN HET UIT'), a: tx('What is a smarter day', 'Wat levert een slimmere dag'), b: tx('worth to you?', 'jou op?'), lede: tx('Two levers most field service teams feel straight away: less driving and fewer repeat visits. Set your own numbers.', 'Twee knoppen die de meeste serviceteams direct voelen: minder rijden en minder herhaalbezoeken. Vul je eigen cijfers in.') },
    inputs: [
      { id: 'eng', label: tx('Engineers', 'Monteurs'), v: 10, min: 1, max: 100 },
      { id: 'drive', label: tx('Hours driving per engineer per day', 'Uur rijden per monteur per dag'), v: 2, min: 0.5, max: 5, step: 0.5, fmt: v => String(v).replace('.', window.__lang === 'nl' ? ',' : '.') },
      { id: 'cut', label: tx('Driving time saved by smart planning', 'Rijtijd bespaard door slimme planning'), v: 15, min: 5, max: 40, step: 5, fmt: v => v + '%', hint: tx('Cautious default: 15%.', 'Voorzichtige standaard: 15%.') },
      { id: 'repeat', label: tx('Repeat visits per engineer per week you avoid', 'Herhaalbezoeken per monteur per week die je voorkomt'), v: 1, min: 0, max: 5, hint: tx('A visit costs about 2 hours including travel.', 'Een bezoek kost ongeveer 2 uur inclusief reistijd.') },
      { id: 'rate', label: tx('Cost of an engineer hour', 'Kosten van een monteursuur'), v: 55, min: 30, max: 120, step: 5, fmt: v => '€ ' + v },
    ],
    compute: (v) => { const drive = v.eng * v.drive * (v.cut / 100) * 5 * 46; const rep = v.eng * v.repeat * 2 * 46; const hours = drive + rep; return { euro: hours * v.rate, label: tx('Hours back per year, in euros', 'Uren terug per jaar, in euro'), line: (f) => tx(f(hours) + ' engineer hours a year back for real work.', f(hours) + ' monteursuren per jaar terug voor echt werk.') }; },
    note: tx('Driving: engineers × hours × % saved × 5 days × 46 weeks. Repeat visits: engineers × visits × 2 h × 46 weeks. Fuel, CO₂ and happier customers are not counted.', 'Rijden: monteurs × uren × % bespaard × 5 dagen × 46 weken. Herhaalbezoeken: monteurs × bezoeken × 2 u × 46 weken. Brandstof, CO₂ en blijere klanten tellen niet mee.'),
  }),
  faq: () => [
    { label: tx('Cost', 'Kosten'), q: tx('What does a Field Service implementation cost?', 'Wat kost een Field Service-implementatie?'), a: tx('The Quickstart starts from €13,000 excluding VAT with a fixed scope. Larger implementations with optimisation, inventory or integrations are scoped with you. Licences are billed by Salesforce. We also check whether FieldBuddy is the better fit.', 'De Quickstart begint vanaf € 13.000 excl. btw met een vaste scope. Grotere implementaties met optimalisatie, voorraad of koppelingen scopen we samen. Licenties lopen via Salesforce. We kijken ook of FieldBuddy beter past.') },
    { label: tx('Engineers', 'Monteurs'), q: tx('Will my engineers use it?', 'Gaan mijn monteurs het gebruiken?'), a: tx('We start with a pilot: two engineers, real jobs, their feedback built in before the whole team goes live. The app works offline.', 'We beginnen met een pilot: twee monteurs, echte klussen, hun feedback verwerkt voordat het hele team live gaat. De app werkt offline.') },
    { label: tx('Compliance', 'Compliance'), q: tx('What about F-gas, NEN 3140 and inspections?', 'Hoe zit het met F-gas, NEN 3140 en keuringen?'), a: tx('Checklists and registrations are part of the work order, stored per installation and always findable for an audit.', 'Checklists en registraties zijn onderdeel van de werkbon, opgeslagen per installatie en altijd terug te vinden bij een audit.') },
    { label: 'ERP', q: tx('Does it connect to our ERP?', 'Koppelt het met ons ERP?'), a: tx('Yes: Exact Online, Exact Globe, AFAS and Business Central, as for ATAG Warmte, Alpha Ventilatie and De Ridder.', 'Ja: Exact Online, Exact Globe, AFAS en Business Central, zoals voor ATAG Warmte, Alpha Ventilatie en De Ridder.') },
    { label: 'FieldBuddy', q: tx('Salesforce Field Service or FieldBuddy?', 'Salesforce Field Service of FieldBuddy?'), a: tx('Both run on Salesforce. Salesforce Field Service suits complex planning and large teams; FieldBuddy is a Dutch app that is quick to set up for installers and service companies. We implement both, so our advice is honest.', 'Allebei draaien ze op Salesforce. Salesforce Field Service past bij complexe planning en grote teams; FieldBuddy is een Nederlandse app die snel staat voor installateurs en servicebedrijven. Wij implementeren beide, dus ons advies is eerlijk.') },
  ],
};

function FieldServiceV3({ onCta }) {
  useReveal();
  const S = CK_STORIES();
  return (
    <main style={{ background: 'var(--intigris-off-white)' }}>
      <CkProgress />
      <V3RouteHero eyebrow={tx('SALESFORCE FIELD SERVICE', 'SALESFORCE FIELD SERVICE')}
        a={tx('Planning, engineers and work orders.', 'Planning, monteurs en werkbonnen.')} b={tx('One system.', 'Eén systeem.')}
        lede={tx('Salesforce Field Service plans your engineers, sends them out prepared and closes every job on site. Fewer kilometres, fewer second visits, invoices the same day. Field service is our biggest speciality.', 'Salesforce Field Service plant je monteurs, stuurt ze voorbereid op pad en sluit elke klus op locatie af. Minder kilometers, minder tweede bezoeken, dezelfde dag factureren. Field service is ons grootste specialisme.')}
        onCta={onCta} secondary={{ href: '#start', label: tx('Ways to start', 'Manieren om te starten') }} />
      <V3FlipProblems head={{ eyebrow: tx('RECOGNISE THIS?', 'HERKEN JE DIT?'), a: tx('Four problems.', 'Vier problemen.'), b: tx('Four fixes.', 'Vier oplossingen.') }} items={fs3.problems()} />
      <V3Statement lead={tx('No more', 'Geen')} words={[
        { w: tx('paper work orders.', 'papieren werkbonnen.'), d: tx('Signed on the screen, done on site.', 'Getekend op het scherm, klaar op locatie.') },
        { w: tx('second visits.', 'tweede bezoeken.'), d: tx('The right part in the van, first time.', 'Het juiste onderdeel in de bus, de eerste keer.') },
        { w: tx('angry customers.', 'boze klanten.'), d: tx('A time window and a live ETA by text.', 'Een tijdvak en een live ETA per sms.') },
        { w: tx('evenings of admin.', 'avonden admin.'), d: tx('Home on time; the invoice is already out.', 'Op tijd thuis; de factuur is al verstuurd.') },
      ]} />
      <V3DayCompact head={{ eyebrow: tx("AN ENGINEER'S DAY", 'EEN MONTEURSDAG'), a: tx("Mark's Tuesday,", 'De dinsdag van Mark,'), b: tx('with and without.', 'met en zonder.') }} steps={fs2.day()} />
      <V3LogoHub center="Field Service" head={{ eyebrow: tx('A FULL IMPLEMENTATION', 'EEN VOLLEDIGE IMPLEMENTATIE'), a: tx('Connected to', 'Gekoppeld aan'), b: tx('the rest of your business.', 'de rest van je bedrijf.') }} items={fs3.integrations()} />
      <V3WaysToStart head={{ eyebrow: tx('WAYS TO START', 'MANIEREN OM TE STARTEN'), a: tx('Start small,', 'Begin klein,'), b: tx('or go all the way.', 'of ga voor het geheel.') }} onCta={onCta}
        quick={{ eyebrow: 'QUICKSTART', title: tx('Up and running fast.', 'Snel aan de slag.'), price: tx('from €13,000', 'vanaf € 13.000'), priceNote: tx('fixed scope, excl. VAT', 'vaste scope, excl. btw'), d: tx('The basics of Field Service: planning, work orders and the mobile app. Expand when you are ready; nothing is redone.', 'De basis van Field Service: planning, werkorders en de mobiele app. Uitbreiden wanneer je er klaar voor bent; niets wordt overgedaan.'),
          items: [tx('Dispatcher console and mobile app', 'Dispatcher console en mobiele app'), tx('Up to 3 territories and 5 skills', 'Tot 3 regio\'s en 5 skills'), tx('Pilot with two engineers, then the team', 'Pilot met twee monteurs, daarna het team')], cta: tx('Start with the Quickstart', 'Start met de Quickstart') }}
        full={{ eyebrow: tx('FULL IMPLEMENTATION', 'VOLLEDIGE IMPLEMENTATIE'), title: tx('Built for your operation.', 'Gebouwd voor jouw operatie.'), d: tx('Scheduling optimisation, maintenance plans, inventory, IoT and ERP integration, scoped around how your service team works.', 'Planningsoptimalisatie, onderhoudsplannen, voorraad, IoT en ERP-koppeling, gescoped rond hoe jouw serviceteam werkt.'),
          items: [tx('Optimisation and advanced scheduling', 'Optimalisatie en geavanceerde planning'), tx('Maintenance plans and contracts', 'Onderhoudsplannen en contracten'), tx('Inventory and parts', 'Voorraad en onderdelen'), tx('ERP and IoT integration', 'ERP- en IoT-koppeling')], cta: tx('Talk to a consultant', 'Praat met een consultant') }}
        extra={{ eyebrow: 'FIELDBUDDY', title: tx('Or FieldBuddy?', 'Of FieldBuddy?'), d: tx('A Dutch field service app on Salesforce, quick to set up for installers. We implement both.', 'Een Nederlandse field service-app op Salesforce, snel ingericht voor installateurs. Wij implementeren beide.'), href: 'FieldBuddy.html', cta: tx('Go to FieldBuddy', 'Naar FieldBuddy') }} />
      <StorySpotlight variant="pills" head={{ eyebrow: tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN'), a: tx('Service teams', 'Serviceteams'), b: tx('that run on it.', 'die erop draaien.'), lede: tx('What we built, in their own words. Pick a company or let it play.', 'Wat we bouwden, in hun eigen woorden. Kies een bedrijf of laat het vanzelf lopen.') }} stories={[S.ridder, S.atag, S.opcharge]} />
      <V3Calculator {...fs3.calc()} />
      <V3FaqChat head={{ eyebrow: tx('QUESTIONS WE GET', 'VRAGEN DIE WE KRIJGEN'), a: tx('Before you', 'Voordat je'), b: tx('book the call.', 'het gesprek plant.') }} items={fs3.faq()} onCta={onCta} />
      <CkTalk onCta={onCta} line={tx('Tell us how your engineers work today. We show you tomorrow.', 'Vertel hoe je monteurs nu werken. Wij laten je morgen zien.')} />
      <CkStyles />
      <V3Styles />
    </main>
  );
}

Object.assign(window, { SalesCloudV3, FieldServiceV3 });
