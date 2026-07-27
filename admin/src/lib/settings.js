import { supabase, supabaseConfigured } from './supabase';

export const MEDIA_BUCKET = 'media';

/* ---------- Users & roles ---------- */
export async function listUsers() {
  if (!supabaseConfigured) return [];
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: true });
  return data || [];
}
export async function updateUserRole(id, role) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  return { error };
}

// Invites/creates a new portal user via the invite-user Edge Function.
export async function inviteUser({ email, full_name, role }) {
  if (!supabaseConfigured) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { email, full_name, role },
  });
  if (error) {
    throw new Error(
      error.message?.includes('Failed to fetch') || error.message?.includes('404')
        ? 'The invite-user function isn’t deployed yet (see admin/README).'
        : (error.message || 'Could not add the user.')
    );
  }
  if (data?.error) throw new Error(data.error);
  return data; // { ok, email, tempPassword }
}

/* ---------- Activity log ---------- */
export async function listActivity(limit = 40) {
  if (!supabaseConfigured) return [];
  const { data } = await supabase
    .from('activity_log')
    .select('id, kind, message, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

/* ---------- Media library (Supabase Storage) ---------- */
export async function listMedia() {
  if (!supabaseConfigured) return { files: [], error: 'not-configured' };
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list('', {
    limit: 100, sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) return { files: [], error: error.message };
  const files = (data || [])
    .filter((f) => f.name && f.name !== '.emptyFolderPlaceholder')
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
      size: f.metadata?.size,
      type: f.metadata?.mimetype || '',
      created_at: f.created_at,
    }));
  return { files, error: null };
}

export async function uploadMedia(file) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600', upsert: false,
  });
  return { error };
}

export async function deleteMedia(name) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([name]);
  return { error };
}

export function isImage(type = '', name = '') {
  return type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);
}

export function formatBytes(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
