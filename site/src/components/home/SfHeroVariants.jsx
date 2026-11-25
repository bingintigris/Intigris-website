/* ==================================================================== */
/*  Salesforce hero: four new looks to compare (Bing 2026-11-25)          */
/*  Bing didn't like the team photo and the stats card. Headline with the */
/*  spinning word + glossy selector stay (Hero.jsx); these replace the    */
/*  background photo and the right-hand card. Closer to the AI hero.      */
/*    1 · Live org       floating cloud discs + live activity paper card  */
/*    2 · Cloud facade   glass facade with clouds as a coral duotone      */
/*    3 · Cloud orbit    glossy cloud with the Salesforce products around */
/*    4 · Customer 360   data lines flowing into a self-filling record    */
/*  Preview: ?sflook=1|2|3|4 (0 = current photo + stats); bar at bottom.  */
/*  No Salesforce logos: generic cloud glyphs, product names as text.     */
/* ==================================================================== */
import React, { useEffect, useState } from 'react';
import { tx } from '../../lib/i18n.js';

export const SF_LOOKS = [0, 1, 2, 3, 4];
const NAMES = () => ({ 0: tx('Current', 'Huidig'), 1: '1 · Live org', 2: '2 · Cloud facade', 3: '3 · Cloud orbit', 4: '4 · Customer 360' });
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Cloud = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 18.5a4.5 4.5 0 01-.6-8.96A5.5 5.5 0 0117 8.6a4 4 0 01.5 7.96" /><path d="M7.5 18.5h10" />
  </svg>
);

/* read ?sflook once; the bar writes it back to the URL */
export function useSfLook() {
  const [look, set] = useState(0);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    const q = Number(new URLSearchParams(window.location.search).get('sflook'));
    if (SF_LOOKS.includes(q) && new URLSearchParams(window.location.search).has('sflook')) { set(q); setPreview(true); }
  }, []);
  const setLook = (k) => { set(k); const u = new URL(window.location.href); u.searchParams.set('sflook', String(k)); window.history.replaceState(null, '', u); };
  return [look, setLook, preview];
}

export function SfLookBar({ look, setLook }) {
  const N = NAMES();
  return (
    <div className="sfv-bar" role="group" aria-label="Salesforce hero preview">
      <span>{tx('Salesforce hero', 'Salesforce-hero')}</span>
      {SF_LOOKS.map((k) => <button key={k} type="button" className={k === look ? 'on' : ''} onClick={() => setLook(k)}>{N[k]}</button>)}
    </div>
  );
}

/* ---------- background layer per look ---------- */
/* spots kept clear of the header, the headline and the card */
const DISCS = [[58, 26, .8], [62, 80, .95], [44, 92, .7], [4, 93, .8], [97, 24, .75]];
export function SfHeroBg({ look }) {
  if (look === 1) return (
    <div className="sfv-bg" aria-hidden="true">
      <div className="sfv-grid" />
      {DISCS.map(([x, y, s], i) => <span key={i} className="sfv-disc" style={{ left: x + '%', top: y + '%', '--s': s, '--d': (-i * 1.4) + 's' }}><Cloud /></span>)}
    </div>
  );
  if (look === 2) return <div className="sfv-bg" aria-hidden="true"><div className="sfv-facade" /><div className="sfv-facade-shade" /></div>;
  if (look === 3) return <div className="sfv-bg" aria-hidden="true"><div className="sfv-grid sfv-grid--radial" /></div>;
  if (look === 4) return (
    <div className="sfv-bg" aria-hidden="true">
      <svg className="sfv-streams" viewBox="0 0 1440 860" preserveAspectRatio="none">
        {[180, 300, 420, 540, 660].map((y, i) => (
          <g key={i}>
            <path className="sfv-stream" d={`M0 ${y} C 560 ${y}, 760 560, 960 560`} />
            <path className="sfv-stream sfv-stream--hot" style={{ animationDelay: (-i * .7) + 's' }} d={`M0 ${y} C 560 ${y}, 760 560, 960 560`} />
          </g>
        ))}
      </svg>
    </div>
  );
  return null;
}

/* ---------- right-hand visual per look (replaces the stats card) ---------- */
function LiveFeed() {
  const E = [
    { k: 'Sales Cloud', t: tx('Lead converted to opportunity', 'Lead omgezet naar opportunity'), c: 'b' },
    { k: 'Field Service', t: tx('Work order planned · Tue 09:00', 'Werkorder ingepland · di 09:00'), c: 'g' },
    { k: 'Service Cloud', t: tx('Case solved within SLA', 'Case opgelost binnen SLA'), c: 'p' },
    { k: tx('Integrations', 'Koppelingen'), t: tx('Invoice sent to the ERP', 'Factuur naar het ERP gestuurd'), c: 'o' },
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced()) { setN(E.length); return; }
    const t = setTimeout(() => setN((v) => (v >= E.length + 2 ? 1 : v + 1)), n === 0 ? 600 : 1500);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="sfv-card">
      <div className="sfv-card-top"><span className="sfv-dots"><i /><i /><i /></span><span className="sfv-mono">{tx('your org · live', 'jouw org · live')}</span><span className="sfv-live"><i />live</span></div>
      <div className="sfv-feed">
        {E.map((e, i) => (
          <div key={i} className={'sfv-ev' + (i < n ? ' on' : '')}>
            <span className={'sfv-ev-ico sfv-c-' + e.c}><Cloud /></span>
            <div><small className="sfv-mono">{e.k}</small><b>{e.t}</b></div>
            <span className="sfv-ok">✓</span>
          </div>
        ))}
      </div>
      <div className="sfv-card-foot sfv-mono"><span>{tx('one platform, every team', 'één platform, elk team')}</span><span>{tx('illustrative', 'illustratief')}</span></div>
    </div>
  );
}
function Orbit() {
  const P = ['Sales Cloud', 'Service Cloud', 'Field Service', 'Marketing', 'Data Cloud', 'Agentforce', tx('Integrations', 'Koppelingen'), 'Experience'];
  return (
    <div className="sfv-orbit">
      <div className="sfv-ring sfv-ring--1" />
      <div className="sfv-ring sfv-ring--2" />
      <div className="sfv-core"><Cloud /></div>
      <div className="sfv-spin">
        {P.map((p, i) => <span key={p} style={{ '--a': (i * 360 / P.length) + 'deg', '--r': i % 2 ? '96px' : '140px' }}><em>{p}</em></span>)}
      </div>
    </div>
  );
}
function Record360() {
  const F = [
    [tx('Open opportunities', 'Open opportunities'), '3', 'b'],
    [tx('Service case', 'Servicecase'), tx('1 · in progress', '1 · in behandeling'), 'p'],
    [tx('Next work order', 'Volgende werkorder'), tx('Tue 09:00', 'di 09:00'), 'g'],
    [tx('Last invoice', 'Laatste factuur'), tx('paid · via ERP', 'betaald · via ERP'), 'o'],
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced()) { setN(F.length); return; }
    const t = setTimeout(() => setN((v) => (v >= F.length + 2 ? 0 : v + 1)), n === 0 ? 700 : 1100);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="sfv-card sfv-card--360">
      <div className="sfv-360-head">
        <span className="sfv-avatar">VD</span>
        <div><small className="sfv-mono">Account</small><b>Van Dijk BV</b></div>
        <span className="sfv-badge">360°</span>
      </div>
      {F.map(([k, v, c], i) => (
        <div key={k} className={'sfv-field' + (i < n ? ' on' : '')}><span className={'sfv-pip sfv-c-' + c} /><span>{k}</span><b>{v}</b></div>
      ))}
      <div className="sfv-card-foot sfv-mono"><span>{tx('every team, one customer view', 'elk team, één klantbeeld')}</span><span>{tx('illustrative', 'illustratief')}</span></div>
    </div>
  );
}
export function SfHeroSide({ look }) {
  if (look === 1) return <LiveFeed />;
  if (look === 3) return <Orbit />;
  if (look === 4) return <Record360 />;
  return null; /* 2 · facade: no card */
}

export function SfvStyles() { return <style dangerouslySetInnerHTML={{ __html: SFV_CSS }} />; }

const SFV_CSS = `
.sfv-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
/* new looks: headline at the same size as the AI hero (same feel when switching, and room for the visual) */
.sfv-on .display-stack { font-size: clamp(50px, 6.3vw, 112px) !important; }
.sfv-mono { font-family: var(--font-mono, ui-monospace, Menlo, monospace); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
.sfv-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(252,247,235,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(252,247,235,.09) 1px, transparent 1px); background-size: 64px 64px; -webkit-mask-image: radial-gradient(ellipse at 65% 40%, #000, transparent 72%); mask-image: radial-gradient(ellipse at 65% 40%, #000, transparent 72%); }
.sfv-grid--radial { background-image: repeating-radial-gradient(circle at 74% 52%, transparent 0 58px, rgba(252,247,235,.10) 58px 59px); -webkit-mask-image: radial-gradient(circle at 74% 52%, #000 0, transparent 60%); mask-image: radial-gradient(circle at 74% 52%, #000 0, transparent 60%); }
/* 1 · floating cloud discs (same family as the AI hero's agents) */
.sfv-disc { position: absolute; width: calc(58px * var(--s, 1)); height: calc(58px * var(--s, 1)); margin: calc(-29px * var(--s, 1)); border-radius: 50%; display: grid; place-items: center; color: #0b8fd1;
  background: radial-gradient(120% 120% at 30% 20%, #fff, rgba(252,247,235,.92) 48%, rgba(241,228,204,.85)); border: 1px solid rgba(255,255,255,.85);
  box-shadow: inset 0 1px 0 #fff, inset 0 -3px 6px rgba(64,35,1,.08), 0 14px 30px -12px rgba(64,35,1,.6); animation: sfvBob 7s ease-in-out infinite; animation-delay: var(--d); }
.sfv-disc svg { width: 54%; height: 54%; }
@keyframes sfvBob { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
/* paper card (feed + 360) */
.sfv-card { position: relative; width: 100%; max-width: 340px; margin-left: auto; border-radius: 22px; background: var(--intigris-off-white); color: var(--intigris-dark-brown); box-shadow: 0 40px 80px -30px rgba(64,35,1,.55); animation: sfvIn .7s cubic-bezier(.22,.61,.36,1) both; }
@keyframes sfvIn { from { opacity: 0; transform: translateY(24px); } }
.sfv-card-top { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 1px solid rgba(64,35,1,.08); color: rgba(64,35,1,.55); }
.sfv-dots { display: inline-flex; gap: 6px; } .sfv-dots i { width: 9px; height: 9px; border-radius: 9px; background: rgba(64,35,1,.15); }
.sfv-live { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono, monospace); font-size: 11px; text-transform: uppercase; color: #3f8a55; }
.sfv-live i { width: 7px; height: 7px; border-radius: 7px; background: #3f8a55; animation: sfvPulse 1.4s infinite; }
@keyframes sfvPulse { 50% { opacity: .3; } }
.sfv-feed { padding: 12px; display: grid; gap: 7px; min-height: 240px; align-content: start; }
.sfv-ev { display: grid; grid-template-columns: 32px 1fr auto; gap: 10px; align-items: center; padding: 9px 10px; border-radius: 14px; background: #fff; box-shadow: 0 8px 20px -14px rgba(64,35,1,.45); opacity: 0; transform: translateY(10px) scale(.98); transition: opacity .5s cubic-bezier(.22,.61,.36,1), transform .5s cubic-bezier(.22,.61,.36,1); }
.sfv-ev.on { opacity: 1; transform: none; }
.sfv-ev-ico { width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center; }
.sfv-ev-ico svg { width: 20px; height: 20px; }
.sfv-ev small { display: block; color: rgba(64,35,1,.5); font-size: 10px; } .sfv-ev b { font-weight: 500; font-size: 13px; line-height: 1.3; display: block; }
.sfv-ok { width: 22px; height: 22px; border-radius: 7px; display: grid; place-items: center; font-size: 12px; background: rgba(76,105,58,.14); color: #4c693a; }
.sfv-c-b { background: rgba(0,161,224,.12); color: #0b8fd1; } .sfv-c-g { background: rgba(76,105,58,.14); color: #4c693a; }
.sfv-c-p { background: rgba(154,184,226,.3); color: #3f5f8f; } .sfv-c-o { background: rgba(255,95,54,.14); color: #d6431b; }
.sfv-card-foot { display: flex; justify-content: space-between; padding: 12px 18px; border-top: 1px solid rgba(64,35,1,.08); color: rgba(64,35,1,.45); font-size: 10px; }
/* 2 · facade duotone */
.sfv-facade { position: absolute; inset: 0; background: url("/assets/glass-facade-clouds.jpg") center 30% / cover; filter: grayscale(1) contrast(1.15) brightness(1.05); mix-blend-mode: multiply; opacity: .55;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.35) 30%, #000 65%); mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.35) 30%, #000 65%); animation: sfvDrift 30s ease-in-out infinite alternate; }
.sfv-facade-shade { position: absolute; inset: 0; background: radial-gradient(70% 70% at 80% 30%, rgba(255,180,150,.35), transparent 70%); mix-blend-mode: screen; }
@keyframes sfvDrift { from { transform: scale(1.04); } to { transform: scale(1.12) translateX(-2%); } }
/* 3 · orbit */
.sfv-orbit { position: relative; width: 340px; height: 340px; max-width: 100%; margin-left: auto; }
.sfv-ring { position: absolute; left: 50%; top: 50%; border-radius: 50%; border: 1px dashed rgba(252,247,235,.45); transform: translate(-50%, -50%); }
.sfv-ring--1 { width: 192px; height: 192px; } .sfv-ring--2 { width: 280px; height: 280px; border-style: solid; border-color: rgba(252,247,235,.22); }
.sfv-core { position: absolute; left: 50%; top: 50%; width: 88px; height: 88px; margin: -44px; border-radius: 34px; display: grid; place-items: center; color: #0b8fd1;
  background: radial-gradient(120% 120% at 30% 20%, #fff, #fcf7eb 50%, #f1e4cc); box-shadow: inset 0 1px 0 #fff, 0 0 0 12px rgba(252,247,235,.14), 0 30px 60px -20px rgba(64,35,1,.6); animation: sfvCore 4s ease-in-out infinite; }
.sfv-core svg { width: 50px; height: 50px; }
@keyframes sfvCore { 50% { box-shadow: inset 0 1px 0 #fff, 0 0 0 22px rgba(252,247,235,.08), 0 30px 60px -20px rgba(64,35,1,.6); } }
.sfv-spin { position: absolute; inset: 0; animation: sfvRot 60s linear infinite; }
.sfv-spin span { position: absolute; left: 50%; top: 50%; transform: rotate(var(--a)) translate(var(--r)) rotate(calc(-1 * var(--a))); }
.sfv-spin em { display: block; white-space: nowrap; font-style: normal; font-size: 12px; font-weight: 500; padding: 6px 11px; border-radius: 999px; color: var(--intigris-dark-brown);
  background: linear-gradient(180deg, #fff, #fcf7eb); box-shadow: inset 0 1px 0 #fff, 0 10px 24px -12px rgba(64,35,1,.6); animation: sfvRotBack 60s linear infinite; }
@keyframes sfvRot { to { transform: rotate(360deg); } }
@keyframes sfvRotBack { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(-360deg); } }
/* 4 · streams + 360 record */
.sfv-streams { position: absolute; inset: 0; width: 100%; height: 100%; -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent 30%, #000 52%); mask-image: linear-gradient(90deg, transparent 0%, transparent 30%, #000 52%); }
.sfv-stream { fill: none; stroke: rgba(252,247,235,.22); stroke-width: 1.5; }
.sfv-stream--hot { stroke: #fff; stroke-width: 2.5; stroke-dasharray: 60 1400; animation: sfvFlow 3.2s linear infinite; filter: drop-shadow(0 0 6px rgba(255,255,255,.8)); }
@keyframes sfvFlow { from { stroke-dashoffset: 1460; } to { stroke-dashoffset: 0; } }
.sfv-card--360 { padding-bottom: 0; }
.sfv-360-head { display: grid; grid-template-columns: 48px 1fr auto; gap: 12px; align-items: center; padding: 18px; border-bottom: 1px solid rgba(64,35,1,.08); }
.sfv-avatar { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; font-weight: 500; background: var(--intigris-dark-brown); color: var(--intigris-coral); }
.sfv-360-head small { display: block; color: rgba(64,35,1,.5); font-size: 10px; } .sfv-360-head b { font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
.sfv-badge { padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; color: #fff; background: linear-gradient(180deg, #4cc3f0, #00A1E0 55%, #0088c0); box-shadow: inset 0 1px 0 rgba(255,255,255,.5); }
.sfv-field { display: grid; grid-template-columns: 10px 1fr auto; gap: 10px; align-items: center; margin: 7px 12px; padding: 10px 12px; border-radius: 12px; background: #fff; font-size: 13px; opacity: .25; transform: translateX(-10px); transition: opacity .5s cubic-bezier(.22,.61,.36,1), transform .5s cubic-bezier(.22,.61,.36,1); }
.sfv-field.on { opacity: 1; transform: none; box-shadow: 0 8px 20px -14px rgba(64,35,1,.45); }
.sfv-field b { font-weight: 500; }
.sfv-pip { width: 10px; height: 10px; border-radius: 3px; }
.sfv-card--360 .sfv-card-foot { margin-top: 10px; }
/* preview bar (only with ?sflook=...) */
.sfv-bar { position: fixed; z-index: 60; left: 50%; bottom: 18px; transform: translateX(-50%); display: flex; align-items: center; gap: 4px; padding: 6px; border-radius: 999px; background: rgba(20,12,6,.88); color: #fcf7eb; backdrop-filter: blur(12px); box-shadow: 0 16px 40px -12px rgba(0,0,0,.6); max-width: calc(100vw - 24px); overflow-x: auto; }
.sfv-bar > span { padding: 0 10px; font-family: var(--font-mono, monospace); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: rgba(252,247,235,.6); white-space: nowrap; }
.sfv-bar button { border: 0; background: none; color: #fcf7eb; font: inherit; font-size: 13.5px; padding: 9px 14px; border-radius: 999px; cursor: pointer; white-space: nowrap; }
.sfv-bar button.on { background: var(--intigris-coral); color: #2a1300; }
@media (max-width: 860px) { .sfv-disc, .sfv-orbit, .sfv-streams { display: none; } }
@media (prefers-reduced-motion: reduce) { .sfv-disc, .sfv-spin, .sfv-spin em, .sfv-stream--hot, .sfv-facade, .sfv-core, .sfv-card { animation: none !important; } }
`;
