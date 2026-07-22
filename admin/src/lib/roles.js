// Role-based access control definitions.
// Roles live on the `profiles.role` column in Supabase and are enforced
// server-side by row-level security. This file mirrors them for the UI
// (which nav items to show, which routes to allow).

export const ROLES = {
  admin: 'Admin',
  hr_manager: 'HR Manager',
  content_editor: 'Content Editor',
  support_lead: 'Support Lead',
};

// Which roles may see each module. `admin` implicitly sees everything.
export const MODULE_ACCESS = {
  dashboard: ['admin', 'hr_manager', 'content_editor', 'support_lead'],
  inquiries: ['admin', 'support_lead'],
  newsletter: ['admin', 'content_editor'],
  blog: ['admin', 'content_editor'],
  hr: ['admin', 'hr_manager'],
  settings: ['admin'],
};

export function canAccess(moduleKey, role) {
  if (role === 'admin') return true;
  const allowed = MODULE_ACCESS[moduleKey];
  return Array.isArray(allowed) && allowed.includes(role);
}

export function roleLabel(role) {
  return ROLES[role] || 'Member';
}
