import { supabase, supabaseConfigured } from './supabase';

const SAMPLE = [
  { id: 'n1', email: 'info@direct-healthcare.com', source_page: '/blog', created_at: new Date(Date.now() - 864e5 * 3).toISOString() },
  { id: 'n2', email: 'planner@warmgarant.nl', source_page: '/careers', created_at: new Date(Date.now() - 864e5 * 6).toISOString() },
  { id: 'n3', email: 'hr@bouwgroep-schrijver.nl', source_page: '/', created_at: new Date(Date.now() - 864e5 * 9).toISOString() },
  { id: 'n4', email: 'ops@customs-support.com', source_page: '/services', created_at: new Date(Date.now() - 864e5 * 12).toISOString() },
];

export async function listSubscribers() {
  if (!supabaseConfigured) return { rows: SAMPLE, sample: true };
  const { data, error } = await supabase
    .from('subscribers')
    .select('id, email, source_page, created_at')
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return { rows: SAMPLE, sample: true };
  return { rows: data, sample: false };
}

// Build a CSV string and trigger a browser download. No server needed.
export function exportSubscribersCsv(rows) {
  const header = ['Email', 'Source page', 'Signed up'];
  const escape = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push([r.email, r.source_page || '', new Date(r.created_at).toISOString()].map(escape).join(','));
  }
  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `intigris-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
