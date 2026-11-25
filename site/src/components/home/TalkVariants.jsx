/* ==================================================================== */
/*  "Let's talk" (Frank) + "Ready to smarten up your business?" merged   */
/*  into ONE closing section (Bing 2026-11-24: the two were too alike).  */
/*    A · Frank's desk     headline left, portrait card right            */
/*    B · Chat with Frank  chat bubbles appear, buttons as reply chips   */
/*    C · Big type         huge "Let's [Frank] talk." with photo pill    */
/*    D · Booking card     headline left, booking card from Frank right  */
/*    E · Coral band       coral section, large round photo              */
/*  Facts only: Summit Partner, since 2010, 300+ projects.               */
/*  Photo: frank-timmer-round.jpg, cropped from the Drive master         */
/*  06 Employees/Frank Timmer/EOTM 0926.jpg (show it round only).        */
/* ==================================================================== */
import React, { useEffect, useRef, useState } from 'react';
import { tx, lp } from '../../lib/i18n.js';

const PHOTO = '/assets/team/frank-timmer-round.jpg';
const MAIL = 'franktimmer@intigris.nl';
const T = () => ({
  eyebrow: tx('READY TO SMARTEN UP YOUR BUSINESS?', 'KLAAR OM JE BEDRIJF SLIMMER TE MAKEN?'),
  lede: tx('A 30-minute conversation with Frank, our Sales Manager. We listen, ask sharp questions and give you an honest view of what Salesforce can do for you.',
    'Een gesprek van 30 minuten met Frank, onze Sales Manager. We luisteren, stellen scherpe vragen en geven je een eerlijk beeld van wat Salesforce voor je kan doen.'),
  cta: tx('Plan 30 minutes', 'Plan 30 minuten'),
  role: tx('Sales Manager', 'Sales Manager'),
  trust: [tx('Salesforce Summit Partner', 'Salesforce Summit Partner'), tx('Since 2010', 'Sinds 2010'), tx('300+ projects', '300+ projecten')],
});

/* adds class "in" once the section scrolls into view; children animate with CSS */
function useIn() {
  const ref = useRef(null); const [inV, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window)) { setIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, inV];
}
const Title = ({ big }) => <h2 className={'tk-h2' + (big ? ' tk-h2--big' : '')}>{tx('Let’s ', 'Laten we ')}<em>{tx('talk.', 'praten.')}</em></h2>;
const Cta = ({ onCta, cls = '' }) => onCta
  ? <button type="button" className={'tk-btn ' + cls} onClick={onCta}>{T().cta} <span aria-hidden="true">→</span></button>
  : <a className={'tk-btn ' + cls} href={lp('/contact')}>{T().cta} <span aria-hidden="true">→</span></a>;
const Mail = ({ cls = '' }) => <a className={'tk-mail ' + cls} href={'mailto:' + MAIL}>{MAIL}</a>;
const Trust = () => <div className="tk-trust">{T().trust.map((t) => <span key={t}>{t}</span>)}</div>;
const Photo = ({ size, ring = 'coral' }) => <span className={'tk-photo tk-photo--' + ring} style={{ width: size, height: size }}><img src={PHOTO} alt="Frank Timmer" /></span>;

/* ---------- A · Frank's desk ---------- */
export function TalkDesk({ onCta }) {
  const [ref, inV] = useIn(); const t = T();
  return (
    <section className={'tk tk--dark tk--a' + (inV ? ' in' : '')} ref={ref}>
      <div className="container tk-a-grid">
        <div className="tk-col">
          <div className="eyebrow tk-r" style={{ '--i': 0 }}>{t.eyebrow}</div>
          <div className="tk-r" style={{ '--i': 1 }}><Title big /></div>
          <p className="tk-lede tk-r" style={{ '--i': 2 }}>{t.lede}</p>
          <div className="tk-actions tk-r" style={{ '--i': 3 }}><Cta onCta={onCta} /><Mail /></div>
          <div className="tk-r" style={{ '--i': 4 }}><Trust /></div>
        </div>
        <div className="tk-a-card tk-r" style={{ '--i': 2 }}>
          <Photo size="min(240px, 52vw)" />
          <b>Frank Timmer</b>
          <span>{t.role}</span>
          <small>{tx('Your first point of contact', 'Je eerste aanspreekpunt')}</small>
        </div>
      </div>
    </section>
  );
}

/* ---------- B · Chat with Frank ---------- */
export function TalkChat({ onCta, tone = 'dark', chat = '' }) {
  const [ref, inV] = useIn(); const t = T(); const ask = chat === 'ask';
  const msgs = [tx('Hi, I’m Frank 👋', 'Hoi, ik ben Frank 👋'), tx('Ready to smarten up your business?', 'Klaar om je bedrijf slimmer te maken?'), tx('In 30 minutes you’ll know what Salesforce can do for you.', 'In 30 minuten weet je wat Salesforce voor je kan doen.')];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inV) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(msgs.length + 1); return; }
    let k = 0; const step = () => { k += 1; setShown(k); if (k <= msgs.length) tm = setTimeout(step, 1100); };
    let tm = setTimeout(step, 500); return () => clearTimeout(tm);
  }, [inV]);
  return (
    <section className={'tk tk--' + tone + ' tk--b' + (chat ? ' tk-chat-style--' + chat : '') + (inV ? ' in' : '')} ref={ref}>
      <div className="container tk-b-grid">
        <div className="tk-col">
          <div className="eyebrow tk-r" style={{ '--i': 0 }}>{t.eyebrow}</div>
          <div className="tk-r" style={{ '--i': 1 }}><Title big /></div>
          <div className="tk-r" style={{ '--i': 2 }}><Trust /></div>
        </div>
        <div className="tk-chat-wrap tk-r" style={{ '--i': 1 }}><div className="tk-chat">
          <div className="tk-chat-head"><Photo size={52} /><div><b>Frank Timmer</b><span><i className="tk-dot" />{t.role} · Intigris</span></div></div>
          {ask ? (<>
            {/* 'ask' look = the 9 Nov "Ask Frank" chat: white head, cream message area with white
                bubbles and Frank's small photo, white strip at the bottom with the buttons */}
            <div className="tk-chat-body">
              {msgs.map((m, i) => i < shown && <div key={i} className="tk-row"><Photo size={28} ring="none" /><div className="tk-bubble">{m}</div></div>)}
              {shown > 0 && shown <= msgs.length && <div className="tk-row"><Photo size={28} ring="none" /><div className="tk-bubble tk-typing" aria-hidden="true"><i /><i /><i /></div></div>}
            </div>
            <div className="tk-chat-foot">
              {shown > msgs.length
                ? <div className="tk-replies"><Cta onCta={onCta} cls="tk-btn--chip" /><a className="tk-chip" href={'mailto:' + MAIL}>{tx('Email Frank', 'Mail Frank')}</a></div>
                : <span className="tk-foot-wait">{tx('Frank is typing…', 'Frank is aan het typen…')}</span>}
            </div>
          </>) : (
          <div className="tk-chat-body">
            {msgs.map((m, i) => i < shown && <div key={i} className="tk-bubble">{m}</div>)}
            {shown > 0 && shown <= msgs.length && <div className="tk-bubble tk-typing" aria-hidden="true"><i /><i /><i /></div>}
            {shown > msgs.length && (
              <div className="tk-replies">
                <Cta onCta={onCta} cls="tk-btn--chip" />
                <a className="tk-chip" href={'mailto:' + MAIL}>{tx('Email Frank', 'Mail Frank')}</a>
              </div>
            )}
          </div>)}
        </div></div>
      </div>
    </section>
  );
}

/* ---------- C · Big type with photo pill ---------- */
export function TalkBigType({ onCta }) {
  const [ref, inV] = useIn(); const t = T();
  return (
    <section className={'tk tk--dark tk--c' + (inV ? ' in' : '')} ref={ref}>
      <div className="container tk-c-wrap">
        <div className="eyebrow tk-r" style={{ '--i': 0 }}>{t.eyebrow}</div>
        <h2 className="tk-h2 tk-h2--huge tk-r" style={{ '--i': 1 }}>
          {tx('Let’s', 'Laten')} <span className="tk-pill"><img src={PHOTO} alt="Frank Timmer" /></span> <em>{tx('talk.', 'praten.')}</em>
        </h2>
        <p className="tk-lede tk-r" style={{ '--i': 2 }}>{t.lede}</p>
        <div className="tk-actions tk-r" style={{ '--i': 3 }}><Cta onCta={onCta} /><Mail /></div>
        <div className="tk-r" style={{ '--i': 4 }}><Trust /></div>
      </div>
    </section>
  );
}

/* ---------- D · Booking card ---------- */
export function TalkBooking({ onCta }) {
  const [ref, inV] = useIn(); const t = T();
  const [slot, setSlot] = useState(0);
  const slots = [tx('Morning', 'Ochtend'), tx('Afternoon', 'Middag'), tx('No preference', 'Maakt niet uit')];
  return (
    <section className={'tk tk--dark tk--d' + (inV ? ' in' : '')} ref={ref}>
      <div className="container tk-a-grid">
        <div className="tk-col">
          <div className="eyebrow tk-r" style={{ '--i': 0 }}>{t.eyebrow}</div>
          <div className="tk-r" style={{ '--i': 1 }}><Title big /></div>
          <p className="tk-lede tk-r" style={{ '--i': 2 }}>{t.lede}</p>
          <div className="tk-r" style={{ '--i': 3 }}><Trust /></div>
        </div>
        <div className="tk-book tk-r" style={{ '--i': 2 }}>
          <div className="tk-book-head"><Photo size={60} /><div><b>{tx('30 minutes with Frank', '30 minuten met Frank')}</b><span>Frank Timmer · {t.role}</span></div></div>
          <ul className="tk-book-meta">
            <li><span aria-hidden="true">⏱</span>{tx('30 minutes, free', '30 minuten, gratis')}</li>
            <li><span aria-hidden="true">💬</span>{tx('Online or at our office', 'Online of op ons kantoor')}</li>
            <li><span aria-hidden="true">✓</span>{tx('An honest view, no strings attached', 'Een eerlijk beeld, zonder verplichtingen')}</li>
          </ul>
          <small className="tk-book-q">{tx('When suits you best?', 'Wanneer komt het jou het best uit?')}</small>
          <div className="tk-slots" role="radiogroup">
            {slots.map((s, i) => <button key={s} type="button" role="radio" aria-checked={i === slot} className={i === slot ? 'on' : ''} onClick={() => setSlot(i)}>{s}</button>)}
          </div>
          <Cta onCta={onCta} cls="tk-btn--wide" />
          <Mail cls="tk-mail--dark" />
        </div>
      </div>
    </section>
  );
}

/* ---------- E · Coral band ---------- */
export function TalkCoral({ onCta }) {
  const [ref, inV] = useIn(); const t = T();
  return (
    <section className={'tk tk--coral tk--e' + (inV ? ' in' : '')} ref={ref}>
      <div className="container tk-e-grid">
        <div className="tk-col">
          <div className="eyebrow tk-r" style={{ '--i': 0 }}>{t.eyebrow}</div>
          <div className="tk-r" style={{ '--i': 1 }}><Title big /></div>
          <p className="tk-lede tk-r" style={{ '--i': 2 }}>{t.lede}</p>
          <div className="tk-actions tk-r" style={{ '--i': 3 }}><Cta onCta={onCta} cls="tk-btn--dark" /><Mail cls="tk-mail--dark" /></div>
          <div className="tk-r" style={{ '--i': 4 }}><Trust /></div>
        </div>
        <div className="tk-e-photo tk-r" style={{ '--i': 1 }}>
          <Photo size="min(380px, 70vw)" ring="cream" />
          <span className="tk-tag"><b>Frank Timmer</b>{t.role}</span>
        </div>
      </div>
    </section>
  );
}

/* B on cream (Bing 2026-11-24): five colour combinations so the chat stands out from the cream */
export const TalkChatWhite = (p) => <TalkChat {...p} tone="cream" chat="white" />;
export const TalkChatDark = (p) => <TalkChat {...p} tone="cream" chat="dark" />;
export const TalkChatCoralHead = (p) => <TalkChat {...p} tone="cream" chat="coralhead" />;
export const TalkChatBlob = (p) => <TalkChat {...p} tone="cream" chat="blob" />;
export const TalkChatPaper = (p) => <TalkChat {...p} tone="cream" chat="paper" />;
export const TalkChatAsk = (p) => <TalkChat {...p} tone="cream" chat="ask" />;

export function TkStyles() { return <style dangerouslySetInnerHTML={{ __html: TK_CSS }} />; }
const TK_CSS = `
.tk { padding: clamp(72px, 9vw, 128px) 0; position: relative; overflow: hidden; }
.tk--dark { background: var(--intigris-dark-brown); color: var(--intigris-off-white); }
.tk--dark .eyebrow { color: rgba(252,247,235,.7); }
.tk--coral { background: var(--intigris-coral); color: var(--intigris-dark-brown); }
.tk--coral .eyebrow { color: var(--intigris-dark-brown); } .tk--coral .eyebrow::before { background: var(--intigris-dark-brown); }
.tk-col { display: flex; flex-direction: column; align-items: flex-start; gap: 22px; }
.tk-h2 { margin: 0; font-size: clamp(44px, 5.4vw, 80px); font-weight: 500; letter-spacing: -0.03em; line-height: 1; color: inherit; }
.tk-h2--big { font-size: clamp(52px, 7vw, 104px); }
.tk-h2 em { font-style: italic; color: var(--intigris-coral); }
.tk--coral .tk-h2 em { color: var(--intigris-off-white); }
.tk-lede { margin: 0; font-size: 17.5px; line-height: 1.55; max-width: 30em; opacity: .82; }
.tk-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 22px; }
.tk-btn { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; padding: 16px 26px; border-radius: 999px; background: var(--intigris-coral); color: #fff; font-weight: 500; font-size: 16px; text-decoration: none; transition: transform .2s, background .2s; }
.tk-btn:hover { transform: translateY(-2px); background: var(--intigris-coral-700); } .tk-btn span { transition: transform .2s; } .tk-btn:hover span { transform: translateX(4px); }
.tk-btn--dark { background: var(--intigris-dark-brown); } .tk-btn--dark:hover { background: #000; }
.tk-btn--wide { width: 100%; justify-content: center; }
.tk-mail { color: inherit; opacity: .8; font-size: 15px; text-decoration: underline; text-underline-offset: 4px; } .tk-mail:hover { opacity: 1; }
.tk-trust { display: flex; flex-wrap: wrap; gap: 8px 22px; padding-top: 18px; border-top: 1px solid currentColor; border-color: rgba(252,247,235,.18); font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; opacity: .7; }
.tk--coral .tk-trust { border-color: rgba(64,35,1,.25); }
.tk-photo { position: relative; display: inline-block; flex: none; border-radius: 50%; overflow: hidden; background: #3a2108; }
.tk-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tk-photo--coral { box-shadow: 0 0 0 4px var(--intigris-coral); } .tk-photo--cream { box-shadow: 0 0 0 8px var(--intigris-off-white), 0 40px 80px -30px rgba(64,35,1,.6); }
/* reveal */
.tk-r { opacity: 0; transform: translateY(22px); transition: opacity .7s cubic-bezier(.2,.8,.2,1), transform .7s cubic-bezier(.2,.8,.2,1); transition-delay: calc(var(--i, 0) * 90ms); }
.tk.in .tk-r { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .tk-r { opacity: 1; transform: none; transition: none; } }
/* A */
.tk-a-grid { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, .9fr); gap: clamp(40px, 6vw, 88px); align-items: center; }
.tk-a-card { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; padding: 40px 32px 34px; border-radius: 28px; background: rgba(252,247,235,.06); border: 1px solid rgba(252,247,235,.14); }
.tk-a-card .tk-photo { margin-bottom: 18px; } .tk-a-card b { font-size: 24px; font-weight: 500; } .tk-a-card span { color: var(--intigris-coral); font-weight: 600; font-size: 14px; }
.tk-a-card small { margin-top: 10px; font-size: 13px; opacity: .6; }
/* B */
.tk-b-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(40px, 6vw, 88px); align-items: center; }
.tk-chat { border-radius: 28px; background: var(--intigris-off-white); color: var(--intigris-dark-brown); box-shadow: 0 40px 80px -40px rgba(0,0,0,.7); overflow: hidden; }
.tk-chat-head { display: flex; align-items: center; gap: 14px; padding: 18px 22px; border-bottom: 1px solid var(--border); }
.tk-chat-head b { display: block; font-size: 16px; } .tk-chat-head span { font-size: 13px; color: var(--fg-muted); display: inline-flex; align-items: center; gap: 7px; }
.tk-dot { width: 8px; height: 8px; border-radius: 50%; background: #2e844a; box-shadow: 0 0 0 3px rgba(46,132,74,.2); }
.tk-chat-body { min-height: 300px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 24px 22px 26px; }
.tk-bubble { max-width: 85%; padding: 13px 17px; border-radius: 18px 18px 18px 6px; background: #fff; border: 1px solid var(--border); font-size: 16.5px; line-height: 1.45; animation: tkPop .45s cubic-bezier(.2,.9,.3,1.2) both; transform-origin: left bottom; }
@keyframes tkPop { from { opacity: 0; transform: translateY(8px) scale(.94); } }
.tk-typing { display: inline-flex; gap: 5px; padding: 15px 17px; } .tk-typing i { width: 7px; height: 7px; border-radius: 50%; background: rgba(64,35,1,.4); animation: tkDot 1s infinite; } .tk-typing i:nth-child(2) { animation-delay: .15s; } .tk-typing i:nth-child(3) { animation-delay: .3s; }
@keyframes tkDot { 0%, 60%, 100% { transform: none; opacity: .4; } 30% { transform: translateY(-4px); opacity: 1; } }
.tk-replies { align-self: flex-end; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 8px; animation: tkPop .45s both; }
.tk-btn--chip { padding: 12px 20px; font-size: 15px; }
.tk-chip { display: inline-flex; align-items: center; padding: 12px 18px; border-radius: 999px; border: 1.5px solid var(--intigris-dark-brown); color: var(--intigris-dark-brown); font-weight: 500; font-size: 15px; text-decoration: none; } .tk-chip:hover { background: rgba(64,35,1,.06); }
/* C */
.tk-c-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 26px; }
.tk-h2--huge { font-size: clamp(60px, 10vw, 150px); line-height: .95; }
.tk-pill { display: inline-block; vertical-align: middle; width: 1.5em; height: .82em; border-radius: 999px; overflow: hidden; margin: -.1em .02em 0; box-shadow: 0 0 0 4px var(--intigris-coral); transition: width .9s cubic-bezier(.2,.8,.2,1) .3s; }
.tk--c:not(.in) .tk-pill { width: .2em; }
.tk-pill img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block; }
.tk--c .tk-lede { text-align: center; } .tk--c .tk-actions, .tk--c .tk-trust { justify-content: center; }
/* D */
.tk-book { display: flex; flex-direction: column; gap: 16px; padding: 28px; border-radius: 28px; background: var(--intigris-off-white); color: var(--intigris-dark-brown); box-shadow: 0 40px 80px -40px rgba(0,0,0,.7); }
.tk-book-head { display: flex; align-items: center; gap: 14px; } .tk-book-head b { display: block; font-size: 20px; font-weight: 500; } .tk-book-head span { font-size: 13px; color: var(--fg-muted); }
.tk-book-meta { list-style: none; margin: 0; padding: 14px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 9px; font-size: 15px; } .tk-book-meta span { display: inline-block; width: 26px; }
.tk-book-q { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--intigris-coral-700); }
.tk-slots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.tk-slots button { all: unset; cursor: pointer; text-align: center; padding: 11px 6px; border-radius: 12px; border: 1.5px solid var(--border); font-size: 14px; font-weight: 500; transition: all .2s; }
.tk-slots button:hover { border-color: var(--intigris-dark-brown); } .tk-slots button.on { background: var(--intigris-dark-brown); border-color: var(--intigris-dark-brown); color: var(--intigris-off-white); }
.tk-mail--dark { color: var(--intigris-dark-brown); align-self: center; font-size: 14px; }
/* E */
.tk-e-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: clamp(40px, 6vw, 80px); align-items: center; }
.tk--e .tk-lede { opacity: .85; }
.tk-e-photo { position: relative; justify-self: center; }
.tk-tag { position: absolute; left: -12px; bottom: 26px; display: flex; flex-direction: column; padding: 12px 18px; border-radius: 16px; background: var(--intigris-dark-brown); color: var(--intigris-off-white); font-size: 13px; transform: rotate(-4deg); box-shadow: 0 20px 40px -20px rgba(0,0,0,.6); }
.tk-tag b { font-size: 17px; font-weight: 500; }
@media (max-width: 900px) { .tk-a-grid, .tk-b-grid, .tk-e-grid { grid-template-columns: 1fr; } .tk-e-photo { order: -1; } }
/* cream section */
.tk--cream { background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
.tk--cream .eyebrow { color: var(--intigris-coral-700); }
.tk--cream .tk-trust { border-color: rgba(64,35,1,.18); }
.tk-chat-wrap { position: relative; }
/* 1 white */
.tk-chat-style--white .tk-chat { background: #fff; border: 1px solid rgba(64,35,1,.1); box-shadow: 0 50px 90px -40px rgba(64,35,1,.45), 0 4px 14px -6px rgba(64,35,1,.12); }
.tk-chat-style--white .tk-bubble { background: var(--intigris-off-white); border-color: transparent; }
/* 2 dark */
.tk-chat-style--dark .tk-chat { background: var(--intigris-dark-brown); color: var(--intigris-off-white); box-shadow: 0 50px 90px -40px rgba(64,35,1,.6); }
.tk-chat-style--dark .tk-chat-head { border-color: rgba(252,247,235,.12); } .tk-chat-style--dark .tk-chat-head span { color: rgba(252,247,235,.65); }
.tk-chat-style--dark .tk-bubble { background: rgba(252,247,235,.1); border-color: rgba(252,247,235,.12); color: var(--intigris-off-white); }
.tk-chat-style--dark .tk-typing i { background: rgba(252,247,235,.6); }
.tk-chat-style--dark .tk-chip { border-color: rgba(252,247,235,.5); color: var(--intigris-off-white); } .tk-chat-style--dark .tk-chip:hover { background: rgba(252,247,235,.08); }
/* 3 coral header */
.tk-chat-style--coralhead .tk-chat { background: #fff; box-shadow: 0 50px 90px -40px rgba(64,35,1,.45); }
.tk-chat-style--coralhead .tk-chat-head { background: var(--intigris-coral); color: #fff; border: 0; } .tk-chat-style--coralhead .tk-chat-head span { color: rgba(255,255,255,.85); }
.tk-chat-style--coralhead .tk-photo--coral { box-shadow: 0 0 0 3px #fff; } .tk-chat-style--coralhead .tk-dot { background: #fff; box-shadow: 0 0 0 3px rgba(255,255,255,.3); }
.tk-chat-style--coralhead .tk-bubble { background: var(--intigris-off-white); border-color: transparent; }
/* 4 coral shape behind */
.tk-chat-style--blob .tk-chat-wrap::before { content: ''; position: absolute; inset: 8% -6% -8% 10%; border-radius: 40px; background: var(--intigris-coral); transform: rotate(4deg); z-index: 0; }
.tk-chat-style--blob .tk-chat { position: relative; z-index: 1; background: #fff; box-shadow: 0 40px 70px -40px rgba(64,35,1,.55); }
.tk-chat-style--blob .tk-bubble { background: var(--intigris-off-white); border-color: transparent; }
/* 6 'Ask Frank' look (9 Nov chat): white / cream / white */
.tk-chat-style--ask .tk-chat { background: #fff; border-radius: 24px; box-shadow: 0 60px 110px -40px rgba(43,23,0,.5), 0 18px 40px -24px rgba(43,23,0,.28); display: flex; flex-direction: column; }
.tk-chat-style--ask .tk-chat-head .tk-photo--coral { box-shadow: 0 0 0 2px var(--intigris-coral); } /* thinner ring (Bing 2026-11-24) */
.tk-chat-style--ask .tk-chat-head { padding: 16px 20px; border-bottom: 1px solid rgba(43,23,0,.08); }
.tk-chat-style--ask .tk-chat-body { background: var(--intigris-off-white); min-height: 260px; padding: 20px; gap: 10px; }
.tk-row { display: flex; align-items: flex-end; gap: 8px; max-width: 88%; animation: tkPop .45s cubic-bezier(.2,.9,.3,1.2) both; }
.tk-row .tk-bubble { max-width: none; background: #fff; border: 0; border-radius: 18px 18px 18px 6px; box-shadow: 0 2px 6px rgba(43,23,0,.06); font-size: 15.5px; animation: none; }
.tk-photo--none { box-shadow: none; }
.tk-chat-foot { min-height: 76px; box-sizing: border-box; display: flex; align-items: center; padding: 16px 20px 20px; border-top: 1px solid rgba(43,23,0,.08); }
.tk-chat-foot .tk-replies { margin: 0; align-self: auto; justify-content: flex-start; }
.tk-foot-wait { font-size: 13.5px; color: var(--fg-muted); }
/* 5 paper panel */
.tk-chat-style--paper .tk-chat-wrap { padding: 28px; border-radius: 36px; background: #f1e4cd; }
.tk-chat-style--paper .tk-chat { background: #fff; box-shadow: 0 30px 60px -36px rgba(64,35,1,.45); }
.tk-chat-style--paper .tk-bubble { background: var(--intigris-off-white); border-color: transparent; }
`;
