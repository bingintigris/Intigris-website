/* ==================================================================== */
/*  "Why Intigris" round 2 (Bing 2026-11-24): a mix of C (statement) and D */
/*  (timeline): reasons STACKED with an ACTIVE SCROLL LINE and a cool      */
/*  scroll effect. Reasons: the current site's three promises (Best        */
/*  quality / On time delivery / Continuous support, wording from          */
/*  legacy/components/WhyIntigris.jsx) + Summit Partner + 4.5★.            */
/*    1 · Scroll line along the reasons (sticky title left)                */
/*    2 · Pinned stage (one reason at a time, SplitText)                   */
/*    3 · Centre line, zigzag                                               */
/*  Proof visuals only use documented facts (since 2010, 300+ projects,    */
/*  SLA P1 response 4 h, Summit since 2026, CSAT 4.5).                     */
/* ==================================================================== */
import React, { useEffect, useRef, useState } from 'react';
import { tx, lp } from '../../lib/i18n.js';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function useGsap(ref, build) {
  useEffect(() => {
    let ctx, alive = true;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      if (!alive || !ref.current || reduced()) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      ctx = gsap.context(() => build(gsap, ScrollTrigger, SplitText), ref);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, []);
}
const SUMMIT = '/assets/salesforce-summit-partner.webp';

export const PROMISES = () => [
  { id: 'quality', t: tx('Best quality.', 'Hoogste kwaliteit.'), d: tx('We are committed to delivering the highest quality in our work, to best support your business. Salesforce partner since 2010.', 'We zijn toegewijd aan de hoogste kwaliteit in ons werk, om je bedrijf optimaal te ondersteunen. Salesforce-partner sinds 2010.') },
  { id: 'time', t: tx('On time delivery.', 'Op tijd geleverd.'), d: tx('We know how much deadlines matter. Our team is committed to delivering your project on schedule, with a clear plan from day one.', 'We weten hoe belangrijk deadlines zijn. Ons team levert je project op schema op, met een helder plan vanaf dag één.') },
  { id: 'support', t: tx('Continuous support.', 'Continue ondersteuning.'), d: tx('Our support team is always ready after go-live, with an hour bundle or an SLA and agreed response times.', 'Ons supportteam staat ook na de livegang voor je klaar, met een urenpakket of SLA en afgesproken reactietijden.') },
  { id: 'summit', t: tx('Salesforce Summit Partner.', 'Salesforce Summit Partner.'), d: tx('Salesforce’s highest partner tier since 2026: a direct line into Salesforce with a dedicated partner manager.', 'Sinds 2026 het hoogste partnerniveau van Salesforce: een directe lijn met Salesforce en een vaste partnermanager.') },
  { id: 'csat', t: tx('4.5★ customer satisfaction.', '4.5★ klanttevredenheid.'), d: tx('Our customers rate our work 4.5 out of 5, across more than 300 projects.', 'Onze klanten waarderen ons werk met een 4,5 uit 5, over meer dan 300 projecten.') },
];

/* proof visual per reason; animates when its parent gets class "on" */
export function Proof({ id, on }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on || (id !== 'quality' && id !== 'csat')) return;
    const end = id === 'quality' ? 300 : 45; const t0 = performance.now(); let raf;
    const step = (t) => { const k = Math.min(1, (t - t0) / 1200); setN(Math.round(end * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [on, id]);
  if (id === 'quality') return <div className={'ws-proof ws-proof--q' + (on ? ' on' : '')}><b>{on ? n : 0}+</b><span>{tx('projects since 2010', 'projecten sinds 2010')}</span></div>;
  if (id === 'time') return (
    <div className={'ws-proof ws-proof--t' + (on ? ' on' : '')}>
      <div className="ws-gantt">{['Kick-off', tx('Build', 'Bouw'), 'Go-live'].map((x, i) => <div key={x}><span>{x}</span><i style={{ '--d': i * 0.25 + 's', '--w': [28, 52, 20][i] + '%', '--l': [0, 26, 78][i] + '%' }} /></div>)}</div>
      <div className="ws-flag">✓ {tx('Delivered on schedule', 'Op schema opgeleverd')}</div>
    </div>
  );
  if (id === 'support') return (
    <div className={'ws-proof ws-proof--s' + (on ? ' on' : '')}>
      <svg viewBox="0 0 200 50" aria-hidden="true"><path d="M0 25 H60 L72 8 L84 42 L96 25 H200" /></svg>
      <div className="ws-sla"><b>4 {tx('h', 'u')}</b><span>{tx('response on urgent issues (SLA)', 'reactie bij urgente zaken (SLA)')}</span></div>
    </div>
  );
  if (id === 'summit') return <div className={'ws-proof ws-proof--b' + (on ? ' on' : '')}><img src={SUMMIT} alt="Salesforce Summit Partner" /></div>;
  return (
    <div className={'ws-proof ws-proof--c' + (on ? ' on' : '')}>
      <div className="ws-stars">{[0, 1, 2, 3, 4].map((i) => <span key={i}><i style={{ width: (i < 4 ? 100 : 50) + '%', transitionDelay: i * 0.12 + 's' }} />★</span>)}</div>
      <b>{on ? (n / 10).toFixed(1) : '0.0'}<small>/5</small></b>
    </div>
  );
}
const Cta = () => <a className="ws-cta" href={lp('/contact')}>{tx('Plan 30 minutes with Frank', 'Plan 30 minuten met Frank')} <span aria-hidden="true">→</span></a>;

/* ---------- 1 · Scroll line along the reasons ---------- */
export function WhyLine() {
  const ref = useRef(null); const P = PROMISES();
  const [act, setAct] = useState(-1);
  useGsap(ref, (gsap, ScrollTrigger, SplitText) => {
    gsap.fromTo('.ws1-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.ws1-list', start: 'top 60%', end: 'bottom 60%', scrub: 0.4 } });
    gsap.utils.toArray('.ws1-item').forEach((el, i) => {
      ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 60%', onToggle: (self) => self.isActive && setAct(i), onEnterBack: () => setAct(i) });
      const split = SplitText.create(el.querySelector('h3'), { type: 'words,chars' });
      gsap.from(split.chars, { yPercent: 100, opacity: 0, stagger: 0.012, duration: 0.45, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 70%', once: true } });
    });
  });
  return (
    <section className="ws ws--1" ref={ref}>
      <div className="container ws1-grid">
        <div className="ws1-side">
          <div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')}</div>
          <h2>{tx('Why', 'Waarom')}<br /><span>Intigris?</span></h2>
          <p>{tx('Five reasons Dutch companies choose us as their Salesforce partner.', 'Vijf redenen waarom Nederlandse bedrijven ons kiezen als Salesforce-partner.')}</p>
          <div className="ws1-count"><b>{act < 0 ? '01' : String(act + 1).padStart(2, '0')}</b><span>/ 05</span></div>
          <Cta />
        </div>
        <div className="ws1-list">
          <div className="ws1-track" aria-hidden="true"><i className="ws1-fill" /></div>
          {P.map((p, i) => (
            <div key={p.id} className={'ws1-item' + (i === act ? ' on' : '') + (i < act ? ' past' : '')}>
              <span className="ws1-dot" />
              <div className="ws1-text"><small>{String(i + 1).padStart(2, '0')}</small><h3>{p.t}</h3><p>{p.d}</p></div>
              <Proof id={p.id} on={i <= act} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 2 · Pinned stage ---------- */
export function WhyStage({ look = 'dark' }) {
  const ref = useRef(null); const P = PROMISES();
  const [act, setAct] = useState(0);
  const last = useRef(0);
  useGsap(ref, (gsap, ScrollTrigger) => {
    ScrollTrigger.create({ trigger: '.ws2-pin', start: 'top top', end: '+=' + P.length * 70 + '%', pin: true, scrub: true,
      onUpdate: (st) => { const i = Math.min(P.length - 1, Math.floor(st.progress * P.length)); if (i !== last.current) { last.current = i; setAct(i); } gsap.set('.ws2-fill', { scaleY: st.progress }); } });
    // several pinned stages can live on one page (the design review): once all have been
    // created, re-measure them in page order so each pin accounts for the ones above it
    clearTimeout(window.__wsRefresh);
    window.__wsRefresh = setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 250);
  });
  useEffect(() => {
    let alive = true;
    Promise.all([import('gsap'), import('gsap/SplitText')]).then(([{ gsap }, { SplitText }]) => {
      if (!alive || reduced() || !ref.current) return;
      gsap.registerPlugin(SplitText);
      const h = ref.current.querySelector('.ws2-title'); if (!h) return;
      const split = SplitText.create(h, { type: 'chars' });
      gsap.from(split.chars, { yPercent: 120, rotate: 8, opacity: 0, stagger: 0.02, duration: 0.55, ease: 'back.out(1.6)', onComplete: () => split.revert() });
    });
    return () => { alive = false; };
  }, [act]);
  const p = P[act];
  if (look === 'number') return (
    <section className="ws ws--2 ws--cream ws--num" ref={ref}>
      <div className="ws2-pin">
        <div className="container ws2n-grid">
          <div className="ws2n-col" aria-label={tx('Reasons', 'Redenen')}>
            {P.map((x, i) => <span key={x.id} className={i === act ? 'on' : i < act ? 'past' : ''}>{String(i + 1).padStart(2, '0')}</span>)}
            <div className="ws2-track" aria-hidden="true"><i className="ws2-fill" /></div>
          </div>
          <div className="ws2n-stage" key={p.id}>
            <span className="ws2n-big" aria-hidden="true" style={{ '--p': (act + 1) / P.length }}>{String(act + 1).padStart(2, '0')}</span>
            <div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')}</div>
            <h2 className="ws2-title">{p.t}</h2>
            <p>{p.d}</p>
            <Proof id={p.id} on />
          </div>
        </div>
      </div>
    </section>
  );
  if (look === 'split') return (
    <section className="ws ws--2 ws--cream ws--split" ref={ref}>
      <div className="ws2-pin">
        <div className="container">
          <div className="ws2s-grid">
            <div className="ws2s-text" key={p.id + 't'}>
              <div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')} · {String(act + 1).padStart(2, '0')} / 05</div>
              <h2 className="ws2-title">{p.t}</h2>
              <p>{p.d}</p>
            </div>
            <div className="ws2s-card" key={p.id + 'c'}><Proof id={p.id} on /></div>
          </div>
          <div className="ws2s-bars">{P.map((x, i) => <div key={x.id} className={'ws2s-bar' + (i === act ? ' on' : '') + (i < act ? ' past' : '')}><i /><span>{x.t.replace('.', '')}</span></div>)}</div>
        </div>
      </div>
    </section>
  );
  return (
    <section className={'ws ws--2' + (look === 'cream' ? ' ws--cream' : '')} ref={ref}>
      <div className="ws2-pin">
        <div className="container ws2-grid">
          <div className="ws2-rail">
            <div className="ws2-track" aria-hidden="true"><i className="ws2-fill" /></div>
            {P.map((x, i) => <div key={x.id} className={'ws2-node' + (i === act ? ' on' : '') + (i < act ? ' past' : '')}><span />{x.t.replace('.', '')}</div>)}
          </div>
          <div className="ws2-stage" key={p.id}>
            <div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')} · {String(act + 1).padStart(2, '0')} / 05</div>
            <h2 className="ws2-title">{p.t}</h2>
            <p>{p.d}</p>
            <Proof id={p.id} on />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3 · Centre line, zigzag ---------- */
export function WhyZigzag() {
  const ref = useRef(null); const P = PROMISES();
  const [lit, setLit] = useState([]);
  useGsap(ref, (gsap, ScrollTrigger) => {
    gsap.fromTo('.ws3-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.ws3-list', start: 'top 55%', end: 'bottom 55%', scrub: 0.4 } });
    gsap.utils.toArray('.ws3-item').forEach((el, i) => {
      gsap.from(el.querySelector('.ws3-card'), { x: i % 2 ? 90 : -90, opacity: 0, rotate: i % 2 ? 3 : -3, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
      ScrollTrigger.create({ trigger: el, start: 'top 55%', onEnter: () => setLit((l) => [...new Set([...l, i])]), onLeaveBack: () => setLit((l) => l.filter((x) => x !== i)) });
    });
  });
  return (
    <section className="ws ws--3" ref={ref}>
      <div className="container">
        <div className="ws3-head"><div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')}</div><h2>{tx('Why companies choose', 'Waarom bedrijven kiezen voor')} <span>Intigris.</span></h2></div>
        <div className="ws3-list">
          <div className="ws3-track" aria-hidden="true"><i className="ws3-fill" /></div>
          {P.map((p, i) => (
            <div key={p.id} className={'ws3-item' + (i % 2 ? ' right' : '') + (lit.includes(i) ? ' on' : '')}>
              <span className="ws3-node">{String(i + 1).padStart(2, '0')}</span>
              <div className="ws3-card"><h3>{p.t}</h3><p>{p.d}</p><Proof id={p.id} on={lit.includes(i)} /></div>
            </div>
          ))}
          <div className="ws3-end"><img src={SUMMIT} alt="Salesforce Summit Partner" /><Cta /></div>
        </div>
      </div>
    </section>
  );
}

export function WsStyles() { return <style dangerouslySetInnerHTML={{ __html: WS_CSS }} />; }

const WS_CSS = `
.ws { padding: 110px 0; background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
.ws h2 { font-size: clamp(40px, 5vw, 72px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 16px 0 0; color: inherit; }
.ws h2 span { color: var(--intigris-coral); }
.ws-cta { display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px; border-radius: 999px; background: var(--intigris-coral); color: #fff; font-weight: 500; font-size: 15px; text-decoration: none; }
.ws-cta:hover { background: var(--intigris-coral-700); }
/* proofs */
.ws-proof { border-radius: 18px; background: var(--intigris-paper); border: 1px solid var(--border); padding: 18px 20px; min-width: 220px; opacity: .45; transform: scale(.96); transition: opacity .5s, transform .5s cubic-bezier(.2,.8,.2,1); }
.ws-proof.on { opacity: 1; transform: none; }
.ws-proof--q b { display: block; font-size: 46px; font-weight: 500; letter-spacing: -0.03em; color: var(--intigris-coral); font-variant-numeric: tabular-nums; } .ws-proof--q span { font-size: 13px; color: var(--fg-muted); font-weight: 600; }
.ws-gantt { display: flex; flex-direction: column; gap: 7px; } .ws-gantt div { display: grid; grid-template-columns: 62px 1fr; align-items: center; gap: 8px; font-size: 11.5px; color: var(--fg-muted); font-weight: 600; }
.ws-gantt div::after { content: ''; } .ws-gantt i { display: block; height: 10px; border-radius: 6px; background: var(--intigris-coral); margin-left: var(--l); width: 0; transition: width .6s var(--d) cubic-bezier(.2,.8,.2,1); }
.ws-proof--t.on .ws-gantt i { width: var(--w); }
.ws-flag { margin-top: 10px; font-size: 13px; font-weight: 700; color: #2e844a; opacity: 0; transition: opacity .4s .9s; } .ws-proof--t.on .ws-flag { opacity: 1; }
.ws-proof--s svg { width: 100%; height: 44px; } .ws-proof--s path { fill: none; stroke: var(--intigris-coral); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 320; stroke-dashoffset: 320; }
.ws-proof--s.on path { animation: wsPulse 1.6s ease-in-out forwards; } @keyframes wsPulse { to { stroke-dashoffset: 0; } }
.ws-sla { display: flex; align-items: baseline; gap: 10px; margin-top: 4px; } .ws-sla b { font-size: 34px; font-weight: 600; color: var(--intigris-dark-brown); } .ws-sla span { font-size: 12.5px; color: var(--fg-muted); font-weight: 600; }
.ws-proof--b { display: grid; place-items: center; background: linear-gradient(150deg, #032d60, #0b5cab); border: 0; perspective: 600px; }
.ws-proof--b img { width: 110px; border-radius: 12px; transform: rotateY(90deg); transition: transform .8s cubic-bezier(.2,.8,.2,1); } .ws-proof--b.on img { transform: none; }
.ws-stars { display: flex; gap: 4px; font-size: 30px; } .ws-stars span { position: relative; color: #e2d6c6; line-height: 1; } .ws-stars i { position: absolute; inset: 0; overflow: hidden; width: 0 !important; transition: width .4s; }
.ws-stars i::before { content: '★'; color: var(--intigris-coral); } .ws-proof--c.on .ws-stars i { width: var(--fill, 100%) !important; }
.ws-proof--c.on .ws-stars span:nth-child(5) i { width: 50% !important; }
.ws-proof--c b { display: block; font-size: 40px; font-weight: 500; margin-top: 6px; font-variant-numeric: tabular-nums; } .ws-proof--c b small { font-size: 18px; color: var(--fg-muted); margin-left: 3px; }
/* 1 · line */
.ws1-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.4fr); gap: 64px; align-items: start; }
.ws1-side { position: sticky; top: 110px; display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
.ws1-side h2 { margin: 0; font-size: clamp(52px, 6.4vw, 96px); } .ws1-side p { font-size: 17px; color: var(--fg-muted); margin: 0; max-width: 22em; }
.ws1-count { display: flex; align-items: baseline; gap: 6px; } .ws1-count b { font-size: 56px; font-weight: 500; color: var(--intigris-coral); font-variant-numeric: tabular-nums; } .ws1-count span { color: var(--fg-muted); font-weight: 600; }
.ws1-list { position: relative; padding-left: 48px; }
.ws1-track { position: absolute; left: 11px; top: 12px; bottom: 12px; width: 3px; border-radius: 3px; background: var(--border); }
.ws1-fill { position: absolute; inset: 0; background: var(--intigris-coral); transform-origin: top; border-radius: 3px; box-shadow: 0 0 14px rgba(255,92,57,.5); }
.ws1-item { position: relative; display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center; padding: 46px 0; border-bottom: 1px solid var(--border); opacity: .35; transition: opacity .4s; }
.ws1-item.on, .ws1-item.past { opacity: 1; }
.ws1-dot { position: absolute; left: -44px; top: 50%; width: 19px; height: 19px; margin-top: -10px; border-radius: 50%; background: var(--intigris-off-white); border: 3px solid var(--border); transition: all .3s; }
.ws1-item.past .ws1-dot { background: var(--intigris-coral); border-color: var(--intigris-coral); }
.ws1-item.on .ws1-dot { background: var(--intigris-coral); border-color: var(--intigris-coral); box-shadow: 0 0 0 8px rgba(255,92,57,.18); transform: scale(1.15); }
.ws1-text small { font-size: 12px; font-weight: 700; color: var(--intigris-coral-700); letter-spacing: .06em; }
.ws1-text h3 { font-size: clamp(28px, 3vw, 42px); font-weight: 500; letter-spacing: -0.025em; line-height: 1.08; margin: 6px 0 10px; color: var(--intigris-dark-brown); }
.ws1-text p { font-size: 16.5px; line-height: 1.55; color: var(--fg-muted); margin: 0; max-width: 30em; }
/* 2 · stage */
.ws--2 { padding: 0; background: var(--intigris-brown-700); color: var(--intigris-off-white); }
.ws2-pin { min-height: 100vh; display: flex; align-items: center; padding: 90px 0 60px; box-sizing: border-box; }
.ws2-pin > .container { width: 100%; }
.ws2-grid { display: grid; grid-template-columns: 280px 1fr; gap: 72px; align-items: center; }
.ws2-rail { position: relative; display: flex; flex-direction: column; gap: 28px; padding-left: 34px; }
.ws2-track { position: absolute; left: 8px; top: 6px; bottom: 6px; width: 3px; background: rgba(255,250,240,.15); border-radius: 3px; }
.ws2-fill { position: absolute; inset: 0; background: var(--intigris-coral); transform-origin: top; transform: scaleY(0); box-shadow: 0 0 16px rgba(255,92,57,.6); }
.ws2-node { position: relative; font-size: 16px; font-weight: 500; color: rgba(255,250,240,.45); transition: color .3s; }
.ws2-node span { position: absolute; left: -33px; top: 3px; width: 15px; height: 15px; border-radius: 50%; background: var(--intigris-brown-700); border: 2px solid rgba(255,250,240,.3); transition: all .3s; }
.ws2-node.past { color: rgba(255,250,240,.75); } .ws2-node.past span { background: var(--intigris-coral); border-color: var(--intigris-coral); }
.ws2-node.on { color: #fff; font-weight: 600; } .ws2-node.on span { background: var(--intigris-coral); border-color: var(--intigris-coral); box-shadow: 0 0 0 7px rgba(255,92,57,.25); }
.ws2-stage { display: flex; flex-direction: column; gap: 18px; align-items: flex-start; }
.ws2-stage .eyebrow { color: #ffb59e; }
.ws2-title { font-size: clamp(48px, 6.4vw, 100px) !important; margin: 0 !important; color: var(--intigris-off-white); overflow: hidden; }
.ws2-stage > p { font-size: 19px; line-height: 1.55; opacity: .8; max-width: 32em; margin: 0; animation: wsIn .5s .25s both; }
.ws2-stage .ws-proof { animation: wsIn .5s .4s both; background: rgba(255,250,240,.06); border-color: rgba(255,250,240,.14); } .ws2-stage .ws-proof span, .ws2-stage .ws-gantt div { color: rgba(255,250,240,.7); } .ws2-stage .ws-sla b { color: #fff; }
.ws2-stage .ws-proof--b { background: linear-gradient(150deg, #032d60, #0b5cab); }
/* 2 on cream (Bing 2026-11-24: likes the pinned stage, wants the cream background) */
.ws--cream.ws--2 { background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
.ws--cream .ws2-title { color: var(--intigris-dark-brown) !important; }
.ws--cream .ws2-stage .eyebrow, .ws--cream .eyebrow { color: var(--intigris-coral-700); }
.ws--cream .ws2-stage > p, .ws--cream .ws2n-stage > p, .ws--cream .ws2s-text > p { color: var(--fg-muted); opacity: 1; }
.ws--cream .ws2-track { background: var(--border); }
.ws--cream .ws2-node { color: rgba(64,35,1,.4); } .ws--cream .ws2-node.past { color: rgba(64,35,1,.7); } .ws--cream .ws2-node.on { color: var(--intigris-dark-brown); }
.ws--cream .ws2-node span { background: var(--intigris-off-white); border-color: var(--border); }
.ws--cream .ws2-node.past span, .ws--cream .ws2-node.on span { background: var(--intigris-coral); border-color: var(--intigris-coral); }
.ws--cream .ws-proof { background: #fff; border-color: var(--border); box-shadow: 0 24px 50px -34px rgba(43,23,0,.45); }
.ws--cream .ws-proof span, .ws--cream .ws-gantt div { color: var(--fg-muted) !important; } .ws--cream .ws-sla b { color: var(--intigris-dark-brown) !important; }
.ws--cream .ws-proof--b { background: linear-gradient(150deg, #032d60, #0b5cab); }
/* 2B · big outlined number */
.ws2n-grid { display: grid; grid-template-columns: 70px 1fr; gap: 64px; align-items: center; }
.ws2n-col { position: relative; display: flex; flex-direction: column; gap: 22px; padding-left: 26px; }
.ws2n-col .ws2-track { left: 0; top: 4px; bottom: 4px; }
.ws2n-col span { font-size: 18px; font-weight: 600; color: rgba(64,35,1,.3); transition: color .3s, transform .3s; font-variant-numeric: tabular-nums; }
.ws2n-col span.past { color: rgba(64,35,1,.6); } .ws2n-col span.on { color: var(--intigris-coral); transform: scale(1.35); transform-origin: left; }
.ws2n-stage { position: relative; display: flex; flex-direction: column; gap: 18px; align-items: flex-start; padding: 30px 0; }
.ws2n-stage > *:not(.ws2n-big) { position: relative; z-index: 1; }
.ws2n-big { position: absolute; right: 0; top: 50%; transform: translateY(-50%); font-size: clamp(220px, 30vw, 440px); font-weight: 600; letter-spacing: -0.06em; line-height: .8; color: transparent; -webkit-text-stroke: 2px rgba(255,92,57,.35); background: linear-gradient(0deg, var(--intigris-coral) 0%, var(--intigris-coral) calc(var(--p) * 100%), transparent calc(var(--p) * 100%)); -webkit-background-clip: text; background-clip: text; opacity: .9; animation: wsBig .7s cubic-bezier(.2,.8,.2,1) both; pointer-events: none; }
@keyframes wsBig { from { opacity: 0; transform: translateY(-40%) scale(.85); } to { opacity: .9; transform: translateY(-50%); } }
.ws2n-stage > p { font-size: 19px; line-height: 1.55; max-width: 30em; margin: 0; animation: wsIn .5s .25s both; }
.ws2n-stage .ws-proof { animation: wsIn .5s .4s both; }
/* 2C · split stage with story bars */
.ws2s-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); gap: 64px; align-items: center; min-height: 52vh; }
.ws2s-text { display: flex; flex-direction: column; gap: 18px; align-items: flex-start; }
.ws2s-text > p { font-size: 19px; line-height: 1.55; max-width: 30em; margin: 0; animation: wsIn .5s .25s both; }
.ws2s-card { display: flex; justify-content: center; animation: wsCard .7s cubic-bezier(.2,.8,.2,1) both; }
@keyframes wsCard { from { opacity: 0; transform: translateX(60px) rotate(4deg); } to { opacity: 1; transform: none; } }
.ws2s-card .ws-proof { transform: scale(1.35); transform-origin: center; padding: 22px 26px; }
.ws2s-bars { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 40px; }
.ws2s-bar i { display: block; height: 5px; border-radius: 5px; background: var(--border); position: relative; overflow: hidden; }
.ws2s-bar i::after { content: ''; position: absolute; inset: 0; background: var(--intigris-coral); transform: scaleX(0); transform-origin: left; transition: transform .5s; }
.ws2s-bar.past i::after { transform: scaleX(1); } .ws2s-bar.on i::after { transform: scaleX(1); transition-duration: 1.2s; }
.ws2s-bar span { display: block; margin-top: 10px; font-size: 13px; font-weight: 600; color: rgba(64,35,1,.4); transition: color .3s; }
.ws2s-bar.on span { color: var(--intigris-dark-brown); } .ws2s-bar.past span { color: rgba(64,35,1,.65); }
@media (max-width: 960px) { .ws2n-grid { grid-template-columns: 1fr; } .ws2n-col { display: none; } .ws2n-big { font-size: 180px; } .ws2s-grid { grid-template-columns: 1fr; gap: 28px; } .ws2s-bars span { display: none; } }
@keyframes wsIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
/* 3 · zigzag */
.ws3-head { text-align: center; margin-bottom: 60px; } .ws3-head h2 { margin-top: 14px; }
.ws3-list { position: relative; max-width: 1040px; margin: 0 auto; }
.ws3-track { position: absolute; left: 50%; top: 0; bottom: 140px; width: 3px; margin-left: -1.5px; background: var(--border); border-radius: 3px; }
.ws3-fill { position: absolute; inset: 0; background: var(--intigris-coral); transform-origin: top; border-radius: 3px; box-shadow: 0 0 14px rgba(255,92,57,.5); }
.ws3-item { position: relative; display: flex; justify-content: flex-start; padding: 26px 0; }
.ws3-item.right { justify-content: flex-end; }
.ws3-node { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 2; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; font-size: 14px; font-weight: 700; background: var(--intigris-off-white); border: 3px solid var(--border); color: var(--fg-muted); transition: all .4s; }
.ws3-item.on .ws3-node { background: var(--intigris-coral); border-color: var(--intigris-coral); color: #fff; box-shadow: 0 0 0 9px rgba(255,92,57,.16); }
.ws3-card { width: calc(50% - 56px); box-sizing: border-box; padding: 28px; border-radius: 24px; background: var(--intigris-paper); border: 1px solid var(--border); box-shadow: 0 30px 60px -44px rgba(43,23,0,.45); display: flex; flex-direction: column; gap: 10px; }
.ws3-card h3 { font-size: clamp(26px, 2.6vw, 34px); font-weight: 500; letter-spacing: -0.02em; margin: 0; color: var(--intigris-dark-brown); }
.ws3-card p { font-size: 16px; line-height: 1.55; color: var(--fg-muted); margin: 0 0 6px; }
.ws3-card .ws-proof { align-self: flex-start; }
.ws3-end { display: flex; flex-direction: column; align-items: center; gap: 18px; padding-top: 30px; }
.ws3-end img { width: 110px; border-radius: 14px; box-shadow: 0 20px 40px -20px rgba(0,0,0,.45); }
@media (max-width: 960px) {
  .ws { padding: 80px 0; } .ws1-grid, .ws2-grid { grid-template-columns: 1fr; gap: 32px; } .ws1-side { position: static; }
  .ws1-item { grid-template-columns: 1fr; } .ws2-rail { display: none; }
  .ws3-track { left: 23px; } .ws3-node { left: 23px; } .ws3-item, .ws3-item.right { justify-content: flex-end; } .ws3-card { width: calc(100% - 64px); }
}
@media (prefers-reduced-motion: reduce) { .ws *, .ws *::before { animation: none !important; transition: none !important; } }
`;
