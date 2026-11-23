/* ==================================================================== */
/*  Homepage (Salesforce view) · section 2 "The clouds we implement"       */
/*  Bing (2026-11-23): first section after the hero = a short overview of  */
/*  the six clouds Intigris implements; the visitor picks one and sees     */
/*  what problem it solves. Four concepts for the design review (:8004):   */
/*    A · Orbit            B · Expanding panels                            */
/*    C · Flip cards       D · Stacking cards on scroll                    */
/*  Same content in all four. Prices only where a Quickstart exists        */
/*  (Sales/Service €7,000 · Field Service €13,000 · Agentforce €3,950).    */
/*  Mock screens use the fictional demo company "Havenwerk BV".           */
/* ==================================================================== */
import React, { useState, useEffect, useRef } from 'react';
import { tx, lp } from '../../lib/i18n.js';
import { MiniScreen } from './WhereToStart.jsx';

export const CLOUDS = () => [
  {
    id: 'sales', name: 'Sales Cloud', who: tx('For sales teams', 'Voor salesteams'),
    problem: tx('Deals live in inboxes, Excel sheets and people’s heads.', 'Deals staan in inboxen, Excel-lijstjes en hoofden.'),
    ask: tx('Deals in Excel?', 'Deals in Excel?'),
    does: tx('One pipeline for leads, deals and quotes, synced with Outlook or Gmail.', 'Eén pipeline voor leads, deals en offertes, gekoppeld aan Outlook of Gmail.'),
    result: tx('A forecast you can trust.', 'Een forecast waar je op kunt bouwen.'),
    price: tx('Quickstart · €7,000 fixed', 'Quickstart · €7.000 vaste prijs'), href: '/quickstarts/sales-cloud',
  },
  {
    id: 'service', name: 'Service Cloud', who: tx('For customer service', 'Voor klantenservice'),
    problem: tx('Questions arrive by mail, phone and chat, and nobody sees the whole story.', 'Vragen komen binnen via mail, telefoon en chat, en niemand ziet het hele verhaal.'),
    ask: tx('Customers calling twice?', 'Klanten die twee keer bellen?'),
    does: tx('Every case in one console, with queues, response times and a knowledge base.', 'Elke case in één console, met wachtrijen, reactietijden en een kennisbank.'),
    result: tx('Faster answers, calmer customers.', 'Snellere antwoorden, rustigere klanten.'),
    price: tx('Quickstart · €7,000 fixed', 'Quickstart · €7.000 vaste prijs'), href: '/quickstarts/service-cloud',
  },
  {
    id: 'field', name: 'Field Service', who: tx('For field service', 'Voor de buitendienst'),
    problem: tx('Planning on a whiteboard, work orders on paper, invoices weeks later.', 'Planning op een whiteboard, werkbonnen op papier, facturen weken later.'),
    ask: tx('Planning on a whiteboard?', 'Plannen op een whiteboard?'),
    does: tx('Smart scheduling and the whole job on the engineer’s phone, with FieldBuddy.', 'Slim plannen en de hele klus op de telefoon van de monteur, met FieldBuddy.'),
    result: tx('Fewer wasted trips, invoices the same day.', 'Minder loze ritten, dezelfde dag factureren.'),
    price: tx('Quickstart · €13,000 fixed', 'Quickstart · €13.000 vaste prijs'), href: '/quickstarts/field-service',
  },
  {
    id: 'agentforce', name: 'Agentforce', who: tx('For teams starting with AI', 'Voor teams die starten met AI'),
    problem: tx('AI pilots that never reach a real customer.', 'AI-pilots die nooit bij een echte klant komen.'),
    ask: tx('AI that stays a pilot?', 'AI die een pilot blijft?'),
    does: tx('AI agents that do real work on your own Salesforce data, with guardrails.', 'AI-agents die echt werk doen op je eigen Salesforce-data, met vangrails.'),
    result: tx('A working agent in two weeks.', 'Een werkende agent in twee weken.'),
    price: tx('Kickstart · €3,950', 'Kickstart · €3.950'), href: '/quickstarts/agentforce',
  },
  {
    id: 'experience', name: 'Experience Cloud', who: tx('For customers, partners & dealers', 'Voor klanten, partners & dealers'),
    problem: tx('Customers and partners mail you for information they could look up themselves.', 'Klanten en partners mailen je voor informatie die ze zelf zouden kunnen opzoeken.'),
    ask: tx('Answering the same mails?', 'Steeds dezelfde mails?'),
    does: tx('A portal where customers or partners log in, see their own data and arrange things themselves.', 'Een portaal waar klanten of partners inloggen, hun eigen gegevens zien en zelf dingen regelen.'),
    result: tx('Fewer calls, self-service around the clock.', 'Minder telefoontjes, 24/7 zelf regelen.'),
    price: tx('Price on request', 'Prijs op aanvraag'), href: '/services',
  },
  {
    id: 'data', name: 'Data 360', who: tx('For data & marketing', 'Voor data & marketing'),
    problem: tx('Customer data spread over systems that disagree with each other.', 'Klantdata verspreid over systemen die het onderling oneens zijn.'),
    ask: tx('Five versions of one customer?', 'Vijf versies van één klant?'),
    does: tx('One customer profile combining ERP, website, service and marketing data.', 'Eén klantprofiel dat ERP-, website-, service- en marketingdata samenbrengt.'),
    result: tx('One truth for sales, service and marketing.', 'Eén waarheid voor sales, service en marketing.'),
    price: tx('Price on request', 'Prijs op aanvraag'), href: '/services',
  },
];

/* small line icons, one per cloud */
const ICONS = {
  sales: <path d="M4 18 L9 12 L13 15 L20 6 M15 6 H20 V11" />,
  service: <><path d="M5 13 V11 a7 7 0 0 1 14 0 V13" /><rect x="3.5" y="12" width="4" height="6" rx="1.5" /><rect x="16.5" y="12" width="4" height="6" rx="1.5" /></>,
  field: <><path d="M3 15 H15 V7 H3 Z M15 10 H19 L21 13 V15 H15" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>,
  agentforce: <path d="M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z" />,
  experience: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21 H16 M12 17 V21 M7 9 H12 M7 12 H15" /></>,
  data: <><ellipse cx="12" cy="6" rx="7" ry="2.6" /><path d="M5 6 V18 c0 1.4 3.1 2.6 7 2.6 s7 -1.2 7 -2.6 V6 M5 12 c0 1.4 3.1 2.6 7 2.6 s7 -1.2 7 -2.6" /></>,
};
export function CloudIcon({ id, size = 22 }) {
  return <svg className="cl-ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[id]}</svg>;
}

export function CloudsHead({ dark }) {
  return (
    <div className={'cl-head' + (dark ? ' cl-head--dark' : '')}>
      <div className="eyebrow">{tx('WHAT WE IMPLEMENT', 'WAT WE IMPLEMENTEREN')}</div>
      <h2>{tx('Six clouds,', 'Zes clouds,')} <span>{tx('one view of your customer.', 'één beeld van je klant.')}</span></h2>
      <p>{tx('Pick the part of your business you want to improve and see what Salesforce does for it.', 'Kies het deel van je bedrijf dat je wilt verbeteren en zie wat Salesforce ervoor doet.')}</p>
    </div>
  );
}

function Detail({ c, compact }) {
  return (
    <div className="cl-detail">
      <div className="cl-name"><CloudIcon id={c.id} /> {c.name} <small>{c.who}</small></div>
      <p className="cl-problem">{c.problem}</p>
      <p className="cl-does">{c.does}</p>
      {!compact && <p className="cl-result">→ {c.result}</p>}
      <div className="cl-foot">
        <span className="cl-price">{c.price}</span>
        <a className="cl-link" href={lp(c.href)}>{tx('More about', 'Meer over')} {c.name} <span aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}

/* auto-advance until the visitor interacts */
function useAutoCycle(n, ms = 4200) {
  const [a, setA] = useState(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (touched) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setA((x) => (x + 1) % n), ms);
    return () => clearInterval(t);
  }, [touched, n, ms]);
  return [a, (i) => { setTouched(true); setA(i); }];
}

/* ---------- A · Orbit ---------- */
export function CloudsOrbit() {
  const cs = CLOUDS();
  const [a, pick] = useAutoCycle(cs.length);
  const c = cs[a];
  return (
    <section className="cl cl--orbit">
      <div className="container">
        <CloudsHead />
        <div className="cl-orbit-grid">
          <div className="cl-orbit" role="tablist" aria-label={tx('Choose a cloud', 'Kies een cloud')}>
            <svg className="cl-orbit-lines" viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="150" />
              {cs.map((x, i) => { const ang = (i / cs.length) * Math.PI * 2 - Math.PI / 2; return <line key={x.id} className={i === a ? 'on' : ''} x1="200" y1="200" x2={200 + Math.cos(ang) * 150} y2={200 + Math.sin(ang) * 150} />; })}
            </svg>
            <div className="cl-hub"><b>{tx('Your customer', 'Jouw klant')}</b><span>{tx('one record, every team', 'één dossier, elk team')}</span></div>
            {cs.map((x, i) => {
              const ang = (i / cs.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <button key={x.id} role="tab" aria-selected={i === a} className={'cl-node' + (i === a ? ' on' : '')}
                  style={{ left: `${50 + Math.cos(ang) * 37.5}%`, top: `${50 + Math.sin(ang) * 37.5}%` }}
                  onClick={() => pick(i)} onMouseEnter={() => pick(i)}>
                  <CloudIcon id={x.id} /><span>{x.name}</span>
                </button>
              );
            })}
          </div>
          <div className="cl-orbit-card" key={c.id} role="tabpanel">
            <Detail c={c} />
            <MiniScreen id={c.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- B · Expanding panels ---------- */
export function CloudsPanels() {
  const cs = CLOUDS();
  const [a, pick] = useAutoCycle(cs.length, 5000);
  return (
    <section className="cl cl--panels">
      <div className="container">
        <CloudsHead dark />
        <div className="cl-panels" role="tablist">
          {cs.map((x, i) => (
            <div key={x.id} className={'cl-panel cl-panel--' + x.id + (i === a ? ' on' : '')} role="tab" tabIndex={0} aria-selected={i === a}
              onMouseEnter={() => pick(i)} onClick={() => pick(i)} onFocus={() => pick(i)}>
              <div className="cl-panel-tab"><CloudIcon id={x.id} size={24} /><span>{x.name}</span></div>
              {i === a && (
                <div className="cl-panel-body">
                  <div className="cl-panel-text">
                    <div className="cl-who">{x.who}</div>
                    <h3>{x.name}</h3>
                    <p className="cl-problem">{x.problem}</p>
                    <p className="cl-does">{x.does}</p>
                    <div className="cl-foot"><span className="cl-price">{x.price}</span><a className="cl-link" href={lp(x.href)}>{tx('More', 'Meer')} <span aria-hidden="true">→</span></a></div>
                  </div>
                  <MiniScreen id={x.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- C · Flip cards (problem first) ---------- */
export function CloudsFlip() {
  const cs = CLOUDS();
  const [flipped, setFlipped] = useState(null);
  return (
    <section className="cl cl--flip">
      <div className="container">
        <CloudsHead />
        <div className="cl-flip-grid">
          {cs.map((x) => (
            <div key={x.id} className={'cl-flip' + (flipped === x.id ? ' on' : '')}
              onMouseEnter={() => setFlipped(x.id)} onMouseLeave={() => setFlipped(null)}>
              <button className="cl-flip-inner" aria-expanded={flipped === x.id} onClick={() => setFlipped(flipped === x.id ? null : x.id)}>
                <span className="cl-flip-front">
                  <span className="cl-who">{x.who}</span>
                  <span className="cl-ask">{x.ask}</span>
                  <span className="cl-flip-hint"><CloudIcon id={x.id} size={18} /> {x.name} <em>{tx('flip', 'draai om')} ↻</em></span>
                </span>
                <span className="cl-flip-back">
                  <span className="cl-name"><CloudIcon id={x.id} /> {x.name}</span>
                  <span className="cl-does">{x.does}</span>
                  <span className="cl-result">→ {x.result}</span>
                  <span className="cl-price">{x.price}</span>
                </span>
              </button>
            </div>
          ))}
        </div>
        <p className="cl-flip-more">{tx('Not sure which fits?', 'Twijfel je wat past?')} <a href={lp('/contact')}>{tx('Ask Frank, 30 minutes →', 'Vraag het Frank, 30 minuten →')}</a></p>
      </div>
    </section>
  );
}

/* ---------- D · Stacking cards on scroll ---------- */
export function CloudsStack() {
  const cs = CLOUDS();
  return (
    <section className="cl cl--stack">
      <div className="container">
        <CloudsHead />
        <div className="cl-stack">
          {cs.map((x, i) => (
            <article key={x.id} className={'cl-stack-card cl-stack-card--' + x.id} style={{ top: `${110 + i * 18}px`, zIndex: i + 1 }}>
              <div className="cl-stack-num">{String(i + 1).padStart(2, '0')} / 06</div>
              <Detail c={x} />
              <MiniScreen id={x.id} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CL_CSS }} />;
}

const CL_CSS = `
.cl { padding: 120px 0; background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
.cl-head { max-width: 760px; margin-bottom: 48px; }
.cl-head h2 { font-size: clamp(38px, 4.6vw, 64px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 16px 0 0; }
.cl-head h2 span { color: var(--intigris-coral); }
.cl-head p { font-size: 18px; line-height: 1.55; color: var(--fg-muted); margin: 18px 0 0; max-width: 36em; }
.cl-head--dark .eyebrow { color: rgba(255,250,240,.7); }
.cl-head--dark h2, .cl-head--dark p { color: inherit; } .cl-head--dark p { opacity: .75; }
.cl-ico { flex: none; }
.cl-name { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; flex-wrap: wrap; }
.cl-name .cl-ico { color: var(--intigris-coral); }
.cl-name small { font-size: 13px; font-weight: 500; color: var(--fg-muted); }
.cl-who { font-size: 12.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--intigris-coral-700); }
.cl-problem { font-size: 16px; line-height: 1.5; color: var(--fg-muted); margin: 14px 0 0; }
.cl-problem::before { content: '✕ '; color: var(--intigris-coral); font-weight: 600; }
.cl-does { display: block; font-size: clamp(21px, 2vw, 27px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.2; margin: 10px 0 0; }
.cl-result { display: block; font-size: 16px; font-weight: 600; color: #2e844a; margin: 12px 0 0; }
.cl-foot { margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; }
.cl-price { font-size: 14px; font-weight: 600; }
.cl-link { font-size: 15px; font-weight: 500; color: var(--intigris-coral-700); text-decoration: none; }
.cl-link:hover { text-decoration: underline; }
@keyframes clIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

/* A · orbit */
.cl-orbit-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 56px; align-items: center; }
.cl-orbit { position: relative; aspect-ratio: 1; max-width: 520px; width: 100%; margin: 0 auto; }
.cl-orbit-lines { position: absolute; inset: 0; width: 100%; height: 100%; }
.cl-orbit-lines circle { fill: none; stroke: var(--border); stroke-width: 1.5; stroke-dasharray: 4 6; animation: clSpin 60s linear infinite; transform-origin: 200px 200px; }
.cl-orbit-lines line { stroke: transparent; stroke-width: 2; transition: stroke .3s; }
.cl-orbit-lines line.on { stroke: var(--intigris-coral); }
@keyframes clSpin { to { transform: rotate(360deg); } }
.cl-hub { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 36%; aspect-ratio: 1; border-radius: 50%; background: var(--intigris-brown-700); color: var(--intigris-off-white); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 10px; box-shadow: 0 0 0 10px rgba(255,92,57,.08), 0 0 0 22px rgba(255,92,57,.05); }
.cl-hub b { font-size: clamp(15px, 1.5vw, 19px); font-weight: 600; } .cl-hub span { font-size: 12px; opacity: .7; margin-top: 4px; }
.cl-node { all: unset; position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; padding: 12px 14px; border-radius: 18px; background: var(--intigris-paper); border: 1px solid var(--border); box-shadow: 0 8px 20px -14px rgba(43,23,0,.4); font-size: 13px; font-weight: 600; white-space: nowrap; transition: background .25s, color .25s, transform .25s, box-shadow .25s; }
.cl-node .cl-ico { color: var(--intigris-coral); }
.cl-node.on { background: var(--intigris-coral); color: #fff; transform: translate(-50%, -50%) scale(1.08); box-shadow: 0 14px 30px -14px rgba(255,92,57,.8); }
.cl-node.on .cl-ico { color: #fff; }
.cl-node:focus-visible { outline: 2px solid var(--intigris-coral); outline-offset: 3px; }
.cl-orbit-card { background: var(--intigris-paper); border: 1px solid var(--border); border-radius: 28px; padding: 34px; display: grid; gap: 24px; box-shadow: 0 30px 60px -44px rgba(43,23,0,.45); animation: clIn .4s cubic-bezier(.2,.8,.2,1) both; }

/* B · expanding panels */
.cl--panels { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
.cl-panels { display: flex; gap: 10px; height: 560px; }
.cl-panel { flex: 0 0 76px; min-width: 0; border-radius: 24px; background: rgba(255,250,240,.07); border: 1px solid rgba(255,250,240,.12); cursor: pointer; overflow: hidden; position: relative; transition: flex .55s cubic-bezier(.2,.8,.2,1), background .3s; outline: none; }
.cl-panel:hover, .cl-panel:focus-visible { background: rgba(255,250,240,.12); }
.cl-panel.on { flex: 1 1 auto; background: var(--intigris-off-white); color: var(--intigris-dark-brown); cursor: default; }
.cl-panel-tab { position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 14px; }
.cl-panel-tab span { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 17px; font-weight: 600; white-space: nowrap; letter-spacing: .01em; }
.cl-panel-tab .cl-ico { color: var(--intigris-coral); }
.cl-panel.on .cl-panel-tab { display: none; }
.cl-panel-body { position: absolute; inset: 0; padding: 36px; display: grid; grid-template-columns: 1fr 1.05fr; gap: 32px; align-items: center; animation: clIn .45s .1s both; }
.cl-panel-body h3 { font-size: clamp(30px, 3vw, 42px); font-weight: 500; letter-spacing: -0.03em; margin: 6px 0 0; }

/* C · flip cards */
.cl-flip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.cl-flip { perspective: 1200px; min-height: 300px; }
.cl-flip-inner { all: unset; box-sizing: border-box; position: relative; display: block; width: 100%; height: 100%; min-height: 300px; cursor: pointer; transform-style: preserve-3d; transition: transform .7s cubic-bezier(.2,.8,.2,1); }
.cl-flip.on .cl-flip-inner { transform: rotateY(180deg); }
.cl-flip-inner:focus-visible { outline: 2px solid var(--intigris-coral); outline-offset: 4px; border-radius: 24px; }
.cl-flip-front, .cl-flip-back { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 24px; padding: 28px; display: flex; flex-direction: column; box-sizing: border-box; }
.cl-flip-front { background: var(--intigris-paper); border: 1px solid var(--border); justify-content: space-between; }
.cl-ask { font-size: clamp(28px, 2.7vw, 38px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.05; }
.cl-flip-hint { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
.cl-flip-hint .cl-ico { color: var(--intigris-coral); }
.cl-flip-hint em { margin-left: auto; font-style: normal; font-weight: 500; color: var(--fg-muted); }
.cl-flip-back { background: var(--intigris-coral); color: #fff; transform: rotateY(180deg); gap: 4px; }
.cl-flip-back .cl-name .cl-ico { color: #fff; }
.cl-flip-back .cl-does { font-size: 20px; margin-top: 14px; }
.cl-flip-back .cl-result { color: #fff; opacity: .9; }
.cl-flip-back .cl-price { margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.3); }
.cl-flip:nth-child(2) .cl-flip-front, .cl-flip:nth-child(6) .cl-flip-front { background: var(--intigris-brown-700); color: var(--intigris-off-white); border-color: transparent; }
.cl-flip:nth-child(2) .cl-flip-front .cl-who, .cl-flip:nth-child(6) .cl-flip-front .cl-who, .cl-flip:nth-child(2) .cl-flip-hint em, .cl-flip:nth-child(6) .cl-flip-hint em { color: rgba(255,250,240,.65); }
.cl-flip-more { margin: 28px 0 0; font-size: 16px; color: var(--fg-muted); }
.cl-flip-more a { color: var(--intigris-coral-700); font-weight: 600; text-decoration: none; }

/* D · stacking cards */
.cl-stack { display: flex; flex-direction: column; gap: 40px; padding-bottom: 40px; }
.cl-stack-card { position: sticky; display: grid; grid-template-columns: 1fr 1.05fr; gap: 40px; align-items: center; padding: 40px; border-radius: 30px; background: var(--intigris-paper); border: 1px solid var(--border); box-shadow: 0 -20px 50px -40px rgba(43,23,0,.6); min-height: 400px; box-sizing: border-box; }
.cl-stack-card:nth-child(even) { background: #fffdf8; }
.cl-stack-card--field, .cl-stack-card--data { background: var(--intigris-brown-700) !important; color: var(--intigris-off-white); border-color: transparent; }
.cl-stack-card--field .cl-problem, .cl-stack-card--data .cl-problem, .cl-stack-card--field .cl-name small, .cl-stack-card--data .cl-name small { color: rgba(255,250,240,.7); }
.cl-stack-card--field .cl-foot, .cl-stack-card--data .cl-foot { border-color: rgba(255,250,240,.2); }
.cl-stack-card--field .cl-link, .cl-stack-card--data .cl-link { color: #ffb59e; }
.cl-stack-card--field .cl-result, .cl-stack-card--data .cl-result { color: #8fe0a8; }
.cl-stack-num { position: absolute; top: 18px; right: 26px; font-size: 13px; font-weight: 600; opacity: .5; }

@media (max-width: 960px) {
  .cl { padding: 80px 0; }
  .cl-orbit-grid { grid-template-columns: 1fr; gap: 28px; }
  .cl-orbit { max-width: 380px; }
  .cl-node span { display: none; }
  .cl-node { padding: 12px; }
  .cl-orbit-card { padding: 24px; }
  .cl-panels { flex-direction: column; height: auto; }
  .cl-panel { flex: none; min-height: 64px; }
  .cl-panel-tab { position: static; transform: none; flex-direction: row; padding: 18px 20px; }
  .cl-panel-tab span { writing-mode: horizontal-tb; transform: none; }
  .cl-panel-body { position: static; grid-template-columns: 1fr; padding: 24px; }
  .cl-flip-grid { grid-template-columns: 1fr; }
  .cl-stack-card { grid-template-columns: 1fr; padding: 26px; gap: 22px; }
}
@media (prefers-reduced-motion: reduce) { .cl *, .cl *::before { animation: none !important; transition: none !important; } }
`;
