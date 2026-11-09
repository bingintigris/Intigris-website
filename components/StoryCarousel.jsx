/* ==================================================================== */
/*  CUSTOMER STORIES CAROUSEL — one main card in the middle, two behind   */
/*  on each side. Moves on slowly by itself (left to right), pauses on    */
/*  hover; drag/swipe, click a side card, arrows or keyboard to browse.   */
/*  Three looks (CarouselVariations.html):                                */
/*    cover · 3D coverflow on dark brown                                  */
/*    fan   · a hand of cards on coral                                    */
/*    depth · flat cards shrinking into the distance, a colour per story  */
/*  Quotes are verbatim from the customer stories, never edited.          */
/* ==================================================================== */

const SC_REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SC_TONES = ['coral', 'blue', 'green', 'paper', 'brown', 'blue'];

/* Position of a card relative to the centre, wrapped so the list loops. */
function scRel(i, pos, n) { let d = ((i - pos) % n + n) % n; if (d > n / 2) d -= n; return d; }

/* Cards stay solid (no see-through text); side cards are dimmed with an overlay
   in the section colour (--dim), and only cards beyond two places are hidden. */
function scStyle(variant, d) {
  const a = Math.abs(d), c = Math.min(a, 2.5);
  const base = { opacity: a <= 2.4 ? 1 : 0, zIndex: 20 - Math.round(a * 4), '--dim': Math.min(.62, c * .3) };
  if (variant === 'cover') {
    const rot = Math.max(-1, Math.min(1, d)) * -32;
    return { ...base, transform: `translateX(${d * 52}%) translateZ(${-a * 160}px) rotateY(${rot}deg) scale(${1 - c * .06})` };
  }
  /* round 3 (split layout: text left, cards right) */
  if (variant === 'deck') {
    if (d < 0) return { opacity: d < -0.9 ? 0 : 1, zIndex: 30, '--dim': 0, transform: `translateX(${-d * 85}%) translateY(${-d * 4}%) rotate(${-d * 12}deg)` };
    return { opacity: d > 2.4 ? 0 : 1, zIndex: 20 - Math.round(d * 4), '--dim': Math.min(.36, d * .18), transform: `translate(${d * 10}%, ${-d * 11}%) scale(${1 - Math.min(d, 2.5) * .06})` };
  }
  if (variant === 'fanR') {
    return { opacity: a <= 1.35 ? 1 : 0, zIndex: 20 - Math.round(a * 4), '--dim': Math.min(.3, c * .2), transform: `rotate(${d * 9}deg) translateY(${a * 6}px) scale(${1 - Math.min(a, 1.5) * .06})` };
  }
  if (variant === 'stackUp') {
    if (d < 0) return { opacity: 0, zIndex: 30, '--dim': 0, transform: `translateY(${-d * 45}%) rotate(${-d * 3}deg)` };
    return { opacity: d > 2.4 ? 0 : 1, zIndex: 20 - Math.round(d * 4), '--dim': Math.min(.34, d * .17), transform: `translateY(${-d * 15}%) scale(${1 - Math.min(d, 2.5) * .06})` };
  }
  /* round 2: one main card and two behind it (one each side) */
  if (variant === 'peek' || variant === 'swing' || variant === 'shuffle') {
    const three = { opacity: a <= 1.35 ? 1 : 0, zIndex: 20 - Math.round(a * 4) };
    if (variant === 'peek') return { ...three, '--dim': Math.min(.4, c * .3), transform: `translateX(${d * 34}%) scale(${1 - Math.min(a, 1.5) * .14})` };
    if (variant === 'swing') return { ...three, '--dim': Math.min(.3, c * .2), transform: `rotate(${d * 10}deg) translateY(${a * 8}px) scale(${1 - Math.min(a, 1.5) * .05})` };
    return { ...three, '--dim': 0, transform: `translateX(${d * 22}%) translateY(${a * 22}px) rotate(${d * 4}deg) scale(${1 - Math.min(a, 1.5) * .07})` };
  }
  if (variant === 'fan') {
    return { ...base, '--dim': Math.min(.45, c * .2), transform: `translateX(${d * 46}%) translateY(${a * a * 14}px) rotate(${d * 7}deg) scale(${1 - c * .1})`, filter: `blur(${c * .5}px)` };
  }
  /* depth */
  return { ...base, transform: `translateX(${d * 64}%) scale(${1 - c * .17})` };
}

const SC_SPLIT = { deck: 1, fanR: 1, stackUp: 1 };
const SC_FORWARD = { deck: 1, stackUp: 1 }; /* deck-like: the main card leaves, the next comes forward */

function StoryCarousel({ head, stories, variant = 'cover', label, auto = 4800, direction: dirProp }) {
  const direction = dirProp || (SC_FORWARD[variant] ? 1 : -1);
  const split = !!SC_SPLIT[variant];
  /* repeat the list so there are always hidden cards behind the visible five */
  const reps = Math.max(1, Math.ceil(8 / stories.length));
  const items = Array.from({ length: reps }, () => stories).flat();
  const n = items.length;
  const [pos, setPos] = React.useState(0);
  const [drag, setDrag] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const start = React.useRef(null);
  const stage = React.useRef(null);
  const moved = React.useRef(false);
  const go = d => setPos(p => p + d);

  React.useEffect(() => {
    const el = stage.current; if (!el || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(es => setInView(es.some(e => e.isIntersecting)), { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, []);
  /* auto-advance: slowly, left to right (the card on the left slides into the middle) */
  React.useEffect(() => {
    if (SC_REDUCE || hover || !inView || start.current !== null) return;
    const t = setInterval(() => go(direction), auto);
    return () => clearInterval(t);
  }, [hover, inView, auto, direction]);

  const cardW = () => (stage.current && stage.current.querySelector('.sc-card') || { offsetWidth: 500 }).offsetWidth;
  const onDown = e => { start.current = e.clientX; moved.current = false; };
  const DRAG_UNIT = { depth: .64, peek: .45, swing: .5, shuffle: .4, deck: .85, fanR: .5, stackUp: .6 };
  const onMove = e => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    if (!moved.current && Math.abs(dx) > 6) { moved.current = true; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {} }
    /* deck-like: dragging right throws the main card away (= forward) */
    if (moved.current) setDrag((SC_FORWARD[variant] ? -1 : 1) * dx / (cardW() * (DRAG_UNIT[variant] || .5)));
  };
  const onUp = () => { if (start.current === null) return; start.current = null; setPos(p => Math.round(p - drag)); setDrag(0); };
  const onKey = e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } };

  const p = pos - drag;
  const active = ((Math.round(pos) % stories.length) + stories.length) % stories.length;
  const goTo = i => { let d = (i - active) % stories.length; if (d > stories.length / 2) d -= stories.length; if (d < -stories.length / 2) d += stories.length; go(d); };
  const nav = (
    <div className="sc-nav">
      <button type="button" onClick={() => go(-1)} aria-label={tx('Previous story', 'Vorig verhaal')}>←</button>
      <button type="button" onClick={() => go(1)} aria-label={tx('Next story', 'Volgend verhaal')}>→</button>
    </div>
  );
  const stageEl = (
      <div className={'sc-stage' + (drag ? ' is-dragging' : '')} ref={stage} tabIndex={0} onKeyDown={onKey}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        aria-roledescription="carousel" aria-label={tx('Customer stories', 'Klantverhalen')}>
        {items.map((s, i) => {
          const d = scRel(i, p, n);
          const center = Math.abs(d) < .5;
          return (
            <article key={i} className={'sc-card sc-card--' + SC_TONES[i % stories.length % SC_TONES.length] + (center ? ' is-center' : '')} style={scStyle(variant, d)}
              aria-hidden={!center} onClick={() => { if (!moved.current && !center) go(Math.round(d)); }}>
              <div className="sc-card-top"><b>{s.name}</b><small>{s.sector}</small></div>
              {s.metric && <div className="sc-metric"><b>{s.metric.n}</b><span>{s.metric.d}</span></div>}
              <blockquote>{s.quote ? '“' + s.quote + '”' : s.headline}</blockquote>
              <div className="sc-more"><p>{s.what}</p><div className="ck-chips">{s.clouds.map(c => <span key={c}>{c}</span>)}</div></div>
              <div className="sc-who"><b>{s.who}</b>{s.role && <span>{s.role}, {s.name}</span>}</div>
            </article>
          );
        })}
      </div>
  );
  if (split) return (
    <section className={'ck-section ck-section--coral sc sc--split sc--' + variant}>
      <div className="container-wide sc-split">
        <div className="sc-split-text">
          {label}
          <CkHead {...head} dark />
          {nav}
          <ol className="sc-names">
            {stories.map((s, i) => (
              <li key={s.name}><button type="button" className={i === active ? 'on' : ''} aria-current={i === active} onClick={() => goTo(i)}>
                <span>{String(i + 1).padStart(2, '0')}</span>{s.name}<small>{s.sector}</small>
              </button></li>
            ))}
          </ol>
        </div>
        {stageEl}
      </div>
    </section>
  );
  return (
    <section className={'ck-section sc sc--' + variant + (variant === 'cover' ? ' ck-section--dark' : variant !== 'depth' ? ' ck-section--coral' : '')}>
      <div className="container-wide">
        {label}
        <div className="sc-head">
          <CkHead {...head} dark={variant !== 'cover' && variant !== 'depth'} />
          {nav}
        </div>
      </div>
      {stageEl}
      <div className="sc-dots" role="tablist">
        {stories.map((s, i) => <button key={s.name} type="button" role="tab" aria-selected={i === active} aria-label={s.name} className={i === active ? 'on' : ''} onClick={() => goTo(i)} />)}
      </div>
    </section>
  );
}

function ScStyles() {
  return (
    <style>{`
      .sc { overflow: hidden; }
      .sc-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
      .sc-nav { display: flex; gap: 10px; padding-bottom: clamp(28px, 4vw, 44px); }
      .sc-nav button { width: 52px; height: 52px; border-radius: 50%; border: 1.5px solid currentColor; background: transparent; color: inherit; font-size: 20px; cursor: pointer; transition: background 200ms, color 200ms; }
      .sc-stage { position: relative; height: 470px; perspective: 1500px; cursor: grab; touch-action: pan-y; user-select: none; outline: none; }
      .sc-stage.is-dragging { cursor: grabbing; }
      .sc-card { position: absolute; left: 50%; top: 10px; width: min(540px, 78vw); height: 420px; margin-left: calc(min(540px, 78vw) / -2); border-radius: 26px; padding: 30px 32px; display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; transform-origin: 50% 50%;
        transition: transform 1100ms cubic-bezier(.22,.8,.24,1), opacity 1100ms, filter 1100ms; will-change: transform; cursor: pointer; }
      .sc-card::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: var(--sc-dim, #2b1700); opacity: var(--dim, 0); pointer-events: none; transition: opacity 1100ms; }
      .sc--cover { --sc-dim: #2b1700; } .sc--fan { --sc-dim: #ff5f36; } .sc--depth { --sc-dim: #fcf7eb; }
      .sc-stage.is-dragging .sc-card, .sc-stage.is-dragging .sc-card::after { transition: none; }
      .sc-card.is-center { cursor: inherit; }
      .sc-card-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
      .sc-card-top b { font-size: 24px; font-weight: 600; letter-spacing: -.02em; }
      .sc-card-top small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; opacity: .7; }
      .sc-card blockquote { margin: 0; font-size: clamp(20px, 1.8vw, 25px); line-height: 1.3; letter-spacing: -.015em; font-weight: 500; }
      .sc-metric { display: flex; align-items: baseline; gap: 10px; } .sc-metric b { font-size: 46px; font-weight: 500; letter-spacing: -.04em; line-height: 1; } .sc-metric span { font-size: 15px; opacity: .8; }
      .sc-more { margin-top: auto; display: flex; flex-direction: column; gap: 10px; transition: opacity 600ms; }
      .sc-more p { margin: 0; font-size: 14.5px; line-height: 1.5; opacity: .8; }
      .sc-who { display: flex; flex-direction: column; gap: 2px; font-size: 14px; padding-top: 12px; border-top: 1px solid currentColor; border-top-color: color-mix(in srgb, currentColor 18%, transparent); }
      .sc-who b { font-weight: 500; font-size: 15px; } .sc-who span { opacity: .65; }
      .sc-dots { display: flex; justify-content: center; gap: 8px; margin-top: 18px; }
      .sc-dots button { width: 28px; height: 4px; border-radius: 2px; border: 0; padding: 0; cursor: pointer; background: currentColor; opacity: .25; transition: opacity 300ms, width 300ms; }
      .sc-dots button.on { opacity: 1; width: 44px; }

      /* cover · 3D coverflow on dark */
      .sc--cover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .sc--cover .sc-card { background: var(--intigris-off-white); color: var(--intigris-brown-700); box-shadow: 0 40px 70px -30px rgba(0,0,0,.7); }
      .sc--cover .sc-card:not(.is-center) .sc-more { opacity: .35; }
      .sc--cover .sc-card.is-center { box-shadow: 0 40px 80px -30px rgba(0,0,0,.8), 0 0 0 3px var(--intigris-coral); }
      .sc--cover .sc-card-top small { color: var(--intigris-coral-700, #d9451f); opacity: 1; }
      .sc--cover .sc-nav button:hover { background: var(--intigris-coral); border-color: var(--intigris-coral); color: var(--intigris-brown-700); }
      .sc--cover .sc-dots button.on { background: var(--intigris-coral); }

      /* fan · a hand of cards on coral */
      .sc--fan { background: var(--intigris-coral); color: var(--intigris-brown-700); }
      .sc--fan .sc-stage { height: 500px; }
      .sc--fan .sc-card { transform-origin: 50% 120%; background: #fff; color: var(--intigris-brown-700); box-shadow: 0 30px 50px -28px rgba(43,23,0,.6); }
      .sc--fan .sc-card.is-center { background: var(--intigris-off-white); }
      .sc--fan .sc-card-top small { color: var(--intigris-coral-700, #d9451f); opacity: 1; }
      .sc--fan .sc-nav button:hover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }

      /* depth · flat, a colour per story, details only on the main card */
      .sc--depth { background: var(--intigris-off-white); color: var(--intigris-brown-700); }
      .sc--depth .sc-card { box-shadow: 0 30px 50px -32px rgba(43,23,0,.5); }
      .sc--depth .sc-card:not(.is-center) .sc-more { opacity: 0; }
      .sc--depth .sc-nav button:hover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      /* round 2 · one main card, two behind (all on coral) */
      .sc--peek, .sc--swing, .sc--shuffle { --sc-dim: #ff5f36; }
      .sc--peek .sc-card, .sc--swing .sc-card, .sc--shuffle .sc-card { width: min(600px, 80vw); margin-left: calc(min(600px, 80vw) / -2); }
      .sc--peek .sc-card { background: var(--intigris-off-white); color: var(--intigris-brown-700); box-shadow: 0 30px 60px -30px rgba(43,23,0,.6); }
      .sc--peek .sc-card:not(.is-center) .sc-more { opacity: 0; }
      .sc--swing .sc-stage { height: 520px; }
      .sc--swing .sc-card { transform-origin: 50% 190%; background: #fff; color: var(--intigris-brown-700); padding-top: 0; overflow: hidden; box-shadow: 0 30px 50px -28px rgba(43,23,0,.6); }
      .sc--swing .sc-card-top { margin: 0 -32px 6px; padding: 22px 32px 18px; background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .sc--swing .sc-card-top small { color: var(--intigris-coral); opacity: 1; }
      .sc--shuffle .sc-stage { height: 500px; }
      .sc--shuffle .sc-card { background: var(--intigris-off-white); color: var(--intigris-brown-700); box-shadow: 0 24px 44px -24px rgba(43,23,0,.55); transition-duration: 900ms; }
      .sc--shuffle .sc-card:not(.is-center) { background: var(--intigris-soft-blue); }
      .sc--shuffle .sc-card:not(.is-center) .sc-more, .sc--shuffle .sc-card:not(.is-center) blockquote { opacity: .0; }
      .sc--peek .sc-card-top small, .sc--shuffle .sc-card-top small { color: var(--intigris-coral-700, #d9451f); opacity: 1; }
      .sc--peek .sc-card .ck-chips span, .sc--swing .sc-card .ck-chips span, .sc--shuffle .sc-card .ck-chips span { background: rgba(43,23,0,.06); color: var(--intigris-brown-700); border-color: rgba(43,23,0,.12); }
      .sc--peek .sc-nav button:hover, .sc--swing .sc-nav button:hover, .sc--shuffle .sc-nav button:hover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }

      /* round 3 · split: text left, cards right */
      .sc--split { --sc-dim: #ff5f36; }
      .sc-split { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
      .sc-split-text .ck-head { margin-bottom: 22px; }
      .sc-split-text .sc-nav { padding-bottom: 0; margin-bottom: 22px; }
      .sc-names { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(43,23,0,.25); }
      .sc-names li { border-bottom: 1px solid rgba(43,23,0,.25); }
      .sc-names button { appearance: none; border: 0; background: none; font: inherit; width: 100%; display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; align-items: baseline; gap: 10px; padding: 11px 0; cursor: pointer; text-align: left; color: rgba(43,23,0,.62); font-size: 18px; transition: color 250ms, padding 300ms var(--ease-out); }
      .sc-names button span { font-size: 12px; font-variant-numeric: tabular-nums; }
      .sc-names button small { font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; opacity: .8; }
      .sc-names button:hover { color: var(--intigris-brown-700); }
      .sc-names button.on { color: var(--intigris-brown-700); font-weight: 600; padding-left: 8px; }
      .sc--split .sc-stage { height: 500px; perspective: none; overflow: visible; }
      .sc--split .sc-card { width: min(500px, 100%); left: 50%; margin-left: calc(min(500px, 100%) / -2); top: 60px; height: 400px; background: var(--intigris-off-white); color: var(--intigris-brown-700); box-shadow: 0 30px 60px -30px rgba(43,23,0,.6); }
      .sc--split .sc-card:not(.is-center) .sc-more { opacity: 0; }
      .sc--split .sc-card-top small { color: var(--intigris-coral-700, #d9451f); opacity: 1; }
      .sc--split .sc-card .ck-chips span { background: rgba(43,23,0,.06); color: var(--intigris-brown-700); border-color: rgba(43,23,0,.12); }
      .sc--split .sc-nav button:hover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .sc--deck .sc-card { transform-origin: 50% 100%; }
      .sc--fanR .sc-card { transform-origin: 50% 175%; top: 50px; }
      .sc--stackUp .sc-stage { height: 560px; }
      .sc--stackUp .sc-card { transform-origin: 50% 0%; top: 135px; }
      .sc--stackUp .sc-card:not(.is-center) blockquote, .sc--stackUp .sc-card:not(.is-center) .sc-who { opacity: 0; }
      .sc--deck .sc-card { top: 90px; }
      .sc--deck .sc-card > * { transition: opacity 500ms; }
      .sc--deck .sc-card:not(.is-center) > * { opacity: 0; }
      .sc--split .ck-lede { color: rgba(43,23,0,.82); }
      @media (max-width: 960px) {
        .sc-split { grid-template-columns: 1fr; }
        .sc-names { display: none; }
        .sc--split .sc-stage { height: 480px; }
      }

      .sc-card--coral { background: var(--intigris-coral); color: var(--intigris-brown-700); }
      .sc-card--blue { background: var(--intigris-soft-blue); color: var(--intigris-brown-700); }
      .sc-card--green { background: var(--intigris-washed-green, #4c693a); color: var(--intigris-off-white); }
      .sc-card--paper { background: #fff; color: var(--intigris-brown-700); }
      .sc-card--brown { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .sc--cover .sc-card, .sc--fan .sc-card { --tone-reset: 1; }
      .sc-card--green .ck-chips span, .sc-card--brown .ck-chips span { background: rgba(252,247,235,.12); color: var(--intigris-off-white); border-color: rgba(252,247,235,.25); }
      .sc-card--coral .ck-chips span, .sc-card--blue .ck-chips span { background: rgba(43,23,0,.1); color: var(--intigris-brown-700); border-color: transparent; }
      .sc--cover .sc-card .ck-chips span, .sc--fan .sc-card .ck-chips span { background: rgba(43,23,0,.06); color: var(--intigris-brown-700); border-color: rgba(43,23,0,.12); }

      @media (max-width: 760px) {
        .sc-head { flex-direction: column; align-items: flex-start; } .sc-nav { padding-bottom: 20px; }
        .sc-stage { height: 470px; } .sc-card { height: 430px; padding: 24px; }
      }
      @media (prefers-reduced-motion: reduce) { .sc-card { transition: none; } }
    `}</style>
  );
}

Object.assign(window, { StoryCarousel, ScStyles });
