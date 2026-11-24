/* ==================================================================== */
/*  "Trusted by" logo strip · four redesigns for the design review (:8004) */
/*  Bing (2026-11-24): not sure about the current marquee (ProofMarquee in */
/*  Hero.jsx); show 3-4 upgraded versions using the new GSAP 3.13+ tools.  */
/*    A · Speed marquee (reacts to scroll speed + direction)               */
/*    B · Logo wall with cursor spotlight (ScrollTrigger batch reveal)     */
/*    C · Rotating sentence (logo swap + ScrambleText industry)            */
/*    D · Numbers + shuffling wall (counters + Flip reshuffle)             */
/*  GSAP is imported from npm on the client only (dynamic import), scoped  */
/*  with gsap.context() and reverted on unmount (official GSAP React       */
/*  guidance). Industry labels in C are best guesses: confirm with Bing.   */
/* ==================================================================== */
import React, { useEffect, useRef, useState } from 'react';
import { tx } from '../../lib/i18n.js';

const L = '/assets/logos/';
export const TRUSTED = () => [
  { src: L + 'wetransfer.svg', alt: 'WeTransfer', h: 26, ind: tx('Tech', 'Tech') },
  { src: L + 'evbox.svg', alt: 'EVBox', h: 30, ind: tx('EV charging', 'Laadpalen') },
  { src: L + 'direct-healthcare-group.png', alt: 'Direct Healthcare Group', h: 40, ind: tx('Healthcare', 'Zorg') },
  { src: L + 'customs-support-group.png', alt: 'Customs Support Group', h: 42, ind: tx('Customs & logistics', 'Douane & logistiek') },
  { src: L + 'bouwgroep-schrijver.svg', alt: 'Bouwgroep Schrijver', h: 36, ind: tx('Construction', 'Bouw') },
  { src: L + 'feenstra.png', alt: 'Feenstra', h: 32, ind: tx('Installation & energy', 'Installatie & energie') },
  { src: L + 'warmgarant.png', alt: 'Warmgarant', h: 34, ind: tx('Heating & service', 'Verwarming & service') },
  { src: L + 'cyclovriend.svg', alt: 'Cyclovriend', h: 34, ind: tx('Mobility', 'Mobiliteit') },
  { src: L + 'opcharge.svg', alt: 'Opcharge', h: 30, ind: tx('EV charging', 'Laadpalen') },
];
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const Eyebrow = () => <div className="eyebrow tv-eyebrow">{tx('TRUSTED BY', 'VERTROUWD DOOR')}</div>;

/* ---------- A · Speed marquee ---------- */
export function TrustedVelocity() {
  const root = useRef(null), track = useRef(null);
  const logos = TRUSTED();
  useEffect(() => {
    if (reduced()) return;
    let ctx, alive = true;
    import('gsap').then(({ gsap }) => {
      if (!alive) return;
      ctx = gsap.context(() => {
        const half = () => track.current.scrollWidth / 2;
        let x = 0, speed = 0.6, dir = -1, lastY = window.scrollY, boost = 0;
        const skew = gsap.quickTo(track.current, 'skewX', { duration: 0.4, ease: 'power3' });
        gsap.ticker.add(tick);
        function tick() {
          const y = window.scrollY, dy = y - lastY; lastY = y;
          if (dy !== 0) dir = dy > 0 ? -1 : 1;
          boost += (Math.min(Math.abs(dy), 60) * 0.35 - boost) * 0.12;
          x += dir * (speed + boost);
          const w = half(); if (x <= -w) x += w; if (x > 0) x -= w;
          gsap.set(track.current, { x });
          skew(gsap.utils.clamp(-8, 8, -dir * boost * 0.5));
        }
        return () => gsap.ticker.remove(tick);
      }, root);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, []);
  return (
    <section className="tv tv--a" ref={root}>
      <div className="container"><Eyebrow /></div>
      <div className="tv-a-viewport">
        <div className="tv-a-track" ref={track}>
          {[...logos, ...logos].map((l, i) => <img key={i} className="tv-logo" src={l.src} alt={i < logos.length ? l.alt : ''} style={{ height: l.h }} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- B · Logo wall with spotlight ---------- */
export function TrustedWall() {
  const root = useRef(null);
  const logos = TRUSTED();
  useEffect(() => {
    let ctx, alive = true;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!alive || reduced()) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.set('.tv-b-tile', { opacity: 0, y: 24, scale: 0.94 });
        ScrollTrigger.batch('.tv-b-tile', { start: 'top 92%', once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.6, ease: 'power3.out' }) });
      }, root);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, []);
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px'); e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px'); };
  return (
    <section className="tv tv--b" ref={root}>
      <div className="container tv-b-grid">
        <div><Eyebrow /><h3 className="tv-title">{tx('Teams across Dutch industry run on it.', 'Teams in de hele Nederlandse industrie draaien erop.')}</h3><p className="tv-sub">{tx('From healthcare to construction, from EV charging to logistics.', 'Van zorg tot bouw, van laadpalen tot logistiek.')}</p></div>
        <div className="tv-b-wall" onMouseMove={move}>
          {logos.map((l) => <div key={l.alt} className="tv-b-tile"><img className="tv-logo" src={l.src} alt={l.alt} style={{ height: l.h }} /></div>)}
          <div className="tv-b-spot" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* ---------- C · Rotating sentence ---------- */
export function TrustedSentence() {
  const root = useRef(null), word = useRef(null);
  const logos = TRUSTED();
  const [a, setA] = useState(0);
  useEffect(() => { if (reduced()) return; const t = setInterval(() => setA((x) => (x + 1) % logos.length), 2600); return () => clearInterval(t); }, []);
  useEffect(() => {
    let ctx, alive = true;
    Promise.all([import('gsap'), import('gsap/ScrambleTextPlugin')]).then(([{ gsap }, { ScrambleTextPlugin }]) => {
      if (!alive) return;
      gsap.registerPlugin(ScrambleTextPlugin);
      ctx = gsap.context(() => {
        gsap.fromTo('.tv-c-logo img', { y: 26, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' });
        if (!reduced()) gsap.to(word.current, { duration: 0.8, scrambleText: { text: logos[a].ind, chars: 'lowerCase', speed: 0.6 }, ease: 'none' });
        else word.current.textContent = logos[a].ind;
      }, root);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, [a]);
  const l = logos[a];
  return (
    <section className="tv tv--c" ref={root}>
      <div className="container">
        <Eyebrow />
        <p className="tv-c-line">
          <span>{tx('Trusted by', 'Vertrouwd door')}</span>
          <span className="tv-c-logo" aria-live="polite"><img key={l.alt} src={l.src} alt={l.alt} style={{ height: l.h * 1.25 }} /></span>
          <span>{tx('in', 'in')}</span>
          <span className="tv-c-word" ref={word}>{l.ind}</span>
        </p>
        <div className="tv-c-dots" aria-hidden="true">{logos.map((x, i) => <i key={x.alt} className={i === a ? 'on' : ''} />)}</div>
      </div>
    </section>
  );
}

/* ---------- D · Numbers + shuffling wall ---------- */
export function TrustedStats() {
  const root = useRef(null), wall = useRef(null);
  const logos = TRUSTED();
  useEffect(() => {
    let ctx, alive = true, timer;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/Flip')]).then(([{ gsap }, { ScrollTrigger }, { Flip }]) => {
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger, Flip);
      ctx = gsap.context(() => {
        gsap.utils.toArray('.tv-d-num b').forEach((el) => {
          const end = +el.dataset.to, dec = +(el.dataset.dec || 0), obj = { v: 0 };
          gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = obj.v.toFixed(dec); } });
        });
        if (!reduced()) timer = setInterval(() => {
          const tiles = gsap.utils.toArray('.tv-d-tile', wall.current);
          const state = Flip.getState(tiles);
          const shuffled = gsap.utils.shuffle(tiles.slice());
          shuffled.forEach((t) => wall.current.appendChild(t));
          Flip.from(state, { duration: 0.9, ease: 'power3.inOut', stagger: 0.03 });
        }, 3200);
      }, root);
    });
    return () => { alive = false; clearInterval(timer); ctx && ctx.revert(); };
  }, []);
  return (
    <section className="tv tv--d" ref={root}>
      <div className="container tv-d-grid">
        <div>
          <Eyebrow />
          <div className="tv-d-nums">
            <div className="tv-d-num"><b data-to="15">15</b><em>+</em><span>{tx('years Salesforce partner', 'jaar Salesforce-partner')}</span></div>
            <div className="tv-d-num"><b data-to="300">300</b><em>+</em><span>{tx('projects completed', 'projecten afgerond')}</span></div>
            <div className="tv-d-num"><b data-to="4.5" data-dec="1">4.5</b><em>★</em><span>{tx('customer satisfaction', 'klanttevredenheid')}</span></div>
          </div>
        </div>
        <div className="tv-d-wall" ref={wall}>
          {logos.map((l) => <div key={l.alt} className="tv-d-tile"><img className="tv-logo" src={l.src} alt={l.alt} style={{ height: l.h * 0.85 }} /></div>)}
        </div>
      </div>
    </section>
  );
}

export function TvStyles() { return <style dangerouslySetInnerHTML={{ __html: TV_CSS }} />; }

const TV_CSS = `
.tv { padding: 40px 0 48px; background: var(--intigris-off-white); color: var(--intigris-dark-brown); overflow: hidden; }
.tv-eyebrow { font-size: 11px; color: var(--fg-muted); margin-bottom: 18px; }
.tv-logo { width: auto; display: block; object-fit: contain; filter: grayscale(1) contrast(.9); opacity: .7; transition: filter .3s, opacity .3s; }
.tv-logo:hover { filter: none; opacity: 1; }
.tv-title { font-size: clamp(24px, 2.4vw, 32px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; margin: 0; }
.tv-sub { font-size: 15px; color: var(--fg-muted); margin: 10px 0 0; }
/* A */
.tv-a-viewport { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.tv-a-track { display: flex; align-items: center; gap: 80px; width: max-content; padding: 8px 0; will-change: transform; }
/* B */
.tv-b-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.4fr); gap: 48px; align-items: center; }
.tv-b-wall { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; --mx: -200px; --my: -200px; }
.tv-b-tile { position: relative; z-index: 1; display: grid; place-items: center; height: 92px; background: var(--intigris-paper); }
.tv-b-spot { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0; transition: opacity .3s; background: radial-gradient(190px circle at var(--mx) var(--my), rgba(255,92,57,.14), rgba(255,92,57,0) 70%); }
.tv-b-wall:hover .tv-b-spot { opacity: 1; }
.tv-b-wall .tv-b-tile:hover .tv-logo { filter: none; opacity: 1; transform: scale(1.06); transition: transform .3s; }
/* C */
.tv--c { padding: 48px 0 56px; }
.tv-c-line { display: flex; align-items: center; flex-wrap: wrap; gap: 18px; margin: 0; font-size: clamp(28px, 3.4vw, 46px); font-weight: 500; letter-spacing: -0.025em; }
.tv-c-logo { display: inline-grid; place-items: center; min-width: 220px; height: 76px; padding: 0 22px; border-radius: 20px; background: #fff; box-shadow: 0 16px 34px -22px rgba(43,23,0,.45); border: 1px solid var(--border); }
.tv-c-logo img { width: auto; max-width: 240px; object-fit: contain; }
.tv-c-word { color: var(--intigris-coral); font-variant-ligatures: none; min-width: 6ch; }
.tv-c-dots { display: flex; gap: 6px; margin-top: 22px; } .tv-c-dots i { width: 6px; height: 6px; border-radius: 99px; background: var(--border); transition: width .3s, background .3s; } .tv-c-dots i.on { width: 22px; background: var(--intigris-coral); }
/* D */
.tv-d-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.3fr); gap: 48px; align-items: center; }
.tv-d-nums { display: flex; gap: 32px; flex-wrap: wrap; }
.tv-d-num { display: flex; flex-wrap: wrap; align-items: baseline; max-width: 150px; }
.tv-d-num b { font-size: clamp(38px, 4vw, 54px); font-weight: 500; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.tv-d-num em { font-style: normal; font-size: 26px; color: var(--intigris-coral); margin-left: 2px; }
.tv-d-num span { flex-basis: 100%; font-size: 13px; color: var(--fg-muted); font-weight: 600; }
.tv-d-wall { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.tv-d-tile { display: grid; place-items: center; height: 78px; border-radius: 16px; background: var(--intigris-paper); border: 1px solid var(--border); }
@media (max-width: 960px) { .tv-b-grid, .tv-d-grid { grid-template-columns: 1fr; gap: 24px; } .tv-c-logo { min-width: 0; } }
`;
