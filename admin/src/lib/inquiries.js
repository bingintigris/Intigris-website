import { supabase, supabaseConfigured } from './supabase';

export const STATUSES = [
  { value: 'new', label: 'New', tone: 'coral' },
  { value: 'in_progress', label: 'In progress', tone: 'yellow' },
  { value: 'resolved', label: 'Resolved', tone: 'green' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function statusMeta(v) { return STATUSES.find((s) => s.value === v) || STATUSES[0]; }

// Sample inquiries so the inbox is demoable before real data exists.
// (These have string ids; real rows are uuids. Mutations on samples are
// kept in memory only and the UI flags that Supabase isn't storing them.)
const SAMPLE = [
  { id: 'x1', name: 'Jeroen Prins', email: 'jeroen@opcharge.nl', company: 'Opcharge', subject: 'Field Service rollout', message: "We'd like to talk about rolling out Salesforce Field Service across our engineers. Can we book a call?", status: 'new', priority: 'high', assigned_to: null, source_page: '/contact', created_at: new Date(Date.now() - 864e5 * 2).toISOString() },
  { id: 'x2', name: 'Sanne de Wit', email: 'sanne@feenstra.nl', company: 'Feenstra', subject: 'Quote for integration', message: 'Looking to integrate our ERP with Salesforce. What would a scoping trajectory look like?', status: 'new', priority: 'medium', assigned_to: null, source_page: '/services', created_at: new Date(Date.now() - 864e5).toISOString() },
  { id: 'x3', name: 'Mathieu Kok', email: 'mathieu@wetransfer.com', company: 'WeTransfer', subject: 'Data cleanup follow-up', message: 'Following up on the data migration proposal — do you have availability next month?', status: 'in_progress', priority: 'medium', assigned_to: null, source_page: '/contact', created_at: new Date(Date.now() - 864e5 * 4).toISOString() },
  { id: 'x4', name: 'Tom Jansen', email: 'tom@alphaventilatie.nl', company: 'Alpha Ventilatie', subject: 'Support question', message: 'Quick question about a flow that stopped triggering after the last release.', status: 'resolved', priority: 'low', assigned_to: null, source_page: '/contact', created_at: new Date(Date.now() - 864e5 * 8).toISOString() },
];

export async function listInquiries() {
  // Demo mode only: no Supabase connection at all.
  if (!supabaseConfigured) return { rows: SAMPLE, sample: true };

  const { data, error } = await supabase
    .from('inquiries')
    .select('id, name, email, company, subject, message, status, priority, assigned_to, source_page, created_at')
    .order('created_at', { ascending: false });

  // Connected but the read failed (e.g. permissions): surface it rather than
  // quietly showing fake rows, which makes a real problem look like no data.
  if (error) {
    console.error('Could not load inquiries:', error.message);
    return { rows: [], sample: false, error: error.message };
  }

  // Connected and genuinely empty: show a real empty state, not samples, so
  // you can tell "nothing has come in yet" from "something is broken".
  return { rows: data || [], sample: false };
}

export async function updateInquiry(id, patch) {
  if (!supabaseConfigured) return { error: null };
  const { error } = await supabase.from('inquiries').update(patch).eq('id', id);
  return { error };
}

export async function listAssignees() {
  if (!supabaseConfigured) return [];
  const { data } = await supabase.from('profiles').select('id, full_name, email, role').order('full_name');
  return data || [];
}

export async function listNotes(inquiryId) {
  if (!supabaseConfigured) return [];
  const { data } = await supabase
    .from('inquiry_notes')
    .select('id, body, created_at, author_id')
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function addNote(inquiryId, body, authorId) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('inquiry_notes').insert({ inquiry_id: inquiryId, body, author_id: authorId });
  return { error };
}
