import { supabase, supabaseConfigured } from './supabase';

// Pipeline stages for applicants (Kanban columns) — matches the public
// Application Procedure page: Application, Intro interview, Office interview,
// Case presentation, Offer, Onboarding. Rejected is kept for declined candidates.
export const STAGES = [
  { value: 'application', label: 'Application' },
  { value: 'intro', label: 'Intro interview' },
  { value: 'office', label: 'Office interview' },
  { value: 'case', label: 'Case presentation' },
  { value: 'offer', label: 'Offer' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'rejected', label: 'Rejected' },
];

export const DEFAULT_STAGE = 'application';

const SAMPLE_APPS = [
  { id: 'a1', candidate: 'Nadia El Amrani', email: 'nadia@example.com', role_applied: 'Salesforce Consultant', status: 'application', created_at: new Date(Date.now() - 864e5 * 1).toISOString() },
  { id: 'a2', candidate: 'Pieter Vos', email: 'pieter@example.com', role_applied: 'Medior Developer', status: 'intro', created_at: new Date(Date.now() - 864e5 * 3).toISOString() },
  { id: 'a3', candidate: 'Kim Bakhuis', email: 'kim@example.com', role_applied: 'ISA Trainee', status: 'office', created_at: new Date(Date.now() - 864e5 * 5).toISOString() },
  { id: 'a4', candidate: 'Sam de Boer', email: 'sam@example.com', role_applied: 'Salesforce Consultant', status: 'case', created_at: new Date(Date.now() - 864e5 * 2).toISOString() },
  { id: 'a5', candidate: 'Lotte Smit', email: 'lotte@example.com', role_applied: 'Medior Developer', status: 'offer', created_at: new Date(Date.now() - 864e5 * 7).toISOString() },
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
    .select('id, candidate, email, phone, role_applied, status, notes, cover_note, cv_path, photo_path, salesforce_certified, languages, netherlands_resident, created_at, opening_id')
    .order('created_at', { ascending: false });
  if (error) { console.error(error.message); return { rows: [], sample: false, error: error.message }; }
  return { rows: data || [], sample: false };
}
export async function updateApplicant(id, patch) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('job_applications').update(patch).eq('id', id);
  return { error };
}

// Signed, temporary URL for a private applications-bucket file (CV/photo).
export async function signedFileUrl(path) {
  if (!supabaseConfigured || !path) return null;
  const { data } = await supabase.storage.from('applications').createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}

/* ---- Openings ---- */
export async function listOpenings() {
  if (!supabaseConfigured) return { rows: SAMPLE_OPENINGS, sample: true };
  const { data, error } = await supabase
    .from('job_openings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error.message); return { rows: [], sample: false, error: error.message }; }
  return { rows: data || [], sample: false };
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
