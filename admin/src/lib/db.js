import { supabase, supabaseConfigured } from './supabase';

// Sample data shown when Supabase isn't configured yet, or a table is empty,
// so the dashboard is never blank during setup. Real data replaces it
// automatically once the tables have rows.
const SAMPLE = {
  counts: { subscribers: 1284, inquiriesNew: 7, blogPublished: 23, applicationsActive: 12 },
  followUps: [
    { id: 's1', type: 'inquiry', title: 'Field Service quote — Feenstra', meta: 'New · 2 days unassigned', priority: 'high' },
    { id: 's2', type: 'inquiry', title: 'Integration scoping — Ebusco', meta: 'In progress · awaiting reply', priority: 'medium' },
    { id: 's3', type: 'application', title: 'Salesforce Consultant — 1 applicant', meta: 'New · needs review', priority: 'medium' },
  ],
  activity: [
    { id: 'a1', kind: 'inquiry', text: 'New “Let’s talk” inquiry from WeTransfer', at: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
    { id: 'a2', kind: 'subscriber', text: 'New newsletter subscriber (careers page)', at: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: 'a3', kind: 'blog', text: 'Blog post “Agentforce in the field” published', at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 'a4', kind: 'application', text: 'New application — Medior Developer', at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  ],
  usingSample: true,
};

async function count(table, filter) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count: c, error } = await q;
  if (error) throw error;
  return c ?? 0;
}

export async function getDashboardData() {
  if (!supabaseConfigured) return SAMPLE;
  try {
    const [subscribers, inquiriesNew, blogPublished, applicationsActive] = await Promise.all([
      count('subscribers'),
      count('inquiries', (q) => q.eq('status', 'new')),
      count('blog_posts', (q) => q.eq('status', 'published')),
      count('job_applications', (q) => q.not('status', 'in', '("rejected","hired")')),
    ]);

    const { data: followUps } = await supabase
      .from('inquiries')
      .select('id, name, subject, status, priority, assigned_to, created_at')
      .in('status', ['new', 'in_progress'])
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(6);

    const { data: activity } = await supabase
      .from('activity_log')
      .select('id, kind, message, created_at')
      .order('created_at', { ascending: false })
      .limit(8);

    const hasAny = subscribers || inquiriesNew || blogPublished || applicationsActive || (activity && activity.length);
    if (!hasAny) return SAMPLE;

    return {
      counts: { subscribers, inquiriesNew, blogPublished, applicationsActive },
      followUps: (followUps || []).map((r) => ({
        id: r.id,
        type: 'inquiry',
        title: r.subject || r.name || 'Inquiry',
        meta: `${r.status === 'new' ? 'New' : 'In progress'}${r.assigned_to ? '' : ' · unassigned'}`,
        priority: r.priority || 'medium',
      })),
      activity: (activity || []).map((r) => ({ id: r.id, kind: r.kind, text: r.message, at: r.created_at })),
      usingSample: false,
    };
  } catch (e) {
    console.warn('Dashboard falling back to sample data:', e.message);
    return SAMPLE;
  }
}
