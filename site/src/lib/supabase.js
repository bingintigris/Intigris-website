/* Shared Supabase client (anon key, browser only). The supabase-js UMD build is loaded
   from the CDN by the page; during the static build there is no client (returns null). */
let client;
export function getSupabase() {
  if (typeof window === 'undefined') return null;
  if (client === undefined) {
    client = window.supabase && window.SUPABASE_URL ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;
  }
  return client;
}
