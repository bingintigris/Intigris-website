/* Build-time content from Supabase (published blog posts, open vacancies).
   Runs during `astro build` (Netlify has internet; the admin portal's "Publish" triggers a
   rebuild through the Netlify build hook). If Supabase can't be reached the build still
   succeeds: pages then load their content in the browser, as before. */
const URL_ = 'https://kzonefjyvaedaoodckmj.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6b25lZmp5dmFlZGFvb2Rja21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjI2OTYsImV4cCI6MjEwMDI5ODY5Nn0.FZiSfRI1OxeJhHzZvF5rhVi-xJ5ut1TgFQBPRhskv54';

const cache = new Map();
async function rest(query) {
  if (cache.has(query)) return cache.get(query);
  const p = (async () => {
    try {
      const r = await fetch(`${URL_}/rest/v1/${query}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }, signal: AbortSignal.timeout(8000) });
      if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
      return await r.json();
    } catch (e) {
      console.warn(`[content] Supabase not reachable (${query.split('?')[0]}): ${e.message}. Falling back to loading in the browser.`);
      return null;
    }
  })();
  cache.set(query, p);
  return p;
}

/* null = unknown (fetch failed) → page loads in the browser */
export const getPosts = () => rest('blog_posts?select=*&status=eq.published&order=published_at.desc');
export const getJobs = () => rest('job_openings?select=*&status=eq.open&order=created_at.asc');
