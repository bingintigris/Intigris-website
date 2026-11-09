/* ==================================================================== */
/*  FAQ — three redesigns to choose from (FaqVariations.html)             */
/*  A · Chat:  ask Frank. Tap a question chip, Frank "types" and answers  */
/*             in a chat thread.                                          */
/*  B · Notes: the questions are sticky notes on a wall (a nod to the     */
/*             chaos hero). Pick one and it lifts off and opens.          */
/*  C · Big type: an editorial list of huge numbered questions; the open  */
/*             one turns coral and the answer slides out.                 */
/*  All three take the same data: [{ label, q, a }].                      */
/* ==================================================================== */

const FV_REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fvState = React.useState, fvEffect = React.useEffect, fvRef = React.useRef;

function FvLabel({ letter, text }) {
  return <div className="fv-label"><span>{letter}</span> {text}</div>;
}

/* ---------- A · CHAT ---------- */
function FaqChat({ head, items, onCta }) {
  /* thread: list of { who: 'me' | 'frank', text } ; the first answer is preloaded */
  const [thread, setThread] = fvState([
    { who: 'frank', text: tx('Hi, I am Frank. These are the questions I hear most. Tap one.', 'Hoi, ik ben Frank. Dit zijn de vragen die ik het vaakst hoor. Tik er een aan.') },
    { who: 'me', text: items[0].q },
    { who: 'frank', text: items[0].a },
  ]);
  const [asked, setAsked] = fvState([0]);
  const [typing, setTyping] = fvState(false);
  const box = fvRef(null);
  fvEffect(() => { const el = box.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: FV_REDUCE ? 'auto' : 'smooth' }); }, [thread, typing]);
  const ask = i => {
    if (typing) return;
    setAsked(a => a.concat(i));
    setThread(t => t.concat({ who: 'me', text: items[i].q }));
    if (FV_REDUCE) { setThread(t => t.concat({ who: 'frank', text: items[i].a })); return; }
    setTyping(true);
    setTimeout(() => { setTyping(false); setThread(t => t.concat({ who: 'frank', text: items[i].a })); }, 1100);
  };
  const left = items.map((_, i) => i).filter(i => !asked.includes(i));
  return (
    <section className="ck-section ck-section--soft fv-a">
      <div className="container-wide">
        <FvLabel letter="A" text={tx('Chat: ask Frank', 'Chat: vraag het Frank')} />
        <div className="fv-a-grid">
          <CkHead {...head} lede={tx('No FAQ wall. Ask what you would ask in the first call, and get the answer you would get there.', 'Geen FAQ-muur. Vraag wat je in het eerste gesprek zou vragen, en krijg het antwoord dat je daar zou krijgen.')} />
          <div className="fv-chat">
            <div className="fv-chat-top">
              <span className="fv-av">FT</span>
              <div><b>Frank Timmer</b><small><i /> {tx('Sales Manager · usually replies within a day', 'Sales Manager · reageert meestal binnen een dag')}</small></div>
            </div>
            <div className="fv-chat-body" ref={box} aria-live="polite">
              {thread.map((m, k) => <div key={k} className={'fv-msg fv-msg--' + m.who}>{m.text}</div>)}
              {typing && <div className="fv-msg fv-msg--frank fv-typing" aria-label={tx('Frank is typing', 'Frank is aan het typen')}><i /><i /><i /></div>}
            </div>
            <div className="fv-chips">
              {left.length ? left.map(i => <button key={i} type="button" onClick={() => ask(i)} disabled={typing}>{items[i].q}</button>)
                : <button type="button" className="fv-chip-cta" onClick={onCta}>{tx('Ask me something else in 30 minutes →', 'Vraag me iets anders in 30 minuten →')}</button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- B · STICKY NOTES ---------- */
const FV_NOTE_COLORS = ['#ffd5c8', 'var(--intigris-soft-blue)', '#cfdcc4', '#fff3c9', '#ffd5c8', 'var(--intigris-soft-blue)'];
const FV_NOTE_SPOTS = [[6, 8, -4], [36, 2, 3], [66, 10, -2], [18, 52, 2], [50, 50, -3], [78, 56, 4]];
function FaqNotes({ head, items }) {
  const [open, setOpen] = fvState(-1);
  fvEffect(() => { if (open < 0) return; const k = e => { if (e.key === 'Escape') setOpen(-1); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open]);
  const it = items[open];
  return (
    <section className="ck-section ck-section--dark fv-b">
      <div className="container-wide">
        <FvLabel letter="B" text={tx('Notes: pick a question off the wall', 'Notes: pak een vraag van de muur')} />
        <CkHead {...head} />
        <div className={'fv-wall' + (open >= 0 ? ' has-open' : '')}>
          {items.map((x, i) => {
            const [l, t, r] = FV_NOTE_SPOTS[i % FV_NOTE_SPOTS.length];
            return (
              <button key={i} type="button" className={'fv-note' + (i === open ? ' is-open' : '')} onClick={() => setOpen(i)} aria-expanded={i === open}
                style={{ left: l + '%', top: t + '%', '--r': r + 'deg', background: FV_NOTE_COLORS[i % FV_NOTE_COLORS.length], transitionDelay: (i * 40) + 'ms' }}>
                <small>{x.label}</small>
                <b>{x.q}</b>
                <span className="fv-note-hint">{tx('Open', 'Openen')} ↗</span>
              </button>
            );
          })}
          {it && (
            <div className="fv-answer" role="dialog" aria-label={it.q} key={open}>
              <button type="button" className="fv-answer-x" onClick={() => setOpen(-1)} aria-label={tx('Close', 'Sluiten')}>×</button>
              <small>{it.label}</small>
              <b>{it.q}</b>
              <p>{it.a}</p>
              <div className="fv-answer-nav">
                <button type="button" onClick={() => setOpen((open - 1 + items.length) % items.length)}>← {tx('Previous', 'Vorige')}</button>
                <span>{open + 1} / {items.length}</span>
                <button type="button" onClick={() => setOpen((open + 1) % items.length)}>{tx('Next', 'Volgende')} →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- C · BIG TYPE ---------- */
function FaqBigType({ head, items, onCta }) {
  const [open, setOpen] = fvState(0);
  return (
    <section className="ck-section fv-c">
      <div className="container-wide">
        <FvLabel letter="C" text={tx('Big type: the questions are the design', 'Grote letters: de vragen zijn het ontwerp')} />
        <div className="fv-c-top">
          <div className="eyebrow">{head.eyebrow}</div>
          <button type="button" className="fv-c-cta" onClick={onCta}>{tx('Your question not here? Plan 30 minutes →', 'Staat je vraag er niet bij? Plan 30 minuten →')}</button>
        </div>
        <ol className="fv-c-list">
          {items.map((x, i) => (
            <li key={i} className={i === open ? 'is-open' : ''}>
              <button type="button" onClick={() => setOpen(i === open ? -1 : i)} aria-expanded={i === open}>
                <span className="fv-c-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="fv-c-q">{x.q}</span>
                <span className="fv-c-plus" aria-hidden>+</span>
              </button>
              <div className="fv-c-a"><div><small>{x.label}</small><p>{x.a}</p></div></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FvStyles() {
  return (
    <style>{`
      .fv-label { display: inline-flex; align-items: center; gap: 12px; font-size: 15px; margin-bottom: 26px; opacity: .85; }
      .fv-label span { width: 34px; height: 34px; border-radius: 50%; background: var(--intigris-coral); color: var(--intigris-brown-700); display: grid; place-items: center; font-weight: 700; }

      /* A · chat */
      .fv-a-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(28px, 5vw, 80px); align-items: start; }
      .fv-chat { background: #fff; border-radius: 24px; box-shadow: 0 30px 60px -30px rgba(43,23,0,.35); overflow: hidden; display: flex; flex-direction: column; }
      .fv-chat-top { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid rgba(43,23,0,.08); }
      .fv-chat-top b { display: block; font-weight: 500; color: var(--intigris-brown-700); }
      .fv-chat-top small { font-size: 12.5px; color: rgba(43,23,0,.6); display: inline-flex; align-items: center; gap: 6px; }
      .fv-chat-top small i { width: 8px; height: 8px; border-radius: 50%; background: #3fae5a; }
      .fv-av { width: 42px; height: 42px; border-radius: 50%; background: var(--intigris-brown-700); color: var(--intigris-off-white); display: grid; place-items: center; font-weight: 600; font-size: 14px; flex: none; }
      .fv-chat-body { height: 360px; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; background: var(--intigris-off-white); }
      .fv-msg { max-width: 82%; padding: 12px 16px; border-radius: 18px; font-size: 15.5px; line-height: 1.5; animation: fvPop 320ms var(--ease-out) both; }
      .fv-msg--frank { align-self: flex-start; background: #fff; color: var(--intigris-brown-700); border-bottom-left-radius: 6px; box-shadow: 0 2px 6px rgba(43,23,0,.06); }
      .fv-msg--me { align-self: flex-end; background: var(--intigris-coral); color: var(--intigris-brown-700); border-bottom-right-radius: 6px; font-weight: 500; }
      .fv-typing { display: inline-flex; gap: 5px; padding: 16px 18px; }
      .fv-typing i { width: 7px; height: 7px; border-radius: 50%; background: rgba(43,23,0,.4); animation: fvDot 1s infinite; }
      .fv-typing i:nth-child(2) { animation-delay: .15s; } .fv-typing i:nth-child(3) { animation-delay: .3s; }
      .fv-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 20px 20px; border-top: 1px solid rgba(43,23,0,.08); }
      .fv-chips button { appearance: none; font: inherit; font-size: 14px; cursor: pointer; padding: 9px 14px; border-radius: 999px; border: 1px solid rgba(43,23,0,.18); background: #fff; color: var(--intigris-brown-700); text-align: left; transition: background 200ms, border-color 200ms; }
      .fv-chips button:hover:not(:disabled) { background: var(--intigris-coral-100, #ffe3da); border-color: var(--intigris-coral); }
      .fv-chips button:disabled { opacity: .5; cursor: default; }
      .fv-chips .fv-chip-cta { background: var(--intigris-brown-700); color: var(--intigris-off-white); border-color: transparent; }
      @keyframes fvPop { from { opacity: 0; transform: translateY(8px) scale(.97); } to { opacity: 1; transform: none; } }
      @keyframes fvDot { 0%, 60%, 100% { transform: none; opacity: .4; } 30% { transform: translateY(-4px); opacity: 1; } }

      /* B · notes */
      .fv-b .fv-label { color: var(--intigris-off-white); }
      .fv-wall { position: relative; height: 560px; margin-top: 8px; }
      .fv-note { position: absolute; width: min(270px, 26%); min-height: 190px; padding: 22px 20px 18px; appearance: none; border: 0; font: inherit; text-align: left; cursor: pointer; color: var(--intigris-brown-700); display: flex; flex-direction: column; gap: 10px; rotate: var(--r); box-shadow: 0 18px 30px -16px rgba(0,0,0,.55); transition: rotate 300ms var(--ease-out), translate 300ms var(--ease-out), opacity 300ms, scale 300ms; }
      .fv-note::before { content: ''; position: absolute; top: -10px; left: 50%; translate: -50% 0; width: 70px; height: 20px; background: rgba(252,247,235,.55); rotate: -3deg; }
      .fv-note small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; opacity: .7; }
      .fv-note b { font-size: 21px; font-weight: 500; letter-spacing: -.02em; line-height: 1.2; }
      .fv-note-hint { margin-top: auto; font-size: 13px; opacity: .6; }
      .fv-note:hover { rotate: 0deg; translate: 0 -6px; }
      .fv-wall.has-open .fv-note { opacity: .25; scale: .96; }
      .fv-answer { position: absolute; left: 50%; top: 50%; translate: -50% -50%; width: min(640px, 92%); background: var(--intigris-off-white); color: var(--intigris-brown-700); border-radius: 22px; padding: 34px 34px 24px; box-shadow: 0 40px 80px -30px rgba(0,0,0,.7); z-index: 5; display: flex; flex-direction: column; gap: 12px; animation: fvLift 420ms cubic-bezier(.2,.9,.2,1.1) both; }
      .fv-answer small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral-700, #d9451f); }
      .fv-answer b { font-size: 28px; font-weight: 500; letter-spacing: -.025em; line-height: 1.15; }
      .fv-answer p { margin: 0; font-size: 17px; line-height: 1.6; color: rgba(43,23,0,.82); }
      .fv-answer-x { position: absolute; top: 14px; right: 16px; width: 36px; height: 36px; border-radius: 50%; border: 0; background: rgba(43,23,0,.07); font-size: 22px; cursor: pointer; color: inherit; }
      .fv-answer-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 14px; border-top: 1px solid rgba(43,23,0,.1); font-size: 14px; }
      .fv-answer-nav button { appearance: none; border: 0; background: none; font: inherit; color: var(--intigris-brown-700); cursor: pointer; padding: 6px 0; }
      .fv-answer-nav span { color: rgba(43,23,0,.5); }
      @keyframes fvLift { from { opacity: 0; transform: translateY(30px) rotate(-3deg) scale(.9); } to { opacity: 1; transform: none; } }

      /* C · big type */
      .fv-c { background: var(--intigris-off-white); }
      .fv-c-top { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding-bottom: 18px; border-bottom: 2px solid var(--intigris-brown-700); }
      .fv-c-cta { appearance: none; border: 0; background: none; font: inherit; font-size: 15px; color: var(--intigris-brown-700); cursor: pointer; text-decoration: underline; text-underline-offset: 4px; }
      .fv-c-list { list-style: none; margin: 0; padding: 0; }
      .fv-c-list li { border-bottom: 1px solid rgba(43,23,0,.18); }
      .fv-c-list li > button { appearance: none; border: 0; background: none; font: inherit; width: 100%; display: grid; grid-template-columns: 70px minmax(0, 1fr) 48px; align-items: baseline; gap: 12px; padding: 26px 0; cursor: pointer; text-align: left; color: var(--intigris-brown-700); }
      .fv-c-num { font-size: 15px; font-variant-numeric: tabular-nums; opacity: .5; }
      .fv-c-q { font-size: clamp(30px, 4.4vw, 64px); font-weight: 500; letter-spacing: -.04em; line-height: 1.02; transition: color 300ms, transform 400ms var(--ease-out); transform-origin: left; }
      .fv-c-plus { font-size: 40px; font-weight: 300; justify-self: end; transition: rotate 300ms var(--ease-out); }
      .fv-c-list li > button:hover .fv-c-q { transform: translateX(10px); }
      .fv-c-list li.is-open .fv-c-q { color: var(--intigris-coral); }
      .fv-c-list li.is-open .fv-c-plus { rotate: 45deg; color: var(--intigris-coral); }
      .fv-c-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 450ms var(--ease-out); }
      .fv-c-a > div { overflow: hidden; padding-left: 82px; display: grid; grid-template-columns: 140px minmax(0, 640px); gap: 20px; }
      .fv-c-list li.is-open .fv-c-a { grid-template-rows: 1fr; }
      .fv-c-list li.is-open .fv-c-a > div { padding-bottom: 32px; }
      .fv-c-a small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--intigris-coral-700, #d9451f); padding-top: 6px; }
      .fv-c-a p { margin: 0; font-size: 19px; line-height: 1.6; color: rgba(43,23,0,.82); }

      @media (max-width: 860px) {
        .fv-a-grid { grid-template-columns: 1fr; }
        .fv-wall { height: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .fv-note { position: relative; left: auto !important; top: auto !important; width: auto; min-height: 150px; }
        .fv-note b { font-size: 17px; }
        .fv-answer { position: fixed; }
        .fv-c-list li > button { grid-template-columns: 36px minmax(0, 1fr) 30px; }
        .fv-c-a > div { padding-left: 0; grid-template-columns: 1fr; gap: 6px; }
        .fv-c-a p { font-size: 16.5px; }
      }
      @media (prefers-reduced-motion: reduce) { .fv-msg, .fv-answer { animation: none; } .fv-note, .fv-c-q, .fv-c-a { transition: none; } }
    `}</style>
  );
}

Object.assign(window, { FaqChat, FaqNotes, FaqBigType, FvStyles });
