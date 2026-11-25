/* ==================================================================== */
/*  Hero scroll effects · three variations for the design review (:8004)   */
/*  Bing (2026-11-24): preview scroll effects on a COPY of the homepage    */
/*  top section here; the real hero on :8003 stays untouched until a pick. */
/*    1 · Card lift    : side margins grow, corners round                   */
/*    2 · Depth        : photo slower + slight zoom, text/stats drift up    */
/*    3 · Photo reveal : photo comes forward, warm wash, word turns light   */
/*  The copy mirrors HeroCinematic in legacy/components/Hero.jsx (coral    */
/*  mood, Salesforce view). GSAP + ScrollTrigger from npm, client only.    */
/* ==================================================================== */
import React, { useEffect, useRef } from 'react';
import { tx } from '../../lib/i18n.js';
import { HeroStats } from '../../legacy/components/Hero.jsx';

function useFx(ref, fx) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx, alive = true;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!alive || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const hero = ref.current.querySelector('.hfx-hero');
        const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
        if (fx === 1) {
          gsap.fromTo(hero, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 56px 56px)' }, { clipPath: 'inset(0% 4% 0% 4% round 0px 0px 44px 44px)', ease: 'none', scrollTrigger: { ...st, start: 'top 80px', end: '60% top' } });
          gsap.to('.hfx-content', { y: 60, ease: 'none', scrollTrigger: st });
        } else if (fx === 2) {
          gsap.fromTo('.hfx-photo', { scale: 1, yPercent: 0 }, { scale: 1.14, yPercent: 14, ease: 'none', scrollTrigger: { ...st, start: 'top 80px' } });
          gsap.to('.hfx-text', { yPercent: -18, ease: 'none', scrollTrigger: { ...st, start: 'top 80px' } });
          gsap.to('.hfx-stats', { yPercent: -70, ease: 'none', scrollTrigger: { ...st, start: 'top 80px' } });
        } else if (fx === 3) {
          const s3 = { ...st, start: 'top 80px', end: '70% top' };
          gsap.to('.hfx-photo', { opacity: 0.85, WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, transparent 0%, #000 40%)', maskImage: 'linear-gradient(90deg, transparent 0%, transparent 0%, #000 40%)', ease: 'none', scrollTrigger: s3 });
          gsap.to('.hfx-wash', { opacity: 0.32, ease: 'none', scrollTrigger: s3 });
          gsap.to('.hfx-word', { color: 'var(--intigris-off-white)', ease: 'none', scrollTrigger: { ...st, start: 'top 40px', end: '45% top' } });
        }
      }, ref);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, []);
}

function HeroCopy({ fx }) {
  const ref = useRef(null);
  useFx(ref, fx);
  return (
    <div className="hfx-wrap" ref={ref}>
      <section className="hfx-hero">
        <div aria-hidden className="hfx-photo" />
        <div aria-hidden className="hfx-shade" />
        <div aria-hidden className="hfx-wash" />
        <div className="container-wide hfx-content">
          <div className="hfx-top">
            <div className="hfx-text">
              <div className="eyebrow" style={{ marginBottom: 24, color: 'var(--intigris-dark-brown)' }}>Salesforce Implementation Partner</div>
              <h1 className="display-stack" style={{ color: 'var(--intigris-off-white)', margin: 0 }}>
                <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{tx('Smarten up', 'Maak je')}</span>
                <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{tx('your ', '')}<span className="hfx-word">{tx('Business.', 'Business slimmer.')}</span></span>
              </h1>
              <div className="hfx-toggle"><span>{tx('AI solutions', 'AI-oplossingen')}</span><span className="on">{tx('Salesforce solutions', 'Salesforce-oplossingen')}</span></div>
            </div>
            <div className="hfx-stats"><HeroStats tx={tx} glass /></div>
          </div>
        </div>
      </section>
      <div className="hfx-after">
        <div className="container-wide"><div className="eyebrow" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{tx('TRUSTED BY', 'VERTROUWD DOOR')}</div></div>
        <div className="container hfx-filler">{tx('↓ Scroll slowly from the top of this preview to see the effect.', '↓ Scroll langzaam vanaf de bovenkant van deze preview om het effect te zien.')}</div>
      </div>
    </div>
  );
}

export const HeroFx1 = () => <HeroCopy fx={1} />;
export const HeroFx2 = () => <HeroCopy fx={2} />;
export const HeroFx3 = () => <HeroCopy fx={3} />;

export function HfxStyles() { return <style dangerouslySetInnerHTML={{ __html: HFX_CSS }} />; }

const HFX_CSS = `
.hfx-wrap { background: var(--intigris-off-white); }
.hfx-hero { position: relative; overflow: hidden; isolation: isolate; background: linear-gradient(90deg, #ff9166 0%, var(--intigris-coral) 44%, var(--intigris-coral-700) 80%, #9e300d 100%); border-bottom-left-radius: clamp(24px, 4vw, 56px); border-bottom-right-radius: clamp(24px, 4vw, 56px); }
.hfx-photo { position: absolute; inset: 0; z-index: 0; background-image: url("/assets/hero-team.jpg"); background-size: cover; background-position: center right; mix-blend-mode: multiply; opacity: .5; -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent 30%, #000 72%); mask-image: linear-gradient(90deg, transparent 0%, transparent 30%, #000 72%); }
.hfx-shade { position: absolute; inset: 0; z-index: 0; background: linear-gradient(180deg, rgba(64,35,1,0) 40%, rgba(64,35,1,.28) 100%); }
.hfx-wash { position: absolute; inset: 0; z-index: 0; opacity: 0; background: linear-gradient(120deg, #52300a 0%, var(--intigris-dark-brown) 60%, #2a1700 100%); }
.hfx-content { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: flex-end; min-height: min(80vh, 760px); padding-top: clamp(110px, 14vh, 160px); padding-bottom: clamp(28px, 4vh, 44px); }
.hfx-top { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 72px); align-items: end; }
.hfx-word { color: var(--intigris-dark-brown); }
.hfx-toggle { display: inline-flex; margin-top: clamp(28px, 4vh, 40px); padding: 5px; border-radius: 999px; background: var(--intigris-off-white); box-shadow: 0 6px 20px rgba(64,35,1,.14); }
.hfx-toggle span { padding: 13px clamp(18px, 3vw, 32px); border-radius: 999px; font-size: 15px; font-weight: 500; color: var(--intigris-dark-brown); white-space: nowrap; }
.hfx-toggle span.on { background: #00A1E0; color: var(--intigris-off-white); box-shadow: 0 4px 14px rgba(0,161,224,.45); }
.hfx-stats { justify-self: end; padding-bottom: 8px; width: 100%; max-width: 420px; }
.hfx-after { padding: 22px 0 0; }
.hfx-filler { min-height: 70vh; padding-top: 60px; font-size: 15px; color: var(--fg-muted); }
@media (max-width: 960px) { .hfx-top { grid-template-columns: 1fr; } .hfx-stats { justify-self: start; } }
`;
