import { supabase, supabaseConfigured } from './supabase';

export const POST_STATUSES = [
  { value: 'draft', label: 'Draft', tone: 'neutral' },
  { value: 'scheduled', label: 'Scheduled', tone: 'yellow' },
  { value: 'published', label: 'Published', tone: 'green' },
];
export const CATEGORIES = ['Insights', 'Guides', 'Company'];

export function postStatusMeta(v) { return POST_STATUSES.find((s) => s.value === v) || POST_STATUSES[0]; }

const SAMPLE = [
  { id: 'b1', title: 'What to Expect in Salesforce in 2026', slug: 'salesforce-in-2026', status: 'published', category: 'Insights', author_name: 'Intigris', views: 540, read_minutes: 5, published_at: '2026-01-15', created_at: '2026-01-15' },
  { id: 'b2', title: 'What is Salesforce?', slug: 'what-is-salesforce', status: 'published', category: 'Guides', author_name: 'Intigris', views: 498, read_minutes: 6, published_at: '2024-11-12', created_at: '2024-11-12' },
  { id: 'b3', title: 'Field service, without the chaos', slug: 'field-service-without-chaos', status: 'draft', category: 'Guides', author_name: 'Intigris', views: 0, read_minutes: 4, published_at: null, created_at: new Date().toISOString() },
];

export async function listPosts() {
  if (!supabaseConfigured) return { rows: SAMPLE, sample: true };
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, status, category, author_name, views, read_minutes, published_at, created_at')
    .order('created_at', { ascending: false });
  if (error) { console.error(error.message); return { rows: [], sample: false, error: error.message }; }
  return { rows: data || [], sample: false };
}

export async function getPost(id) {
  if (!supabaseConfigured) return null;
  const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single();
  return data;
}

export async function createPost(patch) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { data, error } = await supabase.from('blog_posts').insert(patch).select('id').single();
  return { data, error };
}

export async function updatePost(id, patch) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('blog_posts').update(patch).eq('id', id);
  return { error };
}

export async function deletePost(id) {
  if (!supabaseConfigured) return { error: { message: 'Not connected' } };
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  return { error };
}
