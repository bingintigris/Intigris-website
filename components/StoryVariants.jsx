/* ==================================================================== */
/*  CUSTOMER STORIES — five redesigns to choose from (StoriesVariations)  */
/*  A · Quote wall:  two rows of quote cards drifting in opposite         */
/*                   directions; hover pauses.                            */
/*  B · Spotlight:   one big quote at a time with story-style progress    */
/*                   bars that advance by themselves.                     */
/*  C · Bento:       a colourful magazine grid with a featured story.     */
/*  D · Card deck:   a stack of cards; swipe or click to the next one.    */
/*  E · Name list:   huge customer names; hover one and its quote card     */
/*                   follows the cursor (tap on touch screens).           */
/*  Data: CK_STORIES() entries { name, sector, who, role, quote |         */
/*  headline, what, clouds, metric? }. Quotes are verbatim, never edited. */
/* ==================================================================== */

const SV_REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const svState = React.useState, svEffect = React.useEffect, svRef = React.useRef;

function SvLabel({ letter, text, light }) {
  return <div className={'sv-label' + (light ? ' sv-label--light' : '')}><span>{letter}</span> {text}</div>;
}
const svWho = s => (s.role ? s.role + ', ' : '') + s.name;
const svText = s => s.quote ? '“' + s.quote + '”' : s.headline;

/* ---------- A · QUOTE WALL ---------- */
function StoriesWall({ head, stories }) {
  const row = (list, rev) => (
    <div className={'sv-wall-row' + (rev ? ' is-rev' : '')}>
      <div className="sv-wall-track">
        {list.concat(list).map((s, i) => (
          <figure key={i} className="sv-wall-card" aria-hidden={i >= list.length}>
            <div className="sv-wall-top"><b>{s.name}</b><small>{s.sector}</small></div>
            <blockquote>{svText(s)}</blockquote>
            <figcaption>{s.who}{s.role ? ' · ' + s.role : ''}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
  return (
    <section className="ck-section ck-section--soft sv-a">
      <div className="container-wide">
        <SvLabel letter="A" text={tx('Quote wall: two rows drifting past', 'Quote-muur: twee rijen die voorbij drijven')} />
        <CkHead {...head} />
      </div>
      {row(stories, false)}
      {row(stories.slice().reverse(), true)}
    </section>
  );
}

/* ---------- B · SPOTLIGHT ---------- */
function StoriesSpotlight({ head, stories }) {
  const [k, setK] = svState(0);
  const [paused, setPaused] = svState(false);
  const s = stories[k];
  const next = () => setK(i => (i + 1) % stories.length);
  return (
    <section className="ck-section ck-section--dark sv-b" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container-wide">
        <SvLabel letter="B" light text={tx('Spotlight: one big quote at a time', 'Spotlight: één grote quote tegelijk')} />
        <CkHead {...head} />
        <div className="sv-b-bars" role="tablist">
          {stories.map((x, i) => (
            <button key={x.name} type="button" role="tab" aria-selected={i === k} onClick={() => setK(i)} className={i < k ? 'done' : i === k ? 'on' : ''}>
              <i>{i === k && <span key={k + (paused ? 'p' : '')} className={paused || SV_REDUCE ? 'is-paused' : ''} onAnimationEnd={next} />}</i>
              <small>{x.name}</small>
            </button>
          ))}
        </div>
        <div className="sv-b-stage" key={s.name}>
          <div className="sv-b-mark" aria-hidden>“</div>
          <blockquote className={s.quote ? '' : 'is-headline'}>{s.quote || s.headline}</blockquote>
          <div className="sv-b-foot">
            <div className="sv-b-who"><b>{s.who}</b><span>{svWho(s)}</span></div>
            <div className="sv-b-what"><p>{s.what}</p><div className="ck-chips">{s.clouds.map(c => <span key={c}>{c}</span>)}</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- C · BENTO ---------- */
const SV_TONES = ['coral', 'blue', 'green', 'paper', 'brown'];
function StoriesBento({ head, stories, onCta }) {
  return (
    <section className="ck-section sv-c">
      <div className="container-wide">
        <SvLabel letter="C" text={tx('Bento: a magazine grid', 'Bento: een magazine-grid')} />
        <CkHead {...head} />
        <div className="sv-bento">
          {stories.slice(0, 5).map((s, i) => (
            <article key={s.name} className={'sv-tile sv-tile--' + SV_TONES[i % SV_TONES.length] + (i === 0 ? ' is-feature' : '')}>
              <div className="sv-tile-top"><b>{s.name}</b><small>{s.sector}</small></div>
              <blockquote>{svText(s)}</blockquote>
              <div className="sv-tile-foot">
                <span>{s.who}{s.role ? ', ' + s.role : ''}</span>
                {i === 0 && <div className="ck-chips">{s.clouds.map(c => <span key={c}>{c}</span>)}</div>}
              </div>
            </article>
          ))}
          <button type="button" className="sv-tile sv-tile--cta" onClick={onCta}>
            <span>{tx('Your story next?', 'Jouw verhaal hierna?')}</span>
            <b>{tx('Plan 30 minutes', 'Plan 30 minuten')} →</b>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- D · CARD DECK ---------- */
function StoriesDeck({ head, stories }) {
  const [order, setOrder] = svState(() => stories.map((_, i) => i));
  const [drag, setDrag] = svState(0);
  const [fly, setFly] = svState(0); /* -1 / 1 while the top card flies out */
  const start = svRef(null);
  const send = dir => {
    if (fly) return;
    if (SV_REDUCE) { setOrder(o => o.slice(1).concat(o[0])); return; }
    setFly(dir || 1);
    setTimeout(() => { setOrder(o => o.slice(1).concat(o[0])); setFly(0); setDrag(0); }, 380);
  };
  const back = () => { if (!fly) setOrder(o => [o[o.length - 1]].concat(o.slice(0, -1))); };
  const onDown = e => { if (fly) return; start.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = e => { if (start.current !== null) setDrag(e.clientX - start.current); };
  const onUp = () => { if (start.current === null) return; start.current = null; if (Math.abs(drag) > 110) send(drag > 0 ? 1 : -1); else setDrag(0); };
  const top = order[0];
  return (
    <section className="ck-section ck-section--coral sv-d">
      <div className="container-wide sv-d-grid">
        <div>
          <SvLabel letter="D" text={tx('Card deck: swipe to the next story', 'Kaartstapel: swipe naar het volgende verhaal')} />
          <CkHead {...head} dark />
          <div className="sv-d-count"><b>{String(top + 1).padStart(2, '0')}</b><span>/ {String(stories.length).padStart(2, '0')}</span></div>
          <div className="sv-d-nav">
            <button type="button" onClick={back} aria-label={tx('Previous story', 'Vorig verhaal')}>←</button>
            <button type="button" onClick={() => send(1)} aria-label={tx('Next story', 'Volgend verhaal')}>→</button>
          </div>
          <ul className="sv-d-names">{stories.map((x, i) => <li key={x.name} className={i === top ? 'on' : ''}>{x.name}</li>)}</ul>
        </div>
        <div className="sv-deck">
          {order.slice(0, 4).reverse().map((idx, r) => {
            const depth = Math.min(order.length, 4) - 1 - r; /* 0 = top card */
            const s = stories[idx];
            const isTop = depth === 0;
            const x = isTop ? (fly ? fly * 700 : drag) : 0;
            const style = { transform: `translate(${x + depth * 14}px, ${depth * 14}px) rotate(${isTop ? x / 18 : depth * 2.5}deg)`, zIndex: 10 - depth, transition: isTop && !fly && drag ? 'none' : undefined, opacity: isTop && fly ? 0 : 1 };
            return (
              <article key={idx} className={'sv-card' + (isTop ? ' is-top' : '')} style={style}
                onPointerDown={isTop ? onDown : undefined} onPointerMove={isTop ? onMove : undefined} onPointerUp={isTop ? onUp : undefined} onPointerCancel={isTop ? onUp : undefined}>
                <div className="sv-card-top"><b>{s.name}</b><small>{s.sector}</small></div>
                <blockquote>{svText(s)}</blockquote>
                <p>{s.what}</p>
                <div className="sv-card-foot"><span>{s.who}{s.role ? ', ' + s.role : ''}</span><div className="ck-chips">{s.clouds.slice(0, 3).map(c => <span key={c}>{c}</span>)}</div></div>
                {isTop && <small className="sv-card-hint">{tx('Drag or use the arrows', 'Sleep of gebruik de pijlen')} ↔</small>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- E · NAME LIST WITH FLOATING QUOTE ---------- */
function StoriesNames({ head, stories }) {
  const [hover, setHover] = svState(-1);
  const [open, setOpen] = svState(-1);
  const [pos, setPos] = svState([0, 0]);
  const box = svRef(null);
  const onMove = e => { const r = box.current.getBoundingClientRect(); setPos([e.clientX - r.left, e.clientY - r.top]); };
  const h = stories[hover];
  return (
    <section className="ck-section sv-e">
      <div className="container-wide">
        <SvLabel letter="E" text={tx('Name list: hover a customer', 'Namenlijst: ga over een klant')} />
        <CkHead {...head} />
        <ol className="sv-e-list" ref={box} onMouseMove={onMove} onMouseLeave={() => setHover(-1)}>
          {stories.map((s, i) => (
            <li key={s.name} className={(i === hover ? 'is-hover ' : '') + (i === open ? 'is-open' : '')} onMouseEnter={() => setHover(i)}>
              <button type="button" onClick={() => setOpen(i === open ? -1 : i)} aria-expanded={i === open}>
                <span className="sv-e-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="sv-e-name">{s.name}</span>
                <span className="sv-e-sector">{s.sector}</span>
              </button>
              <div className="sv-e-inline"><blockquote>{svText(s)}</blockquote><span>{s.who}{s.role ? ', ' + s.role : ''}</span></div>
            </li>
          ))}
          {h && (
            <div className="sv-e-float" style={{ left: pos[0], top: pos[1] }} aria-hidden key={h.name}>
              <blockquote>{svText(h)}</blockquote>
              <span>{h.who}{h.role ? ', ' + h.role : ''}</span>
              <div className="ck-chips">{h.clouds.map(c => <span key={c}>{c}</span>)}</div>
            </div>
          )}
        </ol>
      </div>
    </section>
  );
}

function SvStyles() {
  return (
    <style>{`
      .sv-label { display: inline-flex; align-items: center; gap: 12px; font-size: 15px; margin-bottom: 26px; color: var(--intigris-brown-700); }
      .sv-label--light { color: var(--intigris-off-white); }
      .sv-label span { width: 34px; height: 34px; border-radius: 50%; background: var(--intigris-brown-700); color: var(--intigris-off-white); display: grid; place-items: center; font-weight: 700; }
      .sv-label--light span { background: var(--intigris-coral); color: var(--intigris-brown-700); }
      .sv-a .sv-label span, .sv-c .sv-label span, .sv-e .sv-label span { background: var(--intigris-coral); color: var(--intigris-brown-700); }

      /* A · wall */
      .sv-a { overflow: hidden; }
      .sv-wall-row { overflow: hidden; padding-block: 10px; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
      .sv-wall-track { display: flex; gap: 18px; width: max-content; animation: svMarquee 70s linear infinite; }
      .sv-wall-row.is-rev .sv-wall-track { animation-direction: reverse; animation-duration: 80s; }
      .sv-wall-row:hover .sv-wall-track { animation-play-state: paused; }
      .sv-wall-card { margin: 0; width: 400px; flex: none; background: #fff; border-radius: 20px; padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 14px 30px -20px rgba(43,23,0,.35); transition: transform 300ms var(--ease-out); }
      .sv-wall-card:hover { transform: translateY(-4px); }
      .sv-wall-top { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
      .sv-wall-top b { font-size: 18px; font-weight: 600; color: var(--intigris-brown-700); }
      .sv-wall-top small { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--intigris-coral-700, #d9451f); font-weight: 600; }
      .sv-wall-card blockquote { margin: 0; font-size: 17px; line-height: 1.5; color: var(--intigris-brown-700); flex: 1; }
      .sv-wall-card figcaption { font-size: 13.5px; color: rgba(43,23,0,.6); }
      @keyframes svMarquee { to { transform: translateX(-50%); } }

      /* B · spotlight */
      .sv-b-bars { display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); gap: 10px; margin: 8px 0 34px; }
      .sv-b-bars button { appearance: none; border: 0; background: none; font: inherit; color: rgba(252,247,235,.55); text-align: left; cursor: pointer; padding: 0; display: flex; flex-direction: column; gap: 8px; }
      .sv-b-bars button.on { color: var(--intigris-off-white); }
      .sv-b-bars i { display: block; height: 4px; border-radius: 2px; background: rgba(252,247,235,.18); overflow: hidden; }
      .sv-b-bars button.done i { background: rgba(252,247,235,.55); }
      .sv-b-bars i span { display: block; height: 100%; background: var(--intigris-coral); animation: svFill 6.5s linear both; }
      .sv-b-bars i span.is-paused { animation-play-state: paused; }
      .sv-b-bars small { font-size: 13px; font-weight: 500; }
      .sv-b-stage { position: relative; padding-left: clamp(0px, 6vw, 90px); margin-top: 64px; animation: ckFade 450ms var(--ease-out) both; }
      .sv-b-what .ck-chips span { background: rgba(252,247,235,.1); color: var(--intigris-off-white); border: 1px solid rgba(252,247,235,.22); }
      .sv-b-mark { position: absolute; left: -10px; top: -40px; font-size: clamp(140px, 18vw, 260px); line-height: 1; color: var(--intigris-coral); font-weight: 500; opacity: .9; pointer-events: none; }
      .sv-b-stage blockquote { margin: 0; font-size: clamp(28px, 3.6vw, 52px); line-height: 1.12; letter-spacing: -.03em; font-weight: 500; color: var(--intigris-off-white); max-width: 22ch; max-width: 980px; position: relative; }
      .sv-b-stage blockquote.is-headline { font-style: italic; }
      .sv-b-foot { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 32px; margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(252,247,235,.16); }
      .sv-b-who { display: flex; flex-direction: column; gap: 4px; }
      .sv-b-who b { font-size: 18px; font-weight: 500; color: var(--intigris-off-white); }
      .sv-b-who span { font-size: 14.5px; color: rgba(252,247,235,.6); }
      .sv-b-what p { margin: 0 0 12px; font-size: 16px; line-height: 1.55; color: rgba(252,247,235,.8); }
      @keyframes svFill { from { width: 0; } to { width: 100%; } }

      /* C · bento */
      .sv-c { background: var(--intigris-off-white); }
      .sv-bento { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: auto; gap: 14px; }
      .sv-tile { min-height: 220px; border-radius: 22px; padding: 24px; display: flex; flex-direction: column; gap: 14px; color: var(--intigris-brown-700); transition: transform 300ms var(--ease-out), box-shadow 300ms; }
      .sv-tile:hover { transform: translateY(-4px); box-shadow: 0 24px 40px -26px rgba(43,23,0,.45); }
      .sv-tile.is-feature { grid-column: span 2; grid-row: span 2; padding: 34px; }
      .sv-tile-top { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
      .sv-tile-top b { font-size: 18px; font-weight: 600; }
      .sv-tile-top small { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; opacity: .7; }
      .sv-tile blockquote { margin: 0; font-size: 16.5px; line-height: 1.5; flex: 1; }
      .sv-tile.is-feature blockquote { font-size: clamp(26px, 2.6vw, 38px); line-height: 1.15; letter-spacing: -.025em; font-weight: 500; }
      .sv-tile.is-feature .sv-tile-top b { font-size: 26px; }
      .sv-tile-foot { display: flex; flex-direction: column; gap: 12px; font-size: 13.5px; opacity: .85; }
      .sv-tile--coral { background: var(--intigris-coral); }
      .sv-tile--blue { background: var(--intigris-soft-blue); }
      .sv-tile--green { background: var(--intigris-washed-green, #4c693a); color: var(--intigris-off-white); }
      .sv-tile--paper { background: #fff; }
      .sv-tile--brown { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .sv-tile--cta { grid-column: span 4; min-height: 0; height: auto; flex-direction: row; justify-content: space-between; align-items: center; appearance: none; border: 2px dashed rgba(43,23,0,.3); background: transparent; font: inherit; cursor: pointer; padding: 22px 28px; }
      .sv-tile--cta span { font-size: 20px; }
      .sv-tile--cta b { font-size: 18px; font-weight: 500; color: var(--intigris-coral-700, #d9451f); }
      .sv-tile--coral .ck-chips span, .sv-tile--blue .ck-chips span { background: rgba(43,23,0,.1); color: var(--intigris-brown-700); border-color: transparent; }

      /* D · deck */
      .sv-d-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(28px, 5vw, 80px); align-items: center; }
      .sv-d-count { display: flex; align-items: baseline; gap: 8px; color: var(--intigris-brown-700); margin-top: 6px; }
      .sv-d-count b { font-size: 64px; font-weight: 500; letter-spacing: -.04em; font-variant-numeric: tabular-nums; }
      .sv-d-count span { font-size: 20px; opacity: .6; }
      .sv-d-nav { display: flex; gap: 10px; margin: 14px 0 18px; }
      .sv-d-nav button { width: 52px; height: 52px; border-radius: 50%; border: 1.5px solid var(--intigris-brown-700); background: transparent; font-size: 20px; color: var(--intigris-brown-700); cursor: pointer; transition: background 200ms, color 200ms; }
      .sv-d-nav button:hover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
      .sv-d-names { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: 15px; color: rgba(43,23,0,.55); }
      .sv-d-names li.on { color: var(--intigris-brown-700); font-weight: 600; }
      .sv-deck { position: relative; height: 440px; }
      .sv-card { position: absolute; inset: 0 40px 40px 0; background: var(--intigris-off-white); color: var(--intigris-brown-700); border-radius: 26px; padding: 32px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 30px 50px -30px rgba(43,23,0,.55); transition: transform 380ms cubic-bezier(.2,.8,.2,1), opacity 380ms; touch-action: pan-y; user-select: none; }
      .sv-card.is-top { cursor: grab; }
      .sv-card.is-top:active { cursor: grabbing; }
      .sv-card-top { display: flex; justify-content: space-between; align-items: baseline; }
      .sv-card-top b { font-size: 24px; font-weight: 600; }
      .sv-card-top small { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral-700, #d9451f); }
      .sv-card blockquote { margin: 0; font-size: clamp(20px, 1.9vw, 27px); line-height: 1.3; letter-spacing: -.015em; font-weight: 500; }
      .sv-card p { margin: 0; font-size: 15px; line-height: 1.55; color: rgba(43,23,0,.75); flex: 1; }
      .sv-card-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 14px; }
      .sv-card-hint { position: absolute; right: 24px; top: -28px; font-size: 12.5px; color: rgba(43,23,0,.7); }

      /* E · names */
      .sv-e { background: var(--intigris-off-white); }
      .sv-e-list { list-style: none; margin: 0; padding: 0; position: relative; border-top: 2px solid var(--intigris-brown-700); }
      .sv-e-list li { border-bottom: 1px solid rgba(43,23,0,.18); }
      .sv-e-list li > button { appearance: none; border: 0; background: none; font: inherit; width: 100%; display: grid; grid-template-columns: 60px minmax(0, 1fr) auto; align-items: baseline; gap: 16px; padding: 18px 0; cursor: pointer; text-align: left; color: var(--intigris-brown-700); }
      .sv-e-num { font-size: 14px; opacity: .5; font-variant-numeric: tabular-nums; }
      .sv-e-name { font-size: clamp(40px, 6.4vw, 96px); font-weight: 500; letter-spacing: -.045em; line-height: .95; transition: color 250ms, transform 400ms var(--ease-out); transform-origin: left; }
      .sv-e-sector { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; opacity: .6; }
      .sv-e-list li.is-hover .sv-e-name { color: var(--intigris-coral); transform: translateX(14px); }
      .sv-e-inline { display: none; }
      .sv-e-float { position: absolute; z-index: 5; width: 380px; pointer-events: none; transform: translate(24px, -50%) rotate(-2deg); background: var(--intigris-brown-700); color: var(--intigris-off-white); border-radius: 20px; padding: 22px 24px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 30px 60px -24px rgba(0,0,0,.55); animation: svPop 260ms var(--ease-out) both; }
      .sv-e-float blockquote { margin: 0; font-size: 17px; line-height: 1.5; }
      .sv-e-float > span { font-size: 13.5px; color: rgba(252,247,235,.65); }
      @keyframes svPop { from { opacity: 0; transform: translate(24px, -46%) rotate(-5deg) scale(.92); } }
      @media (hover: none) {
        .sv-e-float { display: none; }
        .sv-e-list li.is-open .sv-e-inline { display: flex; flex-direction: column; gap: 8px; padding: 0 0 20px 76px; }
        .sv-e-inline blockquote { margin: 0; font-size: 17px; line-height: 1.5; color: var(--intigris-brown-700); }
        .sv-e-inline span { font-size: 13.5px; color: rgba(43,23,0,.6); }
      }

      @media (max-width: 860px) {
        .sv-wall-card { width: 300px; }
        .sv-b-foot { grid-template-columns: 1fr; }
        .sv-bento { grid-template-columns: 1fr 1fr; }
        .sv-tile.is-feature, .sv-tile--cta { grid-column: span 2; grid-row: auto; }
        .sv-d-grid { grid-template-columns: 1fr; }
        .sv-deck { height: 480px; }
        .sv-card { inset: 0 24px 24px 0; padding: 24px; }
        .sv-e-list li > button { grid-template-columns: 34px minmax(0, 1fr); }
        .sv-e-sector { display: none; }
        .sv-e-list li.is-open .sv-e-inline { display: flex; flex-direction: column; gap: 8px; padding: 0 0 20px 50px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .sv-wall-track { animation: none; } .sv-wall-row { overflow-x: auto; }
        .sv-b-stage, .sv-e-float { animation: none; } .sv-card { transition: none; }
      }
    `}</style>
  );
}

Object.assign(window, { StoriesWall, StoriesSpotlight, StoriesBento, StoriesDeck, StoriesNames, SvStyles });
