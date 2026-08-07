import { supabase, supabaseConfigured } from './supabase';

export async function listSubscribers() {
  if (!supabaseConfigured) return { rows: [], sample: false, error: 'Supabase is not configured.' };
  const { data, error } = await supabase
    .from('subscribers')
    .select('id, email, source_page, created_at, klaviyo_synced_at')
    .order('created_at', { ascending: false });
  if (error) { console.error(error.message); return { rows: [], sample: false, error: error.message }; }
  return { rows: data || [], sample: false };
}

// Pushes subscribers to Klaviyo via the klaviyo-sync Edge Function.
// The Klaviyo private API key lives as a server side secret, never in the browser.
// Pass { all: true } to re-send every subscriber instead of only the new ones.
export async function syncToKlaviyo({ all = false } = {}) {
  if (!supabaseConfigured) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.functions.invoke('klaviyo-sync', { body: { all } });
  if (error) {
    // Edge Functions return the JSON body alongside non 2xx statuses; read it
    // so the user sees Klaviyo's actual complaint rather than "non-2xx status".
    let detail = '';
    try { detail = (await error.context?.json())?.error || ''; } catch { /* ignore */ }
    if (detail) throw new Error(detail);
    throw new Error(
      error.message?.includes('Failed to fetch') || error.message?.includes('404')
        ? 'The klaviyo-sync function is not deployed yet (see admin/README).'
        : error.message || 'Sync failed.'
    );
  }
  if (data?.error) throw new Error(data.error);
  return data;
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
