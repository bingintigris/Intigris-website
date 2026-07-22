import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { NAV_ITEMS } from './nav';

export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const active = NAV_ITEMS.find((i) => pathname.startsWith(i.to));
  const title = active?.label || 'Admin';

  return (
    <div className="h-full flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
