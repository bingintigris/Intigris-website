import { supabase, supabaseConfigured } from './supabase';

// Calls the `suggest-topics` Edge Function. Returns { suggestions } or throws.
export async function suggestTopics(existingTitles = []) {
  if (!supabaseConfigured) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.functions.invoke('suggest-topics', {
    body: { existingTitles },
  });
  if (error) {
    // Surface a helpful hint when the function isn't deployed yet.
    throw new Error(
      error.message?.includes('Failed to fetch') || error.message?.includes('404')
        ? 'The suggest-topics function isn’t deployed yet (see admin/README).'
        : (error.message || 'Could not get suggestions.')
    );
  }
  if (data?.error) throw new Error(data.error);
  return data?.suggestions || [];
}
