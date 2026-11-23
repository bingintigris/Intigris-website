/* ==================================================================== */
/*  Homepage section 2 · opening animation per cloud: OPTION 1 vs 2        */
/*  Bing (2026-11-23): Sales Cloud keeps the floating notes; every other   */
/*  cloud gets its own opening animation. These are rough previews to     */
/*  pick from (design review :8004 only); the chosen ones get finalized   */
/*  later and then replace the notes in CloudsPick.jsx (concept A).       */
/*  Each scene loops: problem (phase "a") → solved (phase "b").           */
/*  Demo company "Havenwerk BV".                                          */
/* ==================================================================== */
import React, { useState, useEffect } from 'react';
import { tx } from '../../lib/i18n.js';
import { CloudIcon } from './CloudsOverview.jsx';
import { MiniScreen } from './WhereToStart.jsx';

/* phase loop: a (problem) → b (solved), restartable */
function usePhase(aMs = 2600, bMs = 3000) {
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState('a');
  useEffect(() => {
    setPhase('a');
    const t1 = setTimeout(() => setPhase('b'), aMs);
    const t2 = setTimeout(() => setRun((r) => r + 1), aMs + bMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [run, aMs, bMs]);
  return [phase, run, () => setRun((r) => r + 1)];
}
/* number that counts up while active */
function useCount(active, from, to, ms) {
  const [n, setN] = useState(from);
  useEffect(() => {
    if (!active) { setN(from); return; }
    const t0 = performance.now(); let raf;
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); setN(Math.round(from + (to - from) * k)); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, from, to, ms]);
  return n;
}

function Scene({ title, note, phase, run, replay, children }) {
  return (
    <figure className="ci-scene">
      <div className={'ci-stage ci--' + phase} key={run}>{children}</div>
      <figcaption><b>{title}</b><span>{note}</span><button onClick={replay}>↻ {tx('Replay', 'Opnieuw')}</button></figcaption>
    </figure>
  );
}

/* ---------------- Service ---------------- */
function Service1() {
  const [p, run, replay] = usePhase();
  const q = tx('Where is my order?', 'Waar blijft mijn bestelling?');
  return (
    <Scene title={tx('1 · One question, three channels', '1 · Eén vraag, drie kanalen')} note={tx('Mail, phone and chat arrive separately, then merge into one case.', 'Mail, telefoon en chat komen los binnen en smelten samen tot één case.')} phase={p} run={run} replay={replay}>
      {[['Mail', '8%', '10%'], [tx('Phone', 'Telefoon'), '56%', '6%'], ['Chat', '30%', '62%']].map(([k, l, t], i) => (
        <div key={k} className="ci-chip ci-merge" style={{ left: l, top: t, '--d': i * 0.25 + 's' }}><small>{k} · Noor, Havenwerk BV</small>{q}</div>
      ))}
      <div className="ci-case ci-reveal">
        <div className="ci-case-top"><b>Case #00418</b><i className="ci-tag">{tx('1 case · 3 channels', '1 case · 3 kanalen')}</i></div>
        <p>{q}</p>
        <div className="ci-tl">{['Mail 09:02', tx('Phone', 'Telefoon') + ' 09:15', 'Chat 09:31'].map((x) => <span key={x}>● {x}</span>)}</div>
      </div>
    </Scene>
  );
}
function Service2() {
  const [p, run, replay] = usePhase(2600, 3000);
  const n = useCount(p === 'a', 12, 97, 2200);
  return (
    <Scene title={tx('2 · Overflowing inbox', '2 · Overvolle inbox')} note={tx('The unread counter races up, then everything lands in a calm queue.', 'De teller ongelezen schiet omhoog, daarna landt alles in een rustige wachtrij.')} phase={p} run={run} replay={replay}>
      <div className="ci-inbox ci-hide-b">
        <div className="ci-inbox-count"><b>{n}</b><span>{tx('unread', 'ongelezen')}</span></div>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} className="ci-mail" style={{ '--d': i * 0.3 + 's', top: 30 + i * 12 + '%' }}>✉ {['RE: order #4471', 'Urgent!!', 'FW: FW: klacht', '2e herinnering', 'Bel me terug'][i]}</div>)}
      </div>
      <div className="ci-full ci-reveal"><MiniScreen id="service" /></div>
    </Scene>
  );
}

/* ---------------- Field Service ---------------- */
const PINS = [[60, 40], [300, 70], [110, 200], [330, 230], [200, 130]];
function Field1() {
  const [p, run, replay] = usePhase(2600, 3200);
  const zig = 'M60 40 L330 230 L110 200 L300 70 L200 130 L60 40';
  const loop = 'M60 40 C120 30 250 40 300 70 C340 110 350 200 330 230 C260 250 160 230 110 200 C80 170 150 140 200 130 C150 110 70 80 60 40';
  return (
    <Scene title={tx('1 · Route on a map', '1 · Route op een kaart')} note={tx('A zigzag route with wasted kilometres redraws into one smart loop.', 'Een zigzagroute met loze kilometers tekent zich opnieuw als één slimme ronde.')} phase={p} run={run} replay={replay}>
      <svg className="ci-map" viewBox="0 0 400 280" aria-hidden="true">
        <rect x="0" y="0" width="400" height="280" rx="18" fill="#eef1ea" />
        <path d="M0 160 C100 140 180 190 400 150" stroke="#cfd8e3" strokeWidth="14" fill="none" />
        <path d="M150 0 C170 90 140 180 190 280" stroke="#e2e6dc" strokeWidth="8" fill="none" />
        <path className="ci-route ci-route--bad" d={zig} />
        <path className="ci-route ci-route--good" d={loop} />
        {PINS.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="11" fill="#fff" stroke="#402301" strokeWidth="2" /><text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#402301">{i + 1}</text></g>)}
      </svg>
      <div className="ci-km ci-hide-b">⚠ 143 km · 4 u 10</div>
      <div className="ci-km ci-km--good ci-reveal">✓ 68 km · 2 u 05</div>
    </Scene>
  );
}
function Field2() {
  const [p, run, replay] = usePhase(2600, 3200);
  return (
    <Scene title={tx('2 · Whiteboard to phone', '2 · Whiteboard naar telefoon')} note={tx('A messy planning board falls apart; the job appears on the engineer\'s phone.', 'Een rommelig planbord valt uit elkaar; de klus verschijnt op de telefoon van de monteur.')} phase={p} run={run} replay={replay}>
      <div className="ci-board ci-fall">
        <div className="ci-board-head">{tx('PLANNING week 47', 'PLANNING week 47')}</div>
        {[['Jan', 'Zaandam ~~Purmerend~~ ??'], ['Ali', 'Haarlem 08:00 / 13:00?'], ['Kees', tx('sick → who?', 'ziek → wie?')], ['Sanne', 'Utrecht + onderdeel!!']].map(([a, b], i) => <div key={a} className="ci-board-row" style={{ '--r': (i % 2 ? 1.5 : -1.5) + 'deg' }}><b>{a}</b><span>{b}</span><i className="ci-magnet" /></div>)}
      </div>
      <div className="ci-phone ci-reveal">
        <div className="ci-phone-notch" />
        <div className="ci-phone-job"><small>{tx('Next job · 08:30', 'Volgende klus · 08:30')}</small><b>Havenwerk BV</b><span>Industrieweg 12, Zaandam</span><span>{tx('Part: pump seal ✓ in van', 'Onderdeel: pompafdichting ✓ in bus')}</span><div className="ci-phone-btn">{tx('Start job', 'Start klus')}</div></div>
      </div>
    </Scene>
  );
}

/* ---------------- Agentforce ---------------- */
function Agent1() {
  const [p, run, replay] = usePhase(2800, 3400);
  return (
    <Scene title={tx('1 · After hours', '1 · Na kantoortijd')} note={tx('22:47, the office is closed. The "we\'re closed" reply is replaced by an agent that answers and books.', '22:47, kantoor dicht. Het "we zijn gesloten"-antwoord wordt vervangen door een agent die antwoordt en inplant.')} phase={p} run={run} replay={replay}>
      <div className="ci-clock">🌙 22:47</div>
      <div className="ci-chat">
        <div className="ci-msg ci-msg--in" style={{ '--d': '.2s' }}>{tx('When is my engineer coming?', 'Wanneer komt mijn monteur?')}</div>
        <div className="ci-msg ci-msg--closed ci-hide-b" style={{ '--d': '1s' }}>{tx('We are closed. Back tomorrow at 9:00.', 'We zijn gesloten. Morgen vanaf 9:00 weer bereikbaar.')}</div>
        <div className="ci-msg ci-msg--agent ci-reveal"><b><CloudIcon id="agentforce" size={14} /> Agentforce</b>{tx('Tuesday between 8:30 and 9:30. Shall I send a text when he leaves?', 'Dinsdag tussen 8:30 en 9:30. Zal ik een sms sturen als hij vertrekt?')}</div>
        <div className="ci-msg ci-msg--ok ci-reveal" style={{ '--d': '.9s' }}>✓ {tx('Visit confirmed · Tue 08:30', 'Bezoek bevestigd · di 08:30')}</div>
      </div>
    </Scene>
  );
}
function Agent2() {
  const [p, run, replay] = usePhase(2600, 3200);
  const n = useCount(p === 'b', 0, 128, 2400);
  return (
    <Scene title={tx('2 · Dusty pilot', '2 · Stoffige pilot')} note={tx('A pilot folder piles up versions and an "on hold" stamp; then one working agent with a live counter.', 'Een pilotmap stapelt versies en een "on hold"-stempel; daarna één werkende agent met een live teller.')} phase={p} run={run} replay={replay}>
      <div className="ci-folder ci-hide-b">
        <div className="ci-folder-tab">AI pilot</div>
        {['v1', 'v2', 'v3', 'v5', 'v7_final'].map((v, i) => <div key={v} className="ci-doc" style={{ '--d': i * 0.25 + 's', '--x': i * 14 + 'px', '--y': i * 10 + 'px' }}>pilot_{v}.docx</div>)}
        <div className="ci-stamp">ON HOLD</div>
      </div>
      <div className="ci-agentcard ci-reveal">
        <div className="ci-agent-top"><CloudIcon id="agentforce" size={20} /> <b>{tx('Service agent', 'Service-agent')}</b><i className="ci-live">● live</i></div>
        <div className="ci-agent-n"><b>{n}</b><span>{tx('customer questions answered today', 'klantvragen vandaag beantwoord')}</span></div>
        <div className="ci-agent-rows"><span>✓ {tx('Appointments booked', 'Afspraken ingepland')}</span><span>✓ {tx('Order status', 'Orderstatus')}</span><span>↗ {tx('3 handed to a colleague', '3 doorgezet naar collega')}</span></div>
      </div>
    </Scene>
  );
}

/* ---------------- Experience Cloud ---------------- */
function Exp1() {
  const [p, run, replay] = usePhase(2800, 3200);
  const n = useCount(p === 'a', 1, 23, 2400);
  return (
    <Scene title={tx('1 · The same mail, again', '1 · Steeds dezelfde mail')} note={tx('"Can you resend my invoice?" keeps coming in; then the customer logs in and does it themselves.', '"Kun je mijn factuur nog eens sturen?" blijft binnenkomen; daarna logt de klant in en regelt het zelf.')} phase={p} run={run} replay={replay}>
      <div className="ci-repeat ci-hide-b">
        {[0, 1, 2, 3].map((i) => <div key={i} className="ci-chip ci-drop" style={{ '--d': i * 0.45 + 's', top: 12 + i * 18 + '%' }}><small>{['Polderbouw', 'Duinzicht Zorg', 'Havenwerk BV', 'Polderbouw'][i]}</small>{tx('Can you resend my invoice?', 'Kun je mijn factuur nog eens sturen?')}</div>)}
        <div className="ci-badge-n">×{n}</div>
      </div>
      <div className="ci-full ci-reveal">
        <div className="ci-login ci-login--go"><b>{tx('Customer portal', 'Klantportaal')}</b><span>noor@havenwerk.nl</span><span>••••••••</span><i>{tx('Log in', 'Inloggen')}</i></div>
        <div className="ci-portal-in"><MiniScreen id="experience" /></div>
      </div>
    </Scene>
  );
}
function Exp2() {
  const [p, run, replay] = usePhase(2400, 3400);
  return (
    <Scene title={tx('2 · The door opens', '2 · De deur gaat open')} note={tx('A closed door with office hours swings open into the portal; tiles light up one by one.', 'Een dichte deur met openingstijden zwaait open naar het portaal; tegels lichten één voor één op.')} phase={p} run={run} replay={replay}>
      <div className="ci-doorway">
        <div className="ci-door"><div className="ci-door-sign">{tx('Office hours', 'Openingstijden')}<b>9:00 – 17:00</b><small>{tx('Closed', 'Gesloten')}</small></div><i className="ci-knob" /></div>
        <div className="ci-behind">
          {[[tx('My installations', 'Mijn installaties'), '4'], [tx('Invoices', 'Facturen'), '12'], [tx('Plan maintenance', 'Onderhoud plannen'), '→'], [tx('Documents', 'Documenten'), '2']].map(([a, b], i) => <div key={a} className="ci-tile" style={{ '--d': 0.5 + i * 0.25 + 's' }}><b>{b}</b><span>{a}</span></div>)}
        </div>
      </div>
    </Scene>
  );
}

/* ---------------- Data 360 ---------------- */
const VERSIONS = [['Havenwerk B.V.', 'ERP', 12, 8, -5], ['Havenwerk BV', 'Web', 58, 4, 4], ['havenwerk bv', tx('Service', 'Service'), 6, 58, 3], ['Havenwerk (old address)', 'Mail', 56, 60, -4], ['HAVENWERK', 'Marketing', 32, 32, 2]];
function Data1() {
  const [p, run, replay] = usePhase(2600, 3400);
  return (
    <Scene title={tx('1 · Five versions of one customer', '1 · Vijf versies van één klant')} note={tx('Slightly different records slide together and fuse into one golden profile.', 'Net-iets-andere records schuiven samen en smelten tot één gouden profiel.')} phase={p} run={run} replay={replay}>
      {VERSIONS.map(([n, s, l, t, r], i) => <div key={n} className="ci-chip ci-merge ci-rec" style={{ left: l + '%', top: t + '%', '--r': r + 'deg', '--d': i * 0.15 + 's' }}><small>{s}</small>{n}</div>)}
      <div className="ci-golden ci-reveal">
        <div className="ci-golden-top"><span className="ci-avatar">HW</span><div><b>Havenwerk BV</b><span>Industrieweg 12, Zaandam</span></div></div>
        <div className="ci-golden-src">{['ERP', 'Web', 'Service', 'Mail', 'Marketing'].map((x) => <i key={x}>{x}</i>)}</div>
        <div className="ci-golden-kpi"><span>{tx('Open orders', 'Open orders')} <b>3</b></span><span>{tx('Cases', 'Cases')} <b>1</b></span><span>NPS <b>8.4</b></span></div>
      </div>
    </Scene>
  );
}
const NODES = [[60, 50, 'ERP'], [340, 50, 'Web'], [40, 220, 'Service'], [360, 220, 'Mail'], [200, 255, 'Marketing']];
function Data2() {
  const [p, run, replay] = usePhase(2400, 3400);
  return (
    <Scene title={tx('2 · Tangled lines', '2 · Kluwen van lijnen')} note={tx('Systems connected point-to-point in a tangle; it untangles into one hub with one profile.', 'Systemen kriskras aan elkaar gekoppeld; het kluwen ontwart zich tot één hub met één profiel.')} phase={p} run={run} replay={replay}>
      <svg className="ci-map" viewBox="0 0 400 280" aria-hidden="true">
        {NODES.map(([x, y], i) => NODES.slice(i + 1).map(([x2, y2], j) => <path key={i + '-' + j} className="ci-tangle" d={`M${x} ${y} C${(x + x2) / 2 + (j % 2 ? 90 : -90)} ${y - 60} ${(x + x2) / 2 + (i % 2 ? -70 : 70)} ${y2 + 60} ${x2} ${y2}`} />))}
        {NODES.map(([x, y], i) => <line key={'h' + i} className="ci-spoke" x1={x} y1={y} x2="200" y2="140" />)}
        <circle className="ci-hubdot" cx="200" cy="140" r="34" />
        <text className="ci-hubtxt" x="200" y="137" textAnchor="middle">{tx('One', 'Eén')}</text>
        <text className="ci-hubtxt" x="200" y="152" textAnchor="middle">{tx('profile', 'profiel')}</text>
        {NODES.map(([x, y, n]) => <g key={n}><rect x={x - 36} y={y - 14} width="72" height="28" rx="14" fill="#fff" stroke="#402301" strokeWidth="1.5" /><text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#402301">{n}</text></g>)}
      </svg>
    </Scene>
  );
}

export function CloudIntrosReview() {
  const rows = [
    ['service', 'Service Cloud', Service1, Service2],
    ['field', 'Field Service', Field1, Field2],
    ['agentforce', 'Agentforce', Agent1, Agent2],
    ['experience', 'Experience Cloud', Exp1, Exp2],
    ['data', 'Data 360', Data1, Data2],
  ];
  return (
    <section className="ci">
      <div className="container">
        <p className="ci-intro">{tx('Rough previews of the opening animation per cloud (Sales Cloud keeps its floating notes). Pick option 1 or 2 per cloud as the starting point; the chosen ones get finalized later. Each loops: problem → solved.', 'Ruwe previews van de openingsanimatie per cloud (Sales Cloud houdt de zwevende notities). Kies per cloud optie 1 of 2 als startpunt; de gekozen versies werken we later uit. Elke animatie loopt rond: probleem → opgelost.')}</p>
        {rows.map(([id, name, A, B]) => (
          <div key={id} className="ci-row">
            <h3><CloudIcon id={id} size={22} /> {name}</h3>
            <div className="ci-pair"><A /><B /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CiStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CI_CSS }} />;
}

const CI_CSS = `
.ci { padding: 60px 0 100px; background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
.ci-intro { font-size: 16px; color: var(--fg-muted); max-width: 52em; margin: 0 0 30px; }
.ci-row { margin-top: 36px; }
.ci-row h3 { display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 600; margin: 0 0 14px; }
.ci-row h3 .cl-ico { color: var(--intigris-coral); }
.ci-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ci-scene { margin: 0; }
.ci-stage { position: relative; height: 340px; border-radius: 22px; overflow: hidden; border: 1px solid var(--border); background: radial-gradient(120% 90% at 80% 10%, #ffe1d6 0%, var(--intigris-paper) 55%); }
.ci-scene figcaption { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; margin-top: 10px; font-size: 14px; }
.ci-scene figcaption span { color: var(--fg-muted); flex: 1; min-width: 200px; }
.ci-scene figcaption button { all: unset; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--intigris-coral-700); }
@keyframes ciPop { from { opacity: 0; transform: translateY(10px) scale(.92); } to { opacity: 1; transform: none; } }
/* generic phase helpers */
.ci-reveal { opacity: 0; transform: scale(.95); transition: opacity .4s var(--d, 0s), transform .45s var(--d, 0s) cubic-bezier(.2,.8,.2,1); pointer-events: none; }
.ci--b .ci-reveal { opacity: 1; transform: none; }
.ci-hide-b { transition: opacity .35s, transform .4s; }
.ci--b .ci-hide-b { opacity: 0; transform: scale(.9); }
.ci-chip { position: absolute; max-width: 44%; padding: 10px 13px; border-radius: 12px; background: #fff; box-shadow: 0 12px 26px -16px rgba(43,23,0,.5); font-size: 14px; font-weight: 500; animation: ciPop .4s var(--d, 0s) both; transform: rotate(var(--r, 0deg)); }
.ci-chip small { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; opacity: .55; margin-bottom: 3px; }
.ci-merge { transition: left .5s cubic-bezier(.6,0,.2,1), top .5s cubic-bezier(.6,0,.2,1), opacity .4s .2s, transform .5s; }
.ci--b .ci-merge { left: 32% !important; top: 38% !important; opacity: 0; transform: scale(.5); }
.ci-full { position: absolute; inset: 22px; display: flex; align-items: center; justify-content: center; }
.ci-full .wts-screen { width: 100%; }
/* service 1 */
.ci-case { position: absolute; left: 12%; right: 12%; top: 22%; background: #fff; border-radius: 16px; padding: 18px 20px; box-shadow: 0 24px 50px -28px rgba(43,23,0,.6); }
.ci-case-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.ci-tag { font-style: normal; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; background: #e3f5e9; color: #2e844a; }
.ci-case p { font-size: 20px; font-weight: 500; margin: 10px 0 12px; }
.ci-tl { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12.5px; color: #0176d3; font-weight: 600; }
/* service 2 */
.ci-inbox { position: absolute; inset: 0; }
.ci-inbox-count { position: absolute; left: 8%; top: 12%; display: flex; flex-direction: column; }
.ci-inbox-count b { font-size: 72px; font-weight: 600; color: var(--intigris-coral); line-height: 1; font-variant-numeric: tabular-nums; }
.ci-inbox-count span { font-size: 14px; color: var(--fg-muted); }
.ci-mail { position: absolute; right: 8%; width: 46%; padding: 8px 12px; border-radius: 10px; background: #fff; font-size: 13px; box-shadow: 0 8px 18px -12px rgba(43,23,0,.5); animation: ciPop .35s var(--d) both; }
/* field 1 */
.ci-map { position: absolute; inset: 18px; width: calc(100% - 36px); height: calc(100% - 36px); }
.ci-route { fill: none; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1400; stroke-dashoffset: 1400; }
.ci-route--bad { stroke: var(--intigris-coral); animation: ciDraw 2.2s .2s ease-in-out forwards; }
.ci-route--good { stroke: #2e844a; opacity: 0; }
.ci--b .ci-route--bad { opacity: .15; transition: opacity .4s; }
.ci--b .ci-route--good { opacity: 1; animation: ciDraw 1.6s ease-in-out forwards; }
@keyframes ciDraw { to { stroke-dashoffset: 0; } }
.ci-km { position: absolute; right: 24px; bottom: 22px; padding: 8px 14px; border-radius: 99px; background: #fff; font-size: 14px; font-weight: 700; color: var(--intigris-coral-700); box-shadow: 0 8px 18px -10px rgba(43,23,0,.4); }
.ci-km--good { color: #2e844a; }
/* field 2 */
.ci-board { position: absolute; left: 8%; right: 8%; top: 10%; padding: 16px; border-radius: 12px; background: #fafbfc; border: 6px solid #c9ced4; transition: transform .6s cubic-bezier(.6,0,.6,1), opacity .5s; }
.ci--b .ci-fall { transform: translateY(120%) rotate(8deg); opacity: 0; }
.ci-board-head { font-family: 'Comic Sans MS', 'Marker Felt', cursive; font-size: 15px; font-weight: 700; color: #1e5bb8; margin-bottom: 8px; }
.ci-board-row { display: flex; gap: 12px; align-items: center; padding: 6px 0; border-bottom: 1px dashed #c9ced4; font-family: 'Marker Felt', 'Comic Sans MS', cursive; font-size: 14px; transform: rotate(var(--r)); }
.ci-board-row b { width: 52px; color: #b8321e; } .ci-board-row span { flex: 1; color: #333; text-decoration: line-through 1px rgba(0,0,0,.25); }
.ci-magnet { width: 14px; height: 14px; border-radius: 50%; background: var(--intigris-coral); box-shadow: inset -2px -2px 0 rgba(0,0,0,.2); }
.ci-phone { position: absolute; left: 50%; top: 8%; width: 170px; height: 300px; margin-left: -85px; border-radius: 28px; background: #1b1b1f; padding: 12px; box-sizing: border-box; }
.ci-phone-notch { width: 50px; height: 6px; border-radius: 6px; background: #333; margin: 0 auto 10px; }
.ci-phone-job { background: #fff; border-radius: 16px; height: calc(100% - 16px); padding: 14px; box-sizing: border-box; display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; color: #333; }
.ci-phone-job small { font-size: 11px; font-weight: 700; color: #0176d3; } .ci-phone-job b { font-size: 16px; color: #111; }
.ci-phone-btn { margin-top: auto; text-align: center; padding: 9px; border-radius: 10px; background: #2e844a; color: #fff; font-weight: 600; }
/* agent 1 */
.ci-clock { position: absolute; left: 20px; top: 18px; padding: 6px 12px; border-radius: 99px; background: #1f2a44; color: #fff; font-size: 14px; font-weight: 600; }
.ci-chat { position: absolute; left: 10%; right: 10%; top: 22%; display: flex; flex-direction: column; gap: 10px; }
.ci-msg { max-width: 78%; padding: 11px 14px; border-radius: 14px; font-size: 14px; line-height: 1.4; background: #fff; box-shadow: 0 6px 14px -10px rgba(43,23,0,.4); }
.ci-msg--in { align-self: flex-start; animation: ciPop .4s var(--d) both; }
.ci-msg--closed { align-self: flex-end; background: #eceae6; color: #6b6b6b; font-style: italic; animation: ciPop .4s var(--d) both; }
.ci--b .ci-msg--closed { display: none; }
.ci-msg--agent { align-self: flex-end; background: #eef4ff; } .ci-msg--agent b { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #0176d3; margin-bottom: 3px; }
.ci-msg--ok { align-self: flex-end; background: #e3f5e9; color: #2e844a; font-weight: 600; }
/* agent 2 */
.ci-folder { position: absolute; left: 14%; top: 16%; width: 58%; height: 62%; border-radius: 4px 14px 14px 14px; background: #f3d98b; box-shadow: 0 18px 30px -18px rgba(43,23,0,.5); }
.ci-folder-tab { position: absolute; top: -22px; left: 0; padding: 4px 14px; border-radius: 10px 10px 0 0; background: #f3d98b; font-size: 12px; font-weight: 700; }
.ci-doc { position: absolute; left: calc(14px + var(--x)); top: calc(14px + var(--y)); width: 60%; padding: 10px 12px; background: #fff; border-radius: 6px; font-size: 12px; font-family: ui-monospace, Menlo, monospace; box-shadow: 0 2px 6px rgba(0,0,0,.12); animation: ciPop .35s var(--d) both; }
.ci-stamp { position: absolute; right: -12%; bottom: 14%; padding: 6px 14px; border: 3px solid #c0392b; color: #c0392b; font-weight: 800; letter-spacing: .1em; border-radius: 6px; transform: rotate(-14deg); animation: ciStamp .3s 1.5s both; background: rgba(255,255,255,.6); }
@keyframes ciStamp { from { opacity: 0; transform: rotate(-14deg) scale(2); } to { opacity: 1; transform: rotate(-14deg) scale(1); } }
.ci-agentcard { position: absolute; left: 14%; right: 14%; top: 16%; background: #fff; border-radius: 18px; padding: 20px; box-shadow: 0 24px 50px -28px rgba(43,23,0,.6); }
.ci-agent-top { display: flex; align-items: center; gap: 8px; } .ci-agent-top .cl-ico { color: var(--intigris-coral); }
.ci-live { margin-left: auto; font-style: normal; font-size: 12px; font-weight: 700; color: #2e844a; }
.ci-agent-n { display: flex; align-items: baseline; gap: 10px; margin: 12px 0; } .ci-agent-n b { font-size: 52px; font-weight: 600; color: #0176d3; font-variant-numeric: tabular-nums; } .ci-agent-n span { font-size: 13px; color: #555; max-width: 14em; }
.ci-agent-rows { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: #333; }
/* experience 1 */
.ci-repeat { position: absolute; inset: 0; }
.ci-drop { left: 8%; max-width: 62%; }
.ci-badge-n { position: absolute; right: 9%; top: 34%; width: 92px; height: 92px; border-radius: 50%; display: grid; place-items: center; background: var(--intigris-coral); color: #fff; font-size: 30px; font-weight: 700; font-variant-numeric: tabular-nums; }
.ci-login { position: absolute; width: 56%; background: #fff; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 24px 50px -28px rgba(43,23,0,.6); font-size: 13px; }
.ci-login span { padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; color: #555; }
.ci-login i { font-style: normal; text-align: center; padding: 9px; border-radius: 8px; background: #0176d3; color: #fff; font-weight: 600; }
.ci--b .ci-login--go { animation: ciLoginOut .4s 1.1s forwards; }
@keyframes ciLoginOut { to { opacity: 0; transform: scale(.9); } }
.ci-portal-in { width: 100%; opacity: 0; } .ci--b .ci-portal-in { animation: ciPop .45s 1.3s both; }
/* experience 2 */
.ci-doorway { position: absolute; inset: 22px 18%; perspective: 900px; }
.ci-door { position: absolute; inset: 0; z-index: 2; border-radius: 10px; background: linear-gradient(90deg, #6b4423, #8a5a30); transform-origin: left center; transition: transform 1s cubic-bezier(.6,0,.2,1); display: flex; align-items: center; justify-content: center; }
.ci--b .ci-door { transform: rotateY(-100deg); }
.ci-door-sign { background: #fff; border-radius: 8px; padding: 12px 16px; text-align: center; font-size: 12px; display: flex; flex-direction: column; gap: 2px; } .ci-door-sign b { font-size: 18px; } .ci-door-sign small { color: #c0392b; font-weight: 700; }
.ci-knob { position: absolute; right: 16px; top: 52%; width: 14px; height: 14px; border-radius: 50%; background: #e8c170; }
.ci-behind { position: absolute; inset: 0; border-radius: 10px; background: #eef4ff; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 16px; }
.ci-tile { background: #fff; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; justify-content: center; opacity: .25; transition: opacity .3s var(--d), transform .3s var(--d); }
.ci--b .ci-tile { opacity: 1; transform: translateY(-2px); }
.ci-tile b { font-size: 24px; color: #0176d3; } .ci-tile span { font-size: 12px; color: #555; }
/* data 1 */
.ci-rec { max-width: 40%; }
.ci-golden { position: absolute; left: 14%; right: 14%; top: 20%; background: #fff; border-radius: 18px; padding: 20px; box-shadow: 0 0 0 3px #f4c15d, 0 24px 50px -28px rgba(43,23,0,.6); }
.ci-golden-top { display: flex; gap: 12px; align-items: center; } .ci-golden-top b { display: block; font-size: 18px; } .ci-golden-top span { font-size: 13px; color: #666; }
.ci-avatar { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: var(--intigris-coral); color: #fff !important; font-weight: 700; font-size: 14px !important; }
.ci-golden-src { display: flex; gap: 6px; flex-wrap: wrap; margin: 14px 0; } .ci-golden-src i { font-style: normal; font-size: 11.5px; font-weight: 600; padding: 4px 9px; border-radius: 8px; background: #eef4ff; color: #0176d3; }
.ci-golden-kpi { display: flex; gap: 16px; font-size: 13px; color: #555; } .ci-golden-kpi b { color: #111; }
/* data 2 */
.ci-tangle { fill: none; stroke: var(--intigris-coral); stroke-width: 1.6; opacity: .7; stroke-dasharray: 900; stroke-dashoffset: 900; animation: ciDraw 1.8s ease-in-out forwards; transition: opacity .4s; }
.ci--b .ci-tangle { opacity: 0; }
.ci-spoke { stroke: #2e844a; stroke-width: 3; stroke-dasharray: 260; stroke-dashoffset: 260; }
.ci--b .ci-spoke { animation: ciDraw .8s .3s ease-out forwards; }
.ci-hubdot { fill: #2e844a; opacity: 0; transform-origin: 200px 140px; transform: scale(.4); transition: opacity .4s .7s, transform .5s .7s cubic-bezier(.2,.8,.2,1); }
.ci--b .ci-hubdot { opacity: 1; transform: none; }
.ci-hubtxt { fill: #fff; font-size: 12px; font-weight: 700; opacity: 0; transition: opacity .3s 1s; } .ci--b .ci-hubtxt { opacity: 1; }
@media (max-width: 960px) { .ci-pair { grid-template-columns: 1fr; } }
`;
