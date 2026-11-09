/* ==================================================================== */
/*  FIELD SERVICE v2 — two page variations built from CloudKit blocks.   */
/*  Variation A "The monteur's day": coral hero with the route visual,   */
/*    industry switch, the scroll story of one technician's day,         */
/*    stories (De Ridder 3×), package, FieldBuddy teaser, FAQ.           */
/*  Variation B "Route first": dark hero, the route pinned while it      */
/*    untangles, without/with comparison, the day story, proof, FAQ.     */
/*  Exposes window.FieldServiceA and window.FieldServiceB.               */
/* ==================================================================== */

const fs2 = {
  heroCard: () => ({
    eyebrow: 'QUICKSTART FIELD SERVICE',
    price: tx('from €13,000', 'vanaf € 13.000'),
    sub: tx('Planning, dispatch and mobile app · excl. VAT', 'Planning, dispatch en mobiele app · excl. btw'),
    points: [tx('Dispatcher console and mobile app', 'Dispatcher console en mobiele app'), tx('Up to 3 territories and 5 skills', 'Tot 3 regio\'s en 5 skills'), tx('Field service is our biggest speciality', 'Field service is ons grootste specialisme')],
  }),
  industries: () => [
    { label: tx('Installation', 'Installatietechniek'), items: [
      { pain: tx('Planning by phone and WhatsApp', 'Planning via telefoon en WhatsApp'), gain: tx('One planning board', 'Eén planbord'), d: tx('Every engineer, job and travel time in one view; drag to re-plan.', 'Elke monteur, klus en reistijd in één overzicht; slepen om te herplannen.') },
      { pain: tx('Second visits for the wrong part', 'Tweede bezoek door verkeerd onderdeel'), gain: tx('Fixed first time', 'In één keer goed'), d: tx('Parts and asset history known before the engineer leaves.', 'Onderdelen en assethistorie bekend voordat de monteur vertrekt.') },
      { pain: tx('Work orders typed up at night', '\'s Avonds werkbonnen typen'), gain: tx('Invoice the same day', 'Dezelfde dag factureren'), d: tx('The work order is complete on site, so finance invoices today.', 'De werkbon is op locatie compleet, dus finance factureert vandaag.') },
    ] },
    { label: tx('HVAC & heating', 'HVAC & verwarming'), items: [
      { pain: tx('F-gas registration on paper', 'F-gassenregistratie op papier'), gain: tx('Compliant by default', 'Standaard compliant'), d: tx('Refrigerant and inspection data captured in the app, per installation.', 'Koudemiddel- en keuringsdata vastgelegd in de app, per installatie.') },
      { pain: tx('Maintenance contracts in a spreadsheet', 'Onderhoudscontracten in een spreadsheet'), gain: tx('Maintenance plans that plan themselves', 'Onderhoudsplannen die zichzelf inplannen'), d: tx('Periodic visits generated from the contract, on time.', 'Periodieke bezoeken uit het contract, op tijd.') },
      { pain: tx('Peak season chaos', 'Chaos in het piekseizoen'), gain: tx('Re-planning in minutes', 'Herplannen in minuten'), d: tx('Sick call or overrun? The day re-plans and customers get a new ETA.', 'Ziekmelding of uitloop? De dag plant zich opnieuw en klanten krijgen een nieuwe tijd.') },
    ] },
    { label: tx('Energy & charging', 'Energie & laadpalen'), items: [
      { pain: tx('Thousands of assets, little overview', 'Duizenden assets, weinig overzicht'), gain: tx('Every asset on the map', 'Elk asset op de kaart'), d: tx('Locations, installed base and history in one place.', 'Locaties, geïnstalleerde basis en historie op één plek.') },
      { pain: tx('Fault reports by mail', 'Storingsmeldingen per mail'), gain: tx('From fault to work order automatically', 'Van storing naar werkorder, automatisch'), d: tx('A report becomes a case and a work order with the right skills.', 'Een melding wordt een case en een werkorder met de juiste skills.') },
      { pain: tx('SLAs nobody can prove', 'SLA\'s die niemand kan aantonen'), gain: tx('SLA timers on every job', 'SLA-timers op elke klus'), d: tx('Response and resolution times visible to planners and customers.', 'Reactie- en oplostijden zichtbaar voor planners en klanten.') },
    ] },
    { label: tx('Machinery', 'Machinebouw'), items: [
      { pain: tx('"What did we do to this machine?"', '"Wat hebben we aan deze machine gedaan?"'), gain: tx('Machine history in your pocket', 'Machinehistorie in je broekzak'), d: tx('Every visit, part and measurement per serial number.', 'Elk bezoek, onderdeel en meting per serienummer.') },
      { pain: tx('Service contracts half filled in', 'Servicecontracten half ingevuld'), gain: tx('Complete contracts', 'Complete contracten'), d: tx('Entitlements checked on every job; no more free work by accident.', 'Rechten gecheckt bij elke klus; geen gratis werk meer per ongeluk.') },
      { pain: tx('Checklists on paper', 'Checklists op papier'), gain: tx('Checklists with photos', 'Checklists met foto\'s'), d: tx('Structured inspections, signed on the screen.', 'Gestructureerde inspecties, getekend op het scherm.') },
    ] },
  ],
  day: () => [
    { time: '07:30', t: tx('The day starts on his phone', 'De dag begint op zijn telefoon'), d: tx('Route, five jobs and the parts he needs, re-planned this morning after a sick call.', 'Route, vijf klussen en de onderdelen die hij nodig heeft, vanochtend herpland na een ziekmelding.'),
      before: [[tx('Planning via WhatsApp', 'Planning via WhatsApp'), tx('3 messages, 1 contradicts', '3 berichten, 1 tegenstrijdig')], [tx('Paper work orders', 'Papieren werkbonnen'), tx('Still in the van', 'Liggen nog in de bus')]],
      after: [[tx('Your day: 5 jobs', 'Je dag: 5 klussen'), tx('Route optimised, 6:12 h', 'Route geoptimaliseerd, 6:12 u')], [tx('Parts ready', 'Onderdelen klaar'), tx('2 filters and a pump, in stock', '2 filters en een pomp, op voorraad')]] },
    { time: '08:45', t: tx('He knows the machine before he rings', 'Hij kent de machine voordat hij aanbelt'), d: tx('Asset history, last visit, warranty. No calling the office.', 'Assethistorie, laatste bezoek, garantie. Niet het kantoor bellen.'),
      before: [[tx('"What happened last time?"', '"Wat was er vorige keer?"'), tx('Calling the office, 10 min on hold', 'Kantoor bellen, 10 min in de wacht')]],
      after: [[tx('Boiler, 3 previous visits', 'Ketel, 3 eerdere bezoeken'), tx('Last one: a leak', 'Laatste: lekkage')], [tx('Under warranty until 2027', 'Garantie tot 2027'), tx('No cost for the customer', 'Geen kosten voor de klant')]] },
    { time: '11:10', t: tx('A job overruns. The day fixes itself', 'Een klus loopt uit. De dag past zich aan'), d: tx('The planner sees it live; the next customer gets a new time by text.', 'De planner ziet het live; de volgende klant krijgt een nieuwe tijd per sms.'),
      before: [[tx('Next customer calls, annoyed', 'Volgende klant belt, boos'), ''], [tx('Planner knows nothing', 'Planner weet van niets'), '']],
      after: [[tx('Planning updated', 'Planning aangepast'), tx('Customer 3 got a text: new time 13:40', 'Klant 3 kreeg een sms: nieuwe tijd 13:40')]] },
    { time: '14:20', t: tx('Fixed first time', 'In één keer opgelost'), d: tx('Checklist, photos and F-gas registration in the app. The customer signs on the screen.', 'Checklist, foto\'s en F-gassenregistratie in de app. De klant tekent op het scherm.'),
      before: [[tx('Second visit needed', 'Tweede bezoek nodig'), tx('Wrong part in the van', 'Verkeerd onderdeel mee')], [tx('F-gas form later', 'F-gas later invullen'), tx('On paper, at home', 'Op papier, thuis')]],
      after: [[tx('Solved first time', 'In één keer opgelost'), tx('Checklist 12/12, 4 photos', 'Checklist 12/12, 4 foto\'s')], [tx('F-gas registered', 'F-gas geregistreerd'), tx('Customer signed on screen', 'Klant tekende op het scherm')]] },
    { time: '16:30', t: tx('Home on time. Invoice already out', 'Op tijd thuis. Factuur al verstuurd'), d: tx('The work order is complete, so finance invoices today, not next week.', 'De werkbon is compleet, dus finance factureert vandaag, niet volgende week.'),
      before: [[tx('Evening: typing work orders', '\'s Avonds werkbonnen typen'), tx('Invoice next week', 'Factuur volgende week')]],
      after: [[tx('Home on time', 'Op tijd thuis'), tx('Work order complete', 'Werkbon compleet')], [tx('Invoice sent', 'Factuur verstuurd'), tx('Today, automatically', 'Vandaag, automatisch')]] },
  ],
  compare: () => [
    { topic: tx('Planning', 'Planning'), before: tx('A whiteboard, a spreadsheet and a lot of phone calls', 'Een whiteboard, een spreadsheet en veel bellen'), after: tx('One planning board; jobs re-plan themselves', 'Eén planbord; klussen plannen zichzelf opnieuw') },
    { topic: tx('On site', 'Op locatie'), before: tx('No history, guess the part', 'Geen historie, onderdeel gokken'), after: tx('Full asset history and the right part in the van', 'Volledige assethistorie en het juiste onderdeel in de bus') },
    { topic: tx('The customer', 'De klant'), before: tx('"Between 8 and 5" and no update', '"Tussen 8 en 5" en geen update'), after: tx('A time window and a live ETA by text', 'Een tijdvak en een live ETA per sms') },
    { topic: tx('Paperwork', 'Papierwerk'), before: tx('Work orders typed up at night', '\'s Avonds werkbonnen typen'), after: tx('Signed on the screen, done on site', 'Getekend op het scherm, klaar op locatie') },
    { topic: tx('Compliance', 'Compliance'), before: tx('F-gas and inspection forms on paper', 'F-gas- en keuringsformulieren op papier'), after: tx('Registered per installation, always findable', 'Per installatie geregistreerd, altijd vindbaar') },
    { topic: tx('Cash flow', 'Cashflow'), before: tx('Invoice a week later', 'Factuur een week later'), after: tx('Invoice the same day', 'Factuur dezelfde dag') },
  ],
  stories: () => { const S = CK_STORIES(); return [S.ridder, S.atag, S.zon365, S.opcharge, S.alpha, S.solar]; },
  tabs: () => [
    { label: tx('Included', 'Inbegrepen'), kind: 'in', items: [tx('Field Service basic setup', 'Field Service basisinrichting'), tx('Work orders and appointments', 'Werkorders en afspraken'), tx('Assets and locations', 'Assets en locaties'), tx('Dispatcher console', 'Dispatcher console'), tx('Mobile app for engineers', 'Mobiele app voor monteurs'), tx('Up to 3 territories and 5 skills', 'Tot 3 regio\'s en 5 skills'), tx('Training and go-live support', 'Training en livegang-support')] },
    { label: tx('Not included', 'Niet inbegrepen'), kind: 'out', items: [tx('Scheduling optimisation', 'Planningsoptimalisatie'), tx('Inventory management', 'Voorraadbeheer'), tx('ERP integration', 'ERP-koppeling'), tx('Salesforce licences', 'Salesforce-licenties')] },
    { label: tx('What we need from you', 'Wat we van je nodig hebben'), kind: 'you', items: [tx('A planner and two engineers as key users', 'Een planner en twee monteurs als sleutelgebruikers'), tx('Your customer and installation list', 'Je klant- en installatielijst'), tx('Your current work order form', 'Je huidige werkbon'), tx('About 4 hours a week from a process owner', '± 4 uur per week van een proceseigenaar')] },
  ],
  weeks: () => [
    { w: tx('Phase 1', 'Fase 1'), t: tx('Your process', 'Jouw proces'), d: tx('Planning, jobs and the work order', 'Planning, klussen en de werkbon') },
    { w: tx('Phase 2', 'Fase 2'), t: tx('Configuration', 'Inrichten'), d: tx('Territories, skills, assets', 'Regio\'s, skills, assets') },
    { w: tx('Phase 3', 'Fase 3'), t: tx('Pilot', 'Pilot'), d: tx('Two engineers, real jobs', 'Twee monteurs, echte klussen') },
    { w: tx('Phase 4', 'Fase 4'), t: tx('Go-live', 'Live'), d: tx('Whole team, support on site', 'Hele team, support op locatie') },
  ],
  glance: () => ({ price: tx('€13,000', '€ 13.000'), priceNote: tx('from, excl. VAT', 'vanaf, excl. btw'),
    rows: [[tx('Engineers', 'Monteurs'), tx('pilot with 2, then all', 'pilot met 2, daarna iedereen')], [tx('Territories', 'Regio\'s'), tx('up to 3', 'tot 3')], [tx('Skills', 'Skills'), tx('up to 5', 'tot 5')], [tx('After go-live', 'Na livegang'), tx('30/60/90-day check', '30/60/90-dagencheck')]] }),
  faq: () => [
    { label: tx('Cost', 'Kosten'), q: tx('What does it cost?', 'Wat kost het?'), a: tx('The Field Service Quickstart starts from €13,000 excluding VAT, with a fixed scope. Salesforce Field Service licences are separate and billed by Salesforce. In a first call we also check whether FieldBuddy is the better and cheaper fit for you.', 'De Field Service Quickstart begint vanaf € 13.000 excl. btw, met een vaste scope. Salesforce Field Service-licenties lopen apart via Salesforce. In een eerste gesprek kijken we ook of FieldBuddy voor jou de betere en goedkopere keuze is.') },
    { label: tx('Engineers', 'Monteurs'), q: tx('Will my engineers use it?', 'Gaan mijn monteurs het gebruiken?'), a: tx('We start with a pilot: two engineers, real jobs, their feedback built in before the whole team goes live. The app works offline, and a work order takes fewer taps than the paper form.', 'We beginnen met een pilot: twee monteurs, echte klussen, hun feedback verwerkt voordat het hele team live gaat. De app werkt offline, en een werkbon kost minder tikken dan het papieren formulier.') },
    { label: tx('Compliance', 'Compliance'), q: tx('What about F-gas, NEN 3140 and inspections?', 'Hoe zit het met F-gas, NEN 3140 en keuringen?'), a: tx('Checklists and registrations are part of the work order: refrigerant data, inspection results and photos per installation, always findable for an audit.', 'Checklists en registraties zijn onderdeel van de werkbon: koudemiddeldata, keuringsresultaten en foto\'s per installatie, altijd terug te vinden bij een audit.') },
    { label: tx('ERP', 'ERP'), q: tx('Does it connect to Exact or AFAS?', 'Koppelt het met Exact of AFAS?'), a: tx('Yes. We have connected field service to Exact Online, Exact Globe and other ERPs for customers like ATAG Warmte, Alpha Ventilatie and De Ridder, so finished work orders turn into invoices.', 'Ja. We hebben field service gekoppeld aan Exact Online, Exact Globe en andere ERP\'s voor klanten als ATAG Warmte, Alpha Ventilatie en De Ridder, zodat afgeronde werkbonnen facturen worden.') },
    { label: tx('FieldBuddy?', 'FieldBuddy?'), q: tx('Salesforce Field Service or FieldBuddy?', 'Salesforce Field Service of FieldBuddy?'), a: tx('Both run on Salesforce. Salesforce Field Service suits complex planning and large teams; FieldBuddy is a Dutch app that is quick to set up for installers and service companies. We implement both, so our advice is honest.', 'Allebei draaien ze op Salesforce. Salesforce Field Service past bij complexe planning en grote teams; FieldBuddy is een Nederlandse app die snel staat voor installateurs en servicebedrijven. Wij implementeren beide, dus ons advies is eerlijk.') },
  ],
};

function FsTeaser() {
  return <CkTeaser eyebrow="FIELDBUDDY" title={tx('Salesforce Field Service or FieldBuddy?', 'Salesforce Field Service of FieldBuddy?')} body={tx('FieldBuddy is a Dutch field service app on Salesforce, quick to set up for installers and service companies. We implement both, so we tell you honestly which one fits.', 'FieldBuddy is een Nederlandse field service-app op Salesforce, snel ingericht voor installateurs en servicebedrijven. Wij implementeren beide, dus we zeggen je eerlijk welke past.')} href="FieldBuddy.html" cta={tx('Go to FieldBuddy', 'Naar FieldBuddy')} />;
}

function FieldServiceA({ onCta }) {
  useReveal();
  return (
    <main style={{ background: 'var(--intigris-off-white)' }}>
      <CkProgress />
      <CkHero eyebrow={tx('SALESFORCE FIELD SERVICE', 'SALESFORCE FIELD SERVICE')}
        a={tx('The right engineer,', 'De juiste monteur,')} b={tx('first time right.', 'in één keer goed.')}
        lede={tx('Planning, work orders and a mobile app for your engineers, so they arrive prepared, fix it first time and are home on time. Implemented by the team for whom field service is the biggest speciality.', 'Planning, werkorders en een mobiele app voor je monteurs, zodat ze voorbereid aankomen, het in één keer oplossen en op tijd thuis zijn. Geïmplementeerd door het team voor wie field service het grootste specialisme is.')}
        card={fs2.heroCard()} onCta={onCta} secondary={{ href: '#day', label: tx("Follow an engineer's day", 'Volg een monteursdag') }} />
      <section className="ck-section ck-section--dark">
        <div className="container-wide">
          <CkHead eyebrow={tx('FROM CHAOS TO ROUTE', 'VAN CHAOS NAAR ROUTE')} a={tx('Watch the day', 'Kijk hoe de dag')} b={tx('untangle.', 'ontwart.')} lede={tx('Scroll: eight jobs, one engineer. Smart planning turns a zig-zag into a short loop.', 'Scroll: acht klussen, één monteur. Slimme planning maakt van een zigzag een korte ronde.')} />
          <CkRoute />
        </div>
      </section>
      <CkSwitchPains head={{ eyebrow: tx('YOUR SECTOR', 'JOUW BRANCHE'), a: tx('Pick your sector.', 'Kies je branche.'), b: tx('Recognise the pain?', 'Herken je dit?') }} options={fs2.industries()} />
      <div id="day"><CkDayInLife head={{ eyebrow: tx("AN ENGINEER'S DAY", 'EEN MONTEURSDAG'), a: tx('Mark\'s Tuesday,', 'De dinsdag van Mark,'), b: tx('with and without.', 'met en zonder.') }} steps={fs2.day()} /></div>
      <CkStories head={{ eyebrow: tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN'), a: tx('Service teams', 'Serviceteams'), b: tx('that run on it.', 'die erop draaien.') }} stories={fs2.stories()} />
      <CkPackage head={{ eyebrow: 'QUICKSTART', a: tx('Know what you get', 'Weet wat je krijgt'), b: tx('before you call.', 'voordat je belt.') }} tabs={fs2.tabs()} weeks={fs2.weeks()} glance={fs2.glance()} onCta={onCta} />
      <CkStrip label={tx('Connects to', 'Koppelt met')} items={['Exact Online', 'Exact Globe', 'AFAS', 'Business Central', 'Outlook', 'FieldBuddy']} />
      <FsTeaser />
      <CkFaqTabs head={{ eyebrow: tx('QUESTIONS WE GET', 'VRAGEN DIE WE KRIJGEN'), a: tx('Before you', 'Voordat je'), b: tx('book the call.', 'het gesprek plant.') }} groups={fs2.faq()} />
      <CkTalk onCta={onCta} line={tx('Tell us how your engineers work today. We show you tomorrow.', 'Vertel hoe je monteurs nu werken. Wij laten je morgen zien.')} />
      <CkStyles />
    </main>
  );
}

function FieldServiceB({ onCta }) {
  useReveal();
  return (
    <main style={{ background: 'var(--intigris-off-white)' }}>
      <CkProgress />
      <CkHero variant="dark" eyebrow={tx('SALESFORCE FIELD SERVICE', 'SALESFORCE FIELD SERVICE')}
        a={tx('Fewer kilometres.', 'Minder kilometers.')} b={tx('More jobs done.', 'Meer klussen af.')}
        lede={tx('Smart planning, engineers who arrive prepared and work orders signed on site. Scroll down and watch one engineer\'s day untangle.', 'Slimme planning, monteurs die voorbereid aankomen en werkbonnen die op locatie getekend worden. Scroll en zie de dag van één monteur ontwarren.')}
        card={fs2.heroCard()} onCta={onCta} secondary={{ href: '#package', label: tx('What you get', 'Wat je krijgt') }} />
      <CkRoute pinned />
      <CkCompare head={{ eyebrow: tx('WITHOUT / WITH', 'ZONDER / MET'), a: tx('Flip the switch.', 'Zet de knop om.'), b: tx('See the difference.', 'Zie het verschil.') }} rows={fs2.compare()} />
      <CkDayInLife head={{ eyebrow: tx("AN ENGINEER'S DAY", 'EEN MONTEURSDAG'), a: tx('From 07:30', 'Van 07:30'), b: tx('to home on time.', 'tot op tijd thuis.') }} steps={fs2.day()} />
      <CkStories dark={false} head={{ eyebrow: tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN'), a: tx('3× more productive.', '3× productiever.'), b: tx('Ask De Ridder.', 'Vraag het De Ridder.') }} stories={fs2.stories()} />
      <CkPackage head={{ eyebrow: 'QUICKSTART', a: tx('Pilot first.', 'Eerst een pilot.'), b: tx('Then the whole team.', 'Dan het hele team.') }} tabs={fs2.tabs()} weeks={fs2.weeks()} glance={fs2.glance()} onCta={onCta} />
      <FsTeaser />
      <CkFaqTabs head={{ eyebrow: tx('QUESTIONS WE GET', 'VRAGEN DIE WE KRIJGEN'), a: tx('Straight', 'Eerlijke'), b: tx('answers.', 'antwoorden.') }} groups={fs2.faq()} />
      <CkTalk onCta={onCta} line={tx('30 minutes to see if your planning can untangle too.', 'In 30 minuten zie je of jouw planning ook kan ontwarren.')} />
      <CkStyles />
    </main>
  );
}

Object.assign(window, { FieldServiceA, FieldServiceB });
