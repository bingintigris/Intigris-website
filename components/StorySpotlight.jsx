/* ==================================================================== */
/*  CUSTOMER STORY SPOTLIGHT — text + a three-company switcher on the     */
/*  left, one story card on the right (logo, snapshot of what we did,     */
/*  verbatim quote). Three concepts (SpotlightVariations.html):           */
/*    pills · segmented switch; card content fades up                     */
/*    logos · three logo tiles; card with a dark quote band, flips         */
/*    tabs  · numbered name tabs; card slides out right, in from left      */
/*  Moves on by itself every 7s (pauses on hover / reduced motion).       */
/* ==================================================================== */

const SS_REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Customer logos (assets/logos). Stories without a logo show their name. */
const SS_LOGOS = { WeTransfer: 'assets/logos/wetransfer.svg', EVBox: 'assets/logos/evbox.svg', Opcharge: 'assets/logos/opcharge.svg' };

function SsLogo({ s, className = '' }) {
  const src = SS_LOGOS[s.name];
  return src ? <img className={'ss-logo ' + className} src={src} alt={s.name} /> : <b className={'ss-logo ss-logo--text ' + className}>{s.name}</b>;
}

function StorySpotlight({ head, stories, variant = 'pills', label, auto = 7000 }) {
  const list = stories.slice(0, 3);
  const [k, setK] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const [tick, setTick] = React.useState(0); /* restarts the progress line */
  React.useEffect(() => {
    if (SS_REDUCE || hover) return;
    const t = setTimeout(() => { setK(i => (i + 1) % list.length); setTick(x => x + 1); }, auto);
    return () => clearTimeout(t);
  }, [k, hover, auto, list.length, tick]);
  const pick = i => { setK(i); setTick(x => x + 1); };
  const s = list[k];

  const switcher = variant === 'pills' ? (
    <div className="ss-pills" role="tablist" style={{ '--i': k, '--n': list.length }}>
      <span className="ss-pills-thumb" aria-hidden />
      {list.map((x, i) => (
        <button key={x.name} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => pick(i)}>
          {x.name}
          {i === k && !SS_REDUCE && <i className={'ss-progress' + (hover ? ' is-paused' : '')} key={tick} style={{ animationDuration: auto + 'ms' }} />}
        </button>
      ))}
    </div>
  ) : variant === 'logos' ? (
    <div className="ss-logotabs" role="tablist">
      {list.map((x, i) => (
        <button key={x.name} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => pick(i)} aria-label={x.name}>
          <SsLogo s={x} />
        </button>
      ))}
    </div>
  ) : (
    <div className="ss-tabs" role="tablist">
      {list.map((x, i) => (
        <button key={x.name} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => pick(i)}>
          <small>{String(i + 1).padStart(2, '0')}</small>{x.name}
        </button>
      ))}
    </div>
  );

  const card = variant === 'logos' ? (
    <article className="ss-card ss-card--logos" key={s.name}>
      <div className="ss-band">
        <span className="ss-mark" aria-hidden>“</span>
        <blockquote>{s.quote || s.headline}</blockquote>
        <div className="ss-who"><b>{s.who}</b>{s.role && <span>{s.role}, {s.name}</span>}</div>
      </div>
      <div className="ss-facts">
        <div className="ss-facts-logo"><SsLogo s={s} /></div>
        <dl>
          <div><dt>{tx('Sector', 'Branche')}</dt><dd>{s.sector}</dd></div>
          <div><dt>{tx('What we built', 'Wat we bouwden')}</dt><dd>{s.what}</dd></div>
          <div><dt>{tx('Products', 'Producten')}</dt><dd><div className="ck-chips">{s.clouds.map(c => <span key={c}>{c}</span>)}</div></dd></div>
        </dl>
      </div>
    </article>
  ) : (
    variant === 'tabs' ? (
      /* C: quote first and large, the snapshot as a strip along the bottom */
      <article className="ss-card ss-card--tabs" key={s.name}>
        <SsLogo s={s} className="ss-watermark" />
        <div className="ss-card-top"><SsLogo s={s} /><small>{s.sector}</small></div>
        <blockquote className="ss-quote-xl">{s.quote ? '“' + s.quote + '”' : s.headline}</blockquote>
        <div className="ss-who"><b>{s.who}</b>{s.role && <span>{s.role}, {s.name}</span>}</div>
        <div className="ss-strip">
          <small>{tx('WHAT WE DID', 'WAT WE DEDEN')}</small>
          <p>{s.what}</p>
          <div className="ck-chips">{s.clouds.map(c => <span key={c}>{c}</span>)}</div>
        </div>
      </article>
    ) : (
    <article className={'ss-card ss-card--' + variant} key={s.name}>
      <div className="ss-card-top"><SsLogo s={s} /><small>{s.sector}</small></div>
      <div className="ss-snap">
        <small>{tx('WHAT WE DID', 'WAT WE DEDEN')}</small>
        <p>{s.what}</p>
        <div className="ck-chips">{s.clouds.map(c => <span key={c}>{c}</span>)}</div>
      </div>
      <blockquote>{s.quote ? '“' + s.quote + '”' : s.headline}</blockquote>
      <div className="ss-who"><b>{s.who}</b>{s.role && <span>{s.role}, {s.name}</span>}</div>
    </article>
    )
  );

  return (
    <section className={'ck-section ck-section--coral ss ss--' + variant} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="container-wide ss-grid">
        <div className="ss-text">
          {label}
          <CkHead {...head} dark />
          {switcher}
        </div>
        <div className="ss-stage">{card}</div>
      </div>
    </section>
  );
}

function SsStyles() {
  return (
    <style>{`
      .ss { overflow: hidden; }
      .ss-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
      .ss-text .ck-head { margin-bottom: 28px; }
      .ss .ck-lede { color: rgba(43,23,0,.82); }
      .ss-stage { position: relative; min-height: 460px; display: grid; align-items: center; perspective: 1400px; }
      .ss-logo { display: block; height: 30px; width: auto; max-width: 170px; object-fit: contain; }
      .ss-logo--text { height: auto; font-size: 22px; font-weight: 600; letter-spacing: -.02em; }
      .ss-card { position: relative; background: var(--intigris-off-white); color: var(--intigris-brown-700); border-radius: 26px; padding: 32px 34px; box-shadow: 0 34px 64px -32px rgba(43,23,0,.6); display: flex; flex-direction: column; gap: 18px; overflow: hidden; }
      .ss-card-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .ss-card-top small, .ss-snap small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral-700, #d9451f); }
      .ss-snap { display: flex; flex-direction: column; gap: 8px; padding: 16px 18px; background: rgba(43,23,0,.05); border-radius: 16px; }
      .ss-snap p { margin: 0; font-size: 15.5px; line-height: 1.55; }
      .ss-card blockquote { margin: 0; font-size: clamp(21px, 1.9vw, 27px); line-height: 1.3; letter-spacing: -.015em; font-weight: 500; }
      .ss-who { display: flex; flex-direction: column; gap: 2px; font-size: 14px; }
      .ss-who b { font-weight: 500; font-size: 15px; } .ss-who span { opacity: .65; }
      .ss .ck-chips span { background: rgba(43,23,0,.06); color: var(--intigris-brown-700); border-color: rgba(43,23,0,.12); }

      /* A · pills */
      .ss-pills { position: relative; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); background: rgba(43,23,0,.12); border-radius: 999px; padding: 6px; max-width: 520px; }
      .ss-pills-thumb { position: absolute; top: 6px; bottom: 6px; left: 6px; width: calc((100% - 12px) / var(--n)); border-radius: 999px; background: var(--intigris-off-white); box-shadow: 0 8px 18px -10px rgba(43,23,0,.5); transform: translateX(calc(var(--i) * 100%)); transition: transform 500ms cubic-bezier(.3,.9,.3,1); }
      .ss-pills button { position: relative; z-index: 1; appearance: none; border: 0; background: none; font: inherit; font-size: 16px; font-weight: 500; padding: 14px 10px; border-radius: 999px; cursor: pointer; color: rgba(43,23,0,.7); overflow: hidden; }
      .ss-pills button.on { color: var(--intigris-brown-700); }
      .ss-progress { position: absolute; left: 22%; right: 22%; bottom: 6px; height: 2px; border-radius: 2px; background: var(--intigris-coral); transform-origin: left; animation: ssProg linear both; }
      .ss-progress.is-paused { animation-play-state: paused; }
      .ss-card--pills { animation: ssFadeUp 520ms var(--ease-out) both; }
      @keyframes ssProg { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes ssFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

      /* B · logo tiles + band card */
      .ss-logotabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 540px; }
      .ss-logotabs button { appearance: none; border: 2px solid transparent; background: rgba(252,247,235,.55); border-radius: 18px; height: 84px; display: grid; place-items: center; cursor: pointer; padding: 0 14px; transition: background 250ms, transform 300ms var(--ease-out), box-shadow 300ms, border-color 250ms; }
      .ss-logotabs button .ss-logo { height: 26px; max-width: 120px; opacity: .55; transition: opacity 250ms; }
      .ss-logotabs button:hover .ss-logo { opacity: .85; }
      .ss-logotabs button.on { background: var(--intigris-off-white); transform: translateY(-6px); box-shadow: 0 16px 28px -16px rgba(43,23,0,.55); border-color: var(--intigris-brown-700); }
      .ss-logotabs button.on .ss-logo { opacity: 1; }
      .ss-card--logos { padding: 0; gap: 0; animation: ssFlip 650ms cubic-bezier(.2,.8,.2,1) both; transform-origin: 50% 50%; }
      .ss-band { background: var(--intigris-brown-700); color: var(--intigris-off-white); padding: 30px 34px 26px; display: flex; flex-direction: column; gap: 14px; position: relative; }
      .ss-mark { position: absolute; right: 26px; top: -18px; font-size: 140px; line-height: 1; color: var(--intigris-coral); font-weight: 500; }
      .ss-band blockquote { position: relative; }
      .ss-band .ss-who span { color: rgba(252,247,235,.7); opacity: 1; }
      .ss-facts { display: grid; grid-template-columns: 140px minmax(0, 1fr); gap: 20px; padding: 24px 34px 28px; align-items: start; }
      .ss-facts-logo { padding-top: 4px; } .ss-facts-logo .ss-logo { height: 28px; max-width: 130px; }
      .ss-facts dl { margin: 0; display: flex; flex-direction: column; gap: 12px; }
      .ss-facts dt { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral-700, #d9451f); margin-bottom: 3px; }
      .ss-facts dd { margin: 0; font-size: 15px; line-height: 1.5; }
      @keyframes ssFlip { from { opacity: 0; transform: rotateY(-70deg) scale(.96); } to { opacity: 1; transform: none; } }

      /* C · name tabs + sliding card with watermark */
      .ss-tabs { display: flex; gap: clamp(18px, 3vw, 34px); flex-wrap: wrap; border-bottom: 1.5px solid rgba(43,23,0,.25); }
      .ss-tabs button { appearance: none; border: 0; background: none; font: inherit; font-size: clamp(20px, 2vw, 26px); font-weight: 500; letter-spacing: -.02em; padding: 0 0 14px; cursor: pointer; color: rgba(43,23,0,.55); position: relative; display: flex; align-items: baseline; gap: 8px; transition: color 250ms; }
      .ss-tabs button small { font-size: 12px; font-variant-numeric: tabular-nums; letter-spacing: 0; }
      .ss-tabs button::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1.5px; height: 3px; background: var(--intigris-brown-700); transform: scaleX(0); transform-origin: left; transition: transform 400ms var(--ease-out); }
      .ss-tabs button.on { color: var(--intigris-brown-700); }
      .ss-tabs button.on::after { transform: scaleX(1); }
      .ss-card--tabs { animation: ssSlideIn 700ms cubic-bezier(.2,.8,.2,1) both; }
      .ss-watermark { position: absolute; right: -30px; bottom: -20px; height: 140px !important; max-width: 360px !important; opacity: .05; pointer-events: none; }
      .ss-card--tabs > *:not(.ss-watermark) { position: relative; }
      .ss-quote-xl { font-size: clamp(26px, 2.5vw, 36px) !important; line-height: 1.15 !important; letter-spacing: -.025em !important; }
      .ss-strip { margin: 6px -34px -32px; padding: 18px 34px 24px; background: var(--intigris-brown-700); color: var(--intigris-off-white); display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 6px 18px; align-items: baseline; }
      .ss-strip small { font-size: 11px; letter-spacing: .14em; font-weight: 600; color: var(--intigris-coral); grid-row: span 2; }
      .ss-strip p { margin: 0; font-size: 14.5px; line-height: 1.5; color: rgba(252,247,235,.85); }
      .ss-strip .ck-chips span { background: rgba(252,247,235,.1); color: var(--intigris-off-white); border-color: rgba(252,247,235,.22); }
      @keyframes ssSlideIn { from { opacity: 0; transform: translateX(-60px) rotate(-2deg); } to { opacity: 1; transform: none; } }

      @media (max-width: 960px) {
        .ss-grid { grid-template-columns: 1fr; }
        .ss-stage { min-height: 0; }
        .ss-facts { grid-template-columns: 1fr; }
      }
      @media (prefers-reduced-motion: reduce) { .ss-card { animation: none !important; } .ss-pills-thumb { transition: none; } }
    `}</style>
  );
}

Object.assign(window, { StorySpotlight, SsStyles, SS_LOGOS });
