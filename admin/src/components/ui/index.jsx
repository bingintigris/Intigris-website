// Lightweight, shadcn-flavoured UI primitives (no external UI dep).
export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none';
  const sizes = { sm: 'text-sm px-3.5 py-1.5', md: 'text-sm px-4 py-2.5', lg: 'text-base px-5 py-3' };
  const variants = {
    primary: 'bg-coral text-white hover:bg-coral-700',
    secondary: 'bg-white text-ink border border-line hover:bg-cream',
    ghost: 'text-ink hover:bg-cream-100',
    dark: 'bg-brown text-cream hover:bg-brown-700',
    danger: 'bg-white text-coral-700 border border-coral-100 hover:bg-coral-50',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ className = '', children, ...props }) {
  return <div className={`bg-white border border-line rounded-2xl shadow-card ${className}`} {...props}>{children}</div>;
}

export function Badge({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'bg-cream-100 text-muted',
    green: 'bg-green-50 text-[#2f4d1f]',
    yellow: 'bg-[#faedd6] text-[#7a4d0b]',
    coral: 'bg-coral-50 text-coral-700',
    blue: 'bg-[#e6eefb] text-[#1f4c86]',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium uppercase tracking-wide text-muted mb-1.5">{label}</span>}
      <input
        className={`w-full h-11 rounded-xl border border-line bg-cream-paper px-3.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-coral focus:outline-none ${className}`}
        {...props}
      />
    </label>
  );
}

export function Spinner({ className = '' }) {
  return (
    <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} aria-hidden />
  );
}

export function Select({ label, className = '', children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium uppercase tracking-wide text-muted mb-1.5">{label}</span>}
      <select
        className={`w-full h-10 rounded-xl border border-line bg-cream-paper px-3 text-sm text-ink focus:border-coral focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium uppercase tracking-wide text-muted mb-1.5">{label}</span>}
      <textarea
        className={`w-full rounded-xl border border-line bg-cream-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-coral focus:outline-none resize-y ${className}`}
        {...props}
      />
    </label>
  );
}

// Slide-over panel from the right. Renders nothing when `open` is false.
export function Drawer({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-brown/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-lg h-full bg-cream shadow-pop flex flex-col animate-[slidein_.22s_ease]">
        <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-line">
          <h2 className="text-base font-medium text-ink truncate pr-4">{title}</h2>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-cream-100 text-muted" aria-label="Close">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-line p-4 bg-cream">{footer}</div>}
      </div>
      <style>{`@keyframes slidein{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  );
}
