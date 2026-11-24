/* ==================================================================== */
/*  Customer stories ("Teams that run on it.") · three redesigns for the   */
/*  design review (:8004). Bing (2026-11-24): keep the current layout as   */
/*  reference, show cooler concepts with different customer cards using    */
/*  the new GSAP tools.                                                     */
/*    A · Swipeable card stack (Draggable + Inertia, SplitText quote)       */
/*    B · Story wall that expands (Flip)                                    */
/*    C · Horizontal story gallery (pinned ScrollTrigger + SplitText)       */
/*  Data: CK_STORIES (legacy CloudKit.jsx). De Ridder left out (its story  */
/*  is about FieldBuddy; Bing's rule). Logos only for WeTransfer, EVBox,   */
/*  Opcharge (SS_LOGOS); others show the name.                              */
/* ==================================================================== */
import React, { useEffect, useRef, useState } from 'react';
import { tx, lp } from '../../lib/i18n.js';
import { CK_STORIES } from '../../legacy/components/CloudKit.jsx';
import { SS_LOGOS } from '../../legacy/components/StorySpotlight.jsx';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ORDER = ['wetransfer', 'evbox', 'opcharge', 'atag', 'alpha', 'zon365', 'solar'];
const stories = () => { const S = CK_STORIES(); return ORDER.map((k) => ({ k, ...S[k] })); };
// logos with a lot of height (stacked wordmarks) get a bit more room so they read as large as the others
const LOGO_H = { 'Solar Assistance': 1.45, 'Alpha Ventilatie': 1.25 };
const Logo = ({ s, big }) => SS_LOGOS[s.name] ? <img className={'sv-logo' + (big ? ' sv-logo--big' : '')} src={SS_LOGOS[s.name]} alt={s.name} style={LOGO_H[s.name] ? { height: (big ? 40 : 30) * LOGO_H[s.name] } : undefined} /> : <b className={'sv-logo sv-logo--txt' + (big ? ' sv-logo--big' : '')}>{s.name}</b>;
const Pills = ({ s }) => <div className="sv-pills">{s.clouds.map((c) => <span key={c}>{c}</span>)}</div>;
const Who = ({ s }) => <div className="sv-who"><b>{s.who}</b>{s.role && <span>{s.role}, {s.name}</span>}</div>;
function Head({ light }) {
  return (
    <div className={'sv-head' + (light ? ' sv-head--light' : '')}>
      <div className="eyebrow">{tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN')}</div>
      <h2>{tx('Teams that', 'Teams die')} <span>{tx('run on it.', 'erop draaien.')}</span></h2>
    </div>
  );
}

/* ---------- A · Swipeable card stack ---------- */
export function StoriesStack() {
  const list = stories();
  const [top, setTop] = useState(0);
  const deck = useRef(null), g = useRef(null);
  const next = (dir = 1) => {
    const el = deck.current && deck.current.querySelector('.sv-a-card.top');
    const G = g.current;
    if (!el || !G) { setTop((t) => (t + 1) % list.length); return; }
    G.gsap.to(el, { x: dir * 700, rotate: dir * 18, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: () => { G.gsap.set(el, { x: 0, rotate: 0, opacity: 1 }); setTop((t) => (t + 1) % list.length); } });
  };
  useEffect(() => {
    let alive = true, drag;
    Promise.all([import('gsap'), import('gsap/Draggable'), import('gsap/InertiaPlugin')]).then(([{ gsap }, { Draggable }, { InertiaPlugin }]) => {
      if (!alive || reduced()) return;
      gsap.registerPlugin(Draggable, InertiaPlugin);
      g.current = { gsap };
      const el = deck.current.querySelector('.sv-a-card.top');
      drag = Draggable.create(el, { type: 'x,y', inertia: true, edgeResistance: 0.6,
        onDrag() { gsap.set(this.target, { rotate: this.x / 18 }); },
        onRelease() { if (Math.abs(this.x) > 140) next(this.x > 0 ? 1 : -1); else gsap.to(this.target, { x: 0, y: 0, rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' }); } })[0];
    });
    return () => { alive = false; drag && drag.kill(); };
  }, [top]);
  useEffect(() => {
    let alive = true, split;
    Promise.all([import('gsap'), import('gsap/SplitText')]).then(([{ gsap }, { SplitText }]) => {
      if (!alive || reduced() || !deck.current) return;
      gsap.registerPlugin(SplitText);
      const q = deck.current.querySelector('.sv-a-card.top blockquote'); if (!q) return;
      split = SplitText.create(q, { type: 'lines', mask: 'lines' });
      gsap.from(split.lines, { yPercent: 100, duration: 0.6, ease: 'power3.out', stagger: 0.08 });
    });
    return () => { alive = false; split && split.revert(); };
  }, [top]);
  return (
    <section className="sv sv--a">
      <div className="container sv-a-grid">
        <div>
          <Head />
          <p className="sv-lede">{tx('Drag a card away, or use the arrow, to meet the next customer.', 'Sleep een kaart weg, of gebruik de pijl, om de volgende klant te zien.')}</p>
          <div className="sv-a-ctrl"><button onClick={() => next(-1)} aria-label={tx('Previous', 'Vorige')}>←</button><span>{String(top + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span><button onClick={() => next(1)} aria-label={tx('Next', 'Volgende')}>→</button></div>
        </div>
        <div className="sv-a-deck" ref={deck}>
          {[2, 1, 0].map((d) => { const s = list[(top + d) % list.length]; return (
            <article key={s.k + d} className={'sv-a-card' + (d === 0 ? ' top' : '')} style={{ '--d': d }}>
              <div className="sv-a-top"><Logo s={s} /><span className="sv-sector">{s.sector}</span></div>
              <blockquote>“{s.quote}”</blockquote>
              <Who s={s} />
              <div className="sv-what"><small>{tx('What we did', 'Wat we deden')}</small>{s.what}</div>
              <Pills s={s} />
            </article>); })}
        </div>
      </div>
    </section>
  );
}

/* ---------- B · Story wall that expands (Flip) ---------- */
export function StoriesWall() {
  const list = stories();
  const [open, setOpen] = useState(0);
  const wall = useRef(null), state = useRef(null), F = useRef(null);
  useEffect(() => { import('gsap').then(({ gsap }) => import('gsap/Flip').then(({ Flip }) => { gsap.registerPlugin(Flip); F.current = { gsap, Flip }; })); }, []);
  const pick = (i) => {
    if (i === open) return;
    if (F.current && !reduced()) state.current = F.current.Flip.getState(wall.current.querySelectorAll('.sv-b-tile'));
    setOpen(i);
  };
  useEffect(() => {
    if (!state.current || !F.current) return;
    F.current.Flip.from(state.current, { duration: 0.7, ease: 'power3.inOut', absolute: true, nested: true, onEnter: (els) => F.current.gsap.fromTo(els, { opacity: 0 }, { opacity: 1 }) });
    F.current.gsap.from(wall.current.querySelectorAll('.sv-b-tile.open .sv-b-more > *'), { opacity: 0, y: 16, stagger: 0.07, delay: 0.35, duration: 0.45 });
    state.current = null;
  }, [open]);
  return (
    <section className="sv sv--b">
      <div className="container">
        <Head />
        <div className="sv-b-wall" ref={wall}>
          {list.map((s, i) => (
            <button key={s.k} data-flip-id={s.k} className={'sv-b-tile' + (i === open ? ' open' : '')} onClick={() => pick(i)} aria-expanded={i === open}>
              <div className="sv-a-top"><Logo s={s} big={i === open} /><span className="sv-sector">{s.sector}</span></div>
              <blockquote>“{i === open ? s.quote : s.quote.split(' ').slice(0, 9).join(' ') + '…'}”</blockquote>
              {i === open && <div className="sv-b-more"><Who s={s} /><div className="sv-what"><small>{tx('What we did', 'Wat we deden')}</small>{s.what}</div><Pills s={s} /></div>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- C · Horizontal story gallery ---------- */
export function StoriesGallery() {
  const list = stories();
  const root = useRef(null), track = useRef(null);
  useEffect(() => {
    let ctx, alive = true;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      if (!alive || reduced() || !root.current || window.innerWidth < 960) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      ctx = gsap.context(() => {
        const dist = () => track.current.scrollWidth - track.current.parentElement.clientWidth;
        const tween = gsap.to(track.current, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.sv-c-pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: (st) => gsap.set('.sv-c-bar i', { scaleX: st.progress }) } });
        gsap.utils.toArray('.sv-c-card blockquote').forEach((q) => {
          const split = SplitText.create(q, { type: 'words' });
          gsap.from(split.words, { opacity: 0.12, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: q, containerAnimation: tween, start: 'left 85%', end: 'left 35%', scrub: true } });
        });
      }, root);
      clearTimeout(window.__svRefresh); window.__svRefresh = setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 250);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, []);
  return (
    <section className="sv sv--c" ref={root}>
      <div className="sv-c-pin">
        <div className="container"><Head light /></div>
        <div className="sv-c-view">
          <div className="sv-c-track" ref={track}>
            {list.map((s, i) => (
              <article key={s.k} className={'sv-c-card sv-c-card--' + (i % 3)}>
                <div className="sv-a-top"><Logo s={s} big /><span className="sv-sector">{s.sector}</span></div>
                <blockquote>“{s.quote}”</blockquote>
                <div className="sv-c-foot"><Who s={s} /><Pills s={s} /></div>
              </article>
            ))}
            <a className="sv-c-end" href={lp('/cases')}><b>{tx('Read all stories', 'Lees alle verhalen')}</b><span>→</span></a>
          </div>
        </div>
        <div className="container"><div className="sv-c-bar"><i /></div></div>
      </div>
    </section>
  );
}

/* ---------- C2 · Horizontal gallery with industry pills (Bing 2026-11-24) ----------
   C with the heading on the left and a sliding pill selector on the right; picking an
   industry shows only that industry's stories. Industries = partner-profile categories
   that actually have stories in CK_STORIES. */
export const INDUSTRIES = () => [
  { id: 'all', l: tx('All', 'Alles'), keys: ORDER },
  { id: 'energy', l: tx('Energy', 'Energie'), keys: ['evbox', 'opcharge', 'zon365', 'solar'] },
  { id: 'install', l: tx('Installation', 'Installatie'), keys: ['atag', 'alpha'] },
  { id: 'tech', l: tx('Tech', 'Tech'), keys: ['wetransfer'] },
];
export function StoriesGalleryIndustry() {
  const all = stories();
  const IND = INDUSTRIES();
  const [ind, setInd] = useState('all');
  const list = all.filter((s) => IND.find((x) => x.id === ind).keys.includes(s.k));
  const root = useRef(null), track = useRef(null), pills = useRef(null);
  /* Play once (Bing 2026-11-24): after the visitor has scrolled past the gallery once, the pin is
     removed and the row becomes a normal sideways-scrollable strip, so scrolling back up is short
     and nothing replays. */
  const settledRef = useRef(false);
  const [settled, setSettled] = useState(false);
  const [thumb, setThumb] = useState({ x: 0, w: 0 });
  // sliding thumb follows the active pill
  useEffect(() => {
    const place = () => { const b = pills.current && pills.current.querySelector('button.on'); if (b) setThumb({ x: b.offsetLeft, w: b.offsetWidth }); };
    place(); window.addEventListener('resize', place); return () => window.removeEventListener('resize', place);
  }, [ind]);
  // (re)build the horizontal scroll whenever the industry changes
  useEffect(() => {
    let ctx, alive = true;
    const w = window;
    const load = w.gsap && w.ScrollTrigger && w.SplitText
      ? Promise.resolve([{ gsap: w.gsap }, { ScrollTrigger: w.ScrollTrigger }, { SplitText: w.SplitText }])
      : Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]);
    load.then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      if (!alive || !root.current) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      ctx = gsap.context(() => {
        gsap.from('.sv-c-card, .sv-c-end', { opacity: 0, x: 60, duration: 0.5, stagger: 0.07, ease: 'power3.out' });
        if (reduced() || window.innerWidth < 960) return;
        if (settledRef.current) return;
        const dist = () => Math.max(0, track.current.scrollWidth - track.current.parentElement.clientWidth);
        // all cards already fit (e.g. one industry with a single story): no sideways scroll,
        // no pin, quotes simply shown in full
        if (dist() < 40) { gsap.set('.sv-c-bar i', { scaleX: 1 }); return; }
        const tween = gsap.to(track.current, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.sv-c-pin', start: 'top top', end: () => '+=' + Math.max(1, dist()), pin: true, scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: (st) => gsap.set('.sv-c-bar i', { scaleX: st.progress }),
          onLeave: (st) => requestAnimationFrame(() => {
            if (settledRef.current || !alive) return;
            // anchor on the section's bottom edge: whatever unpinning removes, the content
            // below stays exactly where it was on screen
            const before = root.current.getBoundingClientRect().bottom;
            settledRef.current = true;
            ctx.revert();
            setSettled(true);
            const view = track.current && track.current.parentElement;
            if (view) view.scrollLeft = view.scrollWidth;
            const y = Math.max(0, w.scrollY + root.current.getBoundingClientRect().bottom - before);
            if (w.lenis) w.lenis.scrollTo(y, { immediate: true, force: true }); else w.scrollTo(0, y);
            ScrollTrigger.refresh();
          }) } });
        gsap.utils.toArray('.sv-c-card blockquote').forEach((q) => {
          const split = SplitText.create(q, { type: 'words' });
          gsap.from(split.words, { opacity: 0.12, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: q, containerAnimation: tween, start: 'left 90%', end: 'left 40%', scrub: true } });
        });
      }, root);
      clearTimeout(window.__svRefresh); window.__svRefresh = setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 200);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, [ind]);
  // settled: the progress bar follows the sideways scroll of the row
  useEffect(() => {
    if (!settled || !track.current) return;
    const view = track.current.parentElement, bar = root.current.querySelector('.sv-c-bar i');
    const upd = () => { const m = view.scrollWidth - view.clientWidth; bar.style.transform = 'scaleX(' + (m > 0 ? view.scrollLeft / m : 1) + ')'; };
    upd(); view.addEventListener('scroll', upd, { passive: true });
    return () => view.removeEventListener('scroll', upd);
  }, [settled, ind]);
  return (
    <section className={'sv sv--c sv--c2' + (settled ? ' sv--settled' : '')} ref={root}>
      <div className="sv-c-pin">
        <div className="container sv-c2-top">
          <Head />
          <div className="sv-c2-pills" ref={pills} role="tablist" aria-label={tx('Filter by industry', 'Filter op branche')}>
            <span className="sv-c2-thumb" aria-hidden="true" style={{ transform: `translateX(${thumb.x}px)`, width: thumb.w }} />
            {IND.map((x) => <button key={x.id} role="tab" aria-selected={x.id === ind} className={x.id === ind ? 'on' : ''} onClick={() => { setInd(x.id); if (settled && track.current) track.current.parentElement.scrollLeft = 0; }}>{x.l}</button>)}
          </div>
        </div>
        <div className="sv-c-view">
          <div className="sv-c-track" ref={track} key={ind}>
            {list.map((s, i) => (
              <article key={s.k} className={'sv-c-card sv-c-card--' + (i % 3)}>
                <div className="sv-a-top"><Logo s={s} big /><span className="sv-sector">{s.sector}</span></div>
                <blockquote>“{s.quote}”</blockquote>
                <div className="sv-c-foot"><Who s={s} /><Pills s={s} /></div>
              </article>
            ))}
            <a className="sv-c-end" href={lp('/cases')}><b>{tx('Read all stories', 'Lees alle verhalen')}</b><span>→</span></a>
          </div>
        </div>
        <div className="container"><div className="sv-c-bar"><i /></div></div>
      </div>
    </section>
  );
}

export function SvStyles() { return <style dangerouslySetInnerHTML={{ __html: SV_CSS }} />; }

const SV_CSS = `
.sv { padding: 110px 0; background: var(--intigris-coral); color: var(--intigris-dark-brown); overflow: hidden; }
.sv-head .eyebrow { color: var(--intigris-dark-brown); } .sv-head .eyebrow::before { background: var(--intigris-dark-brown); }
.sv-head h2 { font-size: clamp(38px, 4.6vw, 64px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 16px 0 0; color: var(--intigris-off-white); }
.sv-head h2 span { color: var(--intigris-dark-brown); }
.sv-lede { font-size: 17px; margin: 18px 0 0; color: rgba(64,35,1,.8); max-width: 26em; }
.sv-logo { height: 30px; width: auto; display: block; } .sv-logo--big { height: 40px; }
.sv-logo--txt { height: auto; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; color: var(--intigris-dark-brown); } .sv-logo--txt.sv-logo--big { font-size: 26px; }
.sv-sector { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--intigris-coral-700); }
.sv-a-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.sv-who b { display: block; font-size: 14.5px; } .sv-who span { font-size: 12.5px; color: var(--fg-muted); }
.sv-what { font-size: 14px; line-height: 1.5; padding: 12px 14px; border-radius: 14px; background: rgba(64,35,1,.05); }
.sv-what small { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--intigris-coral-700); margin-bottom: 3px; }
.sv-pills { display: flex; flex-wrap: wrap; gap: 6px; } .sv-pills span { font-size: 12px; font-weight: 500; padding: 5px 10px; border-radius: 99px; background: #fff; border: 1px solid var(--border); }
/* A stack */
.sv-a-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 56px; align-items: center; }
.sv-a-ctrl { display: flex; align-items: center; gap: 14px; margin-top: 28px; font-weight: 600; color: var(--intigris-off-white); }
.sv-a-ctrl button { all: unset; cursor: pointer; width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: var(--intigris-off-white); color: var(--intigris-dark-brown); font-size: 20px; transition: transform .2s; }
.sv-a-ctrl button:hover { transform: scale(1.08); }
.sv-a-deck { position: relative; height: 470px; }
.sv-a-card { position: absolute; inset: 0 6% auto; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; padding: 30px; border-radius: 26px; background: var(--intigris-off-white); box-shadow: 0 30px 60px -30px rgba(64,35,1,.55); transform: translateY(calc(var(--d) * 18px)) scale(calc(1 - var(--d) * .05)) rotate(calc(var(--d) * 2deg)); z-index: calc(10 - var(--d)); opacity: calc(1 - var(--d) * .2); }
.sv-a-card.top { cursor: grab; touch-action: none; user-select: none; } .sv-a-card.top:active { cursor: grabbing; }
.sv-a-card blockquote, .sv-b-tile blockquote, .sv-c-card blockquote { margin: 0; font-size: clamp(20px, 1.9vw, 26px); font-weight: 500; letter-spacing: -0.015em; line-height: 1.3; }
/* B wall */
.sv-b-wall { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-flow: dense; gap: 14px; margin-top: 40px; }
.sv-b-tile { all: unset; box-sizing: border-box; cursor: pointer; display: flex; flex-direction: column; gap: 14px; padding: 22px; border-radius: 22px; background: var(--intigris-off-white); box-shadow: 0 20px 40px -30px rgba(64,35,1,.5); transition: box-shadow .3s; }
.sv-b-tile:hover { box-shadow: 0 0 0 3px var(--intigris-dark-brown), 0 20px 40px -30px rgba(64,35,1,.5); }
.sv-b-tile:focus-visible { outline: 3px solid var(--intigris-dark-brown); outline-offset: 3px; }
.sv-b-tile blockquote { font-size: 16px !important; color: rgba(64,35,1,.85); }
.sv-b-tile.open { grid-column: span 2; grid-row: span 2; cursor: default; background: #fff; }
.sv-b-tile.open blockquote { font-size: clamp(22px, 2.2vw, 30px) !important; color: var(--intigris-dark-brown); }
.sv-b-more { display: flex; flex-direction: column; gap: 14px; margin-top: auto; }
/* C gallery */
.sv--c { padding: 0; }
.sv-c-pin { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; gap: 36px; padding: 90px 0 50px; box-sizing: border-box; }
.sv-c-view { overflow: hidden; }
/* the pin is a flex column: without an explicit width its .container (margin: 0 auto) shrinks to its
   content; make it span the normal content width so heading and pills align with the other sections */
.sv-c-pin > .container { width: 100%; box-sizing: border-box; }
.sv-c-track { display: flex; gap: 24px; width: max-content; padding: 0 max(28px, calc((100vw - 1240px) / 2)); }
.sv-c-card { flex: none; width: min(560px, 80vw); box-sizing: border-box; display: flex; flex-direction: column; gap: 22px; padding: 34px; border-radius: 28px; background: var(--intigris-off-white); box-shadow: 0 30px 60px -36px rgba(64,35,1,.6); }
.sv-c-card--1 { background: var(--intigris-brown-700); color: var(--intigris-off-white); } .sv-c-card--1 .sv-logo--txt { color: var(--intigris-off-white); } .sv-c-card--1 .sv-who span { color: rgba(255,250,240,.65); } .sv-c-card--1 .sv-sector { color: #ffb59e; }
.sv-c-card--1 .sv-logo:not(.sv-logo--txt) { filter: brightness(0) invert(1); }
.sv-c-card--1 .sv-pills span { background: rgba(255,250,240,.1); border-color: rgba(255,250,240,.2); color: var(--intigris-off-white); }
.sv-c-card blockquote { font-size: clamp(24px, 2.3vw, 32px) !important; }
.sv-c-foot { margin-top: auto; display: flex; flex-direction: column; gap: 14px; }
.sv-c-end { flex: none; width: 240px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 10px; padding: 34px; border-radius: 28px; border: 2px dashed rgba(64,35,1,.35); color: var(--intigris-dark-brown); text-decoration: none; }
.sv-c-end b { font-size: 24px; font-weight: 500; } .sv-c-end span { font-size: 34px; }
.sv-c-bar { height: 4px; border-radius: 4px; background: rgba(64,35,1,.18); overflow: hidden; } .sv-c-bar i { display: block; height: 100%; background: var(--intigris-dark-brown); transform: scaleX(0); transform-origin: left; }
/* settled (after the first pass): native sideways scroll, no pin */
.sv--settled .sv-c-view { overflow-x: auto; scrollbar-width: none; scroll-snap-type: x proximity; overscroll-behavior-x: contain; }
.sv--settled .sv-c-view::-webkit-scrollbar { display: none; }
.sv--settled .sv-c-card, .sv--settled .sv-c-end { scroll-snap-align: center; }
/* C2 · heading left, industry pills right */
.sv-c2-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; flex-wrap: wrap; }
.sv--c2 .sv-head h2 { max-width: 9ch; }
.sv-c2-pills { margin-bottom: 6px; }
.sv-c2-pills { position: relative; display: inline-flex; padding: 5px; border-radius: 999px; background: rgba(64,35,1,.14); }
.sv-c2-thumb { position: absolute; top: 5px; bottom: 5px; left: 0; border-radius: 999px; background: var(--intigris-off-white); box-shadow: 0 6px 16px -8px rgba(64,35,1,.5); transition: transform .45s cubic-bezier(.2,.8,.2,1), width .45s cubic-bezier(.2,.8,.2,1); }
.sv-c2-pills button { all: unset; position: relative; z-index: 1; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; padding: 11px 18px; border-radius: 999px; font-size: 14.5px; font-weight: 500; color: var(--intigris-off-white); white-space: nowrap; transition: color .3s; }
.sv-c2-pills button small { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 99px; background: rgba(255,250,240,.22); }
.sv-c2-pills button.on { color: var(--intigris-dark-brown); } .sv-c2-pills button.on small { background: var(--intigris-coral-100); color: var(--intigris-coral-700); }
.sv-c2-pills button:focus-visible { outline: 2px solid var(--intigris-dark-brown); outline-offset: 2px; }
@media (max-width: 960px) {
  .sv { padding: 80px 0; } .sv-a-grid { grid-template-columns: 1fr; } .sv-a-deck { height: 520px; }
  .sv-b-wall { grid-template-columns: 1fr 1fr; } .sv-b-tile.open { grid-column: span 2; grid-row: auto; }
  .sv-c-view { overflow-x: auto; scroll-snap-type: x mandatory; } .sv-c-card { scroll-snap-align: start; }
  .sv-c2-pills { overflow-x: auto; max-width: 100%; }
}
`;
