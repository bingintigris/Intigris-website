import { useEffect, useMemo, useState } from 'react';
import { Plus, FileText, Eye, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '../components/ui/index.jsx';
import { listPosts, POST_STATUSES, postStatusMeta, CATEGORIES } from '../lib/blog';
import { suggestTopics } from '../lib/aiSuggest';
import { useToast } from '../components/ui/toast.jsx';
import { formatDate } from '../lib/format';
import BlogEditor from './BlogEditor';

const TABS = [{ value: 'all', label: 'All' }, ...POST_STATUSES];

export default function Blog() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [tab, setTab] = useState('all');
  const [editing, setEditing] = useState(null); // null | 'new' | postId
  const [seed, setSeed] = useState(null);
  const [ideas, setIdeas] = useState(null);
  const [suggesting, setSuggesting] = useState(false);

  function load() { listPosts().then(({ rows, sample }) => { setRows(rows); setSample(sample); }); }
  useEffect(() => { load(); }, []);

  async function getIdeas() {
    setSuggesting(true);
    try {
      const titles = (rows || []).map((r) => r.title);
      const s = await suggestTopics(titles);
      setIdeas(s);
      if (!s.length) toast('No suggestions returned — try again.', 'info');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSuggesting(false);
    }
  }

  function draftFrom(s) {
    const category = CATEGORIES.includes(s.category) ? s.category : 'Insights';
    setSeed({
      title: s.title || '',
      category,
      excerpt: s.angle || '',
      meta_title: s.title || '',
      meta_description: s.angle || '',
      body: `## Outline\n\n*Target keyword: ${s.target_keyword || ''}*\n\n${s.why_now || ''}\n\n- \n- \n- \n`,
    });
    setEditing('new');
  }

  const counts = useMemo(() => {
    const c = { all: rows?.length || 0 };
    for (const s of POST_STATUSES) c[s.value] = (rows || []).filter((r) => r.status === s.value).length;
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    if (tab === 'all') return rows || [];
    return (rows || []).filter((r) => r.status === tab);
  }, [rows, tab]);

  if (editing !== null) {
    return (
      <BlogEditor
        postId={editing === 'new' ? null : editing}
        seed={editing === 'new' ? seed : null}
        onBack={(changed) => { setEditing(null); setSeed(null); if (changed) load(); }}
      />
    );
  }

  if (!rows) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-medium text-ink">Blog</h2>
          <p className="text-sm text-muted mt-1">
            Write and manage articles for the public blog.
            {sample && <span className="ml-2 inline-flex"><Badge tone="yellow">Sample data</Badge></span>}
          </p>
        </div>
        <Button onClick={() => setEditing('new')}><Plus size={16} /> New post</Button>
      </div>

      {/* AI topic ideas */}
      <div className="p-5 rounded-2xl shadow-card border border-line text-ink" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-coral grid place-items-center shrink-0"><Sparkles size={18} className="text-white" /></div>
            <div>
              <div className="font-medium text-ink">AI topic ideas</div>
              <p className="text-sm text-muted mt-0.5 max-w-xl">
                On-brand article suggestions for the Salesforce space, avoiding topics you’ve already covered. Editorial ideas — not live search volume.
              </p>
            </div>
          </div>
          <Button variant="primary" onClick={getIdeas} disabled={suggesting}>
            {suggesting ? <Spinner /> : <>{ideas ? <RefreshCw size={15} /> : <Sparkles size={15} />} {ideas ? 'Regenerate' : 'Suggest topics'}</>}
          </Button>
        </div>

        {ideas && ideas.length > 0 && (
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {ideas.map((s, i) => (
              <div key={i} className="rounded-xl bg-cream-100 border border-line p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] uppercase tracking-wide text-coral-700 font-medium">{s.category || 'Insights'}</span>
                </div>
                <div className="font-medium text-ink leading-snug">{s.title}</div>
                {s.angle && <p className="text-sm text-muted mt-1.5">{s.angle}</p>}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  {s.target_keyword && <span>🔑 {s.target_keyword}</span>}
                  {s.why_now && <span>⏱ {s.why_now}</span>}
                </div>
                <button onClick={() => draftFrom(s)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-coral-700 hover:text-coral">
                  Draft this <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm border transition-colors ${
              tab === t.value ? 'bg-brown text-cream border-brown' : 'bg-white text-ink border-line hover:bg-cream-100'
            }`}
          >
            {t.label}<span className={`text-xs ${tab === t.value ? 'text-cream/70' : 'text-muted'}`}>{counts[t.value] ?? 0}</span>
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {visible.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-12 w-12 rounded-full bg-cream-100 grid place-items-center mx-auto mb-3">
              <FileText size={22} className="text-muted" />
            </div>
            <p className="text-sm text-muted">No posts here yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
                <th className="font-medium px-5 py-3">Title</th>
                <th className="font-medium px-3 py-3">Category</th>
                <th className="font-medium px-3 py-3">Status</th>
                <th className="font-medium px-3 py-3">Views</th>
                <th className="font-medium px-3 py-3 text-right whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const sm = postStatusMeta(r.status);
                return (
                  <tr key={r.id} onClick={() => setEditing(r.id)} className="border-b border-line last:border-0 hover:bg-cream-100 cursor-pointer">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-ink">{r.title}</div>
                      <div className="text-xs text-muted">{r.author_name || 'Intigris'} · {r.read_minutes || 4} min read</div>
                    </td>
                    <td className="px-3 py-3.5"><Badge tone="neutral">{r.category || '—'}</Badge></td>
                    <td className="px-3 py-3.5"><Badge tone={sm.tone}>{sm.label}</Badge></td>
                    <td className="px-3 py-3.5 text-muted"><span className="inline-flex items-center gap-1.5"><Eye size={14} />{(r.views || 0).toLocaleString('en-GB')}</span></td>
                    <td className="px-3 py-3.5 text-right text-muted whitespace-nowrap">{r.published_at ? formatDate(r.published_at) : formatDate(r.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
