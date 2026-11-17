/* Shared overlay for both concepts: caption card (bottom-left) + chapter rail (right). */
import { cn, tx } from '@/lib/cn';
import type { Step } from './steps';

export function Caption({ steps, active, dark = true }: { steps: Step[]; active: number; dark?: boolean }) {
  const s = steps[active];
  return (
    <div key={s.key} className={cn('pc-in pointer-events-auto max-w-[400px] rounded-3xl p-6 backdrop-blur-md', dark ? 'bg-[#2b1700]/80 text-cream ring-1 ring-cream/15' : 'bg-white/85 text-brown-700 ring-1 ring-black/5')}>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
        <span className="text-[11px] font-semibold uppercase tracking-[.16em] opacity-80">{s.product}</span>
        <span className="ml-auto text-[12px] tabular-nums opacity-60">{String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
      </div>
      <h3 className="m-0 mb-2 text-[26px] font-medium leading-[1.1] tracking-[-.02em]" style={{ color: 'inherit' }}>{s.title}</h3>
      <p className="m-0 text-[15px] leading-[1.5] opacity-85">{s.line}</p>
      {s.href && <a href={s.href} className="mt-3 inline-block border-b-[1.5px] border-current pb-0.5 text-[14px] font-medium no-underline" style={{ color: 'inherit' }}>{s.cta} →</a>}
    </div>
  );
}

export function Rail({ steps, active, onPick, dark = true }: { steps: Step[]; active: number; onPick: (i: number) => void; dark?: boolean }) {
  return (
    <nav aria-label={tx('Chapters', 'Hoofdstukken')} className="pointer-events-auto flex flex-col gap-1.5">
      {steps.map((s, i) => (
        <button key={s.key} type="button" onClick={() => onPick(i)}
          className={cn('flex cursor-pointer items-center justify-end gap-2.5 border-0 bg-transparent p-1 text-right text-[13px] font-medium transition-all', dark ? 'text-cream' : 'text-brown-700', i === active ? 'opacity-100' : 'opacity-45 hover:opacity-80')}>
          <span className={cn('transition-all', i === active ? 'translate-x-0' : 'translate-x-1')}>{s.product}</span>
          <span className={cn('block h-[3px] rounded-full transition-all', i === active ? 'w-8' : 'w-3')} style={{ background: i <= active ? s.color : 'currentColor' }} />
        </button>
      ))}
    </nav>
  );
}

/* Scrolls the page so the pinned scene shows chapter i. */
export function scrollToStep(st: { start: number; end: number } | null, i: number, n: number) {
  if (!st) return;
  const y = st.start + (st.end - st.start) * ((i + 0.5) / n);
  window.scrollTo({ top: y, behavior: 'smooth' });
}
