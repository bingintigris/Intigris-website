import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import { cn, tx } from '@/lib/cn';

/* Pipeline check: Tailwind (scoped), the `motion` library and TypeScript, in an
   Aceternity-style spotlight card with an animated beam. Not used on the site yet. */
const PRODUCTS = ['Sales Cloud', 'Service Cloud', 'Field Service', 'Agentforce', 'Data 360', 'Slack'];

export function Demo({ title }: { title?: string }) {
  const mx = useMotionValue(-200), my = useMotionValue(-200);
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const spot = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(255,95,54,.22), transparent 70%)`;
  return (
    <section className="relative overflow-hidden bg-brown-700 px-6 py-24 text-cream">
      <div className="mx-auto max-w-[1240px]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-cream/60">{tx('ISLANDS · PIPELINE TEST', 'ISLANDS · PIPELINE-TEST')}</p>
        <h2 className="m-0 mb-10 text-5xl font-medium leading-none tracking-tight text-cream">
          {title || tx('Tailwind, TypeScript and motion work.', 'Tailwind, TypeScript en motion werken.')}
        </h2>
        <div
          ref={ref}
          onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
          onMouseLeave={() => { mx.set(-200); my.set(-200); }}
          className="group relative grid grid-cols-2 gap-3 rounded-3xl border border-cream/10 bg-white/[.03] p-3 md:grid-cols-3"
        >
          <motion.div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ background: spot }} />
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onHoverStart={() => setHover(i)}
              onHoverEnd={() => setHover(null)}
              className={cn(
                'relative overflow-hidden rounded-2xl border border-cream/10 bg-brown px-5 py-8 transition-colors',
                hover === i && 'border-coral/70',
              )}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <motion.span
                aria-hidden
                className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cream/10 to-transparent"
                animate={{ x: ['0%', '400%'] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
              />
              <b className="relative text-xl font-semibold tracking-tight">{p}</b>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
