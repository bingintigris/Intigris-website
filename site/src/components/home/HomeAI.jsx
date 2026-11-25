/* ==================================================================== */
/*  HOMEPAGE · AI SOLUTIONS view (index, mode = ai, the default)         */
/*  Plan agreed with Bing 2026-11-25 (session "Agentris website"):       */
/*    content = the Agentris market proposition (Bitbucket repo          */
/*    intigris/agentris-market-proposition, 20 Nov 2026), shown under    */
/*    the Intigris brand (decision 1A). AI-ify = the umbrella approach;  */
/*    the AI Readiness Scan is the light first check below it            */
/*    ("are you ready to AI-ify?", decision 2).                          */
/*  Rules from the proposition meetings (19 + 20 Nov 2026):              */
/*    no prices on the website (not even "on request"), no free check,   */
/*    no "fixed prices" claim, system-independent (no Salesforce in the  */
/*    AI offer itself), Fractional AI-lead clearly visible,              */
/*    no "certified / conform art. 4" claims, no tool logos (text only). */
/*  Sections: 1 The AI gap · 2 The ladder (AI-ify) · 3 Workshops ·       */
/*    4 The AI-ify method · 5 What we build · 6 Run & improve +          */
/*    Fractional AI-lead · 7 Already on Salesforce? · 8 Why Intigris ·   */
/*    9 FAQ (chat with Frank) · 10 Chat with Frank (closing).            */
/* ==================================================================== */
import React, { useEffect, useRef, useState } from 'react';
import { tx, lp } from '../../lib/i18n.js';
import { CkHead, CkStyles } from '../../legacy/components/CloudKit.jsx';
import { V3FaqChat, V3Styles } from '../../legacy/components/CloudKitV3.jsx';
import { TalkChatAsk, TkStyles } from './TalkVariants.jsx';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* adds "in" once the element scrolls into view; children animate with CSS */
function useIn(threshold = 0.2) {
  const ref = useRef(null); const [inV, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window) || reduced()) { setIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, inV];
}

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

/* ---------- icons (stroke, currentColor) ---------- */
const ICONS = {
  agent: <><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6" /></>,
  flow: <><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 12h5l5-6M12 12l5 6" /></>,
  cloud: <><path d="M7 18a5 5 0 01-.6-9.96A6 6 0 0118 9a4 4 0 01-1 7.87" /><path d="M8 18h9" /></>,
  link: <><path d="M9 7H6a3 3 0 000 6h3M15 7h3a3 3 0 010 6h-3M8 10h8" /><path d="M12 17v4" /></>,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></>,
  euro: <><path d="M18 7a6 6 0 100 10" /><path d="M5 10h9M5 14h9" /></>,
  team: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016-4.6" /></>,
  learn: <><path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" /><path d="M2 19h20M9 9h6M9 13h4" /></>,
  scan: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M8 11h6M11 8v6" /></>,
  build: <><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></>,
  run: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
};
const Icon = ({ k }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k]}</svg>;

/* ==================================================================== */
/*  1 · The AI gap                                                       */
/* ==================================================================== */
function AiGap() {
  const [ref, inV] = useIn();
  const items = [
    { n: '01', t: tx('No structure', 'Geen structuur'), d: tx('Everyone uses their own tool, their own prompts and their own rules. The result depends on who is at the keyboard.', 'Iedereen gebruikt een eigen tool, eigen prompts en eigen regels. Het resultaat hangt af van wie er achter het toetsenbord zit.') },
    { n: '02', t: tx('A legal duty', 'Een wettelijke plicht'), d: tx('Under the EU AI Act (Art. 4), organisations take measures to support their staff’s AI literacy. That includes business use of ChatGPT. Supervision started on 2 August 2026.', 'Onder de EU AI Act (art. 4) nemen organisaties maatregelen om de AI-geletterdheid van hun medewerkers te ondersteunen. Dat geldt ook voor zakelijk gebruik van ChatGPT. Het toezicht loopt sinds 2 augustus 2026.') },
    { n: '03', t: tx('Tools, not processes', 'Tools, geen processen'), d: tx('A chatbot next to your systems saves minutes. AI built into the way your work flows is where the real time comes back.', 'Een chatbot naast je systemen bespaart minuten. AI die in je werkprocessen zit, is waar de echte tijd terugkomt.') },
  ];
  return (
    <section className={'ck-section ck-section--dark hai-gap' + (inV ? ' in' : '')} ref={ref}>
      <div className="container-wide">
        <div className="hai-gap-grid">
          <CkHead eyebrow={tx('THE AI GAP', 'DE AI-KLOOF')} a={tx('Everyone uses AI.', 'Iedereen gebruikt AI.')} b={tx('Few get real value from it.', 'Weinigen halen er echt waarde uit.')}
            lede={tx('Most teams try ChatGPT or Copilot on their own, without a plan, without rules and without a link to how the work actually runs. We take you from “we do something with AI” to processes where AI saves time every single day.',
              'De meeste teams proberen ChatGPT of Copilot op eigen houtje: zonder plan, zonder afspraken en los van hoe het werk echt loopt. Wij brengen je van “we doen iets met AI” naar processen waarin AI elke dag tijd bespaart.')} />
          <div className="hai-gap-list">
            {items.map((it, i) => (
              <div key={it.n} className="hai-gap-item hai-r" style={{ '--i': i + 1 }}>
                <small>{it.n}</small>
                <div><h3>{it.t}</h3><p>{it.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  2 · The ladder: Learn → Scan → Build → Run (AI-ify), entry = scan    */
/* ==================================================================== */
const RUNGS = () => [
  { k: 'learn', n: '1', t: tx('Learn', 'Leren'), sub: tx('Workshops', 'Workshops'), href: '#ai-workshops',
    d: tx('Your team understands what AI can and can’t do, works with it safely and meets the AI literacy duty.', 'Je team snapt wat AI wel en niet kan, werkt er veilig mee en voldoet aan de AI-geletterdheidsplicht.'),
    li: [tx('Basic, Advanced or a custom programme', 'Basis, Advanced of een traject op maat'), tx('On site or online, Dutch or English', 'Op locatie of online, Nederlands of Engels'), tx('AI literacy record for your files', 'AI-geletterdheidsdossier voor je eigen administratie')] },
  { k: 'scan', n: '2', t: tx('Scan', 'Scannen'), sub: tx('The AI-ify scan', 'De AI-ify-scan'), href: '#ai-method',
    d: tx('We measure where the time goes and which steps an agent can take over, with a business case per use case.', 'We meten waar de tijd zit en welke stappen een agent kan overnemen, met een business case per use case.'),
    li: [tx('Interviews and time measurement', 'Interviews en tijdsmeting'), tx('Opportunity map, scored per step', 'Kansenkaart, gescoord per stap'), tx('Top 3 use cases and a 90-day roadmap', 'Top-3 use cases en een roadmap voor 90 dagen')] },
  { k: 'build', n: '3', t: tx('Build', 'Bouwen'), sub: tx('Pilot & implementation', 'Pilot & implementatie'), href: '#ai-build',
    d: tx('A pilot of 4 to 6 weeks with a clear go/no-go, then on to production in your own systems.', 'Een pilot van 4 tot 6 weken met een heldere go/no-go, daarna door naar productie in je eigen systemen.'),
    li: [tx('Agents and workflow automation', 'Agents en workflow-automatisering'), tx('Connected to the systems you use', 'Gekoppeld aan de systemen die je gebruikt'), tx('Measured against the baseline', 'Gemeten tegen de nulmeting')] },
  { k: 'run', n: '4', t: tx('Run', 'Beheren'), sub: tx('Manage & improve', 'Beheer & verbeteren'), href: '#ai-run',
    d: tx('We measure the effect, keep sharpening the agents and keep the costs of AI under control.', 'We meten het effect, maken de agents steeds beter en houden de kosten van AI in de hand.'),
    li: [tx('Monitoring and fixes', 'Monitoring en fixes'), tx('Monthly improvement rounds', 'Maandelijkse verbeterrondes'), tx('Or a Fractional AI lead at your table', 'Of een Fractional AI-lead aan tafel')] },
];

function AiLadder() {
  const R = RUNGS();
  const [ref, inV] = useIn(0.3);
  const [act, setAct] = useState(0);
  const [touched, setTouched] = useState(false);
  /* walks through the four steps by itself until the visitor picks one */
  useEffect(() => {
    if (!inV || touched || reduced()) return;
    const t = setTimeout(() => setAct((a) => (a + 1) % R.length), 4200);
    return () => clearTimeout(t);
  }, [inV, touched, act]);
  const pick = (i) => { setTouched(true); setAct(i); };
  const r = R[act];
  return (
    <section id="ai-ify" className={'ck-section hai-ladder' + (inV ? ' in' : '')} ref={ref}>
      <div className="container-wide">
        <CkHead eyebrow={tx('HOW WE AI-IFY YOUR BUSINESS', 'ZO AI-IFYEN WE JE BEDRIJF')} a={tx('One partner for', 'Eén partner voor')} b={tx('the whole AI journey.', 'de hele AI-reis.')}
          lede={tx('AI-ify is our approach to bringing AI into your business, one step at a time. Start where you are: with knowledge, with insight into your processes, or straight away with building.',
            'AI-ify is onze aanpak om AI stap voor stap in je bedrijf te brengen. Begin waar je staat: met kennis, met inzicht in je processen, of direct met bouwen.')} />

        {/* step 0: the AI Readiness Scan sits below AI-ify as the light first check */}
        <a className="hai-entry hai-r" style={{ '--i': 1 }} href={lp('/ai-readiness-scan')}>
          <span className="hai-entry-tag">{tx('Step 0 · Not sure where you stand?', 'Stap 0 · Weet je niet waar je staat?')}</span>
          <span className="hai-entry-text"><b>{tx('AI Readiness Scan', 'AI Readiness Scan')}</b>{tx(' An honest check of whether your business is ready to AI-ify, with a written report in about two working days.', ' Een eerlijke check of je bedrijf klaar is om te AI-ifyen, met een rapport binnen zo’n twee werkdagen.')}</span>
          <span className="hai-entry-go" aria-hidden="true">→</span>
        </a>

        <div className="hai-ladder-grid hai-r" style={{ '--i': 2 }}>
          <div className="hai-rungs" role="tablist" aria-label={tx('The four AI-ify steps', 'De vier AI-ify-stappen')}>
            {R.map((x, i) => (
              <button key={x.k} type="button" role="tab" aria-selected={i === act}
                className={'hai-rung' + (i === act ? ' on' : '') + (i < act ? ' past' : '')}
                onClick={() => pick(i)} onMouseEnter={() => pick(i)}>
                <span className="hai-rung-n">{x.n}</span>
                <span className="hai-rung-ico"><Icon k={x.k} /></span>
                <span className="hai-rung-t"><b>{x.t}</b><small>{x.sub}</small></span>
                {i === act && !touched && inV && !reduced() && <i className="hai-rung-timer" key={'t' + act} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="hai-rung-panel" role="tabpanel" key={r.k}>
            <span className="hai-rung-panel-n">{tx('Step', 'Stap')} {r.n} · {r.sub}</span>
            <h3>{r.t}.</h3>
            <p>{r.d}</p>
            <ul>{r.li.map((l) => <li key={l}>{l}</li>)}</ul>
            <a className="hai-link" href={r.href}>{tx('Read more', 'Lees meer')} <Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  3 · Workshops (Learn) · no prices (decision 19/20 Nov)               */
/* ==================================================================== */
function AiWorkshops({ onCta }) {
  const [ref, inV] = useIn();
  const W = [
    { tag: tx('BASIC', 'BASIS'), name: tx('AI Foundations & AI Literacy', 'AI-fundamenten & AI-geletterdheid'), meta: tx('Half day · up to 12 people', 'Halve dag · max. 12 deelnemers'),
      li: [tx('What LLMs and agents are, and what AI can and can’t do', 'Wat LLM’s en agents zijn, en wat AI wel en niet kan'), tx('The right tool per task: ChatGPT, Claude, Copilot, Gemini', 'De juiste tool per taak: ChatGPT, Claude, Copilot, Gemini'), tx('Prompting essentials', 'Prompting essentials'), tx('AI Act Art. 4: data & GDPR, hallucinations, AI policy', 'AI Act art. 4: data & AVG, hallucinaties, AI-beleid'), tx('Hands-on with your own daily tasks', 'Hands-on met je eigen dagelijkse taken')],
      cta: tx('Ask about Basic', 'Vraag Basis aan') },
    { tag: 'ADVANCED', featured: true, name: tx('AI Process Automation', 'AI-procesautomatisering'), meta: tx('Full day · up to 12 people', 'Hele dag · max. 12 deelnemers'),
      li: [tx('Everything in Basic', 'Alles uit Basis'), tx('2–3 of your own processes, analysed in advance', '2–3 eigen processen, vooraf geanalyseerd'), tx('Find opportunities for agents and automation together', 'Samen kansen vinden voor agents en automatisering'), tx('Any system: from email to CRM and ERP', 'Elk systeem: van mail tot CRM en ERP'), tx('You leave with a top-5 use-case roadmap', 'Je gaat naar huis met een top-5 use-case-roadmap')],
      cta: tx('Ask about Advanced', 'Vraag Advanced aan') },
    { tag: tx('CUSTOM', 'OP MAAT'), name: tx('Custom AI Programme', 'AI-traject op maat'), meta: tx('Programme · several teams', 'Traject · meerdere teams'),
      li: [tx('Workshops per team or role', 'Workshops per team of rol'), tx('Combined with the AI-ify scan', 'Gecombineerd met de AI-ify-scan'), tx('Your first use case live (proof of concept)', 'Je eerste use case live (proof of concept)'), tx('Training internal AI champions', 'Interne AI-champions opleiden'), tx('AI policy and your AI Act obligations', 'AI-beleid en je AI Act-verplichtingen')],
      cta: tx('Discuss a programme', 'Bespreek een traject') },
  ];
  return (
    <section id="ai-workshops" className={'ck-section ck-section--soft hai-ws' + (inV ? ' in' : '')} ref={ref}>
      <div className="container-wide">
        <CkHead eyebrow={tx('STEP 1 · LEARN', 'STAP 1 · LEREN')} a={tx('Get your team', 'Zet je team')} b={tx('working with AI.', 'aan het werk met AI.')}
          lede={tx('Safe, practical and useful the next morning. On site or online, in Dutch or English. On site has our preference: more interaction in the room.',
            'Veilig, praktisch en de volgende ochtend al bruikbaar. Op locatie of online, in het Nederlands of Engels. Op locatie heeft onze voorkeur: meer interactie in de groep.')} />
        <div className="hai-ws-grid">
          {W.map((w, i) => (
            <div key={w.tag} className={'hai-ws-card hai-r' + (w.featured ? ' is-featured' : '')} style={{ '--i': i + 1 }}>
              {w.featured && <span className="hai-badge">{tx('Recommended', 'Aanbevolen')}</span>}
              <span className="hai-ws-tag">{w.tag}</span>
              <h3>{w.name}</h3>
              <span className="hai-ws-meta">{w.meta}</span>
              <ul>{w.li.map((l) => <li key={l}>{l}</li>)}</ul>
              <button type="button" className={'btn ' + (w.featured ? 'hai-btn-dark' : 'btn-secondary')} onClick={onCta}>{w.cta} <Arrow /></button>
            </div>
          ))}
        </div>
        <div className="hai-record hai-r" style={{ '--i': 4 }}>
          <b>{tx('Every workshop includes an AI literacy record', 'Elke workshop levert een AI-geletterdheidsdossier op')}</b>
          <span>{tx('Programme, attendance list and proof of attendance per employee. It supports your measures under Art. 4 of the AI Act; it is not an official certification or quality mark.',
            'Programma, presentielijst en bewijs van deelname per medewerker. Het ondersteunt je maatregelen onder art. 4 van de AI Act; het is geen officiële certificering of keurmerk.')}</span>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  4 · The AI-ify method: 8 steps, scan (1–4) · go/no-go · upgrade (5–8) */
/* ==================================================================== */
const STEPS = () => [
  { t: tx('Intake', 'Intake'), d: tx('A conversation with management. We look at your business as one chain of work and pick the processes with the most potential.', 'Een gesprek met directie of eigenaar. We bekijken je bedrijf als één keten van werk en kiezen de processen met de meeste potentie.') },
  { t: tx('As-is', 'As-is'), d: tx('We map the process with the people who run it: which steps, which input, how much time per step.', 'We brengen het proces in kaart met de mensen die het uitvoeren: welke stappen, welke input, hoeveel tijd per stap.') },
  { t: tx('Identify', 'Identificeren'), d: tx('Per step we decide where an agent can help or take over, and what deliberately stays human.', 'Per stap bepalen we waar een agent kan ondersteunen of overnemen, en wat bewust menselijk blijft.') },
  { t: tx('Assess', 'Beoordelen'), d: tx('Every opportunity is scored on repeatability, autonomy and safety, with an estimate of the time saved.', 'Elke kans krijgt een score op herhaalbaarheid, autonomie en veiligheid, plus een inschatting van de besparing.') },
  { t: tx('To-be', 'To-be'), d: tx('We redesign the process: people and agents working together, with clear checkpoints.', 'We herontwerpen het proces: mensen en agents werken samen, met duidelijke controlemomenten.') },
  { t: tx('Plan', 'Plannen'), d: tx('A spec per agent, the choice of tools and models, and agreements on data and security.', 'Specificatie per agent, keuze van tools en modellen, en afspraken over data en beveiliging.') },
  { t: tx('Build', 'Bouwen'), d: tx('We build the agents and automations in your own environment and systems.', 'We bouwen de agents en automatiseringen in je eigen omgeving en systemen.') },
  { t: tx('Measure', 'Meten'), d: tx('We measure the effect against the baseline from step 2 and improve where needed.', 'We meten het effect tegen de nulmeting uit stap 2 en verbeteren waar nodig.') },
];

function AiMethod({ onCta }) {
  const S = STEPS();
  const [ref, inV] = useIn(0.15);
  const Step = ({ s, i }) => (
    <div className="hai-step hai-r" style={{ '--i': i + 1 }}>
      <span className="hai-step-n">{tx('STEP', 'STAP')} {String(i + 1).padStart(2, '0')}</span>
      <h3>{s.t}</h3>
      <p>{s.d}</p>
    </div>
  );
  return (
    <section id="ai-method" className={'ck-section ck-section--dark hai-method' + (inV ? ' in' : '')} ref={ref}>
      <div className="container-wide">
        <CkHead eyebrow={tx('STEP 2 · THE AI-IFY METHOD', 'STAP 2 · DE AI-IFY-METHODE')} a={tx('Eight steps from', 'Acht stappen van')} b={tx('insight to result.', 'inzicht naar resultaat.')}
          lede={tx('The first four steps are the scan, the last four the upgrade. After each phase you decide whether we carry on. For sales, marketing, service, delivery and finance: any process, any sector.',
            'De eerste vier stappen vormen de scan, de laatste vier de upgrade. Na elke fase beslis jij of we verdergaan. Voor sales, marketing, service, delivery en finance: elk proces, elke branche.')} />

        <div className="hai-phase"><span className="hai-pill">{tx('AI-ify scan', 'AI-ify-scan')}</span>{tx('Steps 1–4 · insight', 'Stap 1–4 · inzicht')}</div>
        <div className="hai-steps">{S.slice(0, 4).map((s, i) => <Step key={i} s={s} i={i} />)}</div>

        <div className="hai-gate hai-r" style={{ '--i': 5 }} aria-label="go / no-go">
          <i /><span>{tx('Go / no-go: you decide, with the business case on the table', 'Go / no-go: jij beslist, met de business case op tafel')}</span><i />
        </div>

        <div className="hai-phase"><span className="hai-pill hai-pill--light">{tx('AI-ify upgrade', 'AI-ify-upgrade')}</span>{tx('Steps 5–8 · result', 'Stap 5–8 · resultaat')}</div>
        <div className="hai-steps">{S.slice(4).map((s, i) => <Step key={i} s={s} i={i + 4} />)}</div>

        {/* worked example from the method (illustrative, not a customer result) */}
        <div className="hai-example hai-r" style={{ '--i': 9 }}>
          <div>
            <span className="hai-example-tag">{tx('Example from the method', 'Voorbeeld uit de methode')}</span>
            <h3>{tx('Writing quotes: 5 hours each.', 'Offertes schrijven: 5 uur per stuk.')}</h3>
            <p>{tx('Input: loose notes from customer meetings, and the quotes look a lot alike. An agent drafts the quote from the meeting report; the consultant checks it and sends it.',
              'Input: losse notities uit klantgesprekken, en de offertes lijken sterk op elkaar. Een agent maakt het concept op basis van het gespreksverslag; de consultant controleert en verstuurt.')}</p>
            <small>{tx('Illustrative use case, not a customer result.', 'Illustratief voorbeeld van een use case; geen klantresultaat.')}</small>
          </div>
          <div className="hai-scores">
            {[[tx('Repeatability', 'Herhaalbaarheid'), tx('High', 'Hoog'), 0.9], [tx('Autonomy', 'Autonomie'), tx('Supporting', 'Ondersteunend'), 0.55], [tx('Risk', 'Risico'), tx('Low', 'Laag'), 0.2], [tx('Who signs off', 'Wie tekent af'), tx('A person', 'Een mens'), 1]].map(([k, v, w]) => (
              <div key={k} className="hai-score"><span>{k}</span><b>{v}</b><i style={{ '--w': w }} /></div>
            ))}
            <button type="button" className="btn btn-primary" onClick={onCta}>{tx('Talk about your processes', 'Bespreek jouw processen')} <Arrow /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  5 · What we build (Build)                                            */
/* ==================================================================== */
function AiBuild() {
  const [ref, inV] = useIn();
  const B = [
    { k: 'agent', t: tx('AI agents', 'AI-agents'), d: tx('Agents that do the work: drafting quotes, summarising tickets, following up, reporting. Always with clear approval moments.', 'Agents die taken uitvoeren: offertes opstellen, tickets samenvatten, opvolgen, rapporteren. Altijd met heldere goedkeuringsmomenten.') },
    { k: 'flow', t: tx('Workflow automation', 'Workflow-automatisering'), d: tx('Predictable, auditable workflows in n8n, Make or Power Automate, where AI does the thinking and the flow stays in charge.', 'Voorspelbare, controleerbare workflows in n8n, Make of Power Automate, waarin AI het denkwerk doet en de flow de regie houdt.') },
    { k: 'cloud', t: tx('AI in the systems you have', 'AI in je bestaande systemen'), d: tx('Set up and use the AI already inside your CRM, ERP or office software, instead of adding yet another tool.', 'De AI die al in je CRM, ERP of kantoorsoftware zit goed inrichten en benutten, in plaats van er nog een tool naast te zetten.') },
    { k: 'link', t: tx('Integrations', 'Koppelingen'), d: tx('Let AI work safely with your CRM, ERP, email, documents and planning, for example through MCP connections.', 'AI veilig laten werken met je CRM, ERP, mail, documenten en planning, onder meer via MCP-koppelingen.') },
    { k: 'doc', t: tx('Documents & invoices', 'Documenten & facturen'), d: tx('Invoices, forms and contracts read, checked and lined up for approval automatically.', 'Facturen, formulieren en contracten automatisch uitlezen, controleren en klaarzetten ter goedkeuring.') },
    { k: 'euro', t: tx('AI costs & model choice', 'AI-kosten & modelkeuze'), d: tx('The right model for the right task. Smart routing, token optimisation and licence advice keep AI affordable as usage grows.', 'Het juiste model voor de juiste taak. Slimme routering, tokenoptimalisatie en licentieadvies houden AI betaalbaar als het gebruik groeit.') },
  ];
  const tools = ['CRM', 'ERP', 'Microsoft 365', 'Google Workspace', 'Claude', 'ChatGPT', 'Copilot', 'Gemini', 'n8n', 'Make', 'Power Automate', tx('open-source models', 'open-source modellen')];
  return (
    <section id="ai-build" className={'ck-section hai-build' + (inV ? ' in' : '')} ref={ref}>
      <div className="container-wide">
        <CkHead eyebrow={tx('STEP 3 · BUILD', 'STAP 3 · BOUWEN')} a={tx('From idea to an agent', 'Van idee naar een agent')} b={tx('that runs every day.', 'die elke dag meedraait.')}
          lede={tx('We build AI that fits the systems and the way of working you already have. A person at the wheel where it matters, fully automatic where it can be.',
            'We bouwen AI die past in de systemen en werkwijze die je al hebt. De mens aan het stuur waar het moet, volledig automatisch waar het kan.')} />
        <div className="hai-build-grid">
          {B.map((b, i) => (
            <div key={b.k} className="hai-tile hai-r" style={{ '--i': i + 1 }}>
              <span className="hai-ico"><Icon k={b.k} /></span>
              <h3>{b.t}</h3><p>{b.d}</p>
            </div>
          ))}
          <div className="hai-tile hai-tile--wide hai-r" style={{ '--i': 7 }}>
            <span className="hai-ico"><Icon k="team" /></span>
            <div>
              <h3>{tx('The AI workplace', 'De AI-werkplek')}</h3>
              <p>{tx('We set up business AI environments such as Claude, ChatGPT or Copilot: the right licences, shared instructions and skills per role, connections to your data, an AI policy for your people, and insight into usage and costs.',
                'We richten zakelijke AI-omgevingen in zoals Claude, ChatGPT of Copilot: de juiste licenties, gedeelde instructies en vaardigheden per rol, koppelingen met je data, een AI-beleid voor je mensen en inzicht in gebruik en kosten.')}</p>
            </div>
          </div>
        </div>
        <div className="hai-tools hai-r" style={{ '--i': 8 }}>
          <span>{tx('System-independent. We work with what you already use:', 'Systeemonafhankelijk. We werken met wat je al gebruikt:')}</span>
          <div>{tools.map((t) => <em key={t}>{t}</em>)}</div>
        </div>
        <div className="hai-path hai-r" style={{ '--i': 9 }}>
          {[[tx('Pilot', 'Pilot'), tx('4–6 weeks. A working result in your own environment, measured against the baseline. Then a go/no-go.', '4–6 weken. Een werkend resultaat in je eigen omgeving, gemeten tegen de nulmeting. Daarna een go/no-go.')],
            [tx('Production', 'Productie'), tx('Scale up to all users: security, monitoring, documentation and handover.', 'Opschalen naar alle gebruikers: beveiliging, monitoring, documentatie en overdracht.')],
            [tx('Run', 'Beheer'), tx('We keep your agents sharp: monitoring, improvements and new use cases.', 'We houden je agents scherp: monitoring, verbeteringen en nieuwe use cases.')]].map(([t, d], i) => (
            <div key={t} className="hai-path-step"><span>{i + 1}</span><div><b>{t}</b><p>{d}</p></div></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  6 · Run & improve + Fractional AI-lead (made more visible, 20 Nov)   */
/* ==================================================================== */
function AiRun({ onCta }) {
  const [ref, inV] = useIn();
  const P = [
    { t: tx('Manage', 'Beheer'), h: tx('Keep it running', 'Draaiend houden'), li: [tx('Monitoring of agents and workflows', 'Monitoring van agents en workflows'), tx('Incidents and small fixes', 'Incidenten en kleine fixes'), tx('Updates when models or APIs change', 'Updates bij model- en API-wijzigingen'), tx('Monthly report', 'Maandrapportage')] },
    { t: tx('Improve', 'Verbeteren'), featured: true, h: tx('Better every month', 'Elke maand beter'), li: [tx('Everything in Manage', 'Alles uit Beheer'), tx('Monthly improvement round', 'Maandelijkse verbeterronde'), tx('Cost and model optimisation', 'Kosten- en modeloptimalisatie'), tx('Quarterly review with roadmap', 'Kwartaalreview met roadmap')] },
    { t: tx('Develop', 'Doorontwikkelen'), h: tx('New use cases', 'Nieuwe use cases'), li: [tx('Everything in Improve', 'Alles uit Verbeteren'), tx('Reserved build capacity', 'Gereserveerde bouwcapaciteit'), tx('New agents and connections', 'Nieuwe agents en koppelingen'), tx('One fixed contact', 'Vaste contactpersoon')] },
  ];
  return (
    <section id="ai-run" className={'ck-section ck-section--soft hai-run' + (inV ? ' in' : '')} ref={ref}>
      <div className="container-wide">
        <CkHead eyebrow={tx('STEP 4 · RUN & IMPROVE', 'STAP 4 · BEHEREN & VERBETEREN')} a={tx('Lasting results,', 'Blijvend resultaat,')} b={tx('month after month.', 'maand na maand.')}
          lede={tx('AI is never “done”: models change, costs move and your team finds new ideas. Pick the level of care that fits.', 'AI is nooit “af”: modellen veranderen, kosten bewegen en je team bedenkt nieuwe ideeën. Kies het niveau dat past.')} />
        <div className="hai-run-grid">
          <div className="hai-plans">
            {P.map((p, i) => (
              <div key={p.t} className={'hai-plan hai-r' + (p.featured ? ' is-featured' : '')} style={{ '--i': i + 1 }}>
                {p.featured && <span className="hai-badge">{tx('Recommended', 'Aanbevolen')}</span>}
                <span className="hai-ws-tag">{p.t}</span>
                <h3>{p.h}</h3>
                <ul>{p.li.map((l) => <li key={l}>{l}</li>)}</ul>
              </div>
            ))}
          </div>
          <div id="fractional-ai-lead" className="hai-fractional hai-r" style={{ '--i': 4 }}>
            <span className="hai-fractional-tag">{tx('Fractional AI lead', 'Fractional AI-lead')}</span>
            <h3>{tx('An AI lead at the table, without a permanent hire.', 'Een AI-lead aan tafel, zonder vaste aanstelling.')}</h3>
            <p>{tx('Not a project, but one consultant who joins you at fixed moments, for example one day a week. They guard your AI course: roadmap, AI champions, governance and the progress of your use cases.',
              'Geen project, maar één vaste consultant die op vaste momenten aanschuift, bijvoorbeeld één dag per week. Die bewaakt je AI-koers: roadmap, AI-champions, governance en de voortgang van je use cases.')}</p>
            <div className="hai-fractional-stats">
              <div><b>{tx('1 day', '1 dag')}</b><span>{tx('a week', 'per week')}</span></div>
              <div><b>{tx('3 mo', '3 mnd')}</b><span>{tx('minimum', 'minimaal')}</span></div>
              <div><b>1</b><span>{tx('fixed contact', 'vast aanspreekpunt')}</span></div>
            </div>
            <button type="button" className="btn btn-on-brown" onClick={onCta}>{tx('Discuss a fractional AI lead', 'Bespreek een Fractional AI-lead')} <Arrow /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  7 · Already on Salesforce? Bridge to the Agentforce Kickstart        */
/* ==================================================================== */
function AiSalesforceBridge({ onMode }) {
  const [ref, inV] = useIn(0.3);
  const toSalesforce = () => {
    onMode && onMode('salesforce');
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  };
  return (
    <section className={'ck-section ck-section--tight hai-bridge' + (inV ? ' in' : '')} ref={ref}>
      <div className="container-wide">
        <div className="hai-bridge-card hai-r" style={{ '--i': 1 }}>
          <div>
            <span className="eyebrow">{tx('ALREADY ON SALESFORCE?', 'WERK JE AL MET SALESFORCE?')}</span>
            <h3>{tx('You already pay for Agentforce.', 'Je betaalt al voor Agentforce.')} <span>{tx('We switch it on.', 'Wij zetten hem aan.')}</span></h3>
            <p>{tx('With the Agentforce Kickstart we build a working agent on your own Salesforce data in two weeks.', 'Met de Agentforce Kickstart bouwen we in twee weken een werkende agent op je eigen Salesforce-data.')}</p>
          </div>
          <div className="hai-bridge-actions">
            <a className="btn btn-primary" href={lp('/quickstarts/agentforce')}>{tx('The Agentforce Kickstart', 'De Agentforce Kickstart')} <Arrow /></a>
            <button type="button" className="btn btn-secondary" onClick={toSalesforce}>{tx('See Salesforce solutions', 'Bekijk Salesforce-oplossingen')}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  8 · Why Intigris (AI)                                                */
/* ==================================================================== */
function AiWhy() {
  const [ref, inV] = useIn();
  const Y = [
    { t: tx('From training to building', 'Van training tot bouwen'), d: tx('We don’t only train, we build. What your team learns, we can take live together.', 'We trainen niet alleen, we bouwen ook. Wat je team leert, kunnen we samen live zetten.') },
    { t: tx('Your processes, not theory', 'Jouw processen, geen theorie'), d: tx('We work with your tasks, your systems and your data, not with slide-deck examples.', 'We werken met jouw taken, systemen en data, niet met voorbeelden uit een presentatie.') },
    { t: tx('System-independent', 'Systeemonafhankelijk'), d: tx('CRM, ERP, Microsoft, Google, n8n or open-source models: we work with what you already have.', 'CRM, ERP, Microsoft, Google, n8n of open-source modellen: we werken met wat je al hebt.') },
    { t: tx('Tested on ourselves first', 'Eerst getest op onszelf'), d: tx('AI-ify was developed inside our own company, from meeting notes and quotes to backlog and delivery. We know what works in practice, and what doesn’t.', 'AI-ify is ontwikkeld binnen ons eigen bedrijf, van gespreksverslagen en offertes tot backlog en oplevering. We weten wat in de praktijk werkt, en wat niet.') },
    { t: tx('A whole team behind it', 'Een heel team erachter'), d: tx('Consultants, architects, developers and delivery managers, with more than 15 years of complex implementations.', 'Consultants, architecten, developers en delivery managers, met ruim 15 jaar ervaring in complexe implementaties.') },
    { t: tx('Safe, with people in charge', 'Veilig, met de mens aan het stuur'), d: tx('Agreements on data, GDPR and the AI Act are part of every project. Agents support; your people stay in control.', 'Afspraken over data, AVG en AI Act horen bij elk project. Agents ondersteunen; je mensen houden de regie.') },
  ];
  return (
    <section className={'ck-section ck-section--dark hai-why' + (inV ? ' in' : '')} ref={ref}>
      <div className="container-wide">
        <CkHead eyebrow={tx('WHY INTIGRIS', 'WAAROM INTIGRIS')} a={tx('No hype. Processes that', 'Geen hype. Processen die')} b={tx('measurably run faster.', 'aantoonbaar sneller lopen.')} />
        <div className="hai-why-grid">
          {Y.map((y, i) => (
            <div key={y.t} className="hai-why-item hai-r" style={{ '--i': i + 1 }}>
              <small>{String(i + 1).padStart(2, '0')}</small><h3>{y.t}</h3><p>{y.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  9 · FAQ as a chat with Frank (same component as the cloud pages)     */
/* ==================================================================== */
const AI_FAQ = () => [
  { label: tx('Where to start', 'Waar begin je'), q: tx('We’re new to AI. Where do we start?', 'We zijn nieuw met AI. Waar beginnen we?'), a: tx('With the AI Readiness Scan: a short check of where you stand and where AI pays off, with a written report in about two working days. Or with a Basic workshop, so your whole team starts on the same page.', 'Met de AI Readiness Scan: een korte check van waar je staat en waar AI loont, met een rapport binnen zo’n twee werkdagen. Of met een Basis-workshop, zodat je hele team vanaf dezelfde plek start.') },
  { label: tx('Systems', 'Systemen'), q: tx('Does this work with our systems?', 'Werkt dit met onze systemen?'), a: tx('Yes. AI-ify is system-independent and works for any process: CRM, ERP, email, documents and planning. We work with what you already have.', 'Ja. AI-ify is systeemonafhankelijk en werkt voor elk proces: CRM, ERP, mail, documenten en planning. We werken met wat je al hebt.') },
  { label: tx('Tools', 'Tools'), q: tx('Which AI tools and models do you use?', 'Welke AI-tools en modellen gebruiken jullie?'), a: tx('That depends on your situation, your existing licences and your requirements for data and cost. We work with Claude, ChatGPT, Copilot, Gemini, n8n and open-source models, among others.', 'Dat hangt af van je situatie, je bestaande licenties en je eisen aan data en kosten. We werken onder meer met Claude, ChatGPT, Copilot, Gemini, n8n en open-source modellen.') },
  { label: tx('Data', 'Data'), q: tx('What happens to our data?', 'Wat gebeurt er met onze data?'), a: tx('We agree on data, security and processing up front, in a data processing agreement. Where needed we choose models and hosting inside the EU.', 'We maken vooraf afspraken over data, beveiliging en verwerking, in een verwerkersovereenkomst. Waar nodig kiezen we voor modellen en hosting binnen de EU.') },
  { label: tx('Workshop or scan', 'Workshop of scan'), q: tx('Advanced workshop or AI-ify scan?', 'Advanced-workshop of AI-ify-scan?'), a: tx('The Advanced workshop is a day with your team where we find opportunities together. The AI-ify scan is a deeper analysis by our consultants, with interviews, time measurements and a business case per use case.', 'De Advanced-workshop is een dag met je team waarin we samen kansen vinden. De AI-ify-scan is een diepere analyse door onze consultants, met interviews, tijdsmetingen en een business case per use case.') },
  { label: tx('AI Act', 'AI Act'), q: tx('What does the AI literacy duty actually ask?', 'Wat vraagt de AI-geletterdheidsplicht precies?'), a: tx('Article 4 of the AI Act asks organisations to take measures that support their staff’s AI literacy. There is no required level and no required certificate. A documented training is a practical way to meet it.', 'Artikel 4 van de AI Act vraagt organisaties maatregelen te nemen om de AI-geletterdheid van medewerkers te ondersteunen. Er geldt geen verplicht niveau en geen verplicht certificaat. Een gedocumenteerde training is een praktische manier om dit in te vullen.') },
  { label: tx('No-go', 'No-go'), q: tx('What if AI doesn’t pay off for us?', 'En als AI voor ons niet loont?'), a: tx('Then we tell you. Every phase ends with a go/no-go, so you’re never locked in.', 'Dan zeggen we dat. Elke fase eindigt met een go/no-go, dus je zit nergens aan vast.') },
];

/* ==================================================================== */
/*  The AI home                                                          */
/* ==================================================================== */
function SiteAIHome({ onCta, onMode }) {
  return (
    <React.Fragment>
      <AiGap />
      <AiLadder />
      <AiWorkshops onCta={onCta} />
      <AiMethod onCta={onCta} />
      <AiBuild />
      <AiRun onCta={onCta} />
      <AiSalesforceBridge onMode={onMode} />
      <AiWhy />
      <V3FaqChat head={{ eyebrow: tx('QUESTIONS WE GET', 'VRAGEN DIE WE KRIJGEN'), a: tx('Before you', 'Voordat je'), b: tx('book the call.', 'het gesprek plant.') }} items={AI_FAQ()} onCta={onCta} />
      <TalkChatAsk onCta={onCta} ai />
      <CkStyles />
      <V3Styles />
      <TkStyles />
      <style dangerouslySetInnerHTML={{ __html: HAI_CSS }} />
    </React.Fragment>
  );
}

export { SiteAIHome, AI_FAQ };

const HAI_CSS = `
/* reveal: children with .hai-r rise in, staggered by --i */
.hai-r { opacity: 0; transform: translateY(22px); transition: opacity .7s var(--ease-out), transform .7s var(--ease-out); transition-delay: calc(var(--i, 0) * 70ms); }
.in .hai-r { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .hai-r { opacity: 1; transform: none; transition: none; } }
.hai-link { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; color: var(--intigris-dark-brown); text-decoration: none; border-bottom: 1.5px solid var(--intigris-coral); padding-bottom: 2px; }
.hai-link:hover .arrow { transform: translateX(3px); }
.hai-link .arrow { transition: transform var(--t-base) var(--ease-out); }
.hai-badge { position: absolute; top: -12px; left: 22px; background: var(--intigris-dark-brown); color: var(--intigris-off-white); font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; padding: 5px 10px; border-radius: 999px; }

/* eyebrows on the dark sections: coral, readable */
.ck-section--dark .eyebrow { color: var(--intigris-coral); }

/* 1 · gap */
.hai-gap-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(32px, 6vw, 96px); align-items: start; }
.hai-gap .ck-head { margin-bottom: 0; position: sticky; top: 120px; }
.hai-gap-list { display: flex; flex-direction: column; }
.hai-gap-item { display: grid; grid-template-columns: 56px 1fr; gap: 16px; padding: 28px 0; border-top: 1px solid rgba(252,247,235,.16); }
.hai-gap-item:last-child { border-bottom: 1px solid rgba(252,247,235,.16); }
.hai-gap-item small { color: var(--intigris-coral); font-size: 14px; font-weight: 500; padding-top: 6px; }
.hai-gap-item h3 { margin: 0 0 8px; font-size: clamp(22px, 2.2vw, 30px); font-weight: 500; letter-spacing: -.02em; color: var(--intigris-off-white); }
.hai-gap-item p { margin: 0; color: rgba(252,247,235,.78); font-size: 16.5px; line-height: 1.55; }

/* 2 · ladder */
.hai-entry { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 20px; padding: 18px 22px; margin-bottom: 28px; border: 1.5px dashed rgba(64,35,1,.28); border-radius: var(--radius-xl); color: var(--intigris-dark-brown); text-decoration: none; background: #fff; transition: border-color var(--t-base) var(--ease-out), box-shadow var(--t-base) var(--ease-out); }
.hai-entry:hover { border-color: var(--intigris-coral); box-shadow: 0 18px 40px -30px rgba(64,35,1,.5); }
.hai-entry-tag { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--intigris-coral); font-weight: 500; white-space: nowrap; }
.hai-entry-text { font-size: 15.5px; line-height: 1.5; color: var(--fg-muted); }
.hai-entry-text b { color: var(--intigris-dark-brown); font-weight: 500; }
.hai-entry-go { width: 40px; height: 40px; border-radius: 999px; background: var(--intigris-coral); color: var(--intigris-dark-brown); display: inline-flex; align-items: center; justify-content: center; font-size: 16px; transition: transform var(--t-base) var(--ease-out); }
.hai-entry:hover .hai-entry-go { transform: translateX(3px); }
.hai-ladder-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px; align-items: stretch; }
.hai-rungs { display: grid; grid-template-rows: repeat(4, 1fr); gap: 10px; }
.hai-rung { position: relative; overflow: hidden; display: grid; grid-template-columns: 34px 48px 1fr; align-items: center; gap: 14px; text-align: left; padding: 18px 22px; border-radius: 20px; border: 1px solid var(--border); background: #fff; color: var(--intigris-dark-brown); font: inherit; cursor: pointer; transition: background var(--t-base) var(--ease-out), border-color var(--t-base) var(--ease-out), transform var(--t-base) var(--ease-out); }
.hai-rung:nth-child(2) { margin-left: 4%; } .hai-rung:nth-child(3) { margin-left: 8%; } .hai-rung:nth-child(4) { margin-left: 12%; }
.hai-rung:hover { border-color: var(--intigris-coral); }
.hai-rung:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.hai-rung-n { font-size: 28px; font-weight: 500; letter-spacing: -.03em; color: rgba(64,35,1,.35); }
.hai-rung-ico { width: 48px; height: 48px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; background: var(--intigris-paper); color: var(--intigris-dark-brown); }
.hai-rung-ico svg { width: 24px; height: 24px; }
.hai-rung-t b { display: block; font-size: 22px; font-weight: 500; letter-spacing: -.02em; }
.hai-rung-t small { display: block; font-size: 14px; color: var(--fg-muted); }
.hai-rung.on { background: var(--intigris-coral); border-color: var(--intigris-coral); }
.hai-rung.on .hai-rung-n { color: var(--intigris-dark-brown); }
.hai-rung.on .hai-rung-ico { background: rgba(252,247,235,.35); }
.hai-rung.on .hai-rung-t small { color: rgba(64,35,1,.78); }
.hai-rung.past .hai-rung-n { color: var(--intigris-coral); }
.hai-rung-timer { position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; background: var(--intigris-dark-brown); transform-origin: left; animation: haiTimer 4.2s linear forwards; }
@keyframes haiTimer { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.hai-rung-panel { border-radius: var(--radius-xl); background: var(--intigris-dark-brown); color: var(--intigris-off-white); padding: clamp(28px, 3.4vw, 44px); display: flex; flex-direction: column; animation: haiPanel .5s var(--ease-out); }
@keyframes haiPanel { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.hai-rung-panel-n { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--intigris-coral); font-weight: 500; }
.hai-rung-panel h3 { margin: 14px 0 12px; font-size: clamp(40px, 4.6vw, 64px); font-weight: 500; letter-spacing: -.035em; line-height: 1; color: var(--intigris-off-white); }
.hai-rung-panel p { margin: 0 0 18px; font-size: 18px; line-height: 1.55; color: rgba(252,247,235,.85); max-width: 32em; }
.hai-rung-panel ul { list-style: none; margin: 0 0 24px; padding: 0; display: grid; gap: 8px; }
.hai-rung-panel li { position: relative; padding-left: 26px; font-size: 15.5px; color: rgba(252,247,235,.9); }
.hai-rung-panel li::before { content: '✓'; position: absolute; left: 0; color: var(--intigris-coral); font-weight: 500; }
.hai-rung-panel .hai-link { margin-top: auto; align-self: flex-start; color: var(--intigris-off-white); }

/* 3 · workshops */
.hai-ws-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: stretch; }
.hai-ws-card, .hai-plan { position: relative; display: flex; flex-direction: column; padding: 30px 26px 26px; border-radius: var(--radius-xl); background: #fff; border: 1px solid var(--border); box-shadow: 0 24px 50px -44px rgba(43,23,0,.55); }
.hai-ws-card.is-featured, .hai-plan.is-featured { background: var(--intigris-coral); border-color: var(--intigris-coral); }
.hai-ws-tag { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 500; color: var(--intigris-coral); }
.is-featured .hai-ws-tag { color: var(--intigris-dark-brown); }
.hai-ws-card h3, .hai-plan h3 { margin: 10px 0 6px; font-size: 24px; font-weight: 500; letter-spacing: -.02em; line-height: 1.15; color: var(--intigris-dark-brown); }
.hai-ws-meta { font-size: 14px; color: var(--fg-muted); padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border); }
.is-featured .hai-ws-meta { color: rgba(64,35,1,.75); border-color: rgba(64,35,1,.18); }
.hai-ws-card ul, .hai-plan ul { list-style: none; margin: 0 0 24px; padding: 0; display: grid; gap: 9px; }
.hai-ws-card li, .hai-plan li { position: relative; padding-left: 22px; font-size: 15px; line-height: 1.45; color: var(--intigris-dark-brown); }
.hai-ws-card li::before, .hai-plan li::before { content: ''; position: absolute; left: 2px; top: 8px; width: 7px; height: 7px; border-radius: 999px; background: var(--intigris-coral); }
.is-featured li::before { background: var(--intigris-dark-brown); }
.hai-ws-card .btn { margin-top: auto; align-self: flex-start; }
.hai-btn-dark { background: var(--intigris-dark-brown); color: var(--intigris-off-white); }
.hai-btn-dark:hover { background: var(--intigris-brown-700); color: var(--intigris-off-white); }
.hai-record { margin-top: 22px; display: grid; grid-template-columns: auto 1fr; gap: 6px 18px; align-items: baseline; padding: 18px 22px; border-radius: 18px; border-left: 4px solid var(--intigris-soft-blue); background: rgba(154,184,226,.16); }
.hai-record b { font-weight: 500; color: var(--intigris-dark-brown); }
.hai-record span { font-size: 14.5px; color: var(--fg-muted); line-height: 1.5; }

/* 4 · method */
.hai-phase { display: flex; align-items: center; gap: 12px; margin: 8px 0 14px; font-size: 14px; color: rgba(252,247,235,.7); }
.hai-pill { display: inline-flex; padding: 6px 12px; border-radius: 999px; background: var(--intigris-coral); color: var(--intigris-dark-brown); font-size: 13px; font-weight: 500; }
.hai-pill--light { background: var(--intigris-off-white); }
.hai-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.hai-step { padding: 22px 20px; border-radius: 20px; border: 1px solid rgba(252,247,235,.16); background: rgba(252,247,235,.04); transition: background var(--t-base) var(--ease-out), border-color var(--t-base) var(--ease-out); }
.hai-step:hover { background: rgba(255,95,54,.12); border-color: rgba(255,95,54,.5); }
.hai-step-n { font-size: 12px; letter-spacing: .12em; color: var(--intigris-coral); font-weight: 500; }
.hai-step h3 { margin: 10px 0 8px; font-size: 22px; font-weight: 500; letter-spacing: -.02em; color: var(--intigris-off-white); }
.hai-step p { margin: 0; font-size: 14.5px; line-height: 1.5; color: rgba(252,247,235,.75); }
.hai-gate { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; margin: 26px 0 18px; }
.hai-gate i { height: 1px; background: linear-gradient(90deg, transparent, var(--intigris-coral), transparent); }
.hai-gate span { font-size: 14px; font-weight: 500; color: var(--intigris-off-white); padding: 8px 16px; border: 1px solid var(--intigris-coral); border-radius: 999px; text-align: center; }
.hai-example { margin-top: clamp(36px, 5vw, 64px); display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); padding: clamp(24px, 3.4vw, 44px); border-radius: var(--radius-xl); background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
.hai-example-tag { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--intigris-coral); font-weight: 500; }
.hai-example h3 { margin: 12px 0; font-size: clamp(28px, 3vw, 40px); font-weight: 500; letter-spacing: -.03em; line-height: 1.05; }
.hai-example p { margin: 0 0 14px; font-size: 16.5px; line-height: 1.55; color: var(--fg-muted); }
.hai-example small { font-size: 13px; color: var(--fg-muted); font-style: italic; }
.hai-scores { display: flex; flex-direction: column; gap: 14px; }
.hai-score { display: grid; grid-template-columns: 1fr auto; gap: 6px; font-size: 14.5px; }
.hai-score b { font-weight: 500; }
.hai-score i { grid-column: 1 / -1; height: 6px; border-radius: 999px; background: var(--intigris-paper); position: relative; overflow: hidden; }
.hai-score i::after { content: ''; position: absolute; inset: 0; background: var(--intigris-coral); border-radius: inherit; transform-origin: left; transform: scaleX(0); transition: transform 1.1s var(--ease-out) .5s; }
.in .hai-score i::after { transform: scaleX(var(--w)); }
.hai-scores .btn { margin-top: 8px; align-self: flex-start; }

/* 5 · build */
.hai-build-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.hai-tile { padding: 26px 24px; border-radius: var(--radius-xl); border: 1px solid var(--border); background: #fff; transition: transform var(--t-base) var(--ease-out), box-shadow var(--t-base) var(--ease-out), border-color var(--t-base) var(--ease-out); }
.hai-tile:hover { transform: translateY(-3px); border-color: var(--intigris-coral); box-shadow: 0 26px 50px -40px rgba(43,23,0,.55); }
.hai-ico { width: 48px; height: 48px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; background: rgba(255,95,54,.12); color: var(--intigris-coral); }
.hai-ico svg { width: 24px; height: 24px; }
.hai-tile h3 { margin: 18px 0 8px; font-size: 21px; font-weight: 500; letter-spacing: -.02em; color: var(--intigris-dark-brown); }
.hai-tile p { margin: 0; font-size: 15px; line-height: 1.5; color: var(--fg-muted); }
.hai-tile--wide { grid-column: 1 / -1; display: grid; grid-template-columns: auto 1fr; gap: 22px; align-items: start; background: var(--intigris-paper); }
.hai-tile--wide h3 { margin-top: 4px; }
.hai-tile--wide p { max-width: 62em; }
.hai-tools { margin-top: 26px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; }
.hai-tools > span { font-size: 15px; color: var(--fg-muted); }
.hai-tools > div { display: flex; flex-wrap: wrap; gap: 8px; }
.hai-tools em { font-style: normal; font-size: 14px; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border); color: var(--intigris-dark-brown); background: #fff; }
.hai-path { margin-top: clamp(32px, 4vw, 52px); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; border-top: 2px solid var(--intigris-dark-brown); }
.hai-path-step { display: grid; grid-template-columns: auto 1fr; gap: 14px; padding: 22px 24px 0 0; }
.hai-path-step > span { width: 34px; height: 34px; border-radius: 999px; background: var(--intigris-dark-brown); color: var(--intigris-off-white); display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 500; margin-top: -40px; }
.hai-path-step b { font-size: 20px; font-weight: 500; color: var(--intigris-dark-brown); }
.hai-path-step p { margin: 6px 0 0; font-size: 15px; line-height: 1.5; color: var(--fg-muted); }

/* 6 · run + fractional */
.hai-run-grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 18px; align-items: stretch; }
.hai-plans { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.hai-plan { padding: 28px 22px 22px; }
.hai-plan ul { margin-bottom: 0; }
.hai-fractional { display: flex; flex-direction: column; padding: clamp(26px, 3vw, 36px); border-radius: var(--radius-xl); background: var(--intigris-dark-brown); color: var(--intigris-off-white); }
.hai-fractional-tag { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--intigris-coral); font-weight: 500; }
.hai-fractional h3 { margin: 12px 0 12px; font-size: clamp(24px, 2.4vw, 32px); font-weight: 500; letter-spacing: -.025em; line-height: 1.1; color: var(--intigris-off-white); }
.hai-fractional p { margin: 0 0 20px; font-size: 15.5px; line-height: 1.55; color: rgba(252,247,235,.82); }
.hai-fractional-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 22px; }
.hai-fractional-stats div { padding: 12px; border-radius: 14px; background: rgba(252,247,235,.08); border: 1px solid rgba(252,247,235,.14); }
.hai-fractional-stats b { display: block; font-size: 22px; font-weight: 500; color: var(--intigris-coral); }
.hai-fractional-stats span { font-size: 12.5px; color: rgba(252,247,235,.75); }
.hai-fractional .btn { margin-top: auto; align-self: flex-start; }

/* 7 · bridge */
.hai-bridge { padding-top: 0; background: var(--intigris-off-white-200); }
.hai-bridge-card { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px 40px; align-items: center; padding: clamp(24px, 3vw, 36px) clamp(24px, 3.4vw, 44px); border-radius: var(--radius-xl); background: #fff; border: 1px solid var(--border); }
.hai-bridge-card h3 { margin: 10px 0 8px; font-size: clamp(24px, 2.6vw, 34px); font-weight: 500; letter-spacing: -.025em; color: var(--intigris-dark-brown); }
.hai-bridge-card h3 span { color: var(--intigris-coral); }
.hai-bridge-card p { margin: 0; color: var(--fg-muted); font-size: 16px; }
.hai-bridge-actions { display: flex; flex-wrap: wrap; gap: 10px; }

/* 8 · why */
.hai-why-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; border-top: 1px solid rgba(252,247,235,.16); }
.hai-why-item { padding: 30px 28px 30px 0; border-bottom: 1px solid rgba(252,247,235,.16); }
.hai-why-item:not(:nth-child(3n+1)) { padding-left: 28px; border-left: 1px solid rgba(252,247,235,.16); }
.hai-why-item small { color: var(--intigris-coral); font-size: 14px; font-weight: 500; }
.hai-why-item h3 { margin: 10px 0 8px; font-size: 22px; font-weight: 500; letter-spacing: -.02em; color: var(--intigris-off-white); }
.hai-why-item p { margin: 0; font-size: 15px; line-height: 1.55; color: rgba(252,247,235,.75); }

/* phones and tablets */
@media (max-width: 1000px) {
  .hai-gap-grid, .hai-ladder-grid, .hai-example, .hai-run-grid { grid-template-columns: 1fr; }
  .hai-gap .ck-head { position: static; }
  .hai-rung:nth-child(n) { margin-left: 0; }
  .hai-ws-grid, .hai-plans { grid-template-columns: 1fr; gap: 22px; }
  .hai-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hai-build-grid, .hai-why-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hai-why-item:nth-child(n) { padding: 26px 20px 26px 0; border-left: 0; }
  .hai-why-item:nth-child(2n) { padding-left: 20px; border-left: 1px solid rgba(252,247,235,.16); }
  .hai-bridge-card { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .hai-entry { grid-template-columns: 1fr auto; } .hai-entry-tag { grid-column: 1 / -1; white-space: normal; }
  .hai-rung { grid-template-columns: 26px 40px 1fr; padding: 14px 16px; gap: 10px; }
  .hai-rung-ico { width: 40px; height: 40px; }
  .hai-steps, .hai-build-grid, .hai-why-grid, .hai-path { grid-template-columns: 1fr; }
  .hai-why-item:nth-child(n) { padding: 22px 0; border-left: 0; }
  .hai-tile--wide { grid-template-columns: 1fr; }
  .hai-path { border-top: 0; gap: 18px; } .hai-path-step > span { margin-top: 0; }
  .hai-record { grid-template-columns: 1fr; }
  .hai-gate { grid-template-columns: 1fr; } .hai-gate i { display: none; }
  .hai-fractional-stats { grid-template-columns: 1fr 1fr 1fr; }
}
`;
