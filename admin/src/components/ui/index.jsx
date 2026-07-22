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

export function Card({ className = '', children }) {
  return <div className={`bg-white border border-line rounded-2xl shadow-card ${className}`}>{children}</div>;
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
