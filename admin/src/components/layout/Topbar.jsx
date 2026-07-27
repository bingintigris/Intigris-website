import { Search, Bell } from 'lucide-react';
import UserMenu from './UserMenu';

export default function Topbar({ title }) {
  return (
    <header className="h-16 shrink-0 bg-cream border-b border-line flex items-center gap-4 px-5">
      <h1 className="text-lg font-medium text-coral">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-white border border-line rounded-full px-3.5 h-10 w-64">
          <Search size={16} className="text-muted" />
          <input
            placeholder="Search…"
            className="bg-transparent text-sm outline-none flex-1 text-ink placeholder:text-muted/60"
          />
        </div>
        <button className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-cream-100" aria-label="Notifications">
          <Bell size={18} className="text-ink" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-coral" />
        </button>
        <div className="w-px h-8 bg-line mx-1" />
        <UserMenu />
      </div>
    </header>
  );
}
