import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Send, Trash2, Eye, Code } from 'lucide-react';
import { Card, Button, Input, Textarea, Select, Spinner, Badge, SegmentedTabs } from '../components/ui/index.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { getPost, createPost, updatePost, deletePost, CATEGORIES } from '../lib/blog';
import { renderMarkdown, slugify, estimateReadMinutes } from '../lib/markdown';

const BLANK = {
  title: '', slug: '', excerpt: '', body: '', cover_image_url: '',
  category: 'Insights', status: 'draft', author_name: 'Intigris',
  meta_title: '', meta_description: '', og_image_url: '',
};

export default function BlogEditor({ postId, seed, onBack }) {
  const { toast } = useToast();
  const isNew = !postId;
  const [post, setPost] = useState(isNew ? { ...BLANK, ...(seed || {}) } : null);
  const [tab, setTab] = useState('write'); // write | preview
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getPost(postId).then((p) => setPost(p ? { ...BLANK, ...p } : BLANK));
  }, [postId, isNew]);

  if (!post) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  const set = (k, v) => setPost((p) => ({ ...p, [k]: v }));
  const onTitle = (v) => { set('title', v); if (!slugTouched) set('slug', slugify(v)); };

  function payload(extra = {}) {
    return {
      title: post.title, slug: post.slug || slugify(post.title),
      excerpt: post.excerpt, body: post.body, cover_image_url: post.cover_image_url || null,
      category: post.category, author_name: post.author_name || 'Intigris',
      read_minutes: estimateReadMinutes(post.body),
      meta_title: post.meta_title || null, meta_description: post.meta_description || null,
      og_image_url: post.og_image_url || post.cover_image_url || null,
      status: post.status, ...extra,
    };
  }

  async function save(publish) {
    if (!post.title.trim()) return toast('Add a title first.', 'error');
    setBusy(true);
    const extra = publish ? { status: 'published', published_at: new Date().toISOString() } : {};
    const body = payload(extra);
    const res = isNew ? await createPost(body) : await updatePost(postId, body);
    setBusy(false);
    if (res.error) return toast(res.error.message, 'error');
    toast(publish ? 'Published.' : 'Saved.', 'success');
    onBack?.(true);
  }

  async function remove() {
    if (isNew) return onBack?.();
    if (!window.confirm('Delete this post permanently?')) return;
    setBusy(true);
    const { error } = await deletePost(postId);
    setBusy(false);
    if (error) return toast(error.message, 'error');
    toast('Post deleted.', 'success');
    onBack?.(true);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <button onClick={() => onBack?.()} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft size={16} /> Back to posts
        </button>
        <div className="flex items-center gap-2">
          {!isNew && <Button variant="danger" size="sm" onClick={remove} disabled={busy}><Trash2 size={15} /> Delete</Button>}
          <Button variant="secondary" size="sm" onClick={() => save(false)} disabled={busy}><Save size={15} /> Save draft</Button>
          <Button size="sm" onClick={() => save(true)} disabled={busy}>
            {busy ? <Spinner /> : <><Send size={15} /> Publish</>}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <Input label="Title" value={post.title} onChange={(e) => onTitle(e.target.value)} placeholder="An engaging, specific headline" />
            <Input label="URL slug" value={post.slug}
              onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }}
              placeholder="my-post-slug" />
            <Textarea label="Excerpt" rows={2} value={post.excerpt || ''} onChange={(e) => set('excerpt', e.target.value)}
              placeholder="One or two sentences shown on the blog index." />
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Body (Markdown)</span>
              <SegmentedTabs
                size="sm"
                value={tab}
                onChange={setTab}
                options={[
                  { value: 'write', label: 'Write', icon: <Code size={14} /> },
                  { value: 'preview', label: 'Preview', icon: <Eye size={14} /> },
                ]}
              />
            </div>
            {tab === 'write' ? (
              <textarea
                value={post.body || ''} onChange={(e) => set('body', e.target.value)}
                placeholder={'## A section heading\n\nWrite your article using Markdown.\n\n- bullet points\n- **bold** and [links](https://intigris.nl)'}
                className="w-full min-h-[420px] p-4 text-[15px] leading-relaxed text-ink bg-cream-paper outline-none resize-y font-mono"
              />
            ) : (
              <div className="p-5 prose-admin min-h-[420px]" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body || '_Nothing to preview yet._') }} />
            )}
          </Card>
        </div>

        {/* Sidebar: settings + SEO */}
        <div className="space-y-4">
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Status</span>
              <Badge tone={post.status === 'published' ? 'green' : post.status === 'scheduled' ? 'yellow' : 'neutral'}>
                {post.status}
              </Badge>
            </div>
            <Select label="Status" value={post.status} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </Select>
            <Select label="Category" value={post.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Input label="Author" value={post.author_name || ''} onChange={(e) => set('author_name', e.target.value)} />
            <Input label="Cover image URL" value={post.cover_image_url || ''} onChange={(e) => set('cover_image_url', e.target.value)} placeholder="https://…" />
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt="" className="w-full h-32 object-cover rounded-lg border border-line" />
            )}
          </Card>

          <Card className="p-5 space-y-3">
            <div className="text-sm font-medium text-ink">SEO</div>
            <Input label="Meta title" value={post.meta_title || ''} onChange={(e) => set('meta_title', e.target.value)} placeholder={post.title} />
            <Textarea label="Meta description" rows={3} value={post.meta_description || ''} onChange={(e) => set('meta_description', e.target.value)} placeholder={post.excerpt} />
            <Input label="OpenGraph image URL" value={post.og_image_url || ''} onChange={(e) => set('og_image_url', e.target.value)} placeholder="Defaults to cover image" />
          </Card>
        </div>
      </div>

      <style>{`
        .prose-admin h2 { font-size: 20px; font-weight: 500; margin: 18px 0 8px; color: #402301; }
        .prose-admin h3 { font-size: 17px; font-weight: 500; margin: 14px 0 6px; color: #402301; }
        .prose-admin p { margin: 0 0 12px; color: #402301; }
        .prose-admin ul, .prose-admin ol { margin: 0 0 12px 20px; }
        .prose-admin li { margin: 3px 0; }
        .prose-admin a { color: #d6431b; text-decoration: underline; }
        .prose-admin hr { border: 0; border-top: 1px solid #e8ddc6; margin: 18px 0; }
      `}</style>
    </div>
  );
}
