import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { roleLabel } from '../../lib/roles';
import { initials } from '../../lib/format';

export default function UserMenu() {
  const { user, profile, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const name = profile?.full_name || user?.email || 'Account';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-full pl-1 pr-2.5 py-1 hover:bg-cream-100 transition-colors"
      >
        {profile?.avatar_url
          ? <img src={profile.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
          : <span className="h-9 w-9 rounded-full bg-coral text-white grid place-items-center text-sm font-medium">{initials(name)}</span>}
        <span className="hidden sm:block text-left leading-tight">
          <span className="block text-sm text-ink">{name}</span>
          <span className="block text-[11px] text-muted">{roleLabel(role)}</span>
        </span>
        <ChevronDown size={16} className="text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-line rounded-xl shadow-pop p-1.5 z-50">
          <div className="px-3 py-2 border-b border-line mb-1">
            <div className="text-sm text-ink truncate">{name}</div>
            <div className="text-xs text-muted truncate">{user?.email}</div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-cream-100"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
