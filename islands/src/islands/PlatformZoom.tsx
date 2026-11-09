/* ==================================================================== */
/*  Concept A · ZOOM INTO SALESFORCE                                      */
/*  A pinned, full-screen scene. Every scroll step zooms into a spot of    */
/*  the current screen and the next screen grows out of exactly that spot: */
/*  pipeline → customer record → service case → field service + FieldBuddy */
/*  → Agentforce → Data 360 → zoom out to Slack + ERP.                     */
/*  Desktop: GSAP pin + scrub. Phones / reduced motion: a plain list.      */
/* ==================================================================== */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger, type ScrollTriggerInstance } from '@/lib/gsap';
import { cn, tx } from '@/lib/cn';
import { STEPS } from './platform/steps';
import { Caption, Rail } from './platform/Chrome';
import { AccountScreen, AgentPhone, CaseScreen, DataProfile, FieldScreen, InvoiceScreen, PipelineScreen, Phone, SlackScreen, Pill, DEMO } from './platform/ui';

const SEG = 1.5;   /* timeline units per step (hold + zoom) */
const ZOOM = 1.0;  /* duration of one zoom */
const HOLD = 0.5;

function Laptop({ children }: { children: ReactNode }) {
  return (
    <div className="w-[min(980px,74vw)]">
      <div className="rounded-t-[22px] border-[12px] border-b-[18px] border-[#1d1d1f] bg-[#f3f3f3] p-4">{children}</div>
      <div className="mx-[-5%] h-4 rounded-b-[26px] bg-gradient-to-b from-[#d6d6db] to-[#a9a9b0]" />
    </div>
  );
}

function FieldBuddyPhone() {
  return (
    <Phone className="h-[420px] w-[210px]">
      <b className="block text-[14px]">FieldBuddy</b>
      <div className="mb-2 text-[11px] text-[#747474]">{tx('Work order', 'Werkbon')} · {DEMO.company}</div>
      {[tx('Check pressure', 'Druk controleren'), tx('Replace part WP-208', 'Onderdeel WP-208 vervangen'), tx('Test run', 'Testrun'), tx('Customer signs', 'Klant tekent af')].map((t, i) => (
        <div key={t} className="mb-1.5 flex items-center gap-2 rounded-lg bg-[#f3f3f3] p-2 text-[12px]"><span className={cn('grid h-4 w-4 place-items-center rounded text-[10px] text-white', i < 2 ? 'bg-[#2e844a]' : 'bg-[#ccc]')}>✓</span>{t}</div>
      ))}
      <div className="mt-2 rounded-xl bg-[#eef4ff] p-2 text-[12px]"><b className="text-sf">✦ Agentforce</b><br />{tx('Brief ready', 'Brief klaar')}</div>
    </Phone>
  );
}

function Finale() {
  return (
    <div className="relative flex w-[min(980px,72vw)] flex-col items-center gap-8">
      <h2 className="m-0 text-center text-[clamp(36px,4.6vw,64px)] font-medium leading-[1] tracking-[-.035em] text-cream">
        {tx('This is Salesforce.', 'Dit is Salesforce.')} <span className="italic text-coral">{tx('We build it for you.', 'Wij bouwen het voor je.')}</span>
      </h2>
      <div className="relative w-full">
        <SlackScreen className="mx-auto w-[min(760px,70vw)]" />
        <InvoiceScreen className="absolute right-[70px] bottom-[-60px] w-[290px] rotate-[3deg]" />
        <div className="absolute left-[-160px] top-10 flex flex-col gap-2">
          {['Exact', 'AFAS', 'NetSuite', 'Business Central'].map((e, i) => <span key={e} className="rounded-full bg-cream px-4 py-2 text-[13px] font-semibold text-brown-700 shadow-lg" style={{ transform: `translateX(${i % 2 ? 18 : 0}px)` }}>⇄ {e}</span>)}
        </div>
      </div>
    </div>
  );
}

const LAYERS = (): { key: string; node: ReactNode }[] => [
  { key: 'sales', node: <Laptop><PipelineScreen focus /></Laptop> },
  { key: 'customer', node: <div className="w-[min(900px,72vw)]"><AccountScreen /></div> },
  { key: 'service', node: <div className="w-[min(860px,70vw)]"><CaseScreen /></div> },
  { key: 'field', node: <div className="flex items-center gap-8"><div className="w-[min(640px,52vw)]"><FieldScreen /></div><div data-focus className="rounded-[36px] ring-4 ring-coral/0"><FieldBuddyPhone /></div></div> },
  { key: 'agent', node: <AgentPhone className="h-[min(520px,64vh)] w-[min(320px,40vw)]" /> },
  { key: 'data', node: <DataProfile /> },
  { key: 'slack', node: <Finale /> },
];

export function PlatformZoom() {
  const steps = STEPS();
  const layers = LAYERS();
  const n = layers.length;
  const root = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTriggerInstance | null>(null);
  const [active, setActive] = useState(0);
  const total = (n - 1) * SEG + HOLD + 0.6;
  /* reduced motion: always the plain list, also on desktop */
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (reduce || !root.current) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const el = root.current!;
      const stage = el.querySelector<HTMLElement>('.pz-stage')!;
      const ls = Array.from(el.querySelectorAll<HTMLElement>('.pz-layer'));
      /* measure every zoom target while all layers are at scale 1 */
      const sr = stage.getBoundingClientRect();
      const origins = ls.map((l) => {
        const f = l.querySelector<HTMLElement>('[data-focus]');
        if (!f) return '50% 50%';
        const r = f.getBoundingClientRect();
        return `${((r.left + r.width / 2 - sr.left) / sr.width) * 100}% ${((r.top + r.height / 2 - sr.top) / sr.height) * 100}%`;
      });
      gsap.set(ls.slice(1), { opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      for (let k = 0; k < n - 1; k++) {
        const t = HOLD + k * SEG;
        const last = k === n - 2;
        if (!last) {
          tl.to(ls[k], { scale: 7, opacity: 0, transformOrigin: origins[k], duration: ZOOM, ease: 'power2.in' }, t)
            .fromTo(ls[k + 1], { scale: 0.12, opacity: 0, transformOrigin: origins[k] }, { scale: 1, opacity: 1, duration: ZOOM, ease: 'power2.out' }, t + 0.05);
        } else {
          /* finale: zoom OUT of the data profile into the Slack workspace */
          tl.to(ls[k], { scale: 0.25, opacity: 0, transformOrigin: '50% 50%', duration: ZOOM, ease: 'power2.in' }, t)
            .fromTo(ls[k + 1], { scale: 1.35, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: ZOOM, ease: 'power2.out' }, t + 0.1);
        }
      }
      tl.to({}, { duration: 0.6 }, total - 0.6);
      tl.eventCallback('onUpdate', () => {
        const time = tl.time();
        let a = 0;
        for (let k = 0; k < n - 1; k++) if (time > HOLD + k * SEG + ZOOM / 2) a = k + 1;
        setActive(a);
      });
      const st = ScrollTrigger.create({ trigger: stage, start: 'top top', end: '+=' + n * 85 + '%', pin: true, scrub: 0.8, animation: tl });
      stRef.current = st;
      ScrollTrigger.refresh();
      return () => { stRef.current = null; };
    });
    return () => mm.revert();
  }, []);

  const pick = (i: number) => {
    const st = stRef.current; if (!st) return;
    const time = i === 0 ? 0.1 : HOLD + (i - 1) * SEG + ZOOM + 0.15;
    window.scrollTo({ top: st.start + (st.end - st.start) * (time / total), behavior: 'smooth' });
  };

  return (
    <section ref={root} className="pz relative bg-brown-700 text-cream">
      {/* desktop: pinned zoom stage */}
      <div className={cn('pz-stage relative hidden h-screen overflow-hidden', !reduce && 'min-[900px]:block')}>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,95,54,.18),transparent_60%)]" />
        {layers.map((L, i) => (
          <div key={L.key} className="pz-layer absolute inset-0 grid place-items-center will-change-transform" aria-hidden={i !== active}>{L.node}</div>
        ))}
        <div className="pointer-events-none absolute bottom-8 left-8 z-10"><Caption steps={steps} active={active} /></div>
        <div className="pointer-events-none absolute right-8 top-1/2 z-10 -translate-y-1/2"><Rail steps={steps} active={active} onPick={pick} /></div>
        <div className="pointer-events-none absolute left-8 top-8 z-10 text-[11px] font-semibold uppercase tracking-[.16em] text-cream/60">{tx('Scroll to zoom into Salesforce', 'Scroll en zoom in op Salesforce')} ↓</div>
      </div>
      {/* phones / reduced motion: list */}
      <div className={cn('pz-list mx-auto flex max-w-[980px] flex-col gap-10 px-5 py-16', !reduce && 'min-[900px]:hidden')}>
        {steps.map((s, i) => (
          <div key={s.key} className="flex flex-col gap-4">
            <div><Pill tone="coral">{s.product}</Pill><h3 className="m-0 mt-2 text-[24px] font-medium text-cream" style={{ color: 'inherit' }}>{s.title}</h3><p className="m-0 mt-1 text-cream/80">{s.line}</p></div>
            <div className="origin-top-left overflow-hidden">{i === 4 ? <AgentPhone className="h-[520px] w-[280px]" /> : i === 5 ? <DataProfile /> : i === 6 ? <SlackScreen /> : [<PipelineScreen key="p" />, <AccountScreen key="a" />, <CaseScreen key="c" />, <FieldScreen key="f" />][i]}</div>
          </div>
        ))}
      </div>
      <style>{`
        .pz [data-focus] { animation: pzPulse 1.6s ease-in-out infinite; }
        @keyframes pzPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,95,54,.0); } 50% { box-shadow: 0 0 0 8px rgba(255,95,54,.35); } }
        .pc-in { animation: pcIn 450ms cubic-bezier(.2,.8,.2,1) both; }
        @keyframes pcIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .ds-flow { animation: dsFlow 1.2s linear infinite; }
        @keyframes dsFlow { to { stroke-dashoffset: -22; } }
        @media (prefers-reduced-motion: reduce) { .pz [data-focus], .ds-flow, .pc-in { animation: none; } }
      `}</style>
    </section>
  );
}
