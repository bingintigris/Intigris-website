/* ==================================================================== */
/*  Concept B · MISSION CONTROL                                           */
/*  One big Salesforce "desktop" (a fixed 1400×900 canvas, scaled to fit).  */
/*  Scrolling plays the day of one customer, Havenwerk BV, 08:02 → 16:45:  */
/*  mail → lead · deal won + Slack · service case · technician route ·     */
/*  Agentforce at work · Data 360 links it all · invoice in Exact.         */
/*  Left: the chapters with times. Desktop: GSAP pin + scrub.              */
/* ==================================================================== */
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, type ScrollTriggerInstance } from '@/lib/gsap';
import { cn, tx } from '@/lib/cn';
import { STEPS } from './platform/steps';
import { AgentPhone, CaseScreen, EmailScreen, FieldScreen, InvoiceScreen, LeadScreen, Pill, Win, DEMO, PipelineScreen, DataProfile, SlackScreen } from './platform/ui';

const W = 1400, H = 900;
/* window slots on the canvas (px) */
const SLOT = {
  email: { x: 30, y: 70, w: 460 }, lead: { x: 30, y: 70, w: 460 },
  pipe: { x: 520, y: 70, w: 560 }, slack: { x: 1100, y: 70, w: 270 },
  case: { x: 30, y: 420, w: 450 }, field: { x: 510, y: 430, w: 560 },
  agent: { x: 1100, y: 400, w: 270 }, invoice: { x: 30, y: 705, w: 450 },
};
const center = (k: keyof typeof SLOT, hgt = 220): [number, number] => [SLOT[k].x + SLOT[k].w / 2, SLOT[k].y + hgt / 2];

function MissionPipeline() {
  const cols = [tx('Qualification', 'Kwalificatie'), tx('Proposal', 'Offerte'), tx('Negotiation', 'Onderhandeling'), tx('Closed Won', 'Gewonnen')];
  const fill = [[['Brightline Energy', '€ 22.000'], ['Bouwgroep Zuid', '€ 31.000']], [['Kade & Zonen', '€ 95.000']], [['Polder Logistiek', '€ 140.000']], [['Nova Groep', '€ 62.000']]];
  return (
    <Win title={tx('Sales · Opportunities · This quarter', 'Sales · Opportunities · Dit kwartaal')} tag="Sales Cloud">
      <div className="relative grid grid-cols-4 gap-2.5">
        {cols.map((c, i) => (
          <div key={c} className="min-h-[200px] rounded-xl bg-[#f3f3f3] p-2">
            <b className="mb-2 block text-[12px]">{c}</b>
            {i === 1 && <div className="mb-2 h-[52px]" />}
            {i === 3 && <div className="mb-2 h-[52px]" />}
            {fill[i].map(([n, v]) => <div key={n} className={cn('mb-2 rounded-lg border-l-[3px] bg-white p-2 shadow-sm', i === 3 ? 'border-[#2e844a]' : 'border-sf')}><div className="truncate font-semibold text-sf">{n}</div><div className="text-[12px] font-semibold">{v}</div></div>)}
          </div>
        ))}
        {/* the Havenwerk deal travels from Proposal to Closed Won */}
        <div className="mc-fly absolute top-[30px] w-[calc(25%-16px)] rounded-lg border-l-[3px] border-coral bg-white p-2 shadow-lg ring-2 ring-coral" style={{ left: 'calc(25% + 6px)' }}>
          <div className="truncate font-semibold text-sf">{DEMO.company}</div><div className="text-[12px] font-semibold">{DEMO.deal}</div>
        </div>
      </div>
    </Win>
  );
}

function SlackToast({ second }: { second: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#1a1d21] text-white shadow-[0_30px_60px_-25px_rgba(0,0,0,.8)] ring-1 ring-white/10">
      <div className="flex items-center gap-2 bg-[#3f0e40] px-4 py-2.5 text-[13px] font-semibold"><span className="grid h-5 w-5 place-items-center rounded bg-white/15 text-[11px]">#</span>havenwerk<span className="ml-auto text-[11px] font-medium text-white/60">Slack</span></div>
      <div className="space-y-3 p-4 text-[13px]">
        <div className="flex gap-2.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#00a1e0] font-bold">S</span><div><b>Salesforce</b> <span className="text-[11px] text-white/50">09:41</span><div>🎉 {tx('Deal won', 'Deal gewonnen')}: {DEMO.company} · {DEMO.deal}</div><div className="mt-1 flex gap-1 text-[12px]"><span className="rounded-full bg-white/10 px-2">👏 4</span><span className="rounded-full bg-white/10 px-2">🔥 2</span></div></div></div>
        <div className={cn('mc-slack2 flex gap-2.5', !second && 'opacity-0')}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sf font-bold">✦</span><div><b>Agentforce</b> <span className="text-[11px] text-white/50">16:45</span><div>{tx(`Invoice ${DEMO.invoice} sent via Exact ✓`, `Factuur ${DEMO.invoice} verstuurd via Exact ✓`)}</div></div></div>
      </div>
    </div>
  );
}

export function PlatformMission() {
  const steps = STEPS();
  const n = steps.length;
  const root = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTriggerInstance | null>(null);
  const [active, setActive] = useState(0);
  const [scale, setScale] = useState(0.7);
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* fit the 1400×900 canvas into the right-hand area */
  useEffect(() => {
    const el = area.current; if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / W, el.clientHeight / H));
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !root.current) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const el = root.current!;
      const q = (s: string) => el.querySelector<HTMLElement>(s)!;
      const pop = { opacity: 0, y: 26, scale: 0.96 };
      const shown = { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' };
      gsap.set(['.mc-email', '.mc-lead', '.mc-pipe', '.mc-slack', '.mc-case', '.mc-field', '.mc-agent', '.mc-invoice', '.mc-data', '.mc-cursor', '.mc-chip1', '.mc-chip2', '.mc-done', '.mc-slack2'].map(q), { opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      /* 0 · mail becomes a lead */
      tl.fromTo(q('.mc-email'), pop, shown, 0.05)
        .to(q('.mc-email'), { opacity: 0, scale: 0.92, y: -10, duration: 0.2 }, 0.45)
        .fromTo(q('.mc-lead'), pop, shown, 0.5)
        .fromTo(q('.mc-lead .mc-score'), { width: '0%' }, { width: '92%', duration: 0.35 }, 0.62);
      /* 1 · deal won + Slack */
      tl.fromTo(q('.mc-pipe'), pop, shown, 1.0)
        .fromTo(q('.mc-fly'), { left: 'calc(25% + 6px)' }, { left: 'calc(75% + 6px)', duration: 0.4, ease: 'power2.inOut' }, 1.35)
        .fromTo(q('.mc-slack'), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' }, 1.65);
      /* 2 · service case */
      tl.fromTo(q('.mc-case'), pop, shown, 2.0).to(q('.mc-lead'), { opacity: 0.45, duration: 0.2 }, 2.1);
      /* 3 · technician route */
      tl.fromTo(q('.mc-field'), pop, shown, 3.0)
        .fromTo(q('.mc-field .mc-route'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55 }, 3.3);
      /* 4 · Agentforce works on its own */
      tl.fromTo(q('.mc-agent'), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 4.0)
        .fromTo(q('.mc-cursor'), { opacity: 0, left: 1180, top: 600 }, { opacity: 1, left: 330, top: 600, duration: 0.3, ease: 'power2.inOut' }, 4.3)
        .fromTo(q('.mc-chip1'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.12 }, 4.6)
        .to(q('.mc-cursor'), { left: 860, top: 640, duration: 0.25, ease: 'power2.inOut' }, 4.65)
        .fromTo(q('.mc-chip2'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.12 }, 4.9)
        .to(q('.mc-cursor'), { opacity: 0, duration: 0.1 }, 4.95);
      /* 5 · Data 360 links everything */
      tl.to(q('.mc-data'), { opacity: 1, duration: 0.2 }, 5.0)
        .fromTo(el.querySelectorAll('.mc-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, stagger: 0.05 }, 5.05)
        .fromTo(q('.mc-badge'), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }, 5.1);
      /* 6 · invoice in Exact, Slack wraps up */
      tl.fromTo(q('.mc-invoice'), pop, shown, 6.0)
        .fromTo(q('.mc-slack2'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2 }, 6.3)
        .fromTo(q('.mc-done'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25 }, 6.45)
        .to({}, { duration: 0.3 }, 6.7);
      tl.eventCallback('onUpdate', () => setActive(Math.min(n - 1, Math.floor(tl.time()))));
      const st = ScrollTrigger.create({ trigger: q('.mc-stage'), start: 'top top', end: '+=' + n * 80 + '%', pin: true, scrub: 0.8, animation: tl });
      stRef.current = st;
      ScrollTrigger.refresh();
      return () => { stRef.current = null; };
    });
    return () => mm.revert();
  }, []);

  const pick = (i: number) => {
    const st = stRef.current; if (!st) return;
    window.scrollTo({ top: st.start + (st.end - st.start) * ((i + 0.85) / 7), behavior: 'smooth' });
  };
  const s = steps[active];
  const [dx, dy] = [262, 352];
  const targets: [number, number][] = [center('lead', 200), center('pipe', 260), center('case', 260), center('field', 240), center('agent', 460), center('invoice', 120), center('slack', 160)];

  return (
    <section ref={root} className="mc relative bg-[#0b1220] text-cream">
      <div className={cn('mc-stage relative hidden h-screen grid-cols-[minmax(280px,.32fr)_1fr] gap-6 overflow-hidden px-8 py-8', !reduce && 'min-[900px]:grid')}>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(1,118,211,.25),transparent_55%),radial-gradient(ellipse_at_20%_90%,rgba(255,95,54,.15),transparent_50%)]" />
        {/* left: chapters with times */}
        <div className="relative z-10 flex flex-col justify-center">
          <div className="mb-5 text-[11px] font-semibold uppercase tracking-[.16em] text-cream/55">{tx('One day at', 'Een dag bij')} {DEMO.company}</div>
          <ol className="m-0 list-none p-0">
            {steps.map((x, i) => (
              <li key={x.key}>
                <button type="button" onClick={() => pick(i)} className={cn('flex w-full cursor-pointer items-baseline gap-3 border-0 bg-transparent py-1.5 text-left transition-opacity', i === active ? 'opacity-100' : 'opacity-40 hover:opacity-75')} style={{ color: 'inherit' }}>
                  <span className="w-12 shrink-0 text-[12px] tabular-nums">{x.time}</span>
                  <span className="text-[15px] font-medium">{x.product}</span>
                </button>
                {i === active && (
                  <div className="pc-in mb-2 ml-[60px] mt-1">
                    <h3 className="m-0 mb-1.5 text-[24px] font-medium leading-[1.1] tracking-[-.02em]" style={{ color: 'inherit' }}>{s.title}</h3>
                    <p className="m-0 text-[14.5px] leading-[1.5] text-cream/80">{s.line}</p>
                    {s.href && <a href={s.href} className="mt-2 inline-block border-b-[1.5px] border-current pb-0.5 text-[14px] font-medium no-underline" style={{ color: 'inherit' }}>{s.cta} →</a>}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
        {/* right: the desktop */}
        <div ref={area} className="relative z-10 min-h-0">
          <div className="absolute left-1/2 top-1/2 origin-center" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
            <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-[#e9edf3]/[.06] ring-1 ring-white/10">
              <div className="flex h-11 items-center gap-3 border-b border-white/10 bg-white/[.04] px-5 text-[13px] text-cream/80">
                <span className="font-semibold text-cream">Salesforce</span><span className="text-cream/50">· {tx('Intigris demo org', 'Intigris demo-org')}</span>
                <span className="ml-auto rounded-full bg-white/10 px-3 py-1 font-semibold tabular-nums text-cream">{s.time}</span>
              </div>
            </div>
            <svg className="mc-data pointer-events-none absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
              {targets.map(([x, y], i) => <line key={i} className="mc-line" x1={dx} y1={dy} x2={x} y2={y} stroke="#9ab8e2" strokeWidth="3" strokeDasharray="1" strokeDashoffset="1" pathLength={1} opacity=".85" />)}
            </svg>
            <div className="mc-email absolute" style={{ left: SLOT.email.x, top: SLOT.email.y, width: SLOT.email.w }}><EmailScreen /></div>
            <div className="mc-lead absolute" style={{ left: SLOT.lead.x, top: SLOT.lead.y, width: SLOT.lead.w }}><LeadScreen /></div>
            <div className="mc-pipe absolute" style={{ left: SLOT.pipe.x, top: SLOT.pipe.y, width: SLOT.pipe.w }}><MissionPipeline /></div>
            <div className="mc-case absolute" style={{ left: SLOT.case.x, top: SLOT.case.y, width: SLOT.case.w }}><CaseScreen /><span className="mc-chip1 absolute -right-3 -top-3"><Pill tone="green">✦ {tx('Reply drafted', 'Antwoord opgesteld')}</Pill></span></div>
            <div className="mc-field absolute" style={{ left: SLOT.field.x, top: SLOT.field.y, width: SLOT.field.w }}><FieldScreen /><span className="mc-chip2 absolute -right-3 -top-3"><Pill tone="green">✦ {tx('Visit planned', 'Bezoek ingepland')}</Pill></span></div>
            <div className="mc-agent absolute" style={{ left: SLOT.agent.x, top: SLOT.agent.y, width: SLOT.agent.w }}><AgentPhone className="h-[400px] w-full" /></div>
            <div className="mc-slack absolute z-20" style={{ left: SLOT.slack.x, top: SLOT.slack.y, width: SLOT.slack.w }}><SlackToast second /></div>
            <div className="mc-invoice absolute z-20" style={{ left: SLOT.invoice.x, top: SLOT.invoice.y, width: SLOT.invoice.w }}><InvoiceScreen /></div>
            <div className="mc-badge absolute z-30 grid h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sky-soft text-center text-brown-700 opacity-0 shadow-[0_0_90px_rgba(154,184,226,.7)]" style={{ left: dx, top: dy }}>
              <div><div className="text-[11px] font-semibold uppercase tracking-[.14em] opacity-70">Data 360</div><b className="block text-[17px] leading-tight">{DEMO.company}</b><span className="text-[12px]">{tx('One profile', 'Eén profiel')}</span></div>
            </div>
            <span className="mc-cursor absolute z-40 h-6 w-6 rounded-full bg-coral shadow-[0_0_0_8px_rgba(255,95,54,.3)]" />
            <div className="mc-done absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-coral px-6 py-3 text-[16px] font-semibold text-brown-700 shadow-xl">✓ {tx('From email to invoice, in one platform', 'Van mail tot factuur, in één platform')}</div>
          </div>
        </div>
      </div>
      {/* phones / reduced motion */}
      <div className={cn('mx-auto flex max-w-[980px] flex-col gap-10 px-5 py-16', !reduce && 'min-[900px]:hidden')}>
        {steps.map((x, i) => (
          <div key={x.key} className="flex flex-col gap-4">
            <div><span className="text-[12px] tabular-nums text-cream/60">{x.time}</span> <Pill tone="coral">{x.product}</Pill><h3 className="m-0 mt-2 text-[24px] font-medium" style={{ color: 'inherit' }}>{x.title}</h3><p className="m-0 mt-1 text-cream/80">{x.line}</p></div>
            {[<LeadScreen key="l" />, <PipelineScreen key="p" won />, <CaseScreen key="c" />, <FieldScreen key="f" />, <AgentPhone key="a" className="h-[520px] w-[280px]" />, <DataProfile key="d" />, <div key="s" className="space-y-3"><SlackScreen /><InvoiceScreen /></div>][i]}
          </div>
        ))}
      </div>
      <style>{`
        .pc-in { animation: pcIn 450ms cubic-bezier(.2,.8,.2,1) both; }
        @keyframes pcIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .ds-flow { animation: dsFlow 1.2s linear infinite; }
        @keyframes dsFlow { to { stroke-dashoffset: -22; } }
        @media (prefers-reduced-motion: reduce) { .pc-in, .ds-flow { animation: none; } }
      `}</style>
    </section>
  );
}

