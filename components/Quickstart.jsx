/* ==================================================================== */
/*  QUICKSTART PAGE TEMPLATE                                             */
/*  Shared by ServiceCloud.html and FieldService.html (Sales Cloud and   */
/*  the Agentforce Kickstart have their own richer pages). Content comes */
/*  from the live Webflow quickstart pages; all copy is tx(EN, NL).      */
/*  Exposes window.QuickstartPage and window.QUICKSTART_LIST.            */
/* ==================================================================== */

const QS_WEEKS = () => [
  { w: tx('Week 1', 'Week 1'), t: tx('Information gathering', 'Informatie verzamelen'), d: tx('Your process, your data, your must-haves.', 'Je proces, je data, je must-haves.') },
  { w: tx('Week 2', 'Week 2'), t: tx('Configuration', 'Configuratie'), d: tx('The core set up in your own Salesforce org.', 'De basis ingericht in je eigen Salesforce-org.') },
  { w: tx('Week 3', 'Week 3'), t: tx('Configuration and demo', 'Configuratie en demo'), d: tx('A walkthrough with your team on real examples.', 'Een walkthrough met je team op echte voorbeelden.') },
  { w: tx('Week 4', 'Week 4'), t: tx('Feedback and go-live', 'Feedback en livegang'), d: tx('Final changes, handover and support on day one.', 'Laatste aanpassingen, overdracht en support op dag één.') },
];

/* Real quotes from the 2023 customer stories (kept in their original English). */
const QS_QUOTES = {
  atag: { name: 'ATAG Warmte', who: 'Sjors Stoffelsen', role: tx('Founder and CEO', 'Oprichter en CEO'),
    quote: 'Their professional expertise has made our service processes more efficient, a valuable partner for our company.' },
  opcharge: { name: 'Opcharge', who: 'Jeroen Prins', role: tx('Managing Operator', 'Managing Operator'),
    quote: 'Intigris excelled in Salesforce implementation with expertise and precise planning, earning our highest recommendation.' },
  alpha: { name: 'Alpha Ventilatie', who: 'Shahab Rezaie', role: tx('Operations Manager', 'Operations Manager'),
    quote: 'We were continually impressed by the level of knowledge and support Intigris provided.' },
};

const QS_PRODUCTS = {
  service: () => ({
    id: 'service', page: 'ServiceCloud.html', title: 'Service Cloud',
    eyebrow: tx('QUICKSTART TO SERVICE CLOUD', 'QUICKSTART NAAR SERVICE CLOUD'),
    h1a: tx('Every question answered,', 'Elke vraag beantwoord,'), h1b: tx('in one place.', 'op één plek.'),
    lede: tx('Salesforce Service Cloud for support teams that want to resolve issues faster. Cases from mail, phone, web and chat land in one queue, with the full customer history next to them. Live in four weeks with our Quickstart.',
             'Salesforce Service Cloud voor supportteams die vragen sneller willen oplossen. Cases uit mail, telefoon, web en chat komen in één wachtrij binnen, met de volledige klanthistorie ernaast. Live in vier weken met onze Quickstart.'),
    benefits: [
      { t: tx('One queue for every channel', 'Eén wachtrij voor elk kanaal'), d: tx('Email, web forms and phone all become cases, routed to the right person.', 'E-mail, webformulieren en telefoon worden allemaal cases, doorgezet naar de juiste persoon.') },
      { t: tx('The whole customer in view', 'De hele klant in beeld'), d: tx('Contacts, contracts, earlier cases and orders on one screen.', 'Contactpersonen, contracten, eerdere cases en orders op één scherm.') },
      { t: tx('Faster answers', 'Sneller antwoord'), d: tx('Templates, a knowledge base and automatic escalation when a case stalls.', 'Templates, een kennisbank en automatische escalatie als een case blijft liggen.') },
      { t: tx('Service levels you can prove', 'Serviceniveaus die je kunt aantonen'), d: tx('Response and resolution times on dashboards for your team and management.', 'Reactie- en oplostijden op dashboards voor je team en management.') },
    ],
    included: [tx('Accounts & contacts', 'Accounts & contactpersonen'), tx('Case management', 'Casemanagement'), tx('Basic setup', 'Basisinrichting'), tx('Reports & dashboards', 'Rapporten & dashboards'), tx('Go-live support', 'Ondersteuning bij livegang')],
    optional: [tx('Extra reports & dashboards', 'Extra rapporten & dashboards'), tx('Mobile app', 'Mobiele app'), tx('Data migration', 'Datamigratie')],
    quotes: ['alpha', 'atag'],
  }),
  field: () => ({
    id: 'field', page: 'FieldService.html', title: 'Field Service',
    eyebrow: tx('QUICKSTART TO FIELD SERVICE', 'QUICKSTART NAAR FIELD SERVICE'),
    h1a: tx('The right engineer,', 'De juiste monteur,'), h1b: tx('first time right.', 'in één keer goed.'),
    lede: tx('Salesforce Field Service, implemented by the team for whom field service is the biggest speciality. Work orders, planning, dispatch and a mobile app for your engineers, so downtime drops and customers know where they stand. Live in four weeks with our Quickstart.',
             'Salesforce Field Service, geïmplementeerd door het team voor wie field service het grootste specialisme is. Werkorders, planning, dispatch en een mobiele app voor je monteurs, zodat stilstand daalt en klanten weten waar ze aan toe zijn. Live in vier weken met onze Quickstart.'),
    benefits: [
      { t: tx('Plan and dispatch in one view', 'Plannen en dispatchen in één overzicht'), d: tx('The dispatch console shows every engineer, job and travel time.', 'De dispatch console toont elke monteur, klus en reistijd.') },
      { t: tx('Engineers with everything on their phone', 'Monteurs met alles op hun telefoon'), d: tx('Work orders, asset history and checklists in the mobile app, also offline.', 'Werkorders, assethistorie en checklists in de mobiele app, ook offline.') },
      { t: tx('Assets and locations in order', 'Assets en locaties op orde'), d: tx('Know what is installed where, and what was done to it last time.', 'Weet wat waar geïnstalleerd is en wat er de vorige keer aan gedaan is.') },
      { t: tx('Grows with you', 'Groeit met je mee'), d: tx('Add scheduling optimisation, maintenance plans and inventory when you are ready.', 'Voeg planningsoptimalisatie, onderhoudsplannen en voorraad toe wanneer je er klaar voor bent.') },
    ],
    included: [tx('Field Service basic setup', 'Field Service basisinrichting'), tx('Accounts & contacts', 'Accounts & contactpersonen'), tx('Case management', 'Casemanagement'), tx('Work order management', 'Werkorderbeheer'), tx('Asset & location management', 'Asset- & locatiebeheer'), tx('Dispatch console', 'Dispatch console'), tx('Mobile app', 'Mobiele app'), tx('Go-live support', 'Ondersteuning bij livegang')],
    optional: [tx('Extra reports & dashboards', 'Extra rapporten & dashboards'), tx('Inventory management', 'Voorraadbeheer'), tx('Data import', 'Data-import'), tx('Custom flows & code', 'Custom flows & code'), tx('Optimisation & advanced scheduling', 'Optimalisatie & geavanceerde planning'), tx('Visual Remote Assistant & Appointment Assistant', 'Visual Remote Assistant & Appointment Assistant'), tx('Maintenance plans', 'Onderhoudsplannen')],
    quotes: ['atag', 'opcharge'],
  }),
};

/* The four quickstarts, used by the overview page and the "other quickstarts" row. */
const QUICKSTART_LIST = () => [
  { id: 'sales', page: 'SalesCloud.html', title: 'Sales Cloud', d: tx('One pipeline for every deal and every rep. Live in four weeks.', 'Eén pipeline voor elke deal en elke verkoper. Live in vier weken.') },
  { id: 'service', page: 'ServiceCloud.html', title: 'Service Cloud', d: tx('Resolve customer questions faster, from every channel. Live in four weeks.', 'Klantvragen sneller oplossen, uit elk kanaal. Live in vier weken.') },
  { id: 'field', page: 'FieldService.html', title: 'Field Service', d: tx('Work orders, planning and a mobile app for your engineers. Live in four weeks.', 'Werkorders, planning en een mobiele app voor je monteurs. Live in vier weken.') },
  { id: 'agentforce', page: 'Agentforce.html', title: 'Agentforce Kickstart', d: tx('Your first working AI agent on your own data, in two weeks.', 'Je eerste werkende AI-agent op je eigen data, in twee weken.') },
];

function QsOthers({ current }) {
  return (
    <div className="qs-cards">
      {QUICKSTART_LIST().filter(q => q.id !== current).map(q => (
        <a key={q.id} className="qs-card" href={q.page}>
          <span className="eyebrow eyebrow--bare">QUICKSTART</span>
          <b>{q.title}</b>
          <span>{q.d}</span>
          <span className="qs-card-more">{tx('Read more', 'Lees meer')} <span aria-hidden>→</span></span>
        </a>
      ))}
    </div>
  );
}

function QsQuotes({ ids }) {
  return (
    <div className="qs-quotes">
      {ids.map(id => { const q = QS_QUOTES[id]; return (
        <figure key={id} className="qs-quote">
          <blockquote>“{q.quote}”</blockquote>
          <figcaption><b>{q.who}</b><span>{q.role}, {q.name}</span></figcaption>
        </figure>
      ); })}
    </div>
  );
}

function QuickstartPage({ product, onCta }) {
  const p = QS_PRODUCTS[product]();
  return (
    <main style={{ background: 'var(--intigris-off-white)' }}>
      <section className="sc-hero">
        <div aria-hidden className="sc-hero-photo" />
        <div aria-hidden className="sc-hero-fade" />
        <div className="container-wide sc-hero-inner">
          <div className="sc-hero-grid">
            <div>
              <div className="eyebrow eyebrow--dark" style={{ marginBottom: 22 }}>{p.eyebrow}</div>
              <h1 className="sc-h1">{p.h1a} <span>{p.h1b}</span></h1>
              <p className="sc-lede-dark">{p.lede}</p>
              <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn sc-btn-dark" onClick={onCta}>{tx('Book a 30-min call', 'Plan een gesprek van 30 min')} <span className="arrow">→</span></button>
                <a className="btn btn-outline-light" href="#plan">{tx('See the four weeks', 'Bekijk de vier weken')} <span className="arrow">↓</span></a>
              </div>
            </div>
            <div className="qs-hero-card">
              <div className="qs-hero-eyebrow">QUICKSTART</div>
              <div className="qs-hero-num">{tx('4 weeks', '4 weken')}</div>
              <div className="qs-hero-sub">{tx('From kick-off to go-live', 'Van kick-off tot livegang')}</div>
              <ul>
                <li>{tx('Fixed scope, fixed price', 'Vaste scope, vaste prijs')}</li>
                <li>{tx('Built in your own Salesforce org', 'Gebouwd in je eigen Salesforce-org')}</li>
                <li>{tx('Salesforce partner since 2010', 'Salesforce-partner sinds 2010')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide sc-section">
        <div className="section-head sc-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('WHAT IT IS', 'WAT HET IS')}</div>
            <h2 className="display-md">{tx('What', 'Wat')} {p.title} <span style={{ color: 'var(--intigris-coral)' }}>{tx('does for your team.', 'voor je team doet.')}</span></h2>
          </div>
        </div>
        <div className="qs-benefits">
          {p.benefits.map((b, i) => (
            <div key={i} className="qs-benefit"><span className="sc-ba-check" aria-hidden>✓</span><div><b>{b.t}</b><span>{b.d}</span></div></div>
          ))}
        </div>
      </section>

      <section id="plan" className="sc-section sc-section--rule">
        <div className="container-wide">
          <div className="section-head sc-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('THE QUICKSTART', 'DE QUICKSTART')}</div>
              <h2 className="display-md">{tx('Running on Salesforce', 'Draaien op Salesforce')} <span style={{ color: 'var(--intigris-coral)' }}>{tx('in four weeks.', 'in vier weken.')}</span></h2>
            </div>
          </div>
          <div className="sc-offers">
            <article className="sc-offer sc-offer--hi">
              <div className="eyebrow eyebrow--bare">{tx('WEEK BY WEEK', 'WEEK VOOR WEEK')}</div>
              <ol className="sc-weeks">
                {QS_WEEKS().map((w, i) => <li key={i}><small>{w.w}</small><b>{w.t}</b><span>{w.d}</span></li>)}
              </ol>
              <button className="btn btn-primary" onClick={onCta}>{tx("Let's scope it", 'Laten we het scopen')} <span className="arrow">→</span></button>
            </article>
            <article className="sc-offer">
              <div className="sc-offer-inc">
                <small>{tx('Included', 'Inbegrepen')}</small>
                <ul className="qs-list">{p.included.map((x, i) => <li key={i}>{x}</li>)}</ul>
                <small style={{ marginTop: 14 }}>{tx('Can be extended with', 'Uit te breiden met')}</small>
                <ul className="qs-list qs-list--soft">{p.optional.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="sc-section sc-section--coral">
        <div className="container-wide">
          <div className="section-head sc-head">
            <div>
              <div className="eyebrow eyebrow--dark" style={{ marginBottom: 20 }}>{tx('CUSTOMERS', 'KLANTEN')}</div>
              <h2 className="display-md">{tx('Teams that', 'Teams die')} <span style={{ color: 'var(--intigris-off-white)', fontStyle: 'italic' }}>{tx('run on it.', 'erop draaien.')}</span></h2>
            </div>
          </div>
          <QsQuotes ids={p.quotes} />
        </div>
      </section>

      <section className="sc-section">
        <div className="container-wide">
          <div className="section-head sc-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('OTHER QUICKSTARTS', 'ANDERE QUICKSTARTS')}</div>
              <h2 className="display-md">{tx('Start somewhere', 'Ergens anders')} <span style={{ color: 'var(--intigris-coral)' }}>{tx('else?', 'beginnen?')}</span></h2>
            </div>
          </div>
          <QsOthers current={p.id} />
        </div>
      </section>
      <QuickstartStyles />
    </main>
  );
}

/* Styles shared by the quickstart pages and the overview (sc-* mirrors SalesCloud.html). */
function QuickstartStyles() {
  return (
    <style>{`
      .sc-section { padding-top: clamp(64px, 8vw, 112px); padding-bottom: clamp(64px, 8vw, 112px); }
      .sc-section--coral { background: var(--intigris-coral); color: var(--intigris-dark-brown); }
      .sc-section--coral .display-md { color: var(--intigris-dark-brown); }
      .sc-section--rule { position: relative; }
      .sc-section--rule::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--intigris-coral); }
      .sc-head { grid-template-columns: 1fr; }
      .sc-head .display-md { text-wrap: balance; max-width: none; }
      .sc-hero { position: relative; overflow: hidden; isolation: isolate; background: linear-gradient(90deg, #ff9166 0%, var(--intigris-coral) 44%, var(--intigris-coral-700) 80%, #9e300d 100%); color: var(--intigris-off-white); border-bottom-left-radius: clamp(24px, 4vw, 56px); border-bottom-right-radius: clamp(24px, 4vw, 56px); }
      .sc-hero-photo { position: absolute; inset: 0; z-index: 0; background: url("assets/hero-team.jpg") center right / cover; mix-blend-mode: multiply; opacity: .5; -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent 30%, #000 72%); mask-image: linear-gradient(90deg, transparent 0%, transparent 30%, #000 72%); }
      .sc-hero-fade { position: absolute; inset: 0; z-index: 0; background: linear-gradient(180deg, rgba(64,35,1,0) 40%, rgba(64,35,1,.28) 100%); }
      .sc-hero-inner { position: relative; z-index: 1; padding-top: clamp(132px, 17vh, 200px); padding-bottom: clamp(56px, 8vh, 96px); }
      .sc-hero-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); align-items: end; }
      .sc-h1 { font-size: clamp(42px, 5.8vw, 84px); font-weight: 500; letter-spacing: -.03em; line-height: .98; margin: 0; color: var(--intigris-off-white); text-wrap: balance; }
      .sc-h1 span { color: var(--intigris-dark-brown); font-style: italic; }
      .sc-lede-dark { margin-top: 26px; max-width: 600px; font-size: 18px; font-weight: 400; line-height: 1.55; color: rgba(252,247,235,.94); }
      .eyebrow--dark { color: var(--intigris-dark-brown); } .eyebrow--dark::before { background: var(--intigris-dark-brown); }
      .sc-btn-dark { background: var(--intigris-dark-brown); color: var(--intigris-off-white); } .sc-btn-dark:hover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }

      .qs-hero-card { justify-self: end; width: 100%; max-width: 380px; background: rgba(252,247,235,.14); border: 1px solid rgba(252,247,235,.34); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 20px; padding: 26px; }
      .qs-hero-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .14em; color: var(--intigris-dark-brown); }
      .qs-hero-num { font-size: clamp(44px, 4.4vw, 60px); font-weight: 500; letter-spacing: -.03em; line-height: 1; margin-top: 10px; }
      .qs-hero-sub { font-size: 14px; margin-top: 8px; color: rgba(252,247,235,.9); }
      .qs-hero-card ul { list-style: none; margin: 18px 0 0; padding: 0; }
      .qs-hero-card li { padding: 12px 0; border-top: 1px solid rgba(252,247,235,.22); font-size: 15px; font-weight: 500; }
      .qs-hero-card li::before { content: "✓"; color: var(--intigris-dark-brown); font-weight: 700; margin-right: 10px; }

      .qs-benefits { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .qs-benefit { display: flex; gap: 14px; align-items: flex-start; background: var(--intigris-paper); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: clamp(20px, 2.6vw, 30px); }
      .qs-benefit div { display: flex; flex-direction: column; gap: 6px; }
      .qs-benefit b { font-size: 21px; font-weight: 500; letter-spacing: -.015em; line-height: 1.25; }
      .qs-benefit span:not(.sc-ba-check) { font-size: 15px; line-height: 1.5; color: var(--fg-muted); }
      .sc-ba-check { width: 22px; height: 22px; border-radius: 999px; background: var(--intigris-coral); color: var(--intigris-dark-brown); display: grid; place-items: center; font-size: 12px; font-weight: 700; flex: none; margin-top: 3px; }

      .sc-offers { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: stretch; }
      .sc-offer { background: var(--intigris-off-white-200); border: 1px solid var(--intigris-brown-100); border-radius: var(--radius-xl); padding: clamp(24px, 3vw, 36px); display: flex; flex-direction: column; gap: 18px; }
      .sc-offer--hi { color: #fff; background: var(--intigris-coral); border-color: var(--intigris-coral); box-shadow: 0 24px 60px -40px rgba(255,95,54,.55); }
      .sc-offer--hi .eyebrow { color: rgba(255,255,255,.85); }
      .sc-offer--hi .btn-primary { background: var(--intigris-dark-brown); color: var(--intigris-off-white); align-self: flex-start; }
      .sc-weeks { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .sc-weeks li { background: #ff7a55; border: 1px solid rgba(255,255,255,.35); border-radius: 14px; padding: 12px 14px; display: flex; flex-direction: column; gap: 3px; }
      .sc-weeks small { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.85); font-weight: 600; }
      .sc-weeks b { font-size: 14.5px; font-weight: 500; color: #fff; }
      .sc-weeks span { font-size: 12.5px; color: var(--intigris-dark-brown); line-height: 1.4; }
      .sc-offer-inc { display: flex; flex-direction: column; gap: 6px; font-size: 14.5px; color: var(--intigris-dark-brown); }
      .sc-offer-inc small { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--fg-muted); font-weight: 600; }
      .qs-list { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
      .qs-list li { padding: 7px 12px; border-radius: 999px; background: var(--intigris-coral); color: var(--intigris-dark-brown); font-size: 13.5px; font-weight: 500; }
      .qs-list--soft li { background: var(--intigris-paper); border: 1px solid var(--border); }

      .qs-quotes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .qs-quote { margin: 0; background: var(--intigris-off-white); border-radius: var(--radius-xl); padding: clamp(24px, 3vw, 40px); display: flex; flex-direction: column; justify-content: space-between; gap: 20px; }
      .qs-quote blockquote { margin: 0; font-size: clamp(20px, 2vw, 26px); font-weight: 600; letter-spacing: -.02em; line-height: 1.25; color: var(--intigris-dark-brown); }
      .qs-quote figcaption { display: flex; flex-direction: column; gap: 2px; font-size: 14px; color: var(--fg-muted); }
      .qs-quote figcaption b { color: var(--intigris-dark-brown); font-weight: 600; }

      .qs-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
      .qs-card { display: flex; flex-direction: column; gap: 8px; padding: clamp(20px, 2.6vw, 30px); border-radius: var(--radius-xl); background: var(--intigris-paper); border: 1px solid var(--border); color: var(--intigris-dark-brown); text-decoration: none; transition: border-color 200ms var(--ease-out), transform 200ms var(--ease-out); }
      .qs-card:hover { border-color: var(--intigris-coral); transform: translateY(-2px); }
      .qs-card b { font-size: 24px; font-weight: 500; letter-spacing: -.02em; }
      .qs-card > span:not(.eyebrow) { font-size: 15px; line-height: 1.5; color: var(--fg-muted); }
      .qs-card .qs-card-more { margin-top: auto; padding-top: 8px; color: var(--intigris-coral-700); font-weight: 500; }

      @media (max-width: 980px) {
        .sc-hero-grid, .sc-offers, .qs-benefits, .qs-quotes { grid-template-columns: 1fr; }
        .sc-hero-grid { align-items: start; } .qs-hero-card { justify-self: start; }
      }
      @media (max-width: 620px) { .sc-weeks { grid-template-columns: 1fr; } }
    `}</style>
  );
}

Object.assign(window, { QuickstartPage, QuickstartStyles, QsOthers, QsQuotes, QUICKSTART_LIST });
