/* Mock Salesforce screens shared by the platform concepts (Zoom + Mission Control).
   One fictional demo customer runs through every product: Havenwerk BV (installation
   company). Lightning-style look (white cards, Salesforce blue), no Salesforce logos. */
import type { ReactNode } from 'react';
import { cn, tx } from '@/lib/cn';

export const DEMO = {
  company: 'Havenwerk BV',
  contact: 'Noor Jansen',
  deal: '€ 48.000',
  caseNo: '#4410',
  tech: 'Mark de Vries',
  invoice: 'F-2041',
};

export function Win({ title, tag, color = 'bg-sf', className, children, dark }: { title: string; tag?: string; color?: string; className?: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgba(0,0,0,.6)] ring-1 ring-black/10', dark ? 'bg-[#1a1d21] text-white' : 'bg-white text-[#181818]', className)}>
      <div className={cn('flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white', color)}>
        <span className="flex gap-1"><i className="h-2 w-2 rounded-full bg-white/50" /><i className="h-2 w-2 rounded-full bg-white/30" /><i className="h-2 w-2 rounded-full bg-white/20" /></span>
        <span className="ml-1 truncate">{title}</span>
        {tag && <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium">{tag}</span>}
      </div>
      <div className="p-4 text-[13px]">{children}</div>
    </div>
  );
}

export function Pill({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'coral' | 'green' | 'grey' }) {
  const t = { blue: 'bg-[#eef4ff] text-sf', coral: 'bg-coral-100 text-coral-700', green: 'bg-[#e3f5e6] text-[#2e844a]', grey: 'bg-[#f3f3f3] text-[#555]' }[tone];
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold', t)}>{children}</span>;
}

export function Field({ k, v }: { k: string; v: ReactNode }) {
  return <div className="flex flex-col gap-0.5"><span className="text-[11px] text-[#747474]">{k}</span><span className="font-medium">{v}</span></div>;
}

/* ---- Sales: pipeline kanban ---- */
export function PipelineScreen({ won = false, focus = false }: { won?: boolean; focus?: boolean }) {
  const cols = [
    { n: tx('Qualification', 'Kwalificatie'), v: '€ 70k', cards: [['Brightline Energy', '€ 22.000'], ['Bouwgroep Zuid', '€ 31.000']] },
    { n: tx('Proposal', 'Offerte'), v: '€ 144k', cards: won ? [['Kade & Zonen', '€ 95.000']] : [[DEMO.company, DEMO.deal], ['Kade & Zonen', '€ 95.000']] },
    { n: tx('Negotiation', 'Onderhandeling'), v: '€ 140k', cards: [['Polder Logistiek', '€ 140.000']] },
    { n: tx('Closed Won', 'Gewonnen'), v: won ? '€ 110k' : '€ 62k', cards: won ? [[DEMO.company, DEMO.deal], ['Nova Groep', '€ 62.000']] : [['Nova Groep', '€ 62.000']] },
  ];
  return (
    <Win title={tx('Sales · Opportunities · This quarter', 'Sales · Opportunities · Dit kwartaal')} tag="Sales Cloud">
      <div className="grid grid-cols-4 gap-2.5">
        {cols.map((c, i) => (
          <div key={i} className="rounded-xl bg-[#f3f3f3] p-2">
            <div className="mb-2 flex items-baseline justify-between"><b className="text-[12px]">{c.n}</b><span className="text-[11px] text-[#747474]">{c.v}</span></div>
            {c.cards.map(([n, v]) => (
              <div key={n} data-focus={n === DEMO.company && focus ? '' : undefined}
                className={cn('mb-2 rounded-lg border-l-[3px] bg-white p-2 shadow-sm', i === 3 ? 'border-[#2e844a]' : 'border-sf', n === DEMO.company && 'ring-2 ring-coral')}>
                <div className="truncate font-semibold text-sf">{n}</div><div className="text-[12px] font-semibold">{v}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Win>
  );
}

/* ---- Customer record (Sales → the whole customer) ---- */
export function AccountScreen() {
  return (
    <Win title={`Account · ${DEMO.company}`} tag="Customer 360">
      <div className="grid grid-cols-4 gap-3 border-b border-[#eee] pb-3">
        <Field k={tx('Type', 'Type')} v={tx('Customer', 'Klant')} /><Field k={tx('Industry', 'Branche')} v={tx('Installation', 'Installatie')} />
        <Field k={tx('Owner', 'Eigenaar')} v="Lisa Vermeer" /><Field k={tx('Open deals', 'Open deals')} v={`1 · ${DEMO.deal}`} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><b className="text-[12px]">{tx('Activity', 'Activiteit')}</b>
          {[tx('Call · quote discussed', 'Gesprek · offerte besproken'), tx('Email · quote Q-2041 sent', 'Mail · offerte Q-2041 verstuurd'), tx('Meeting · site visit', 'Afspraak · locatiebezoek')].map(a => <div key={a} className="mt-2 flex gap-2"><i className="mt-1 h-2 w-2 rounded-full bg-sf" /><span>{a}</span></div>)}
        </div>
        <div><b className="text-[12px]">{tx('Related', 'Gerelateerd')}</b>
          <div className="mt-2 rounded-lg bg-[#f3f3f3] p-2">{tx('Contact', 'Contact')}: <span className="text-sf">{DEMO.contact}</span></div>
          <div data-focus className="mt-2 rounded-lg bg-coral-100 p-2 ring-2 ring-coral"><b>Case {DEMO.caseNo}</b> · {tx('Heat pump fault', 'Storing warmtepomp')} <Pill tone="coral">{tx('High', 'Hoog')}</Pill></div>
        </div>
      </div>
    </Win>
  );
}

/* ---- Service: case console ---- */
export function CaseScreen() {
  return (
    <Win title={`Service · Case ${DEMO.caseNo}`} tag="Service Cloud" color="bg-[#7f3ff5]">
      <div className="mb-3 flex items-center justify-between"><b className="text-[16px]">{tx('Heat pump fault', 'Storing warmtepomp')} · {DEMO.company}</b><Pill tone="coral">SLA 3:42</Pill></div>
      <div className="mb-3 flex gap-1">{[tx('New', 'Nieuw'), tx('Triage', 'Triage'), tx('Engineer', 'Monteur'), tx('Solved', 'Opgelost')].map((s, i) => <span key={s} className={cn('flex-1 rounded-md py-1.5 text-center text-[11px] font-semibold', i < 2 ? 'bg-[#2e844a] text-white' : i === 2 ? 'bg-sf text-white' : 'bg-[#f3f3f3] text-[#555]')}>{s}</span>)}</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Field k={tx('Contact', 'Contact')} v={DEMO.contact} /><Field k={tx('Channel', 'Kanaal')} v={tx('Phone, 2×', 'Telefoon, 2×')} /><Field k={tx('Asset', 'Installatie')} v="WP-208 · 2022" /></div>
        <div data-focus className="relative overflow-hidden rounded-xl bg-[#e9f0e1] ring-2 ring-coral">
          <MiniMap /><span className="absolute bottom-2 left-2 rounded-md bg-white px-2 py-1 text-[11px] font-semibold">Asterweg 71, Amsterdam</span>
        </div>
      </div>
    </Win>
  );
}

export function MiniMap({ route = false }: { route?: boolean }) {
  return (
    <svg viewBox="0 0 300 180" className="block h-full w-full">
      <rect width="300" height="180" fill="#e9f0e1" />
      {[30, 75, 120, 165].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y + 14} stroke="#fff" strokeWidth="6" />)}
      {[40, 110, 190, 260].map(x => <line key={x} x1={x} y1="0" x2={x - 18} y2="180" stroke="#fff" strokeWidth="6" />)}
      <path d="M0 140 C 80 120, 120 150, 300 90" stroke="#9ab8e2" strokeWidth="14" fill="none" opacity=".7" />
      {route && <path className="mc-route" d="M40 150 L 92 128 L 150 120 L 206 84 L 238 62" stroke="#ff5f36" strokeWidth="5" fill="none" strokeLinecap="round" pathLength={1} />}
      <circle cx="238" cy="62" r="9" fill="#ff5f36" stroke="#fff" strokeWidth="3" />
      <circle cx="40" cy="150" r="7" fill="#0176d3" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

/* ---- Field Service: dispatcher map + technician phone (FieldBuddy) ---- */
export function FieldScreen({ route = true }: { route?: boolean }) {
  return (
    <Win title={tx('Field Service · Dispatcher console', 'Field Service · Planbord')} tag="Field Service" color="bg-[#2e844a]">
      <div className="grid grid-cols-[1.5fr_1fr] gap-3">
        <div className="overflow-hidden rounded-xl"><MiniMap route={route} /></div>
        <div className="space-y-2">
          {[[DEMO.tech, '09:30', true], ['Sem Bakker', '10:15', false], ['Iris de Groot', '11:00', false]].map(([n, t, on]) => (
            <div key={n as string} className={cn('flex items-center gap-2 rounded-lg p-2', on ? 'bg-coral-100 ring-2 ring-coral' : 'bg-[#f3f3f3]')}>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brown-700 text-[11px] font-bold text-cream">{(n as string).split(' ').map(x => x[0]).join('').slice(0, 2)}</span>
              <div className="leading-tight"><b className="text-[12px]">{n}</b><div className="text-[11px] text-[#747474]">{t} · {on ? DEMO.company : tx('Maintenance', 'Onderhoud')}</div></div>
            </div>
          ))}
          <Pill tone="green">{tx('Part WP-208 in van', 'Onderdeel WP-208 in bus')}</Pill>
        </div>
      </div>
    </Win>
  );
}

export function Phone({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-[34px] bg-[#111] p-2.5 shadow-[0_40px_70px_-30px_rgba(0,0,0,.8)]', className)}>
      <div className="relative h-full overflow-hidden rounded-[26px] bg-white text-[#181818]">
        <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-[#111]" />
        <div className="p-4 text-[13px]">{children}</div>
      </div>
    </div>
  );
}

/* ---- Agentforce on the technician's phone ---- */
export function AgentPhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="mb-3 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-sf text-[14px] text-white">✦</span><div><b>Agentforce</b><div className="text-[11px] text-[#747474]">{tx('Pre-work brief', 'Pre-work brief')}</div></div></div>
      <div className="mb-2 rounded-2xl rounded-tl-sm bg-[#eef4ff] p-3">{tx('The customer called twice about this fault. Part WP-208 is in your van.', 'Klant belde 2× over deze storing. Onderdeel WP-208 ligt in je bus.')}</div>
      <div className="mb-2 ml-8 rounded-2xl rounded-tr-sm bg-coral p-3 font-medium text-brown-700">{tx('Great, any risks?', 'Top, nog aandachtspunten?')}</div>
      <div data-focus className="mb-2 rounded-2xl rounded-tl-sm bg-[#eef4ff] p-3 ring-2 ring-coral">{tx('Warranty runs until 2027: no charge for the part. Work order prepared ✓', 'Garantie loopt tot 2027: onderdeel kosteloos. Werkbon klaargezet ✓')}</div>
      <div className="flex gap-1.5"><Pill>{tx('Open work order', 'Werkbon openen')}</Pill><Pill tone="grey">{tx('Call customer', 'Klant bellen')}</Pill></div>
    </Phone>
  );
}

/* ---- Data 360: one profile from all sources ---- */
export function DataProfile({ className }: { className?: string }) {
  const src = [['Sales Cloud', '#0176d3'], ['Service Cloud', '#7f3ff5'], ['Field Service', '#2e844a'], ['Exact', '#e4252b'], ['Website', '#9ab8e2'], ['AFAS', '#00539f']];
  return (
    <div className={cn('relative grid aspect-square w-[min(560px,80vw)] place-items-center', className)}>
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        {src.map(([, c], i) => { const a = (i / src.length) * Math.PI * 2 - Math.PI / 2; const x = 200 + 165 * Math.cos(a), y = 200 + 165 * Math.sin(a);
          return <g key={i}><line x1={x} y1={y} x2="200" y2="200" stroke={c} strokeWidth="2.5" strokeDasharray="4 7" className="ds-flow" opacity=".8" /></g>; })}
      </svg>
      {src.map(([n, c], i) => { const a = (i / src.length) * Math.PI * 2 - Math.PI / 2;
        return <span key={n} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold shadow-lg" style={{ left: `${50 + 41 * Math.cos(a)}%`, top: `${50 + 41 * Math.sin(a)}%`, color: c }}>{n}</span>; })}
      <div data-focus className="relative grid h-[44%] w-[44%] place-items-center rounded-full bg-sky-soft text-center text-brown-700 shadow-[0_0_80px_rgba(154,184,226,.6)]">
        <div><div className="text-[11px] font-semibold uppercase tracking-[.14em] opacity-70">Data 360</div><b className="block text-[18px] leading-tight">{DEMO.company}</b><span className="text-[12px]">{tx('One profile · 6 sources', 'Eén profiel · 6 bronnen')}</span></div>
      </div>
    </div>
  );
}

/* ---- Slack ---- */
export function SlackScreen({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl bg-[#1a1d21] text-white shadow-[0_30px_60px_-25px_rgba(0,0,0,.7)] ring-1 ring-white/10', className)}>
      <div className="flex">
        <div className="w-[170px] shrink-0 bg-[#3f0e40] p-3 text-[13px]">
          <b className="mb-3 block text-[14px]">Intigris demo</b>
          {['# deals', '# havenwerk', '# service', '# planning'].map((c, i) => <div key={c} className={cn('rounded-md px-2 py-1', i === 1 ? 'bg-[#1164a3] font-semibold' : 'text-white/70')}>{c}</div>)}
          <div className="mt-3 text-white/70">✦ Agentforce</div>
        </div>
        <div className="flex-1 p-4 text-[13px]">
          <b className="mb-3 block"># havenwerk</b>
          {children || (<>
            <SlackMsg who="Salesforce" t="09:41">🎉 {tx('Deal won', 'Deal gewonnen')}: {DEMO.company} · {DEMO.deal}</SlackMsg>
            <SlackMsg who="Agentforce" t="13:05">{tx(`Visit planned with ${DEMO.tech}, part reserved.`, `Bezoek ingepland met ${DEMO.tech}, onderdeel gereserveerd.`)}</SlackMsg>
            <SlackMsg who="Lisa Vermeer" t="16:40">{tx('Invoice is out, nice work team 👏', 'Factuur is de deur uit, top gedaan team 👏')}</SlackMsg>
          </>)}
        </div>
      </div>
    </div>
  );
}

export function SlackMsg({ who, t, children }: { who: string; t: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex gap-2.5">
      <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[12px] font-bold', who === 'Agentforce' ? 'bg-sf' : who === 'Salesforce' ? 'bg-[#00a1e0]' : 'bg-coral text-brown-700')}>{who === 'Agentforce' ? '✦' : who[0]}</span>
      <div><b className="text-[13px]">{who}</b> <span className="text-[11px] text-white/50">{t}</span><div className="text-white/90">{children}</div></div>
    </div>
  );
}

/* ---- ERP invoice ---- */
export function InvoiceScreen({ className }: { className?: string }) {
  return (
    <Win title={`Exact · ${tx('Sales invoice', 'Verkoopfactuur')} ${DEMO.invoice}`} color="bg-[#e4252b]" className={className}>
      <div className="mb-2 flex justify-between"><span>{DEMO.company}</span><Pill tone="green">{tx('Sent ✓', 'Verzonden ✓')}</Pill></div>
      <div className="flex justify-between border-t border-[#eee] pt-2"><span>{tx('Heat pumps + installation', 'Warmtepompen + installatie')}</span><b>{DEMO.deal}</b></div>
      <div className="mt-2 text-[11px] text-[#747474]">{tx('Synced from Salesforce · no retyping', 'Gesynchroniseerd vanuit Salesforce · niet overgetypt')}</div>
    </Win>
  );
}

/* ---- Email ---- */
export function EmailScreen({ className }: { className?: string }) {
  return (
    <Win title="Outlook · Inbox" color="bg-[#0f6cbd]" className={className}>
      <div className="mb-1 flex items-center justify-between"><b>{DEMO.contact} · {DEMO.company}</b><span className="text-[11px] text-[#747474]">08:02</span></div>
      <div className="font-semibold">{tx('Quote request: 12 heat pumps', 'Offerteaanvraag: 12 warmtepompen')}</div>
      <div className="mt-1 text-[#555]">{tx('Hi, we want to replace the heating in our new office. Can you send a quote?', 'Hoi, we willen de verwarming in ons nieuwe kantoor vervangen. Kunnen jullie een offerte sturen?')}</div>
    </Win>
  );
}

/* ---- Lead ---- */
export function LeadScreen({ className }: { className?: string }) {
  return (
    <Win title={tx('Sales · New lead', 'Sales · Nieuwe lead')} tag="Sales Cloud" className={className}>
      <div className="mb-2 flex items-center justify-between"><b className="text-[15px]">{DEMO.contact}</b><Pill tone="coral">Hot</Pill></div>
      <div className="mb-3 grid grid-cols-3 gap-2"><Field k={tx('Company', 'Bedrijf')} v={DEMO.company} /><Field k={tx('Source', 'Bron')} v="E-mail" /><Field k={tx('Interest', 'Interesse')} v={tx('12 heat pumps', '12 warmtepompen')} /></div>
      <div className="text-[11px] text-[#747474]">{tx('Lead score', 'Leadscore')}</div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#eee]"><div className="mc-score h-full rounded-full bg-sf" style={{ width: '92%' }} /></div>
    </Win>
  );
}
