/* ==================================================================== */
/*  CLOUD KIT v3 — blocks for the cloud service pages (round 3).         */
/*  Builds on CloudKit.jsx (stories, FAQ, talk, steps, route, styles).   */
/*  Scroll effects use GSAP + ScrollTrigger (window.gsap) when loaded;   */
/*  without it, or with reduced motion, every block shows its final      */
/*  state. Exposes the blocks on window (see the bottom).                */
/* ==================================================================== */

const { useState: v3State, useEffect: v3Effect, useRef: v3Ref } = React;
const V3_REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

/* Run a GSAP setup function scoped to a ref; reverted on unmount. */
function useGsap(ref, setup, deps = []) {
  v3Effect(() => {
    if (!window.gsap || V3_REDUCE || !ref.current) return;
    const ctx = window.gsap.context(() => setup(window.gsap, ref.current), ref.current);
    return () => ctx.revert();
  }, deps);
}

/* ---------- SALES HERO: loose notes, mails and tabs snap into one customer record ---------- */
function V3ChaosHero({ eyebrow, a, b, lede, onCta, secondary, chaos, record }) {
  const ref = v3Ref(null);
  useGsap(ref, (gsap, root) => {
    const items = root.querySelectorAll('.v3-chaos-item');
    const card = root.querySelector('.v3-record');
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: '+=110%', scrub: 0.6, pin: root.querySelector('.v3-chaos-pin') } });
    tl.from(card, { opacity: 0, scale: 0.92, duration: 0.6 }, 0.35);
    items.forEach((el, i) => {
      tl.to(el, { x: () => (card.offsetLeft + card.offsetWidth / 2) - (el.offsetLeft + el.offsetWidth / 2), y: () => (card.offsetTop + 120 + i * 6) - (el.offsetTop + el.offsetHeight / 2), rotate: 0, scale: 0.35, opacity: 0, duration: 0.55, ease: 'power2.in' }, i * 0.06);
    });
    tl.from(root.querySelectorAll('.v3-record-row'), { opacity: 0, y: 10, stagger: 0.08, duration: 0.25 }, 0.7);
  });
  return (
    <section className="v3-chaos" ref={ref}>
      <div className="v3-chaos-pin">
        <div className="container-wide v3-chaos-grid">
          <div className="v3-chaos-copy">
            <div className="eyebrow eyebrow--dark" style={{ marginBottom: 22 }}>{eyebrow}</div>
            <h1 className="ck-h1">{a} <span>{b}</span></h1>
            <p className="ck-hero-lede">{lede}</p>
            <div className="ck-actions">
              <button className="btn ck-btn-dark" onClick={onCta}>{tx('Book a 30-min call', 'Plan een gesprek van 30 min')} <span className="arrow">→</span></button>
              {secondary && <a className="btn btn-outline-light" href={secondary.href}>{secondary.label} <span className="arrow">↓</span></a>}
            </div>
            <p className="v3-scroll-hint" aria-hidden>{tx('Scroll: watch the chaos land in one place', 'Scroll: zie de chaos op één plek landen')} ↓</p>
          </div>
          <div className="v3-chaos-stage">
            {chaos.map((c, i) => (
              <div key={i} className={'v3-chaos-item v3-chaos-item--' + c.kind} style={{ left: c.x + '%', top: c.y + '%', transform: 'rotate(' + c.r + 'deg)' }}>
                <small>{c.label}</small><b>{c.text}</b>
              </div>
            ))}
            <div className="v3-record">
              <div className="v3-record-head"><span className="v3-record-icon">{record.initial}</span><div><small>{tx('Account', 'Account')}</small><b>{record.name}</b></div><span className="v3-record-stage">{record.stage}</span></div>
              {record.rows.map((r, i) => <div key={i} className="v3-record-row"><small>{r[0]}</small><span>{r[1]}</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- WHAT IT IS: benefits card + photo (from the current Sales Cloud page) ---------- */
function V3WhatItIs({ head, label, benefits, image }) {
  return (
    <section className="container-wide ck-section">
      <CkHead {...head} />
      <div className="v3-what">
        <div className="v3-what-card ck-rv">
          <div className="v3-what-label">{label}</div>
          <ul>{benefits.map((b, i) => <li key={i}><span className="v3-check" aria-hidden>✓</span><div><b>{b.t}</b><span>{b.d}</span></div></li>)}</ul>
        </div>
        <div className="v3-what-photo ck-rv"><img src={image} alt="" loading="lazy" /><span aria-hidden /></div>
      </div>
    </section>
  );
}

/* ---------- COMPACT WORD SWAP: half-height sticky line ---------- */
function V3Statement({ lead, words }) {
  const ref = v3Ref(null);
  const [i, setI] = v3State(0);
  /* Scroll lock: when the band reaches the middle of the screen the whole page holds
     still. Each scroll gesture (wheel/trackpad swipe, touch swipe, arrow/space key)
     switches one word; after the last word the page scrolls on, with the next section
     right below. Coming back up works the same way in reverse. One gesture = one step,
     so trackpad momentum doesn't race through the words. */
  v3Effect(() => {
    if (V3_REDUCE) return;
    const el = ref.current; if (!el) return;
    const last = words.length - 1;
    let locked = false, armed = true, idx = 0, prevMid = null, lastWheel = 0, lastStep = 0, used = true, acc = 0, ty = null;
    const mid = () => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; };
    const lock = dir => {
      locked = true; used = true; acc = 0; lastStep = performance.now();
      window.scrollTo(0, window.scrollY + mid() - window.innerHeight / 2);
      idx = dir > 0 ? 0 : last; setI(idx);
    };
    const step = d => {
      const n = idx + d;
      if (n > last || n < 0) { locked = false; armed = false; prevMid = mid(); return false; }
      idx = n; setI(idx); return true;
    };
    const onScroll = () => {
      const m = mid(), c = window.innerHeight / 2;
      /* after a release, only re-arm once the band has moved well away from the middle */
      if (!armed && Math.abs(m - c) > window.innerHeight * 0.25) armed = true;
      /* moved by something else while locked (scrollbar drag, anchor link): let go */
      if (locked && Math.abs(m - c) > 40) { locked = false; armed = false; }
      /* only catch normal scrolling, not big jumps (anchor links, scrollbar jumps) */
      const jump = prevMid !== null && Math.abs(m - prevMid) > window.innerHeight * 0.75;
      if (!locked && armed && !jump && prevMid !== null) {
        if (prevMid > c && m <= c) lock(1);
        else if (prevMid < c && m >= c) lock(-1);
      }
      prevMid = locked ? c : m;
    };
    const onWheel = e => {
      /* Track gestures even while unlocked: the scroll that brings the band to the
         middle must not count as a new gesture once the page locks. */
      const now = performance.now();
      const fresh = now - lastWheel > 160;
      lastWheel = now;
      if (!locked) return;
      e.preventDefault();
      if (fresh) { used = false; acc = 0; }
      acc += e.deltaY;
      /* one step per gesture; someone who keeps spinning without pausing still
         advances, but at most one word per 900ms */
      if (!used && Math.abs(acc) > 30) { used = true; lastStep = now; acc = 0; step(e.deltaY > 0 ? 1 : -1); }
      else if (used && now - lastStep > 900 && Math.abs(acc) > 240) { lastStep = now; acc = 0; step(e.deltaY > 0 ? 1 : -1); }
    };
    const onTouchStart = e => { ty = e.touches[0].clientY; };
    const onTouchMove = e => {
      if (!locked || ty === null) return;
      e.preventDefault();
      const dy = ty - e.touches[0].clientY;
      if (Math.abs(dy) > 50) { ty = null; step(dy > 0 ? 1 : -1); }
    };
    const onKey = e => {
      if (!locked) return;
      const down = ['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key), up = ['ArrowUp', 'PageUp'].includes(e.key);
      if (!down && !up) return;
      e.preventDefault(); step(down ? 1 : -1);
    };
    prevMid = mid();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll); window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [words.length]);
  v3Effect(() => {
    if (!V3_REDUCE) return;
    let raf = 0;
    /* Fallback without GSAP / reduced motion: no pin, the word flips as the band
       travels from the lower to the upper part of the screen. */
    const on = () => {
      raf = 0; const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      const p = Math.max(0, Math.min(0.999, (window.innerHeight * 0.82 - mid) / (window.innerHeight * 0.6)));
      setI(Math.floor(p * words.length));
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(on); };
    on(); window.addEventListener('scroll', tick, { passive: true });
    return () => { window.removeEventListener('scroll', tick); cancelAnimationFrame(raf); };
  }, []);
  /* Fit: one font size for all words, chosen so the longest "lead + word" stays on
     one line in the left column (max 96px). Re-measured on resize and font load. */
  const lineRef = v3Ref(null), measureRef = v3Ref(null);
  const [size, setSize] = v3State(null);
  v3Effect(() => {
    const fit = () => {
      const cell = lineRef.current, m = measureRef.current; if (!cell || !m) return;
      const widest = Math.max(...Array.from(m.children).map(c => c.getBoundingClientRect().width));
      if (!widest) return;
      setSize(Math.max(22, Math.min(96, Math.floor(100 * cell.clientWidth / widest * 0.98))));
    };
    fit();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(lineRef.current); else window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    return () => { if (ro) ro.disconnect(); else window.removeEventListener('resize', fit); };
  }, [words]);
  return (
    <section className="v3-statement" ref={ref}>
      <div className="v3-statement-measure" ref={measureRef} aria-hidden>
        {words.map((x, k) => <span key={k} className="v3-statement-line">{lead} <i>{x.w}</i></span>)}
      </div>
      <div className="container-wide v3-statement-inner">
        <p className="v3-statement-line" ref={lineRef} style={size ? { fontSize: size + 'px' } : null}>
          <span className="v3-statement-lead">{lead}</span>{' '}
          <span className="v3-statement-word" aria-live="polite"><span key={i}>{words[i].w}</span></span>
        </p>
        <div className="v3-statement-side">
          <p className="v3-statement-sub" key={'s' + i}>{words[i].d}</p>
          <div className="ck-statement-dots" aria-hidden>{words.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PROBLEM CARDS that flip to the solution as they scroll in ---------- */
function V3FlipProblems({ head, items }) {
  const ref = v3Ref(null);
  const [flipped, setFlipped] = v3State(() => items.map(() => V3_REDUCE));
  useGsap(ref, (gsap, root) => {
    root.querySelectorAll('.v3-flip').forEach((el, i) => {
      window.ScrollTrigger.create({ trigger: el, start: 'top 62%', onEnter: () => setFlipped(f => f.map((v, k) => k === i ? true : v)), onLeaveBack: () => setFlipped(f => f.map((v, k) => k === i ? false : v)) });
    });
  });
  return (
    <section className="ck-section ck-section--dark" ref={ref}>
      <div className="container-wide">
        <CkHead {...head} />
        <div className="v3-flips">
          {items.map((it, i) => (
            <button key={i} type="button" className={'v3-flip' + (flipped[i] ? ' is-on' : '')} onClick={() => setFlipped(f => f.map((v, k) => k === i ? !v : v))} aria-pressed={flipped[i]}>
              <span className="v3-flip-inner">
                <span className="v3-flip-face v3-flip-front"><small>{tx('THE PROBLEM', 'HET PROBLEEM')}</small><b>{it.pain}</b><i>{tx('Scroll or tap', 'Scroll of tik')} ↻</i></span>
                <span className="v3-flip-face v3-flip-back"><small>{tx('WITH FIELD SERVICE', 'MET FIELD SERVICE')}</small><b>{it.gain}</b><span>{it.d}</span></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FIELD SERVICE HERO: what it is + the route that untangles ---------- */
function V3RouteHero({ eyebrow, a, b, lede, onCta, secondary }) {
  return (
    <section className="ck-hero ck-hero--dark v3-route-hero">
      <div className="container-wide ck-hero-inner">
        <div className="v3-route-hero-grid">
          <div>
            <div className="eyebrow eyebrow--dark" style={{ marginBottom: 22 }}>{eyebrow}</div>
            <h1 className="ck-h1">{a} <span>{b}</span></h1>
            <p className="ck-hero-lede">{lede}</p>
            <div className="ck-actions">
              <button className="btn ck-btn-coral" onClick={onCta}>{tx('Book a 30-min call', 'Plan een gesprek van 30 min')} <span className="arrow">→</span></button>
              {secondary && <a className="btn btn-outline-light" href={secondary.href}>{secondary.label} <span className="arrow">↓</span></a>}
            </div>
          </div>
          <CkRoute />
        </div>
      </div>
    </section>
  );
}

/* ---------- COMPACT ENGINEER'S DAY: a clickable timeline + phone, auto-advancing ---------- */
function V3DayCompact({ head, steps }) {
  const [i, setI] = v3State(0);
  const [mode, setMode] = v3State('after');
  const [paused, setPaused] = v3State(false);
  v3Effect(() => { if (paused || V3_REDUCE) return; const t = setInterval(() => setI(x => (x + 1) % steps.length), 4200); return () => clearInterval(t); }, [paused]);
  const s = steps[i];
  return (
    <section className="ck-section ck-section--soft">
      <div className="container-wide">
        <CkHead {...head} />
        <div className="v3-day" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="v3-day-main">
            <div className="ck-pills ck-pills--sm" role="group" aria-label={tx('Compare', 'Vergelijk')}>
              <button type="button" className={mode === 'before' ? 'on' : ''} aria-pressed={mode === 'before'} onClick={() => setMode('before')}>{tx('Without', 'Zonder')}</button>
              <button type="button" className={mode === 'after' ? 'on' : ''} aria-pressed={mode === 'after'} onClick={() => setMode('after')}>{tx('With Field Service', 'Met Field Service')}</button>
            </div>
            <ol className="v3-day-line">
              {steps.map((st, k) => (
                <li key={k}><button type="button" className={k === i ? 'on' : (k < i ? 'done' : '')} onClick={() => { setI(k); setPaused(true); }}>
                  <time>{st.time}</time><span>{st.t}</span>
                  {k === i && !paused && !V3_REDUCE && <i className="v3-day-bar" key={'b' + i} />}
                </button></li>
              ))}
            </ol>
            <div className="v3-day-text" key={'t' + i}><h3>{s.t}</h3><p>{s.d}</p></div>
          </div>
          <div className="ck-phone v3-day-phone"><div className="ck-screen">
            <div className="ck-screen-top"><span>{s.time}</span><span>Mark · {tx('engineer', 'monteur')}</span></div>
            <div className="ck-screen-body" key={i + mode}>
              <div className="ck-screen-title">{mode === 'after' ? tx('Everything on your phone', 'Alles op je telefoon') : tx('Paper, phone calls, searching', 'Papier, bellen, zoeken')}</div>
              {s[mode].map((c, k) => <div key={k} className={'ck-screen-card ' + (mode === 'after' ? 'good' : 'bad')}><b>{c[0]}</b>{c[1] && <span>{c[1]}</span>}</div>)}
            </div>
          </div></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- INTEGRATIONS: what a full implementation connects ---------- */
function V3Integrations({ head, items }) {
  return (
    <section className="ck-section ck-section--rule">
      <div className="container-wide">
        <CkHead {...head} />
        <div className="v3-integrations">
          {items.map((it, i) => (
            <div key={i} className="v3-int ck-rv"><b>{it.n}</b><small>{it.k}</small><span>{it.d}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- TWO WAYS TO START: Quickstart (fixed) vs full implementation (+ optional third) ---------- */
function V3WaysToStart({ head, quick, full, extra, onCta }) {
  return (
    <section id="start" className="ck-section">
      <div className="container-wide">
        <CkHead {...head} />
        <div className={'v3-ways' + (extra ? ' v3-ways--3' : '')}>
          <article className="v3-way v3-way--quick ck-rv">
            <div className="v3-way-top"><span className="eyebrow eyebrow--bare">{quick.eyebrow}</span><span className="v3-badge">{tx('Fixed price', 'Vaste prijs')}</span></div>
            <h3>{quick.title}</h3>
            <div className="v3-way-price">{quick.price}<small>{quick.priceNote}</small></div>
            <p>{quick.d}</p>
            <ul>{quick.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
            <button className="btn ck-btn-dark" onClick={onCta}>{quick.cta} <span className="arrow">→</span></button>
          </article>
          <article className="v3-way ck-rv">
            <div className="v3-way-top"><span className="eyebrow eyebrow--bare">{full.eyebrow}</span><span className="v3-badge v3-badge--soft">{tx('Scoped with you', 'Samen gescoped')}</span></div>
            <h3>{full.title}</h3>
            <p>{full.d}</p>
            <ul>{full.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
            <button className="btn btn-secondary" onClick={onCta}>{full.cta} <span className="arrow">→</span></button>
          </article>
          {extra && (
            <a className="v3-way v3-way--extra ck-rv" href={extra.href}>
              <div className="v3-way-top"><span className="eyebrow eyebrow--bare">{extra.eyebrow}</span></div>
              <h3>{extra.title}</h3>
              <p>{extra.d}</p>
              <span className="link-arrow">{extra.cta} <span className="arrow">→</span></span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- CALCULATOR with visible assumptions (low / likely range) ---------- */
function V3Calculator({ head, inputs, compute, note }) {
  const [vals, setVals] = v3State(() => Object.fromEntries(inputs.map(x => [x.id, x.v])));
  const out = compute(vals);
  const fmt = (x) => Math.round(x).toLocaleString(window.__lang === 'nl' ? 'nl-NL' : 'en-GB');
  return (
    <section id="calculator" className="ck-section ck-section--rule">
      <div className="container-wide">
        <CkHead {...head} />
        <div className="ck-calc">
          <div className="ck-calc-in">
            {inputs.map(x => (
              <div key={x.id} className="ck-field">
                <label htmlFor={'v3-' + x.id}>{x.label} <output>{x.fmt ? x.fmt(vals[x.id]) : vals[x.id]}</output></label>
                <input id={'v3-' + x.id} type="range" min={x.min} max={x.max} step={x.step || 1} value={vals[x.id]} onChange={e => setVals(v => ({ ...v, [x.id]: +e.target.value }))} />
                {x.hint && <small className="v3-hint">{x.hint}</small>}
              </div>
            ))}
          </div>
          <div className="ck-calc-out">
            <small>{out.label}</small>
            <div className="ck-calc-big">€ {fmt(out.euro)}</div>
            <p>{out.line(fmt)}</p>
            <small>{note}</small>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CONNECT HUB: the cloud in the middle, lines to every tool ---------- */
/* Lines draw in when the section scrolls into view (GSAP), pulses travel along them,
   and the highlight moves from tool to tool; hover or click picks one. On phones the
   hub is replaced by the plain integration tiles. */
function V3ConnectHub({ head, center, items }) {
  const ref = v3Ref(null);
  const [active, setActive] = v3State(0);
  const [paused, setPaused] = v3State(false);
  v3Effect(() => { if (paused || V3_REDUCE) return; const t = setInterval(() => setActive(a => (a + 1) % items.length), 2600); return () => clearInterval(t); }, [paused, items.length]);
  /* Draw once the hub is on screen; pulses start after the lines are drawn. */
  const [drawn, setDrawn] = v3State(V3_REDUCE || !('IntersectionObserver' in window));
  const [live, setLive] = v3State(false);
  v3Effect(() => {
    if (drawn) { const t = setTimeout(() => setLive(true), 1400); return () => clearTimeout(t); }
    const el = ref.current && ref.current.querySelector('.v3-hub'); if (!el) return;
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setDrawn(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [drawn]);
  const W = 1000, H = 560, cx = 500, cy = 280, rx = 400, ry = 215;
  const pts = items.map((_, i) => { const a = (-90 + (360 / items.length) * i) * Math.PI / 180; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
  const curve = ([x, y]) => { const mx = (cx + x) / 2, my = (cy + y) / 2; const bend = (x - cx) * 0.12; return 'M' + cx + ' ' + cy + ' Q' + (mx - bend * 0.3) + ' ' + (my + bend) + ' ' + x + ' ' + y; };
  const a = items[active];
  return (
    <section className="ck-section ck-section--dark" ref={ref}>
      <div className="container-wide">
        <CkHead {...head} />
        <div className={'v3-hub' + (drawn ? ' is-drawn' : '')} onMouseLeave={() => setPaused(false)}>
          <svg viewBox={'0 0 ' + W + ' ' + H} className="v3-hub-svg" aria-hidden>
            {pts.map((p, i) => <path key={'l' + i} id={'v3hub-' + i} d={curve(p)} pathLength="1" style={{ transitionDelay: (i * 90) + 'ms' }} className={'v3-hub-line' + (i === active ? ' on' : '')} fill="none" />)}
            {live && !V3_REDUCE && pts.map((p, i) => (
              <circle key={'d' + i} r={i === active ? 6 : 4} className={'v3-hub-pulse' + (i === active ? ' on' : '')}>
                <animateMotion dur={(2.4 + (i % 3) * 0.5) + 's'} repeatCount="indefinite" begin={(i * 0.35) + 's'} keyPoints={i % 2 ? '0;1' : '1;0'} keyTimes="0;1" calcMode="linear"><mpath href={'#v3hub-' + i} /></animateMotion>
              </circle>
            ))}
            <g className="v3-hub-center">
              {[[-62, 18, 40], [-22, -16, 54], [38, -6, 50], [78, 22, 34], [10, 24, 44], [-92, 34, 26]].map(([dx, dy, r], k) => <circle key={k} cx={cx + dx} cy={cy + dy} r={r} />)}
              <rect x={cx - 104} y={cy + 20} width={208} height={40} rx={20} />
              <text x={cx} y={cy + 8} textAnchor="middle">{center}</text>
            </g>
          </svg>
          {items.map((it, i) => (
            <button key={i} type="button" className={'v3-hub-node' + (i === active ? ' on' : '')} style={{ left: (pts[i][0] / W * 100) + '%', top: (pts[i][1] / H * 100) + '%', transitionDelay: drawn && !live ? (300 + i * 90) + 'ms' : '0ms' }}
              onMouseEnter={() => { setActive(i); setPaused(true); }} onFocus={() => { setActive(i); setPaused(true); }} onClick={() => { setActive(i); setPaused(true); }} aria-pressed={i === active}>
              <b>{it.n}</b><small>{it.k}</small>
            </button>
          ))}
        </div>
        <div className="v3-hub-caption" key={active} aria-live="polite"><small>{a.k}</small><b>{a.n}</b><span>{a.d}</span></div>
        <div className="v3-hub-fallback">
          {items.map((it, i) => <div key={i} className="v3-int"><b>{it.n}</b><small>{it.k}</small><span>{it.d}</span></div>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- LOGO HUB (chosen variation A, round 4) ----------
   The Salesforce logo sits in the middle. As you scroll, every tool glides in from
   further out along its own spoke, lands in its slot, and its line connects to the
   logo (GSAP pin + scrub). Tool tiles show the real logos; tools without a brand
   logo show their name. Phones get a simple logo grid, reduced motion the end state. */
const LH_DIR = 'assets/logos/tools/';
const LH_LOGOS = {
  'Exact Online / Globe': { src: ['exact.svg'] },
  'AFAS': { src: ['afas.png'] },
  'Business Central': { src: ['business-central.svg'], text: true },
  'NetSuite': { src: ['netsuite.png'] },
  'Outlook & Gmail': { src: ['outlook.svg', 'gmail.svg'] },
  'PDF Butler': { src: ['pdf-butler.svg'], tall: true },
  'DocuSign': { src: ['docusign.svg'] },
  /* No downloadable Twinfield logo: Wolters Kluwer mark + product name. */
  'Twinfield': { src: ['twinfield-wolters-kluwer.svg'], text: true },
};

function LhTile({ it }) {
  const L = LH_LOGOS[it.n];
  if (!L) return <span className="lh-tile-text">{it.n}</span>;
  return (
    <span className={'lh-tile-logos' + (L.sf ? ' is-sf' : '') + (L.tall ? ' is-tall' : '')}>
      {L.src.map((s, k) => <img key={k} src={LH_DIR + s} alt={L.text ? '' : it.n} />)}
      {L.text && <span className="lh-tile-text">{it.n}</span>}
    </span>
  );
}

function V3LogoHub({ head, center, items }) {
  const ref = v3Ref(null);
  const [active, setActive] = v3State(0);
  const [paused, setPaused] = v3State(false);
  const [landed, setLanded] = v3State(V3_REDUCE || !window.gsap);
  /* Once everything has landed, the highlight walks from tool to tool. */
  v3Effect(() => { if (!landed || paused || V3_REDUCE) return; const t = setInterval(() => setActive(a => (a + 1) % items.length), 2600); return () => clearInterval(t); }, [landed, paused, items.length]);
  const n = items.length, W = 1000, H = 820;
  const pts = items.map((_, i) => { const a = (-90 + (360 / n) * i) * Math.PI / 180; return [50 + 37 * Math.cos(a), 50 + 41 * Math.sin(a)]; });
  v3Effect(() => {
    if (!window.gsap || V3_REDUCE) return;
    const gsap = window.gsap;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1000px)', () => {
      const root = ref.current;
      const stage = root.querySelector('.lh-stage');
      const nodes = root.querySelectorAll('.lh-node');
      const lines = root.querySelectorAll('.lh-line');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector('.lh-grid'), start: 'center center', end: '+=110%', scrub: 0.8, pin: true,
        onUpdate: st => setLanded(st.progress > 0.92) } });
      tl.fromTo(root.querySelector('.lh-center'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, 0);
      nodes.forEach((el, i) => {
        /* Start further out along the node's own spoke: straight outside-in. */
        const dx = () => (pts[i][0] - 50) / 100 * stage.offsetWidth * 1.15;
        const dy = () => (pts[i][1] - 50) / 100 * stage.offsetHeight * 1.15;
        const t0 = 0.15 + i * 0.07;
        tl.fromTo(el, { x: dx, y: dy, opacity: 0, scale: 0.85 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, t0)
          .fromTo(lines[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: 'none' }, t0 + 0.7);
      });
      tl.to({}, { duration: 0.25 });
      return () => setLanded(true);
    });
    return () => mm.revert();
  }, []);
  const a = items[active];
  const pick = i => () => { setActive(i); setPaused(true); };
  return (
    <section className="ck-section ck-section--dark lh" ref={ref}>
      <div className="container-wide">
        <div className="lh-grid">
          <div className="lh-text">
            <CkHead {...head} />
            <div className="lh-caption" key={active} aria-live="polite"><small>{a.k}</small><b>{a.n}</b><span>{a.d}</span></div>
          </div>
          <div className="lh-stage" onMouseLeave={() => setPaused(false)}>
            <svg className="lh-lines" viewBox={'0 0 ' + W + ' ' + H} aria-hidden>
              {pts.map(([x, y], i) => <line key={i} x1={W / 2} y1={H / 2} x2={x / 100 * W} y2={y / 100 * H} pathLength="1" className={'lh-line' + (i === active ? ' on' : '')} />)}
            </svg>
            <div className="lh-center">
              <img src={LH_DIR + 'salesforce.svg'} alt="Salesforce" />
              {center && <span>{center}</span>}
            </div>
            {items.map((it, i) => (
              <button key={i} type="button" className={'lh-node' + (i === active ? ' on' : '')} style={{ left: pts[i][0] + '%', top: pts[i][1] + '%' }}
                onMouseEnter={pick(i)} onFocus={pick(i)} onClick={pick(i)} aria-pressed={i === active} aria-label={it.n}>
                <LhTile it={it} />
              </button>
            ))}
          </div>
        </div>
        <div className="lh-fallback">
          {items.map((it, i) => <div key={i} className="lh-fb"><span className="lh-fb-logo"><LhTile it={it} /></span><small>{it.k}</small><span className="lh-fb-d">{it.d}</span></div>)}
        </div>
      </div>
      <style>{`
        .lh { overflow-x: clip; }
        .lh-grid { display: grid; grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); gap: clamp(24px, 4vw, 64px); align-items: center; }
        .lh-text .ck-head { margin-bottom: 28px; }
        .lh-stage { position: relative; width: 100%; max-width: min(760px, calc((100vh - 140px) * 1.2195)); margin: 0 auto; aspect-ratio: 1000 / 820; }
        .lh-lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .lh-line { stroke: rgba(252,247,235,.28); stroke-width: 2; stroke-dasharray: 1 1; stroke-dashoffset: 0; transition: stroke 300ms, stroke-width 300ms; }
        .lh-line.on { stroke: var(--intigris-coral); stroke-width: 4; }
        .lh-center { position: absolute; left: 50%; top: 50%; translate: -50% -50%; display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 2; }
        .lh-center::before { content: ''; position: absolute; left: 50%; top: 42%; width: 150%; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; background: radial-gradient(closest-side, rgba(0,161,224,.28), rgba(0,161,224,0)); z-index: -1; }
        .lh-center img { width: clamp(120px, 12vw, 172px); height: auto; filter: drop-shadow(0 18px 30px rgba(0,0,0,.4)); }
        .lh-center span { font-size: 14px; font-weight: 500; letter-spacing: .02em; padding: 6px 14px; border-radius: 999px; background: #3a2108; border: 1px solid rgba(252,247,235,.22); color: var(--intigris-off-white); white-space: nowrap; }
        .lh-node { position: absolute; translate: -50% -50%; appearance: none; font: inherit; cursor: pointer; z-index: 3; display: grid; place-items: center; min-width: 136px; height: 60px; padding: 8px 16px; border-radius: 16px; border: 0; background: #fff; box-shadow: 0 14px 30px -14px rgba(0,0,0,.6), 0 0 0 0 var(--intigris-coral); transition: box-shadow 300ms, scale 300ms; }
        .lh-node.on { box-shadow: 0 14px 30px -14px rgba(0,0,0,.6), 0 0 0 4px var(--intigris-coral); scale: 1.06; }
        .lh-tile-logos { display: flex; align-items: center; gap: 10px; }
        .lh-tile-logos img { height: 26px; width: auto; max-width: 116px; object-fit: contain; display: block; }
        .lh-tile-logos.is-sf img { height: 22px; }
        .lh-tile-logos.is-tall img { height: 44px; }
        .lh-tile-text { font-size: 14.5px; font-weight: 500; color: var(--intigris-brown-700); white-space: nowrap; letter-spacing: -.01em; }
        .lh-caption { max-width: 440px; min-height: 96px; padding-left: 16px; border-left: 2px solid var(--intigris-coral); display: flex; flex-direction: column; gap: 4px; animation: ckFade 350ms var(--ease-out) both; }
        .lh-caption small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral); }
        .lh-caption b { font-size: 24px; font-weight: 500; letter-spacing: -.02em; }
        .lh-caption span { font-size: 16px; color: rgba(252,247,235,.78); }
        .lh-fallback { display: none; }
        @media (max-width: 999px) {
          .lh-grid { grid-template-columns: 1fr; }
          .lh-stage, .lh-caption { display: none; }
          .lh-fallback { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .lh-fb { min-width: 0; background: rgba(252,247,235,.06); border: 1px solid rgba(252,247,235,.14); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 6px; }
          .lh-fb-logo { background: #fff; border-radius: 10px; min-height: 52px; display: grid; place-items: center; padding: 6px 8px; overflow: hidden; }
          .lh-fb-logo .lh-tile-logos { flex-wrap: wrap; justify-content: center; gap: 4px 6px; max-width: 100%; }
          .lh-fb-logo img { height: 20px; max-width: 100%; }
          .lh-fb-logo .lh-tile-logos.is-sf img { height: 16px; }
          .lh-fb-logo .lh-tile-logos.is-tall img { height: 36px; }
          .lh-fb-logo .lh-tile-text { font-size: 12.5px; white-space: normal; text-align: center; }
          .lh-fb small { font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--intigris-coral); font-weight: 600; }
          .lh-fb-d { font-size: 13.5px; color: rgba(252,247,235,.78); }
        }
        @media (prefers-reduced-motion: reduce) { .lh-caption { animation: none; } }
      `}</style>
    </section>
  );
}

/* ---------- FAQ AS A CHAT WITH FRANK (chosen FAQ variant A, round 4) ----------
   The first question is already asked and answered. Tap a question chip: it appears
   as your message, Frank "types" for a moment and answers. When every question has
   been asked, the last chip becomes the booking button. items: [{ label, q, a }]. */
const V3_FRANK = { name: 'Frank Timmer', photo: 'assets/team/frank-timmer.jpg' };
function V3FaqChat({ head, items, onCta, label }) {
  const [thread, setThread] = v3State(() => [
    { who: 'frank', text: tx('Hi, I am Frank. These are the questions I hear most. Tap one.', 'Hoi, ik ben Frank. Dit zijn de vragen die ik het vaakst hoor. Tik er een aan.') },
    { who: 'me', text: items[0].q },
    { who: 'frank', text: items[0].a },
  ]);
  const [asked, setAsked] = v3State([0]);
  const [typing, setTyping] = v3State(false);
  const box = v3Ref(null);
  const first = v3Ref(true);
  v3Effect(() => {
    if (first.current) { first.current = false; return; } /* don't scroll the page on load */
    const el = box.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: V3_REDUCE ? 'auto' : 'smooth' });
  }, [thread, typing]);
  const ask = i => {
    if (typing) return;
    setAsked(a => a.concat(i));
    setThread(t => t.concat({ who: 'me', text: items[i].q }));
    if (V3_REDUCE) { setThread(t => t.concat({ who: 'frank', text: items[i].a })); return; }
    setTyping(true);
    setTimeout(() => { setTyping(false); setThread(t => t.concat({ who: 'frank', text: items[i].a })); }, 1100);
  };
  const left = items.map((_, i) => i).filter(i => !asked.includes(i));
  const Av = ({ small }) => <img className={'fc-av' + (small ? ' fc-av--s' : '')} src={V3_FRANK.photo} alt={small ? '' : V3_FRANK.name} />;
  return (
    <section id="faq" className="ck-section ck-section--soft fc">
      <div className="container-wide">
        {label}
        <div className="fc-grid">
          <CkHead {...head} lede={head.lede || tx('No FAQ wall. Ask what you would ask in the first call, and get the answer you would get there.', 'Geen FAQ-muur. Vraag wat je in het eerste gesprek zou vragen, en krijg het antwoord dat je daar zou krijgen.')} />
          <div className="fc-chat">
            <div className="fc-top">
              <Av />
              <div><b>{V3_FRANK.name}</b><small><i /> {tx('Sales Manager · usually replies within a day', 'Sales Manager · reageert meestal binnen een dag')}</small></div>
            </div>
            <div className="fc-body" ref={box} aria-live="polite">
              {thread.map((m, k) => (
                <div key={k} className={'fc-row fc-row--' + m.who}>
                  {m.who === 'frank' && <Av small />}
                  <div className={'fc-msg fc-msg--' + m.who}>{m.text}</div>
                </div>
              ))}
              {typing && <div className="fc-row fc-row--frank"><Av small /><div className="fc-msg fc-msg--frank fc-typing" aria-label={tx('Frank is typing', 'Frank is aan het typen')}><i /><i /><i /></div></div>}
            </div>
            <div className="fc-chips">
              {left.length ? left.map(i => <button key={i} type="button" onClick={() => ask(i)} disabled={typing}>{items[i].q}</button>)
                : <button type="button" className="fc-chip-cta" onClick={onCta}>{tx('Ask me something else in 30 minutes →', 'Vraag me iets anders in 30 minuten →')}</button>}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .fc-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(28px, 5vw, 80px); align-items: start; }
        .fc-chat { background: #fff; border-radius: 24px; box-shadow: 0 30px 60px -30px rgba(43,23,0,.35); overflow: hidden; display: flex; flex-direction: column; }
        .fc-top { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid rgba(43,23,0,.08); }
        .fc-top b { display: block; font-weight: 500; color: var(--intigris-brown-700); }
        .fc-top small { font-size: 12.5px; color: rgba(43,23,0,.6); display: inline-flex; align-items: center; gap: 6px; }
        .fc-top small i { width: 8px; height: 8px; border-radius: 50%; background: #3fae5a; }
        .fc-av { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; flex: none; display: block; box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(43,23,0,.1); }
        .fc-av--s { width: 28px; height: 28px; box-shadow: none; }
        .fc-body { height: 380px; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; background: var(--intigris-off-white); }
        .fc-row { display: flex; align-items: flex-end; gap: 8px; animation: fcPop 320ms var(--ease-out) both; }
        .fc-row--me { justify-content: flex-end; }
        .fc-msg { max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 15.5px; line-height: 1.5; }
        .fc-msg--frank { background: #fff; color: var(--intigris-brown-700); border-bottom-left-radius: 6px; box-shadow: 0 2px 6px rgba(43,23,0,.06); }
        .fc-msg--me { background: var(--intigris-coral); color: var(--intigris-brown-700); border-bottom-right-radius: 6px; font-weight: 500; }
        .fc-typing { display: inline-flex; gap: 5px; padding: 16px 18px; }
        .fc-typing i { width: 7px; height: 7px; border-radius: 50%; background: rgba(43,23,0,.4); animation: fcDot 1s infinite; }
        .fc-typing i:nth-child(2) { animation-delay: .15s; } .fc-typing i:nth-child(3) { animation-delay: .3s; }
        .fc-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 20px 20px; border-top: 1px solid rgba(43,23,0,.08); }
        .fc-chips button { appearance: none; font: inherit; font-size: 14px; cursor: pointer; padding: 9px 14px; border-radius: 999px; border: 1px solid rgba(43,23,0,.18); background: #fff; color: var(--intigris-brown-700); text-align: left; transition: background 200ms, border-color 200ms; }
        .fc-chips button:hover:not(:disabled) { background: var(--intigris-coral-100, #ffe3da); border-color: var(--intigris-coral); }
        .fc-chips button:disabled { opacity: .5; cursor: default; }
        .fc-chips .fc-chip-cta { background: var(--intigris-brown-700); color: var(--intigris-off-white); border-color: transparent; }
        @keyframes fcPop { from { opacity: 0; transform: translateY(8px) scale(.97); } to { opacity: 1; transform: none; } }
        @keyframes fcDot { 0%, 60%, 100% { transform: none; opacity: .4; } 30% { transform: translateY(-4px); opacity: 1; } }
        @media (max-width: 860px) { .fc-grid { grid-template-columns: 1fr; } .fc-body { height: 340px; } .fc-msg { max-width: 88%; font-size: 15px; } }
        @media (prefers-reduced-motion: reduce) { .fc-row { animation: none; } }
      `}</style>
    </section>
  );
}

function V3Styles() {
  return (
    <style>{`
      /* chaos hero */
      .v3-chaos { position: relative; background: linear-gradient(90deg, #ff9166 0%, var(--intigris-coral) 44%, var(--intigris-coral-700) 80%, #9e300d 100%); color: var(--intigris-off-white); border-bottom-left-radius: clamp(24px, 4vw, 56px); border-bottom-right-radius: clamp(24px, 4vw, 56px); overflow: hidden; }
      .v3-chaos-pin { min-height: 100vh; display: flex; align-items: center; padding-block: 120px 56px; }
      .v3-chaos-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: clamp(28px, 4vw, 64px); align-items: center; width: 100%; }
      .v3-scroll-hint { margin: 26px 0 0; font-size: 13px; color: rgba(252,247,235,.8); letter-spacing: .02em; }
      .v3-chaos-stage { position: relative; height: clamp(380px, 46vw, 540px); }
      .v3-chaos-item { position: absolute; width: clamp(150px, 15vw, 210px); padding: 12px 14px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 18px 40px -22px rgba(43,23,0,.6); font-size: 13px; line-height: 1.35; color: var(--intigris-dark-brown); }
      .v3-chaos-item small { font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; opacity: .7; }
      .v3-chaos-item b { font-weight: 500; }
      .v3-chaos-item--note { background: #ffe9a8; }
      .v3-chaos-item--mail { background: var(--intigris-paper); }
      .v3-chaos-item--sheet { background: #e8eee3; font-family: ui-monospace, Menlo, monospace; font-size: 12px; }
      .v3-chaos-item--chat { background: #dff3d6; border-radius: 14px 14px 14px 4px; }
      .v3-chaos-item--card { background: var(--intigris-off-white-200); }
      .v3-record { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: min(380px, 92%); background: var(--intigris-paper); color: var(--intigris-dark-brown); border-radius: 20px; padding: 18px; box-shadow: 0 40px 80px -40px rgba(43,23,0,.7); display: flex; flex-direction: column; gap: 10px; }
      .v3-record-head { display: flex; align-items: center; gap: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
      .v3-record-head small { font-size: 11px; color: var(--fg-muted); text-transform: uppercase; letter-spacing: .08em; }
      .v3-record-head b { display: block; font-size: 19px; font-weight: 500; letter-spacing: -.015em; }
      .v3-record-icon { width: 40px; height: 40px; border-radius: 12px; background: var(--intigris-coral); color: var(--intigris-dark-brown); display: grid; place-items: center; font-weight: 600; flex: none; }
      .v3-record-stage { margin-left: auto; font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: var(--intigris-coral-100); color: var(--intigris-coral-700); white-space: nowrap; }
      .v3-record-row { display: grid; grid-template-columns: 110px 1fr; gap: 10px; font-size: 13.5px; padding: 6px 0; border-bottom: 1px dashed var(--border); }
      .v3-record-row:last-child { border-bottom: 0; }
      .v3-record-row small { color: var(--fg-muted); font-size: 12px; }

      /* what it is */
      .v3-what { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: 20px; }
      .v3-what-card { border-radius: var(--radius-xl); padding: clamp(22px, 2.8vw, 34px); background: var(--intigris-coral); color: #fff; }
      .v3-what-label { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.85); margin-bottom: 18px; }
      .v3-what-card ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
      .v3-what-card li { display: flex; gap: 12px; align-items: flex-start; }
      .v3-what-card li div { display: flex; flex-direction: column; gap: 4px; }
      .v3-what-card li b { font-size: 20px; font-weight: 500; letter-spacing: -.015em; line-height: 1.25; }
      .v3-what-card li span { font-size: 14.5px; color: var(--intigris-dark-brown); line-height: 1.5; }
      .v3-check { width: 22px; height: 22px; border-radius: 999px; background: rgba(255,255,255,.92); color: var(--intigris-coral-700); display: grid; place-items: center; font-size: 12px; font-weight: 700; flex: none; margin-top: 3px; }
      .v3-what-photo { position: relative; border-radius: var(--radius-xl); overflow: hidden; min-height: 380px; }
      .v3-what-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .v3-what-photo span { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(255,145,102,.5), rgba(225,74,36,.55)); mix-blend-mode: multiply; }

      /* compact statement */
      .v3-statement { background: var(--intigris-coral); color: var(--intigris-brown-700); padding-block: clamp(80px, 11vw, 150px); }
      .v3-statement .ck-statement-dots i { background: rgba(43,23,0,.22); }
      .v3-statement .ck-statement-dots i.on { background: var(--intigris-brown-700); }
      .v3-statement { position: relative; }
      .v3-statement-inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(220px, 290px); gap: clamp(24px, 4vw, 64px); align-items: center; }
      .v3-statement-line { margin: 0; font-size: clamp(34px, 5.6vw, 96px); font-weight: 500; letter-spacing: -.045em; line-height: 1; white-space: nowrap; }
      .v3-statement-measure { position: absolute; left: 0; top: 0; visibility: hidden; pointer-events: none; height: 0; overflow: hidden; }
      .v3-statement-measure .v3-statement-line { display: inline-block; font-size: 100px; }
      .v3-statement-measure i { font-style: italic; }
      .v3-statement-word { display: inline-block; min-width: 6ch; }
      .v3-statement-word span { color: var(--intigris-off-white); font-style: italic; display: inline-block; animation: ckSwap 380ms var(--ease-out) both; }
      .v3-statement-side { border-left: 1px solid rgba(43,23,0,.28); padding-left: clamp(16px, 2.5vw, 32px); }
      .v3-statement-sub { margin: 0; font-size: 17px; line-height: 1.5; color: rgba(43,23,0,.86); animation: ckFade 380ms var(--ease-out) both; }
      .v3-statement-side .ck-statement-dots { margin-top: 16px; }
      @media (max-width: 760px) { .v3-statement-inner { grid-template-columns: 1fr; } .v3-statement-side { border-left: 0; padding-left: 0; } }

      /* flip cards */
      .v3-flips { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
      .v3-flip { appearance: none; border: 0; padding: 0; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; perspective: 1200px; min-height: 240px; }
      .v3-flip-inner { position: relative; display: block; width: 100%; height: 100%; min-height: 240px; transition: transform 700ms cubic-bezier(.2,.7,.2,1); transform-style: preserve-3d; }
      .v3-flip.is-on .v3-flip-inner { transform: rotateY(180deg); }
      .v3-flip-face { position: absolute; inset: 0; border-radius: var(--radius-xl); padding: 22px; display: flex; flex-direction: column; gap: 10px; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .v3-flip-front { background: rgba(252,247,235,.06); border: 1px solid rgba(252,247,235,.18); }
      .v3-flip-back { background: var(--intigris-coral); color: var(--intigris-dark-brown); transform: rotateY(180deg); }
      .v3-flip-face small { font-size: 11px; font-weight: 600; letter-spacing: .14em; color: var(--intigris-coral); }
      .v3-flip-back small { color: var(--intigris-dark-brown); }
      .v3-flip-face b { font-size: 22px; font-weight: 500; letter-spacing: -.02em; line-height: 1.2; }
      .v3-flip-front i { margin-top: auto; font-style: normal; font-size: 12.5px; color: rgba(252,247,235,.55); }
      .v3-flip-back span { font-size: 14.5px; line-height: 1.5; }

      /* route hero */
      .v3-route-hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: clamp(28px, 4vw, 64px); align-items: center; }
      .v3-route-hero .ck-route { grid-template-columns: 1fr; }
      .v3-route-hero .ck-h1 { font-size: clamp(38px, 4.6vw, 66px); }
      .v3-route-hero .ck-hero-inner { padding-top: clamp(112px, 14vh, 160px); }
      .v3-route-hero .ck-route-stats { flex-direction: row; flex-wrap: wrap; gap: 18px; }
      .v3-route-hero .ck-route-stats div { flex: 1 1 120px; }
      .v3-route-hero .ck-route-stats b { font-size: clamp(26px, 2.6vw, 36px); }

      /* compact day */
      .v3-day { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, .8fr); gap: clamp(24px, 4vw, 56px); align-items: center; }
      .v3-day-line { list-style: none; margin: 0 0 22px; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
      .v3-day-line button { appearance: none; font: inherit; text-align: left; cursor: pointer; width: 100%; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 4px; padding: 12px; border-radius: 14px; border: 1px solid var(--border); background: var(--intigris-paper); color: var(--intigris-dark-brown); min-height: 92px; }
      .v3-day-line time { font-size: 12px; font-weight: 600; letter-spacing: .08em; color: var(--intigris-coral-700); font-variant-numeric: tabular-nums; }
      .v3-day-line span { font-size: 13px; line-height: 1.3; }
      .v3-day-line button.done { background: var(--intigris-off-white); }
      .v3-day-line button.on { background: var(--intigris-coral); border-color: var(--intigris-coral); }
      .v3-day-line button.on time { color: var(--intigris-dark-brown); }
      .v3-day-bar { position: absolute; left: 0; bottom: 0; height: 3px; background: var(--intigris-dark-brown); animation: v3Bar 4.2s linear both; }
      @keyframes v3Bar { from { width: 0; } to { width: 100%; } }
      .v3-day-text { animation: ckFade 350ms var(--ease-out) both; }
      .v3-day-text h3 { font-size: clamp(24px, 2.6vw, 34px); font-weight: 500; letter-spacing: -.02em; margin: 0 0 8px; }
      .v3-day-text p { margin: 0; font-size: 16px; color: var(--fg-muted); max-width: 560px; }
      .v3-day-phone { justify-self: center; max-width: 300px; }

      /* integrations */
      .v3-integrations { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
      .v3-int { border-radius: 18px; padding: 18px; background: var(--intigris-paper); border: 1px solid var(--border); display: flex; flex-direction: column; gap: 4px; transition: border-color 200ms, transform 200ms; }
      .v3-int:hover { border-color: var(--intigris-coral); transform: translateY(-2px); }
      .v3-int b { font-size: 18px; font-weight: 500; }
      .v3-int small { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral-700); }
      .v3-int span { font-size: 13.5px; color: var(--fg-muted); line-height: 1.45; }

      /* connect hub */
      .v3-hub { position: relative; width: 100%; max-width: 1080px; margin: 0 auto; aspect-ratio: 1000 / 560; }
      .v3-hub-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
      .v3-hub-line { stroke: rgba(252,247,235,.22); stroke-width: 1.5; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 900ms cubic-bezier(.2,.7,.2,1), stroke 300ms, stroke-width 300ms; }
      .v3-hub.is-drawn .v3-hub-line { stroke-dashoffset: 0; }
      .v3-hub-node { opacity: 0; }
      .v3-hub.is-drawn .v3-hub-node { opacity: 1; }
      .v3-hub-line.on { stroke: var(--intigris-coral); stroke-width: 3; }
      .v3-hub-pulse { fill: rgba(252,247,235,.55); }
      .v3-hub-pulse.on { fill: var(--intigris-coral); }
      .v3-hub-center { filter: drop-shadow(0 18px 30px rgba(0,0,0,.35)); }
      .v3-hub-center circle, .v3-hub-center rect { fill: var(--intigris-soft-blue); }
      .v3-hub-center text { fill: var(--intigris-brown-700); font-family: var(--font-sans); font-size: 21px; font-weight: 600; letter-spacing: -.01em; }
      .v3-hub-node { position: absolute; transform: translate(-50%, -50%); appearance: none; font: inherit; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 16px; min-width: 128px; border-radius: 16px; border: 1px solid rgba(252,247,235,.2); background: #3a2108; color: var(--intigris-off-white); transition: opacity 500ms, background 250ms, border-color 250ms, transform 250ms; white-space: nowrap; }
      .v3-hub-node b { font-size: 14.5px; font-weight: 500; }
      .v3-hub-node small { font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: rgba(252,247,235,.55); font-weight: 600; }
      .v3-hub-node.on { background: var(--intigris-coral); border-color: var(--intigris-coral); color: var(--intigris-brown-700); transform: translate(-50%, -50%) scale(1.06); }
      .v3-hub-node.on small { color: rgba(43,23,0,.7); }
      .v3-hub-caption { margin: 24px auto 0; max-width: 640px; text-align: center; display: flex; flex-direction: column; gap: 4px; animation: ckFade 350ms var(--ease-out) both; }
      .v3-hub-caption small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral); }
      .v3-hub-caption b { font-size: 24px; font-weight: 500; letter-spacing: -.02em; }
      .v3-hub-caption span { font-size: 16px; color: rgba(252,247,235,.78); }
      .v3-hub-fallback { display: none; }
      .ck-section--dark .v3-int { background: rgba(252,247,235,.06); border-color: rgba(252,247,235,.16); }
      .ck-section--dark .v3-int span { color: rgba(252,247,235,.75); }
      @media (max-width: 760px) {
        .v3-hub, .v3-hub-caption { display: none; }
        .v3-hub-fallback { display: grid; grid-template-columns: 1fr; gap: 10px; }
      }

      /* ways to start */
      .v3-ways { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: stretch; }
      .v3-ways--3 { grid-template-columns: 1.1fr 1.1fr .8fr; }
      .v3-way { border-radius: var(--radius-xl); padding: clamp(24px, 3vw, 36px); background: var(--intigris-off-white-200); border: 1px solid var(--intigris-brown-100); display: flex; flex-direction: column; gap: 14px; color: var(--intigris-dark-brown); text-decoration: none; }
      .v3-way--quick { background: var(--intigris-coral); border-color: var(--intigris-coral); }
      .v3-way--quick .eyebrow { color: var(--intigris-dark-brown); }
      .v3-way--extra { background: var(--intigris-brown-700); color: var(--intigris-off-white); border-color: var(--intigris-brown-700); }
      .v3-way--extra p { color: rgba(252,247,235,.78) !important; }
      .v3-way--extra h3 { color: var(--intigris-off-white); }
      .v3-way--extra .eyebrow { color: var(--intigris-coral); }
      .v3-way--extra .link-arrow { color: var(--intigris-coral); margin-top: auto; }
      .v3-way-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .v3-way h3 { margin: 0; font-size: clamp(24px, 2.4vw, 32px); font-weight: 500; letter-spacing: -.02em; line-height: 1.1; }
      .v3-way-price { font-size: clamp(36px, 3.6vw, 48px); font-weight: 500; letter-spacing: -.03em; line-height: 1; }
      .v3-way-price small { display: block; font-size: 13px; letter-spacing: 0; font-weight: 400; margin-top: 6px; }
      .v3-way p { margin: 0; font-size: 15.5px; line-height: 1.55; color: var(--fg-muted); }
      .v3-way--quick p { color: var(--intigris-dark-brown); }
      .v3-way ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; font-size: 14.5px; flex: 1; }
      .v3-way li::before { content: "✓"; font-weight: 700; margin-right: 8px; color: var(--intigris-coral-700); }
      .v3-way--quick li::before { color: var(--intigris-dark-brown); }
      .v3-way .btn { align-self: flex-start; }
      .v3-badge { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding: 6px 10px; border-radius: 999px; background: var(--intigris-dark-brown); color: var(--intigris-off-white); white-space: nowrap; }
      .v3-badge--soft { background: var(--intigris-paper); color: var(--fg-muted); border: 1px solid var(--border); }
      .v3-hint { font-size: 12px; color: var(--fg-muted); }

      @media (max-width: 1100px) { .v3-flips { grid-template-columns: repeat(2, minmax(0, 1fr)); } .v3-integrations { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media (max-width: 980px) {
        .v3-chaos-grid, .v3-what, .v3-route-hero-grid, .v3-day, .v3-ways, .v3-ways--3 { grid-template-columns: 1fr; }
        .v3-chaos-pin { min-height: 0; }
        .v3-day-line { grid-template-columns: repeat(5, minmax(120px, 1fr)); overflow-x: auto; }
      }
      @media (max-width: 560px) { .v3-flips, .v3-integrations { grid-template-columns: 1fr; } .v3-chaos-item { width: 140px; font-size: 12px; } }
      @media (prefers-reduced-motion: reduce) { .v3-flip-inner { transition: none; } .v3-statement-word span, .v3-statement-sub, .v3-day-text, .v3-hub-caption { animation: none; } .v3-hub-line, .v3-hub-node { transition: none; } }
    `}</style>
  );
}

Object.assign(window, { V3ConnectHub, V3LogoHub, V3FaqChat, V3ChaosHero, V3WhatItIs, V3Statement, V3FlipProblems, V3RouteHero, V3DayCompact, V3Integrations, V3WaysToStart, V3Calculator, V3Styles });
