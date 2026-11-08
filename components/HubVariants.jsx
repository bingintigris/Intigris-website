/* ==================================================================== */
/*  INTEGRATION HUB — three variations to choose from (HubVariations.html)*/
/*  A · Landing: tools scattered across the screen fly in and land around */
/*      the Salesforce Summit Partner badge as you scroll (GSAP pin+scrub).*/
/*  B · Orbit:   tools burst out of the badge and keep orbiting slowly.   */
/*  C · Plug in: tools slide one by one from a list into their slot, with */
/*      a "connected" counter (GSAP pin+scrub).                           */
/*  Badge: assets/salesforce-summit-partner.webp (official partner badge).*/
/* ==================================================================== */

const HV_REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HV_BADGE = 'assets/salesforce-summit-partner.webp';

/* Positions on an ellipse, in % of the stage. */
function hvPoints(n, rx = 40, ry = 38) {
  return Array.from({ length: n }, (_, i) => { const a = (-90 + (360 / n) * i) * Math.PI / 180; return [50 + rx * Math.cos(a), 50 + ry * Math.sin(a)]; });
}

/* Lines are drawn in the stage's own proportions (W×H), so strokes stay solid and even. */
function HvLines({ pts, active, w = 1000, h = 560, className = '' }) {
  return (
    <svg className={'hv-lines ' + className} viewBox={'0 0 ' + w + ' ' + h} aria-hidden>
      {pts.map(([x, y], i) => <line key={i} x1={w / 2} y1={h / 2} x2={x / 100 * w} y2={y / 100 * h} pathLength="1" className={'hv-line' + (i === active ? ' on' : '')} />)}
    </svg>
  );
}

function HvNode({ it, pos, on, onPick, className = '' }) {
  return (
    <button type="button" className={'hv-node ' + className + (on ? ' on' : '')} style={{ left: pos[0] + '%', top: pos[1] + '%' }}
      onMouseEnter={onPick} onFocus={onPick} onClick={onPick} aria-pressed={on}>
      <b>{it.n}</b><small>{it.k}</small>
    </button>
  );
}

function HvCaption({ it }) {
  return <div className="hv-caption" key={it.n}><small>{it.k}</small><b>{it.n}</b><span>{it.d}</span></div>;
}

/* ---------- A · LANDING ---------- */
function HubLanding({ items }) {
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const pts = hvPoints(items.length);
  React.useEffect(() => {
    if (!window.gsap || HV_REDUCE) return;
    const gsap = window.gsap;
    const ctx = gsap.context(() => {
      const root = ref.current;
      const nodes = root.querySelectorAll('.hv-node');
      const lines = root.querySelectorAll('.hv-line');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: '+=130%', scrub: 0.7, pin: root.querySelector('.hv-pin') } });
      nodes.forEach((n, i) => {
        const sx = ((i * 137) % 100 - 50) * 9, sy = ((i * 61) % 100 - 50) * 6, rot = ((i * 47) % 60) - 30;
        tl.fromTo(n, { x: sx, y: sy, rotate: rot, opacity: 0.35 }, { x: 0, y: 0, rotate: 0, opacity: 1, ease: 'power3.out', duration: 1 }, i * 0.07);
      });
      tl.fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.05, duration: 0.5 }, 0.95);
      tl.fromTo(root.querySelector('.hv-badge'), { scale: 0.7, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.6 }, 0.6);
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section className="hv-section hv-a" ref={ref}>
      <div className="hv-pin">
        <div className="container-wide">
          <div className="hv-label"><span>A</span> {tx('Landing: scroll and the tools land in place', 'Landing: scroll en de tools landen op hun plek')}</div>
          <div className="hv-stage">
            <HvLines pts={pts} active={active} />
            <img className="hv-badge" src={HV_BADGE} alt="Salesforce Summit Partner" />
            {items.map((it, i) => <HvNode key={i} it={it} pos={pts[i]} on={i === active} onPick={() => setActive(i)} />)}
          </div>
          <HvCaption it={items[active]} />
        </div>
      </div>
    </section>
  );
}

/* ---------- B · ORBIT ---------- */
function HubOrbit({ items }) {
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(HV_REDUCE || !('IntersectionObserver' in window));
  const [active, setActive] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const pts = hvPoints(items.length, 38, 38);
  React.useEffect(() => {
    if (open) return;
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setOpen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [open]);
  return (
    <section className="hv-section hv-b" ref={ref}>
      <div className="container-wide">
        <div className="hv-label"><span>B</span> {tx('Orbit: the tools burst out and keep circling', 'Orbit: de tools springen eruit en blijven rondcirkelen')}</div>
        <div className={'hv-stage hv-stage--square' + (open ? ' is-open' : '') + (hover ? ' is-paused' : '')} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div className="hv-orbit">
            <HvLines pts={pts} active={active} w={1000} h={1000} />
            {items.map((it, i) => (
              <div key={i} className="hv-orbit-slot" style={{ left: pts[i][0] + '%', top: pts[i][1] + '%', transitionDelay: (i * 60) + 'ms' }}>
                <HvNode it={it} pos={[50, 50]} on={i === active} onPick={() => setActive(i)} className="hv-node--orbit" />
              </div>
            ))}
          </div>
          <img className="hv-badge" src={HV_BADGE} alt="Salesforce Summit Partner" />
        </div>
        <HvCaption it={items[active]} />
      </div>
    </section>
  );
}

/* ---------- C · PLUG IN ---------- */
function HubPlugIn({ items }) {
  const ref = React.useRef(null);
  const [count, setCount] = React.useState(HV_REDUCE ? items.length : 0);
  const [active, setActive] = React.useState(0);
  const pts = hvPoints(items.length, 36, 38);
  React.useEffect(() => {
    if (!window.gsap || HV_REDUCE) { setCount(items.length); return; }
    const gsap = window.gsap;
    const ctx = gsap.context(() => {
      const root = ref.current;
      const stage = root.querySelector('.hv-stage');
      const nodes = root.querySelectorAll('.hv-node');
      const lines = root.querySelectorAll('.hv-line');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: '+=' + (items.length * 22) + '%', scrub: 0.5, pin: root.querySelector('.hv-pin'),
        onUpdate: (st) => setCount(Math.min(items.length, Math.floor(st.progress * items.length + 0.15))) } });
      nodes.forEach((n, i) => {
        /* start in a column at the left edge of the stage */
        const fromX = () => -(n.offsetLeft) + 90;
        const fromY = () => -(n.offsetTop) + 40 + i * 50;
        tl.fromTo(n, { x: fromX, y: fromY, opacity: 0.55, scale: 0.9 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.inOut' }, i)
          .fromTo(lines[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3 }, i + 0.7)
          .fromTo(n, { boxShadow: '0 0 0 0 rgba(255,95,54,0)' }, { boxShadow: '0 0 0 10px rgba(255,95,54,0)', duration: 0.3 }, i + 0.75);
      });
      void stage;
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section className="hv-section hv-c" ref={ref}>
      <div className="hv-pin">
        <div className="container-wide">
          <div className="hv-label"><span>C</span> {tx('Plug in: one by one into their slot', 'Inpluggen: één voor één op hun plek')}</div>
          <div className="hv-c-grid">
            <div className="hv-c-count"><b>{count}</b><span>/ {items.length}</span><small>{tx('connected', 'gekoppeld')}</small></div>
            <div className="hv-stage">
              <HvLines pts={pts} active={active} />
              <img className="hv-badge" src={HV_BADGE} alt="Salesforce Summit Partner" />
              {items.map((it, i) => <HvNode key={i} it={it} pos={pts[i]} on={i === active} onPick={() => setActive(i)} />)}
            </div>
          </div>
          <HvCaption it={items[active]} />
        </div>
      </div>
    </section>
  );
}

function HvStyles() {
  return (
    <style>{`
      .hv-section { background: var(--intigris-brown-700); color: var(--intigris-off-white); border-top: 1px solid rgba(252,247,235,.12); }
      .hv-pin { min-height: 100vh; display: flex; align-items: center; padding-block: 80px 48px; }
      .hv-pin > .container-wide { width: 100%; }
      .hv-b { padding-block: 96px 72px; }
      .hv-label { display: inline-flex; align-items: center; gap: 12px; font-size: 15px; color: rgba(252,247,235,.8); margin-bottom: 18px; }
      .hv-label span { width: 34px; height: 34px; border-radius: 50%; background: var(--intigris-coral); color: var(--intigris-brown-700); display: grid; place-items: center; font-weight: 700; }
      .hv-stage { position: relative; width: 100%; max-width: 1000px; margin: 0 auto; aspect-ratio: 1000 / 560; }
      .hv-stage--square { max-width: 640px; aspect-ratio: 1; }
      .hv-lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
      .hv-line { stroke: rgba(252,247,235,.25); stroke-width: 2; stroke-dasharray: 1 1; stroke-dashoffset: 0; transition: stroke 300ms, stroke-width 300ms; }
      .hv-line.on { stroke: var(--intigris-coral); stroke-width: 4; }
      .hv-badge { position: absolute; left: 50%; top: 50%; width: clamp(96px, 13%, 132px); transform: translate(-50%, -50%); border-radius: 16px; box-shadow: 0 24px 50px -18px rgba(0,0,0,.6); z-index: 2; }
      .hv-stage--square .hv-badge { width: clamp(96px, 22%, 140px); }
      .hv-node { position: absolute; transform: translate(-50%, -50%); appearance: none; font: inherit; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 16px; min-width: 126px; border-radius: 16px; border: 1px solid rgba(252,247,235,.2); background: #3a2108; color: var(--intigris-off-white); white-space: nowrap; z-index: 3; translate: -50% -50%; transform: none; }
      .hv-node b { font-size: 14.5px; font-weight: 500; }
      .hv-node small { font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: rgba(252,247,235,.55); font-weight: 600; }
      .hv-node.on { background: var(--intigris-coral); border-color: var(--intigris-coral); color: var(--intigris-brown-700); }
      .hv-node.on small { color: rgba(43,23,0,.7); }
      .hv-caption { margin: 22px auto 0; max-width: 620px; text-align: center; display: flex; flex-direction: column; gap: 4px; min-height: 92px; }
      .hv-caption small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral); }
      .hv-caption b { font-size: 24px; font-weight: 500; letter-spacing: -.02em; }
      .hv-caption span { font-size: 16px; color: rgba(252,247,235,.78); }

      /* B · orbit */
      .hv-orbit { position: absolute; inset: 0; transform: scale(.2); opacity: 0; transition: transform 1100ms cubic-bezier(.2,.9,.2,1.15), opacity 600ms; }
      .hv-stage.is-open .hv-orbit { transform: scale(1); opacity: 1; animation: hvSpin 70s linear 1.2s infinite; }
      .hv-stage.is-paused .hv-orbit, .hv-stage.is-paused .hv-node--orbit { animation-play-state: paused; }
      .hv-orbit-slot { position: absolute; width: 0; height: 0; }
      .hv-node--orbit { left: 0 !important; top: 0 !important; }
      .hv-stage.is-open .hv-node--orbit { animation: hvSpin 70s linear 1.2s infinite reverse; }
      @keyframes hvSpin { to { transform: rotate(360deg); } }

      /* C · plug in */
      .hv-c-grid { display: grid; grid-template-columns: 140px minmax(0, 1fr); gap: 20px; align-items: center; }
      .hv-c-count { display: flex; flex-direction: column; gap: 2px; }
      .hv-c-count b { font-size: 72px; font-weight: 500; letter-spacing: -.04em; line-height: 1; color: var(--intigris-coral); font-variant-numeric: tabular-nums; }
      .hv-c-count span { font-size: 18px; color: rgba(252,247,235,.7); }
      .hv-c-count small { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: rgba(252,247,235,.6); font-weight: 600; }

      @media (max-width: 760px) {
        .hv-node { min-width: 0; padding: 6px 9px; } .hv-node b { font-size: 11.5px; } .hv-node small { display: none; }
        .hv-c-grid { grid-template-columns: 1fr; } .hv-c-count { flex-direction: row; align-items: baseline; gap: 8px; } .hv-c-count b { font-size: 44px; }
      }
      @media (prefers-reduced-motion: reduce) { .hv-orbit { transform: none; opacity: 1; transition: none; } .hv-stage.is-open .hv-orbit, .hv-stage.is-open .hv-node--orbit { animation: none; } }
    `}</style>
  );
}

Object.assign(window, { HubLanding, HubOrbit, HubPlugIn, HvStyles });
