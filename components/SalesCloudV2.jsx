/* ==================================================================== */
/*  SALES CLOUD v2 — two page variations built from CloudKit blocks.     */
/*  Variation A "The story": classic coral hero, role switch, the        */
/*    spreadsheet → pipeline drag, the six steps, stories, package,      */
/*    calculator, FAQ.                                                   */
/*  Variation B "Bold": dark hero with the calculator in it, a sticky    */
/*    statement that swaps words as you scroll, then drag, proof,        */
/*    package and FAQ. Shorter and punchier.                             */
/*  Exposes window.SalesCloudA and window.SalesCloudB.                   */
/* ==================================================================== */

const sc2 = {
  heroCard: () => ({
    eyebrow: 'QUICKSTART SALES CLOUD',
    price: tx('from €7,000', 'vanaf € 7.000'),
    sub: tx('Live in four weeks · excl. VAT', 'Live in vier weken · excl. btw'),
    points: [tx('Leads, accounts, opportunities, dashboards', 'Leads, accounts, opportunities, dashboards'), tx('Built in your own Salesforce org', 'Gebouwd in je eigen Salesforce-org'), tx('Salesforce partner since 2010', 'Salesforce-partner sinds 2010')],
  }),
  roles: () => [
    { label: tx('Director / owner', 'Directeur / eigenaar'), items: [
      { pain: tx('Revenue forecast based on gut feeling', 'Omzetprognose op onderbuikgevoel'), gain: tx('A forecast you can steer on', 'Een forecast waar je op kunt sturen'), d: tx('Commit, best case and pipeline roll up per team, every week the same numbers.', 'Commit, best case en pipeline per team, elke week dezelfde cijfers.') },
      { pain: tx('Customer knowledge leaves with the rep', 'Klantkennis vertrekt met de verkoper'), gain: tx('Knowledge stays in the company', 'Kennis blijft in het bedrijf'), d: tx('Every call, mail and quote on the customer record, not in someone\'s inbox.', 'Elk gesprek, elke mail en offerte op de klantkaart, niet in iemands inbox.') },
      { pain: tx('Growth means more chaos', 'Groei betekent meer chaos'), gain: tx('One process for 5 or 50 reps', 'Eén proces voor 5 of 50 verkopers'), d: tx('Stages, required fields and approvals that scale with the team.', 'Fases, verplichte velden en goedkeuringen die meegroeien met je team.') },
    ] },
    { label: tx('Sales manager', 'Salesmanager'), items: [
      { pain: tx('Deals die quietly', 'Deals sterven in stilte'), gain: tx('See stalled deals early', 'Zie stilvallende deals op tijd'), d: tx('Alerts when a deal has no next step or sits too long in one stage.', 'Een seintje als een deal geen volgende stap heeft of te lang in één fase staat.') },
      { pain: tx('Monday meeting on anecdotes', 'Maandagoverleg op anekdotes'), gain: tx('Coach on facts', 'Coachen op feiten'), d: tx('Activity, conversion and win rate per rep on one dashboard.', 'Activiteit, conversie en winratio per verkoper op één dashboard.') },
      { pain: tx('Reports built in Excel every week', 'Elke week rapporten bouwen in Excel'), gain: tx('Reports that refresh themselves', 'Rapporten die zichzelf verversen'), d: tx('Build once, share with the team and the board.', 'Eén keer bouwen, delen met team en directie.') },
    ] },
    { label: tx('Account manager', 'Accountmanager'), items: [
      { pain: tx('Typing up calls and meetings', 'Gesprekken en afspraken overtypen'), gain: tx('Less admin', 'Minder admin'), d: tx('Email and calendar sync log your activity automatically.', 'Mail- en agendasync leggen je activiteit automatisch vast.') },
      { pain: tx('"What did we promise last time?"', '"Wat hadden we vorige keer beloofd?"'), gain: tx('Know who you are calling', 'Weet wie je belt'), d: tx('The full history on one screen, also on your phone.', 'De hele historie op één scherm, ook op je telefoon.') },
      { pain: tx('Quotes in Word, approvals by mail', 'Offertes in Word, akkoord per mail'), gain: tx('Quote from the opportunity', 'Offerte vanuit de opportunity'), d: tx('Products and price books in the CRM; approvals route themselves.', 'Producten en prijsboeken in het CRM; goedkeuringen lopen vanzelf.') },
    ] },
  ],
  steps: () => [
    { t: tx('Capture leads', 'Leads binnenhalen'), d: tx('Web forms, mail and events land in one queue.', 'Webformulieren, mail en events komen in één wachtrij.') },
    { t: tx('Know the account', 'Ken het account'), d: tx('Contacts, history and open cases on one record.', 'Contactpersonen, historie en open cases op één kaart.') },
    { t: tx('Run the pipeline', 'Stuur de pipeline'), d: tx('Your own stages with a clear next step.', 'Je eigen fases met een duidelijke volgende stap.') },
    { t: tx('Forecast', 'Forecast'), d: tx('Commit and best case, rolled up per team.', 'Commit en best case, per team opgeteld.') },
    { t: tx('Quote & approve', 'Offreren & akkoord'), d: tx('Quotes from the opportunity, approvals automatic.', 'Offertes uit de opportunity, akkoord automatisch.') },
    { t: tx('See what works', 'Zie wat werkt'), d: tx('Win rate and cycle time on live dashboards.', 'Winratio en doorlooptijd op live dashboards.') },
  ],
  stories: () => { const S = CK_STORIES(); return [S.wetransfer, S.evbox, S.zon365, S.opcharge, S.alpha]; },
  tabs: () => [
    { label: tx('Included', 'Inbegrepen'), kind: 'in', items: [tx('Leads, accounts and contacts', 'Leads, accounts en contactpersonen'), tx('Opportunities with your own stages', 'Opportunities met je eigen fases'), tx('Up to 3 reports and 1 dashboard', 'Tot 3 rapporten en 1 dashboard'), tx('Training for your team', 'Training voor je team'), tx('Go-live support', 'Livegang-support'), tx('Built in your own org', 'Gebouwd in je eigen org')] },
    { label: tx('Not included', 'Niet inbegrepen'), kind: 'out', items: [tx('ERP integration (Exact, AFAS, NetSuite)', 'ERP-koppeling (Exact, AFAS, NetSuite)'), tx('Large data migrations', 'Grote datamigraties'), tx('CPQ and quote approvals', 'CPQ en offertegoedkeuring'), tx('Salesforce licences', 'Salesforce-licenties')] },
    { label: tx('What we need from you', 'Wat we van je nodig hebben'), kind: 'you', items: [tx('A process owner, about 4 hours a week', 'Een proceseigenaar, ± 4 uur per week'), tx('Your customer list in Excel', 'Je klantenlijst in Excel'), tx('Sign-off on the design in week 2', 'Akkoord op het ontwerp in week 2'), tx('Two key users for testing', 'Twee sleutelgebruikers voor de test')] },
  ],
  weeks: () => [
    { w: tx('Week 1', 'Week 1'), t: tx('Information', 'Informatie'), d: tx('Your process and data', 'Je proces en data') },
    { w: tx('Week 2', 'Week 2'), t: tx('Configuration', 'Inrichten'), d: tx('The core stands', 'De basis staat') },
    { w: tx('Week 3', 'Week 3'), t: tx('Demo', 'Demo'), d: tx('With your team', 'Met je team') },
    { w: tx('Week 4', 'Week 4'), t: tx('Go-live', 'Live'), d: tx('Support on day one', 'Support op dag één') },
  ],
  glance: () => ({ price: tx('€7,000', '€ 7.000'), priceNote: tx('from, excl. VAT', 'vanaf, excl. btw'),
    rows: [[tx('Lead time', 'Doorlooptijd'), tx('4 weeks', '4 weken')], [tx('Your time', 'Jouw tijd'), tx('± 4 h/week', '± 4 u/week')], [tx('Users', 'Gebruikers'), tx('up to 10', 'tot 10')], [tx('After go-live', 'Na livegang'), tx('30/60/90-day check', '30/60/90-dagencheck')]] }),
  calc: () => ({
    head: { eyebrow: tx('WORK IT OUT', 'REKEN HET UIT'), a: tx('What is less admin', 'Wat levert minder admin'), b: tx('worth to you?', 'jou op?') },
    people: { label: tx('Account managers', 'Accountmanagers'), v: 6, min: 1, max: 40 },
    hours: { label: tx('Hours of admin per week, per person', 'Uur admin per week, per persoon'), v: 5, min: 1, max: 15 },
    rate: { label: tx('Cost per hour', 'Kosten per uur'), v: 65, min: 35, max: 150 },
    unit: tx('hours of extra selling time.', 'uur extra verkooptijd.'),
    result: tx('Example: people × hours × 50% × 46 working weeks × hourly cost. Not a promise; we check it together on the call.', 'Rekenvoorbeeld: personen × uren × 50% × 46 werkweken × uurtarief. Geen belofte; in het gesprek rekenen we het samen na.'),
  }),
  faq: () => [
    { label: tx('Cost', 'Kosten'), q: tx('What does it cost?', 'Wat kost het?'), a: tx('The Quickstart starts from €7,000 excluding VAT: a fixed scope and a fixed price. Larger implementations are scoped after a short analysis, so you get a number you can plan on. Salesforce licences are separate and billed by Salesforce; we don\'t resell them, so our advice isn\'t tied to margin.', 'De Quickstart begint vanaf € 7.000 excl. btw: vaste scope, vaste prijs. Grotere implementaties scopen we na een korte analyse, zodat je een bedrag krijgt waar je op kunt plannen. Salesforce-licenties lopen apart via Salesforce; wij verkopen ze niet door, dus ons advies hangt niet aan marge.') },
    { label: tx('Time', 'Tijd'), q: tx('How long until we use it?', 'Hoe snel werken we ermee?'), a: tx('Four weeks from kick-off to go-live with the Quickstart. Full implementations usually take eight to sixteen weeks, delivered in sprints so you see working software every two weeks.', 'Vier weken van kick-off tot livegang met de Quickstart. Volledige implementaties duren meestal acht tot zestien weken, in sprints, zodat je elke twee weken werkende software ziet.') },
    { label: tx('Adoption', 'Adoptie'), q: tx('Will my team actually use it?', 'Gaat mijn team het echt gebruiken?'), a: tx('We build around how your team sells today, train your key users, and check usage at 30, 60 and 90 days after go-live. Less typing for reps is the point, not more.', 'We bouwen rond hoe je team nu verkoopt, trainen je sleutelgebruikers en checken het gebruik 30, 60 en 90 dagen na livegang. Minder typen voor verkopers is het doel, niet meer.') },
    { label: tx('Data & ERP', 'Data & ERP'), q: tx('Can it connect to Exact or AFAS, and move our data?', 'Kan het koppelen met Exact of AFAS, en onze data overzetten?'), a: tx('Yes. We connect Sales Cloud to Exact, AFAS, Business Central and NetSuite, and migrate from spreadsheets, HubSpot or Dynamics. Both are add-ons to the Quickstart, scoped up front.', 'Ja. We koppelen Sales Cloud aan Exact, AFAS, Business Central en NetSuite, en migreren vanuit spreadsheets, HubSpot of Dynamics. Allebei uitbreidingen op de Quickstart, vooraf gescoped.') },
    { label: tx('Why Intigris', 'Waarom Intigris'), q: tx('Why Salesforce, and why you?', 'Waarom Salesforce, en waarom jullie?'), a: tx('Salesforce grows with you from five reps to five hundred, with AI built in when you are ready. We have implemented it since 2010, as a Summit partner, with senior consultants from Amsterdam. Everything is built in your own org: no lock-in.', 'Salesforce groeit met je mee van vijf naar vijfhonderd verkopers, met AI erin als je eraan toe bent. Wij implementeren het sinds 2010, als Summit-partner, met senior consultants uit Amsterdam. Alles staat in je eigen org: geen lock-in.') },
  ],
};

function SalesCloudA({ onCta }) {
  useReveal();
  const c = sc2.calc();
  return (
    <main style={{ background: 'var(--intigris-off-white)' }}>
      <CkProgress />
      <CkHero eyebrow={tx('SALES CLOUD · NOW AGENTFORCE SALES', 'SALES CLOUD · NU AGENTFORCE SALES')}
        a={tx('Every deal, every rep,', 'Elke deal, elke verkoper,')} b={tx('one pipeline.', 'één pipeline.')}
        lede={tx('Stop steering on gut feeling. Salesforce Sales Cloud gives your team one place for leads, customers, deals and forecasts. Live in four weeks with our Quickstart.', 'Stop met sturen op onderbuikgevoel. Salesforce Sales Cloud geeft je team één plek voor leads, klanten, deals en forecasts. Live in vier weken met onze Quickstart.')}
        card={sc2.heroCard()} onCta={onCta} secondary={{ href: '#drag', label: tx('See the difference', 'Zie het verschil') }} />
      <CkSwitchPains head={{ eyebrow: tx('WHAT IT DOES FOR YOU', 'WAT HET JOU OPLEVERT'), a: tx('Pick your role.', 'Kies je rol.'), b: tx('See what changes.', 'Zie wat er verandert.') }} options={sc2.roles()} />
      <div id="drag"><CkSpreadsheetSlider head={{ eyebrow: tx('FROM SPREADSHEET TO PIPELINE', 'VAN SPREADSHEET NAAR PIPELINE'), a: tx('This is your pipeline today.', 'Dit is je pipeline vandaag.'), b: tx('Drag to see tomorrow.', 'Sleep voor morgen.') }} /></div>
      <CkStepsLine head={{ eyebrow: tx('FROM LEAD TO CLOSED DEAL', 'VAN LEAD TOT GESLOTEN DEAL'), a: tx('Six steps.', 'Zes stappen.'), b: tx('One system.', 'Eén systeem.') }} steps={sc2.steps()} />
      <CkStories head={{ eyebrow: tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN'), a: tx('Teams that run on it.', 'Teams die erop draaien.'), b: '' }} stories={sc2.stories()} />
      <CkPackage head={{ eyebrow: 'QUICKSTART', a: tx('Know what you get', 'Weet wat je krijgt'), b: tx('before you call.', 'voordat je belt.') }} tabs={sc2.tabs()} weeks={sc2.weeks()} glance={sc2.glance()} onCta={onCta} />
      <CkCalculator {...c} />
      <CkFaqTabs head={{ eyebrow: tx('QUESTIONS WE GET', 'VRAGEN DIE WE KRIJGEN'), a: tx('Before you', 'Voordat je'), b: tx('book the call.', 'het gesprek plant.') }} groups={sc2.faq()} />
      <CkTalk onCta={onCta} line={tx('30 minutes, and you know if Sales Cloud fits.', 'In 30 minuten weet je of Sales Cloud past.')} />
      <CkStyles />
    </main>
  );
}

/* Variation B: the calculator is the hero's right-hand side. */
function SbHeroCalc() {
  const [n, setN] = React.useState(6);
  const [h, setH] = React.useState(5);
  const hours = n * h * 0.5 * 46;
  const fmt = (x) => Math.round(x).toLocaleString(window.__lang === 'nl' ? 'nl-NL' : 'en-GB');
  return (
    <div className="ck-glass sb-calc">
      <div className="ck-glass-eyebrow">{tx('YOUR TIME BACK', 'JOUW TIJD TERUG')}</div>
      <div className="ck-glass-price">{fmt(hours)} {tx('h', 'u')}</div>
      <div className="ck-glass-sub">{tx('extra selling time per year (example)', 'extra verkooptijd per jaar (voorbeeld)')}</div>
      <label htmlFor="sb-n">{tx('Reps', 'Verkopers')} <output>{n}</output></label>
      <input id="sb-n" type="range" min="1" max="40" value={n} onChange={e => setN(+e.target.value)} />
      <label htmlFor="sb-h">{tx('Admin hours per week each', 'Uur admin per week p.p.')} <output>{h}</output></label>
      <input id="sb-h" type="range" min="1" max="15" value={h} onChange={e => setH(+e.target.value)} />
      <small>{tx('Quickstart from €7,000 · live in 4 weeks', 'Quickstart vanaf € 7.000 · live in 4 weken')}</small>
    </div>
  );
}

function SalesCloudB({ onCta }) {
  useReveal();
  return (
    <main style={{ background: 'var(--intigris-off-white)' }}>
      <CkProgress />
      <CkHero variant="dark" eyebrow={tx('SALES CLOUD · NOW AGENTFORCE SALES', 'SALES CLOUD · NU AGENTFORCE SALES')}
        a={tx('More selling.', 'Meer verkopen.')} b={tx('Less typing.', 'Minder typen.')}
        lede={tx('Your reps spend hours a week on admin. Sales Cloud gives that time back and puts every deal in one pipeline. Move the sliders: this is what it is worth for your team.', 'Je verkopers zijn uren per week kwijt aan admin. Sales Cloud geeft die tijd terug en zet elke deal in één pipeline. Schuif maar: dit is wat het je team oplevert.')}
        onCta={onCta} secondary={{ href: '#package', label: tx('What you get', 'Wat je krijgt') }} side={<SbHeroCalc />} />
      <CkStatement lead={tx('Stop', 'Stop met')} words={[
        { w: tx('guessing.', 'gokken.'), d: tx('One forecast, built from the deals themselves.', 'Eén forecast, opgebouwd uit de deals zelf.') },
        { w: tx('retyping.', 'overtypen.'), d: tx('Mail, calendar and quotes logged automatically.', 'Mail, agenda en offertes automatisch vastgelegd.') },
        { w: tx('searching.', 'zoeken.'), d: tx('The whole customer on one screen, also on your phone.', 'De hele klant op één scherm, ook op je telefoon.') },
        { w: tx('losing deals.', 'deals verliezen.'), d: tx('An alert when a deal stalls, before it dies quietly.', 'Een seintje als een deal stilvalt, voordat hij doodgaat.') },
      ]} />
      <CkSpreadsheetSlider head={{ eyebrow: tx('SEE IT', 'ZIE HET'), a: tx('Your Excel.', 'Jouw Excel.'), b: tx('Your pipeline.', 'Jouw pipeline.') }} />
      <CkStories dark={false} head={{ eyebrow: tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN'), a: tx('They made the switch.', 'Zij maakten de overstap.'), b: '' }} stories={sc2.stories()} />
      <CkPackage head={{ eyebrow: 'QUICKSTART', a: tx('Four weeks.', 'Vier weken.'), b: tx('No surprises.', 'Geen verrassingen.') }} tabs={sc2.tabs()} weeks={sc2.weeks()} glance={sc2.glance()} onCta={onCta} />
      <CkFaqTabs head={{ eyebrow: tx('QUESTIONS WE GET', 'VRAGEN DIE WE KRIJGEN'), a: tx('Straight', 'Eerlijke'), b: tx('answers.', 'antwoorden.') }} groups={sc2.faq()} />
      <CkTalk onCta={onCta} line={tx('Show us your spreadsheet. We show you the pipeline.', 'Laat je spreadsheet zien. Wij laten je de pipeline zien.')} />
      <CkStyles />
      <style>{`
        .sb-calc { display: flex; flex-direction: column; gap: 6px; }
        .sb-calc label { margin-top: 12px; font-size: 13.5px; font-weight: 500; display: flex; justify-content: space-between; color: rgba(252,247,235,.9); }
        .sb-calc output { color: var(--intigris-coral); font-variant-numeric: tabular-nums; }
        .sb-calc input[type=range] { width: 100%; accent-color: var(--intigris-coral); }
        .sb-calc small { margin-top: 12px; font-size: 12.5px; color: rgba(252,247,235,.7); }
        .sb-calc .ck-glass-price { font-variant-numeric: tabular-nums; }
      `}</style>
    </main>
  );
}

Object.assign(window, { SalesCloudA, SalesCloudB });
