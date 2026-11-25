/* ==================================================================== */
/*  HOMEPAGE · AI SOLUTIONS view (index, mode = ai, the default)         */
/*  v2 "futuristic" redesign (Bing 2026-11-25): own look, does not need  */
/*  to match the Salesforce view. Inspiration: openwhispr.com (clean     */
/*  bento cards with live mini product demos) + dark AI-tech hero with   */
/*  a live neural canvas and scroll transitions (sticky ladder,          */
/*  horizontal method track, word-by-word statement).                    */
/*  Content = the Agentris market proposition (Bitbucket                 */
/*  intigris/agentris-market-proposition, 20 Nov 2026) under the         */
/*  Intigris brand (decision 1A). AI-ify = umbrella approach; the AI     */
/*  Readiness Scan is the light "step 0" below it (decision 2).          */
/*  Rules: no prices, no free check, no "fixed prices", system-          */
/*  independent, no certification claims, no tool logos (text only).     */
/*  Motion: GSAP + ScrollTrigger (page copy synced with Lenis, npm copy  */
/*  elsewhere); everything is static for prefers-reduced-motion and the  */
/*  pinned/horizontal parts fall back to plain stacks below 900px.       */
/* ==================================================================== */
import React, { useEffect, useRef, useState } from 'react';
import { tx, lp } from '../../lib/i18n.js';
import { V3FaqChat, V3Styles } from '../../legacy/components/CloudKitV3.jsx';
import { CkStyles } from '../../legacy/components/CloudKit.jsx';
import { TalkChatAsk, TkStyles } from './TalkVariants.jsx';
import { useHeadingReveal } from '../../lib/headingReveal.js';

const isBrowser = typeof window !== 'undefined';
const reduced = () => isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = () => isBrowser && window.matchMedia('(min-width: 900px)').matches;

/* ---------- GSAP loader: the page's own copy (synced with Lenis) or npm ---------- */
function loadGsap() {
  const w = window;
  if (w.gsap && w.ScrollTrigger) return Promise.resolve({ gsap: w.gsap, ScrollTrigger: w.ScrollTrigger, SplitText: w.SplitText });
  return Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')])
    .then(([a, b, c]) => ({ gsap: a.gsap || a.default, ScrollTrigger: b.ScrollTrigger, SplitText: c.SplitText }));
}
function useGsap(ref, setup) {
  useEffect(() => {
    if (reduced()) return;
    let ctx, alive = true;
    loadGsap().then((g) => {
      if (!alive || !ref.current) return;
      g.gsap.registerPlugin(g.ScrollTrigger, ...(g.SplitText ? [g.SplitText] : []));
      ctx = g.gsap.context(() => setup({ ...g, root: ref.current }), ref.current);
      clearTimeout(window.__hxRefresh);
      window.__hxRefresh = setTimeout(() => { g.ScrollTrigger.sort && g.ScrollTrigger.sort(); g.ScrollTrigger.refresh(); }, 300);
    });
    return () => { alive = false; ctx && ctx.revert(); };
  }, []);
}
/* "in" once the element is on screen (CSS-driven micro animations) */
function useIn(threshold = 0.25) {
  const ref = useRef(null); const [inV, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window) || reduced()) { setIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, inV];
}
/* cursor spotlight on cards: sets --mx / --my */
const spot = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', (e.clientX - r.left) + 'px'); e.currentTarget.style.setProperty('--my', (e.clientY - r.top) + 'px'); };
const Arrow = () => <span className="hx-arrow" aria-hidden="true">→</span>;
const scrollToId = (id) => { const el = document.getElementById(id); if (!el) return; if (window.lenis) window.lenis.scrollTo(el, { offset: -20 }); else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }); };

/* ---------- icons ---------- */
const ICONS = {
  agent: <><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6" /></>,
  flow: <><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 12h5l5-6M12 12l5 6" /></>,
  cloud: <><path d="M7 18a5 5 0 01-.6-9.96A6 6 0 0118 9a4 4 0 01-1 7.87" /><path d="M8 18h9" /></>,
  link: <><path d="M9 7H6a3 3 0 000 6h3M15 7h3a3 3 0 010 6h-3M8 10h8" /><path d="M12 17v4" /></>,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></>,
  route: <><circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 6h3a4 4 0 014 4v0a2 2 0 002 2h1M7 18h3a4 4 0 004-4" /></>,
  team: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016-4.6" /></>,
  learn: <><path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" /><path d="M2 19h20M9 9h6M9 13h4" /></>,
  scan: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M8 11h6M11 8v6" /></>,
  build: <><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></>,
  run: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
  spark: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></>,
};
const Icon = ({ k }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k]}</svg>;

/* Section heading with a word-rise reveal (SplitText, see SiteAIHome) */
const Head = ({ eyebrow, a, b, lede, center }) => (
  <div className={'hx-head' + (center ? ' hx-head--c' : '')}>
    <span className="hx-eyebrow"><i />{eyebrow}</span>
    <h2 className="hx-h2 hx-split">{a} <em>{b}</em></h2>
    {lede && <p className="hx-lede">{lede}</p>}
  </div>
);

/* ==================================================================== */
/*  0 · HERO (AI view only): neural canvas, scramble word, agent console  */
/* ==================================================================== */
function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const host = c.parentElement;
    const ctx = c.getContext('2d'); let W = 0, H = 0, dpr = 1, raf = 0, on = true;
    const mouse = { x: -9999, y: -9999 };
    let pts = [];
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, (W * H) / 14000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6, hot: Math.random() < .18 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 180) { p.x += dx * .006; p.y += dy * .006; }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            const near = Math.hypot(mouse.x - a.x, mouse.y - a.y) < 200;
            ctx.strokeStyle = near ? `rgba(255,95,54,${(1 - d / 130) * .55})` : `rgba(154,184,226,${(1 - d / 130) * .22})`;
            ctx.lineWidth = near ? 1 : .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = p.hot ? 'rgba(255,95,54,.95)' : 'rgba(252,247,235,.55)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.hot ? p.r + .8 : p.r, 0, Math.PI * 2); ctx.fill();
      }
    };
    const loop = () => { if (on) draw(); raf = requestAnimationFrame(loop); };
    size(); draw();
    const move = (e) => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const leave = () => { mouse.x = mouse.y = -9999; };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; });
    io.observe(c);
    window.addEventListener('resize', size);
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
    if (!reduced()) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', size); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); };
  }, []);
  return <canvas ref={ref} className="hx-canvas" aria-hidden="true" />;
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/_#';
function Scramble({ words }) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState(words[0]);
  useEffect(() => {
    const t = setTimeout(() => setI((k) => (k + 1) % words.length), i === 0 ? 3600 : 2400);
    return () => clearTimeout(t);
  }, [i]);
  useEffect(() => {
    const target = words[i]; if (reduced()) { setTxt(target); return; }
    let f = 0, raf; const N = 22;
    const step = () => {
      f++;
      const keep = Math.floor((f / N) * target.length);
      setTxt(target.split('').map((ch, k) => (k < keep || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''));
      if (f < N) raf = requestAnimationFrame(step); else setTxt(target);
    };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [i]);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');
  return <span className="hx-scramble"><span aria-hidden="true" className="hx-scramble-ghost">{longest}.</span><span className="hx-scramble-live">{txt}<b>.</b></span></span>;
}

const CONSOLE = () => [
  { k: 'run', t: tx('Reading meeting notes', 'Gespreksverslag lezen'), ok: tx('14 requirements found', '14 eisen gevonden') },
  { k: 'run', t: tx('Matching earlier quotes', 'Eerdere offertes vergelijken'), ok: tx('3 similar quotes', '3 vergelijkbare offertes') },
  { k: 'run', t: tx('Drafting the quote', 'Offerte opstellen'), ok: tx('Draft ready', 'Concept klaar'), bar: true },
  { k: 'hold', t: tx('Waiting for approval', 'Wacht op goedkeuring'), ok: tx('Consultant approved', 'Consultant akkoord') },
];
function AgentConsole() {
  const L = CONSOLE();
  const [s, setS] = useState(0); /* odd = step running, even = step done */
  useEffect(() => {
    if (reduced()) { setS(L.length * 2); return; }
    const t = setTimeout(() => setS((v) => (v >= L.length * 2 + 3 ? 0 : v + 1)), s === 0 ? 700 : s % 2 ? 1300 : 500);
    return () => clearTimeout(t);
  }, [s]);
  return (
    <div className="hx-console">
      <div className="hx-console-top">
        <span className="hx-dots"><i /><i /><i /></span>
        <span className="hx-mono">agent://quote-writer</span>
        <span className="hx-live"><i />live</span>
      </div>
      <div className="hx-console-body">
        {L.map((l, k) => {
          const state = s > k * 2 + 1 ? 'done' : s === k * 2 + 1 ? 'busy' : 'todo';
          return (
            <div key={k} className={'hx-cl hx-cl--' + state + (l.k === 'hold' ? ' hx-cl--hold' : '')}>
              <span className="hx-cl-ico">{state === 'done' ? '✓' : state === 'busy' ? <i className="hx-spin" /> : '·'}</span>
              <div>
                <b>{l.t}</b>
                {state === 'done' && <small>{l.ok}</small>}
                {l.bar && state !== 'todo' && <span className="hx-cl-bar"><i className={state === 'done' ? 'full' : ''} /></span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="hx-console-foot hx-mono">
        <span>{tx('human in the loop', 'mens in de loop')}</span>
        <span>{tx('illustrative demo', 'illustratieve demo')}</span>
      </div>
    </div>
  );
}

function AiHero({ mode, onMode, onCta }) {
  const ref = useRef(null);
  const words = tx('Business|Processes|Team|Workflows|Back office', 'Business|Processen|Team|Workflows|Backoffice').split('|');
  useGsap(ref, ({ gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hx-hero .hx-eyebrow', { y: 16, opacity: 0, duration: .6 })
      .from('.hx-h1 .hx-line', { yPercent: 110, duration: 1, stagger: .12 }, '-=.3')
      .from('.hx-hero-lede, .hx-mode, .hx-hero-ctas', { y: 22, opacity: 0, duration: .8, stagger: .08 }, '-=.6')
      .from('.hx-console', { y: 40, opacity: 0, rotateX: 12, duration: 1.1 }, '-=.9')
      .from('.hx-chip', { scale: .6, opacity: 0, duration: .6, stagger: .05 }, '-=.8')
      .from('.hx-hero-stats > div', { y: 16, opacity: 0, duration: .6, stagger: .08 }, '-=.6');
    gsap.to('.hx-hero-inner', { yPercent: -12, opacity: .35, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: .5 } });
  });
  const chips = ['Claude', 'ChatGPT', 'n8n', 'Copilot', 'CRM', 'ERP', 'MCP', 'Gemini'];
  return (
    <section className="hx-hero" ref={ref}>
      <NeuralCanvas />
      <div className="hx-aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="hx-grid-bg" aria-hidden="true" />
      {chips.map((c, i) => <span key={c} className={'hx-chip hx-chip--' + i} aria-hidden="true">{c}</span>)}
      <div className="container-wide hx-hero-inner">
        <div className="hx-hero-copy">
          <span className="hx-eyebrow hx-eyebrow--live"><i />{tx('AI consultancy & implementation', 'AI-advies & implementatie')}</span>
          <h1 className="hx-h1">
            <span className="hx-mask"><span className="hx-line">{tx('Smarten up', 'Maak je')}</span></span>
            <span className="hx-mask"><span className="hx-line">{tx('your ', '')}<Scramble words={words} /></span></span>
          </h1>
          <p className="hx-hero-lede">{tx('From “we do something with ChatGPT” to processes where AI agents save time every day. With a proven method, and a team that actually builds it.',
            'Van “we doen iets met ChatGPT” naar processen waarin AI-agents elke dag tijd besparen. Met een bewezen methode, en een team dat het ook echt bouwt.')}</p>
          <div className="hx-mode" role="tablist" aria-label={tx('Choose solutions view', 'Kies weergave')} data-mode={mode}>
            <span className="hx-mode-thumb" aria-hidden="true" />
            <button type="button" role="tab" aria-selected={mode === 'ai'} className={mode === 'ai' ? 'on' : ''} onClick={() => onMode && onMode('ai')}>{tx('AI solutions', 'AI-oplossingen')}</button>
            <button type="button" role="tab" aria-selected={mode === 'salesforce'} className={mode === 'salesforce' ? 'on' : ''} onClick={() => onMode && onMode('salesforce')}>{tx('Salesforce solutions', 'Salesforce-oplossingen')}</button>
          </div>
          <div className="hx-hero-ctas">
            <button type="button" className="hx-btn hx-btn--glow" onClick={onCta}>{tx('Plan a call', 'Plan een gesprek')} <Arrow /></button>
            <button type="button" className="hx-btn hx-btn--ghost" onClick={() => scrollToId('ai-ify')}>{tx('Explore AI-ify', 'Ontdek AI-ify')} <span aria-hidden="true">↓</span></button>
          </div>
        </div>
        <div className="hx-hero-side">
          <AgentConsole />
          <div className="hx-hero-stats">
            <div><b>15+</b><span>{tx('years of complex implementations', 'jaar complexe implementaties')}</span></div>
            <div><b>300+</b><span>{tx('projects completed', 'projecten opgeleverd')}</span></div>
            <div><b>4.5<small>★</small></b><span>{tx('customer satisfaction', 'klanttevredenheid')}</span></div>
          </div>
        </div>
      </div>
      <div className="hx-scrollcue" aria-hidden="true"><i /></div>
      <HxStyles />
    </section>
  );
}

/* ==================================================================== */
/*  1 · The AI gap: the statement lights up word by word while scrolling  */
/* ==================================================================== */
function AiGap() {
  const ref = useRef(null);
  const statement = tx('Everyone uses AI. Few get real value from it. Most teams try ChatGPT or Copilot on their own, without a plan, without rules and without a link to how the work actually runs.',
    'Iedereen gebruikt AI. Weinigen halen er echt waarde uit. De meeste teams proberen ChatGPT of Copilot op eigen houtje: zonder plan, zonder afspraken en los van hoe het werk echt loopt.');
  const hot = new Set(tx('Few|get|real|value|from|it.', 'Weinigen|halen|er|echt|waarde|uit.').split('|'));
  const items = [
    { n: '01', t: tx('No structure', 'Geen structuur'), d: tx('Everyone uses their own tool, their own prompts and their own rules. The result depends on who is at the keyboard.', 'Iedereen gebruikt een eigen tool, eigen prompts en eigen regels. Het resultaat hangt af van wie er achter het toetsenbord zit.') },
    { n: '02', t: tx('A legal duty', 'Een wettelijke plicht'), d: tx('Under the EU AI Act (Art. 4), organisations take measures to support their staff’s AI literacy. That includes business use of ChatGPT. Supervision started on 2 August 2026.', 'Onder de EU AI Act (art. 4) nemen organisaties maatregelen om de AI-geletterdheid van hun medewerkers te ondersteunen. Dat geldt ook voor zakelijk gebruik van ChatGPT. Het toezicht loopt sinds 2 augustus 2026.') },
    { n: '03', t: tx('Tools, not processes', 'Tools, geen processen'), d: tx('A chatbot next to your systems saves minutes. AI built into the way your work flows is where the real time comes back.', 'Een chatbot naast je systemen bespaart minuten. AI die in je werkprocessen zit, is waar de echte tijd terugkomt.') },
  ];
  useGsap(ref, ({ gsap }) => {
    gsap.fromTo('.hx-gap-text .w', { opacity: .14 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.hx-gap-text', start: 'top 78%', end: 'bottom 45%', scrub: true } });
    gsap.from('.hx-gap-card', { y: 60, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.hx-gap-cards', start: 'top 80%' } });
  });
  return (
    <section className="hx-sheet hx-dark hx-gap" ref={ref}>
      <div className="container-wide">
        <span className="hx-eyebrow"><i />{tx('THE AI GAP', 'DE AI-KLOOF')}</span>
        <p className="hx-gap-text">{statement.split(' ').map((w, i) => <span key={i} className={'w' + (hot.has(w) ? ' hot' : '')}>{w} </span>)}</p>
        <div className="hx-gap-cards">
          {items.map((it) => (
            <div key={it.n} className="hx-gap-card hx-spot" onPointerMove={spot}>
              <span className="hx-mono hx-num">{it.n}</span>
              <h3>{it.t}</h3><p>{it.d}</p>
            </div>
          ))}
        </div>
        <p className="hx-gap-out">{tx('We take you from “we do something with AI” to processes where AI saves time every single day.', 'Wij brengen je van “we doen iets met AI” naar processen waarin AI elke dag tijd bespaart.')}</p>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  2 · The ladder (sticky): Learn → Scan → Build → Run                  */
/* ==================================================================== */
const RUNGS = () => [
  { k: 'learn', n: '01', t: tx('Learn', 'Leren'), sub: tx('Workshops', 'Workshops'), href: 'ai-workshops',
    d: tx('Your team understands what AI can and can’t do, works with it safely and meets the AI literacy duty.', 'Je team snapt wat AI wel en niet kan, werkt er veilig mee en voldoet aan de AI-geletterdheidsplicht.'),
    li: [tx('Basic, Advanced or a custom programme', 'Basis, Advanced of een traject op maat'), tx('On site or online, Dutch or English', 'Op locatie of online, Nederlands of Engels'), tx('AI literacy record for your files', 'AI-geletterdheidsdossier voor je eigen administratie')] },
  { k: 'scan', n: '02', t: tx('Scan', 'Scannen'), sub: tx('The AI-ify scan', 'De AI-ify-scan'), href: 'ai-method',
    d: tx('We measure where the time goes and which steps an agent can take over, with a business case per use case.', 'We meten waar de tijd zit en welke stappen een agent kan overnemen, met een business case per use case.'),
    li: [tx('Interviews and time measurement', 'Interviews en tijdsmeting'), tx('Opportunity map, scored per step', 'Kansenkaart, gescoord per stap'), tx('Top 3 use cases and a 90-day roadmap', 'Top-3 use cases en een roadmap voor 90 dagen')] },
  { k: 'build', n: '03', t: tx('Build', 'Bouwen'), sub: tx('Pilot & implementation', 'Pilot & implementatie'), href: 'ai-build',
    d: tx('A pilot of 4 to 6 weeks with a clear go/no-go, then on to production in your own systems.', 'Een pilot van 4 tot 6 weken met een heldere go/no-go, daarna door naar productie in je eigen systemen.'),
    li: [tx('Agents and workflow automation', 'Agents en workflow-automatisering'), tx('Connected to the systems you use', 'Gekoppeld aan de systemen die je gebruikt'), tx('Measured against the baseline', 'Gemeten tegen de nulmeting')] },
  { k: 'run', n: '04', t: tx('Run', 'Beheren'), sub: tx('Manage & improve', 'Beheer & verbeteren'), href: 'ai-run',
    d: tx('We measure the effect, keep sharpening the agents and keep the costs of AI under control.', 'We meten het effect, maken de agents steeds beter en houden de kosten van AI in de hand.'),
    li: [tx('Monitoring and fixes', 'Monitoring en fixes'), tx('Monthly improvement rounds', 'Maandelijkse verbeterrondes'), tx('Or a Fractional AI lead at your table', 'Of een Fractional AI-lead aan tafel')] },
];
/* a small live scene per step */
function RungScene({ k }) {
  if (k === 'learn') return (
    <div className="hx-scene hx-scene--learn">
      {[tx('Prompting essentials', 'Prompting essentials'), tx('Data & GDPR', 'Data & AVG'), tx('Hallucinations', 'Hallucinaties'), tx('Your own tasks', 'Eigen taken'), tx('AI literacy record', 'AI-geletterdheidsdossier')].map((t, i) => (
        <div key={t} className="hx-chk" style={{ '--d': i * .35 + 's' }}><i>✓</i>{t}</div>
      ))}
    </div>
  );
  if (k === 'scan') return (
    <div className="hx-scene hx-scene--scan">
      <div className="hx-radar"><i className="hx-sweep" />{[[28, 30], [62, 22], [70, 64], [36, 70], [50, 46]].map(([x, y], i) => <b key={i} style={{ left: x + '%', top: y + '%', '--d': i * .6 + 's' }} />)}</div>
      <div className="hx-scan-legend hx-mono"><span><b className="c" />{tx('high potential', 'hoge potentie')}</span><span><b />{tx('stays human', 'blijft menselijk')}</span></div>
    </div>
  );
  if (k === 'build') return (
    <div className="hx-scene hx-scene--build">
      <svg viewBox="0 0 320 180" aria-hidden="true">
        <path className="hx-wire" d="M40 90 C100 90 100 40 160 40 S220 90 280 90" />
        <path className="hx-wire" d="M40 90 C100 90 100 140 160 140 S220 90 280 90" />
        <path className="hx-wire hx-wire--hot" d="M40 90 C100 90 100 40 160 40 S220 90 280 90" />
        {[[40, 90], [160, 40], [160, 140], [280, 90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" className={'hx-node' + (i === 3 ? ' hx-node--end' : '')} />)}
      </svg>
      <div className="hx-build-labels hx-mono"><span>input</span><span>agent</span><span>check</span><span>{tx('done', 'klaar')}</span></div>
    </div>
  );
  return (
    <div className="hx-scene hx-scene--run">
      <svg viewBox="0 0 320 140" preserveAspectRatio="none" aria-hidden="true"><path className="hx-spark-fill" d="M0 110 L40 100 L80 104 L120 86 L160 90 L200 66 L240 70 L280 44 L320 30 L320 140 L0 140Z" /><path className="hx-spark" d="M0 110 L40 100 L80 104 L120 86 L160 90 L200 66 L240 70 L280 44 L320 30" /></svg>
      <div className="hx-run-kpis hx-mono"><span>monitoring <b>●</b></span><span>{tx('improvement round', 'verbeterronde')} <b>↻</b></span></div>
    </div>
  );
}
function AiLadder() {
  const R = RUNGS();
  const ref = useRef(null);
  const [act, setAct] = useState(0);
  const st = useRef(null);
  useGsap(ref, ({ gsap, ScrollTrigger }) => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      st.current = ScrollTrigger.create({ trigger: ref.current.querySelector('.hx-ladder-track'), start: 'top top', end: 'bottom bottom',
        onUpdate: (s) => { ref.current && ref.current.style.setProperty('--p', s.progress.toFixed(3)); const i = Math.min(R.length - 1, Math.floor(s.progress * R.length * .999)); setAct((a) => (a === i ? a : i)); } });
      return () => { st.current = null; };
    });
  });
  const go = (i) => {
    const s = st.current;
    if (s && wide()) { const y = s.start + (s.end - s.start) * ((i + .5) / R.length); if (window.lenis) window.lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' }); }
    else setAct(i);
  };
  const r = R[act];
  return (
    <section id="ai-ify" className="hx-sheet hx-light hx-ladder" ref={ref}>
      <div className="hx-ladder-track">
        <div className="hx-ladder-sticky">
          <div className="container-wide hx-ladder-grid">
            <div className="hx-ladder-left">
              <Head eyebrow={tx('HOW WE AI-IFY YOUR BUSINESS', 'ZO AI-IFYEN WE JE BEDRIJF')} a={tx('One partner for', 'Eén partner voor')} b={tx('the whole AI journey.', 'de hele AI-reis.')}
                lede={tx('AI-ify is our approach to bringing AI into your business, one step at a time. Start where you are.', 'AI-ify is onze aanpak om AI stap voor stap in je bedrijf te brengen. Begin waar je staat.')} />
              <a className="hx-entry" href={lp('/ai-readiness-scan')}>
                <span className="hx-entry-n hx-mono">00</span>
                <span><b>{tx('Not sure where you stand? AI Readiness Scan', 'Weet je niet waar je staat? AI Readiness Scan')}</b><small>{tx('An honest check of whether you’re ready to AI-ify, with a written report in about two working days.', 'Een eerlijke check of je klaar bent om te AI-ifyen, met een rapport binnen zo’n twee werkdagen.')}</small></span>
                <Arrow />
              </a>
              <div className="hx-rail" role="tablist" aria-label={tx('The four AI-ify steps', 'De vier AI-ify-stappen')}>
                <span className="hx-rail-line" aria-hidden="true"><i /></span>
                {R.map((x, i) => (
                  <button key={x.k} type="button" role="tab" aria-selected={i === act} className={'hx-rail-item' + (i === act ? ' on' : '') + (i < act ? ' past' : '')} onClick={() => go(i)}>
                    <span className="hx-rail-dot" /><span className="hx-mono">{x.n}</span><b>{x.t}</b><small>{x.sub}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="hx-stage" key={r.k}>
              <div className="hx-stage-visual"><RungScene k={r.k} /></div>
              <div className="hx-stage-text">
                <span className="hx-mono hx-stage-n">{tx('STEP', 'STAP')} {r.n} · {r.sub}</span>
                <h3>{r.t}.</h3>
                <p>{r.d}</p>
                <ul>{r.li.map((l) => <li key={l}>{l}</li>)}</ul>
                <button type="button" className="hx-textlink" onClick={() => scrollToId(r.href)}>{tx('Read more', 'Lees meer')} <Arrow /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* phones: all four steps stacked */}
      <div className="container-wide hx-ladder-mobile">
        {R.map((x) => (
          <div key={x.k} className="hx-mstep"><span className="hx-mono">{x.n} · {x.sub}</span><h3>{x.t}.</h3><p>{x.d}</p><ul>{x.li.map((l) => <li key={l}>{l}</li>)}</ul></div>
        ))}
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  3 · Workshops (Learn) · no prices                                    */
/* ==================================================================== */
function AiWorkshops({ onCta }) {
  const ref = useRef(null);
  const W = [
    { tag: tx('BASIC', 'BASIS'), name: tx('AI Foundations & AI Literacy', 'AI-fundamenten & AI-geletterdheid'), meta: tx('Half day · up to 12 people', 'Halve dag · max. 12 deelnemers'),
      li: [tx('What LLMs and agents are, and what AI can and can’t do', 'Wat LLM’s en agents zijn, en wat AI wel en niet kan'), tx('The right tool per task: ChatGPT, Claude, Copilot, Gemini', 'De juiste tool per taak: ChatGPT, Claude, Copilot, Gemini'), tx('Prompting essentials', 'Prompting essentials'), tx('AI Act Art. 4: data & GDPR, hallucinations, AI policy', 'AI Act art. 4: data & AVG, hallucinaties, AI-beleid'), tx('Hands-on with your own daily tasks', 'Hands-on met je eigen dagelijkse taken')],
      cta: tx('Ask about Basic', 'Vraag Basis aan') },
    { tag: 'ADVANCED', featured: true, name: tx('AI Process Automation', 'AI-procesautomatisering'), meta: tx('Full day · up to 12 people', 'Hele dag · max. 12 deelnemers'),
      li: [tx('Everything in Basic', 'Alles uit Basis'), tx('2–3 of your own processes, analysed in advance', '2–3 eigen processen, vooraf geanalyseerd'), tx('Find opportunities for agents and automation together', 'Samen kansen vinden voor agents en automatisering'), tx('Any system: from email to CRM and ERP', 'Elk systeem: van mail tot CRM en ERP'), tx('You leave with a top-5 use-case roadmap', 'Je gaat naar huis met een top-5 use-case-roadmap')],
      cta: tx('Ask about Advanced', 'Vraag Advanced aan') },
    { tag: tx('CUSTOM', 'OP MAAT'), name: tx('Custom AI Programme', 'AI-traject op maat'), meta: tx('Programme · several teams', 'Traject · meerdere teams'),
      li: [tx('Workshops per team or role', 'Workshops per team of rol'), tx('Combined with the AI-ify scan', 'Gecombineerd met de AI-ify-scan'), tx('Your first use case live (proof of concept)', 'Je eerste use case live (proof of concept)'), tx('Training internal AI champions', 'Interne AI-champions opleiden'), tx('AI policy and your AI Act obligations', 'AI-beleid en je AI Act-verplichtingen')],
      cta: tx('Discuss a programme', 'Bespreek een traject') },
  ];
  useGsap(ref, ({ gsap }) => {
    gsap.from('.hx-ws-card', { y: 80, opacity: 0, rotateX: -8, transformOrigin: '50% 100%', duration: 1.1, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.hx-ws-grid', start: 'top 82%' } });
  });
  return (
    <section id="ai-workshops" className="hx-sheet hx-light hx-light--2 hx-ws" ref={ref}>
      <div className="container-wide">
        <Head center eyebrow={tx('STEP 1 · LEARN', 'STAP 1 · LEREN')} a={tx('Get your team', 'Zet je team')} b={tx('working with AI.', 'aan het werk met AI.')}
          lede={tx('Safe, practical and useful the next morning. On site or online, in Dutch or English. On site has our preference: more interaction in the room.',
            'Veilig, praktisch en de volgende ochtend al bruikbaar. Op locatie of online, in het Nederlands of Engels. Op locatie heeft onze voorkeur: meer interactie in de groep.')} />
        <div className="hx-ws-grid">
          {W.map((w) => (
            <div key={w.tag} className={'hx-ws-card hx-spot' + (w.featured ? ' is-featured' : '')} onPointerMove={spot}>
              {w.featured && <span className="hx-badge">{tx('Recommended', 'Aanbevolen')}</span>}
              <span className="hx-mono hx-tag">{w.tag}</span>
              <h3>{w.name}</h3>
              <span className="hx-meta">{w.meta}</span>
              <ul>{w.li.map((l) => <li key={l}>{l}</li>)}</ul>
              <button type="button" className={'hx-btn ' + (w.featured ? 'hx-btn--glow' : 'hx-btn--line')} onClick={onCta}>{w.cta} <Arrow /></button>
            </div>
          ))}
        </div>
        <div className="hx-record">
          <div className="hx-record-doc" aria-hidden="true">
            <span className="hx-mono">ai-literacy-record.pdf</span>
            {[tx('Programme', 'Programma'), tx('Attendance list', 'Presentielijst'), tx('Proof of attendance', 'Bewijs van deelname')].map((t, i) => <div key={t} className="hx-chk" style={{ '--d': i * .4 + 's' }}><i>✓</i>{t}</div>)}
          </div>
          <div>
            <b>{tx('Every workshop includes an AI literacy record', 'Elke workshop levert een AI-geletterdheidsdossier op')}</b>
            <p>{tx('Programme, attendance list and proof of attendance per employee. It supports your measures under Art. 4 of the AI Act; it is not an official certification or quality mark.',
              'Programma, presentielijst en bewijs van deelname per medewerker. Het ondersteunt je maatregelen onder art. 4 van de AI Act; het is geen officiële certificering of keurmerk.')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  4 · The AI-ify method: horizontal track + notes-to-quote demo        */
/* ==================================================================== */
const STEPS = () => [
  { t: tx('Intake', 'Intake'), d: tx('A conversation with management. We look at your business as one chain of work and pick the processes with the most potential.', 'Een gesprek met directie of eigenaar. We bekijken je bedrijf als één keten van werk en kiezen de processen met de meeste potentie.') },
  { t: tx('As-is', 'As-is'), d: tx('We map the process with the people who run it: which steps, which input, how much time per step.', 'We brengen het proces in kaart met de mensen die het uitvoeren: welke stappen, welke input, hoeveel tijd per stap.') },
  { t: tx('Identify', 'Identificeren'), d: tx('Per step we decide where an agent can help or take over, and what deliberately stays human.', 'Per stap bepalen we waar een agent kan ondersteunen of overnemen, en wat bewust menselijk blijft.') },
  { t: tx('Assess', 'Beoordelen'), d: tx('Every opportunity is scored on repeatability, autonomy and safety, with an estimate of the time saved.', 'Elke kans krijgt een score op herhaalbaarheid, autonomie en veiligheid, plus een inschatting van de besparing.') },
  { t: tx('To-be', 'To-be'), d: tx('We redesign the process: people and agents working together, with clear checkpoints.', 'We herontwerpen het proces: mensen en agents werken samen, met duidelijke controlemomenten.') },
  { t: tx('Plan', 'Plannen'), d: tx('A spec per agent, the choice of tools and models, and agreements on data and security.', 'Specificatie per agent, keuze van tools en modellen, en afspraken over data en beveiliging.') },
  { t: tx('Build', 'Bouwen'), d: tx('We build the agents and automations in your own environment and systems.', 'We bouwen de agents en automatiseringen in je eigen omgeving en systemen.') },
  { t: tx('Measure', 'Meten'), d: tx('We measure the effect against the baseline from step 2 and improve where needed.', 'We meten het effect tegen de nulmeting uit stap 2 en verbeteren waar nodig.') },
];
function NotesToQuote({ onCta }) {
  const [ref, inV] = useIn(.35);
  const out = [tx('Proposal: new planning tool', 'Voorstel: nieuwe planningstool'), tx('Scope: 25 users, ERP connection, training for team leads', 'Scope: 25 gebruikers, ERP-koppeling, training teamleiders'), tx('Planning: start in Q1, in three phases', 'Planning: start in Q1, in drie fases'), tx('Next step: decision meeting before month end', 'Volgende stap: besluitgesprek voor het einde van de maand')];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inV) return; if (reduced()) { setN(out.length + 1); return; }
    if (n > out.length) return; const t = setTimeout(() => setN(n + 1), n === 0 ? 600 : 900); return () => clearTimeout(t);
  }, [inV, n]);
  const scores = [[tx('Repeatability', 'Herhaalbaarheid'), tx('High', 'Hoog'), .9], [tx('Autonomy', 'Autonomie'), tx('Supporting', 'Ondersteunend'), .55], [tx('Risk', 'Risico'), tx('Low', 'Laag'), .2], [tx('Who signs off', 'Wie tekent af'), tx('A person', 'Een mens'), 1]];
  return (
    <div className={'hx-demo' + (inV ? ' in' : '')} ref={ref}>
      <div className="hx-demo-head">
        <span className="hx-mono hx-tag">{tx('EXAMPLE FROM THE METHOD', 'VOORBEELD UIT DE METHODE')}</span>
        <h3>{tx('Writing quotes: 5 hours each.', 'Offertes schrijven: 5 uur per stuk.')}</h3>
        <p>{tx('The quotes look a lot alike. An agent drafts the quote from the meeting report; the consultant checks it and sends it.', 'De offertes lijken sterk op elkaar. Een agent maakt het concept op basis van het gespreksverslag; de consultant controleert en verstuurt.')}</p>
      </div>
      <div className="hx-demo-io">
        <div className="hx-io hx-io--in">
          <span className="hx-mono">{tx('INPUT · meeting notes', 'INPUT · gespreksnotities')}</span>
          <ul>{[tx('25 users, start in Q1', '25 gebruikers, start in Q1'), tx('needs a link to the ERP', 'moet koppelen met het ERP'), tx('training for team leads', 'training voor teamleiders'), tx('decision before month end', 'besluit voor einde maand')].map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="hx-io-agent" aria-hidden="true"><span><Icon k="spark" /></span><i /></div>
        <div className="hx-io hx-io--out">
          <span className="hx-mono">{tx('OUTPUT · draft quote', 'OUTPUT · conceptofferte')}</span>
          {out.map((t, i) => <p key={t} className={i < n ? 'on' : ''}>{t}</p>)}
          <div className={'hx-approve' + (n > out.length ? ' on' : '')}><i>✓</i>{tx('Checked and sent by the consultant', 'Gecontroleerd en verstuurd door de consultant')}</div>
        </div>
      </div>
      <div className="hx-scores">
        {scores.map(([k, v, w]) => <div key={k} className="hx-score"><span>{k}</span><b>{v}</b><i style={{ '--w': w }} /></div>)}
      </div>
      <div className="hx-demo-foot">
        <small>{tx('Illustrative use case, not a customer result.', 'Illustratief voorbeeld van een use case; geen klantresultaat.')}</small>
        <button type="button" className="hx-btn hx-btn--glow" onClick={onCta}>{tx('Talk about your processes', 'Bespreek jouw processen')} <Arrow /></button>
      </div>
    </div>
  );
}
function AiMethod({ onCta }) {
  const S = STEPS();
  const ref = useRef(null);
  useGsap(ref, ({ gsap, ScrollTrigger }) => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const wrap = ref.current.querySelector('.hx-mth-track');
      const rail = ref.current.querySelector('.hx-mth-rail');
      const dist = () => Math.max(0, rail.scrollWidth - window.innerWidth);
      const setH = () => { wrap.style.height = (dist() + window.innerHeight) + 'px'; };
      setH(); ScrollTrigger.addEventListener('refreshInit', setH);
      gsap.to(rail, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
        onUpdate: (s) => ref.current && ref.current.style.setProperty('--mp', s.progress.toFixed(3)) } });
      return () => { ScrollTrigger.removeEventListener('refreshInit', setH); wrap.style.height = ''; };
    });
  });
  const Card = ({ s, i }) => (
    <div className={'hx-mcard' + (i < 4 ? ' is-scan' : ' is-up')} onPointerMove={spot}>
      <span className="hx-mcard-n">{String(i + 1).padStart(2, '0')}</span>
      <span className="hx-mono hx-tag">{i < 4 ? tx('AI-ify scan', 'AI-ify-scan') : tx('AI-ify upgrade', 'AI-ify-upgrade')}</span>
      <h3>{s.t}</h3><p>{s.d}</p>
    </div>
  );
  return (
    <section id="ai-method" className="hx-sheet hx-dark hx-method" ref={ref}>
      <div className="hx-mth-track">
        <div className="hx-mth-sticky">
          <div className="hx-mth-rail">
            <div className="hx-mth-intro">
              <Head eyebrow={tx('STEP 2 · THE AI-IFY METHOD', 'STAP 2 · DE AI-IFY-METHODE')} a={tx('Eight steps from', 'Acht stappen van')} b={tx('insight to result.', 'inzicht naar resultaat.')}
                lede={tx('The first four steps are the scan, the last four the upgrade. After each phase you decide whether we carry on. Any process, any sector.',
                  'De eerste vier stappen vormen de scan, de laatste vier de upgrade. Na elke fase beslis jij of we verdergaan. Elk proces, elke branche.')} />
              <span className="hx-mono hx-hint">scroll →</span>
            </div>
            {S.slice(0, 4).map((s, i) => <Card key={i} s={s} i={i} />)}
            <div className="hx-gatecard">
              <span className="hx-mono">GO / NO-GO</span>
              <b>{tx('You decide.', 'Jij beslist.')}</b>
              <p>{tx('With the business case on the table. No lock-in.', 'Met de business case op tafel. Je zit nergens aan vast.')}</p>
            </div>
            {S.slice(4).map((s, i) => <Card key={i + 4} s={s} i={i + 4} />)}
            <div className="hx-mth-end" aria-hidden="true" />
          </div>
          <div className="hx-mth-progress container-wide" aria-hidden="true">
            <span className="hx-mono">scan</span><div><i /></div><span className="hx-mono">upgrade</span>
          </div>
        </div>
      </div>
      <div className="container-wide"><NotesToQuote onCta={onCta} /></div>
    </section>
  );
}

/* ==================================================================== */
/*  5 · What we build: bento with live mini UIs (OpenWhispr-style)       */
/* ==================================================================== */
function MiniAgent() {
  return (
    <div className="hx-mini hx-mini--agent" aria-hidden="true">
      {[[tx('New ticket: invoice question', 'Nieuw ticket: vraag over factuur'), 'in'], [tx('Summary + suggested answer ready', 'Samenvatting + voorstel-antwoord klaar'), 'ai'], [tx('Approve and send?', 'Goedkeuren en versturen?'), 'ask']].map(([t, c], i) => (
        <div key={i} className={'hx-msg hx-msg--' + c} style={{ '--d': i * 1.1 + 's' }}>{c === 'ai' && <Icon k="spark" />}{t}{c === 'ask' && <span className="hx-msg-btns"><b>✓</b><b>✎</b></span>}</div>
      ))}
    </div>
  );
}
function MiniFlow() {
  return (
    <div className="hx-mini hx-mini--flow" aria-hidden="true">
      <svg viewBox="0 0 260 90" preserveAspectRatio="none"><path className="hx-wire" d="M10 45 H250" /><path className="hx-wire hx-wire--hot" d="M10 45 H250" /></svg>
      <div className="hx-flow-nodes hx-mono"><span>trigger</span><span className="ai">AI</span><span>{tx('rule', 'regel')}</span><span>✓</span></div>
    </div>
  );
}
function MiniCrm() {
  return (
    <div className="hx-mini hx-mini--crm" aria-hidden="true">
      <div className="hx-crm-row"><span>Account</span><b>Van Dijk BV</b></div>
      <div className="hx-crm-row"><span>{tx('Next step', 'Volgende stap')}</span><b className="hx-shimmer"><Icon k="spark" />{tx('Follow up on proposal', 'Voorstel opvolgen')}</b></div>
    </div>
  );
}
function MiniHub() {
  return (
    <div className="hx-mini hx-mini--hub" aria-hidden="true">
      <div className="hx-hub-core">AI</div>
      <div className="hx-orbit">{['CRM', 'ERP', 'Mail', 'Docs', 'Planning'].map((t, i) => <span key={t} style={{ '--a': i * 72 + 'deg' }}><em>{t}</em></span>)}</div>
    </div>
  );
}
function MiniDoc() {
  return (
    <div className="hx-mini hx-mini--doc" aria-hidden="true">
      <div className="hx-invoice"><i className="hx-scanline" /><span /><span /><span className="s" /><span /><span className="s" /></div>
      <div className="hx-fields hx-mono">{[tx('supplier', 'leverancier'), tx('amount', 'bedrag'), tx('PO match', 'PO-match')].map((t, i) => <span key={t} style={{ '--d': i * .7 + 's' }}>✓ {t}</span>)}</div>
    </div>
  );
}
function MiniRouter() {
  return (
    <div className="hx-mini hx-mini--router" aria-hidden="true">
      <div className="hx-lanes">
        <div className="hx-lane"><span className="hx-mono">{tx('small model', 'klein model')}</span><i /><i /><i /></div>
        <div className="hx-lane hx-lane--big"><span className="hx-mono">{tx('large model', 'groot model')}</span><i /></div>
      </div>
      <span className="hx-mono hx-router-note">{tx('routine tasks → small · hard ones → large', 'routinetaken → klein · lastige → groot')}</span>
    </div>
  );
}
function MiniWorkplace() {
  const roles = [['Sales', [tx('quote drafts', 'offerteconcepten'), tx('meeting prep', 'gespreksvoorbereiding')]], ['Service', [tx('ticket summaries', 'ticketsamenvattingen'), tx('answer suggestions', 'antwoordvoorstellen')]], ['Finance', [tx('invoice checks', 'factuurcontrole'), tx('month-end notes', 'maandafsluiting')]]];
  const [i, setI] = useState(0);
  useEffect(() => { if (reduced()) return; const t = setInterval(() => setI((k) => (k + 1) % roles.length), 2600); return () => clearInterval(t); }, []);
  return (
    <div className="hx-mini hx-mini--wp" aria-hidden="true">
      <div className="hx-roles">{roles.map(([r], k) => <span key={r} className={k === i ? 'on' : ''}>{r}</span>)}</div>
      <div className="hx-skills" key={i}>{roles[i][1].map((s) => <em key={s}><Icon k="spark" />{s}</em>)}<em className="pol">{tx('AI policy ✓', 'AI-beleid ✓')}</em></div>
    </div>
  );
}
function AiBuild() {
  const ref = useRef(null);
  const B = [
    { k: 'agent', span: 2, mini: <MiniAgent />, t: tx('AI agents', 'AI-agents'), d: tx('Agents that do the work: drafting quotes, summarising tickets, following up, reporting. Always with clear approval moments.', 'Agents die taken uitvoeren: offertes opstellen, tickets samenvatten, opvolgen, rapporteren. Altijd met heldere goedkeuringsmomenten.') },
    { k: 'flow', mini: <MiniFlow />, t: tx('Workflow automation', 'Workflow-automatisering'), d: tx('Predictable, auditable workflows in n8n, Make or Power Automate, where AI does the thinking and the flow stays in charge.', 'Voorspelbare, controleerbare workflows in n8n, Make of Power Automate, waarin AI het denkwerk doet en de flow de regie houdt.') },
    { k: 'cloud', mini: <MiniCrm />, t: tx('AI in the systems you have', 'AI in je bestaande systemen'), d: tx('Set up and use the AI already inside your CRM, ERP or office software, instead of adding yet another tool.', 'De AI die al in je CRM, ERP of kantoorsoftware zit goed inrichten en benutten, in plaats van er nog een tool naast te zetten.') },
    { k: 'link', mini: <MiniHub />, t: tx('Integrations', 'Koppelingen'), d: tx('Let AI work safely with your CRM, ERP, email, documents and planning, for example through MCP connections.', 'AI veilig laten werken met je CRM, ERP, mail, documenten en planning, onder meer via MCP-koppelingen.') },
    { k: 'doc', mini: <MiniDoc />, t: tx('Documents & invoices', 'Documenten & facturen'), d: tx('Invoices, forms and contracts read, checked and lined up for approval automatically.', 'Facturen, formulieren en contracten automatisch uitlezen, controleren en klaarzetten ter goedkeuring.') },
    { k: 'route', span: 2, mini: <MiniRouter />, t: tx('AI costs & model choice', 'AI-kosten & modelkeuze'), d: tx('The right model for the right task. Smart routing, token optimisation and licence advice keep AI affordable as usage grows.', 'Het juiste model voor de juiste taak. Slimme routering, tokenoptimalisatie en licentieadvies houden AI betaalbaar als het gebruik groeit.') },
    { k: 'team', span: 3, mini: <MiniWorkplace />, t: tx('The AI workplace', 'De AI-werkplek'), d: tx('Business AI environments such as Claude, ChatGPT or Copilot: the right licences, shared instructions and skills per role, connections to your data, an AI policy for your people, and insight into usage and costs.', 'Zakelijke AI-omgevingen zoals Claude, ChatGPT of Copilot: de juiste licenties, gedeelde instructies en vaardigheden per rol, koppelingen met je data, een AI-beleid voor je mensen en inzicht in gebruik en kosten.') },
  ];
  const tools = ['CRM', 'ERP', 'Microsoft 365', 'Google Workspace', 'Claude', 'ChatGPT', 'Copilot', 'Gemini', 'n8n', 'Make', 'Power Automate', tx('open-source models', 'open-source modellen'), 'MCP', tx('EU hosting', 'EU-hosting')];
  useGsap(ref, ({ gsap }) => {
    gsap.from('.hx-bento-card', { y: 70, opacity: 0, scale: .96, duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.hx-bento', start: 'top 82%' } });
    gsap.fromTo('.hx-path-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.hx-path', start: 'top 85%', end: 'bottom 60%', scrub: true } });
    gsap.from('.hx-path-step', { y: 30, opacity: 0, stagger: .15, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: '.hx-path', start: 'top 80%' } });
  });
  return (
    <section id="ai-build" className="hx-sheet hx-light hx-build" ref={ref}>
      <div className="container-wide">
        <Head eyebrow={tx('STEP 3 · BUILD', 'STAP 3 · BOUWEN')} a={tx('From idea to an agent', 'Van idee naar een agent')} b={tx('that runs every day.', 'die elke dag meedraait.')}
          lede={tx('We build AI that fits the systems and the way of working you already have. A person at the wheel where it matters, fully automatic where it can be.',
            'We bouwen AI die past in de systemen en werkwijze die je al hebt. De mens aan het stuur waar het moet, volledig automatisch waar het kan.')} />
        <div className="hx-bento">
          {B.map((b) => (
            <div key={b.k} className={'hx-bento-card hx-spot' + (b.span ? ' span-' + b.span : '')} onPointerMove={spot}>
              <div className="hx-bento-visual">{b.mini}</div>
              <div className="hx-bento-text"><span className="hx-ico"><Icon k={b.k} /></span><div><h3>{b.t}</h3><p>{b.d}</p></div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="hx-marquee">
        <span className="hx-mono hx-marquee-label">{tx('System-independent. We work with what you already use', 'Systeemonafhankelijk. We werken met wat je al gebruikt')}</span>
        {[0, 1].map((row) => (
          <div key={row} className={'hx-marquee-row' + (row ? ' rev' : '')} aria-hidden="true">
            <div>{[...tools, ...tools].map((t, i) => <em key={i}>{t}</em>)}</div>
          </div>
        ))}
      </div>
      <div className="container-wide">
        <div className="hx-path">
          <span className="hx-path-line" aria-hidden="true"><i /></span>
          {[[tx('Pilot', 'Pilot'), tx('4–6 weeks. A working result in your own environment, measured against the baseline. Then a go/no-go.', '4–6 weken. Een werkend resultaat in je eigen omgeving, gemeten tegen de nulmeting. Daarna een go/no-go.')],
            [tx('Production', 'Productie'), tx('Scale up to all users: security, monitoring, documentation and handover.', 'Opschalen naar alle gebruikers: beveiliging, monitoring, documentatie en overdracht.')],
            [tx('Run', 'Beheer'), tx('We keep your agents sharp: monitoring, improvements and new use cases.', 'We houden je agents scherp: monitoring, verbeteringen en nieuwe use cases.')]].map(([t, d], i) => (
            <div key={t} className="hx-path-step"><span className="hx-mono">0{i + 1}</span><b>{t}</b><p>{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  6 · Run & improve + Fractional AI lead + Salesforce bridge           */
/* ==================================================================== */
function AiRun({ onCta, onMode }) {
  const ref = useRef(null);
  const P = [
    { t: tx('Manage', 'Beheer'), h: tx('Keep it running', 'Draaiend houden'), li: [tx('Monitoring of agents and workflows', 'Monitoring van agents en workflows'), tx('Incidents and small fixes', 'Incidenten en kleine fixes'), tx('Updates when models or APIs change', 'Updates bij model- en API-wijzigingen'), tx('Monthly report', 'Maandrapportage')] },
    { t: tx('Improve', 'Verbeteren'), featured: true, h: tx('Better every month', 'Elke maand beter'), li: [tx('Everything in Manage', 'Alles uit Beheer'), tx('Monthly improvement round', 'Maandelijkse verbeterronde'), tx('Cost and model optimisation', 'Kosten- en modeloptimalisatie'), tx('Quarterly review with roadmap', 'Kwartaalreview met roadmap')] },
    { t: tx('Develop', 'Doorontwikkelen'), h: tx('New use cases', 'Nieuwe use cases'), li: [tx('Everything in Improve', 'Alles uit Verbeteren'), tx('Reserved build capacity', 'Gereserveerde bouwcapaciteit'), tx('New agents and connections', 'Nieuwe agents en koppelingen'), tx('One fixed contact', 'Vaste contactpersoon')] },
  ];
  const days = tx('Mon|Tue|Wed|Thu|Fri', 'Ma|Di|Wo|Do|Vr').split('|');
  useGsap(ref, ({ gsap }) => {
    gsap.from('.hx-plan', { y: 60, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.hx-plans', start: 'top 82%' } });
    gsap.from('.hx-frac', { y: 80, opacity: 0, scale: .97, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.hx-frac', start: 'top 85%' } });
  });
  const toSalesforce = () => { onMode && onMode('salesforce'); window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); };
  return (
    <section id="ai-run" className="hx-sheet hx-light hx-light--2 hx-run" ref={ref}>
      <div className="container-wide">
        <Head eyebrow={tx('STEP 4 · RUN & IMPROVE', 'STAP 4 · BEHEREN & VERBETEREN')} a={tx('Lasting results,', 'Blijvend resultaat,')} b={tx('month after month.', 'maand na maand.')}
          lede={tx('AI is never “done”: models change, costs move and your team finds new ideas. Pick the level of care that fits.', 'AI is nooit “af”: modellen veranderen, kosten bewegen en je team bedenkt nieuwe ideeën. Kies het niveau dat past.')} />
        <div className="hx-plans">
          {P.map((p) => (
            <div key={p.t} className={'hx-plan hx-spot' + (p.featured ? ' is-featured' : '')} onPointerMove={spot}>
              {p.featured && <span className="hx-badge">{tx('Recommended', 'Aanbevolen')}</span>}
              <span className="hx-mono hx-tag">{p.t}</span><h3>{p.h}</h3>
              <ul>{p.li.map((l) => <li key={l}>{l}</li>)}</ul>
            </div>
          ))}
        </div>
        <div id="fractional-ai-lead" className="hx-frac" onPointerMove={spot}>
          <div className="hx-frac-copy">
            <span className="hx-eyebrow"><i />{tx('FRACTIONAL AI LEAD', 'FRACTIONAL AI-LEAD')}</span>
            <h3>{tx('An AI lead at the table,', 'Een AI-lead aan tafel,')} <em>{tx('without a permanent hire.', 'zonder vaste aanstelling.')}</em></h3>
            <p>{tx('Not a project, but one consultant who joins you at fixed moments, for example one day a week. They guard your AI course: roadmap, AI champions, governance and the progress of your use cases.',
              'Geen project, maar één vaste consultant die op vaste momenten aanschuift, bijvoorbeeld één dag per week. Die bewaakt je AI-koers: roadmap, AI-champions, governance en de voortgang van je use cases.')}</p>
            <button type="button" className="hx-btn hx-btn--glow" onClick={onCta}>{tx('Discuss a fractional AI lead', 'Bespreek een Fractional AI-lead')} <Arrow /></button>
          </div>
          <div className="hx-week" aria-hidden="true">
            <div className="hx-week-days">{days.map((d, i) => <div key={d} className={i === 2 ? 'on' : ''}><span className="hx-mono">{d}</span>{i === 2 && <em>{tx('AI lead', 'AI-lead')}</em>}</div>)}</div>
            <div className="hx-week-stats">
              <div><b>{tx('1 day', '1 dag')}</b><span>{tx('a week', 'per week')}</span></div>
              <div><b>{tx('3 mo', '3 mnd')}</b><span>{tx('minimum', 'minimaal')}</span></div>
              <div><b>1</b><span>{tx('fixed contact', 'vast aanspreekpunt')}</span></div>
            </div>
          </div>
        </div>
        <div className="hx-bridge">
          <div><span className="hx-mono hx-tag">{tx('ALREADY ON SALESFORCE?', 'WERK JE AL MET SALESFORCE?')}</span>
            <b>{tx('You already pay for Agentforce.', 'Je betaalt al voor Agentforce.')} <em>{tx('We switch it on.', 'Wij zetten hem aan.')}</em></b>
            <p>{tx('With the Agentforce Kickstart we build a working agent on your own Salesforce data in two weeks.', 'Met de Agentforce Kickstart bouwen we in twee weken een werkende agent op je eigen Salesforce-data.')}</p></div>
          <div className="hx-bridge-actions">
            <a className="hx-btn hx-btn--dark" href={lp('/quickstarts/agentforce')}>{tx('The Agentforce Kickstart', 'De Agentforce Kickstart')} <Arrow /></a>
            <button type="button" className="hx-btn hx-btn--line" onClick={toSalesforce}>{tx('See Salesforce solutions', 'Bekijk Salesforce-oplossingen')}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  7 · Why Intigris: dark grid with one spotlight following the cursor   */
/* ==================================================================== */
function AiWhy() {
  const ref = useRef(null);
  const Y = [
    { t: tx('From training to building', 'Van training tot bouwen'), d: tx('We don’t only train, we build. What your team learns, we can take live together.', 'We trainen niet alleen, we bouwen ook. Wat je team leert, kunnen we samen live zetten.') },
    { t: tx('Your processes, not theory', 'Jouw processen, geen theorie'), d: tx('We work with your tasks, your systems and your data, not with slide-deck examples.', 'We werken met jouw taken, systemen en data, niet met voorbeelden uit een presentatie.') },
    { t: tx('System-independent', 'Systeemonafhankelijk'), d: tx('CRM, ERP, Microsoft, Google, n8n or open-source models: we work with what you already have.', 'CRM, ERP, Microsoft, Google, n8n of open-source modellen: we werken met wat je al hebt.') },
    { t: tx('Tested on ourselves first', 'Eerst getest op onszelf'), d: tx('AI-ify was developed inside our own company, from meeting notes and quotes to backlog and delivery. We know what works in practice, and what doesn’t.', 'AI-ify is ontwikkeld binnen ons eigen bedrijf, van gespreksverslagen en offertes tot backlog en oplevering. We weten wat in de praktijk werkt, en wat niet.') },
    { t: tx('A whole team behind it', 'Een heel team erachter'), d: tx('Consultants, architects, developers and delivery managers, with more than 15 years of complex implementations.', 'Consultants, architecten, developers en delivery managers, met ruim 15 jaar ervaring in complexe implementaties.') },
    { t: tx('Safe, with people in charge', 'Veilig, met de mens aan het stuur'), d: tx('Agreements on data, GDPR and the AI Act are part of every project. Agents support; your people stay in control.', 'Afspraken over data, AVG en AI Act horen bij elk project. Agents ondersteunen; je mensen houden de regie.') },
  ];
  useGsap(ref, ({ gsap }) => {
    gsap.from('.hx-why-item', { opacity: 0, y: 40, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.hx-why-grid', start: 'top 80%' } });
  });
  return (
    <section className="hx-sheet hx-dark hx-why" ref={ref}>
      <div className="container-wide">
        <Head eyebrow={tx('WHY INTIGRIS', 'WAAROM INTIGRIS')} a={tx('No hype. Processes that', 'Geen hype. Processen die')} b={tx('measurably run faster.', 'aantoonbaar sneller lopen.')} />
        <div className="hx-why-grid" onPointerMove={spot}>
          {Y.map((y, i) => (
            <div key={y.t} className="hx-why-item"><span className="hx-mono hx-num">{String(i + 1).padStart(2, '0')}</span><h3>{y.t}</h3><p>{y.d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  8 · FAQ as a chat with Frank                                         */
/* ==================================================================== */
const AI_FAQ = () => [
  { label: tx('Where to start', 'Waar begin je'), q: tx('We’re new to AI. Where do we start?', 'We zijn nieuw met AI. Waar beginnen we?'), a: tx('With the AI Readiness Scan: a short check of where you stand and where AI pays off, with a written report in about two working days. Or with a Basic workshop, so your whole team starts on the same page.', 'Met de AI Readiness Scan: een korte check van waar je staat en waar AI loont, met een rapport binnen zo’n twee werkdagen. Of met een Basis-workshop, zodat je hele team vanaf dezelfde plek start.') },
  { label: tx('Systems', 'Systemen'), q: tx('Does this work with our systems?', 'Werkt dit met onze systemen?'), a: tx('Yes. AI-ify is system-independent and works for any process: CRM, ERP, email, documents and planning. We work with what you already have.', 'Ja. AI-ify is systeemonafhankelijk en werkt voor elk proces: CRM, ERP, mail, documenten en planning. We werken met wat je al hebt.') },
  { label: tx('Tools', 'Tools'), q: tx('Which AI tools and models do you use?', 'Welke AI-tools en modellen gebruiken jullie?'), a: tx('That depends on your situation, your existing licences and your requirements for data and cost. We work with Claude, ChatGPT, Copilot, Gemini, n8n and open-source models, among others.', 'Dat hangt af van je situatie, je bestaande licenties en je eisen aan data en kosten. We werken onder meer met Claude, ChatGPT, Copilot, Gemini, n8n en open-source modellen.') },
  { label: tx('Data', 'Data'), q: tx('What happens to our data?', 'Wat gebeurt er met onze data?'), a: tx('We agree on data, security and processing up front, in a data processing agreement. Where needed we choose models and hosting inside the EU.', 'We maken vooraf afspraken over data, beveiliging en verwerking, in een verwerkersovereenkomst. Waar nodig kiezen we voor modellen en hosting binnen de EU.') },
  { label: tx('Workshop or scan', 'Workshop of scan'), q: tx('Advanced workshop or AI-ify scan?', 'Advanced-workshop of AI-ify-scan?'), a: tx('The Advanced workshop is a day with your team where we find opportunities together. The AI-ify scan is a deeper analysis by our consultants, with interviews, time measurements and a business case per use case.', 'De Advanced-workshop is een dag met je team waarin we samen kansen vinden. De AI-ify-scan is een diepere analyse door onze consultants, met interviews, tijdsmetingen en een business case per use case.') },
  { label: tx('AI Act', 'AI Act'), q: tx('What does the AI literacy duty actually ask?', 'Wat vraagt de AI-geletterdheidsplicht precies?'), a: tx('Article 4 of the AI Act asks organisations to take measures that support their staff’s AI literacy. There is no required level and no required certificate. A documented training is a practical way to meet it.', 'Artikel 4 van de AI Act vraagt organisaties maatregelen te nemen om de AI-geletterdheid van medewerkers te ondersteunen. Er geldt geen verplicht niveau en geen verplicht certificaat. Een gedocumenteerde training is een praktische manier om dit in te vullen.') },
  { label: tx('No-go', 'No-go'), q: tx('What if AI doesn’t pay off for us?', 'En als AI voor ons niet loont?'), a: tx('Then we tell you. Every phase ends with a go/no-go, so you’re never locked in.', 'Dan zeggen we dat. Elke fase eindigt met een go/no-go, dus je zit nergens aan vast.') },
];

/* ==================================================================== */
/*  The AI home (sections below the hero)                                */
/* ==================================================================== */
function SiteAIHome({ onCta, onMode }) {
  const ref = useRef(null);
  /* every section heading: words rise out of a mask (shared with the Salesforce home) */
  useHeadingReveal(ref, '.hx-split');
  return (
    <div className="hx-root" ref={ref}>
      <AiGap />
      <AiLadder />
      <AiWorkshops onCta={onCta} />
      <AiMethod onCta={onCta} />
      <AiBuild />
      <AiRun onCta={onCta} onMode={onMode} />
      <AiWhy />
      <div className="hx-sheet hx-light hx-faqwrap">
        <V3FaqChat head={{ eyebrow: tx('QUESTIONS WE GET', 'VRAGEN DIE WE KRIJGEN'), a: tx('Before you', 'Voordat je'), b: tx('book the call.', 'het gesprek plant.') }} items={AI_FAQ()} onCta={onCta} />
      </div>
      <TalkChatAsk onCta={onCta} ai />
      <CkStyles />
      <V3Styles />
      <TkStyles />
    </div>
  );
}

/* the styles ship with the hero (always rendered in the AI view) */
function HxStyles() { return <style dangerouslySetInnerHTML={{ __html: HX_CSS }} />; }

export { SiteAIHome, AiHero, AI_FAQ };

const HX_CSS = `
.hx-hero, .hx-root {
  --hx-night: #0e0804; --hx-card: rgba(252,247,235,.045); --hx-line: rgba(252,247,235,.12);
  --hx-coral: #ff5f36; --hx-blue: #9ab8e2; --hx-paper: #fbf8f2; --hx-paper-2: #f3ede0; --hx-ink: #2a1708; --hx-muted: rgba(42,23,8,.66);
  --hx-mono: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}
.hx-mono { font-family: var(--hx-mono); font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; }
.hx-arrow { display: inline-block; transition: transform .3s var(--ease-out); }
.hx-btn:hover .hx-arrow, .hx-textlink:hover .hx-arrow, .hx-entry:hover .hx-arrow { transform: translateX(4px); }

/* buttons */
.hx-btn { position: relative; display: inline-flex; align-items: center; gap: 10px; height: 50px; padding: 0 24px; border-radius: 999px; border: 0; font: inherit; font-size: 15.5px; font-weight: 500; cursor: pointer; text-decoration: none; transition: transform .3s var(--ease-out), box-shadow .3s var(--ease-out), background .3s, color .3s, border-color .3s; }
.hx-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.hx-btn--glow { background: var(--hx-coral); color: #2a1300; box-shadow: 0 14px 40px -12px rgba(255,95,54,.7); }
.hx-btn--glow:hover { transform: translateY(-2px); box-shadow: 0 0 0 6px rgba(255,95,54,.16), 0 20px 50px -12px rgba(255,95,54,.85); }
.hx-btn--ghost { background: rgba(252,247,235,.06); color: #fcf7eb; border: 1px solid rgba(252,247,235,.22); backdrop-filter: blur(10px); }
.hx-btn--ghost:hover { background: rgba(252,247,235,.14); }
.hx-btn--line { background: transparent; color: var(--hx-ink); border: 1.5px solid rgba(42,23,8,.22); }
.hx-btn--line:hover { border-color: var(--hx-ink); background: var(--hx-ink); color: #fcf7eb; }
.hx-btn--dark { background: var(--hx-ink); color: #fcf7eb; }
.hx-btn--dark:hover { transform: translateY(-2px); }
.hx-textlink { background: none; border: 0; padding: 0 0 3px; font: inherit; font-weight: 500; color: inherit; cursor: pointer; border-bottom: 1.5px solid var(--hx-coral); display: inline-flex; gap: 8px; }

/* eyebrow + headings */
.hx-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--hx-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--hx-coral); }
.hx-eyebrow > i { width: 8px; height: 8px; border-radius: 2px; background: var(--hx-coral); box-shadow: 0 0 12px var(--hx-coral); }
.hx-eyebrow--live > i { border-radius: 99px; animation: hxPulse 1.8s ease-in-out infinite; }
@keyframes hxPulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
.hx-head { display: flex; flex-direction: column; gap: 18px; margin-bottom: clamp(32px, 4.5vw, 56px); max-width: 900px; }
.hx-head--c { align-items: center; text-align: center; margin-left: auto; margin-right: auto; }
.hx-h2 { margin: 0; font-size: clamp(38px, 5.4vw, 80px); font-weight: 500; letter-spacing: -.045em; line-height: 1; text-wrap: balance; }
/* solid coral (a background-clip gradient disappears once SplitText wraps the words) */
.hx-h2 em { font-style: normal; color: var(--hx-coral); }
.hx-lede { margin: 0; max-width: 620px; font-size: 18.5px; line-height: 1.55; }

/* sheets: each section slides over the previous one with rounded corners */
.hx-sheet { position: relative; border-radius: clamp(28px, 4vw, 56px) clamp(28px, 4vw, 56px) 0 0; margin-top: calc(-1 * clamp(28px, 4vw, 56px)); padding: clamp(96px, 11vw, 160px) 0 clamp(96px, 11vw, 150px); overflow-x: clip; }
.hx-dark { background: var(--hx-night); color: #fcf7eb; }
.hx-dark .hx-lede { color: rgba(252,247,235,.72); }
.hx-dark .hx-h2 { color: #fcf7eb; }
.hx-light { background: var(--hx-paper); color: var(--hx-ink); box-shadow: 0 -30px 60px -30px rgba(14,8,4,.35); }
.hx-light--2 { background: var(--hx-paper-2); }
.hx-light .hx-lede { color: var(--hx-muted); }
.hx-light .hx-h2 { color: var(--hx-ink); }

/* spotlight cards */
.hx-spot { position: relative; isolation: isolate; }
.hx-spot::before { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: -1; opacity: 0; transition: opacity .3s; background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,95,54,.14), transparent 60%); }
.hx-spot:hover::before { opacity: 1; }

/* ===================== HERO ===================== */
.hx-hero { position: relative; z-index: 0; min-height: max(100vh, 760px); background: radial-gradient(120% 90% at 80% 0%, #2a1608 0%, var(--hx-night) 55%); color: #fcf7eb; overflow: hidden; display: flex; align-items: center; padding: 140px 0 140px; }
.hx-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.hx-grid-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(252,247,235,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(252,247,235,.05) 1px, transparent 1px); background-size: 64px 64px; -webkit-mask-image: radial-gradient(ellipse at 60% 40%, #000 0%, transparent 70%); mask-image: radial-gradient(ellipse at 60% 40%, #000 0%, transparent 70%); }
.hx-aurora { position: absolute; inset: -20%; z-index: 0; filter: blur(80px); opacity: .7; pointer-events: none; }
.hx-aurora i { position: absolute; border-radius: 50%; }
.hx-aurora i:nth-child(1) { width: 46vw; height: 46vw; left: 48%; top: 6%; background: radial-gradient(circle, rgba(255,95,54,.5), transparent 65%); animation: hxDrift 18s ease-in-out infinite; }
.hx-aurora i:nth-child(2) { width: 38vw; height: 38vw; left: 62%; top: 40%; background: radial-gradient(circle, rgba(154,184,226,.3), transparent 65%); animation: hxDrift 22s ease-in-out infinite reverse; }
.hx-aurora i:nth-child(3) { width: 30vw; height: 30vw; left: 10%; top: 55%; background: radial-gradient(circle, rgba(108,42,5,.6), transparent 65%); animation: hxDrift 26s ease-in-out infinite; }
@keyframes hxDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-6%, 5%) scale(1.12); } }
.hx-hero-inner { position: relative; z-index: 2; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, .9fr); gap: clamp(32px, 5vw, 80px); align-items: center; width: 100%; }
.hx-hero-copy { display: flex; flex-direction: column; gap: 26px; align-items: flex-start; }
.hx-h1 { color: #fcf7eb; margin: 0; font-size: clamp(50px, 6.3vw, 112px); font-weight: 500; letter-spacing: -.055em; line-height: .94; }
.hx-mask { display: block; overflow: hidden; padding-bottom: .08em; }
.hx-line { display: block; white-space: nowrap; }
.hx-scramble { position: relative; display: inline-block; }
.hx-scramble-ghost { visibility: hidden; }
.hx-scramble-live { position: absolute; left: 0; top: 0; white-space: nowrap; background: linear-gradient(100deg, var(--hx-coral), #ffb199 60%, #f4d6c8); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hx-scramble-live b { font-weight: inherit; }
.hx-hero-lede { margin: 0; max-width: 34em; font-size: clamp(17px, 1.4vw, 20px); line-height: 1.55; color: rgba(252,247,235,.78); }
.hx-mode { position: relative; display: inline-grid; grid-template-columns: 1fr 1fr; padding: 5px; border-radius: 999px; background: rgba(252,247,235,.07); border: 1px solid rgba(252,247,235,.18); backdrop-filter: blur(14px); }
.hx-mode button { position: relative; z-index: 1; background: none; border: 0; font: inherit; font-size: 14.5px; font-weight: 500; padding: 12px 22px; border-radius: 999px; color: rgba(252,247,235,.75); cursor: pointer; transition: color .3s; white-space: nowrap; }
.hx-mode button.on { color: #2a1300; }
.hx-mode button:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.hx-mode-thumb { position: absolute; z-index: 0; top: 5px; bottom: 5px; left: 5px; width: calc(50% - 5px); border-radius: 999px; background: var(--hx-coral); box-shadow: 0 0 24px rgba(255,95,54,.6); transition: transform .45s var(--ease-out); }
.hx-mode[data-mode="salesforce"] .hx-mode-thumb { transform: translateX(100%); }
.hx-hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; }
.hx-hero-side { display: flex; flex-direction: column; gap: 16px; perspective: 1200px; }
.hx-chip { position: absolute; z-index: 1; font-family: var(--hx-mono); font-size: 12px; letter-spacing: .04em; padding: 8px 12px; border-radius: 10px; color: rgba(252,247,235,.8); background: rgba(252,247,235,.06); border: 1px solid rgba(252,247,235,.14); backdrop-filter: blur(8px); animation: hxFloat 9s ease-in-out infinite; pointer-events: none; }
.hx-chip--0 { left: 3%; top: 16%; } .hx-chip--1 { left: 40%; top: 13%; animation-delay: -2s; } .hx-chip--2 { left: 46%; bottom: 12%; animation-delay: -4s; } .hx-chip--3 { right: 3%; top: 15%; animation-delay: -1s; }
.hx-chip--4 { left: 2%; bottom: 14%; animation-delay: -5s; } .hx-chip--5 { right: 2%; bottom: 8%; animation-delay: -3s; } .hx-chip--6 { left: 28%; bottom: 6%; animation-delay: -6s; } .hx-chip--7 { right: 30%; top: 9%; animation-delay: -7s; }
@keyframes hxFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
.hx-scrollcue { position: absolute; z-index: 2; left: 50%; bottom: 76px; width: 24px; height: 38px; margin-left: -12px; border-radius: 99px; border: 1.5px solid rgba(252,247,235,.35); }
.hx-scrollcue i { position: absolute; left: 50%; top: 7px; width: 3px; height: 8px; margin-left: -1.5px; border-radius: 3px; background: var(--hx-coral); animation: hxCue 1.8s ease-in-out infinite; }
@keyframes hxCue { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(14px); opacity: 0; } 100% { opacity: 0; } }

/* agent console */
.hx-console { position: relative; border-radius: 22px; background: linear-gradient(180deg, rgba(36,22,12,.85), rgba(18,11,6,.9)); border: 1px solid rgba(252,247,235,.14); box-shadow: 0 40px 100px -30px rgba(0,0,0,.8), inset 0 1px 0 rgba(252,247,235,.08); backdrop-filter: blur(18px); }
.hx-console::after { content: ''; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; background: conic-gradient(from var(--hx-angle, 0deg), transparent 0 70%, rgba(255,95,54,.9) 82%, transparent 92%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: hxSpin 6s linear infinite; pointer-events: none; }
@property --hx-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes hxSpin { to { --hx-angle: 360deg; } }
.hx-console-top { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 1px solid rgba(252,247,235,.08); color: rgba(252,247,235,.65); }
.hx-dots { display: inline-flex; gap: 6px; } .hx-dots i { width: 9px; height: 9px; border-radius: 99px; background: rgba(252,247,235,.18); }
.hx-live { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-family: var(--hx-mono); font-size: 11px; text-transform: uppercase; color: #7fd49b; }
.hx-live i { width: 7px; height: 7px; border-radius: 99px; background: #7fd49b; box-shadow: 0 0 10px #7fd49b; animation: hxPulse 1.4s infinite; }
.hx-console-body { padding: 18px; display: grid; gap: 12px; min-height: 250px; align-content: start; }
.hx-cl { display: grid; grid-template-columns: 26px 1fr; gap: 12px; align-items: start; transition: opacity .4s; }
.hx-cl--todo { opacity: .32; }
.hx-cl-ico { width: 26px; height: 26px; border-radius: 8px; display: grid; place-items: center; font-size: 13px; background: rgba(252,247,235,.07); color: rgba(252,247,235,.7); }
.hx-cl--done .hx-cl-ico { background: rgba(127,212,155,.16); color: #7fd49b; }
.hx-cl--hold.hx-cl--busy .hx-cl-ico { background: rgba(255,95,54,.18); }
.hx-cl b { display: block; font-weight: 500; font-size: 15px; color: #fcf7eb; }
.hx-cl small { display: block; margin-top: 2px; font-family: var(--hx-mono); font-size: 11.5px; color: rgba(252,247,235,.55); animation: hxIn .4s var(--ease-out); }
.hx-spin { width: 12px; height: 12px; border-radius: 99px; border: 2px solid rgba(255,95,54,.3); border-top-color: var(--hx-coral); animation: hxRot .8s linear infinite; }
@keyframes hxRot { to { transform: rotate(360deg); } }
@keyframes hxIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.hx-cl-bar { display: block; margin-top: 8px; height: 4px; border-radius: 4px; background: rgba(252,247,235,.08); overflow: hidden; }
.hx-cl-bar i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--hx-coral), #ffb199); animation: hxBar 1.3s ease-out forwards; }
.hx-cl-bar i.full { width: 100%; animation: none; }
@keyframes hxBar { to { width: 100%; } }
.hx-console-foot { display: flex; justify-content: space-between; padding: 12px 18px; border-top: 1px solid rgba(252,247,235,.08); color: rgba(252,247,235,.4); font-size: 10.5px; }
.hx-hero-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.hx-hero-stats > div { padding: 14px 16px; border-radius: 16px; background: rgba(252,247,235,.05); border: 1px solid rgba(252,247,235,.1); backdrop-filter: blur(10px); }
.hx-hero-stats b { display: block; font-size: 28px; font-weight: 500; letter-spacing: -.03em; }
.hx-hero-stats b small { color: var(--hx-coral); font-size: 18px; margin-left: 2px; }
.hx-hero-stats span { font-size: 12.5px; color: rgba(252,247,235,.6); line-height: 1.3; }

/* ===================== 1 · GAP ===================== */
.hx-gap-text { margin: 28px 0 0; max-width: 22ch; font-size: clamp(36px, 5.2vw, 78px); font-weight: 500; letter-spacing: -.04em; line-height: 1.05; }
.hx-gap-text .w { color: #fcf7eb; }
.hx-gap-text .w.hot { color: var(--hx-coral); }
.hx-gap-cards { margin-top: clamp(56px, 7vw, 96px); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.hx-gap-card { padding: 30px 28px; border-radius: 26px; background: var(--hx-card); border: 1px solid var(--hx-line); }
.hx-num { color: var(--hx-coral); }
.hx-gap-card h3, .hx-why-item h3 { margin: 18px 0 10px; font-size: 24px; font-weight: 500; letter-spacing: -.025em; color: #fcf7eb; }
.hx-gap-card p, .hx-why-item p { margin: 0; font-size: 15.5px; line-height: 1.6; color: rgba(252,247,235,.66); }
.hx-gap-out { margin: clamp(40px, 5vw, 64px) 0 0; font-size: clamp(20px, 1.8vw, 26px); letter-spacing: -.015em; color: rgba(252,247,235,.88); max-width: 34em; }

/* ===================== 2 · LADDER ===================== */
.hx-ladder { padding: 0; }
.hx-ladder-track { height: 420vh; position: relative; }
.hx-ladder-sticky { position: sticky; top: 0; height: 100vh; display: flex; align-items: center; }
.hx-ladder-grid { display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr); gap: clamp(32px, 5vw, 80px); align-items: center; width: 100%; }
.hx-ladder .hx-head { margin-bottom: 24px; }
.hx-ladder .hx-h2 { font-size: clamp(36px, 4.2vw, 64px); }
.hx-ladder .hx-lede { font-size: 17px; }
.hx-entry { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center; padding: 14px 18px; border-radius: 18px; border: 1.5px dashed rgba(42,23,8,.25); color: var(--hx-ink); text-decoration: none; background: rgba(255,255,255,.55); transition: border-color .3s, background .3s; }
.hx-entry:hover { border-color: var(--hx-coral); background: #fff; }
.hx-entry-n { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: var(--hx-ink); color: var(--hx-coral); }
.hx-entry b { display: block; font-weight: 500; font-size: 15px; }
.hx-entry small { display: block; font-size: 13.5px; color: var(--hx-muted); margin-top: 2px; line-height: 1.4; }
.hx-rail { position: relative; margin-top: 24px; display: grid; gap: 2px; padding-left: 28px; }
.hx-rail-line { position: absolute; left: 7px; top: 14px; bottom: 14px; width: 2px; background: rgba(42,23,8,.12); border-radius: 2px; }
.hx-rail-line i { position: absolute; inset: 0; background: linear-gradient(var(--hx-coral), #ffb199); transform-origin: top; transform: scaleY(var(--p, 0)); border-radius: 2px; }
.hx-rail-item { position: relative; display: grid; grid-template-columns: 34px 110px 1fr; align-items: baseline; gap: 10px; text-align: left; padding: 10px 14px; border-radius: 14px; border: 0; background: none; font: inherit; color: rgba(42,23,8,.45); cursor: pointer; transition: background .3s, color .3s; }
.hx-rail-item b { font-size: 22px; font-weight: 500; letter-spacing: -.02em; }
.hx-rail-item small { font-size: 14px; }
.hx-rail-item.on { color: var(--hx-ink); background: #fff; box-shadow: 0 16px 40px -28px rgba(42,23,8,.5); }
.hx-rail-item.past { color: rgba(42,23,8,.7); }
.hx-rail-item.on .hx-mono { color: var(--hx-coral); }
.hx-rail-dot { position: absolute; left: -27px; top: 50%; width: 14px; height: 14px; margin-top: -7px; border-radius: 99px; background: var(--hx-paper); border: 2px solid rgba(42,23,8,.2); transition: all .3s; }
.hx-rail-item.on .hx-rail-dot, .hx-rail-item.past .hx-rail-dot { background: var(--hx-coral); border-color: var(--hx-coral); box-shadow: 0 0 0 5px rgba(255,95,54,.18); }
.hx-stage { border-radius: 32px; background: var(--hx-night); color: #fcf7eb; overflow: hidden; box-shadow: 0 50px 100px -40px rgba(14,8,4,.6); animation: hxStage .6s var(--ease-out); }
@keyframes hxStage { from { opacity: 0; transform: translateY(18px) scale(.985); } to { opacity: 1; transform: none; } }
.hx-stage-visual { position: relative; height: clamp(170px, 24vh, 230px); background: radial-gradient(80% 120% at 70% 0%, rgba(255,95,54,.25), transparent 60%), #140c06; border-bottom: 1px solid var(--hx-line); }
.hx-stage-text { padding: 26px 32px 30px; }
.hx-stage-n { color: var(--hx-coral); }
.hx-stage h3 { color: #fcf7eb; margin: 10px 0 10px; font-size: clamp(42px, 4.6vw, 68px); font-weight: 500; letter-spacing: -.045em; line-height: 1; }
.hx-stage p { margin: 0 0 16px; font-size: 17px; line-height: 1.55; color: rgba(252,247,235,.78); }
.hx-stage ul, .hx-mstep ul { list-style: none; margin: 0 0 20px; padding: 0; display: grid; gap: 8px; }
.hx-stage li, .hx-mstep li { position: relative; padding-left: 24px; font-size: 15px; }
.hx-stage li::before, .hx-mstep li::before { content: '→'; position: absolute; left: 0; color: var(--hx-coral); }
.hx-ladder-mobile { display: none; }
/* scenes */
.hx-scene { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.hx-scene--learn { flex-direction: column; align-items: flex-start; gap: 8px; padding: 24px 36px; justify-content: center; }
.hx-chk { display: inline-flex; align-items: center; gap: 10px; font-size: 14.5px; opacity: 0; animation: hxChk .5s var(--ease-out) forwards; animation-delay: var(--d); }
.hx-chk i { width: 22px; height: 22px; border-radius: 7px; display: grid; place-items: center; font-style: normal; font-size: 12px; background: rgba(127,212,155,.18); color: #7fd49b; }
@keyframes hxChk { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
.hx-radar { position: relative; width: 170px; height: 170px; border-radius: 50%; border: 1px solid rgba(252,247,235,.14); background: repeating-radial-gradient(circle, transparent 0 28px, rgba(252,247,235,.07) 28px 29px); overflow: hidden; }
.hx-sweep { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, rgba(255,95,54,.55), transparent 22%); animation: hxRot 3.2s linear infinite; }
.hx-radar b { position: absolute; width: 9px; height: 9px; margin: -4.5px; border-radius: 99px; background: var(--hx-blue); animation: hxBlip 3.2s ease-in-out infinite; animation-delay: var(--d); }
.hx-radar b:nth-of-type(1), .hx-radar b:nth-of-type(3), .hx-radar b:nth-of-type(5) { background: var(--hx-coral); box-shadow: 0 0 14px var(--hx-coral); }
@keyframes hxBlip { 0%,100% { opacity: .35; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.3); } }
.hx-scan-legend { position: absolute; right: 22px; bottom: 18px; display: grid; gap: 6px; color: rgba(252,247,235,.6); }
.hx-scan-legend b { display: inline-block; width: 8px; height: 8px; border-radius: 9px; margin-right: 6px; background: var(--hx-blue); } .hx-scan-legend b.c { background: var(--hx-coral); }
.hx-scene--build svg { width: 78%; height: auto; overflow: visible; }
.hx-wire { fill: none; stroke: rgba(252,247,235,.16); stroke-width: 2; }
.hx-wire--hot { stroke: var(--hx-coral); stroke-width: 2.5; stroke-dasharray: 26 400; animation: hxFlowDash 2.4s linear infinite; filter: drop-shadow(0 0 6px var(--hx-coral)); }
@keyframes hxFlowDash { from { stroke-dashoffset: 426; } to { stroke-dashoffset: 0; } }
.hx-node { fill: #1e140c; stroke: rgba(252,247,235,.4); stroke-width: 2; } .hx-node--end { stroke: #7fd49b; }
.hx-build-labels { position: absolute; left: 9%; right: 9%; bottom: 12px; display: flex; justify-content: space-between; color: rgba(252,247,235,.5); }
.hx-scene--run svg { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 70%; }
.hx-spark { fill: none; stroke: var(--hx-coral); stroke-width: 2.5; stroke-dasharray: 500; stroke-dashoffset: 500; animation: hxDraw 2.2s var(--ease-out) forwards; vector-effect: non-scaling-stroke; }
.hx-spark-fill { fill: rgba(255,95,54,.12); opacity: 0; animation: hxFade 1s 1s forwards; }
@keyframes hxDraw { to { stroke-dashoffset: 0; } } @keyframes hxFade { to { opacity: 1; } }
.hx-run-kpis { position: absolute; left: 24px; top: 22px; display: flex; gap: 10px; }
.hx-run-kpis span { padding: 6px 10px; border-radius: 8px; background: rgba(252,247,235,.07); color: rgba(252,247,235,.75); }
.hx-run-kpis b { color: #7fd49b; font-weight: 400; }

/* ===================== 3 · WORKSHOPS ===================== */
.hx-ws-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; perspective: 1400px; }
.hx-ws-card, .hx-plan { position: relative; display: flex; flex-direction: column; padding: 32px 28px 28px; border-radius: 28px; background: #fff; border: 1px solid rgba(42,23,8,.08); box-shadow: 0 30px 60px -45px rgba(42,23,8,.45); transition: transform .4s var(--ease-out), box-shadow .4s; }
.hx-ws-card:hover, .hx-plan:hover { transform: translateY(-6px); box-shadow: 0 40px 70px -40px rgba(42,23,8,.5); }
.hx-ws-card.is-featured, .hx-plan.is-featured { background: var(--hx-night); color: #fcf7eb; border-color: transparent; }
.hx-ws-card.is-featured::after, .hx-plan.is-featured::after { content: ''; position: absolute; inset: -1.5px; border-radius: inherit; padding: 1.5px; background: conic-gradient(from var(--hx-angle, 0deg), var(--hx-coral), var(--hx-blue), #ffb199, var(--hx-coral)); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: hxSpin 5s linear infinite; pointer-events: none; }
.hx-badge { position: absolute; top: -13px; left: 26px; z-index: 2; padding: 6px 12px; border-radius: 999px; background: var(--hx-coral); color: #2a1300; font-family: var(--hx-mono); font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; box-shadow: 0 8px 24px -6px rgba(255,95,54,.7); }
.hx-tag { color: var(--hx-coral); }
.hx-ws-card h3, .hx-plan h3 { color: inherit; margin: 12px 0 6px; font-size: 25px; font-weight: 500; letter-spacing: -.025em; line-height: 1.12; }
.hx-meta { font-size: 14px; color: var(--hx-muted); padding-bottom: 18px; margin-bottom: 18px; border-bottom: 1px solid rgba(42,23,8,.1); }
.is-featured .hx-meta { color: rgba(252,247,235,.6); border-color: rgba(252,247,235,.12); }
.hx-ws-card ul, .hx-plan ul { list-style: none; margin: 0 0 26px; padding: 0; display: grid; gap: 10px; }
.hx-ws-card li, .hx-plan li { position: relative; padding-left: 24px; font-size: 15px; line-height: 1.45; }
.hx-ws-card li::before, .hx-plan li::before { content: ''; position: absolute; left: 2px; top: 6px; width: 10px; height: 10px; border-radius: 3px; background: linear-gradient(135deg, var(--hx-coral), #ffb199); }
.hx-ws-card .hx-btn { margin-top: auto; align-self: flex-start; }
.hx-record { margin-top: 22px; display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center; padding: 22px 26px; border-radius: 24px; background: rgba(154,184,226,.18); border: 1px solid rgba(154,184,226,.45); }
.hx-record-doc { width: 220px; padding: 16px 18px; border-radius: 14px; background: #fff; display: grid; gap: 8px; box-shadow: 0 20px 40px -30px rgba(42,23,8,.5); }
.hx-record-doc > span { color: var(--hx-muted); font-size: 10.5px; margin-bottom: 4px; text-transform: none; }
.hx-record-doc .hx-chk { font-size: 13.5px; color: var(--hx-ink); } .hx-record-doc .hx-chk i { background: rgba(76,105,58,.15); color: #4c693a; }
.hx-record b { font-weight: 500; font-size: 18px; } .hx-record p { margin: 6px 0 0; color: var(--hx-muted); font-size: 15px; line-height: 1.55; }

/* ===================== 4 · METHOD ===================== */
.hx-method { padding-top: 0; }
.hx-mth-track { position: relative; }
.hx-mth-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
.hx-mth-rail { display: flex; gap: 18px; align-items: stretch; width: max-content; padding-left: max(24px, calc((100vw - 1280px) / 2 + 24px)); will-change: transform; }
.hx-mth-intro { flex: 0 0 min(560px, 80vw); display: flex; flex-direction: column; justify-content: center; padding-right: 40px; }
.hx-mth-intro .hx-head { margin-bottom: 18px; }
.hx-mth-intro .hx-h2 { font-size: clamp(40px, 4.8vw, 72px); }
.hx-hint { color: rgba(252,247,235,.45); animation: hxNudge 1.6s ease-in-out infinite; }
@keyframes hxNudge { 50% { transform: translateX(8px); } }
.hx-mcard { flex: 0 0 340px; height: min(460px, 62vh); position: relative; display: flex; flex-direction: column; justify-content: flex-end; padding: 30px 28px; border-radius: 28px; background: linear-gradient(180deg, rgba(252,247,235,.06), rgba(252,247,235,.02)); border: 1px solid var(--hx-line); overflow: hidden; isolation: isolate; }
.hx-mcard::before { content: ''; position: absolute; inset: 0; z-index: -1; opacity: 0; transition: opacity .3s; background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255,95,54,.18), transparent 60%); }
.hx-mcard:hover::before { opacity: 1; }
.hx-mcard-n { position: absolute; top: 14px; right: 22px; font-size: 140px; font-weight: 500; letter-spacing: -.06em; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px rgba(252,247,235,.16); }
.hx-mcard.is-up .hx-mcard-n { -webkit-text-stroke-color: rgba(154,184,226,.3); }
.hx-mcard.is-up .hx-tag { color: var(--hx-blue); }
.hx-mcard h3 { margin: 10px 0 10px; font-size: 32px; font-weight: 500; letter-spacing: -.035em; color: #fcf7eb; }
.hx-mcard p { margin: 0; font-size: 15.5px; line-height: 1.55; color: rgba(252,247,235,.7); }
.hx-gatecard { flex: 0 0 240px; height: min(460px, 62vh); border-radius: 28px; display: flex; flex-direction: column; justify-content: center; gap: 12px; padding: 28px; background: var(--hx-coral); color: #2a1300; box-shadow: 0 0 80px -10px rgba(255,95,54,.6); }
.hx-gatecard b { font-size: 40px; font-weight: 500; letter-spacing: -.04em; line-height: 1; }
.hx-gatecard p { margin: 0; font-size: 15.5px; line-height: 1.5; }
.hx-mth-end { flex: 0 0 6vw; }
.hx-mth-progress { margin-top: 34px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px; color: rgba(252,247,235,.45); width: 100%; }
.hx-mth-progress div { height: 2px; background: rgba(252,247,235,.12); border-radius: 2px; overflow: hidden; }
.hx-mth-progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--hx-coral), var(--hx-blue)); transform-origin: left; transform: scaleX(var(--mp, 0)); }
/* demo */
.hx-demo { margin-top: clamp(64px, 8vw, 120px); padding: clamp(26px, 3.5vw, 48px); border-radius: 36px; background: linear-gradient(180deg, rgba(252,247,235,.07), rgba(252,247,235,.03)); border: 1px solid var(--hx-line); }
.hx-demo-head { max-width: 760px; }
.hx-demo-head h3 { margin: 12px 0 10px; font-size: clamp(30px, 3.4vw, 48px); font-weight: 500; letter-spacing: -.035em; color: #fcf7eb; }
.hx-demo-head p { margin: 0; color: rgba(252,247,235,.7); font-size: 17px; line-height: 1.55; }
.hx-demo-io { margin-top: 30px; display: grid; grid-template-columns: 1fr auto 1.2fr; gap: 18px; align-items: stretch; }
.hx-io { padding: 20px 22px; border-radius: 22px; background: rgba(0,0,0,.25); border: 1px solid var(--hx-line); }
.hx-io > span { display: block; margin-bottom: 12px; color: rgba(252,247,235,.5); }
.hx-io--in ul { margin: 0; padding-left: 18px; display: grid; gap: 8px; color: rgba(252,247,235,.75); font-family: var(--hx-mono); font-size: 13.5px; }
.hx-io--out { background: #fcf7eb; color: var(--hx-ink); border-color: transparent; }
.hx-io--out > span { color: var(--hx-muted); }
.hx-io--out p { margin: 0 0 8px; font-size: 15.5px; line-height: 1.45; opacity: 0; transform: translateY(6px); transition: opacity .5s var(--ease-out), transform .5s var(--ease-out); }
.hx-io--out p:first-of-type { font-weight: 500; font-size: 18px; }
.hx-io--out p.on { opacity: 1; transform: none; }
.hx-approve { display: inline-flex; align-items: center; gap: 8px; margin-top: 8px; padding: 8px 12px; border-radius: 10px; font-size: 13.5px; background: rgba(76,105,58,.12); color: #4c693a; opacity: 0; transform: scale(.95); transition: opacity .5s var(--ease-out), transform .5s var(--ease-out); }
.hx-approve.on { opacity: 1; transform: none; }
.hx-approve i { font-style: normal; }
.hx-io-agent { position: relative; display: flex; align-items: center; justify-content: center; width: 60px; }
.hx-io-agent span { position: relative; z-index: 1; width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; background: var(--hx-coral); color: #2a1300; animation: hxPulseRing 2s infinite; }
.hx-io-agent span svg { width: 26px; height: 26px; }
.hx-io-agent i { position: absolute; left: -18px; right: -18px; top: 50%; height: 2px; background: linear-gradient(90deg, transparent, var(--hx-coral), transparent); }
@keyframes hxPulseRing { 0% { box-shadow: 0 0 0 0 rgba(255,95,54,.6); } 70% { box-shadow: 0 0 0 18px rgba(255,95,54,0); } 100% { box-shadow: 0 0 0 0 rgba(255,95,54,0); } }
.hx-scores { margin-top: 26px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.hx-score { display: grid; grid-template-columns: 1fr auto; gap: 8px; font-size: 14px; color: rgba(252,247,235,.7); }
.hx-score b { font-weight: 500; color: #fcf7eb; }
.hx-score i { grid-column: 1 / -1; height: 5px; border-radius: 9px; background: rgba(252,247,235,.1); position: relative; overflow: hidden; }
.hx-score i::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(90deg, var(--hx-coral), #ffb199); transform-origin: left; transform: scaleX(0); transition: transform 1.2s var(--ease-out) .4s; }
.hx-demo.in .hx-score i::after { transform: scaleX(var(--w)); }
.hx-demo-foot { margin-top: 26px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; }
.hx-demo-foot small { color: rgba(252,247,235,.45); font-style: italic; }

/* ===================== 5 · BUILD (bento) ===================== */
.hx-bento { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.hx-bento-card { display: flex; flex-direction: column; border-radius: 28px; background: #fff; border: 1px solid rgba(42,23,8,.08); overflow: hidden; box-shadow: 0 30px 60px -48px rgba(42,23,8,.5); transition: transform .4s var(--ease-out), box-shadow .4s; }
.hx-bento-card:hover { transform: translateY(-5px); box-shadow: 0 40px 70px -40px rgba(42,23,8,.45); }
.hx-bento-card.span-2 { grid-column: span 2; } .hx-bento-card.span-3 { grid-column: 1 / -1; }
.hx-bento-visual { position: relative; height: 180px; margin: 10px 10px 0; border-radius: 20px; background: linear-gradient(180deg, #f6f1e7, #efe8da); overflow: hidden; }
.hx-bento-text { display: grid; grid-template-columns: auto 1fr; gap: 16px; padding: 22px 24px 26px; }
.hx-ico { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: rgba(255,95,54,.12); color: var(--hx-coral); }
.hx-ico svg { width: 22px; height: 22px; }
.hx-bento-text h3 { color: var(--hx-ink); margin: 0 0 6px; font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
.hx-bento-text p { margin: 0; font-size: 14.5px; line-height: 1.55; color: var(--hx-muted); }
.hx-mini { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.hx-mini--agent { flex-direction: column; align-items: stretch; gap: 8px; padding: 18px 26px; justify-content: center; }
.hx-msg { display: flex; align-items: center; gap: 8px; max-width: 80%; align-self: flex-start; padding: 9px 12px; border-radius: 12px; font-size: 13.5px; background: #fff; box-shadow: 0 8px 18px -12px rgba(42,23,8,.4); opacity: 0; animation: hxMsg 6s infinite; animation-delay: var(--d); }
.hx-msg svg { width: 15px; height: 15px; color: var(--hx-coral); flex: none; }
.hx-msg--ai { align-self: flex-end; background: var(--hx-night); color: #fcf7eb; }
.hx-msg--ask { align-self: center; }
.hx-msg-btns { display: inline-flex; gap: 4px; margin-left: 6px; } .hx-msg-btns b { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; font-size: 11px; background: rgba(76,105,58,.15); color: #4c693a; } .hx-msg-btns b + b { background: rgba(42,23,8,.08); color: var(--hx-ink); }
@keyframes hxMsg { 0% { opacity: 0; transform: translateY(8px); } 8%, 80% { opacity: 1; transform: none; } 92%, 100% { opacity: 0; } }
.hx-mini--flow svg { position: absolute; left: 10%; width: 80%; height: 90px; top: 50%; margin-top: -45px; }
.hx-mini--flow .hx-wire { stroke: rgba(42,23,8,.15); }
.hx-mini--flow .hx-wire--hot { stroke-dasharray: 30 300; animation-duration: 1.8s; }
.hx-flow-nodes { position: relative; display: flex; justify-content: space-between; width: 86%; }
.hx-flow-nodes span { padding: 8px 10px; border-radius: 10px; background: #fff; font-size: 10.5px; box-shadow: 0 8px 16px -10px rgba(42,23,8,.4); }
.hx-flow-nodes span.ai { background: var(--hx-coral); color: #2a1300; box-shadow: 0 0 20px rgba(255,95,54,.5); }
.hx-mini--crm { flex-direction: column; gap: 8px; padding: 0 22px; align-items: stretch; }
.hx-crm-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: #fff; font-size: 13px; }
.hx-crm-row span { color: var(--hx-muted); }
.hx-crm-row b { font-weight: 500; display: inline-flex; align-items: center; gap: 6px; }
.hx-crm-row svg { width: 14px; height: 14px; color: var(--hx-coral); }
.hx-shimmer { padding: 3px 8px; border-radius: 6px; background: linear-gradient(100deg, rgba(255,95,54,.1) 30%, rgba(255,95,54,.35) 50%, rgba(255,95,54,.1) 70%); background-size: 250% 100%; animation: hxShim 2.4s linear infinite; }
@keyframes hxShim { from { background-position: 150% 0; } to { background-position: -100% 0; } }
.hx-hub-core { position: relative; z-index: 1; width: 54px; height: 54px; border-radius: 16px; display: grid; place-items: center; font-weight: 500; background: var(--hx-night); color: var(--hx-coral); box-shadow: 0 0 0 8px rgba(255,95,54,.1), 0 0 30px rgba(255,95,54,.35); }
.hx-orbit { position: absolute; width: 140px; height: 140px; left: 50%; top: 50%; margin: -70px; border-radius: 50%; border: 1px dashed rgba(42,23,8,.18); animation: hxRot 18s linear infinite; }
.hx-orbit span { position: absolute; left: 50%; top: 50%; transform: rotate(var(--a)) translate(70px) rotate(calc(-1 * var(--a))); }
.hx-orbit em { display: block; transform: translate(-50%, -50%); font-style: normal; font-size: 11px; padding: 5px 8px; border-radius: 8px; background: #fff; box-shadow: 0 6px 14px -8px rgba(42,23,8,.5); }
.hx-orbit em { animation: hxRotBack 18s linear infinite; }
@keyframes hxRotBack { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(-360deg); } }
.hx-mini--doc { gap: 22px; }
.hx-invoice { position: relative; width: 96px; height: 124px; padding: 14px 12px; border-radius: 8px; background: #fff; display: grid; gap: 7px; align-content: start; box-shadow: 0 12px 24px -14px rgba(42,23,8,.5); overflow: hidden; }
.hx-invoice span { height: 6px; border-radius: 3px; background: rgba(42,23,8,.12); } .hx-invoice span.s { width: 60%; }
.hx-scanline { position: absolute; left: 0; right: 0; height: 22px; background: linear-gradient(180deg, transparent, rgba(255,95,54,.35)); border-bottom: 2px solid var(--hx-coral); animation: hxScan 2.4s ease-in-out infinite; }
@keyframes hxScan { 0% { top: -22px; } 100% { top: 124px; } }
.hx-fields { display: grid; gap: 8px; }
.hx-fields span { padding: 6px 10px; border-radius: 8px; background: #fff; color: #4c693a; font-size: 10.5px; opacity: 0; animation: hxField 4.8s infinite; animation-delay: var(--d); }
@keyframes hxField { 0%, 10% { opacity: 0; transform: translateX(-6px); } 20%, 85% { opacity: 1; transform: none; } 100% { opacity: 0; } }
.hx-mini--router { flex-direction: column; gap: 14px; padding: 0 26px; align-items: stretch; }
.hx-lanes { display: grid; gap: 10px; }
.hx-lane { position: relative; height: 40px; border-radius: 12px; background: #fff; overflow: hidden; display: flex; align-items: center; padding: 0 12px; }
.hx-lane span { position: relative; z-index: 1; color: var(--hx-muted); font-size: 10.5px; }
.hx-lane i { position: absolute; top: 50%; width: 10px; height: 10px; margin-top: -5px; border-radius: 9px; background: #7fd49b; box-shadow: 0 0 10px #7fd49b; animation: hxLane 2.2s linear infinite; }
.hx-lane i:nth-of-type(2) { animation-delay: -.7s; } .hx-lane i:nth-of-type(3) { animation-delay: -1.4s; }
.hx-lane--big i { background: var(--hx-coral); box-shadow: 0 0 10px var(--hx-coral); animation-duration: 4.4s; }
@keyframes hxLane { from { left: 30%; } to { left: 100%; } }
.hx-router-note { color: var(--hx-muted); font-size: 10.5px; text-align: center; }
.hx-mini--wp { flex-direction: column; gap: 16px; }
.hx-roles { display: inline-flex; padding: 4px; border-radius: 999px; background: #fff; box-shadow: 0 8px 18px -12px rgba(42,23,8,.4); }
.hx-roles span { padding: 7px 16px; border-radius: 999px; font-size: 13px; color: var(--hx-muted); transition: all .35s; }
.hx-roles span.on { background: var(--hx-night); color: #fcf7eb; }
.hx-skills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.hx-skills em { display: inline-flex; align-items: center; gap: 6px; font-style: normal; font-size: 13px; padding: 7px 12px; border-radius: 10px; background: #fff; animation: hxIn .45s var(--ease-out) both; }
.hx-skills em:nth-child(2) { animation-delay: .1s; } .hx-skills em:nth-child(3) { animation-delay: .2s; }
.hx-skills em svg { width: 14px; height: 14px; color: var(--hx-coral); }
.hx-skills em.pol { background: rgba(76,105,58,.12); color: #4c693a; }
.hx-marquee { margin-top: clamp(48px, 6vw, 80px); display: grid; gap: 12px; }
.hx-marquee-label { text-align: center; color: var(--hx-muted); margin-bottom: 6px; }
.hx-marquee-row { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.hx-marquee-row > div { display: flex; gap: 12px; width: max-content; animation: hxMarq 40s linear infinite; }
.hx-marquee-row.rev > div { animation-direction: reverse; animation-duration: 46s; }
.hx-marquee-row em { font-style: normal; font-size: 15px; padding: 12px 20px; border-radius: 14px; background: #fff; border: 1px solid rgba(42,23,8,.08); white-space: nowrap; }
@keyframes hxMarq { to { transform: translateX(-50%); } }
.hx-path { position: relative; margin-top: clamp(56px, 7vw, 96px); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; padding-top: 34px; }
.hx-path-line { position: absolute; left: 0; right: 0; top: 0; height: 2px; background: rgba(42,23,8,.1); }
.hx-path-line i { position: absolute; inset: 0; background: linear-gradient(90deg, var(--hx-coral), var(--hx-blue)); transform-origin: left; }
.hx-path-step .hx-mono { color: var(--hx-coral); }
.hx-path-step b { display: block; margin: 8px 0 6px; font-size: 26px; font-weight: 500; letter-spacing: -.03em; }
.hx-path-step p { margin: 0; color: var(--hx-muted); font-size: 15px; line-height: 1.55; }

/* ===================== 6 · RUN ===================== */
.hx-plans { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.hx-plan ul { margin-bottom: 0; }
.hx-frac { position: relative; isolation: isolate; margin-top: 18px; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: center; padding: clamp(28px, 4vw, 56px); border-radius: 36px; background: radial-gradient(90% 140% at 100% 0%, rgba(255,95,54,.28), transparent 55%), var(--hx-night); color: #fcf7eb; overflow: hidden; }
.hx-frac::before { content: ''; position: absolute; inset: 0; z-index: -1; background: radial-gradient(500px circle at var(--mx, 70%) var(--my, 30%), rgba(154,184,226,.14), transparent 60%); }
.hx-frac h3 { color: #fcf7eb; margin: 16px 0 14px; font-size: clamp(30px, 3.4vw, 50px); font-weight: 500; letter-spacing: -.04em; line-height: 1.02; }
.hx-frac h3 em { font-style: normal; color: var(--hx-coral); }
.hx-frac p { margin: 0 0 24px; font-size: 16.5px; line-height: 1.6; color: rgba(252,247,235,.75); max-width: 34em; }
.hx-week { display: grid; gap: 12px; }
.hx-week-days { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.hx-week-days div { height: 150px; border-radius: 16px; padding: 12px; background: rgba(252,247,235,.05); border: 1px solid var(--hx-line); display: flex; flex-direction: column; justify-content: space-between; color: rgba(252,247,235,.5); }
.hx-week-days div.on { background: linear-gradient(180deg, rgba(255,95,54,.35), rgba(255,95,54,.12)); border-color: rgba(255,95,54,.7); color: #fcf7eb; box-shadow: 0 0 40px -6px rgba(255,95,54,.55); animation: hxGlow 2.6s ease-in-out infinite; }
.hx-week-days em { font-style: normal; font-size: 13px; font-weight: 500; }
@keyframes hxGlow { 50% { box-shadow: 0 0 60px -4px rgba(255,95,54,.8); } }
.hx-week-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.hx-week-stats div { padding: 12px 14px; border-radius: 14px; background: rgba(252,247,235,.05); border: 1px solid var(--hx-line); }
.hx-week-stats b { display: block; font-size: 22px; font-weight: 500; color: var(--hx-coral); }
.hx-week-stats span { font-size: 12.5px; color: rgba(252,247,235,.6); }
.hx-bridge { margin-top: 18px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 20px 40px; align-items: center; padding: 26px 30px; border-radius: 28px; background: rgba(255,255,255,.7); border: 1px solid rgba(42,23,8,.1); }
.hx-bridge b { display: block; margin: 8px 0 6px; font-size: clamp(22px, 2.2vw, 30px); font-weight: 500; letter-spacing: -.025em; }
.hx-bridge b em { font-style: normal; color: var(--hx-coral); }
.hx-bridge p { margin: 0; color: var(--hx-muted); font-size: 15.5px; }
.hx-bridge-actions { display: flex; flex-wrap: wrap; gap: 10px; }

/* ===================== 7 · WHY ===================== */
.hx-why-grid { position: relative; isolation: isolate; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border-radius: 28px; overflow: hidden; background: rgba(252,247,235,.1); }
.hx-why-grid::after { content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(360px circle at var(--mx, -500px) var(--my, -500px), rgba(255,95,54,.16), transparent 60%); }
.hx-why-item { position: relative; z-index: 0; padding: 34px 30px; background: var(--hx-night); }
.hx-why-item h3 { margin-top: 26px; }

/* FAQ sheet: keep the chat component's own look on paper */
.hx-faqwrap { padding: 0; overflow: hidden; }
.hx-faqwrap .ck-section--soft { background: var(--hx-paper); }

/* ===================== responsive ===================== */
@media (max-width: 1100px) {
  .hx-hero-inner { grid-template-columns: 1fr; }
  .hx-hero-side { max-width: 560px; }
  .hx-chip--1, .hx-chip--2, .hx-chip--6, .hx-chip--7 { display: none; }
}
@media (max-width: 899px) {
  .hx-chip { display: none; }
  .hx-ladder { padding: clamp(80px, 12vw, 120px) 0; }
  .hx-ladder-track { height: auto; }
  .hx-ladder-sticky { position: static; height: auto; }
  .hx-ladder-grid { grid-template-columns: 1fr; }
  .hx-rail, .hx-stage { display: none; }
  .hx-ladder-mobile { display: grid; gap: 12px; margin-top: 24px; }
  .hx-mstep { padding: 24px; border-radius: 24px; background: #fff; border: 1px solid rgba(42,23,8,.08); }
  .hx-mstep .hx-mono { color: var(--hx-coral); } .hx-mstep h3 { margin: 6px 0 8px; font-size: 32px; font-weight: 500; letter-spacing: -.03em; } .hx-mstep p { margin: 0 0 12px; color: var(--hx-muted); }
  .hx-method { padding-top: clamp(80px, 12vw, 120px); }
  .hx-mth-sticky { position: static; height: auto; overflow: visible; }
  .hx-mth-rail { flex-direction: column; width: auto; padding: 0 20px; transform: none !important; }
  .hx-mth-intro, .hx-mcard, .hx-gatecard { flex: none; height: auto; padding-right: 0; }
  .hx-mcard { min-height: 220px; padding: 26px 24px; } .hx-mcard-n { font-size: 96px; } .hx-gatecard { padding: 28px; }
  .hx-hint, .hx-mth-progress, .hx-mth-end { display: none; }
  .hx-gap-cards, .hx-ws-grid, .hx-plans, .hx-bento, .hx-why-grid, .hx-path, .hx-frac, .hx-scores { grid-template-columns: 1fr; }
  .hx-bento-card.span-2, .hx-bento-card.span-3 { grid-column: auto; }
  .hx-demo-io { grid-template-columns: 1fr; } .hx-io-agent { width: auto; height: 60px; } .hx-io-agent i { left: 50%; right: auto; top: -10px; bottom: -10px; width: 2px; height: auto; background: linear-gradient(180deg, transparent, var(--hx-coral), transparent); }
  .hx-record, .hx-bridge { grid-template-columns: 1fr; } .hx-record-doc { width: auto; }
  .hx-ws-grid { gap: 26px; }
}
@media (max-width: 560px) {
  .hx-h1 { font-size: clamp(44px, 13vw, 64px); }
  .hx-mode button { padding: 11px 14px; font-size: 13.5px; }
  .hx-hero-stats b { font-size: 22px; }
  .hx-chip { display: none; }
  .hx-week-days div { height: 100px; padding: 8px; }
  .hx-scrollcue { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hx-hero *, .hx-root * { animation-duration: .001s !important; animation-iteration-count: 1 !important; transition: none !important; }
  .hx-chk, .hx-msg, .hx-fields span { opacity: 1 !important; }
  .hx-ladder-track { height: auto; } .hx-ladder-sticky { position: static; height: auto; padding: 100px 0; }
  .hx-mth-sticky { position: static; height: auto; overflow: visible; }
  .hx-mth-rail { flex-wrap: wrap; width: auto; } .hx-mcard, .hx-gatecard { flex: 1 1 300px; }
}
`;
