/* ==================================================================== */
/*  Homepage (Salesforce view) · section 4 "Where do you start?"           */
/*  Three design variants for Bing to choose from (review page:            */
/*  /review/home-sections). Same content in all three:                     */
/*  six products, each with the problem, the outcome, what's included,     */
/*  the starting price where a Quickstart exists, and a link.              */
/*  Prices: Quickstart Sales/Service €7,000 · Field Service €13,000 (to    */
/*  confirm) · Agentforce Kickstart €3,950. Data 360 and Slack: no         */
/*  customer claims, price on request.                                     */
/*  Mock screens use the fictional demo company "Havenwerk BV".           */
/* ==================================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { tx, lp } from '../../lib/i18n.js';

export const START_ITEMS = () => [
  {
    id: 'sales', product: 'Sales Cloud', role: tx('I lead sales', 'Ik leid sales'),
    problem: tx('Deals live in inboxes, Excel sheets and people’s heads.', 'Deals staan in inboxen, Excel-lijstjes en hoofden.'),
    outcome: tx('One pipeline and a forecast you can trust.', 'Eén pipeline en een forecast waar je op kunt bouwen.'),
    includes: [tx('Pipeline & forecast', 'Pipeline & forecast'), tx('Outlook / Gmail synced', 'Outlook / Gmail gekoppeld'), tx('Quotes straight from Salesforce', 'Offertes direct uit Salesforce')],
    price: tx('Quickstart · €7,000 fixed', 'Quickstart · €7.000 vaste prijs'), href: '/quickstarts/sales-cloud',
  },
  {
    id: 'service', product: 'Service Cloud', role: tx('I run customer service', 'Ik run de klantenservice'),
    problem: tx('Questions come in by mail, phone and chat, and nobody sees the whole story.', 'Vragen komen binnen via mail, telefoon en chat, en niemand ziet het hele verhaal.'),
    outcome: tx('Every case in one console, with response times you actually keep.', 'Elke case in één console, met reactietijden die je echt haalt.'),
    includes: [tx('Cases, queues & SLAs', 'Cases, wachtrijen & SLA’s'), tx('Knowledge base', 'Kennisbank'), tx('Customer portal', 'Klantportaal')],
    price: tx('Quickstart · €7,000 fixed', 'Quickstart · €7.000 vaste prijs'), href: '/quickstarts/service-cloud',
  },
  {
    id: 'field', product: 'Field Service', role: tx('I plan field engineers', 'Ik plan monteurs'),
    problem: tx('Planning on a whiteboard, work orders on paper, invoices weeks later.', 'Planning op een whiteboard, werkbonnen op papier, facturen weken later.'),
    outcome: tx('Smart scheduling and the whole job on the engineer’s phone.', 'Slim plannen en de hele klus op de telefoon van de monteur.'),
    includes: [tx('Scheduling & routes', 'Planning & routes'), tx('Mobile work orders', 'Mobiele werkbonnen'), tx('Parts & installed base', 'Onderdelen & installaties')],
    price: tx('Quickstart · €13,000 fixed', 'Quickstart · €13.000 vaste prijs'), href: '/quickstarts/field-service',
  },
  {
    id: 'agentforce', product: 'Agentforce', role: tx('I want to start with AI', 'Ik wil starten met AI'),
    problem: tx('AI pilots that never reach a real customer.', 'AI-pilots die nooit bij een echte klant komen.'),
    outcome: tx('An AI agent doing real work, on your own data, with guardrails.', 'Een AI-agent die echt werk doet, op je eigen data, met vangrails.'),
    includes: [tx('Use-case workshop', 'Use-case-workshop'), tx('First agent live', 'Eerste agent live'), tx('Guardrails & monitoring', 'Vangrails & monitoring')],
    price: tx('Kickstart · €3,950', 'Kickstart · €3.950'), href: '/quickstarts/agentforce',
  },
  {
    id: 'data', product: 'Data 360', sub: tx('formerly Data Cloud', 'voorheen Data Cloud'), role: tx('I own our customer data', 'Ik ben eigenaar van onze klantdata'),
    problem: tx('Customer data scattered over five systems that disagree.', 'Klantdata verspreid over vijf systemen die het oneens zijn.'),
    outcome: tx('One customer profile, usable in sales, service and marketing.', 'Eén klantprofiel, bruikbaar in sales, service en marketing.'),
    includes: [tx('Sources connected', 'Bronnen gekoppeld'), tx('One profile per customer', 'Eén profiel per klant'), tx('Segments you can act on', 'Segmenten waar je mee aan de slag kunt')],
    price: tx('On request · certified Data 360 consultants', 'Op aanvraag · gecertificeerde Data 360-consultants'), href: '/services',
  },
  {
    id: 'slack', product: 'Slack', role: tx('I want my team to move faster', 'Ik wil dat mijn team sneller schakelt'),
    problem: tx('Updates get lost between chat, mail and the CRM.', 'Updates raken kwijt tussen chat, mail en het CRM.'),
    outcome: tx('Deals, cases and approvals right where your team already talks.', 'Deals, cases en goedkeuringen precies waar je team al praat.'),
    includes: [tx('Deal & case channels', 'Deal- & case-kanalen'), tx('Approvals in Slack', 'Goedkeuren in Slack'), tx('Agentforce in Slack', 'Agentforce in Slack')],
    price: tx('On request', 'Op aanvraag'), href: '/services',
  },
];

export function StartHead({ dark }) {
  return (
    <div className={'wts-head' + (dark ? ' wts-head--dark' : '')}>
      <div className="eyebrow">{tx('WHERE DO YOU START?', 'WAAR BEGIN JE?')}</div>
      <h2>{tx('Start where it', 'Begin waar het')} <span>{tx('hurts most.', 'nu het meest knelt.')}</span></h2>
      <p>{tx('Most customers start with one fixed-price Quickstart and grow from there. Pick what fits you.', 'De meeste klanten beginnen met één Quickstart tegen een vaste prijs en groeien van daaruit. Kies wat bij jou past.')}</p>
    </div>
  );
}

const Arrow = () => <span aria-hidden="true">→</span>;

/* ---------- mini Salesforce screens (variant B) ---------- */
export function MiniScreen({ id }) {
  const row = (a, b, c, tone) => (
    <div className="wts-row" key={a}><b>{a}</b><span>{b}</span><i className={'wts-chip wts-chip--' + (tone || 'n')}>{c}</i></div>
  );
  const body = {
    sales: [row('Havenwerk BV', tx('12 heat pumps', '12 warmtepompen'), '€ 48k', 'g'), row('Duinzicht Zorg', tx('Demo done', 'Demo gehad'), '€ 18k'), row('Polderbouw', tx('Quote sent', 'Offerte verstuurd'), '€ 31k', 'c')],
    service: [row('#00418', tx('Pump makes noise', 'Pomp maakt geluid'), tx('2h left', 'nog 2u'), 'c'), row('#00417', tx('Invoice question', 'Vraag over factuur'), tx('Solved', 'Opgelost'), 'g'), row('#00415', tx('Maintenance date', 'Onderhoudsdatum'), tx('New', 'Nieuw'))],
    field: [row('08:30', 'Havenwerk BV · Zaandam', tx('On route', 'Onderweg'), 'c'), row('11:00', 'Polderbouw · Purmerend', tx('Planned', 'Gepland')), row('14:15', 'Duinzicht · Haarlem', tx('Parts ready', 'Onderdelen klaar'), 'g')],
    agentforce: null, data: null, slack: null, experience: null,
  }[id];
  return (
    <div className="wts-screen" aria-hidden="true">
      <div className="wts-screen-bar"><span className="wts-dots"><i /><i /><i /></span>{id === 'slack' ? 'Slack · #havenwerk-deal' : 'Salesforce · ' + ({ sales: 'Opportunities', service: 'Service Console', field: tx('Dispatch', 'Planning'), agentforce: 'Agentforce', data: 'Data 360', experience: tx('Customer portal', 'Klantportaal') }[id])}</div>
      <div className="wts-screen-body">
        {body && body}
        {id === 'agentforce' && (
          <div className="wts-chat">
            <div className="wts-msg wts-msg--in">{tx('When is my engineer coming?', 'Wanneer komt mijn monteur?')}</div>
            <div className="wts-msg wts-msg--out"><b>✦ Agentforce</b>{tx('Tomorrow between 8:30 and 9:30. Want a text when he leaves?', 'Morgen tussen 8:30 en 9:30. Wil je een sms als hij vertrekt?')}</div>
            <div className="wts-msg wts-msg--in">{tx('Yes please', 'Ja graag')}</div>
          </div>
        )}
        {id === 'data' && (
          <div className="wts-profile">
            <div className="wts-avatar">NJ</div>
            <div><b>Noor Jansen</b><span>Havenwerk BV</span></div>
            <div className="wts-sources">{['ERP', 'Web', 'Service', 'Mail'].map((s) => <i key={s}>{s}</i>)}</div>
          </div>
        )}
        {id === 'experience' && (
          <div className="wts-portal">
            <div className="wts-portal-hi">{tx('Welcome back, Noor', 'Welkom terug, Noor')} · Havenwerk BV</div>
            <div className="wts-portal-tiles">
              <div><b>4</b><span>{tx('My installations', 'Mijn installaties')}</span></div>
              <div><b>1</b><span>{tx('Open invoice', 'Openstaande factuur')}</span></div>
              <div><b>2</b><span>{tx('Documents', 'Documenten')}</span></div>
            </div>
            <div className="wts-portal-cta">{tx('Plan maintenance →', 'Onderhoud plannen →')}</div>
          </div>
        )}
        {id === 'slack' && (
          <div className="wts-chat">
            <div className="wts-msg wts-msg--sys">Salesforce · {tx('Deal won: Havenwerk BV, € 48k', 'Deal gewonnen: Havenwerk BV, € 48k')} 🎉</div>
            <div className="wts-msg wts-msg--in"><b>Sanne</b>{tx('Discount 8% ok?', 'Korting 8% ok?')}</div>
            <div className="wts-msg wts-msg--sys">✓ {tx('Approved by Mark', 'Goedgekeurd door Mark')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ it, compact }) {
  return (
    <div className="wts-detail">
      <div className="wts-product">{it.product}{it.sub && <small>{it.sub}</small>}</div>
      <p className="wts-problem">{it.problem}</p>
      <p className="wts-outcome">{it.outcome}</p>
      {!compact && <ul className="wts-incl">{it.includes.map((x) => <li key={x}>{x}</li>)}</ul>}
      <div className="wts-foot">
        <span className="wts-price">{it.price}</span>
        <a className="wts-link" href={lp(it.href)}>{tx('More about', 'Meer over')} {it.product} <Arrow /></a>
      </div>
    </div>
  );
}

/* ---------- A · role switcher: "who are you?" ---------- */
export function StartRoles() {
  const items = START_ITEMS();
  const [a, setA] = useState(0);
  const it = items[a];
  return (
    <section className="wts wts--roles">
      <div className="container">
        <StartHead />
        <div className="wts-roles">
          <div className="wts-rolelist" role="tablist">
            {items.map((x, i) => (
              <button key={x.id} role="tab" aria-selected={i === a} className={i === a ? 'on' : ''} onClick={() => setA(i)} onMouseEnter={() => setA(i)}>
                <span>{x.role}</span><em>{x.product}</em>
              </button>
            ))}
          </div>
          <div className="wts-rolecard" key={it.id}><Detail it={it} /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- D · roles on the left + B's product card on the right ---------- */
/* Bing's combination (2026-11-17): A's "who are you?" list switches one big */
/* card that holds B's detail + mini Salesforce screen.                     */
export function StartRolesCard() {
  const items = START_ITEMS();
  const [a, setA] = useState(0);
  const hover = useRef(0);
  const it = items[a];
  // hover intent: only switch when the pointer rests on a row, so moving the mouse
  // diagonally towards the card doesn't flick through the roles it crosses
  const enter = (i) => { clearTimeout(hover.current); hover.current = setTimeout(() => setA(i), 160); };
  const leave = () => clearTimeout(hover.current);
  useEffect(() => () => clearTimeout(hover.current), []);
  return (
    <section className="wts wts--combo">
      <div className="container">
        <StartHead />
        <div className="wts-combo">
          <div className="wts-rolelist wts-rolelist--combo" role="tablist" aria-label={tx('Pick your role', 'Kies je rol')}>
            {items.map((x, i) => (
              <button key={x.id} id={'wts-d-tab-' + x.id} role="tab" aria-selected={i === a} aria-controls="wts-d-panel" className={i === a ? 'on' : ''} onClick={() => { leave(); setA(i); }} onMouseEnter={() => enter(i)} onMouseLeave={leave}>
                <span>{x.role}</span>
              </button>
            ))}
          </div>
          <div className="wts-combocard" id="wts-d-panel" role="tabpanel" aria-labelledby={'wts-d-tab-' + it.id} key={it.id}>
            <Detail it={it} />
            <MiniScreen id={it.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- B · product tabs with a mini Salesforce screen ---------- */
export function StartTabs() {
  const items = START_ITEMS();
  const [a, setA] = useState(0);
  const it = items[a];
  return (
    <section className="wts wts--tabs">
      <div className="container">
        <StartHead dark />
        <div className="wts-tabbar" role="tablist">
          {items.map((x, i) => (
            <button key={x.id} role="tab" aria-selected={i === a} className={i === a ? 'on' : ''} onClick={() => setA(i)}>{x.product}</button>
          ))}
        </div>
        <div className="wts-tabpanel" key={it.id}>
          <Detail it={it} />
          <MiniScreen id={it.id} />
        </div>
      </div>
    </section>
  );
}

/* ---------- C · bento grid, details on hover / focus ---------- */
export function StartBento() {
  const items = START_ITEMS();
  return (
    <section className="wts wts--bento">
      <div className="container">
        <StartHead />
        <div className="wts-bento">
          {items.map((x) => (
            <a key={x.id} href={lp(x.href)} className={'wts-tile wts-tile--' + x.id}>
              <div className="wts-tile-top"><span className="wts-role">{x.role}</span><span className="wts-product">{x.product}{x.sub && <small>{x.sub}</small>}</span></div>
              <p className="wts-outcome">{x.outcome}</p>
              <div className="wts-tile-more">
                <ul className="wts-incl">{x.includes.map((y) => <li key={y}>{y}</li>)}</ul>
                <span className="wts-price">{x.price}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WtsStyles() {
  return <style dangerouslySetInnerHTML={{ __html: WTS_CSS }} />;
}

const WTS_CSS = `
.wts { padding: 120px 0; background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
.wts-head { max-width: 760px; margin-bottom: 56px; }
.wts-head h2 { font-size: clamp(38px, 4.6vw, 64px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 16px 0 0; }
.wts-head h2 span { color: var(--intigris-coral); }
.wts-head p { font-size: 18px; line-height: 1.55; color: var(--fg-muted); margin: 18px 0 0; max-width: 36em; }
.wts-head--dark h2, .wts-head--dark p { color: inherit; }
.wts-head--dark p { opacity: .75; }

.wts-product { font-size: 15px; font-weight: 600; letter-spacing: .01em; display: flex; align-items: baseline; gap: 8px; }
.wts-product small { font-size: 12px; font-weight: 500; opacity: .6; }
.wts-problem { font-size: 16px; line-height: 1.5; color: var(--fg-muted); margin: 18px 0 0; }
.wts-problem::before { content: '✕ '; color: var(--intigris-coral); font-weight: 600; }
.wts-outcome { font-size: clamp(24px, 2.3vw, 32px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; margin: 10px 0 0; }
.wts-incl { list-style: none; padding: 0; margin: 22px 0 0; display: flex; flex-wrap: wrap; gap: 8px; }
.wts-incl li { font-size: 14px; padding: 7px 12px; border-radius: 999px; background: var(--intigris-paper); border: 1px solid var(--border); }
.wts-foot { margin-top: 28px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding-top: 20px; border-top: 1px solid var(--border); }
.wts-price { font-size: 14px; font-weight: 600; }
.wts-link { font-size: 15px; font-weight: 500; color: var(--intigris-coral-700); text-decoration: none; }
.wts-link:hover { text-decoration: underline; }
@keyframes wtsIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

/* A · roles */
.wts-roles { display: grid; grid-template-columns: 1fr 1.05fr; gap: 56px; align-items: start; }
.wts-rolelist { display: flex; flex-direction: column; border-top: 1px solid var(--border); }
.wts-rolelist button { all: unset; cursor: pointer; display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 20px 4px; border-bottom: 1px solid var(--border); transition: color .25s, padding .25s; color: rgba(64,35,1,.45); }
.wts-rolelist button span { font-size: clamp(22px, 2.3vw, 32px); font-weight: 500; letter-spacing: -0.02em; }
.wts-rolelist button em { font-style: normal; font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; opacity: 0; transition: opacity .25s; }
.wts-rolelist button.on { color: var(--intigris-dark-brown); padding-left: 14px; }
.wts-rolelist button.on em { opacity: 1; color: var(--intigris-coral-700); }
.wts-rolelist button:focus-visible { outline: 2px solid var(--intigris-coral); outline-offset: 2px; }
.wts-rolecard { position: sticky; top: 110px; background: var(--intigris-paper); border: 1px solid var(--border); border-radius: 26px; padding: 40px; box-shadow: 0 30px 60px -44px rgba(43,23,0,.45); animation: wtsIn .4s cubic-bezier(.2,.8,.2,1) both; }

/* D · roles + product card (light, like A) */
.wts-combo { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.6fr); gap: 48px; align-items: start; }
.wts-rolelist--combo button { padding: 18px 4px; }
.wts-rolelist--combo button span { font-size: clamp(20px, 1.9vw, 26px); }
.wts-rolelist--combo button:hover { color: rgba(64,35,1,.75); }
.wts-rolelist--combo button::after { content: '→'; font-size: 22px; color: var(--intigris-coral); opacity: 0; transform: translateX(-8px); transition: opacity .25s, transform .25s; }
.wts-rolelist--combo button.on::after { opacity: 1; transform: none; }
.wts-combocard { position: sticky; top: 110px; display: grid; grid-template-columns: 1fr; gap: 28px; background: var(--intigris-paper); color: var(--intigris-dark-brown); border: 1px solid var(--border); border-radius: 28px; padding: 36px; box-shadow: 0 30px 60px -44px rgba(43,23,0,.45); animation: wtsIn .4s cubic-bezier(.2,.8,.2,1) both; }
.wts-combocard .wts-incl li { background: var(--intigris-off-white); }
@media (min-width: 1180px) { .wts-combocard { grid-template-columns: 1fr 1.1fr; align-items: center; min-height: 460px; } }
.wts-combocard .wts-row { grid-template-columns: auto 1fr auto; }
.wts-combocard .wts-row b { white-space: nowrap; }

/* B · tabs + mini screen */
.wts--tabs { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
.wts--tabs .eyebrow { color: rgba(255,250,240,.7); }
.wts-tabbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
.wts-tabbar button { all: unset; cursor: pointer; font-size: 15px; font-weight: 500; padding: 11px 18px; border-radius: 999px; border: 1px solid rgba(255,250,240,.25); color: rgba(255,250,240,.8); transition: background .2s, color .2s; }
.wts-tabbar button.on { background: var(--intigris-coral); border-color: var(--intigris-coral); color: #fff; }
.wts-tabbar button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.wts-tabpanel { display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center; background: var(--intigris-off-white); color: var(--intigris-dark-brown); border-radius: 28px; padding: 44px; animation: wtsIn .4s cubic-bezier(.2,.8,.2,1) both; }
.wts-screen { border-radius: 18px; background: #f3f3f3; border: 1px solid rgba(0,0,0,.08); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(43,23,0,.5); }
.wts-screen-bar { display: flex; align-items: center; gap: 10px; padding: 11px 14px; background: #fff; font-size: 13px; font-weight: 600; color: #032d60; border-bottom: 1px solid #e5e5e5; }
.wts-dots { display: inline-flex; gap: 5px; } .wts-dots i { width: 9px; height: 9px; border-radius: 99px; background: #d9d9d9; }
.wts-screen-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; min-height: 230px; }
.wts-row { display: grid; grid-template-columns: 1fr 1.2fr auto; gap: 12px; align-items: center; background: #fff; border-radius: 10px; padding: 13px 14px; font-size: 14px; box-shadow: 0 1px 2px rgba(0,0,0,.05); animation: wtsIn .45s both; }
.wts-row:nth-child(2) { animation-delay: .08s; } .wts-row:nth-child(3) { animation-delay: .16s; }
.wts-row span { color: #555; }
.wts-chip { font-style: normal; font-size: 12px; font-weight: 600; padding: 4px 9px; border-radius: 99px; background: #eef1f5; color: #333; }
.wts-chip--g { background: #e3f5e9; color: #2e844a; } .wts-chip--c { background: var(--intigris-coral-100); color: var(--intigris-coral-700); }
.wts-chat { display: flex; flex-direction: column; gap: 10px; }
.wts-msg { max-width: 82%; padding: 11px 14px; border-radius: 14px; font-size: 14px; line-height: 1.4; background: #fff; animation: wtsIn .45s both; }
.wts-msg b { display: block; font-size: 12px; margin-bottom: 3px; }
.wts-msg--out { align-self: flex-end; background: #eef4ff; } .wts-msg--out b { color: #0176d3; }
.wts-msg--sys { background: #fff7e6; font-size: 13px; }
.wts-msg:nth-child(2) { animation-delay: .1s; } .wts-msg:nth-child(3) { animation-delay: .2s; }
.wts-profile { display: grid; grid-template-columns: auto 1fr; gap: 14px 16px; align-items: center; background: #fff; border-radius: 14px; padding: 20px; }
.wts-avatar { width: 54px; height: 54px; border-radius: 99px; background: var(--intigris-coral); color: #fff; display: grid; place-items: center; font-weight: 600; }
.wts-profile b { display: block; } .wts-profile span { font-size: 13px; color: #666; }
.wts-sources { grid-column: 1 / -1; display: flex; gap: 8px; flex-wrap: wrap; }
.wts-sources i { font-style: normal; font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 8px; background: #eef4ff; color: #0176d3; }

.wts-portal { display: flex; flex-direction: column; gap: 10px; }
.wts-portal-hi { font-size: 14px; font-weight: 600; color: #032d60; }
.wts-portal-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.wts-portal-tiles div { background: #fff; border-radius: 10px; padding: 12px; box-shadow: 0 1px 2px rgba(0,0,0,.05); animation: wtsIn .45s both; }
.wts-portal-tiles b { display: block; font-size: 22px; color: #0176d3; }
.wts-portal-tiles span { font-size: 12px; color: #555; }
.wts-portal-cta { align-self: flex-start; font-size: 13px; font-weight: 600; padding: 9px 14px; border-radius: 99px; background: #0176d3; color: #fff; }

/* C · bento */
.wts-bento { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: minmax(250px, auto); gap: 16px; }
.wts-tile { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 28px; border-radius: 24px; background: var(--intigris-paper); border: 1px solid var(--border); color: var(--intigris-dark-brown); text-decoration: none; overflow: hidden; transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s; }
.wts-tile--sales, .wts-tile--field { grid-row: span 2; }
.wts-tile--slack { grid-column: span 2; }
.wts-tile--sales { background: var(--intigris-coral); color: #fff; border-color: transparent; }
.wts-tile--field { background: var(--intigris-brown-700); color: var(--intigris-off-white); border-color: transparent; }
.wts-tile--sales .wts-incl li, .wts-tile--field .wts-incl li { background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.25); }
.wts-tile:hover, .wts-tile:focus-visible { transform: translateY(-4px); box-shadow: 0 30px 50px -36px rgba(43,23,0,.6); }
.wts-tile-top { display: flex; flex-direction: column; gap: 6px; }
.wts-role { font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; opacity: .7; }
.wts-tile .wts-outcome { font-size: clamp(22px, 2vw, 28px); }
.wts-tile--sales .wts-outcome, .wts-tile--field .wts-outcome { font-size: clamp(28px, 2.8vw, 40px); }
.wts-tile-more { max-height: 0; opacity: 0; transition: max-height .45s ease, opacity .3s; }
.wts-tile:hover .wts-tile-more, .wts-tile:focus-visible .wts-tile-more, .wts-tile--sales .wts-tile-more, .wts-tile--field .wts-tile-more { max-height: 200px; opacity: 1; }
.wts-tile-more .wts-price { display: block; margin-top: 14px; }

@media (max-width: 960px) {
  .wts { padding: 80px 0; }
  .wts-roles, .wts-tabpanel { grid-template-columns: 1fr; gap: 28px; }
  .wts-rolecard { position: static; padding: 28px; }
  .wts-combo { grid-template-columns: 1fr; gap: 28px; }
  .wts-combocard { position: static; padding: 24px; }
  .wts-tabpanel { padding: 24px; }
  .wts-bento { grid-template-columns: 1fr; }
  .wts-tile--sales, .wts-tile--field { grid-row: auto; }
  .wts-tile--slack { grid-column: auto; }
  .wts-tile-more { max-height: none; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .wts *, .wts *::before { animation: none !important; transition: none !important; } }
`;
