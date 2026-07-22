import {
  LayoutDashboard, Inbox, Mail, FileText, Users, Settings,
} from 'lucide-react';

// Primary navigation. `module` maps to roles.js MODULE_ACCESS for RBAC.
export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
  { key: 'inquiries', label: 'Inquiries', to: '/inquiries', icon: Inbox, module: 'inquiries' },
  { key: 'newsletter', label: 'Newsletter', to: '/newsletter', icon: Mail, module: 'newsletter' },
  { key: 'blog', label: 'Blog', to: '/blog', icon: FileText, module: 'blog' },
  { key: 'hr', label: 'HR & Team', to: '/hr', icon: Users, module: 'hr' },
  { key: 'settings', label: 'Settings', to: '/settings', icon: Settings, module: 'settings' },
];
