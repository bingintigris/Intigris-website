import { supabase, supabaseConfigured } from './supabase';

const SAMPLE = [
  { id: 't1', name: 'Hans Nieuwenhuis', title: 'Founder', bio: 'Founded Intigris in 2010.', skills: 'Leadership, Strategy, Salesforce', status: 'active', sort_order: 1 },
  { id: 't2', name: 'Carlijn de Haan', title: 'COO', bio: 'COO, previously a Salesforce Consultant at Intigris.', skills: 'Operations, Delivery', status: 'active', sort_order: 2 },
  { id: 't3', name: 'Victor Everaard', title: 'Senior Salesforce Consultant', bio: '13 years in field service consulting.', skills: 'Field Service, Integrations', status: 'active', sort_order: 3 },
];

export async function listTeam() {
  if (!supabaseConfigured) return { rows: SAMPLE, sample: true };
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error || !data || data.length === 0) return { rows: SAMPLE, sample: true };
  return { rows: data, sample: false };
}

export async function createMember(patch) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('team_members').insert(patch);
  return { error };
}
export async function updateMember(id, patch) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('team_members').update(patch).eq('id', id);
  return { error };
}
export async function deleteMember(id) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  return { error };
}
