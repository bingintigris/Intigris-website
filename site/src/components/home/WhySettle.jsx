/* ==================================================================== */
/*  "Why Intigris" round 4 (Bing 2026-11-24): the chosen scroll line     */
/*  (WhyLine) plays ONCE. After the last reason the same five blocks     */
/*  fly (GSAP Flip) into a compact overview that fits one screen and     */
/*  stays: scrolling back up passes a short, still section, no replay.   */
/*    A · cards    five cards in a row, proof on top                     */
/*    B · bento    heading left, 2×2 tiles + a wide 4.5★ bar             */
/*    C · line     the vertical line turns horizontal: five checkpoints  */
/* ==================================================================== */
import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { tx } from '../../lib/i18n.js';
import { PROMISES, Proof } from './WhyStack.jsx';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function WhySettle({ look = 'cards' }) {
  const ref = useRef(null); const P = PROMISES();
  const [act, setAct] = useState(-1);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    let ctx, alive = true, done = false;
    const w = window;
    // homepage: the page's own GSAP (CDN, synced with Lenis); elsewhere the npm copy
    const load = w.gsap && w.ScrollTrigger && w.SplitText && w.Flip
      ? Promise.resolve([{ gsap: w.gsap }, { ScrollTrigger: w.ScrollTrigger }, { SplitText: w.SplitText }, { Flip: w.Flip }])
      : Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'), import('gsap/Flip')]);
    load.then(([{ gsap }, { ScrollTrigger }, { SplitText }, { Flip }]) => {
      const root = ref.current;
      if (!alive || !root) return;
      if (reduced()) { setAct(P.length); return; }
      gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
      const wide = w.matchMedia('(min-width: 1000px)').matches;
      /* Smooth handover (Bing 2026-11-24): 1) the timeline fades out while the heading stays,
         2) layout switches while the list is invisible (incl. the scroll correction),
         3) the heading glides to its new place and the tiles rise in one by one. */
      const settle = () => {
        if (done || !alive) return; done = true;
        const list = root.querySelector('.ws1-list');
        gsap.to(list, { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in', onComplete: () => {
          if (!alive) return;
          const side = root.querySelector('.ws1-side');
          const before = side.getBoundingClientRect().top;
          ctx.revert();
          flushSync(() => { setAct(P.length); setSettled(true); });
          gsap.set(list, { opacity: 1, y: 0 });
          // put the overview in view: centred when it fits the screen, else its top at the top
          const r = root.getBoundingClientRect();
          const y = Math.max(0, w.scrollY + r.top + Math.min(0, (r.height - w.innerHeight) / 2));
          if (w.lenis) w.lenis.scrollTo(y, { immediate: true, force: true }); else w.scrollTo(0, y);
          // heading glides from where it was on screen to its new place
          gsap.from(side, { y: before - side.getBoundingClientRect().top, duration: 0.8, ease: 'power3.inOut', clearProps: 'transform' });
          gsap.from(root.querySelectorAll('.ws1-item'), { opacity: 0, y: 34, scale: 0.97, duration: 0.7, stagger: 0.08, delay: 0.05, ease: 'power3.out', clearProps: 'opacity,transform' });
          ScrollTrigger.refresh();
        } });
      };
      ctx = gsap.context(() => {
        gsap.fromTo('.ws1-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.ws1-list', start: 'top 60%', end: 'bottom 60%', scrub: 0.4,
          onLeave: () => wide && requestAnimationFrame(settle) } });
        gsap.utils.toArray('.ws1-item').forEach((el, i) => {
          ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 60%', onToggle: (self) => self.isActive && setAct(i), onEnterBack: () => setAct(i) });
          const split = SplitText.create(el.querySelector('h3'), { type: 'words,chars' });
          gsap.from(split.chars, { yPercent: 100, opacity: 0, stagger: 0.012, duration: 0.45, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 70%', once: true } });
        });
      }, root);
      clearTimeout(w.__wsoRefresh); w.__wsoRefresh = setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 250);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, []);
  return (
    <section className={'ws ws--1 wso wso--' + look + (settled ? ' is-settled' : '')} ref={ref}>
      <div className="container ws1-grid">
        <div className="ws1-side">
          <div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')}</div>
          <h2><em className="ws1-line">{tx('We breathe', 'Wij ademen')}</em><br /><span className="ws1-line">Salesforce.</span></h2>
          <p>{tx('Five reasons Dutch companies choose us as their Salesforce partner.', 'Vijf redenen waarom Nederlandse bedrijven ons kiezen als Salesforce-partner.')}</p>
        </div>
        <div className="ws1-list">
          <div className="ws1-track" aria-hidden="true"><i className="ws1-fill" /></div>
          {P.map((p, i) => (
            <div key={p.id} className={'ws1-item ws1-item--' + p.id + (i === act ? ' on' : '') + (i < act ? ' past' : '')}>
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
export const WhySettleCards = () => <WhySettle look="cards" />;
export const WhySettleBento = () => <WhySettle look="bento" />;
export const WhySettleLine = () => <WhySettle look="line" />;

export function WsoStyles() { return <style dangerouslySetInnerHTML={{ __html: WSO_CSS }} />; }

/* Settled layouts only apply on wide screens; on phones the timeline simply stays. */
const WSO_CSS = `
@media (min-width: 1000px) {
.wso.is-settled { padding: 96px 0 88px; }
.wso.is-settled .ws1-item { opacity: 1; transition: none; }
.wso.is-settled .ws1-item .ws-proof { opacity: 1; transform: none; min-width: 0; }
.wso.is-settled .ws1-dot { box-shadow: none !important; transform: none !important; }
.wso.is-settled .ws-proof--s svg { display: block; width: 100%; min-width: 120px; }
.wso.is-settled .ws-sla { margin-top: 2px; } .wso.is-settled .ws-sla b { white-space: nowrap; } .wso.is-settled .ws-sla span { font-size: 11px; line-height: 1.3; }

/* A · cards: heading row on top, five cards below */
.wso--cards.is-settled .ws1-grid { display: block; }
.wso--cards.is-settled .ws1-side { position: static; display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto auto; column-gap: 48px; align-items: end; }
.wso--cards.is-settled .ws1-side .eyebrow { grid-column: 1 / -1; }
.wso--cards.is-settled .ws1-side h2 { font-size: clamp(38px, 4vw, 58px); }
.wso--cards.is-settled .ws1-side p { max-width: 20em; padding-bottom: 8px; }
.wso--cards.is-settled .ws1-list { padding: 0; margin-top: 40px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
.wso--cards.is-settled .ws1-track, .wso--cards.is-settled .ws1-dot { display: none; }
.wso--cards.is-settled .ws1-item { display: flex; flex-direction: column-reverse; justify-content: flex-end; gap: 18px; padding: 18px; border: 1px solid var(--border); border-radius: 22px; background: #fff; box-shadow: 0 24px 50px -40px rgba(43,23,0,.5); }
.wso--cards.is-settled .ws1-item .ws-proof { width: 100%; height: 112px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; padding: 12px 14px; }
.wso--cards.is-settled .ws-sla { margin-top: 0; } .wso--cards.is-settled .ws-sla b { white-space: nowrap; } .wso--cards.is-settled .ws-sla span { font-size: 11px; line-height: 1.3; }
.wso--cards.is-settled .ws-gantt { gap: 5px; }
.wso--cards.is-settled .ws1-text h3 { font-size: 21px; margin: 4px 0 8px; }
.wso--cards.is-settled .ws1-text p { font-size: 13.5px; line-height: 1.5; }
.wso--cards.is-settled .ws-proof--q b { font-size: 36px; } .wso--cards.is-settled .ws-proof--c b { font-size: 28px; margin-top: 2px; } .wso--cards.is-settled .ws-stars { font-size: 22px; }
.wso--cards.is-settled .ws-proof--b img { width: 78px; } .wso--cards.is-settled .ws-sla b { font-size: 26px; } .wso--cards.is-settled .ws-proof--s svg { height: 30px; }
.wso--cards.is-settled .ws-gantt div { grid-template-columns: 48px 1fr; font-size: 10.5px; } .wso--cards.is-settled .ws-flag { font-size: 11.5px; margin-top: 6px; }

/* B · bento: heading left, 2×2 tiles + a wide coral 4.5★ bar on the right */
.wso--bento.is-settled .ws1-grid { align-items: center; }
.wso--bento.is-settled .ws1-side { position: static; }
.wso--bento.is-settled .ws1-list { padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.wso--bento.is-settled .ws1-track, .wso--bento.is-settled .ws1-dot { display: none; }
.wso--bento.is-settled .ws1-item { grid-template-columns: 1fr auto; gap: 16px; padding: 20px 22px; border: 1px solid var(--border); border-radius: 22px; background: #fff; }
.wso--bento.is-settled .ws1-text h3 { font-size: 22px; margin: 4px 0 0; }
.wso--bento.is-settled .ws1-text p { display: none; }
.wso--bento.is-settled .ws1-item .ws-proof { padding: 10px 12px; border: 0; background: var(--intigris-paper); }
.wso--bento.is-settled .ws-proof--q b { font-size: 30px; } .wso--bento.is-settled .ws-proof--q span { font-size: 11px; }
.wso--bento.is-settled .ws-proof--t { width: 150px; } .wso--bento.is-settled .ws-gantt div { grid-template-columns: 44px 1fr; font-size: 10px; } .wso--bento.is-settled .ws-flag { display: none; }
.wso--bento.is-settled .ws-proof--s { width: 140px; } .wso--bento.is-settled .ws-proof--s svg { height: 26px; } .wso--bento.is-settled .ws-sla span { display: none; } .wso--bento.is-settled .ws-sla b { font-size: 22px; }
.wso--bento.is-settled .ws-proof--b { background: linear-gradient(150deg, #032d60, #0b5cab); } .wso--bento.is-settled .ws-proof--b img { width: 64px; }
.wso--bento.is-settled .ws1-item--csat { grid-column: 1 / -1; background: var(--intigris-coral); border-color: var(--intigris-coral); color: #fff; }
.wso--bento.is-settled .ws1-item--csat h3, .wso--bento.is-settled .ws1-item--csat small { color: #fff; }
.wso--bento.is-settled .ws1-item--csat .ws1-text p { display: block; color: rgba(255,255,255,.85); font-size: 14px; margin-top: 4px; }
.wso--bento.is-settled .ws1-item--csat .ws-proof { background: rgba(255,255,255,.16); display: flex; align-items: center; gap: 14px; }
.wso--bento.is-settled .ws1-item--csat .ws-stars { font-size: 24px; } .wso--bento.is-settled .ws1-item--csat .ws-stars span { color: rgba(255,255,255,.35); } .wso--bento.is-settled .ws1-item--csat .ws-stars i::before { color: #fff; }
.wso--bento.is-settled .ws1-item--csat .ws-proof--c b { font-size: 30px; margin: 0; color: #fff; } .wso--bento.is-settled .ws1-item--csat .ws-proof--c b small { color: rgba(255,255,255,.75); }

/* C · line: the vertical line turns horizontal, five checkpoints along it */
.wso--line.is-settled .ws1-grid { display: block; }
.wso--line.is-settled .ws1-side { position: static; align-items: center; text-align: center; gap: 12px; }
.wso--line.is-settled .ws1-side h2 { font-size: clamp(38px, 4.2vw, 62px); }
.wso--line.is-settled .ws1-list { padding: 0; margin-top: 52px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 24px; }
.wso--line.is-settled .ws1-track { left: 0; right: 0; top: 9px; bottom: auto; width: auto; height: 3px; }
.wso--line.is-settled .ws1-fill { transform: none !important; }
.wso--line.is-settled .ws1-item { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; padding: 40px 0 0; border: 0; }
.wso--line.is-settled .ws1-dot { left: 0; top: 0; margin: 0; background: var(--intigris-coral); border-color: var(--intigris-coral); }
.wso--line.is-settled .ws1-text h3 { font-size: 22px; margin: 4px 0 6px; }
.wso--line.is-settled .ws1-text p { font-size: 13.5px; line-height: 1.5; }
.wso--line.is-settled .ws1-item .ws-proof { width: 100%; box-sizing: border-box; padding: 12px 14px; order: -1; height: 96px; display: flex; flex-direction: column; justify-content: center; background: #fff; }
.wso--line.is-settled .ws-proof--b { background: linear-gradient(150deg, #032d60, #0b5cab); } .wso--line.is-settled .ws-proof--b img { width: 64px; }
.wso--line.is-settled .ws-proof--q b { font-size: 32px; } .wso--line.is-settled .ws-proof--c b { font-size: 24px; margin-top: 2px; } .wso--line.is-settled .ws-stars { font-size: 20px; }
.wso--line.is-settled .ws-sla b { font-size: 22px; } .wso--line.is-settled .ws-sla span { font-size: 11px; } .wso--line.is-settled .ws-proof--s svg { height: 24px; }
.wso--line.is-settled .ws-gantt { gap: 4px; } .wso--line.is-settled .ws-gantt div { grid-template-columns: 46px 1fr; font-size: 10px; } .wso--line.is-settled .ws-flag { display: none; }
}
`;
