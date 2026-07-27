import {
  LayoutDashboard, Inbox, Mail, FileText, Briefcase, Users, Settings,
} from 'lucide-react';

// Primary navigation. `module` maps to roles.js MODULE_ACCESS for RBAC.
export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
  { key: 'inquiries', label: 'Inquiries', to: '/inquiries', icon: Inbox, module: 'inquiries' },
  { key: 'newsletter', label: 'Newsletter', to: '/newsletter', icon: Mail, module: 'newsletter' },
  { key: 'blog', label: 'Blog', to: '/blog', icon: FileText, module: 'blog' },
  { key: 'recruitment', label: 'Recruitment', to: '/recruitment', icon: Briefcase, module: 'recruitment' },
  { key: 'team', label: 'Team', to: '/team', icon: Users, module: 'team' },
  { key: 'settings', label: 'Settings', to: '/settings', icon: Settings, module: 'settings' },
];
