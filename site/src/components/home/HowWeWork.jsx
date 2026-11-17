/* ==================================================================== */
/*  Homepage (Salesforce view) · section 6 "How we work"                   */
/*  Differentiator: a clear method, from first call to support.            */
/*  Three design variants for Bing (review page /review/home-sections):    */
/*    A · scroll timeline with a progress line                             */
/*    B · pinned steps, one mini visual per step                           */
/*    C · horizontal cards that slide in while you scroll                  */
/*  Same content in all three (plan 2026-11-09, section 6). Facts to       */
/*  confirm with Frank: demo every 2 weeks, adoption check 30/60/90 days,  */
/*  support as hour bundles or SLA.                                        */
/*  Mock screens use the fictional demo company "Havenwerk BV".           */
/* ==================================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { tx } from '../../lib/i18n.js';

export const HOW_STEPS = () => [
  {
    id: 'intro', title: tx('Intro call', 'Kennismaking'), when: tx('30 minutes', '30 minuten'),
    text: tx('We listen to how you work today and where it gets stuck. You hear honestly whether Salesforce fits, and where to start.', 'We luisteren hoe je nu werkt en waar het vastloopt. Je hoort eerlijk of Salesforce past, en waar je begint.'),
    get: tx('A clear first view of where to start', 'Een helder eerste beeld van waar je begint'),
  },
  {
    id: 'blueprint', title: tx('Analysis & blueprint', 'Analyse & blauwdruk'), when: tx('Fixed price + timeline', 'Vaste prijs + planning'),
    text: tx('We map your processes and data and design the solution. You get a fixed price and a timeline before anything is built.', 'We brengen je processen en data in kaart en ontwerpen de oplossing. Je krijgt een vaste prijs en een planning voordat er iets gebouwd wordt.'),
    get: tx('Blueprint, fixed price, planning', 'Blauwdruk, vaste prijs, planning'),
  },
  {
    id: 'build', title: tx('Build in sprints', 'Bouwen in sprints'), when: tx('Demo every 2 weeks', 'Elke 2 weken een demo'),
    text: tx('We build in short sprints and show working Salesforce every two weeks. You steer along the way, so there are no surprises at the end.', 'We bouwen in korte sprints en laten elke twee weken werkende Salesforce zien. Jij stuurt onderweg bij, dus geen verrassingen aan het eind.'),
    get: tx('Working Salesforce, every two weeks', 'Werkende Salesforce, elke twee weken'),
  },
  {
    id: 'live', title: tx('Go-live', 'Livegang'), when: tx('Data, training, go', 'Data, training, go'),
    text: tx('We move your data, train your users and switch on together. Your team knows the system on day one.', 'We zetten je data over, trainen je gebruikers en gaan samen live. Je team kent het systeem op dag één.'),
    get: tx('Data in place, team trained', 'Data op orde, team getraind'),
  },
  {
    id: 'adopt', title: tx('Adoption check', 'Adoptie-check'), when: tx('After 30 · 60 · 90 days', 'Na 30 · 60 · 90 dagen'),
    text: tx('We check how Salesforce is really used and fix what slows people down. Software only pays off when people use it.', 'We kijken hoe Salesforce echt gebruikt wordt en lossen op wat mensen afremt. Software verdient zich pas terug als mensen het gebruiken.'),
    get: tx('Usage insight + quick improvements', 'Inzicht in gebruik + snelle verbeteringen'),
  },
  {
    id: 'support', title: tx('Support', 'Support'), when: tx('Hour bundle or SLA', 'Uurbundel of SLA'),
    text: tx('Questions, changes and new wishes: pick the hour bundle or SLA that fits, with consultants who know your org.', 'Vragen, wijzigingen en nieuwe wensen: kies de uurbundel of SLA die past, met consultants die jouw org kennen.'),
    get: tx('A partner that stays', 'Een partner die blijft'),
  },
];

export function HowHead({ dark }) {
  return (
    <div className={'hww-head' + (dark ? ' hww-head--dark' : '')}>
      <div className="eyebrow">{tx('HOW WE WORK', 'ZO WERKEN WE')}</div>
      <h2>{tx('No surprises.', 'Geen verrassingen.')} <span>{tx('Six steps, one clear plan.', 'Zes stappen, één helder plan.')}</span></h2>
      <p>{tx('From the first call to support after go-live, you always know what comes next, what it costs and when it is done.', 'Van het eerste gesprek tot support na de livegang: je weet altijd wat er komt, wat het kost en wanneer het af is.')}</p>
    </div>
  );
}

function NoLockIn() {
  return (
    <p className="hww-lock"><b>{tx('No lock-in.', 'Geen lock-in.')}</b> {tx('Everything is built in your own Salesforce org. It stays yours, whoever maintains it.', 'Alles wordt gebouwd in je eigen Salesforce-org. Het blijft van jou, wie het ook beheert.')}</p>
  );
}

/* scroll progress of an element, 0..1 (mode 'pin': while a tall section is pinned;
   mode 'pass': while the element passes a line at `line` × viewport height) */
function useProgress(ref, mode = 'pass', line = 0.6) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight;
      const v = mode === 'pin' ? -r.top / Math.max(1, r.height - vh) : (vh * line - r.top) / Math.max(1, r.height);
      setP(Math.min(1, Math.max(0, v)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [mode, line]);
  return p;
}

const useReducedMotion = () => {
  const [r, setR] = useState(false);
  useEffect(() => { const m = window.matchMedia('(prefers-reduced-motion: reduce)'); setR(m.matches); }, []);
  return r;
};
const useNarrow = (w = 960) => {
  const [n, setN] = useState(false);
  useEffect(() => { const m = window.matchMedia(`(max-width: ${w}px)`); const f = () => setN(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, [w]);
  return n;
};

/* ---------- mini visuals, one per step (fictional Havenwerk BV) ---------- */
export function StepVisual({ id }) {
  const bar = (label, from, w, tone) => (
    <div className="hww-gantt-row" key={label}><span>{label}</span><div><i className={'hww-g hww-g--' + (tone || 'n')} style={{ marginLeft: from + '%', width: w + '%' }} /></div></div>
  );
  const title = {
    intro: tx('Calendar', 'Agenda'), blueprint: tx('Blueprint · Havenwerk BV', 'Blauwdruk · Havenwerk BV'), build: tx('Sprint board', 'Sprintbord'),
    live: tx('Go-live checklist', 'Livegang-checklist'), adopt: tx('Adoption · active users', 'Adoptie · actieve gebruikers'), support: tx('Support · Havenwerk BV', 'Support · Havenwerk BV'),
  }[id];
  return (
    <div className="hww-vis" aria-hidden="true">
      <div className="hww-vis-bar"><span className="hww-dots"><i /><i /><i /></span>{title}</div>
      <div className="hww-vis-body" key={id}>
        {id === 'intro' && (
          <div className="hww-cal">
            <div className="hww-cal-day"><small>{tx('TUE', 'DI')}</small><b>9</b></div>
            <div className="hww-cal-ev"><b>{tx('Intro call · Havenwerk BV × Intigris', 'Kennismaking · Havenwerk BV × Intigris')}</b><span>10:00 – 10:30 · Teams</span>
              <div className="hww-tags"><i>{tx('How you work now', 'Hoe je nu werkt')}</i><i>{tx('Where it hurts', 'Waar het knelt')}</i><i>{tx('Where to start', 'Waar te beginnen')}</i></div></div>
          </div>
        )}
        {id === 'blueprint' && (
          <div className="hww-bp">
            <div className="hww-kv"><span>{tx('Processes mapped', 'Processen in kaart')}</span><b>6</b></div>
            <div className="hww-kv"><span>{tx('Data sources', 'Databronnen')}</span><b>3</b></div>
            <div className="hww-kv hww-kv--hl"><span>{tx('Price', 'Prijs')}</span><b>{tx('Fixed ✓', 'Vast ✓')}</b></div>
            <div className="hww-gantt">{bar('Sprint 1', 0, 34, 'c')}{bar('Sprint 2', 33, 34, 'c')}{bar('Sprint 3', 66, 22, 'c')}{bar(tx('Go-live', 'Livegang'), 88, 12, 'g')}</div>
          </div>
        )}
        {id === 'build' && (
          <div className="hww-board">
            {[[tx('To do', 'To do'), [tx('Quote template', 'Offertesjabloon')]], [tx('Doing', 'Bezig'), [tx('Exact sync', 'Exact-koppeling')]], [tx('Demo', 'Demo'), [tx('Pipeline view', 'Pipeline-overzicht'), tx('Lead routing', 'Leadverdeling')]]].map(([h, cards], ci) => (
              <div className="hww-col" key={h}><small>{h}</small>{cards.map((c) => <div className={'hww-card' + (ci === 2 ? ' hww-card--done' : '')} key={c}>{c}</div>)}</div>
            ))}
            <div className="hww-next">{tx('Next demo: Friday 14:00', 'Volgende demo: vrijdag 14:00')}</div>
          </div>
        )}
        {id === 'live' && (
          <ul className="hww-check">
            {[tx('Data migrated · 4,812 records', 'Data overgezet · 4.812 records'), tx('24 users trained', '24 gebruikers getraind'), tx('Mail & calendar connected', 'Mail & agenda gekoppeld'), tx('Live!', 'Live!')].map((t, i) => <li key={t} style={{ animationDelay: i * 0.1 + 's' }}><i>✓</i>{t}</li>)}
          </ul>
        )}
        {id === 'adopt' && (
          <div className="hww-bars">
            {[['30', 62], ['60', 81], ['90', 94]].map(([d, v], i) => (
              <div className="hww-bar" key={d}><div><i style={{ height: v + '%', animationDelay: i * 0.12 + 's' }} /><b>{v}%</b></div><small>{tx('Day', 'Dag')} {d}</small></div>
            ))}
          </div>
        )}
        {id === 'support' && (
          <div className="hww-tickets">
            <div className="hww-ticket"><b>#00512</b><span>{tx('Add a field to the quote', 'Veld toevoegen aan offerte')}</span><i className="hww-chip hww-chip--g">{tx('Done', 'Klaar')}</i></div>
            <div className="hww-ticket"><b>#00513</b><span>{tx('New sales report', 'Nieuw salesrapport')}</span><i className="hww-chip hww-chip--c">SLA 4h</i></div>
            <div className="hww-meter"><span>{tx('Hour bundle', 'Uurbundel')}</span><div><i style={{ width: '35%' }} /></div><small>{tx('14 of 40 hours used', '14 van 40 uur gebruikt')}</small></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- A · scroll timeline with a progress line ---------- */
export function HowTimeline() {
  const steps = HOW_STEPS();
  const ref = useRef(null);
  const p = useProgress(ref, 'pass', 0.6);
  const reduced = useReducedMotion();
  const fill = reduced ? 1 : p;
  return (
    <section className="hww hww--timeline">
      <div className="container">
        <div className="hww-tl-grid">
          <div className="hww-tl-side"><HowHead /><NoLockIn /></div>
          <ol className="hww-tl" ref={ref}>
            <span className="hww-tl-line" aria-hidden="true"><i style={{ transform: `scaleY(${fill})` }} /></span>
            {steps.map((s, i) => {
              const on = fill >= (i + 0.15) / steps.length;
              return (
                <li key={s.id} className={'hww-tl-step' + (on ? ' on' : '')}>
                  <span className="hww-tl-dot">{String(i + 1).padStart(2, '0')}</span>
                  <div className="hww-tl-body">
                    <div className="hww-when">{s.when}</div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <div className="hww-get"><span>{tx('You get', 'Je krijgt')}</span>{s.get}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- B · pinned steps, one mini visual per step ---------- */
export function HowPinned() {
  const steps = HOW_STEPS();
  const ref = useRef(null);
  const p = useProgress(ref, 'pin');
  const narrow = useNarrow();
  const reduced = useReducedMotion();
  const a = Math.min(steps.length - 1, Math.floor(p * steps.length));
  const s = steps[a];
  if (narrow || reduced) {
    return (
      <section className="hww hww--pinned hww--stack">
        <div className="container">
          <HowHead dark />
          {steps.map((x, i) => (
            <div className="hww-stack-step" key={x.id}>
              <div className="hww-pin-n">{String(i + 1).padStart(2, '0')} · {x.when}</div>
              <h3>{x.title}</h3><p>{x.text}</p>
              <StepVisual id={x.id} />
            </div>
          ))}
          <NoLockIn />
        </div>
      </section>
    );
  }
  return (
    <section className="hww hww--pinned" ref={ref} style={{ height: `calc(${steps.length} * 55vh + 100vh)` }}>
      <div className="hww-pin-stage">
        <div className="container">
          <HowHead dark />
          <div className="hww-pin-grid">
            <ol className="hww-pin-list">
              {steps.map((x, i) => (
                <li key={x.id} className={i === a ? 'on' : i < a ? 'done' : ''}>
                  <span className="hww-pin-num">{i < a ? '✓' : String(i + 1).padStart(2, '0')}</span>
                  <div><b>{x.title}</b><small>{x.when}</small></div>
                </li>
              ))}
            </ol>
            <div className="hww-pin-card" key={s.id}>
              <div className="hww-pin-n">{tx('Step', 'Stap')} {a + 1} / {steps.length} · {s.when}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <StepVisual id={s.id} />
            </div>
          </div>
          <div className="hww-pin-progress" aria-hidden="true"><i style={{ transform: `scaleX(${p})` }} /></div>
          <NoLockIn />
        </div>
      </div>
    </section>
  );
}

/* ---------- C · horizontal cards that slide in while you scroll ---------- */
export function HowCards() {
  const steps = HOW_STEPS();
  const ref = useRef(null);
  const track = useRef(null);
  const p = useProgress(ref, 'pin');
  const narrow = useNarrow();
  const reduced = useReducedMotion();
  const [shift, setShift] = useState(0);
  useEffect(() => {
    const f = () => { const t = track.current; if (t) setShift(Math.max(0, t.scrollWidth - t.parentElement.clientWidth)); };
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f);
  }, [narrow]);
  const pinned = !narrow && !reduced;
  const cards = steps.map((x, i) => {
    const shown = !pinned || i <= 2.6 + p * steps.length * 1.5; // first three on arrival, the rest slide in early in the scroll
    return (
      <article key={x.id} className={'hww-hcard hww-hcard--' + x.id + (shown ? ' in' : '')}>
        <div className="hww-hcard-top"><span className="hww-hnum">{String(i + 1).padStart(2, '0')}</span><span className="hww-when">{x.when}</span></div>
        <h3>{x.title}</h3>
        <p>{x.text}</p>
        <div className="hww-get"><span>{tx('You get', 'Je krijgt')}</span>{x.get}</div>
      </article>
    );
  });
  return (
    <section className={'hww hww--cards' + (pinned ? '' : ' hww--cards-static')} ref={ref} style={pinned ? { height: `calc(${shift}px + 100vh)` } : undefined}>
      <div className="hww-h-stage">
        <div className="container"><HowHead /></div>
        <div className="hww-h-viewport">
          <div className="hww-h-track" ref={track} style={pinned ? { transform: `translateX(${-shift * p}px)` } : undefined}>
            {cards}
            <article className="hww-hcard hww-hcard--end in"><NoLockIn /></article>
          </div>
        </div>
        {pinned && <div className="container"><div className="hww-pin-progress hww-pin-progress--light" aria-hidden="true"><i style={{ transform: `scaleX(${p})` }} /></div></div>}
      </div>
    </section>
  );
}

export function HwwStyles() {
  return <style dangerouslySetInnerHTML={{ __html: HWW_CSS }} />;
}

const HWW_CSS = `
.hww { padding: 120px 0; background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
.hww-head { max-width: 760px; margin-bottom: 48px; }
.hww-head h2 { font-size: clamp(38px, 4.6vw, 64px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 16px 0 0; }
.hww-head h2 span { color: var(--intigris-coral); }
.hww-head p { font-size: 18px; line-height: 1.55; color: var(--fg-muted); margin: 18px 0 0; max-width: 36em; }
.hww-head--dark .eyebrow { color: rgba(255,250,240,.7); }
.hww-head--dark h2 { color: inherit; }
.hww-head--dark p { color: inherit; opacity: .75; }
.hww h3 { font-size: clamp(24px, 2.3vw, 32px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; margin: 6px 0 0; }
.hww-when { font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--intigris-coral-700); }
.hww-get { margin-top: 16px; display: inline-flex; flex-wrap: wrap; gap: 10px; align-items: center; font-size: 14px; font-weight: 500; padding: 8px 14px 8px 8px; border-radius: 999px; background: var(--intigris-paper); border: 1px solid var(--border); }
.hww-get span { font-size: 12px; font-weight: 600; padding: 4px 9px; border-radius: 99px; background: var(--intigris-coral-100); color: var(--intigris-coral-700); }
.hww-lock { font-size: 16px; line-height: 1.5; margin: 32px 0 0; padding: 18px 20px; border-radius: 16px; background: var(--intigris-paper); border: 1px solid var(--border); max-width: 30em; }
.hww-lock b { color: var(--intigris-coral-700); }
@keyframes hwwIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

/* A · timeline */
.hww-tl-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 64px; align-items: start; }
.hww-tl-side { position: sticky; top: 120px; }
.hww-tl { position: relative; list-style: none; margin: 0; padding: 0 0 0 76px; }
.hww-tl-line { position: absolute; left: 25px; top: 8px; bottom: 8px; width: 3px; border-radius: 3px; background: var(--border); overflow: hidden; }
.hww-tl-line i { position: absolute; inset: 0; background: var(--intigris-coral); transform-origin: top; transition: transform .12s linear; }
.hww-tl-step { position: relative; padding: 0 0 64px; opacity: .38; transition: opacity .4s; }
.hww-tl-step:last-child { padding-bottom: 0; }
.hww-tl-step.on { opacity: 1; }
.hww-tl-dot { position: absolute; left: -76px; top: 0; width: 54px; height: 54px; border-radius: 99px; display: grid; place-items: center; font-size: 15px; font-weight: 600; background: var(--intigris-off-white); border: 2px solid var(--border); transition: background .35s, border-color .35s, color .35s; }
.hww-tl-step.on .hww-tl-dot { background: var(--intigris-coral); border-color: var(--intigris-coral); color: #fff; }
.hww-tl-body p { font-size: 17px; line-height: 1.55; color: var(--fg-muted); margin: 12px 0 0; max-width: 34em; }

/* B · pinned */
.hww--pinned { background: var(--intigris-brown-700); color: var(--intigris-off-white); padding: 0; }
.hww-pin-stage { position: sticky; top: 0; min-height: 100vh; padding: 100px 0 40px; box-sizing: border-box; display: flex; align-items: center; }
.hww-pin-stage > .container { width: 100%; }
.hww--pinned .hww-head { margin-bottom: 32px; }
.hww--pinned .hww-head h2 { font-size: clamp(34px, 3.6vw, 52px); }
.hww--pinned .hww-head p { display: none; }
.hww-pin-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.5fr); gap: 48px; align-items: start; }
.hww-pin-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.hww-pin-list li { display: flex; gap: 14px; align-items: center; padding: 12px 14px; border-radius: 14px; color: rgba(255,250,240,.5); transition: background .3s, color .3s; }
.hww-pin-list li b { display: block; font-size: 18px; font-weight: 500; }
.hww-pin-list li small { font-size: 13px; opacity: .8; }
.hww-pin-num { flex: none; width: 36px; height: 36px; border-radius: 99px; display: grid; place-items: center; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,250,240,.25); }
.hww-pin-list li.done { color: rgba(255,250,240,.75); }
.hww-pin-list li.done .hww-pin-num { background: rgba(255,250,240,.12); border-color: transparent; }
.hww-pin-list li.on { background: rgba(255,250,240,.08); color: #fff; }
.hww-pin-list li.on .hww-pin-num { background: var(--intigris-coral); border-color: var(--intigris-coral); }
.hww-pin-card { background: var(--intigris-off-white); color: var(--intigris-dark-brown); border-radius: 28px; padding: 36px; display: grid; grid-template-columns: 1fr 1.05fr; gap: 12px 36px; align-items: center; animation: hwwIn .4s cubic-bezier(.2,.8,.2,1) both; min-height: 360px; box-sizing: border-box; }
.hww-pin-card > .hww-pin-n, .hww-pin-card > h3, .hww-pin-card > p { grid-column: 1; }
.hww-pin-card > .hww-vis { grid-column: 2; grid-row: 1 / span 3; }
.hww-pin-card p { font-size: 16px; line-height: 1.55; color: var(--fg-muted); margin: 8px 0 0; }
.hww-pin-n { font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--intigris-coral-700); }
.hww-pin-progress { height: 3px; border-radius: 3px; background: rgba(255,250,240,.15); margin-top: 28px; overflow: hidden; }
.hww-pin-progress i { display: block; height: 100%; background: var(--intigris-coral); transform-origin: left; }
.hww-pin-progress--light { background: var(--border); }
.hww--pinned .hww-lock { background: rgba(255,250,240,.08); border-color: rgba(255,250,240,.15); margin-top: 20px; max-width: none; font-size: 15px; padding: 14px 18px; }
.hww--pinned .hww-lock b { color: #ffb59e; }
.hww--stack { padding: 80px 0; }
.hww--stack .hww-head p { display: block; }
.hww-stack-step { background: var(--intigris-off-white); color: var(--intigris-dark-brown); border-radius: 22px; padding: 24px; margin-top: 16px; }
.hww-stack-step p { font-size: 16px; line-height: 1.5; color: var(--fg-muted); margin: 8px 0 18px; }

/* mini visuals */
.hww-vis { border-radius: 18px; background: #f3f3f3; border: 1px solid rgba(0,0,0,.08); overflow: hidden; box-shadow: 0 30px 60px -30px rgba(43,23,0,.5); }
.hww-vis-bar { display: flex; align-items: center; gap: 10px; padding: 11px 14px; background: #fff; font-size: 13px; font-weight: 600; color: #032d60; border-bottom: 1px solid #e5e5e5; }
.hww-dots { display: inline-flex; gap: 5px; } .hww-dots i { width: 9px; height: 9px; border-radius: 99px; background: #d9d9d9; }
.hww-vis-body { padding: 16px; min-height: 220px; display: flex; flex-direction: column; justify-content: center; gap: 10px; font-size: 14px; }
.hww-vis-body > * { animation: hwwIn .45s both; }
.hww-cal { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: start; }
.hww-cal-day { width: 58px; text-align: center; background: #fff; border-radius: 12px; padding: 8px 0; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
.hww-cal-day small { display: block; font-size: 11px; font-weight: 700; color: var(--intigris-coral-700); }
.hww-cal-day b { font-size: 24px; }
.hww-cal-ev { background: #fff; border-left: 4px solid var(--intigris-coral); border-radius: 10px; padding: 12px 14px; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
.hww-cal-ev b { display: block; } .hww-cal-ev > span { font-size: 13px; color: #666; }
.hww-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.hww-tags i { font-style: normal; font-size: 12px; font-weight: 600; padding: 4px 9px; border-radius: 8px; background: #eef4ff; color: #0176d3; }
.hww-bp { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.hww-kv { background: #fff; border-radius: 10px; padding: 10px 12px; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
.hww-kv span { display: block; font-size: 12px; color: #666; } .hww-kv b { font-size: 18px; }
.hww-kv--hl b { color: #2e844a; }
.hww-gantt { grid-column: 1 / -1; background: #fff; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.hww-gantt-row { display: grid; grid-template-columns: 70px 1fr; gap: 10px; align-items: center; font-size: 12px; color: #555; }
.hww-gantt-row > div { height: 10px; background: #f0f0f0; border-radius: 6px; }
.hww-g { display: block; height: 100%; border-radius: 6px; background: #c9d6e8; }
.hww-g--c { background: var(--intigris-coral); } .hww-g--g { background: #2e844a; }
.hww-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.hww-col { background: #e9ebee; border-radius: 10px; padding: 8px; display: flex; flex-direction: column; gap: 6px; min-height: 120px; }
.hww-col small { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #555; letter-spacing: .04em; }
.hww-card { background: #fff; border-radius: 8px; padding: 8px; font-size: 13px; box-shadow: 0 1px 2px rgba(0,0,0,.06); }
.hww-card--done { border-left: 3px solid #2e844a; }
.hww-next { grid-column: 1 / -1; font-size: 13px; font-weight: 600; text-align: center; padding: 8px; border-radius: 10px; background: var(--intigris-coral-100); color: var(--intigris-coral-700); }
.hww-check { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.hww-check li { display: flex; gap: 10px; align-items: center; background: #fff; border-radius: 10px; padding: 12px 14px; box-shadow: 0 1px 2px rgba(0,0,0,.05); animation: hwwIn .45s both; }
.hww-check li i { font-style: normal; width: 22px; height: 22px; border-radius: 99px; display: grid; place-items: center; background: #e3f5e9; color: #2e844a; font-size: 12px; font-weight: 700; }
.hww-check li:last-child { font-weight: 600; background: #e3f5e9; }
.hww-bars { display: flex; gap: 18px; align-items: flex-end; justify-content: center; height: 190px; }
.hww-bar { display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; width: 64px; }
.hww-bar > div { flex: 1; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative; }
.hww-bar i { width: 100%; border-radius: 10px 10px 4px 4px; background: var(--intigris-coral); transform-origin: bottom; animation: hwwGrow .7s cubic-bezier(.2,.8,.2,1) both; }
.hww-bar b { position: absolute; font-size: 13px; color: #fff; bottom: 8px; }
.hww-bar small { font-size: 12px; color: #555; font-weight: 600; }
@keyframes hwwGrow { from { transform: scaleY(0); } to { transform: none; } }
.hww-tickets { display: flex; flex-direction: column; gap: 8px; }
.hww-ticket { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; background: #fff; border-radius: 10px; padding: 12px 14px; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
.hww-ticket span { color: #555; }
.hww-chip { font-style: normal; font-size: 12px; font-weight: 600; padding: 4px 9px; border-radius: 99px; }
.hww-chip--g { background: #e3f5e9; color: #2e844a; } .hww-chip--c { background: var(--intigris-coral-100); color: var(--intigris-coral-700); }
.hww-meter { background: #fff; border-radius: 10px; padding: 12px 14px; display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; align-items: center; font-size: 13px; }
.hww-meter > div { height: 8px; border-radius: 6px; background: #f0f0f0; overflow: hidden; }
.hww-meter i { display: block; height: 100%; background: #0176d3; }
.hww-meter small { grid-column: 1 / -1; color: #666; }

/* C · horizontal cards */
.hww--cards { padding: 0; }
.hww-h-stage { position: sticky; top: 0; min-height: 100vh; padding: 110px 0 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.hww--cards .hww-head { margin-bottom: 36px; }
.hww-h-viewport { overflow: hidden; padding: 10px 0 20px; }
.hww-h-track { display: flex; gap: 20px; padding: 0 max(28px, calc((100vw - 1240px) / 2)); width: max-content; will-change: transform; }
.hww-hcard { flex: none; width: 360px; box-sizing: border-box; padding: 30px; border-radius: 26px; background: var(--intigris-paper); border: 1px solid var(--border); display: flex; flex-direction: column; opacity: 0; transform: translateX(80px) rotate(2deg); transition: opacity .5s, transform .6s cubic-bezier(.2,.8,.2,1); }
.hww-hcard.in { opacity: 1; transform: none; }
.hww-hcard p { font-size: 16px; line-height: 1.55; color: var(--fg-muted); margin: 12px 0 0; flex: 1; }
.hww-hcard .hww-get { align-self: flex-start; }
.hww-hcard-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 26px; }
.hww-hnum { font-size: 56px; font-weight: 500; letter-spacing: -0.04em; line-height: 1; color: var(--intigris-coral); }
.hww-hcard--build { background: var(--intigris-coral); color: #fff; border-color: transparent; }
.hww-hcard--live { background: var(--intigris-brown-700); color: var(--intigris-off-white); border-color: transparent; }
.hww-hcard--build .hww-hnum, .hww-hcard--build .hww-when, .hww-hcard--live .hww-when { color: inherit; opacity: .85; }
.hww-hcard--build p, .hww-hcard--live p { color: inherit; opacity: .85; }
.hww-hcard--build h3, .hww-hcard--live h3 { color: inherit; }
.hww-hcard--build .hww-get, .hww-hcard--live .hww-get { background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.25); }
.hww-hcard--end { background: transparent; border: 0; justify-content: center; padding: 0 20px 0 0; }
.hww-hcard--end .hww-lock { margin: 0; }
.hww--cards-static { padding: 80px 0; }
.hww--cards-static .hww-h-stage { position: static; min-height: 0; padding: 0; }
.hww--cards-static .hww-h-viewport { overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.hww--cards-static .hww-hcard { scroll-snap-align: start; width: min(320px, 82vw); }

@media (max-width: 960px) {
  .hww { padding: 80px 0; }
  .hww-tl-grid { grid-template-columns: 1fr; gap: 8px; }
  .hww-tl-side { position: static; }
  .hww-tl-side .hww-lock { display: none; }
  .hww-tl { padding-left: 62px; }
  .hww-tl-dot { left: -62px; width: 44px; height: 44px; font-size: 13px; }
  .hww-tl-line { left: 20px; }
  .hww-tl-step { padding-bottom: 44px; }
}
@media (prefers-reduced-motion: reduce) { .hww *, .hww *::before { animation: none !important; transition: none !important; } }
`;
