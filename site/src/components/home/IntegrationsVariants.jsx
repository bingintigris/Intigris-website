/* ==================================================================== */
/*  Integrations section · four alternatives for the design review (:8004) */
/*  Bing (2026-11-24): "I like the current one a lot, but let's see if we  */
/*  can make it even cooler." Same eight tools + logos as the live         */
/*  V3LogoHub (CloudKitV3.jsx); same dark background.                       */
/*    A · Orbit (two counter-rotating rings, data pulses to the centre)    */
/*    B · Live sync (beams from each tool into one Salesforce record)       */
/*    C · Logo carousel (rows gliding past a central Salesforce card)      */
/*    D · 3D sphere (logos on a rotating sphere, drag to turn)              */
/* ==================================================================== */
import React, { useState, useEffect, useRef } from 'react';
import { tx } from '../../lib/i18n.js';
import { HSF_INTEGRATIONS } from '../../legacy/components/HomeSalesforce.jsx';

const DIR = '/assets/logos/tools/';
const LOGOS = {
  'Exact Online / Globe': ['exact.svg'], 'AFAS': ['afas.png'], 'Business Central': ['business-central.svg'], 'NetSuite': ['netsuite.png'],
  'Outlook & Gmail': ['outlook.svg', 'gmail.svg'], 'PDF Butler': ['pdf-butler.svg'], 'DocuSign': ['docusign.svg'], 'Twinfield': ['twinfield-wolters-kluwer.svg'],
};
const SHORT = { 'Exact Online / Globe': 'Exact Online', 'Outlook & Gmail': 'Outlook & Gmail', 'Business Central': 'Business Central' };
function Logo({ n, h = 24 }) {
  return <span className="iv-logo">{(LOGOS[n] || []).map((s) => <img key={s} src={DIR + s} alt="" style={{ height: h }} />)}{(n === 'Business Central' || n === 'Twinfield') && <small>{n}</small>}</span>;
}
function Head({ center }) {
  return (
    <div className={'iv-head' + (center ? ' iv-head--c' : '')}>
      <div className="eyebrow">{tx('INTEGRATIONS', 'KOPPELINGEN')}</div>
      <h2>{tx('Connected to', 'Gekoppeld aan')} <span>{tx('everything you use.', 'alles wat je gebruikt.')}</span></h2>
      <p>{tx('Salesforce gets stronger when it talks to the rest of your business. These are connections we build and maintain.', 'Salesforce wordt sterker als het praat met de rest van je bedrijf. Dit zijn koppelingen die wij bouwen en onderhouden.')}</p>
    </div>
  );
}
const SF = () => <img className="iv-sf" src={DIR + 'salesforce.svg'} alt="Salesforce" />;

/* ---------------- A · Orbit ---------------- */
export function IntOrbit() {
  const items = HSF_INTEGRATIONS();
  const [hover, setHover] = useState(null);
  const inner = items.slice(0, 3), outer = items.slice(3);
  const ring = (list, r, cls) => list.map((it, i) => {
    const a = ((360 / list.length) * i) * Math.PI / 180;
    return (
      <div key={it.n} className={'iv-orb-slot ' + cls} style={{ left: 50 + r * Math.sin(a) + '%', top: 50 - r * Math.cos(a) + '%' }}>
        <button className={'iv-orb-tile' + (hover === it.n ? ' on' : '')} onMouseEnter={() => setHover(it.n)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(it.n)} aria-label={it.n}><Logo n={it.n} /></button>
      </div>
    );
  });
  const h = items.find((x) => x.n === hover);
  return (
    <section className="iv iv--orbit">
      <div className="container iv-split">
        <div><Head />
          <div className="iv-caption" key={hover || 'none'}>{h ? <><small>{h.k}</small><b>{h.n}</b><span>{h.d}</span></> : <span className="iv-hint">{tx('Hover a tool to see what it does.', 'Ga met je muis over een tool om te zien wat het doet.')}</span>}</div>
        </div>
        <div className={'iv-orb' + (hover ? ' paused' : '')}>
          <div className="iv-orb-ring iv-orb-ring--in" /><div className="iv-orb-ring iv-orb-ring--out" />
          {[0, 1, 2, 3, 4, 5].map((k) => <i key={k} className="iv-pulse" style={{ '--a': k * 60 + 15 + 'deg', '--d': k * 0.55 + 's' }} />)}
          <div className="iv-orb-center"><SF /><span>{tx('One platform', 'Eén platform')}</span></div>
          <div className="iv-orb-spin iv-orb-spin--in">{ring(inner, 25, 'in')}</div>
          <div className="iv-orb-spin iv-orb-spin--out">{ring(outer, 41, 'out')}</div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- B · Live sync into one record ---------------- */
const SYNC = () => [
  ['Exact Online / Globe', tx('Open orders', 'Open orders'), tx('3 · €18,400', '3 · €18.400')],
  ['Twinfield', tx('Invoices', 'Facturen'), tx('2 paid · 1 open', '2 betaald · 1 open')],
  ['DocuSign', tx('Service contract', 'Servicecontract'), tx('Signed ✓', 'Getekend ✓')],
  ['PDF Butler', tx('Quote', 'Offerte'), 'Q-2026-114.pdf'],
  ['Outlook & Gmail', tx('Last contact', 'Laatste contact'), tx('Mail from Noor, 09:12', 'Mail van Noor, 09:12')],
  ['AFAS', tx('Account manager', 'Accountmanager'), 'Mark de Vries'],
];
export function IntSync() {
  const rows = SYNC();
  const [a, setA] = useState(0);
  useEffect(() => { const t = setInterval(() => setA((x) => (x + 1) % (rows.length + 2)), 1100); return () => clearInterval(t); }, []);
  return (
    <section className="iv iv--sync">
      <div className="container">
        <Head center />
        <div className="iv-sync">
          <div className="iv-sync-tools">
            {rows.map(([n], i) => <div key={n} className={'iv-sync-tool' + (i < a ? ' done' : '') + (i === a ? ' on' : '')}><Logo n={n} h={22} /><span>{SHORT[n] || n}</span></div>)}
          </div>
          <svg className="iv-sync-beams" viewBox="0 0 200 600" preserveAspectRatio="none" aria-hidden="true">
            {rows.map((_, i) => { const y1 = 50 + i * 100, y2 = 146 + i * 81; return <path key={i} className={'iv-beam' + (i === a ? ' on' : '') + (i < a ? ' done' : '')} d={`M0 ${y1} C100 ${y1} 100 ${y2} 200 ${y2}`} pathLength="1" />; })}
          </svg>
          <div className="iv-record">
            <div className="iv-record-top"><SF /><div><small>{tx('Account', 'Account')}</small><b>Havenwerk BV</b></div><i className={a >= rows.length ? 'ok' : ''}>{a >= rows.length ? tx('✓ All in sync', '✓ Alles in sync') : tx('Syncing…', 'Synchroniseren…')}</i></div>
            {rows.map(([n, f, v], i) => <div key={n} className={'iv-field' + (i < a ? ' done' : '') + (i === a ? ' on' : '')}><small>{f}</small><b>{i <= a ? v : '—'}</b><em>{SHORT[n] || n}</em></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- C · Logo carousel ---------------- */
export function IntMarquee() {
  const items = HSF_INTEGRATIONS();
  const row = (list, rev, k) => (
    <div className={'iv-mq-row' + (rev ? ' rev' : '')} key={k}>
      <div className="iv-mq-track">{[...list, ...list, ...list].map((it, i) => <div key={i} className="iv-mq-tile" title={it.d}><Logo n={it.n} h={26} /><span>{it.k}</span></div>)}</div>
    </div>
  );
  return (
    <section className="iv iv--marquee">
      <div className="container"><Head center /></div>
      <div className="iv-mq">
        {row(items.slice(0, 4).concat(items.slice(4, 6)), false, 1)}
        {row(items.slice(4).concat(items.slice(0, 2)), true, 2)}
        {row(items.slice(2, 8), false, 3)}
        <div className="iv-mq-center"><SF /><b>{tx('One platform, everything connected', 'Eén platform, alles gekoppeld')}</b><span>{tx('ERP, accounting, mail, documents and e-signing', 'ERP, boekhouding, mail, documenten en digitaal tekenen')}</span></div>
      </div>
    </section>
  );
}

/* ---------------- D · 3D sphere ---------------- */
export function IntSphere() {
  const items = HSF_INTEGRATIONS();
  const pts = useRef(items.map((_, i) => { const n = items.length, y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i; return [Math.cos(th) * r, y, Math.sin(th) * r]; })).current;
  const [rot, setRot] = useState({ x: 0.3, y: 0 });
  const vel = useRef({ x: 0, y: 0.0045 }); const drag = useRef(null);
  useEffect(() => {
    let raf; const step = () => { setRot((r) => ({ x: r.x + vel.current.x, y: r.y + vel.current.y })); vel.current.x *= 0.95; if (!drag.current) vel.current.y += (0.0045 - vel.current.y) * 0.03; raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, []);
  const down = (e) => { drag.current = { x: e.clientX, y: e.clientY }; };
  const move = (e) => { if (!drag.current) return; vel.current.y = (e.clientX - drag.current.x) * 0.0009; vel.current.x = (e.clientY - drag.current.y) * 0.0009; drag.current = { x: e.clientX, y: e.clientY }; };
  const up = () => { drag.current = null; };
  const proj = ([x, y, z]) => { const cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x); const x1 = x * cy + z * sy, z1 = -x * sy + z * cy; const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx; return [x1, y2, z2]; };
  return (
    <section className="iv iv--sphere">
      <div className="container iv-split">
        <div><Head /><p className="iv-hint">{tx('Drag the sphere to turn it.', 'Sleep aan de bol om hem te draaien.')}</p></div>
        <div className="iv-sph" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
          <div className="iv-sph-glow" />
          <div className="iv-sph-center"><SF /></div>
          {items.map((it, i) => { const [x, y, z] = proj(pts[i]); const s = 0.65 + (z + 1) * 0.3; return (
            <div key={it.n} className="iv-sph-tile" style={{ left: 50 + x * 40 + '%', top: 50 + y * 40 + '%', transform: `translate(-50%, -50%) scale(${s})`, opacity: 0.35 + (z + 1) * 0.33, zIndex: Math.round((z + 1) * 50) }}>
              <Logo n={it.n} h={24} />{z > 0.55 && <small>{it.k}</small>}
            </div>); })}
        </div>
      </div>
    </section>
  );
}

export function IvStyles() { return <style dangerouslySetInnerHTML={{ __html: IV_CSS }} />; }

const IV_CSS = `
.iv { padding: 110px 0; background: var(--intigris-brown-700, #2b1a08); color: var(--intigris-off-white); overflow: hidden; }
.iv-head { max-width: 640px; margin-bottom: 40px; }
.iv-head--c { margin: 0 auto 48px; text-align: center; }
.iv-head .eyebrow { color: rgba(255,250,240,.7); }
.iv-head h2 { font-size: clamp(38px, 4.6vw, 62px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 16px 0 0; color: inherit; }
.iv-head h2 span { color: var(--intigris-coral); }
.iv-head p { font-size: 17px; line-height: 1.55; opacity: .75; margin: 18px 0 0; }
.iv-split { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: 48px; align-items: center; }
.iv-sf { width: 120px; height: auto; filter: drop-shadow(0 14px 26px rgba(0,0,0,.45)); }
.iv-logo { display: inline-flex; align-items: center; gap: 8px; } .iv-logo img { width: auto; max-width: 120px; object-fit: contain; display: block; } .iv-logo small { font-size: 12px; font-weight: 600; color: #333; }
.iv-hint { font-size: 14px; opacity: .6; }
.iv-caption { min-height: 84px; padding-left: 14px; border-left: 3px solid var(--intigris-coral); animation: ivIn .3s both; }
.iv-caption small { display: block; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--intigris-coral); }
.iv-caption b { display: block; font-size: 20px; margin: 2px 0; } .iv-caption span { font-size: 15px; opacity: .75; }
@keyframes ivIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
/* A orbit */
.iv-orb { position: relative; aspect-ratio: 1; width: 100%; max-width: 560px; margin: 0 auto; }
.iv-orb-ring { position: absolute; border-radius: 50%; border: 1px dashed rgba(255,250,240,.18); left: 50%; top: 50%; transform: translate(-50%, -50%); }
.iv-orb-ring--in { width: 50%; height: 50%; } .iv-orb-ring--out { width: 82%; height: 82%; }
.iv-orb-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 3; }
.iv-orb-center::before { content: ''; position: absolute; width: 230px; height: 230px; left: 50%; top: 42%; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(closest-side, rgba(0,161,224,.3), transparent); z-index: -1; }
.iv-orb-center span { font-size: 13px; padding: 5px 12px; border-radius: 99px; background: #3a2108; border: 1px solid rgba(255,250,240,.2); }
.iv-orb-spin { position: absolute; inset: 0; animation: ivSpin 38s linear infinite; }
.iv-orb-spin--out { animation-duration: 56s; animation-direction: reverse; }
.iv-orb.paused .iv-orb-spin, .iv-orb.paused .iv-orb-tile { animation-play-state: paused; }
@keyframes ivSpin { to { transform: rotate(360deg); } }
.iv-orb-slot { position: absolute; width: 0; height: 0; }
.iv-orb-tile { all: unset; cursor: pointer; position: absolute; transform: translate(-50%, -50%); display: grid; place-items: center; min-width: 118px; height: 52px; padding: 6px 12px; border-radius: 14px; background: #fff; box-shadow: 0 12px 26px -14px rgba(0,0,0,.6); transition: box-shadow .3s, scale .3s; animation: ivCounter 38s linear infinite; }
.iv-orb-spin--out .iv-orb-tile { animation: ivCounterR 56s linear infinite; }
@keyframes ivCounter { from { rotate: 0deg; } to { rotate: -360deg; } }
@keyframes ivCounterR { from { rotate: 0deg; } to { rotate: 360deg; } }
.iv-orb-tile.on, .iv-orb-tile:focus-visible { box-shadow: 0 0 0 4px var(--intigris-coral), 0 12px 26px -14px rgba(0,0,0,.6); scale: 1.08; }
.iv-orb-tile img { height: 22px !important; }
.iv-pulse { position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; margin: -4px; border-radius: 50%; background: var(--intigris-coral); box-shadow: 0 0 12px var(--intigris-coral); transform: rotate(var(--a)) translateY(-230px); animation: ivPulse 3.3s var(--d) ease-in infinite; opacity: 0; }
@keyframes ivPulse { 0% { opacity: 0; transform: rotate(var(--a)) translateY(-250px); } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: rotate(var(--a)) translateY(-40px); } }
/* B sync */
.iv-sync { display: grid; grid-template-columns: 240px 1fr minmax(0, 420px); align-items: stretch; gap: 0; max-width: 1080px; margin: 0 auto; height: 480px; }
.iv-sync-tools { display: flex; flex-direction: column; justify-content: space-around; gap: 10px; }
.iv-sync-tool { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 14px; background: rgba(255,250,240,.08); border: 1px solid rgba(255,250,240,.12); transition: background .3s, border-color .3s; }
.iv-sync-tool .iv-logo { background: #fff; border-radius: 8px; padding: 4px 6px; } .iv-sync-tool .iv-logo small { display: none; }
.iv-sync-tool span { font-size: 14px; font-weight: 600; }
.iv-sync-tool.on { background: rgba(255,92,57,.18); border-color: var(--intigris-coral); }
.iv-sync-tool.done { border-color: rgba(46,132,74,.6); }
.iv-sync-beams { width: 100%; height: 100%; }
.iv-beam { fill: none; stroke: rgba(255,250,240,.14); stroke-width: 2; vector-effect: non-scaling-stroke; }
.iv-beam.on { stroke: var(--intigris-coral); stroke-dasharray: .18 .82; animation: ivFlow 1.1s linear infinite; }
.iv-beam.done { stroke: rgba(46,132,74,.7); }
@keyframes ivFlow { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
.iv-record { box-sizing: border-box; height: 100%; background: var(--intigris-off-white); color: var(--intigris-dark-brown); border-radius: 22px; padding: 18px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 30px 60px -30px rgba(0,0,0,.7); }
.iv-record-top { display: flex; align-items: center; gap: 12px; height: 52px; box-sizing: border-box; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
.iv-record-top .iv-sf { width: 54px; filter: none; } .iv-record-top small { display: block; font-size: 11px; color: #0176d3; font-weight: 700; text-transform: uppercase; } .iv-record-top b { font-size: 19px; }
.iv-record-top i { margin-left: auto; font-style: normal; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; background: #eef4ff; color: #0176d3; } .iv-record-top i.ok { background: #e3f5e9; color: #2e844a; }
.iv-field { flex: 1; align-content: center; display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto auto; padding: 8px 12px; border-radius: 12px; background: #fff; border: 1px solid transparent; transition: border-color .3s, background .3s; }
.iv-field small { font-size: 11.5px; color: #777; } .iv-field b { grid-column: 1; font-size: 15px; } .iv-field em { grid-row: 1 / span 2; grid-column: 2; align-self: center; font-style: normal; font-size: 11px; color: #999; }
.iv-field.on { border-color: var(--intigris-coral); background: #fff6f2; } .iv-field.done em { color: #2e844a; } .iv-field.done em::before { content: '✓ '; }
/* C marquee */
.iv-mq { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 30px 0; -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.iv-mq-row { overflow: hidden; }
.iv-mq-track { display: flex; gap: 16px; width: max-content; animation: ivMq 40s linear infinite; }
.iv-mq-row.rev .iv-mq-track { animation-direction: reverse; animation-duration: 46s; }
.iv-mq-row:nth-child(3) .iv-mq-track { animation-duration: 52s; }
.iv-mq:hover .iv-mq-track { animation-play-state: paused; }
@keyframes ivMq { to { transform: translateX(-33.333%); } }
.iv-mq-tile { display: flex; align-items: center; gap: 12px; padding: 14px 22px; border-radius: 16px; background: #fff; color: #333; min-width: 220px; box-shadow: 0 12px 24px -16px rgba(0,0,0,.6); }
.iv-mq-tile span { font-size: 12px; font-weight: 600; color: #888; margin-left: auto; }
.iv-mq-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; padding: 26px 34px; border-radius: 26px; background: rgba(43,26,8,.92); border: 1px solid rgba(255,250,240,.16); backdrop-filter: blur(8px); box-shadow: 0 30px 70px -20px rgba(0,0,0,.8), 0 0 80px rgba(0,161,224,.25); max-width: 360px; }
.iv-mq-center .iv-sf { width: 110px; } .iv-mq-center b { font-size: 19px; } .iv-mq-center span { font-size: 13.5px; opacity: .7; }
/* D sphere */
.iv-sph { position: relative; aspect-ratio: 1; width: 100%; max-width: 540px; margin: 0 auto; cursor: grab; touch-action: none; user-select: none; }
.iv-sph:active { cursor: grabbing; }
.iv-sph-glow { position: absolute; inset: 12%; border-radius: 50%; background: radial-gradient(circle at 50% 45%, rgba(0,161,224,.22), rgba(255,92,57,.08) 55%, transparent 70%); border: 1px solid rgba(255,250,240,.08); }
.iv-sph-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 50; }
.iv-sph-tile { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 14px; border-radius: 14px; background: #fff; box-shadow: 0 12px 26px -14px rgba(0,0,0,.6); pointer-events: none; }
.iv-sph-tile > small { font-size: 10.5px; font-weight: 700; color: var(--intigris-coral-700, #c0392b); text-transform: uppercase; letter-spacing: .04em; }
@media (max-width: 960px) {
  .iv { padding: 80px 0; } .iv-split { grid-template-columns: 1fr; }
  .iv-sync { grid-template-columns: 1fr; height: auto; } .iv-sync-beams { display: none; } .iv-sync-tools { flex-direction: row; flex-wrap: wrap; margin-bottom: 16px; }
  .iv-mq-center { position: relative; left: auto; top: auto; transform: none; margin: 10px auto; }
}
@media (prefers-reduced-motion: reduce) { .iv *, .iv *::before { animation: none !important; } }
`;
