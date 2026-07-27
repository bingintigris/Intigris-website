import { NavLink } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { NAV_ITEMS } from './nav';
import { useAuth } from '../../lib/auth';
import { canAccess } from '../../lib/roles';

export default function Sidebar({ collapsed, onToggle }) {
  const { role } = useAuth();
  const items = NAV_ITEMS.filter((i) => !role || canAccess(i.module, role));

  return (
    <aside
      className={`shrink-0 bg-brown text-cream flex flex-col transition-[width] duration-200 ${collapsed ? 'w-[72px]' : 'w-64'}`}
    >
      <div className={`flex ${collapsed ? 'h-16 items-center justify-center' : 'flex-col justify-center px-4 pt-7 pb-4'}`}>
        {collapsed ? (
          <div className="h-9 w-9 rounded-lg bg-coral grid place-items-center font-semibold text-white">i</div>
        ) : (
          <>
            <img src="/logo-off-white-tight.png" alt="Intigris" className="h-12 w-auto self-start" />
            <div className="text-base font-semibold text-cream mt-2">Admin Portal</div>
          </>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {items.map(({ key, label, to, icon: Icon }) => (
          <NavLink
            key={key}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-coral text-white' : 'text-cream/80 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={19} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="h-11 flex items-center gap-2 px-4 border-t border-white/10 text-cream/70 hover:text-white text-sm"
      >
        <ChevronLeft size={18} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
