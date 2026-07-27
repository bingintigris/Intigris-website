import { supabase, supabaseConfigured } from './supabase';

// Pipeline stages for applicants (Kanban columns).
export const STAGES = [
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'interview', label: 'Interview' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

const SAMPLE_APPS = [
  { id: 'a1', candidate: 'Nadia El Amrani', email: 'nadia@example.com', role_applied: 'Salesforce Consultant', status: 'new', created_at: new Date(Date.now() - 864e5 * 1).toISOString() },
  { id: 'a2', candidate: 'Pieter Vos', email: 'pieter@example.com', role_applied: 'Medior Developer', status: 'reviewed', created_at: new Date(Date.now() - 864e5 * 3).toISOString() },
  { id: 'a3', candidate: 'Kim Bakhuis', email: 'kim@example.com', role_applied: 'ISA Trainee', status: 'interview', created_at: new Date(Date.now() - 864e5 * 5).toISOString() },
  { id: 'a4', candidate: 'Sam de Boer', email: 'sam@example.com', role_applied: 'Salesforce Consultant', status: 'new', created_at: new Date(Date.now() - 864e5 * 2).toISOString() },
];

const SAMPLE_OPENINGS = [
  { id: 'o1', title: 'Salesforce Consultant', slug: 'salesforce-consultant', department: 'Consulting', location: 'Amsterdam / Hybrid', employment_type: 'Full-time', status: 'open', description: '## About the role\n\nWork with clients to configure and optimise Salesforce.' },
  { id: 'o2', title: 'Medior Developer', slug: 'medior-developer', department: 'Development', location: 'Amsterdam / Hybrid', employment_type: 'Full-time', status: 'open', description: '## About the role\n\nBuild integrations and custom solutions (Apex, LWC).' },
];

/* ---- Applicants ---- */
export async function listApplicants() {
  if (!supabaseConfigured) return { rows: SAMPLE_APPS, sample: true };
  const { data, error } = await supabase
    .from('job_applications')
    .select('id, candidate, email, role_applied, status, notes, created_at, opening_id')
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return { rows: SAMPLE_APPS, sample: true };
  return { rows: data, sample: false };
}
export async function updateApplicant(id, patch) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('job_applications').update(patch).eq('id', id);
  return { error };
}

/* ---- Openings ---- */
export async function listOpenings() {
  if (!supabaseConfigured) return { rows: SAMPLE_OPENINGS, sample: true };
  const { data, error } = await supabase
    .from('job_openings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return { rows: SAMPLE_OPENINGS, sample: true };
  return { rows: data, sample: false };
}
export async function createOpening(patch) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('job_openings').insert(patch);
  return { error };
}
export async function updateOpening(id, patch) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('job_openings').update(patch).eq('id', id);
  return { error };
}
export async function deleteOpening(id) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('job_openings').delete().eq('id', id);
  return { error };
}
