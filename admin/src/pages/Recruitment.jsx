import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save, Mail, Clock, Eye, Code } from 'lucide-react';
import { Card, Badge, Button, Input, Textarea, Select, Spinner, Drawer } from '../components/ui/index.jsx';
import { useToast } from '../components/ui/toast.jsx';
import {
  STAGES, listApplicants, updateApplicant,
  listOpenings, createOpening, updateOpening, deleteOpening,
} from '../lib/recruitment';
import { renderMarkdown, slugify } from '../lib/markdown';
import { formatDate, timeAgo } from '../lib/format';

const OPENING_BLANK = { title: '', slug: '', department: '', location: '', employment_type: 'Full-time', description: '', status: 'open' };

export default function Recruitment() {
  const [tab, setTab] = useState('applicants');
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h2 className="text-2xl font-medium text-ink">Recruitment</h2>
        <p className="text-sm text-muted mt-1">Track applicants and manage open positions.</p>
      </div>
      <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1 w-fit">
        {[['applicants', 'Applicants'], ['openings', 'Open positions']].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === v ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'applicants' ? <Applicants /> : <Openings />}
    </div>
  );
}

/* ------------- Applicants Kanban ------------- */
function Applicants() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [sel, setSel] = useState(null);

  useEffect(() => { listApplicants().then(({ rows, sample }) => { setRows(rows); setSample(sample); }); }, []);

  async function move(app, status) {
    setRows((prev) => prev.map((r) => (r.id === app.id ? { ...r, status } : r)));
    setSel((s) => (s && s.id === app.id ? { ...s, status } : s));
    if (sample) return;
    const { error } = await updateApplicant(app.id, { status });
    if (error) toast(error.message, 'error');
  }

  async function saveNotes(app, notes) {
    setSel((s) => ({ ...s, notes }));
    setRows((prev) => prev.map((r) => (r.id === app.id ? { ...r, notes } : r)));
    if (sample) return toast('Sample data — not saved.', 'info');
    const { error } = await updateApplicant(app.id, { notes });
    if (error) toast(error.message, 'error'); else toast('Saved.', 'success');
  }

  if (!rows) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  return (
    <div className="space-y-3">
      {sample && <Badge tone="yellow">Sample data</Badge>}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(180px, 1fr))` }}>
        {STAGES.map((stage) => {
          const items = rows.filter((r) => (r.status || 'new') === stage.value);
          return (
            <div key={stage.value} className="bg-cream-100 rounded-xl p-2.5 min-h-[120px]">
              <div className="flex items-center justify-between px-1.5 py-1 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">{stage.label}</span>
                <span className="text-xs text-muted">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((a) => (
                  <div key={a.id} className="bg-white border border-line rounded-lg p-3 shadow-sm">
                    <button onClick={() => setSel(a)} className="text-left w-full">
                      <div className="text-sm font-medium text-ink leading-snug">{a.candidate || 'Applicant'}</div>
                      <div className="text-xs text-muted mt-0.5">{a.role_applied || '—'}</div>
                      <div className="text-[11px] text-muted mt-1">{timeAgo(a.created_at)}</div>
                    </button>
                    <select
                      value={a.status || 'new'} onChange={(e) => move(a, e.target.value)}
                      className="mt-2 w-full text-xs rounded-md border border-line bg-cream-paper px-1.5 py-1 text-ink focus:border-coral focus:outline-none"
                    >
                      {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel?.candidate || 'Applicant'}>
        {sel && (
          <div className="space-y-4">
            <div>
              <div className="text-base font-medium text-ink">{sel.candidate}</div>
              <a href={`mailto:${sel.email}`} className="text-sm text-coral-700 inline-flex items-center gap-1.5 mt-1"><Mail size={14} /> {sel.email}</a>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>Applied for: <span className="text-ink">{sel.role_applied || '—'}</span></span>
              <span className="inline-flex items-center gap-1"><Clock size={13} /> {formatDate(sel.created_at)}</span>
            </div>
            <Select label="Stage" value={sel.status || 'new'} onChange={(e) => move(sel, e.target.value)}>
              {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
            <Textarea label="Internal notes" rows={5} defaultValue={sel.notes || ''}
              onBlur={(e) => saveNotes(sel, e.target.value)} placeholder="Notes on this candidate…" />
            <p className="text-xs text-muted">Notes save when you click away from the box.</p>
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ------------- Open positions ------------- */
function Openings() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [descTab, setDescTab] = useState('write');
  const [busy, setBusy] = useState(false);

  function load() { listOpenings().then(({ rows, sample }) => { setRows(rows); setSample(sample); }); }
  useEffect(() => { load(); }, []);

  function open(o) { setDraft(o ? { ...OPENING_BLANK, ...o } : { ...OPENING_BLANK }); setEditing(o || 'new'); setDescTab('write'); }
  function close() { setEditing(null); setDraft(null); }
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  async function save() {
    if (!draft.title.trim()) return toast('A title is required.', 'error');
    if (sample) { toast('Sample data — changes aren’t saved.', 'info'); return close(); }
    setBusy(true);
    const payload = { ...draft, slug: draft.slug || slugify(draft.title) };
    delete payload.id; delete payload.created_at;
    const isNew = editing === 'new';
    const res = isNew ? await createOpening(payload) : await updateOpening(draft.id, payload);
    setBusy(false);
    if (res.error) return toast(res.error.message, 'error');
    toast('Saved.', 'success'); close(); load();
  }

  async function remove() {
    if (sample || editing === 'new') return close();
    if (!window.confirm('Delete this position?')) return;
    setBusy(true);
    const { error } = await deleteOpening(draft.id);
    setBusy(false);
    if (error) return toast(error.message, 'error');
    toast('Deleted.', 'success'); close(); load();
  }

  if (!rows) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {sample ? <Badge tone="yellow">Sample data</Badge> : <span />}
        <Button onClick={() => open(null)}><Plus size={16} /> New position</Button>
      </div>
      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted">No positions yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
                <th className="font-medium px-5 py-3">Title</th>
                <th className="font-medium px-3 py-3">Department</th>
                <th className="font-medium px-3 py-3">Location</th>
                <th className="font-medium px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} onClick={() => open(o)} className="border-b border-line last:border-0 hover:bg-cream-100 cursor-pointer">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-ink">{o.title}</div>
                    <div className="text-xs text-muted">{o.employment_type}</div>
                  </td>
                  <td className="px-3 py-3.5 text-ink">{o.department || '—'}</td>
                  <td className="px-3 py-3.5 text-muted">{o.location || '—'}</td>
                  <td className="px-3 py-3.5"><Badge tone={o.status === 'open' ? 'green' : 'neutral'}>{o.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Drawer
        open={editing !== null}
        onClose={close}
        title={editing === 'new' ? 'New position' : draft?.title || 'Edit position'}
        footer={draft && (
          <div className="flex items-center gap-2">
            {editing !== 'new' && <Button variant="danger" onClick={remove} disabled={busy}><Trash2 size={15} /> Delete</Button>}
            <Button className="flex-1" onClick={save} disabled={busy}>{busy ? <Spinner /> : <><Save size={15} /> Save</>}</Button>
          </div>
        )}
      >
        {draft && (
          <div className="space-y-4">
            <Input label="Title" value={draft.title} onChange={(e) => set('title', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Department" value={draft.department} onChange={(e) => set('department', e.target.value)} />
              <Input label="Location" value={draft.location} onChange={(e) => set('location', e.target.value)} placeholder="Amsterdam / Hybrid" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Employment type" value={draft.employment_type} onChange={(e) => set('employment_type', e.target.value)} placeholder="Full-time" />
              <Select label="Status" value={draft.status} onChange={(e) => set('status', e.target.value)}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Description (Markdown)</span>
                <div className="flex items-center gap-1 bg-cream-100 rounded-full p-0.5">
                  <button onClick={() => setDescTab('write')} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${descTab === 'write' ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}><Code size={14} /> Write</button>
                  <button onClick={() => setDescTab('preview')} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${descTab === 'preview' ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}><Eye size={14} /> Preview</button>
                </div>
              </div>
              {descTab === 'write' ? (
                <textarea value={draft.description} onChange={(e) => set('description', e.target.value)} rows={10}
                  className="w-full rounded-xl border border-line bg-cream-paper px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-coral font-mono resize-y" />
              ) : (
                <div className="rounded-xl border border-line bg-white p-4 prose-admin min-h-[220px]" dangerouslySetInnerHTML={{ __html: renderMarkdown(draft.description || '_Nothing to preview._') }} />
              )}
            </div>
          </div>
        )}
      </Drawer>

      <style>{`
        .prose-admin h2 { font-size: 18px; font-weight: 500; margin: 14px 0 8px; color: #402301; }
        .prose-admin h3 { font-size: 16px; font-weight: 500; margin: 12px 0 6px; color: #402301; }
        .prose-admin p { margin: 0 0 10px; color: #402301; }
        .prose-admin ul, .prose-admin ol { margin: 0 0 10px 20px; }
        .prose-admin li { margin: 3px 0; }
        .prose-admin a { color: #d6431b; text-decoration: underline; }
      `}</style>
    </div>
  );
}
