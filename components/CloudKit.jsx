/* ==================================================================== */
/*  CLOUD KIT                                                            */
/*  Building blocks for the cloud product pages (Sales Cloud, Field      */
/*  Service, and later the other clouds). A page picks the blocks it     */
/*  needs and fills them; nothing here is tied to one cloud.             */
/*  All copy is tx(EN, NL). Scroll effects respect reduced motion.       */
/*  Exposes the blocks on window (see the Object.assign at the bottom).  */
/* ==================================================================== */

const { useState: ckUseState, useEffect: ckUseEffect, useRef: ckUseRef } = React;

const CK_REDUCE = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll progress (0..1) of an element through the viewport. */
function useScrollProgress(ref, { start = 0.85, span = 0.6 } = {}) {
  const [p, setP] = ckUseState(CK_REDUCE ? 1 : 0);
  ckUseEffect(() => {
    if (CK_REDUCE) return;
    let raf = 0;
    const on = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const v = (window.innerHeight * start - r.top) / (window.innerHeight * span + r.height * 0.4);
      setP(Math.max(0, Math.min(1, v)));
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(on); };
    on();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => { window.removeEventListener('scroll', tick); window.removeEventListener('resize', tick); cancelAnimationFrame(raf); };
  }, []);
  return p;
}

/* Index of the child step closest to the reading line. */
function useActiveStep(containerRef, selector, line = 0.55) {
  const [i, setI] = ckUseState(0);
  ckUseEffect(() => {
    let raf = 0;
    const on = () => {
      raf = 0;
      const el = containerRef.current; if (!el) return;
      const steps = el.querySelectorAll(selector); let best = 0;
      steps.forEach((s, k) => { if (s.getBoundingClientRect().top < window.innerHeight * line) best = k; });
      setI(best);
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(on); };
    on();
    window.addEventListener('scroll', tick, { passive: true });
    return () => { window.removeEventListener('scroll', tick); cancelAnimationFrame(raf); };
  }, []);
  return i;
}

/* Gentle rise for blocks below the first screen; content is visible at rest. */
function useReveal() {
  ckUseEffect(() => {
    if (CK_REDUCE || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('ck-pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.ck-rv').forEach(el => { if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('ck-pre'); io.observe(el); } });
    return () => io.disconnect();
  }, []);
}

/* Reading-progress line at the very top of the page. */
function CkProgress() {
  const [w, setW] = ckUseState(0);
  ckUseEffect(() => {
    const on = () => { const h = document.documentElement.scrollHeight - window.innerHeight; setW(h > 0 ? (window.scrollY / h) * 100 : 0); };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div className="ck-progress" style={{ width: w + '%' }} aria-hidden />;
}

function CkHead({ eyebrow, a, b, dark, lede }) {
  return (
    <div className="ck-head">
      <div className={'eyebrow' + (dark ? ' eyebrow--dark' : '')}>{eyebrow}</div>
      <h2 className="ck-h2">{a} <span>{b}</span></h2>
      {lede && <p className="ck-lede">{lede}</p>}
    </div>
  );
}

/* ---------- HERO with a glance card (price, weeks, promises) ---------- */
function CkHero({ eyebrow, a, b, lede, card, onCta, secondary, variant = 'coral', side }) {
  return (
    <section className={'ck-hero ck-hero--' + variant}>
      <div aria-hidden className="ck-hero-photo" />
      <div className="container-wide ck-hero-inner">
        <div className="ck-hero-grid">
          <div>
            <div className="eyebrow eyebrow--dark" style={{ marginBottom: 22 }}>{eyebrow}</div>
            <h1 className="ck-h1">{a} <span>{b}</span></h1>
            <p className="ck-hero-lede">{lede}</p>
            <div className="ck-actions">
              <button className="btn ck-btn-dark" onClick={onCta}>{tx('Book a 30-min call', 'Plan een gesprek van 30 min')} <span className="arrow">→</span></button>
              {secondary && <a className="btn btn-outline-light" href={secondary.href}>{secondary.label} <span className="arrow">↓</span></a>}
            </div>
          </div>
          {side || (card && (
            <div className="ck-glass">
              <div className="ck-glass-eyebrow">{card.eyebrow}</div>
              <div className="ck-glass-price">{card.price}</div>
              <div className="ck-glass-sub">{card.sub}</div>
              <ul>{card.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PAINS → OUTCOMES with a switch (roles or industries) ---------- */
function CkSwitchPains({ head, options }) {
  const [k, setK] = ckUseState(0);
  const o = options[k];
  return (
    <section className="container-wide ck-section">
      <CkHead {...head} />
      <div className="ck-pills" role="group" aria-label={tx('Choose', 'Kies')}>
        {options.map((x, i) => <button key={i} type="button" className={i === k ? 'on' : ''} aria-pressed={i === k} onClick={() => setK(i)}>{x.label}</button>)}
      </div>
      <div className="ck-pains" key={k}>
        {o.items.map((it, i) => (
          <div key={i} className="ck-pain">
            <span className="ck-pain-before">{it.pain}</span>
            <span className="ck-pain-arrow" aria-hidden>↓</span>
            <b>{it.gain}</b>
            <span className="ck-pain-d">{it.d}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- SHOW-STOPPER: spreadsheet → pipeline drag ---------- */
function CkSpreadsheetSlider({ head }) {
  const [cut, setCut] = ckUseState(50);
  const ref = ckUseRef(null);
  const p = useScrollProgress(ref, { start: 0.9, span: 0.5 });
  /* The divider glides from 85% to 50% as the block scrolls in, until the visitor takes over. */
  const [touched, setTouched] = ckUseState(false);
  const shown = touched ? cut : 85 - 35 * p;
  const rows = [
    ['Havenwerk BV', 'offerte??', '€ 24k', '12-08', 'Daan (weg)', true],
    ['Brightline Energy', 'warm', '€ 9k', '??', 'Noor', false],
    ['Kade & Zonen', 'Offerte v3 FINAL', '€ 31k', '03-07', 'Iris', true],
    ['Polder Logistiek', '?', '—', '—', '?', true],
    ['Stadsbouw NV', 'bellen', '€ 14k', tx('yesterday?', 'gister?'), 'Sem', false],
    ['Duinzicht Zorg', 'demo gehad', '€ 18k', '29-06', 'Noor', true],
  ];
  return (
    <section className="ck-section ck-section--soft" ref={ref}>
      <div className="container-wide">
        <CkHead {...head} />
        <div className="ck-ba" style={{ '--cut': shown + '%' }}>
          <div className="ck-ba-pane ck-ba-before">
            <div className="ck-xl">
              {[tx('Customer', 'Klant'), tx('Stage', 'Fase'), tx('Amount', 'Bedrag'), tx('Last contact', 'Laatste contact'), tx('Owner', 'Eigenaar')].map((h, i) => <span key={i} className="h">{h}</span>)}
              {rows.map((r, i) => r.slice(0, 5).map((c, j) => <span key={i + '-' + j} className={j === 3 && r[5] ? 'r' : ''}>{c}</span>))}
            </div>
            <p className="ck-xl-file">pipeline_Q4_def_DEF(2).xlsx · {tx('last edited by ??', 'laatst bewerkt door ??')}</p>
          </div>
          <div className="ck-ba-pane ck-ba-after">
            <div className="ck-kpis">
              <div><small>Pipeline</small><b>€ 412k</b></div>
              <div><small>{tx('Forecast Q4', 'Forecast Q4')}</small><b>€ 186k</b></div>
              <div><small>{tx('Win rate', 'Winratio')}</small><b>31%</b></div>
              <div><small>{tx('Stalled deals', 'Stilgevallen deals')}</small><b className="warn">2</b></div>
            </div>
            <div className="ck-pipe">
              <div><b>Lead</b><i>Polder Logistiek</i><i>Stadsbouw NV</i></div>
              <div><b>{tx('Quote', 'Offerte')}</b><i>Havenwerk BV</i><i>Duinzicht Zorg</i></div>
              <div><b>{tx('Negotiation', 'Onderhandeling')}</b><i>Kade &amp; Zonen</i></div>
              <div><b>{tx('Won', 'Gewonnen')}</b><i className="won">Brightline Energy</i></div>
            </div>
          </div>
          <span className="ck-ba-label" style={{ left: 12 }}>{tx('Today', 'Vandaag')}</span>
          <span className="ck-ba-label" style={{ right: 12 }}>{tx('With Sales Cloud', 'Met Sales Cloud')}</span>
          <div className="ck-ba-handle" aria-hidden />
          <input type="range" min="4" max="96" value={Math.round(shown)} aria-label={tx('Drag to compare the spreadsheet and Sales Cloud', 'Sleep om de spreadsheet en Sales Cloud te vergelijken')}
            onChange={e => { setTouched(true); setCut(+e.target.value); }} />
        </div>
        <p className="ck-note">{tx('Example data. Drag the coral handle.', 'Voorbeelddata. Sleep aan de koraalrode knop.')}</p>
      </div>
    </section>
  );
}

/* ---------- STEPS: lead → closed deal, with a line that fills on scroll ---------- */
function CkStepsLine({ head, steps }) {
  const ref = ckUseRef(null);
  const p = useScrollProgress(ref, { start: 0.8, span: 0.7 });
  return (
    <section className="ck-section ck-section--rule" ref={ref}>
      <div className="container-wide">
        <CkHead {...head} />
        <ol className="ck-steps" style={{ '--p': p }}>
          <span className="ck-steps-line" aria-hidden><i /></span>
          {steps.map((s, i) => (
            <li key={i} className={p * steps.length > i + 0.3 ? 'lit' : ''}>
              <span className="ck-step-dot" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <b>{s.t}</b>
              <span>{s.d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- PROOF: customer success stories as tabs ---------- */
function CkStories({ head, stories, dark = true }) {
  const [k, setK] = ckUseState(0);
  const s = stories[k];
  return (
    <section className={'ck-section ' + (dark ? 'ck-section--dark' : 'ck-section--coral')}>
      <div className="container-wide">
        <CkHead {...head} dark={!dark} />
        <div className="ck-story-tabs" role="tablist">
          {stories.map((x, i) => (
            <button key={x.name} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => setK(i)}>
              <b>{x.name}</b><small>{x.sector}</small>
            </button>
          ))}
        </div>
        <article className="ck-story" key={s.name}>
          <div>
            {s.quote ? <blockquote>“{s.quote}”</blockquote> : <blockquote className="ck-story-headline">{s.headline}</blockquote>}
            <div className="ck-story-who"><b>{s.who}</b><span>{s.role ? s.role + ', ' : ''}{s.name}</span></div>
          </div>
          <div className="ck-story-side">
            {s.metric && <div className="ck-story-metric"><b>{s.metric.n}</b><small>{s.metric.d}</small></div>}
            <p>{s.what}</p>
            <div className="ck-chips">{s.clouds.map(c => <span key={c}>{c}</span>)}</div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ---------- PACKAGE: tabs in/out/you + weeks + sticky glance card ---------- */
function CkPackage({ head, tabs, weeks, glance, onCta }) {
  const [k, setK] = ckUseState(0);
  const wref = ckUseRef(null);
  const p = useScrollProgress(wref, { start: 0.9, span: 0.45 });
  return (
    <section id="package" className="ck-section">
      <div className="container-wide ck-pkg">
        <div>
          <CkHead {...head} />
          <div className="ck-tabs" role="tablist">
            {tabs.map((t, i) => <button key={i} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => setK(i)}>{t.label}</button>)}
          </div>
          <ul className={'ck-tabpane ck-tabpane--' + tabs[k].kind} key={k}>{tabs[k].items.map((x, i) => <li key={i}>{x}</li>)}</ul>
          <div className="ck-weeks" ref={wref}>
            {weeks.map((w, i) => (
              <div key={i} className={'ck-wk' + (p > (i + 0.5) / weeks.length ? ' lit' : '')}><small>{w.w}</small><b>{w.t}</b><span>{w.d}</span></div>
            ))}
          </div>
        </div>
        <aside className="ck-glance" aria-label={tx('At a glance', 'In één oogopslag')}>
          <small className="ck-glance-eyebrow">{tx('AT A GLANCE', 'IN ÉÉN OOGOPSLAG')}</small>
          <div className="ck-glance-price">{glance.price} <small>{glance.priceNote}</small></div>
          <dl>{glance.rows.map((r, i) => <React.Fragment key={i}><dt>{r[0]}</dt><dd>{r[1]}</dd></React.Fragment>)}</dl>
          <button className="btn ck-btn-light" onClick={onCta}>{tx('Plan a call', 'Plan een gesprek')} <span className="arrow">→</span></button>
          <span className="ck-glance-foot">{tx('Licences are billed by Salesforce.', 'Licenties lopen via Salesforce.')}</span>
        </aside>
      </div>
    </section>
  );
}

/* ---------- CALCULATOR: time back in euros ---------- */
function CkCalculator({ head, people, hours, rate, unit, result }) {
  const [n, setN] = ckUseState(people.v);
  const [h, setH] = ckUseState(hours.v);
  const [r, setR] = ckUseState(rate.v);
  const won = n * h * 0.5 * 46;
  const euro = won * r;
  const fmt = (x) => Math.round(x).toLocaleString(window.__lang === 'nl' ? 'nl-NL' : 'en-GB');
  return (
    <section id="calculator" className="ck-section ck-section--rule">
      <div className="container-wide">
        <CkHead {...head} />
        <div className="ck-calc">
          <div className="ck-calc-in">
            <div className="ck-field"><label htmlFor="ck-n">{people.label} <output>{n}</output></label><input id="ck-n" type="range" min={people.min} max={people.max} value={n} onChange={e => setN(+e.target.value)} /></div>
            <div className="ck-field"><label htmlFor="ck-h">{hours.label} <output>{h}</output></label><input id="ck-h" type="range" min={hours.min} max={hours.max} value={h} onChange={e => setH(+e.target.value)} /></div>
            <div className="ck-field"><label htmlFor="ck-r">{rate.label} <output>€ {r}</output></label><input id="ck-r" type="range" min={rate.min} max={rate.max} step="5" value={r} onChange={e => setR(+e.target.value)} /></div>
          </div>
          <div className="ck-calc-out">
            <small>{tx('If you win back half of that time', 'Als je de helft van die tijd terugwint')}</small>
            <div className="ck-calc-big">€ {fmt(euro)}</div>
            <p>{tx('per year, or', 'per jaar, ofwel')} {fmt(won)} {unit}</p>
            <small>{result}</small>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ grouped by objection ---------- */
function CkFaqTabs({ head, groups }) {
  const [k, setK] = ckUseState(0);
  const g = groups[k];
  return (
    <section id="faq" className="ck-section ck-section--soft">
      <div className="container-wide ck-faq-grid">
        <CkHead {...head} />
        <div>
          <div className="ck-pills" role="group" aria-label={tx('Topic', 'Onderwerp')}>
            {groups.map((x, i) => <button key={i} type="button" className={i === k ? 'on' : ''} aria-pressed={i === k} onClick={() => setK(i)}>{x.label}</button>)}
          </div>
          <div className="ck-faq-a" key={k}><b>{g.q}</b><p>{g.a}</p></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- TALK: a face, a name, one button ---------- */
function CkTalk({ onCta, line }) {
  return (
    <section className="ck-section ck-section--dark ck-talk">
      <div className="container-wide ck-talk-grid">
        <div className="ck-talk-avatar" aria-hidden>FT</div>
        <div>
          <div className="eyebrow">{tx("LET'S TALK", 'ZULLEN WE PRATEN?')}</div>
          <h2 className="ck-h2" style={{ marginTop: 14 }}>{line}</h2>
          <p className="ck-lede">Frank Timmer · Sales Manager · franktimmer@intigris.nl</p>
        </div>
        <button className="btn ck-btn-coral" onClick={onCta}>{tx('Plan 30 minutes', 'Plan 30 minuten')} <span className="arrow">→</span></button>
      </div>
    </section>
  );
}

/* ---------- STICKY STATEMENT: one line, the last word swaps as you scroll ---------- */
function CkStatement({ lead, words, sub }) {
  const ref = ckUseRef(null);
  const i = useActiveStep(ref, '.ck-statement-step', 0.5);
  return (
    <section className="ck-statement" ref={ref}>
      <div className="ck-statement-stick">
        <div className="container-wide">
          <p className="ck-statement-line">{lead} <span key={i}>{words[i].w}</span></p>
          <p className="ck-statement-sub" key={'s' + i}>{words[i].d}</p>
          <div className="ck-statement-dots" aria-hidden>{words.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
        </div>
      </div>
      {words.map((_, k) => <div key={k} className="ck-statement-step" aria-hidden />)}
    </section>
  );
}

/* ---------- FIELD SERVICE: route rescue (chaos → optimised route) ---------- */
function CkRoute({ compact = false, pinned = false }) {
  const ref = ckUseRef(null);
  const calmRef = ckUseRef(null);
  const p = useScrollProgress(ref, pinned ? { start: 0.2, span: 1.4 } : { start: 0.95, span: 0.8 });
  const [len, setLen] = ckUseState(1200);
  ckUseEffect(() => { if (calmRef.current) setLen(calmRef.current.getTotalLength()); }, []);
  const stops = [[70, 300], [110, 200], [150, 120], [260, 70], [400, 80], [460, 180], [440, 290], [330, 330]];
  const svg = (
    <svg viewBox="0 0 520 380" className="ck-route-svg" role="img" aria-label={tx('A tangled route between eight jobs becomes one short optimised loop', 'Een warrige route langs acht klussen wordt één korte, slimme ronde')}>
      <rect x="0" y="0" width="520" height="380" rx="20" fill="#3a2108" />
      <path d="M40 60 H480 M40 140 H480 M40 220 H480 M40 300 H480 M120 30 V350 M240 30 V350 M360 30 V350" stroke="#6c2a05" strokeWidth="1" fill="none" />
      <path d="M70 300 L400 80 L150 120 L440 290 L110 200 L330 330 L260 70 L460 180 L70 300" fill="none" stroke="#b8a78e" strokeWidth="2" strokeDasharray="6 6" opacity={(1 - p * 0.92).toFixed(2)} />
      <path ref={calmRef} d="M70 300 L110 200 L150 120 L260 70 L400 80 L460 180 L440 290 L330 330 L70 300" fill="none" stroke="#ff5f36" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {stops.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 0 ? 8 : 6} fill="#fcf7eb" stroke="#ff5f36" strokeWidth="3" />)}
      <text x="84" y="326" fill="#fcf7eb" fontSize="13" fontFamily="Inter Tight, Arial, sans-serif">Depot</text>
    </svg>
  );
  const stats = (
    <div className="ck-route-stats">
      <div><b>{Math.round(212 - 74 * p)} km</b><span>{tx('driven today', 'gereden vandaag')}</span></div>
      <div><b>{(1.4 * p).toFixed(1).replace('.', window.__lang === 'nl' ? ',' : '.')} {tx('h', 'u')}</b><span>{tx('travel time won back per engineer', 'reistijd terug per monteur')}</span></div>
      <div><b>{5 + Math.round(2 * p)}</b><span>{tx('jobs per day', 'klussen per dag')}</span></div>
      <small>{tx('Example figures for one engineer, one day.', 'Voorbeeldcijfers voor één monteur, één dag.')}</small>
    </div>
  );
  if (pinned) {
    return (
      <section className="ck-route-pin" ref={ref}>
        <div className="ck-route-stick">
          <div className="container-wide ck-route-grid">{svg}{stats}</div>
        </div>
      </section>
    );
  }
  return <div className={'ck-route' + (compact ? ' ck-route--compact' : '')} ref={ref}>{svg}{!compact && stats}</div>;
}

/* ---------- FIELD SERVICE: a monteur's day (sticky phone + steps) ---------- */
function CkDayInLife({ head, steps }) {
  const ref = ckUseRef(null);
  const i = useActiveStep(ref, '.ck-day-step', 0.55);
  const [mode, setMode] = ckUseState('after');
  const s = steps[i];
  return (
    <section className="ck-section ck-section--rule" ref={ref}>
      <div className="container-wide">
        <CkHead {...head} />
        <div className="ck-day">
          <div className="ck-day-stage">
            <div className="ck-pills ck-pills--sm" role="group" aria-label={tx('Compare', 'Vergelijk')}>
              <button type="button" className={mode === 'before' ? 'on' : ''} aria-pressed={mode === 'before'} onClick={() => setMode('before')}>{tx('Without', 'Zonder')}</button>
              <button type="button" className={mode === 'after' ? 'on' : ''} aria-pressed={mode === 'after'} onClick={() => setMode('after')}>{tx('With Field Service', 'Met Field Service')}</button>
            </div>
            <div className="ck-phone"><div className="ck-screen">
              <div className="ck-screen-top"><span>{s.time}</span><span>Mark · {tx('engineer', 'monteur')}</span></div>
              <div className="ck-screen-body" key={i + mode}>
                <div className="ck-screen-title">{mode === 'after' ? tx('Everything on your phone', 'Alles op je telefoon') : tx('Paper, phone calls, searching', 'Papier, bellen, zoeken')}</div>
                {s[mode].map((c, k) => <div key={k} className={'ck-screen-card ' + (mode === 'after' ? 'good' : 'bad')}><b>{c[0]}</b>{c[1] && <span>{c[1]}</span>}</div>)}
              </div>
            </div></div>
          </div>
          <div className="ck-day-steps">
            {steps.map((st, k) => (
              <div key={k} className={'ck-day-step' + (k === i ? ' on' : '')}>
                <time>{st.time}</time>
                <h3>{st.t}</h3>
                <p>{st.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FIELD SERVICE: without / with comparison grid ---------- */
function CkCompare({ head, rows }) {
  const [after, setAfter] = ckUseState(true);
  return (
    <section className="ck-section">
      <div className="container-wide">
        <CkHead {...head} />
        <div className="ck-pills" role="group" aria-label={tx('Compare', 'Vergelijk')}>
          <button type="button" className={!after ? 'on' : ''} aria-pressed={!after} onClick={() => setAfter(false)}>{tx('Without', 'Zonder')}</button>
          <button type="button" className={after ? 'on' : ''} aria-pressed={after} onClick={() => setAfter(true)}>{tx('With Field Service', 'Met Field Service')}</button>
        </div>
        <div className="ck-compare">
          {rows.map((r, i) => (
            <div key={i} className={'ck-compare-card' + (after ? ' is-after' : '')}>
              <small>{r.topic}</small>
              <b>{after ? r.after : r.before}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- A teaser card linking to another page ---------- */
function CkTeaser({ eyebrow, title, body, href, cta }) {
  return (
    <section className="container-wide ck-section ck-section--tight">
      <a className="ck-teaser ck-rv" href={href}>
        <div><div className="eyebrow eyebrow--bare">{eyebrow}</div><h3>{title}</h3><p>{body}</p></div>
        <span className="btn ck-btn-dark">{cta} <span className="arrow">→</span></span>
      </a>
    </section>
  );
}

/* ---------- Simple strip of chips (integrations, compliance) ---------- */
function CkStrip({ label, items }) {
  return (
    <section className="container-wide ck-section ck-section--tight">
      <div className="ck-strip ck-rv"><small>{label}</small><div className="ck-chips ck-chips--lg">{items.map(x => <span key={x}>{x}</span>)}</div></div>
    </section>
  );
}

/* Shared customer stories (quotes verbatim from the 2023 customer stories booklet and the De Ridder story). */
const CK_STORIES = () => ({
  wetransfer: { name: 'WeTransfer', sector: tx('Digital products', 'Digitale producten'), who: 'Mathieu Kok', role: 'Advertising Systems Director',
    quote: 'Due to the work Intigris delivered we have taken an important step forward in automation and cleaning of data.',
    what: tx('From spreadsheets to Sales Cloud, then connected to NetSuite so orders become invoices without retyping.', 'Van spreadsheets naar Sales Cloud, daarna gekoppeld aan NetSuite zodat orders zonder overtypen facturen worden.'),
    clouds: ['Sales Cloud', 'NetSuite'] },
  evbox: { name: 'EVBox', sector: tx('EV charging', 'Laadoplossingen'), who: 'Gert-Jan Geerinck', role: tx('Representative', 'Vertegenwoordiger'),
    quote: 'We chose Intigris for their expertise in Sales and Service Cloud and their experience in system integrations, including Exact Globe.',
    what: tx('Sales Cloud and Service Cloud with an Exact Globe integration and a partner community.', 'Sales Cloud en Service Cloud met een Exact Globe-koppeling en een partnercommunity.'),
    clouds: ['Sales Cloud', 'Service Cloud', 'Exact Globe'] },
  zon365: { name: '365Zon', sector: tx('Solar panels', 'Zonnepanelen'), who: tx('The director', 'De directeur'), role: '',
    quote: 'We could never have achieved such growth without Salesforce.',
    what: tx('Field Service first, then Sales Cloud, Service Cloud and Marketing Cloud as the company scaled up.', 'Eerst Field Service, daarna Sales Cloud, Service Cloud en Marketing Cloud terwijl het bedrijf opschaalde.'),
    clouds: ['Field Service', 'Sales Cloud', 'Service Cloud', 'Marketing Cloud'] },
  opcharge: { name: 'Opcharge', sector: tx('EV charging', 'Laadoplossingen'), who: 'Jeroen Prins', role: 'Managing Operator',
    quote: 'Intigris excelled in Salesforce implementation with expertise and precise planning, earning our highest recommendation.',
    what: tx('First the sales process, then field service, both shaped around their own operational workflows.', 'Eerst het salesproces, daarna field service, allebei ingericht op hun eigen operationele workflows.'),
    clouds: ['Sales Cloud', 'Field Service'] },
  alpha: { name: 'Alpha Ventilatie', sector: tx('Ventilation', 'Ventilatie'), who: 'Shahab Rezaie', role: 'Operations Manager',
    quote: 'Continually impressed by the level of knowledge and support Intigris provided.',
    what: tx('Lead management, service and field service in one system, connected to Exact Online.', 'Leadmanagement, service en field service in één systeem, gekoppeld aan Exact Online.'),
    clouds: ['Sales Cloud', 'Service Cloud', 'Field Service', 'Exact Online'] },
  solar: { name: 'Solar Assistance', sector: tx('Solar maintenance', 'Onderhoud zonnepanelen'), who: tx('The management', 'De directie'), role: '',
    quote: 'Their knowledge, excellent communication and ability to analyse our process and implement it in Salesforce is exactly what we needed.',
    what: tx('From first customer contact to installation and maintenance planning, in one flow.', 'Van eerste klantcontact tot installatie en onderhoudsplanning, in één flow.'),
    clouds: ['Sales Cloud', 'Field Service', 'Exact Online'] },
  atag: { name: 'ATAG Warmte', sector: tx('Heating', 'Verwarming'), who: 'Sjors Stoffelsen', role: tx('Founder and CEO', 'Oprichter en CEO'),
    quote: 'Their professional expertise has made our service processes more efficient, a valuable partner for our company.',
    what: tx('Sales Cloud, Marketing Cloud and Field Service, connected to Exact Online, with extensive go-live support.', 'Sales Cloud, Marketing Cloud en Field Service, gekoppeld aan Exact Online, met uitgebreide livegang-support.'),
    clouds: ['Field Service', 'Sales Cloud', 'Exact Online'] },
  ridder: { name: 'De Ridder', sector: tx('Machinery', 'Machines'), who: tx('Customer success story', 'Klantsuccesverhaal'), role: '',
    headline: tx('How De Ridder digitises maintenance processes and increases customer satisfaction.', 'Hoe De Ridder onderhoudsprocessen digitaliseert en de klanttevredenheid verhoogt.'),
    metric: { n: '3×', d: tx('higher productivity', 'hogere productiviteit') },
    what: tx('Paper work orders replaced: automation, dashboards and checklists, connected to Exact Globe.', 'Papieren werkbonnen vervangen: automatisering, dashboards en checklists, gekoppeld aan Exact Globe.'),
    clouds: ['FieldBuddy', 'Exact Globe'] },
});

/* ---------- Styles for every block above ---------- */
function CkStyles() {
  return (
    <style>{`
      .ck-progress { position: fixed; top: 0; left: 0; height: 3px; background: var(--intigris-coral); z-index: 200; transition: width 80ms linear; }
      .ck-section { padding-top: clamp(64px, 8vw, 112px); padding-bottom: clamp(64px, 8vw, 112px); position: relative; }
      .ck-section--tight { padding-top: clamp(24px, 4vw, 48px); padding-bottom: clamp(24px, 4vw, 48px); }
      .ck-section--soft { background: var(--intigris-off-white-200); }
      .ck-section--dark { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .ck-section--coral { background: var(--intigris-coral); color: var(--intigris-dark-brown); }
      .ck-section--rule::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--intigris-coral); }
      .ck-head { display: flex; flex-direction: column; gap: 16px; margin-bottom: clamp(28px, 4vw, 44px); }
      .ck-h2 { font-size: clamp(34px, 4.6vw, 64px); font-weight: 500; letter-spacing: -.03em; line-height: 1; margin: 0; text-wrap: balance; }
      .ck-h2 span { color: var(--intigris-coral); }
      .ck-section--dark .ck-h2 { color: var(--intigris-off-white); }
      .ck-section--coral .ck-h2 { color: var(--intigris-dark-brown); } .ck-section--coral .ck-h2 span { color: var(--intigris-off-white); font-style: italic; }
      .ck-lede { margin: 0; max-width: 640px; font-size: 18px; line-height: 1.55; color: var(--fg-muted); }
      .ck-section--dark .ck-lede { color: rgba(252,247,235,.78); }
      .ck-note { margin: 12px 0 0; font-size: 12.5px; color: var(--fg-muted); }
      .eyebrow--dark { color: var(--intigris-dark-brown); } .eyebrow--dark::before { background: var(--intigris-dark-brown); }

      .ck-btn-dark { background: var(--intigris-dark-brown); color: var(--intigris-off-white); } .ck-btn-dark:hover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .ck-btn-light { background: var(--intigris-off-white); color: var(--intigris-dark-brown); align-self: flex-start; }
      .ck-btn-coral { background: var(--intigris-coral); color: var(--intigris-dark-brown); }
      .ck-actions { margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap; }

      /* hero */
      .ck-hero { position: relative; overflow: hidden; isolation: isolate; color: var(--intigris-off-white); border-bottom-left-radius: clamp(24px, 4vw, 56px); border-bottom-right-radius: clamp(24px, 4vw, 56px); }
      .ck-hero--coral { background: linear-gradient(90deg, #ff9166 0%, var(--intigris-coral) 44%, var(--intigris-coral-700) 80%, #9e300d 100%); }
      .ck-hero--dark { background: radial-gradient(110% 90% at 85% 10%, #ff7a50 0%, var(--intigris-coral-700) 28%, var(--intigris-chocolate) 62%, var(--intigris-brown-700) 100%); }
      .ck-hero-photo { position: absolute; inset: 0; z-index: -1; background: url("assets/hero-team.jpg") center right / cover; mix-blend-mode: multiply; opacity: .45; -webkit-mask-image: linear-gradient(90deg, transparent 30%, #000 72%); mask-image: linear-gradient(90deg, transparent 30%, #000 72%); }
      .ck-hero--dark .ck-hero-photo { opacity: .25; }
      .ck-hero-inner { padding-top: clamp(132px, 17vh, 200px); padding-bottom: clamp(56px, 8vh, 96px); }
      .ck-hero-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); align-items: end; }
      .ck-h1 { font-size: clamp(44px, 6vw, 88px); font-weight: 500; letter-spacing: -.035em; line-height: .96; margin: 0; text-wrap: balance; color: var(--intigris-off-white); }
      .ck-h1 span { color: var(--intigris-dark-brown); font-style: italic; }
      .ck-hero--dark .ck-h1 span { color: var(--intigris-coral); }
      .ck-hero--dark .eyebrow--dark { color: var(--intigris-coral); } .ck-hero--dark .eyebrow--dark::before { background: var(--intigris-coral); }
      .ck-hero-lede { margin: 26px 0 0; max-width: 600px; font-size: 18px; line-height: 1.55; color: rgba(252,247,235,.94); }
      .ck-glass { justify-self: end; width: 100%; max-width: 380px; background: rgba(252,247,235,.14); border: 1px solid rgba(252,247,235,.34); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 20px; padding: 26px; }
      .ck-glass-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .14em; color: var(--intigris-dark-brown); }
      .ck-hero--dark .ck-glass-eyebrow { color: var(--intigris-coral); }
      .ck-glass-price { font-size: clamp(34px, 3.4vw, 50px); font-weight: 500; letter-spacing: -.03em; line-height: 1; margin-top: 10px; white-space: nowrap; }
      .ck-glass-sub { font-size: 14px; margin-top: 8px; color: rgba(252,247,235,.9); }
      .ck-glass ul { list-style: none; margin: 18px 0 0; padding: 0; }
      .ck-glass li { padding: 12px 0; border-top: 1px solid rgba(252,247,235,.22); font-size: 15px; font-weight: 500; }
      .ck-glass li::before { content: "✓"; color: var(--intigris-dark-brown); font-weight: 700; margin-right: 10px; }
      .ck-hero--dark .ck-glass li::before { color: var(--intigris-coral); }

      /* pills */
      .ck-pills { display: inline-flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
      .ck-pills button { appearance: none; font: inherit; font-size: 14.5px; font-weight: 500; padding: 9px 16px; border-radius: 999px; border: 1px solid var(--border); background: var(--intigris-paper); color: var(--intigris-dark-brown); cursor: pointer; transition: background 200ms var(--ease-out); }
      .ck-pills button.on { background: var(--intigris-dark-brown); border-color: var(--intigris-dark-brown); color: var(--intigris-off-white); }
      .ck-pills--sm button { font-size: 13px; padding: 7px 13px; }
      .ck-section--dark .ck-pills button { background: transparent; border-color: rgba(252,247,235,.25); color: var(--intigris-off-white); }
      .ck-section--dark .ck-pills button.on { background: var(--intigris-coral); border-color: var(--intigris-coral); color: var(--intigris-dark-brown); }

      /* pains */
      .ck-pains { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; animation: ckFade 380ms var(--ease-out) both; }
      .ck-pain { background: var(--intigris-paper); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: clamp(22px, 2.6vw, 30px); display: flex; flex-direction: column; gap: 8px; }
      .ck-pain-before { font-size: 15px; color: var(--fg-muted); text-decoration: line-through; text-decoration-color: rgba(255,95,54,.6); }
      .ck-pain-arrow { color: var(--intigris-coral); font-weight: 700; }
      .ck-pain b { font-size: 24px; font-weight: 500; letter-spacing: -.02em; line-height: 1.15; }
      .ck-pain-d { font-size: 15px; line-height: 1.5; color: var(--fg-muted); }

      /* spreadsheet slider */
      .ck-ba { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid var(--border); aspect-ratio: 16 / 7.5; min-height: 300px; user-select: none; box-shadow: 0 40px 80px -60px rgba(43,23,0,.55); }
      .ck-ba-pane { position: absolute; inset: 0; padding: clamp(16px, 2vw, 26px); display: flex; flex-direction: column; gap: 12px; }
      .ck-ba-before { background: #f7f7f2; font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #333; }
      .ck-xl { display: grid; grid-template-columns: 1.4fr 1.1fr .8fr 1fr 1fr; border-top: 1px solid #ccc; border-left: 1px solid #ccc; }
      .ck-xl span { border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 6px 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: #fff; }
      .ck-xl span.h { background: #e8eee3; font-weight: 700; }
      .ck-xl span.r { color: #b0261b; }
      .ck-xl-file { margin: 0; font-size: 11.5px; color: #b0261b; }
      .ck-ba-after { background: var(--intigris-paper); clip-path: inset(0 0 0 var(--cut, 50%)); }
      .ck-kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
      .ck-kpis div { border: 1px solid var(--border); border-radius: 14px; padding: 12px 14px; background: var(--intigris-off-white); }
      .ck-kpis small { font-size: 11px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: .08em; }
      .ck-kpis b { display: block; font-size: clamp(20px, 2.2vw, 28px); font-weight: 500; letter-spacing: -.02em; }
      .ck-kpis b.warn { color: var(--intigris-coral-700); }
      .ck-pipe { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; flex: 1; }
      .ck-pipe div { border-radius: 12px; background: var(--intigris-off-white-200); padding: 10px; display: flex; flex-direction: column; gap: 7px; font-size: 12.5px; }
      .ck-pipe div b { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--fg-muted); }
      .ck-pipe i { font-style: normal; padding: 6px 8px; border-radius: 8px; background: var(--intigris-paper); border-left: 3px solid var(--intigris-coral); box-shadow: 0 2px 6px rgba(43,23,0,.06); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .ck-pipe i.won { border-left-color: var(--intigris-washed-green); }
      .ck-ba-handle { position: absolute; top: 0; bottom: 0; left: var(--cut, 50%); width: 2px; background: var(--intigris-coral); pointer-events: none; }
      .ck-ba-handle::after { content: "⟷"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: var(--intigris-coral); color: var(--intigris-dark-brown); display: grid; place-items: center; font-size: 18px; font-weight: 700; box-shadow: 0 6px 18px rgba(255,95,54,.45); }
      .ck-ba-label { position: absolute; top: 12px; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; padding: 5px 10px; border-radius: 999px; background: rgba(43,23,0,.85); color: var(--intigris-off-white); pointer-events: none; }
      .ck-ba input[type=range] { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }

      /* steps line */
      .ck-steps { list-style: none; margin: 0; padding: 0; position: relative; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px; }
      .ck-steps-line { position: absolute; left: 0; right: 0; top: 21px; height: 2px; background: var(--border); }
      .ck-steps-line i { display: block; height: 100%; width: calc(var(--p) * 100%); background: var(--intigris-coral); }
      .ck-steps li { position: relative; display: flex; flex-direction: column; gap: 8px; }
      .ck-step-dot { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 600; letter-spacing: .06em; background: var(--intigris-paper); border: 2px solid var(--border); color: var(--fg-muted); transition: all 300ms var(--ease-out); }
      .ck-steps li.lit .ck-step-dot { background: var(--intigris-coral); border-color: var(--intigris-coral); color: var(--intigris-dark-brown); }
      .ck-steps b { font-size: 18px; font-weight: 500; letter-spacing: -.015em; line-height: 1.2; margin-top: 6px; }
      .ck-steps span:not(.ck-step-dot):not(.ck-steps-line) { font-size: 14px; line-height: 1.5; color: var(--fg-muted); }

      /* stories */
      .ck-story-tabs { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 14px; scrollbar-width: thin; }
      .ck-story-tabs button { appearance: none; font: inherit; text-align: left; cursor: pointer; flex: 0 0 auto; min-width: 150px; display: flex; flex-direction: column; gap: 2px; padding: 14px 18px; border-radius: 16px; border: 1px solid rgba(252,247,235,.2); background: rgba(252,247,235,.05); color: var(--intigris-off-white); }
      .ck-story-tabs button small { font-size: 12.5px; color: rgba(252,247,235,.65); }
      .ck-story-tabs button.on { background: var(--intigris-coral); border-color: var(--intigris-coral); color: var(--intigris-dark-brown); }
      .ck-story-tabs button.on small { color: rgba(43,23,0,.75); }
      .ck-section--coral .ck-story-tabs button { border-color: rgba(64,35,1,.2); background: rgba(252,247,235,.3); color: var(--intigris-dark-brown); }
      .ck-section--coral .ck-story-tabs button small { color: rgba(64,35,1,.7); }
      .ck-section--coral .ck-story-tabs button.on { background: var(--intigris-off-white); border-color: var(--intigris-off-white); }
      .ck-story { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, .9fr); gap: clamp(24px, 4vw, 64px); padding: clamp(26px, 3.5vw, 48px); border-radius: var(--radius-xl); background: var(--intigris-off-white); color: var(--intigris-dark-brown); animation: ckFade 420ms var(--ease-out) both; }
      .ck-story blockquote { margin: 0; font-size: clamp(24px, 2.5vw, 36px); font-weight: 700; letter-spacing: -.02em; line-height: 1.2; text-wrap: balance; }
      .ck-story-headline { font-weight: 500 !important; }
      .ck-story-who { margin-top: 22px; display: flex; flex-direction: column; gap: 2px; font-size: 14.5px; color: var(--fg-muted); }
      .ck-story-who b { color: var(--intigris-dark-brown); }
      .ck-story-side { display: flex; flex-direction: column; gap: 16px; border-left: 1px solid var(--border); padding-left: clamp(0px, 3vw, 40px); }
      .ck-story-side p { margin: 0; font-size: 15.5px; line-height: 1.55; color: var(--fg-muted); }
      .ck-story-metric b { display: block; font-size: clamp(48px, 5vw, 72px); font-weight: 500; letter-spacing: -.04em; line-height: 1; color: var(--intigris-coral); }
      .ck-story-metric small { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; font-weight: 600; color: var(--fg-muted); }
      .ck-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .ck-chips span { font-size: 12.5px; font-weight: 500; padding: 5px 10px; border-radius: 999px; background: var(--intigris-off-white-200); border: 1px solid var(--border); }
      .ck-chips--lg span { font-size: 14px; padding: 8px 14px; background: var(--intigris-paper); }

      /* package */
      .ck-pkg { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: start; }
      .ck-tabs { display: flex; flex-wrap: wrap; gap: 4px 22px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
      .ck-tabs button { appearance: none; border: 0; background: none; font: inherit; font-size: 15px; font-weight: 500; padding: 10px 0; color: var(--fg-muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
      .ck-tabs button.on { color: var(--intigris-dark-brown); border-color: var(--intigris-coral); }
      .ck-tabpane { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; animation: ckFade 300ms var(--ease-out) both; }
      .ck-tabpane li { padding: 12px 14px; border-radius: 12px; background: var(--intigris-paper); border: 1px solid var(--border); font-size: 14.5px; display: flex; gap: 10px; }
      .ck-tabpane--in li::before { content: "✓"; color: var(--intigris-coral-700); font-weight: 700; }
      .ck-tabpane--out li::before { content: "—"; color: var(--fg-muted); }
      .ck-tabpane--you li::before { content: "→"; color: var(--intigris-washed-green); font-weight: 700; }
      .ck-weeks { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 28px; }
      .ck-wk { border-radius: 14px; padding: 14px; background: var(--intigris-paper); border: 1px solid var(--border); display: flex; flex-direction: column; gap: 3px; transition: background 400ms var(--ease-out), border-color 400ms var(--ease-out); }
      .ck-wk small { font-size: 11px; letter-spacing: .1em; font-weight: 600; color: var(--intigris-coral-700); text-transform: uppercase; }
      .ck-wk b { font-size: 15.5px; font-weight: 500; }
      .ck-wk span { font-size: 13px; color: var(--fg-muted); line-height: 1.4; }
      .ck-wk.lit { background: var(--intigris-coral); border-color: var(--intigris-coral); }
      .ck-wk.lit small, .ck-wk.lit span { color: var(--intigris-dark-brown); }
      .ck-glance { position: sticky; top: 96px; background: var(--intigris-brown-700); color: var(--intigris-off-white); border-radius: var(--radius-xl); padding: 26px; display: flex; flex-direction: column; gap: 16px; }
      .ck-glance-eyebrow { font-size: 11px; letter-spacing: .14em; font-weight: 600; color: var(--intigris-coral); }
      .ck-glance-price { font-size: 48px; font-weight: 500; letter-spacing: -.03em; line-height: 1; }
      .ck-glance-price small { font-size: 14px; letter-spacing: 0; color: rgba(252,247,235,.7); font-weight: 400; }
      .ck-glance dl { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 9px 14px; font-size: 14px; }
      .ck-glance dt { color: rgba(252,247,235,.62); }
      .ck-glance dd { margin: 0; text-align: right; font-weight: 500; }
      .ck-glance-foot { font-size: 12.5px; color: rgba(252,247,235,.6); }

      /* calculator */
      .ck-calc { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border); }
      .ck-calc-in { padding: clamp(24px, 3.5vw, 44px); display: flex; flex-direction: column; gap: 26px; background: var(--intigris-paper); }
      .ck-field { display: flex; flex-direction: column; gap: 10px; }
      .ck-field label { font-size: 15px; font-weight: 500; display: flex; justify-content: space-between; gap: 12px; }
      .ck-field output { color: var(--intigris-coral-700); font-variant-numeric: tabular-nums; }
      .ck-field input[type=range] { width: 100%; accent-color: var(--intigris-coral); }
      .ck-calc-out { background: var(--intigris-coral); color: var(--intigris-dark-brown); padding: clamp(24px, 3.5vw, 44px); display: flex; flex-direction: column; justify-content: center; gap: 10px; }
      .ck-calc-big { font-size: clamp(48px, 6vw, 84px); font-weight: 500; letter-spacing: -.04em; line-height: 1; font-variant-numeric: tabular-nums; }
      .ck-calc-out p { margin: 0; font-size: 16px; }
      .ck-calc-out small { font-size: 12.5px; opacity: .85; }

      /* faq */
      .ck-faq-grid { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: clamp(28px, 5vw, 72px); align-items: start; }
      .ck-faq-a { background: var(--intigris-paper); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: clamp(22px, 3vw, 34px); display: flex; flex-direction: column; gap: 10px; animation: ckFade 300ms var(--ease-out) both; }
      .ck-faq-a b { font-size: 21px; font-weight: 500; letter-spacing: -.015em; }
      .ck-faq-a p { margin: 0; font-size: 16px; line-height: 1.6; color: var(--fg-muted); }

      /* talk */
      .ck-talk-grid { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: clamp(20px, 3vw, 40px); align-items: center; }
      .ck-talk-avatar { width: 96px; height: 96px; border-radius: 50%; background: var(--intigris-coral); color: var(--intigris-dark-brown); display: grid; place-items: center; font-size: 30px; font-weight: 600; letter-spacing: -.02em; }
      .ck-talk .ck-h2 { font-size: clamp(30px, 3.6vw, 48px); }

      /* statement */
      .ck-statement { position: relative; background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .ck-statement-stick { position: sticky; top: 0; min-height: 100vh; display: flex; align-items: center; }
      .ck-statement-stick > .container-wide { width: 100%; }
      .ck-statement-line { margin: 0; font-size: clamp(44px, 7.5vw, 112px); font-weight: 500; letter-spacing: -.04em; line-height: .98; max-width: 1100px; }
      .ck-statement-line span { color: var(--intigris-coral); font-style: italic; display: inline-block; animation: ckSwap 500ms var(--ease-out) both; }
      .ck-statement-sub { margin: 26px 0 0; font-size: 19px; max-width: 560px; color: rgba(252,247,235,.78); animation: ckFade 500ms var(--ease-out) both; }
      .ck-statement-dots { display: flex; gap: 8px; margin-top: 30px; }
      .ck-statement-dots i { width: 28px; height: 4px; border-radius: 2px; background: rgba(252,247,235,.2); transition: background 300ms; }
      .ck-statement-dots i.on { background: var(--intigris-coral); }
      .ck-statement-step { height: 70vh; }

      /* route */
      .ck-route { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 24px; align-items: center; }
      .ck-route--compact { grid-template-columns: 1fr; }
      .ck-route-svg { width: 100%; height: auto; display: block; border-radius: 20px; }
      .ck-route-stats { display: flex; flex-direction: column; gap: 14px; }
      .ck-route-stats div { border-top: 1px solid rgba(252,247,235,.22); padding-top: 12px; }
      .ck-route-stats b { font-size: clamp(34px, 4vw, 52px); font-weight: 500; letter-spacing: -.03em; color: var(--intigris-coral); font-variant-numeric: tabular-nums; }
      .ck-route-stats span { display: block; font-size: 14.5px; color: rgba(252,247,235,.78); }
      .ck-route-stats small { font-size: 12px; color: rgba(252,247,235,.55); }
      .ck-route-pin { position: relative; background: var(--intigris-brown-700); color: var(--intigris-off-white); height: 220vh; }
      .ck-route-stick { position: sticky; top: 0; min-height: 100vh; display: flex; align-items: center; padding-block: 90px 40px; }
      .ck-route-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: center; width: 100%; }

      /* day in the life */
      .ck-day { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: clamp(24px, 4vw, 64px); }
      .ck-day-stage { position: sticky; top: 100px; align-self: start; display: flex; flex-direction: column; gap: 14px; }
      .ck-phone { width: 100%; max-width: 340px; aspect-ratio: 9 / 15.5; border-radius: 36px; background: var(--intigris-brown-700); padding: 12px; box-shadow: 0 40px 70px -40px rgba(43,23,0,.65); }
      .ck-screen { width: 100%; height: 100%; border-radius: 26px; background: var(--intigris-paper); overflow: hidden; display: flex; flex-direction: column; }
      .ck-screen-top { padding: 16px 18px 12px; background: var(--intigris-coral); color: var(--intigris-brown-700); display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
      .ck-screen-body { flex: 1; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; animation: ckFade 320ms var(--ease-out) both; }
      .ck-screen-title { font-size: 21px; font-weight: 500; letter-spacing: -.02em; line-height: 1.1; }
      .ck-screen-card { border: 1px solid var(--border); border-radius: 14px; padding: 11px 13px; font-size: 13px; display: flex; flex-direction: column; gap: 3px; }
      .ck-screen-card b { font-size: 14px; font-weight: 600; }
      .ck-screen-card.bad { background: #fbe9e3; border-color: var(--intigris-coral-100); }
      .ck-screen-card.good { background: #eef3ea; border-color: #c9d7c0; }
      .ck-day-steps { display: flex; flex-direction: column; gap: 38vh; padding-block: 4vh 34vh; }
      .ck-day-step { border-left: 2px solid var(--border); padding: 6px 0 6px 22px; opacity: .45; transition: opacity 300ms, border-color 300ms; }
      .ck-day-step.on { opacity: 1; border-color: var(--intigris-coral); }
      .ck-day-step time { font-size: 13px; font-weight: 600; letter-spacing: .1em; color: var(--intigris-coral-700); font-variant-numeric: tabular-nums; }
      .ck-day-step h3 { font-size: clamp(22px, 2.4vw, 30px); font-weight: 500; letter-spacing: -.02em; line-height: 1.1; margin: 8px 0; }
      .ck-day-step p { margin: 0; font-size: 16px; line-height: 1.55; color: var(--fg-muted); max-width: 480px; }

      /* compare */
      .ck-compare { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
      .ck-compare-card { border-radius: var(--radius-xl); padding: 22px; background: #fbe9e3; border: 1px solid var(--intigris-coral-100); display: flex; flex-direction: column; gap: 8px; min-height: 140px; transition: background 400ms var(--ease-out), border-color 400ms var(--ease-out); }
      .ck-compare-card.is-after { background: #eef3ea; border-color: #c9d7c0; }
      .ck-compare-card small { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; color: var(--fg-muted); }
      .ck-compare-card b { font-size: 20px; font-weight: 500; letter-spacing: -.015em; line-height: 1.25; }

      /* teaser + strip */
      .ck-teaser { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; padding: clamp(24px, 3.5vw, 40px); border-radius: var(--radius-xl); background: var(--intigris-paper); border: 1px solid var(--border); color: var(--intigris-dark-brown); text-decoration: none; transition: border-color 200ms, transform 200ms; }
      .ck-teaser:hover { border-color: var(--intigris-coral); transform: translateY(-2px); }
      .ck-teaser h3 { font-size: clamp(24px, 2.8vw, 36px); font-weight: 500; letter-spacing: -.02em; margin: 8px 0; }
      .ck-teaser p { margin: 0; max-width: 620px; color: var(--fg-muted); }
      .ck-strip { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
      .ck-strip small { font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--fg-muted); }

      /* motion */
      .ck-rv { transition: transform 700ms cubic-bezier(.2,.7,.2,1), opacity 700ms; }
      .ck-rv.ck-pre { transform: translateY(26px); opacity: .001; }
      @keyframes ckFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      @keyframes ckSwap { from { opacity: 0; transform: translateY(.3em); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) {
        .ck-rv, .ck-rv.ck-pre { transition: none; transform: none; opacity: 1; }
        .ck-pains, .ck-story, .ck-screen-body, .ck-statement-line span, .ck-statement-sub, .ck-tabpane, .ck-faq-a { animation: none; }
      }

      /* responsive */
      @media (max-width: 1100px) { .ck-steps { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 28px; } .ck-steps-line { display: none; } }
      @media (max-width: 980px) {
        .ck-hero-grid, .ck-pkg, .ck-calc, .ck-faq-grid, .ck-story, .ck-route, .ck-route-grid, .ck-day { grid-template-columns: 1fr; }
        .ck-hero-grid { align-items: start; } .ck-glass { justify-self: start; }
        .ck-pains, .ck-compare { grid-template-columns: 1fr; }
        .ck-story-side { border-left: 0; padding-left: 0; border-top: 1px solid var(--border); padding-top: 18px; }
        .ck-glance { position: static; }
        .ck-talk-grid { grid-template-columns: 1fr; }
        .ck-day-stage { top: 64px; z-index: 2; flex-direction: row; align-items: flex-start; background: var(--intigris-off-white); padding-bottom: 8px; }
        .ck-phone { max-width: 160px; border-radius: 24px; padding: 7px; }
        .ck-screen { border-radius: 18px; } .ck-screen-title { font-size: 14px; } .ck-screen-card { font-size: 11px; padding: 7px 8px; } .ck-screen-card b { font-size: 11.5px; }
        .ck-day-steps { gap: 26vh; }
        .ck-route-pin { height: auto; } .ck-route-stick { position: static; min-height: 0; padding-block: 64px; }
      }
      @media (max-width: 640px) {
        .ck-steps { grid-template-columns: 1fr; }
        .ck-tabpane, .ck-weeks, .ck-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .ck-tabpane { grid-template-columns: 1fr; }
        .ck-pipe { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .ck-ba { aspect-ratio: auto; height: 460px; }
      }
    `}</style>
  );
}

Object.assign(window, {
  useReveal, CkProgress, CkHead, CkHero, CkSwitchPains, CkSpreadsheetSlider, CkStepsLine, CkStories,
  CkPackage, CkCalculator, CkFaqTabs, CkTalk, CkStatement, CkRoute, CkDayInLife, CkCompare, CkTeaser, CkStrip,
  CK_STORIES, CkStyles,
});
