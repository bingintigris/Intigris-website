import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Surfaced clearly in the UI (see Login) rather than crashing silently.
export const supabaseConfigured = Boolean(url && anonKey);

// When not configured, we still export a client-shaped stub so imports don't throw.
export const supabase = supabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
