import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Save, Upload } from 'lucide-react';
import { Card, Badge, Button, Input, Textarea, Select, Spinner, Drawer, SegmentedTabs } from '../components/ui/index.jsx';

/* Official LinkedIn "in" brand glyph */
function LinkedInGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
    </svg>
  );
}
import { useToast } from '../components/ui/toast.jsx';
import { listTeam, createMember, updateMember, deleteMember } from '../lib/team';
import { uploadImage } from '../lib/settings';
import { initials } from '../lib/format';

const BLANK = { name: '', title: '', bio: '', skills: '', headshot_url: '', email: '', linkedin_url: '', status: 'active', sort_order: 0 };

export default function Team() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [tab, setTab] = useState('active'); // 'active' | 'past'
  const [editing, setEditing] = useState(null); // null | {} member (or BLANK for new)
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function onPhoto(e) {
    const f = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!f) return;
    setUploading(true);
    const { url, error } = await uploadImage(f);
    setUploading(false);
    if (error) {
      const missing = /bucket|not found|does not exist/i.test(error.message || '');
      return toast(missing ? 'Set up the “media” storage bucket first (Settings → Media library).' : error.message, 'error');
    }
    set('headshot_url', url);
    toast('Photo uploaded.', 'success');
  }

  function load() { listTeam().then(({ rows, sample }) => { setRows(rows); setSample(sample); }); }
  useEffect(() => { load(); }, []);

  function open(member) {
    const norm = member ? { ...BLANK, ...member, status: member.status === 'active' ? 'active' : 'past' } : { ...BLANK };
    setDraft(norm);
    setEditing(member || 'new');
  }
  function close() { setEditing(null); setDraft(null); }
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  async function save() {
    if (!draft.name.trim()) return toast('A name is required.', 'error');
    if (sample) { toast('Sample data — changes aren’t saved.', 'info'); return close(); }
    setBusy(true);
    const isNew = editing === 'new';
    const payload = { ...draft };
    delete payload.id; delete payload.created_at;
    const res = isNew ? await createMember(payload) : await updateMember(draft.id, payload);
    setBusy(false);
    if (res.error) return toast(res.error.message, 'error');
    toast('Saved.', 'success'); close(); load();
  }

  async function remove() {
    if (sample || editing === 'new') return close();
    if (!window.confirm('Remove this team member?')) return;
    setBusy(true);
    const { error } = await deleteMember(draft.id);
    setBusy(false);
    if (error) return toast(error.message, 'error');
    toast('Removed.', 'success'); close(); load();
  }

  if (!rows) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  const activeCount = rows.filter((m) => m.status === 'active').length;
  const pastCount = rows.length - activeCount;
  const visible = rows.filter((m) => (tab === 'active' ? m.status === 'active' : m.status !== 'active'));


  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-medium text-ink">Team</h2>
          <p className="text-sm text-muted mt-1">
            Consultant &amp; team profiles. These will power the public Team section.
            {sample && <span className="ml-2 inline-flex"><Badge tone="yellow">Sample data</Badge></span>}
          </p>
        </div>
        <Button onClick={() => open(null)}><Plus size={16} /> Add member</Button>
      </div>

      <SegmentedTabs
        value={tab}
        onChange={setTab}
        options={[
          { value: 'active', label: 'Active', count: activeCount },
          { value: 'past', label: 'Past', count: pastCount },
        ]}
      />

      {visible.length === 0 ? (
        <div className="text-sm text-muted py-8">
          {tab === 'active' ? 'No active team members yet.' : 'No past team members.'}
        </div>
      ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((m) => (
          <Card key={m.id} className="p-5 cursor-pointer hover:shadow-pop transition-shadow" onClick={() => open(m)}>
            <div className="flex items-center gap-3">
              {m.headshot_url
                ? <img src={m.headshot_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                : <span className="h-12 w-12 rounded-full bg-coral text-white grid place-items-center font-medium">{initials(m.name)}</span>}
              <div className="min-w-0 flex-1">
                <div className="font-medium text-ink truncate">{m.name}</div>
                <div className="text-sm text-muted truncate">{m.title}</div>
              </div>
              {m.linkedin_url && (
                <a
                  href={m.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="View LinkedIn profile"
                  aria-label={`${m.name} on LinkedIn`}
                  className="shrink-0 h-8 w-8 grid place-items-center rounded-lg text-coral hover:bg-coral hover:text-white transition-colors"
                >
                  <LinkedInGlyph size={17} />
                </a>
              )}
            </div>
            {m.skills && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.skills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4).map((s, i) => (
                  <span key={i} className="text-xs bg-cream-100 text-muted rounded-full px-2 py-0.5">{s}</span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      )}

      <Drawer
        open={editing !== null}
        onClose={close}
        title={editing === 'new' ? 'Add team member' : draft?.name || 'Edit member'}
        footer={draft && (
          <div className="flex items-center gap-2">
            {editing !== 'new' && <Button variant="danger" onClick={remove} disabled={busy}><Trash2 size={15} /> Remove</Button>}
            <Button className="flex-1" onClick={save} disabled={busy}>{busy ? <Spinner /> : <><Save size={15} /> Save</>}</Button>
          </div>
        )}
      >
        {draft && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {draft.headshot_url
                ? <img src={draft.headshot_url} alt="" className="h-16 w-16 rounded-full object-cover border border-line" />
                : <span className="h-16 w-16 rounded-full bg-coral text-white grid place-items-center text-lg font-medium">{initials(draft.name || '?')}</span>}
              <div className="flex flex-col gap-1.5">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
                <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Spinner /> : <><Upload size={14} /> {draft.headshot_url ? 'Replace photo' : 'Upload photo'}</>}
                </Button>
                {draft.headshot_url && (
                  <button onClick={() => set('headshot_url', '')} className="text-xs text-muted hover:text-coral-700 text-left">Remove photo</button>
                )}
              </div>
            </div>
            <Input label="Name" value={draft.name} onChange={(e) => set('name', e.target.value)} />
            <Input label="Title / role" value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="Salesforce Consultant" />
            <Textarea label="Bio" rows={4} value={draft.bio} onChange={(e) => set('bio', e.target.value)} />
            <Input label="Skills (comma-separated)" value={draft.skills} onChange={(e) => set('skills', e.target.value)} placeholder="Sales Cloud, Field Service, Flow" />
            <Input label="Headshot URL" value={draft.headshot_url} onChange={(e) => set('headshot_url', e.target.value)} placeholder="https://…" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Email" value={draft.email} onChange={(e) => set('email', e.target.value)} />
              <Input label="LinkedIn URL" value={draft.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Status" value={draft.status} onChange={(e) => set('status', e.target.value)}>
                <option value="active">Active team member</option>
                <option value="past">Past team member</option>
              </Select>
              <Input label="Sort order" type="number" value={draft.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
