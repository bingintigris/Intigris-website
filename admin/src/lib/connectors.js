import { supabase, supabaseConfigured } from './supabase';

export const STATUSES = [
  ['connected', 'Connected'],
  ['needs_setup', 'Needs setup'],
  ['not_connected', 'Not connected'],
  ['planned', 'Planned'],
];

export const STATUS_TONE = {
  connected: 'green',
  needs_setup: 'yellow',
  not_connected: 'neutral',
  planned: 'blue',
};

export async function listConnectors() {
  if (!supabaseConfigured) return { rows: [], error: 'Supabase is not configured.' };
  const { data, error } = await supabase
    .from('connectors')
    .select('id, key, name, category, status, purpose, credential_location, console_url, setup_notes, owner, sort_order, updated_at')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error(error.message);
    // The table is created by admin/supabase/connectors.sql. Say so plainly rather
    // than showing an empty page that looks like there is nothing to configure.
    const missing = /relation .*connectors.* does not exist/i.test(error.message);
    return {
      rows: [],
      error: missing
        ? 'The connectors table does not exist yet. Run admin/supabase/connectors.sql in Supabase.'
        : error.message,
    };
  }
  return { rows: data || [] };
}

export async function updateConnector(id, patch) {
  if (!supabaseConfigured) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('connectors').update(patch).eq('id', id);
  if (error) {
    // Writes are admin-only at the database level, so a non-admin gets an RLS
    // refusal rather than a silent no-op.
    if (/row-level security/i.test(error.message)) {
      throw new Error('Only admins can change connector details.');
    }
    throw new Error(error.message);
  }
}

// Klaviyo is the one connector whose real state we already store, so read it
// rather than relying on someone keeping the status field up to date by hand.
export async function klaviyoSyncSummary() {
  if (!supabaseConfigured) return null;
  const { data, error } = await supabase
    .from('subscribers')
    .select('klaviyo_synced_at');
  if (error) return null;
  const rows = data || [];
  const stamps = rows.map((r) => r.klaviyo_synced_at).filter(Boolean).sort();
  return {
    total: rows.length,
    pending: rows.filter((r) => !r.klaviyo_synced_at).length,
    lastSync: stamps.length ? stamps[stamps.length - 1] : null,
  };
}
