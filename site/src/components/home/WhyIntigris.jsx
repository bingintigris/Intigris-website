/* ==================================================================== */
/*  Homepage (Salesforce view) · "Why Intigris" (replaces "Where do you    */
/*  start?", Bing 2026-11-24). Five variations for the design review.     */
/*    A · Proof bento    B · Intigris vs a typical partner                 */
/*    C · Pinned statement (SplitText)   D · The Intigris story (timeline) */
/*    E · Meet the people                                                  */
/*  ONLY documented facts (sources): partner profile Sep 2026 (since 2010, */
/*  300+ projects, CSAT 4.5, team 25+, clouds, industries), Summit Partner */
/*  since 1 Mar 2026 (dedicated PAM, Premier Success), Quickstart prices,  */
/*  Support brochure 2026 (hour bundle / SLA, P1 response 4 h).            */
/*  GSAP from npm, client only, gsap.context + revert (GSAP React skill).  */
/* ==================================================================== */
import React, { useEffect, useRef } from 'react';
import { tx, lp } from '../../lib/i18n.js';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function useGsap(ref, build, deps = []) {
  useEffect(() => {
    let ctx, alive = true;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      if (!alive || !ref.current || reduced()) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      ctx = gsap.context(() => build(gsap, ScrollTrigger, SplitText), ref);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, deps);
}

export const REASONS = () => [
  { id: 'summit', t: tx('Salesforce Summit Partner', 'Salesforce Summit Partner'), d: tx('The highest partner tier. That gives us a direct line into Salesforce: a dedicated partner manager and Premier Success support.', 'Het hoogste partnerniveau. Dat geeft ons een directe lijn met Salesforce: een vaste partnermanager en Premier Success-ondersteuning.'), proof: tx('Since March 2026', 'Sinds maart 2026') },
  { id: 'exp', t: tx('15+ years, 300+ projects', '15+ jaar, 300+ projecten'), d: tx('Salesforce partner since 2010. We have seen what works, and what doesn’t, in hundreds of implementations.', 'Salesforce-partner sinds 2010. We hebben in honderden implementaties gezien wat werkt, en wat niet.'), proof: tx('Partner since 2010', 'Partner sinds 2010') },
  { id: 'price', t: tx('You know the price before we build', 'Je weet de prijs voordat we bouwen'), d: tx('Fixed-price Quickstarts, from Sales Cloud to Field Service, and an Agentforce Kickstart of €3,950.', 'Quickstarts tegen een vaste prijs, van Sales Cloud tot Field Service, en een Agentforce Kickstart van €3.950.'), proof: tx('From €3,950', 'Vanaf €3.950') },
  { id: 'team', t: tx('One team for the whole platform', 'Eén team voor het hele platform'), d: tx('Sales, Service, Field Service, Agentforce, Experience Cloud and integrations. Business consulting and hands-on build in one team.', 'Sales, Service, Field Service, Agentforce, Experience Cloud en koppelingen. Bedrijfsadvies en het echte bouwwerk in één team.'), proof: tx('Team of 25+', 'Team van 25+') },
  { id: 'support', t: tx('We stay after go-live', 'We blijven na de livegang'), d: tx('Support with an hour bundle or an SLA, with agreed response times: within 4 hours for urgent issues.', 'Support met een urenpakket of SLA, met afgesproken reactietijden: binnen 4 uur bij urgente zaken.'), proof: tx('SLA · 4 h response', 'SLA · 4 u reactie') },
  { id: 'industry', t: tx('We know your industry', 'We kennen jouw branche'), d: tx('Energy & renewables, building installation, healthcare, manufacturing, security and software.', 'Energie & duurzaam, installatietechniek, zorg, maakindustrie, beveiliging en software.'), proof: tx('6 industries', '6 branches') },
];
const STATS = () => [
  { n: '2010', l: tx('Salesforce partner since', 'Salesforce-partner sinds') },
  { n: '300+', l: tx('projects completed', 'projecten afgerond') },
  { n: '4.5★', l: tx('customer satisfaction', 'klanttevredenheid') },
  { n: '25+', l: tx('people in Amsterdam', 'mensen in Amsterdam') },
];
const SUMMIT = '/assets/salesforce-summit-partner.webp';
function Head({ dark, center }) {
  return (
    <div className={'wi-head' + (dark ? ' wi-head--dark' : '') + (center ? ' wi-head--c' : '')}>
      <div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')}</div>
      <h2>{tx('The Salesforce partner', 'De Salesforce-partner')} <span>{tx('that stays.', 'die blijft.')}</span></h2>
      <p>{tx('Since 2010 we help Dutch companies work smarter with Salesforce: from the first conversation to support long after go-live.', 'Sinds 2010 helpen we Nederlandse bedrijven slimmer werken met Salesforce: van het eerste gesprek tot support lang na de livegang.')}</p>
    </div>
  );
}
const Cta = ({ light }) => <a className={'wi-cta' + (light ? ' wi-cta--light' : '')} href={lp('/contact')}>{tx('Plan 30 minutes with Frank', 'Plan 30 minuten met Frank')} <span aria-hidden="true">→</span></a>;

/* ---------- A · Proof bento ---------- */
export function WhyBento() {
  const ref = useRef(null); const R = REASONS(); const S = STATS();
  useGsap(ref, (gsap, ScrollTrigger) => {
    gsap.from('.wi-b-tile', { opacity: 0, y: 30, scale: 0.97, duration: 0.6, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.wi-bento', start: 'top 80%', once: true } });
  });
  return (
    <section className="wi wi--bento" ref={ref}>
      <div className="container">
        <Head />
        <div className="wi-bento">
          <div className="wi-b-tile wi-b-summit"><img src={SUMMIT} alt="Salesforce Summit Partner" /><div><b>{R[0].t}</b><span>{R[0].d}</span></div></div>
          {S.map((s) => <div key={s.n} className="wi-b-tile wi-b-stat"><b>{s.n}</b><span>{s.l}</span></div>)}
          {R.slice(2).map((r) => <div key={r.id} className={'wi-b-tile wi-b-reason wi-b-reason--' + r.id}><small>{r.proof}</small><b>{r.t}</b><span>{r.d}</span></div>)}
          <div className="wi-b-tile wi-b-cta"><b>{tx('Curious what we can do for you?', 'Benieuwd wat we voor jou kunnen doen?')}</b><Cta light /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- B · Intigris vs a typical partner ---------- */
const VS = () => [
  [tx('Open-ended hourly billing', 'Uurtje-factuurtje zonder einde'), tx('A fixed price before we build', 'Een vaste prijs voordat we bouwen')],
  [tx('A different specialist per cloud', 'Per cloud een andere specialist'), tx('One team for Sales, Service, Field Service and AI', 'Eén team voor Sales, Service, Field Service en AI')],
  [tx('Gone after go-live', 'Weg na de livegang'), tx('Support with agreed response times', 'Support met afgesproken reactietijden')],
  [tx('Generic templates', 'Standaard sjablonen'), tx('Experience in your industry', 'Ervaring in jouw branche')],
  [tx('A small partner, far from Salesforce', 'Kleine partner, ver van Salesforce'), tx('Summit Partner: a direct line into Salesforce', 'Summit Partner: een directe lijn met Salesforce')],
];
export function WhyVs() {
  const ref = useRef(null); const rows = VS();
  useGsap(ref, (gsap) => {
    gsap.from('.wi-vs-row', { opacity: 0, x: -24, duration: 0.5, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.wi-vs', start: 'top 78%', once: true } });
    gsap.from('.wi-vs-yes i', { scale: 0, duration: 0.4, ease: 'back.out(3)', stagger: 0.12, delay: 0.3, scrollTrigger: { trigger: '.wi-vs', start: 'top 78%', once: true } });
  });
  return (
    <section className="wi wi--vs" ref={ref}>
      <div className="container">
        <Head center />
        <div className="wi-vs">
          <div className="wi-vs-head"><span>{tx('A typical implementation partner', 'Een gemiddelde implementatiepartner')}</span><span className="wi-vs-us"><img src={SUMMIT} alt="" /> Intigris</span></div>
          {rows.map(([no, yes]) => <div key={yes} className="wi-vs-row"><div className="wi-vs-no"><i>✕</i>{no}</div><div className="wi-vs-yes"><i>✓</i>{yes}</div></div>)}
        </div>
        <div className="wi-vs-foot"><span>{tx('Partner since 2010 · 300+ projects · 4.5★ customer satisfaction', 'Partner sinds 2010 · 300+ projecten · 4.5★ klanttevredenheid')}</span><Cta /></div>
      </div>
    </section>
  );
}

/* ---------- C · Pinned statement ---------- */
export function WhyPinned() {
  const ref = useRef(null); const R = REASONS();
  useGsap(ref, (gsap, ScrollTrigger, SplitText) => {
    gsap.utils.toArray('.wi-p-item').forEach((el) => {
      const split = SplitText.create(el.querySelector('h3'), { type: 'words,chars' });
      gsap.from(split.chars, { opacity: 0, yPercent: 60, duration: 0.5, ease: 'power3.out', stagger: 0.015, scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
      gsap.from(el.querySelector('p'), { opacity: 0, y: 14, duration: 0.5, delay: 0.25, scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', toggleClass: 'on' });
    });
  });
  return (
    <section className="wi wi--pinned" ref={ref}>
      <div className="container wi-p-grid">
        <div className="wi-p-side">
          <div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')}</div>
          <h2>{tx('Why', 'Waarom')}<br /><span>Intigris?</span></h2>
          <img src={SUMMIT} alt="Salesforce Summit Partner" className="wi-p-badge" />
          <Cta light />
        </div>
        <div className="wi-p-list">
          {R.map((r, i) => <div key={r.id} className="wi-p-item"><span className="wi-p-num">{String(i + 1).padStart(2, '0')}</span><div><h3>{r.t}</h3><p>{r.d}</p><small>{r.proof}</small></div></div>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- D · The Intigris story ---------- */
const STORY = () => [
  ['2010', tx('Salesforce partner', 'Salesforce-partner'), tx('Intigris, founded by Hans Nieuwenhuis, becomes a Salesforce partner.', 'Intigris, opgericht door Hans Nieuwenhuis, wordt Salesforce-partner.')],
  ['300+', tx('projects later', 'projecten verder'), tx('Sales, Service and Field Service for companies in energy, installation, healthcare, software and more.', 'Sales, Service en Field Service voor bedrijven in energie, installatietechniek, zorg, software en meer.')],
  ['4.5★', tx('customer satisfaction', 'klanttevredenheid'), tx('Customers rate our work 4.5 out of 5.', 'Klanten waarderen ons werk met een 4,5 uit 5.')],
  ['2026', tx('Summit Partner', 'Summit Partner'), tx('Salesforce’s highest partner tier, plus the Agentforce Kickstart to put AI to work.', 'Het hoogste partnerniveau van Salesforce, plus de Agentforce Kickstart om AI aan het werk te zetten.')],
  [tx('Today', 'Nu'), tx('a team of 25+', 'een team van 25+'), tx('In Amsterdam, with fixed-price Quickstarts and support that stays after go-live.', 'In Amsterdam, met Quickstarts tegen een vaste prijs en support die blijft na de livegang.')],
];
export function WhyStory() {
  const ref = useRef(null); const st = STORY();
  useGsap(ref, (gsap) => {
    gsap.fromTo('.wi-s-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.wi-s-track', start: 'top 80%', end: 'bottom 40%', scrub: 0.6 } });
    gsap.from('.wi-s-step', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: '.wi-s-track', start: 'top 75%', once: true } });
  });
  return (
    <section className="wi wi--story" ref={ref}>
      <div className="container">
        <Head dark />
        <div className="wi-s-track">
          <div className="wi-s-line" aria-hidden="true"><i /></div>
          {st.map(([n, l, d]) => <div key={n} className="wi-s-step"><span className="wi-s-dot" /><b>{n}</b><em>{l}</em><p>{d}</p></div>)}
        </div>
        <div className="wi-s-foot"><img src={SUMMIT} alt="Salesforce Summit Partner" /><Cta light /></div>
      </div>
    </section>
  );
}

/* ---------- E · Meet the people ---------- */
const PEOPLE = () => [
  ['hans-nieuwenhuis.jpg', 'Hans Nieuwenhuis', tx('Founder', 'Oprichter')],
  ['frank-timmer.jpg', 'Frank Timmer', tx('Sales', 'Sales')],
  ['carlijn-de-haan.jpg', 'Carlijn de Haan', 'COO'],
  ['ronny-blom.jpg', 'Ronny Blom', tx('Salesforce consultant', 'Salesforce-consultant')],
  ['elzinus-van-der-kleij.jpg', 'Elzinus van der Kleij', tx('Salesforce consultant', 'Salesforce-consultant')],
];
export function WhyPeople() {
  const ref = useRef(null); const P = PEOPLE(); const R = REASONS();
  useGsap(ref, (gsap) => {
    gsap.from('.wi-e-face', { opacity: 0, y: 40, rotate: (i) => (i % 2 ? 6 : -6), duration: 0.7, ease: 'back.out(1.4)', stagger: 0.1, scrollTrigger: { trigger: '.wi-e-faces', start: 'top 80%', once: true } });
  });
  return (
    <section className="wi wi--people" ref={ref}>
      <div className="container wi-e-grid">
        <div>
          <div className="eyebrow">{tx('WHY INTIGRIS', 'WAAROM INTIGRIS')}</div>
          <h2 className="wi-e-title">{tx('Talk to the people', 'Praat met de mensen')} <span>{tx('who build it.', 'die het bouwen.')}</span></h2>
          <p className="wi-e-lede">{tx('No account managers in between: you work directly with a team of 25+ Salesforce specialists in Amsterdam. Partner since 2010, Summit Partner since 2026.', 'Geen accountmanagers ertussen: je werkt direct met een team van 25+ Salesforce-specialisten in Amsterdam. Partner sinds 2010, Summit Partner sinds 2026.')}</p>
          <ul className="wi-e-list">{R.slice(1, 6).map((r) => <li key={r.id}><b>✓</b>{r.t}</li>)}</ul>
          <Cta />
        </div>
        <div className="wi-e-faces">
          {P.map(([f, n, role], i) => <figure key={n} className={'wi-e-face wi-e-face--' + i}><img src={'/assets/team/' + f} alt={n} /><figcaption><b>{n}</b><span>{role}</span></figcaption></figure>)}
          <div className="wi-e-badge"><img src={SUMMIT} alt="Salesforce Summit Partner" /></div>
        </div>
      </div>
    </section>
  );
}

export function WiStyles() { return <style dangerouslySetInnerHTML={{ __html: WI_CSS }} />; }

const WI_CSS = `
.wi { padding: 110px 0; background: var(--intigris-off-white); color: var(--intigris-dark-brown); overflow: hidden; }
.wi-head { max-width: 760px; margin-bottom: 48px; }
.wi-head--c { margin: 0 auto 44px; text-align: center; }
.wi-head h2, .wi-p-side h2, .wi-e-title { font-size: clamp(38px, 4.6vw, 62px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 16px 0 0; color: inherit; }
.wi-head h2 span, .wi-p-side h2 span, .wi-e-title span { color: var(--intigris-coral); }
.wi-head p { font-size: 18px; line-height: 1.55; color: var(--fg-muted); margin: 18px 0 0; }
.wi-head--dark .eyebrow { color: rgba(255,250,240,.7); } .wi-head--dark p { color: inherit; opacity: .75; }
.wi-cta { display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px; border-radius: 999px; background: var(--intigris-dark-brown); color: var(--intigris-off-white); font-weight: 500; font-size: 15px; text-decoration: none; transition: background .2s; }
.wi-cta:hover { background: var(--intigris-coral); }
.wi-cta--light { background: var(--intigris-coral); } .wi-cta--light:hover { background: var(--intigris-coral-700); }
/* A bento */
.wi-bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(150px, auto); gap: 14px; }
.wi-b-tile { border-radius: 22px; padding: 24px; background: var(--intigris-paper); border: 1px solid var(--border); display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; }
.wi-b-tile b { display: block; font-size: 19px; font-weight: 600; letter-spacing: -0.01em; } .wi-b-tile span { display: block; font-size: 14.5px; line-height: 1.5; color: var(--fg-muted); }
.wi-b-tile small { font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--intigris-coral-700); }
.wi-b-summit { grid-column: span 2; grid-row: span 2; background: linear-gradient(150deg, #032d60, #0b5cab); color: #fff; border: 0; justify-content: space-between; }
.wi-b-summit img { width: 120px; height: auto; border-radius: 12px; }
.wi-b-summit b { font-size: clamp(26px, 2.6vw, 36px); margin-bottom: 8px; } .wi-b-summit span { color: rgba(255,255,255,.8); font-size: 16px; }
.wi-b-stat b { font-size: clamp(36px, 3.6vw, 52px); font-weight: 500; letter-spacing: -0.03em; color: var(--intigris-coral); }
.wi-b-reason--price { background: var(--intigris-coral); color: #fff; border: 0; } .wi-b-reason--price span, .wi-b-reason--price small { color: rgba(255,255,255,.88); }
.wi-b-reason--support { background: var(--intigris-brown-700); color: var(--intigris-off-white); border: 0; } .wi-b-reason--support span { color: rgba(255,250,240,.75); } .wi-b-reason--support small { color: #ffb59e; }
.wi-b-cta { grid-column: span 4; background: transparent; border-style: dashed; flex-direction: row; align-items: center; justify-content: space-between; }
/* B vs */
.wi-vs { max-width: 980px; margin: 0 auto; border-radius: 26px; overflow: hidden; border: 1px solid var(--border); background: var(--intigris-paper); }
.wi-vs-head, .wi-vs-row { display: grid; grid-template-columns: 1fr 1fr; }
.wi-vs-head span { padding: 18px 26px; font-size: 13px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--fg-muted); }
.wi-vs-head .wi-vs-us { display: flex; align-items: center; gap: 10px; background: var(--intigris-coral); color: #fff; font-size: 16px; letter-spacing: 0; text-transform: none; }
.wi-vs-head .wi-vs-us img { height: 34px; border-radius: 6px; }
.wi-vs-row { border-top: 1px solid var(--border); }
.wi-vs-no, .wi-vs-yes { display: flex; align-items: center; gap: 14px; padding: 20px 26px; font-size: 17px; }
.wi-vs-no { color: var(--fg-muted); } .wi-vs-no i { font-style: normal; color: #b9aa98; font-weight: 700; }
.wi-vs-yes { background: #fff6f2; font-weight: 600; } .wi-vs-yes i { font-style: normal; display: grid; place-items: center; width: 26px; height: 26px; flex: none; border-radius: 50%; background: var(--intigris-coral); color: #fff; font-size: 14px; }
.wi-vs-foot { max-width: 980px; margin: 24px auto 0; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; font-size: 15px; color: var(--fg-muted); }
/* C pinned */
.wi--pinned { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
.wi-p-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 64px; align-items: start; }
.wi-p-side { position: sticky; top: 120px; display: flex; flex-direction: column; align-items: flex-start; gap: 22px; }
.wi-p-side .eyebrow { color: rgba(255,250,240,.7); } .wi-p-side h2 { margin: 0; font-size: clamp(48px, 6vw, 88px); }
.wi-p-badge { width: 110px; border-radius: 12px; }
.wi-p-item { display: grid; grid-template-columns: 60px 1fr; gap: 18px; padding: 34px 0; border-top: 1px solid rgba(255,250,240,.14); opacity: .5; transition: opacity .4s; }
.wi-p-item.on { opacity: 1; }
.wi-p-num { font-size: 15px; font-weight: 600; color: var(--intigris-coral); padding-top: 10px; }
.wi-p-item h3 { font-size: clamp(26px, 2.8vw, 38px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.1; margin: 0; color: var(--intigris-off-white); }
.wi-p-item p { font-size: 17px; line-height: 1.55; opacity: .75; margin: 12px 0 10px; max-width: 34em; }
.wi-p-item small { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #ffb59e; }
/* D story */
.wi--story { background: linear-gradient(160deg, #3a2108, var(--intigris-brown-700)); color: var(--intigris-off-white); }
.wi-s-track { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; padding-top: 40px; }
.wi-s-line { position: absolute; left: 0; right: 0; top: 47px; height: 3px; background: rgba(255,250,240,.14); border-radius: 3px; }
.wi-s-line i { display: block; height: 100%; background: var(--intigris-coral); transform-origin: left; border-radius: 3px; }
.wi-s-step { position: relative; display: flex; flex-direction: column; gap: 6px; }
.wi-s-dot { width: 17px; height: 17px; border-radius: 50%; background: var(--intigris-coral); box-shadow: 0 0 0 6px rgba(255,92,57,.2); margin-bottom: 18px; }
.wi-s-step b { font-size: clamp(34px, 3.4vw, 48px); font-weight: 500; letter-spacing: -0.03em; }
.wi-s-step em { font-style: normal; font-size: 14px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #ffb59e; }
.wi-s-step p { font-size: 15px; line-height: 1.5; opacity: .75; margin: 6px 0 0; }
.wi-s-foot { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 52px; padding-top: 28px; border-top: 1px solid rgba(255,250,240,.12); }
.wi-s-foot img { height: 72px; border-radius: 10px; }
/* E people */
.wi-e-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.wi-e-lede { font-size: 18px; line-height: 1.55; color: var(--fg-muted); margin: 18px 0 22px; }
.wi-e-list { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 10px; font-size: 16.5px; font-weight: 500; }
.wi-e-list b { display: inline-grid; place-items: center; width: 24px; height: 24px; margin-right: 10px; border-radius: 50%; background: var(--intigris-coral); color: #fff; font-size: 13px; }
.wi-e-faces { position: relative; height: 520px; }
.wi-e-face { position: absolute; width: 44%; margin: 0; border-radius: 20px; overflow: hidden; background: #fff; box-shadow: 0 24px 50px -28px rgba(43,23,0,.55); }
.wi-e-face img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; object-position: top; }
.wi-e-face figcaption { padding: 10px 14px; } .wi-e-face b { display: block; font-size: 14px; } .wi-e-face span { font-size: 12.5px; color: var(--fg-muted); }
.wi-e-face--0 { left: 32%; top: 0; z-index: 3; width: 36%; } .wi-e-face--1 { left: 0; top: 14%; transform: rotate(-4deg); z-index: 2; width: 34%; } .wi-e-face--2 { right: 0; top: 12%; transform: rotate(4deg); z-index: 4; width: 34%; }
.wi-e-face--3 { left: 6%; bottom: 0; transform: rotate(3deg); width: 32%; z-index: 4; } .wi-e-face--4 { right: 8%; bottom: 2%; transform: rotate(-3deg); width: 32%; z-index: 4; }
.wi-e-face img { aspect-ratio: 1; }
.wi-e-badge { position: absolute; left: 50%; bottom: 6%; transform: translateX(-50%); z-index: 5; } .wi-e-badge img { width: 92px; border-radius: 12px; box-shadow: 0 16px 30px -14px rgba(0,0,0,.5); }
@media (max-width: 960px) {
  .wi { padding: 80px 0; }
  .wi-bento { grid-template-columns: 1fr 1fr; } .wi-b-summit, .wi-b-cta { grid-column: span 2; } .wi-b-summit { grid-row: auto; }
  .wi-vs-no, .wi-vs-yes { padding: 14px; font-size: 15px; }
  .wi-p-grid, .wi-e-grid { grid-template-columns: 1fr; gap: 32px; } .wi-p-side { position: static; }
  .wi-s-track { grid-template-columns: 1fr; } .wi-s-line { display: none; }
  .wi-e-faces { height: 420px; }
}
`;
