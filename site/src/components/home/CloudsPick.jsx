/* ==================================================================== */
/*  Homepage (Salesforce view) · section 2 "What we implement" round 2     */
/*  Bing (2026-11-23): layout like "Where do you start?" (cloud list left, */
/*  animated card right, like the Sales Cloud hero animation). Never state */
/*  a number of clouds (more will follow). Three concepts on :8004:        */
/*    A · Chaos to order   B · Showcase screen   C · Card deck             */
/*  Content (CLOUDS), icons and mini screens are shared with              */
/*  CloudsOverview.jsx / WhereToStart.jsx. Demo company "Havenwerk BV".   */
/* ==================================================================== */
import React, { useState, useEffect, useRef } from 'react';
import { tx, lp } from '../../lib/i18n.js';
import { CLOUDS, CloudIcon } from './CloudsOverview.jsx';
import { MiniScreen } from './WhereToStart.jsx';

export function PickHead({ dark }) {
  return (
    <div className={'cp-head' + (dark ? ' cp-head--dark' : '')}>
      <div className="eyebrow">{tx('WHAT WE IMPLEMENT', 'WAT WE IMPLEMENTEREN')}</div>
      <h2>{tx('Salesforce,', 'Salesforce,')} <span>{tx('for every team.', 'voor elk team.')}</span></h2>
      <p>{tx('Pick a part of your business and see what changes.', 'Kies een deel van je bedrijf en zie wat er verandert.')}</p>
    </div>
  );
}

/* list on the left with hover intent; auto-advances until the visitor interacts */
function usePick(n, ms = 5600) {
  const [a, setA] = useState(0);
  const [touched, setTouched] = useState(false);
  const hover = useRef(0);
  useEffect(() => {
    if (touched) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setA((x) => (x + 1) % n), ms);
    return () => clearInterval(t);
  }, [touched, n, ms]);
  useEffect(() => () => clearTimeout(hover.current), []);
  const choose = (i) => { clearTimeout(hover.current); setTouched(true); setA(i); };
  const enter = (i) => { clearTimeout(hover.current); hover.current = setTimeout(() => choose(i), 160); };
  const leave = () => clearTimeout(hover.current);
  return { a, choose, enter, leave };
}

function CloudList({ items, p, style }) {
  return (
    <div className={'cp-list cp-list--' + style} role="tablist" aria-label={tx('Choose a cloud', 'Kies een cloud')}>
      {items.map((x, i) => (
        <button key={x.id} role="tab" aria-selected={i === p.a} className={i === p.a ? 'on' : ''}
          onClick={() => p.choose(i)} onMouseEnter={() => p.enter(i)} onMouseLeave={p.leave}>
          {style === 'num' && <i className="cp-num">{String(i + 1).padStart(2, '0')}</i>}
          {style !== 'plain' && <CloudIcon id={x.id} />}
          <span className="cp-list-name">{x.name}<small>{x.who}</small></span>
        </button>
      ))}
    </div>
  );
}

function Foot({ c }) {
  return (
    <div className="cp-foot">
      <span className="cp-price">{c.price}</span>
      <a className="cp-link" href={lp(c.href)}>{tx('More about', 'Meer over')} {c.name} <span aria-hidden="true">→</span></a>
    </div>
  );
}

/* ---------- A · Chaos to order ---------- */
const CHAOS = () => ({
  sales: [['Post-it', tx('Call Havenwerk back!', 'Havenwerk terugbellen!')], ['Inbox', 'RE: FW: offerte v3 FINAL'], ['Excel', 'pipeline_04_def(2).xlsx'], ['WhatsApp', tx('Did anyone speak to Karel?', 'Heeft iemand Karel gesproken?')]],
  service: [['Inbox', tx('3rd mail about order #4471', '3e mail over order #4471')], ['Voicemail', tx('Customer called again', 'Klant belde wéér')], ['Post-it', tx('Who handles this one?', 'Wie pakt deze op?')], ['Chat', tx('Where is my order??', 'Waar blijft mijn bestelling??')]],
  field: [['Whiteboard', tx('Tue: Jan → Zaandam??', 'Di: Jan → Zaandam??')], [tx('Work order', 'Werkbon'), tx('#882 (coffee stain)', '#882 (koffievlek)')], ['Post-it', tx('Part not in the van', 'Onderdeel niet in de bus')], ['WhatsApp', tx('What was the address?', 'Wat was het adres?')]],
  agentforce: [['Doc', tx('AI pilot plan v7', 'AI-pilotplan v7')], ['Slides', tx('Chatbot ideas Q3', 'Chatbot-ideeën Q3')], ['Post-it', tx('Who owns the bot?', 'Van wie is de bot?')], ['Inbox', tx('Pilot on hold', 'Pilot on hold')]],
  experience: [['Inbox', tx('Can you resend my invoice?', 'Kun je mijn factuur nog eens sturen?')], [tx('Phone', 'Telefoon'), tx('Where is my certificate?', 'Waar is mijn certificaat?')], ['Inbox', tx('Dealer price list 2026?', 'Dealerprijslijst 2026?')], ['Post-it', tx('Send docs to Polderbouw', 'Docs naar Polderbouw')]],
  data: [['Excel', 'customers_ERP_export.csv'], ['CRM', 'Havenwerk B.V.'], ['Inbox', tx('Havenwerk BV (new address)', 'Havenwerk BV (nieuw adres)')], ['Excel', 'marketing_list_FINAL.xlsx']],
});
const SPOTS = [[6, 8, -6], [52, 2, 4], [60, 58, -3], [2, 62, 5]];

export function CloudsChaos() {
  const cs = CLOUDS();
  const chaos = CHAOS();
  const p = usePick(cs.length);
  const c = cs[p.a];
  const [phase, setPhase] = useState('chaos');
  useEffect(() => {
    setPhase('chaos');
    // Sales (and clouds without their own intro yet): notes land after ~1 s.
    // Service Cloud (option 1, Bing 2026-11-23): three channels arrive, merge, then land.
    // Field Service (option 1, Bing 2026-11-23): zigzag route draws, then redraws as one loop, then lands.
    const ts = c.id === 'service'
      ? [setTimeout(() => setPhase('merge'), 1500), setTimeout(() => setPhase('order'), 2050)]
      : c.id === 'field'
        ? [setTimeout(() => setPhase('merge'), 1450), setTimeout(() => setPhase('order'), 2650)]
        : [setTimeout(() => setPhase('order'), 950)];
    return () => ts.forEach(clearTimeout);
  }, [p.a]);
  return (
    <section className="cp cp--chaos">
      <div className="container">
        <PickHead />
        <div className="cp-grid">
          <CloudList items={cs} p={p} style="icon" />
          <div className="cp-stage" role="tabpanel" key={c.id}>
            <div className={'cp-chaos cp-chaos--' + phase} aria-hidden="true">
              {c.id === 'service' ? <ServiceChannels /> : c.id === 'field' ? <FieldMap big /> : chaos[c.id].map(([k, v], i) => (
                <div key={i} className={'cp-note cp-note--' + k.toLowerCase().replace(/[^a-z]/g, '')}
                  style={{ left: SPOTS[i][0] + '%', top: SPOTS[i][1] + '%', '--r': SPOTS[i][2] + 'deg', '--d': i * 0.05 + 's' }}>
                  <small>{k}</small>{v}
                </div>
              ))}
            </div>
            <div className={'cp-order' + (phase === 'order' ? ' on' : '')}>
              <div className="cp-order-text">
                <div className="cp-name"><CloudIcon id={c.id} /> {c.name}</div>
                <p className="cp-does">{c.does}</p>
                <p className="cp-result">✓ {c.result}</p>
              </div>
              {c.id === 'service' ? <ServiceCase /> : c.id === 'field' ? <FieldRoute /> : <MiniScreen id={c.id} />}
              <Foot c={c} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Service Cloud opening (option 1): one question arrives by mail, phone and chat,
   the three merge, and the card ends on the single case that holds all three. */
const SERVICE_Q = () => tx('Where is my order?', 'Waar blijft mijn bestelling?');
function ServiceChannels() {
  const chans = [['mail', 'Mail', '09:02', 6, 10], ['phone', tx('Phone', 'Telefoon'), '09:15', 50, 30], ['chat', 'Chat', '09:31', 14, 60]];
  return chans.map(([k, label, time, l, t], i) => (
    <div key={k} className={'cp-chan cp-chan--' + k} style={{ left: l + '%', top: t + '%', '--d': i * 0.35 + 's' }}>
      <small><i />{label} · {time} · Noor, Havenwerk BV</small>{SERVICE_Q()}
    </div>
  ));
}
function ServiceCase() {
  return (
    <div className="cp-case">
      <div className="cp-case-top"><b>Case #00418</b><i>{tx('1 case · 3 channels', '1 case · 3 kanalen')}</i></div>
      <p>{SERVICE_Q()}</p>
      <div className="cp-case-from">Noor · Havenwerk BV</div>
      <div className="cp-case-tl">
        {[['mail', 'Mail', '09:02'], ['phone', tx('Phone', 'Telefoon'), '09:15'], ['chat', 'Chat', '09:31']].map(([k, l, t]) => <span key={k} className={'cp-case-dot cp-case-dot--' + k}>{l} <em>{t}</em></span>)}
      </div>
      <div className="cp-case-foot"><span>{tx('Assigned to', 'Toegewezen aan')} <b>Sanne</b></span><span className="cp-case-sla">{tx('Answer within 2h', 'Antwoord binnen 2u')}</span></div>
    </div>
  );
}

/* Field Service opening (option 1): a zigzag route with wasted kilometres redraws
   itself as one smart loop; the card ends on the planned route with times. */
const FM_PINS = [[60, 40], [300, 70], [110, 200], [330, 230], [200, 130]];   // map positions
const FM_ORDER = [1, 2, 4, 3, 5];                                           // stop number per pin (loop order)
const FM_ZIG = 'M60 40 L330 230 L110 200 L300 70 L200 130 L60 40';
const FM_LOOP = 'M60 40 C120 30 250 40 300 70 C340 110 350 200 330 230 C260 250 160 230 110 200 C80 170 150 140 200 130 C150 110 70 80 60 40';
function FieldMapSvg({ showBad }) {
  return (
    <svg className="cp-fm-svg" viewBox="0 0 400 280" aria-hidden="true">
      <rect width="400" height="280" rx="18" fill="#eef1ea" />
      <path d="M0 160 C100 140 180 190 400 150" stroke="#cfd8e3" strokeWidth="14" fill="none" />
      <path d="M150 0 C170 90 140 180 190 280" stroke="#e2e6dc" strokeWidth="8" fill="none" />
      {showBad && <path className="cp-fm-route cp-fm-bad" d={FM_ZIG} />}
      <path className="cp-fm-route cp-fm-good" d={FM_LOOP} />
      {FM_PINS.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="12" fill="#fff" stroke="#402301" strokeWidth="2" /><text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#402301">{FM_ORDER[i]}</text></g>)}
    </svg>
  );
}
function FieldMap() {
  return (
    <div className="cp-fm">
      <FieldMapSvg showBad />
      <div className="cp-fm-km cp-fm-km--bad">⚠ 143 km · 4 {tx('h', 'u')} 10</div>
      <div className="cp-fm-km cp-fm-km--good">✓ 68 km · 2 {tx('h', 'u')} 05</div>
    </div>
  );
}
function FieldRoute() {
  const stops = [['08:30', 'Havenwerk BV', 'Zaandam'], ['09:20', 'Polderbouw', 'Purmerend'], ['10:15', 'Duinzicht Zorg', 'Hoorn'], ['11:05', 'Kade Installatie', 'Alkmaar'], ['11:50', 'Veldhuis Techniek', 'Castricum']];
  return (
    <div className="cp-route">
      <div className="cp-route-top"><b>{tx('Route · Jan · Tuesday', 'Route · Jan · dinsdag')}</b><i>68 km · 2 {tx('h', 'u')} 05</i></div>
      <div className="cp-route-map"><FieldMapSvg /></div>
      <ol className="cp-route-stops">
        {stops.map(([t, n, city], i) => <li key={n} style={{ animationDelay: 0.1 + i * 0.07 + 's' }}><b>{i + 1}</b><span>{n} <em>{city}</em></span><time>{t}</time></li>)}
      </ol>
    </div>
  );
}

/* ---------- B · Showcase screen ---------- */
export function CloudsShowcase() {
  const cs = CLOUDS();
  const p = usePick(cs.length);
  const c = cs[p.a];
  return (
    <section className="cp cp--show">
      <div className="container">
        <PickHead dark />
        <div className="cp-grid">
          <CloudList items={cs} p={p} style="num" />
          <div className="cp-show" role="tabpanel">
            <div className="cp-show-progress" aria-hidden="true"><i key={c.id} /></div>
            <div className="cp-laptop" key={c.id}>
              <div className="cp-laptop-screen"><MiniScreen id={c.id} /></div>
              <div className="cp-laptop-base" />
            </div>
            <div className="cp-badge cp-badge--problem" key={c.id + 'p'}><b>✕ {tx('Today', 'Nu')}</b>{c.problem}</div>
            <div className="cp-badge cp-badge--result" key={c.id + 'r'}><b>✓ {tx('With', 'Met')} {c.name}</b>{c.result}</div>
            <div className="cp-badge cp-badge--price" key={c.id + 'c'}>{c.price}</div>
            <div className="cp-show-foot"><p className="cp-does">{c.does}</p><a className="cp-link" href={lp(c.href)}>{tx('More about', 'Meer over')} {c.name} <span aria-hidden="true">→</span></a></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- C · Card deck ---------- */
export function CloudsDeck() {
  const cs = CLOUDS();
  const p = usePick(cs.length);
  const c = cs[p.a];
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 });
  };
  const back = [1, 2].map((k) => cs[(p.a + k) % cs.length]);
  return (
    <section className="cp cp--deck">
      <div className="container">
        <PickHead />
        <div className="cp-grid">
          <CloudList items={cs} p={p} style="chip" />
          <div className="cp-deck" ref={ref} onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })} role="tabpanel">
            {back.reverse().map((b, i) => (
              <div key={b.id + 'b'} className={'cp-card cp-card--back cp-card--back' + (2 - i)} aria-hidden="true">
                <div className="cp-name"><CloudIcon id={b.id} /> {b.name}</div>
              </div>
            ))}
            <div className="cp-card cp-card--front" key={c.id} style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
              <div className="cp-card-top"><div className="cp-name"><CloudIcon id={c.id} size={26} /> {c.name}</div><span className="cp-who">{c.who}</span></div>
              <p className="cp-problem">{c.problem}</p>
              <p className="cp-does">{c.does}</p>
              <MiniScreen id={c.id} />
              <Foot c={c} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CpStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CP_CSS }} />;
}

const CP_CSS = `
.cp { padding: 120px 0; background: var(--intigris-off-white); color: var(--intigris-dark-brown); overflow: hidden; }
.cp-head { max-width: 760px; margin-bottom: 52px; }
.cp-head h2 { font-size: clamp(38px, 4.6vw, 64px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 16px 0 0; }
.cp-head h2 span { color: var(--intigris-coral); }
.cp-head p { font-size: 18px; line-height: 1.55; color: var(--fg-muted); margin: 18px 0 0; }
.cp-head--dark .eyebrow { color: rgba(255,250,240,.7); }
.cp-head--dark h2, .cp-head--dark p { color: inherit; } .cp-head--dark p { opacity: .75; }
.cp-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.6fr); gap: 48px; align-items: start; }
.cp-name { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.01em; }
.cp-name .cl-ico { color: var(--intigris-coral); }
.cp-who { font-size: 12.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--intigris-coral-700); }
.cp-problem { font-size: 16px; line-height: 1.5; color: var(--fg-muted); margin: 14px 0 0; }
.cp-problem::before { content: '✕ '; color: var(--intigris-coral); font-weight: 600; }
.cp-does { font-size: clamp(20px, 1.9vw, 26px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.2; margin: 10px 0 0; }
.cp-result { font-size: 16px; font-weight: 600; color: #2e844a; margin: 12px 0 0; }
.cp-foot { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--border); }
.cp-price { font-size: 14px; font-weight: 600; }
.cp-link { font-size: 15px; font-weight: 500; color: var(--intigris-coral-700); text-decoration: none; }
.cp-link:hover { text-decoration: underline; }
@keyframes cpIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

/* shared list */
.cp-list { display: flex; flex-direction: column; }
.cp-list button { all: unset; cursor: pointer; display: flex; align-items: center; gap: 14px; transition: color .25s, background .25s, padding .25s, border-color .25s; }
.cp-list button:focus-visible { outline: 2px solid var(--intigris-coral); outline-offset: 2px; }
.cp-list-name { display: flex; flex-direction: column; font-size: clamp(19px, 1.8vw, 24px); font-weight: 500; letter-spacing: -0.02em; }
.cp-list-name small { font-size: 13px; font-weight: 500; letter-spacing: 0; opacity: .65; margin-top: 2px; }
.cp-list--icon { border-top: 1px solid var(--border); }
.cp-list--icon button { padding: 16px 4px; border-bottom: 1px solid var(--border); color: rgba(64,35,1,.45); }
.cp-list--icon button .cl-ico { color: currentColor; }
.cp-list--icon button:hover { color: rgba(64,35,1,.75); }
.cp-list--icon button.on { color: var(--intigris-dark-brown); padding-left: 14px; }
.cp-list--icon button.on .cl-ico { color: var(--intigris-coral); }
.cp-list--icon button::after { content: '→'; margin-left: auto; font-size: 22px; color: var(--intigris-coral); opacity: 0; transform: translateX(-8px); transition: opacity .25s, transform .25s; }
.cp-list--icon button.on::after { opacity: 1; transform: none; }

/* A · chaos to order */
.cp-stage { position: relative; min-height: 520px; border-radius: 28px; background: radial-gradient(120% 90% at 80% 10%, #ffe1d6 0%, var(--intigris-paper) 55%); border: 1px solid var(--border); overflow: hidden; }
.cp-chaos { position: absolute; inset: 0; }
.cp-note { position: absolute; width: 38%; max-width: 230px; padding: 12px 14px; border-radius: 12px; background: #fff; box-shadow: 0 14px 28px -16px rgba(43,23,0,.45); font-size: 14px; font-weight: 500; line-height: 1.35; transform: rotate(var(--r)); animation: cpFloat 3.2s ease-in-out infinite alternate, cpPop .3s var(--d) cubic-bezier(.2,.8,.2,1) both; transition: transform .45s cubic-bezier(.6,0,.2,1), opacity .35s, left .45s cubic-bezier(.6,0,.2,1), top .45s cubic-bezier(.6,0,.2,1); }
.cp-note small { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .55; margin-bottom: 3px; }
.cp-note--postit { background: #fff3a8; } .cp-note--whatsapp, .cp-note--chat { background: #dcf8c6; } .cp-note--excel { background: #e6f4ea; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; }
.cp-note--whiteboard { background: #f4f6f8; border: 1px solid #d6dbe0; } .cp-note--voicemail, .cp-note--phone, .cp-note--telefoon { background: #ffe6dc; } .cp-note--workorder, .cp-note--werkbon, .cp-note--doc, .cp-note--slides { background: #fbf4e6; }
@keyframes cpFloat { from { translate: 0 0; } to { translate: 0 -8px; } }
@keyframes cpPop { from { opacity: 0; scale: .8; } to { opacity: 1; scale: 1; } }
.cp-chaos--order .cp-note { left: 40% !important; top: 40% !important; transform: rotate(0deg) scale(.3); opacity: 0; }
.cp-order { position: absolute; inset: 28px; display: grid; grid-template-columns: 1fr 1.1fr; grid-template-rows: 1fr auto; gap: 18px 28px; align-items: center; opacity: 0; transform: scale(.94); transition: opacity .4s .12s, transform .4s .12s cubic-bezier(.2,.8,.2,1); pointer-events: none; }
.cp-order.on { opacity: 1; transform: none; pointer-events: auto; }
.cp-order .cp-foot { grid-column: 1 / -1; }

/* A · Service Cloud opening: channels merge into one case */
.cp-chan { position: absolute; width: 44%; max-width: 300px; padding: 14px 16px; border-radius: 14px; background: #fff; box-shadow: 0 16px 30px -18px rgba(43,23,0,.5); font-size: 17px; font-weight: 500; border-left: 5px solid #0176d3; animation: cpPop .35s var(--d) cubic-bezier(.2,.8,.2,1) both; transition: left .45s cubic-bezier(.6,0,.2,1), top .45s cubic-bezier(.6,0,.2,1), transform .45s cubic-bezier(.6,0,.2,1), opacity .3s .15s; }
.cp-chan small { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; opacity: .6; margin-bottom: 5px; }
.cp-chan small i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.cp-chan--mail { border-left-color: #0176d3; } .cp-chan--mail small { color: #0176d3; }
.cp-chan--phone { border-left-color: var(--intigris-coral); } .cp-chan--phone small { color: var(--intigris-coral-700); }
.cp-chan--chat { border-left-color: #2e844a; } .cp-chan--chat small { color: #2e844a; }
.cp-chaos--merge .cp-chan, .cp-chaos--order .cp-chan { left: 30% !important; top: 36% !important; transform: scale(.9); }
.cp-chaos--merge .cp-chan, .cp-chaos--order .cp-chan { animation: none; }
.cp-chaos--order .cp-chan { opacity: 0; transform: scale(.6); }
.cp-case { background: #fff; border-radius: 18px; padding: 20px 22px; box-shadow: 0 30px 60px -30px rgba(43,23,0,.5); border: 1px solid rgba(0,0,0,.06); }
.cp-case-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 14px; }
.cp-case-top b { color: #032d60; }
.cp-case-top i { font-style: normal; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; background: #e3f5e9; color: #2e844a; }
.cp-case p { font-size: 22px; font-weight: 500; letter-spacing: -0.01em; margin: 12px 0 2px; color: #111; }
.cp-case-from { font-size: 13px; color: #666; }
.cp-case-tl { display: flex; flex-direction: column; gap: 8px; margin: 16px 0; padding-left: 14px; border-left: 2px solid #e5e5e5; }
.cp-case-dot { position: relative; font-size: 13.5px; font-weight: 600; color: #333; animation: cpIn .4s both; }
.cp-case-dot:nth-child(2) { animation-delay: .12s; } .cp-case-dot:nth-child(3) { animation-delay: .24s; }
.cp-case-dot::before { content: ''; position: absolute; left: -20px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: #0176d3; }
.cp-case-dot--phone::before { background: var(--intigris-coral); } .cp-case-dot--chat::before { background: #2e844a; }
.cp-case-dot em { font-style: normal; font-weight: 500; color: #888; margin-left: 6px; }
.cp-case-foot { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; padding-top: 12px; border-top: 1px solid #eee; font-size: 13px; color: #555; }
.cp-case-sla { font-weight: 600; padding: 4px 10px; border-radius: 99px; background: var(--intigris-coral-100); color: var(--intigris-coral-700); }

/* A · Field Service opening: zigzag route → one loop */
.cp-fm { position: absolute; inset: 26px; }
.cp-fm-svg { width: 100%; height: 100%; display: block; }
.cp-fm-route { fill: none; stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1400; stroke-dashoffset: 1400; }
.cp-fm-bad { stroke: var(--intigris-coral); animation: cpDraw 1.25s .1s ease-in-out forwards; transition: opacity .35s; }
.cp-fm-good { stroke: #2e844a; }
.cp-fm .cp-fm-good { opacity: 0; }
.cp-chaos--merge .cp-fm-bad { opacity: .15; }
.cp-chaos--merge .cp-fm .cp-fm-good { opacity: 1; animation: cpDraw 1s ease-in-out forwards; }
.cp-chaos--order .cp-fm { opacity: 0; transform: scale(.96); transition: opacity .3s, transform .35s; }
@keyframes cpDraw { to { stroke-dashoffset: 0; } }
.cp-fm-km { position: absolute; right: 18px; bottom: 16px; padding: 9px 15px; border-radius: 99px; background: #fff; font-size: 15px; font-weight: 700; box-shadow: 0 10px 20px -12px rgba(43,23,0,.45); transition: opacity .3s, transform .3s; }
.cp-fm-km--bad { color: var(--intigris-coral-700); animation: cpPop .3s 1s both; }
.cp-fm-km--good { color: #2e844a; opacity: 0; transform: translateY(8px); }
.cp-chaos--merge .cp-fm-km--bad { animation: none; opacity: 0; }
.cp-chaos--merge .cp-fm-km--good { opacity: 1; transform: none; transition-delay: .5s; }
.cp-route { background: #fff; border-radius: 18px; padding: 16px 18px; box-shadow: 0 30px 60px -30px rgba(43,23,0,.5); border: 1px solid rgba(0,0,0,.06); }
.cp-route-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 14px; }
.cp-route-top b { color: #032d60; }
.cp-route-top i { font-style: normal; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; background: #e3f5e9; color: #2e844a; }
.cp-route-map { height: 120px; margin: 10px 0; border-radius: 12px; overflow: hidden; }
.cp-route-map .cp-fm-svg { width: 100%; height: 100%; }
.cp-route-map .cp-fm-good { animation: cpDraw .9s .15s ease-in-out forwards; }
.cp-route-stops { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
.cp-route-stops li { display: grid; grid-template-columns: 20px 1fr auto; gap: 8px; align-items: center; font-size: 13px; animation: cpIn .35s both; }
.cp-route-stops b { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; background: #2e844a; color: #fff; }
.cp-route-stops span { color: #222; font-weight: 500; } .cp-route-stops em { font-style: normal; color: #888; font-weight: 400; margin-left: 4px; }
.cp-route-stops time { font-weight: 600; color: #0176d3; font-variant-numeric: tabular-nums; }

/* B · showcase */
.cp--show { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
.cp-list--num button { padding: 15px 16px; border-radius: 16px; color: rgba(255,250,240,.55); }
.cp-list--num button .cl-ico { color: currentColor; opacity: .8; }
.cp-num { font-style: normal; font-size: 13px; font-weight: 600; opacity: .6; width: 22px; }
.cp-list--num button:hover { color: rgba(255,250,240,.85); }
.cp-list--num button.on { background: rgba(255,250,240,.08); color: #fff; }
.cp-list--num button.on .cl-ico { color: var(--intigris-coral); opacity: 1; }
.cp-show { position: relative; padding: 46px 40px 24px; }
.cp-show-progress { position: absolute; top: 0; left: 40px; right: 40px; height: 3px; background: rgba(255,250,240,.12); border-radius: 3px; overflow: hidden; }
.cp-show-progress i { display: block; height: 100%; background: var(--intigris-coral); transform-origin: left; animation: cpProg 5.6s linear both; }
@keyframes cpProg { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.cp-laptop { width: 84%; margin: 18px auto 0; animation: cpScreen .6s cubic-bezier(.2,.8,.2,1) both; }
@keyframes cpScreen { from { opacity: 0; transform: perspective(900px) rotateX(10deg) translateY(20px); } to { opacity: 1; transform: none; } }
.cp-laptop-screen { padding: 14px; border-radius: 18px 18px 6px 6px; background: #1b1b1f; box-shadow: 0 40px 80px -30px rgba(0,0,0,.7); }
.cp-laptop-screen .wts-screen { box-shadow: none; }
.cp-laptop-base { height: 14px; margin: 0 -6%; border-radius: 0 0 16px 16px; background: linear-gradient(#d9d5cf, #b9b3aa); }
.cp-badge { position: absolute; max-width: 240px; padding: 12px 15px; border-radius: 14px; font-size: 13.5px; line-height: 1.4; box-shadow: 0 20px 40px -20px rgba(0,0,0,.6); animation: cpPop .5s cubic-bezier(.2,.8,.2,1) both; }
.cp-badge b { display: block; font-size: 12px; margin-bottom: 3px; }
.cp-badge--problem { top: 40px; left: 0; background: #fff; color: var(--intigris-dark-brown); animation-delay: .35s; }
.cp-badge--problem b { color: var(--intigris-coral-700); }
.cp-badge--result { top: 52%; right: 0; background: #e3f5e9; color: #1d4d2c; animation-delay: .6s; }
.cp-badge--price { top: 14px; right: 30px; background: var(--intigris-coral); color: #fff; font-weight: 600; animation-delay: .8s; }
.cp-show-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-top: 28px; animation: cpIn .5s .3s both; }
.cp-show-foot .cp-does { margin: 0; max-width: 30em; }
.cp--show .cp-link { color: #ffb59e; white-space: nowrap; }

/* C · card deck */
.cp--deck { background: linear-gradient(160deg, var(--intigris-coral) 0%, #ff7a5c 45%, var(--intigris-coral-700) 100%); color: #fff; }
.cp--deck .cp-head p { color: rgba(255,255,255,.85); } .cp--deck .cp-head h2 span { color: var(--intigris-dark-brown); } .cp--deck .eyebrow { color: rgba(255,255,255,.8); }
.cp-list--chip { gap: 8px; }
.cp-list--chip button { padding: 13px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,.35); color: #fff; }
.cp-list--chip .cp-list-name { flex-direction: row; align-items: baseline; gap: 10px; font-size: 18px; }
.cp-list--chip .cp-list-name small { font-size: 12.5px; }
.cp-list--chip button:hover { background: rgba(255,255,255,.12); }
.cp-list--chip button.on { background: #fff; color: var(--intigris-dark-brown); border-color: #fff; }
.cp-list--chip button.on .cl-ico { color: var(--intigris-coral); }
.cp-deck { position: relative; min-height: 600px; perspective: 1400px; }
.cp-card { position: absolute; left: 6%; right: 6%; top: 0; border-radius: 28px; background: var(--intigris-off-white); color: var(--intigris-dark-brown); box-shadow: 0 40px 70px -40px rgba(64,35,1,.8); }
.cp-card--back { height: 500px; padding: 26px 30px; display: flex; justify-content: flex-end; align-items: flex-start; }
.cp-card--back .cp-name { display: none; }
.cp-card--back1 { transform: translate(9%, 14px) rotate(5deg) scale(.96); background: #ffe1d6; }
.cp-card--back2 { transform: translate(-9%, 30px) rotate(-6deg) scale(.92); background: #ffc9b8; }
.cp-card--front { padding: 32px; display: flex; flex-direction: column; gap: 12px; transition: transform .2s ease-out; animation: cpDeal .65s cubic-bezier(.2,.8,.2,1) both; transform-style: preserve-3d; }
@keyframes cpDeal { from { opacity: 0; translate: 40% 30px; rotate: 10deg; } to { opacity: 1; translate: 0 0; rotate: 0deg; } }
.cp-card-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.cp-card--front .cp-problem, .cp-card--front .cp-does { margin: 0; }
.cp-card--front .wts-screen { margin-top: 6px; }

@media (max-width: 960px) {
  .cp { padding: 80px 0; }
  .cp-grid { grid-template-columns: 1fr; gap: 28px; }
  .cp-stage { min-height: 640px; }
  .cp-order { grid-template-columns: 1fr; inset: 18px; }
  .cp-show { padding: 40px 0 10px; } .cp-laptop { width: 100%; }
  .cp-badge { position: static; max-width: none; margin-top: 10px; }
  .cp-show-foot { flex-direction: column; align-items: flex-start; }
  .cp-deck { min-height: 0; } .cp-card { position: relative; left: 0; right: 0; } .cp-card--back { display: none; }
}
@media (prefers-reduced-motion: reduce) { .cp *, .cp *::before { animation: none !important; transition: none !important; } .cp-order { opacity: 1; transform: none; } .cp-chaos { display: none; } }
`;
