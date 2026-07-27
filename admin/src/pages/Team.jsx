import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Users } from 'lucide-react';
import { Card, Badge, Button, Input, Textarea, Select, Spinner, Drawer } from '../components/ui/index.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { listTeam, createMember, updateMember, deleteMember } from '../lib/team';
import { initials } from '../lib/format';

const BLANK = { name: '', title: '', bio: '', skills: '', headshot_url: '', email: '', linkedin_url: '', status: 'active', sort_order: 0 };

export default function Team() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [editing, setEditing] = useState(null); // null | {} member (or BLANK for new)
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);

  function load() { listTeam().then(({ rows, sample }) => { setRows(rows); setSample(sample); }); }
  useEffect(() => { load(); }, []);

  function open(member) { setDraft(member ? { ...BLANK, ...member } : { ...BLANK }); setEditing(member || 'new'); }
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((m) => (
          <Card key={m.id} className="p-5 cursor-pointer hover:shadow-pop transition-shadow" onClick={() => open(m)}>
            <div className="flex items-center gap-3">
              {m.headshot_url
                ? <img src={m.headshot_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                : <span className="h-12 w-12 rounded-full bg-coral text-white grid place-items-center font-medium">{initials(m.name)}</span>}
              <div className="min-w-0">
                <div className="font-medium text-ink truncate">{m.name}</div>
                <div className="text-sm text-muted truncate">{m.title}</div>
              </div>
              {m.status !== 'active' && <Badge tone="neutral">Hidden</Badge>}
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
            <div className="flex items-center gap-3">
              {draft.headshot_url
                ? <img src={draft.headshot_url} alt="" className="h-14 w-14 rounded-full object-cover" />
                : <span className="h-14 w-14 rounded-full bg-coral text-white grid place-items-center text-lg font-medium">{initials(draft.name || '?')}</span>}
              <div className="text-sm text-muted">Preview</div>
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
                <option value="active">Active (shown)</option>
                <option value="hidden">Hidden</option>
              </Select>
              <Input label="Sort order" type="number" value={draft.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
