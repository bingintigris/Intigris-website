/* ==================================================================== */
/*  HOMEPAGE · SECTION 3 · THE PLATFORM — three variants (round 1)         */
/*  The Salesforce stack as five layers, built up from the bottom:         */
/*  your systems → Data 360 → your processes (Sales / Service / Field      */
/*  Service) → Agentforce → Slack. Scroll moves through the layers         */
/*  (GSAP pin + scrub on desktop); phones and reduced motion get a plain   */
/*  list. Variants (HomeSfVariations.html?section=3):                      */
/*    stack · layers drop in and stack up, text on the left                */
/*    rings · Data 360 at the core, rings light up outwards                */
/*    ride  · horizontal journey: five big panels glide past               */
/*  No customer claims for Data 360 / Slack (Bing, 2026-11-09).           */
/* ==================================================================== */

const HP_REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const HP_LAYERS = () => [
  { key: 'systems', n: '01', name: tx('Your systems', 'Je systemen'),
    title: tx('It starts with what you already have.', 'Het begint bij wat je al hebt.'),
    body: tx('Your ERP, accounting, mail and documents stay. We connect them to Salesforce so data flows both ways, without retyping.', 'Je ERP, boekhouding, mail en documenten blijven. Wij koppelen ze aan Salesforce zodat data twee kanten op stroomt, zonder overtypen.'),
    we: [tx('Exact, AFAS, Business Central, NetSuite', 'Exact, AFAS, Business Central, NetSuite'), tx('Outlook, Gmail, DocuSign, PDF Butler', 'Outlook, Gmail, DocuSign, PDF Butler'), tx('Built and maintained by us', 'Door ons gebouwd en onderhouden')],
    chips: ['Exact', 'AFAS', 'Business Central', 'NetSuite', 'Twinfield'], href: '#integrations', cta: tx('See the integrations', 'Bekijk de koppelingen') },
  { key: 'data', n: '02', name: 'Data 360',
    title: tx('One picture of every customer.', 'Eén beeld van elke klant.'),
    body: tx('Data 360 (formerly Data Cloud) brings data from all those systems together in one profile, for your teams and for your AI agents.', 'Data 360 (voorheen Data Cloud) brengt data uit al die systemen samen in één profiel, voor je teams én voor je AI-agents.'),
    we: [tx('Data model and identity resolution', 'Datamodel en identity resolution'), tx('Segments and insights for sales, service and marketing', 'Segmenten en inzichten voor sales, service en marketing'), tx('Certified Data 360 consultants', 'Gecertificeerde Data 360-consultants')],
    chips: [tx('One profile', 'Eén profiel'), tx('Segments', 'Segmenten'), tx('Insights', 'Inzichten')], href: 'Services.html#data', cta: tx('About Data 360', 'Over Data 360') },
  { key: 'clouds', n: '03', name: tx('Your processes', 'Je processen'),
    title: tx('Sales, service and the field, in one system.', 'Sales, service en buitendienst, in één systeem.'),
    body: tx('Sales Cloud for leads to deals, Service Cloud for customer questions, Field Service and FieldBuddy for planning and engineers on the road.', 'Sales Cloud van lead tot deal, Service Cloud voor klantvragen, Field Service en FieldBuddy voor planning en monteurs onderweg.'),
    we: [tx('Quickstarts: live in weeks, fixed price', 'Quickstarts: in weken live, vaste prijs'), tx('Full implementations in sprints', 'Volledige implementaties in sprints'), tx('Since 2010, 300+ projects', 'Sinds 2010, 300+ projecten')],
    chips: ['Sales Cloud', 'Service Cloud', 'Field Service', 'FieldBuddy'], href: 'SalesCloud.html', cta: tx('See Sales Cloud', 'Bekijk Sales Cloud'),
    links: [{ t: 'Sales Cloud', h: 'SalesCloud.html' }, { t: 'Service Cloud', h: 'ServiceCloud.html' }, { t: 'Field Service', h: 'FieldService.html' }] },
  { key: 'agentforce', n: '04', name: 'Agentforce',
    title: tx('AI agents that take work off your hands.', 'AI-agents die werk uit handen nemen.'),
    body: tx('Agents that answer customer questions, prepare meetings and summarise work orders, inside your own data and rules.', 'Agents die klantvragen beantwoorden, gesprekken voorbereiden en werkbonnen samenvatten, binnen je eigen data en regels.'),
    we: [tx('Agentforce Kickstart: 2 weeks, €3,950', 'Agentforce Kickstart: 2 weken, € 3.950'), tx('Use cases, guardrails and testing', 'Use cases, guardrails en testen'), tx('Built on the data you already have', 'Gebouwd op de data die je al hebt')],
    chips: [tx('Service agent', 'Service-agent'), tx('Sales coach', 'Sales-coach'), tx('Pre-work brief', 'Pre-work brief')], href: 'Agentforce.html', cta: tx('About Agentforce', 'Over Agentforce') },
  { key: 'slack', n: '05', name: 'Slack',
    title: tx('Where your team and agents work together.', 'Waar je team en agents samenwerken.'),
    body: tx('Slack is the place where people, Salesforce and agents meet: a channel per deal or customer, approvals and alerts without switching screens.', 'Slack is de plek waar mensen, Salesforce en agents samenkomen: een kanaal per deal of klant, goedkeuringen en meldingen zonder van scherm te wisselen.'),
    we: [tx('Slack connected to Salesforce', 'Slack gekoppeld aan Salesforce'), tx('Channels, workflows and alerts', 'Kanalen, workflows en meldingen'), tx('Agents available in Slack', 'Agents beschikbaar in Slack')],
    chips: [tx('Deal channels', 'Dealkanalen'), tx('Approvals', 'Goedkeuringen'), tx('Alerts', 'Meldingen')], href: 'Services.html', cta: tx('About Slack', 'Over Slack') },
];

/* Left-hand text for the active layer (stack + rings) */
function HpCopy({ L, i, n }) {
  return (
    <div className="hp-copy" key={L.key}>
      <div className="hp-count"><b>{L.n}</b><span>/ {String(n).padStart(2, '0')}</span><small>{L.name}</small></div>
      <h3>{L.title}</h3>
      <p>{L.body}</p>
      <ul>{L.we.map((w, k) => <li key={k}><span aria-hidden className="hp-dot" />{w}</li>)}</ul>
      {L.links ? <div className="hp-links">{L.links.map(x => <a key={x.h} href={x.h}>{x.t} →</a>)}</div> : <a className="hp-link" href={L.href}>{L.cta} →</a>}
    </div>
  );
}

/* Phones / reduced motion: the layers as a simple list */
function HpList({ layers }) {
  return (
    <div className="hp-list">
      {layers.slice().reverse().map((L, i) => (
        <div key={L.key} className={'hp-list-item hp-tone--' + L.key}>
          <div className="hp-list-name"><b>{L.name}</b><small>{L.n}</small></div>
          <h3>{L.title}</h3><p>{L.body}</p>
          <div className="ck-chips">{L.chips.map(c => <span key={c}>{c}</span>)}</div>
        </div>
      ))}
    </div>
  );
}

/* One GSAP timeline that maps scroll progress to the active layer (0..n-1). */
function useLayerScroll(ref, n, setActive, extra) {
  React.useEffect(() => {
    if (!window.gsap || HP_REDUCE || !ref.current) return;
    const gsap = window.gsap; const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const root = ref.current;
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector('.hp-pin'), start: 'top top', end: '+=' + (n * 70) + '%', scrub: 0.6, pin: true } });
      tl.eventCallback('onUpdate', () => setActive(Math.min(n - 1, Math.floor(tl.progress() * n * 0.999 + 0.0001))));
      if (extra) extra(gsap, tl, root);
      else tl.to({}, { duration: n });
    });
    return () => mm.revert();
  }, []);
}

/* ---------- A · STACK ---------- */
function HomePlatformStack({ head, label }) {
  const layers = HP_LAYERS(); const n = layers.length;
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(HP_REDUCE ? n - 1 : 0);
  useLayerScroll(ref, n, setActive, (gsap, tl, root) => {
    root.querySelectorAll('.hp-slab').forEach((el, i) => {
      tl.fromTo(el, { y: -260, opacity: 0, rotate: i % 2 ? 2 : -2 }, { y: 0, opacity: 1, rotate: 0, duration: 0.6, ease: 'power3.out' }, i);
    });
    tl.to({}, { duration: 0.4 }, n - 0.4);
  });
  return (
    <section className="ck-section hp hp--stack" ref={ref}>
      <div className="container-wide hp-head">{label}<CkHead {...head} /></div>
      <div className="hp-pin">
        <div className="container-wide">
          <div className="hp-grid">
            <HpCopy L={layers[active]} i={active} n={n} />
            <div className="hp-stackviz" aria-hidden>
              {layers.slice().reverse().map((L) => {
                const i = layers.indexOf(L);
                return (
                  <div key={L.key} className={'hp-slab hp-tone--' + L.key + (i === active ? ' is-on' : '') + (i > active ? ' is-later' : '')}>
                    <b>{L.name}</b>
                    <div className="hp-slab-chips">{L.chips.map(c => <span key={c}>{c}</span>)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <HpList layers={layers} />
    </section>
  );
}

/* ---------- B · RINGS ---------- */
function HomePlatformRings({ head, label }) {
  const layers = HP_LAYERS(); const n = layers.length;
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(HP_REDUCE ? n - 1 : 0);
  useLayerScroll(ref, n, setActive);
  /* ring radii (in a 600×600 box): core = Data 360, then processes, Agentforce, Slack; systems orbit outside */
  const R = { data: 70, clouds: 135, agentforce: 195, slack: 255 };
  const sys = ['Exact', 'AFAS', 'NetSuite', 'Business Central', 'Twinfield', 'Outlook'];
  const lit = k => layers.findIndex(L => L.key === k) <= active;
  return (
    <section className="ck-section ck-section--dark hp hp--rings" ref={ref}>
      <div className="container-wide hp-head">{label}<CkHead {...head} /></div>
      <div className="hp-pin">
        <div className="container-wide">
          <div className="hp-grid">
            <HpCopy L={layers[active]} i={active} n={n} />
            <div className="hp-ringviz" aria-hidden>
              <svg viewBox="0 0 600 600">
                {sys.map((s, k) => { const a = (-90 + k * 60) * Math.PI / 180; const x = 300 + 292 * Math.cos(a), y = 300 + 292 * Math.sin(a);
                  return <line key={s} x1={x} y1={y} x2={300 + R.data * Math.cos(a)} y2={300 + R.data * Math.sin(a)} className={'hp-feed' + (lit('systems') ? ' on' : '')} pathLength="1" style={{ transitionDelay: (k * 80) + 'ms' }} />; })}
                {['slack', 'agentforce', 'clouds'].map(k => <circle key={k} cx="300" cy="300" r={R[k]} className={'hp-ring hp-ring--' + k + (lit(k) ? ' on' : '') + (layers[active].key === k ? ' is-active' : '')} />)}
                <circle cx="300" cy="300" r={R.data} className={'hp-core' + (lit('data') ? ' on' : '') + (layers[active].key === 'data' ? ' is-active' : '')} />
              </svg>
              {sys.map((s, k) => { const a = (-90 + k * 60) * Math.PI / 180;
                return <span key={s} className={'hp-sat' + (lit('systems') ? ' on' : '') + (layers[active].key === 'systems' ? ' is-active' : '')} style={{ left: (50 + 48.6 * Math.cos(a)) + '%', top: (50 + 48.6 * Math.sin(a)) + '%', transitionDelay: (k * 80) + 'ms' }}>{s}</span>; })}
              <span className={'hp-ringlabel hp-ringlabel--data' + (lit('data') ? ' on' : '')}>Data 360</span>
              <span className={'hp-ringlabel hp-ringlabel--clouds' + (lit('clouds') ? ' on' : '')}>Sales · Service · Field Service</span>
              <span className={'hp-ringlabel hp-ringlabel--agentforce' + (lit('agentforce') ? ' on' : '')}>Agentforce</span>
              <span className={'hp-ringlabel hp-ringlabel--slack' + (lit('slack') ? ' on' : '')}>Slack</span>
            </div>
          </div>
        </div>
      </div>
      <HpList layers={layers} />
    </section>
  );
}

/* ---------- C · RIDE (horizontal journey) ---------- */
function HomePlatformRide({ head, label }) {
  const layers = HP_LAYERS(); const n = layers.length;
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(0);
  useLayerScroll(ref, n, setActive, (gsap, tl, root) => {
    const track = root.querySelector('.hp-track');
    tl.to(track, { x: () => -(track.scrollWidth - root.querySelector('.hp-viewport').clientWidth), ease: 'none', duration: n });
  });
  return (
    <section className="ck-section ck-section--coral hp hp--ride" ref={ref}>
      <div className="container-wide hp-head">{label}<CkHead {...head} dark /></div>
      <div className="hp-pin">
        <div className="container-wide">
          <div className="hp-ride-head">
            <ol className="hp-steps">{layers.map((L, i) => <li key={L.key} className={i === active ? 'on' : i < active ? 'done' : ''}><span>{L.n}</span>{L.name}</li>)}</ol>
          </div>
        </div>
        <div className="hp-viewport">
          <div className="hp-track">
            {layers.map((L, i) => (
              <article key={L.key} className={'hp-panel hp-tone--' + L.key + (i === active ? ' is-on' : '')}>
                <div className="hp-panel-top"><b>{L.name}</b><small>{L.n} / {String(n).padStart(2, '0')}</small></div>
                <h3>{L.title}</h3>
                <p>{L.body}</p>
                <ul>{L.we.map((w, k) => <li key={k}><span aria-hidden className="hp-dot" />{w}</li>)}</ul>
                <div className="ck-chips">{L.chips.map(c => <span key={c}>{c}</span>)}</div>
                {L.links ? <div className="hp-links">{L.links.map(x => <a key={x.h} href={x.h}>{x.t} →</a>)}</div> : <a className="hp-link" href={L.href}>{L.cta} →</a>}
              </article>
            ))}
          </div>
        </div>
      </div>
      <HpList layers={layers} />
    </section>
  );
}

function HpStyles() {
  return (
    <style>{`
      .hp { overflow: hidden; }
      .hp-head .ck-head { margin-bottom: 0; }
      .hp-pin { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding-block: 40px; box-sizing: border-box; }
      @media (max-width: 899px) { .hp-head { margin-bottom: 24px; } }
      .hp-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
      .hp-copy { animation: hpIn 450ms var(--ease-out) both; }
      .hp-count { display: flex; align-items: baseline; gap: 8px; margin-bottom: 14px; }
      .hp-count b { font-size: 56px; font-weight: 500; letter-spacing: -.04em; line-height: 1; color: var(--intigris-coral); font-variant-numeric: tabular-nums; }
      .hp-count span { font-size: 18px; opacity: .55; }
      .hp-count small { margin-left: 10px; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; opacity: .75; }
      .hp-copy h3, .hp-panel h3, .hp-list-item h3 { margin: 0 0 12px; font-size: clamp(26px, 2.6vw, 38px); font-weight: 500; letter-spacing: -.025em; line-height: 1.08; }
      .hp-copy p, .hp-panel p { margin: 0 0 16px; font-size: 17px; line-height: 1.55; opacity: .85; max-width: 520px; }
      .hp-copy ul, .hp-panel ul { list-style: none; margin: 0 0 18px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
      .hp-copy li, .hp-panel li { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; }
      .hp h3 { color: inherit; }
      .hp-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--intigris-coral); flex: none; margin-top: 7px; }
      .hp-link, .hp-links a { font-weight: 500; text-decoration: none; color: inherit; border-bottom: 1.5px solid currentColor; padding-bottom: 2px; }
      .hp-links { display: flex; flex-wrap: wrap; gap: 8px 22px; }
      .hp-list { display: none; }
      @keyframes hpIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

      /* tones per layer */
      .hp-tone--systems { --hp-bg: #fff; --hp-fg: var(--intigris-brown-700); }
      .hp-tone--data { --hp-bg: var(--intigris-soft-blue); --hp-fg: var(--intigris-brown-700); }
      .hp-tone--clouds { --hp-bg: var(--intigris-coral); --hp-fg: var(--intigris-brown-700); }
      .hp-tone--agentforce { --hp-bg: var(--intigris-brown-700); --hp-fg: var(--intigris-off-white); }
      .hp-tone--slack { --hp-bg: var(--intigris-washed-green, #4c693a); --hp-fg: var(--intigris-off-white); }

      /* A · stack */
      .hp--stack { background: var(--intigris-off-white); color: var(--intigris-brown-700); }
      .hp-stackviz { display: flex; flex-direction: column; gap: 10px; }
      .hp-slab { background: var(--hp-bg); color: var(--hp-fg); border-radius: 18px; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; gap: 16px; box-shadow: 0 18px 30px -22px rgba(43,23,0,.5); transition: transform 400ms var(--ease-out), box-shadow 400ms, outline-color 300ms; outline: 3px solid transparent; outline-offset: 3px; }
      .hp-slab b { font-size: 20px; font-weight: 600; letter-spacing: -.02em; white-space: nowrap; }
      .hp-slab-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
      .hp-slab-chips span { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,.35); border: 1px solid rgba(43,23,0,.12); white-space: nowrap; }
      .hp-tone--agentforce .hp-slab-chips span, .hp-tone--slack .hp-slab-chips span { background: rgba(252,247,235,.12); border-color: rgba(252,247,235,.25); }
      .hp-slab.is-on { outline-color: var(--intigris-coral); transform: scale(1.03); box-shadow: 0 26px 44px -22px rgba(43,23,0,.6); }
      .hp-tone--clouds.hp-slab.is-on { outline-color: var(--intigris-brown-700); }

      /* B · rings */
      .hp-ringviz { position: relative; width: 100%; max-width: min(600px, calc(100vh - 260px)); margin: 0 auto; aspect-ratio: 1; }
      .hp-ringviz svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
      .hp-ring { fill: none; stroke: rgba(252,247,235,.12); stroke-width: 54; transition: stroke 500ms; }
      .hp-ring--clouds.on { stroke: rgba(255,95,54,.85); }
      .hp-ring--agentforce.on { stroke: rgba(252,247,235,.22); }
      .hp-ring--slack.on { stroke: rgba(154,184,226,.45); }
      .hp-ring.is-active { stroke-width: 60; }
      .hp-core { fill: rgba(252,247,235,.08); transition: fill 500ms; }
      .hp-core.on { fill: var(--intigris-soft-blue); }
      .hp-feed { stroke: rgba(252,247,235,.35); stroke-width: 2; stroke-dasharray: 1 1; stroke-dashoffset: 1; transition: stroke-dashoffset 900ms var(--ease-out); }
      .hp-feed.on { stroke-dashoffset: 0; }
      .hp-sat { position: absolute; translate: -50% -50%; padding: 6px 12px; border-radius: 999px; background: #fff; color: var(--intigris-brown-700); font-size: 12.5px; font-weight: 500; white-space: nowrap; opacity: .25; transition: opacity 500ms, box-shadow 300ms; }
      .hp-sat.on { opacity: 1; } .hp-sat.is-active { box-shadow: 0 0 0 3px var(--intigris-coral); }
      .hp-ringlabel { position: absolute; left: 50%; translate: -50% -50%; font-size: 13px; font-weight: 600; letter-spacing: .02em; color: rgba(252,247,235,.35); white-space: nowrap; transition: color 500ms; }
      .hp-ringlabel.on { color: var(--intigris-off-white); }
      .hp-ringlabel--data { top: 50%; } .hp-ringlabel--data.on { color: var(--intigris-brown-700); }
      .hp-ringlabel--clouds { top: calc(50% - 22.5%); } .hp-ringlabel--clouds.on { color: var(--intigris-brown-700); }
      .hp-ringlabel--agentforce { top: calc(50% - 32.5%); }
      .hp-ringlabel--slack { top: calc(50% - 42.5%); }

      /* C · ride */
      .hp--ride .hp-pin { justify-content: center; }
      .hp-ride-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
      .hp-ride-head .ck-head { margin-bottom: 20px; }
      .hp-steps { list-style: none; margin: 0 0 clamp(28px, 4vw, 44px); padding: 0; display: flex; gap: 6px; flex-wrap: wrap; }
      .hp-steps li { padding: 8px 14px; border-radius: 999px; font-size: 13.5px; font-weight: 500; background: rgba(43,23,0,.1); color: rgba(43,23,0,.7); display: flex; gap: 6px; transition: background 300ms, color 300ms; }
      .hp-steps li span { opacity: .6; font-variant-numeric: tabular-nums; }
      .hp-steps li.done { background: rgba(43,23,0,.2); color: var(--intigris-brown-700); }
      .hp-steps li.on { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .hp-viewport { overflow: visible; padding-left: max(24px, calc((100vw - 1240px) / 2)); }
      .hp-track { display: flex; gap: 20px; width: max-content; padding-right: 10vw; }
      .hp-panel { width: min(620px, 72vw); flex: none; background: var(--hp-bg); color: var(--hp-fg); border-radius: 28px; padding: 32px 34px; box-shadow: 0 30px 60px -32px rgba(43,23,0,.6); display: flex; flex-direction: column; transition: transform 500ms var(--ease-out); }
      .hp-panel.is-on { transform: translateY(-8px); }
      .hp-panel-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
      .hp-panel-top b { font-size: 24px; font-weight: 600; letter-spacing: -.02em; }
      .hp-panel-top small { font-size: 12px; opacity: .65; font-variant-numeric: tabular-nums; }
      .hp-panel .ck-chips { margin-bottom: 18px; }
      .hp-panel .ck-chips span { background: rgba(255,255,255,.3); color: inherit; border-color: rgba(43,23,0,.15); }
      .hp-tone--agentforce.hp-panel .ck-chips span, .hp-tone--slack.hp-panel .ck-chips span { background: rgba(252,247,235,.12); border-color: rgba(252,247,235,.25); }
      .hp-tone--clouds.hp-panel { box-shadow: 0 0 0 2px var(--intigris-brown-700), 0 30px 60px -32px rgba(43,23,0,.6); }
      .hp-tone--clouds .hp-dot { background: var(--intigris-brown-700); }

      /* phones + reduced motion: plain list */
      @media (max-width: 899px) {
        .hp-pin { display: none; }
        .hp-list { display: grid; gap: 12px; padding: 0 20px; max-width: 640px; margin: 0 auto; }
        .hp-list-item { background: var(--hp-bg); color: var(--hp-fg); border-radius: 20px; padding: 22px; }
        .hp-list-name { display: flex; justify-content: space-between; margin-bottom: 10px; } .hp-list-name b { font-size: 20px; }
        .hp-list-item h3 { font-size: 22px; } .hp-list-item p { margin: 0 0 12px; font-size: 15.5px; line-height: 1.5; opacity: .85; }
        .hp-list-item .ck-chips span { background: rgba(255,255,255,.3); color: inherit; }
      }
      @media (prefers-reduced-motion: reduce) { .hp-copy { animation: none; } .hp-viewport { overflow-x: auto; } }
    `}</style>
  );
}

Object.assign(window, { HomePlatformStack, HomePlatformRings, HomePlatformRide, HpStyles, HP_LAYERS });
