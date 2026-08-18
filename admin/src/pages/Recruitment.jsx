import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save, Mail, Phone, Clock, Eye, Code, FileText, Image as ImageIcon, Check, X } from 'lucide-react';
import { Card, Badge, Button, Input, Textarea, Select, Spinner, Drawer, SegmentedTabs } from '../components/ui/index.jsx';
import { useToast } from '../components/ui/toast.jsx';
import {
  STAGES, DEFAULT_STAGE, listApplicants, updateApplicant, signedFileUrl,
  listOpenings, createOpening, updateOpening, deleteOpening,
} from '../lib/recruitment';
import { renderMarkdown, slugify } from '../lib/markdown';
import { formatDate, timeAgo } from '../lib/format';

const OPENING_BLANK = { title: '', slug: '', department: '', location: '', employment_type: 'Full-time', description: '', status: 'open' };

const firstOf = (n) => (n ? n.trim().split(/\s+/)[0] : 'there');

// Stage-based email templates. subject/body take (candidate name, role).
const EMAIL_TEMPLATES = {
  invite: {
    label: 'Invite to interview',
    subject: (n, r) => `Interview invitation — ${r} at Intigris`,
    body: (n, r) => `Hi ${firstOf(n)},\n\nThank you for applying for the ${r} role at Intigris. We were impressed by your application and would love to invite you for an interview.\n\nCould you share a few dates and times that work for you over the coming days?\n\nLooking forward to speaking with you.\n\nKind regards,\nThe Intigris team`,
  },
  info: {
    label: 'Request more information',
    subject: (n, r) => `A few questions about your application — ${r}`,
    body: (n, r) => `Hi ${firstOf(n)},\n\nThank you for your application for the ${r} role at Intigris. To help us review it, could you tell us a little more about your experience and availability?\n\nThanks in advance.\n\nKind regards,\nThe Intigris team`,
  },
  reject: {
    label: 'Rejection',
    subject: (n, r) => `Update on your application — ${r}`,
    body: (n, r) => `Hi ${firstOf(n)},\n\nThank you for taking the time to apply for the ${r} role at Intigris and for sharing your background with us. After careful consideration, we've decided not to move forward with your application at this time.\n\nWe genuinely appreciated your interest and wish you all the best in your search.\n\nKind regards,\nThe Intigris team`,
  },
};

const suggestTemplate = (status) => (status === 'rejected' ? 'reject' : 'invite');

export default function Recruitment() {
  const [tab, setTab] = useState('applicants');
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h2 className="text-2xl font-medium text-ink">Recruitment</h2>
        <p className="text-sm text-muted mt-1">Track applicants and manage open positions.</p>
      </div>
      <SegmentedTabs
        value={tab}
        onChange={setTab}
        options={[['applicants', 'Applicants'], ['openings', 'Open positions']]}
      />
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
  const [files, setFiles] = useState({ cv: null, photo: null });
  const [termTab, setTermTab] = useState('onboarding'); // onboarding | rejected
  const [termRange, setTermRange] = useState('30'); // 30 | 90 | 365 (days)
  const [emailTpl, setEmailTpl] = useState('invite');

  useEffect(() => { listApplicants().then(({ rows, sample }) => { setRows(rows); setSample(sample); }); }, []);

  useEffect(() => {
    setFiles({ cv: null, photo: null });
    if (!sel) return;
    setEmailTpl(suggestTemplate(sel.status));
    if (sel.cv_path) signedFileUrl(sel.cv_path).then((u) => setFiles((f) => ({ ...f, cv: u })));
    if (sel.photo_path) signedFileUrl(sel.photo_path).then((u) => setFiles((f) => ({ ...f, photo: u })));
  }, [sel]);

  const yesno = (v) => (v === true ? 'Yes' : v === false ? 'No' : '—');

  function emailCandidate(app) {
    if (!app?.email) return toast('No email on this applicant.', 'error');
    const t = EMAIL_TEMPLATES[emailTpl] || EMAIL_TEMPLATES[''];
    const role = app.role_applied || 'the role';
    const su = t.subject(app.candidate || '', role);
    const body = t.body(app.candidate || '', role);
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(app.email)}&su=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    // Log to internal notes
    const stamp = `Emailed on ${formatDate(new Date().toISOString())}${emailTpl ? ` (${t.label})` : ''}`;
    const newNotes = (app.notes ? app.notes + '\n' : '') + stamp;
    setRows((prev) => prev.map((r) => (r.id === app.id ? { ...r, notes: newNotes } : r)));
    setSel((s) => (s && s.id === app.id ? { ...s, notes: newNotes } : s));
    if (!sample) updateApplicant(app.id, { notes: newNotes });
    toast(sample ? 'Opened Gmail (sample — not logged).' : 'Opened Gmail · logged to notes.', 'success');
  }

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

  const MID = STAGES.filter((s) => ['intro', 'office', 'case', 'offer'].includes(s.value));
  const applications = rows.filter((r) => (r.status || DEFAULT_STAGE) === 'application');
  const rangeDays = { '30': 30, '90': 90, '365': 365 }[termRange];
  const cutoff = termRange === 'all' ? 0 : Date.now() - rangeDays * 864e5;
  const termList = rows.filter((r) => r.status === termTab && new Date(r.created_at).getTime() >= cutoff);
  const termCount = (v) => rows.filter((r) => r.status === v && new Date(r.created_at).getTime() >= cutoff).length;

  const ApplicantCard = (a) => (
    <div key={a.id} className="bg-white border border-line rounded-lg p-3 shadow-sm">
      <button onClick={() => setSel(a)} className="text-left w-full">
        <div className="text-sm font-medium text-ink leading-snug">{a.candidate || 'Applicant'}</div>
        <div className="text-xs text-muted mt-0.5">{a.role_applied || '—'}</div>
        <div className="text-[11px] text-muted mt-1">{timeAgo(a.created_at)}</div>
      </button>
      <select
        value={a.status || DEFAULT_STAGE} onChange={(e) => move(a, e.target.value)}
        className="mt-2 w-full text-xs rounded-md border border-line bg-cream-paper px-1.5 py-1 text-ink focus:border-coral focus:outline-none"
      >
        {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    </div>
  );

  const ApplicantTable = (list) => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
              <th className="font-medium px-5 py-3">Candidate</th>
              <th className="font-medium px-3 py-3">Role applied</th>
              <th className="font-medium px-3 py-3">Contact</th>
              <th className="font-medium px-3 py-3">SF cert.</th>
              <th className="font-medium px-3 py-3">Languages</th>
              <th className="font-medium px-3 py-3">NL</th>
              <th className="font-medium px-3 py-3 whitespace-nowrap">Applied</th>
              <th className="font-medium px-3 py-3">Stage</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-b border-line last:border-0 hover:bg-cream-100">
                <td className="px-5 py-3 cursor-pointer" onClick={() => setSel(a)}>
                  <div className="font-medium text-ink">{a.candidate || '—'}</div>
                </td>
                <td className="px-3 py-3 text-ink cursor-pointer" onClick={() => setSel(a)}>{a.role_applied || '—'}</td>
                <td className="px-3 py-3 text-muted">
                  <a href={`mailto:${a.email}`} className="hover:text-coral-700">{a.email}</a>
                  {a.phone && <div className="text-xs">{a.phone}</div>}
                </td>
                <td className="px-3 py-3 text-ink">{yesno(a.salesforce_certified)}</td>
                <td className="px-3 py-3 text-muted max-w-[180px] truncate" title={a.languages || ''}>{a.languages || '—'}</td>
                <td className="px-3 py-3 text-ink">{yesno(a.netherlands_resident)}</td>
                <td className="px-3 py-3 text-muted whitespace-nowrap">{formatDate(a.created_at)}</td>
                <td className="px-3 py-3">
                  <select
                    value={a.status || DEFAULT_STAGE} onChange={(e) => move(a, e.target.value)}
                    className="text-xs rounded-md border border-line bg-cream-paper px-1.5 py-1 text-ink focus:border-coral focus:outline-none"
                  >
                    {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {sample && <Badge tone="yellow">Sample data</Badge>}

      {/* Section 1 — New application (full width table) */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">New application</span>
          <span className="text-xs text-muted">· {applications.length} new</span>
        </div>
        {applications.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted">No new applications right now.</Card>
        ) : (
          ApplicantTable(applications)
        )}
      </div>

      {/* Section 2 — mid pipeline (Kanban) */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Interview pipeline</div>
        <div className="overflow-x-auto pb-2">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${MID.length}, minmax(220px, 1fr))`, minWidth: 'min-content' }}>
            {MID.map((stage) => {
              const items = rows.filter((r) => r.status === stage.value);
              return (
                <div key={stage.value} className="bg-cream-100 rounded-xl p-2.5 min-h-[120px]">
                  <div className="flex items-center justify-between px-1.5 py-1 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">{stage.label}</span>
                    <span className="text-xs text-muted">{items.length}</span>
                  </div>
                  <div className="space-y-2">{items.map(ApplicantCard)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 3 — Onboarding / Rejected with time filter */}
      <div>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <SegmentedTabs
            value={termTab}
            onChange={setTermTab}
            options={[
              { value: 'onboarding', label: 'Onboarding', count: termCount('onboarding') },
              { value: 'rejected', label: 'Rejected', count: termCount('rejected') },
            ]}
          />
          <select value={termRange} onChange={(e) => setTermRange(e.target.value)}
            className="h-9 rounded-full border border-line bg-white px-3.5 text-sm text-ink focus:border-coral focus:outline-none">
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
        {termList.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted">No {termTab === 'onboarding' ? 'onboarded' : 'rejected'} candidates in this period.</Card>
        ) : (
          ApplicantTable(termList)
        )}
      </div>

      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel?.candidate || 'Applicant'}>
        {sel && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {files.photo
                ? <img src={files.photo} alt="" className="h-12 w-12 rounded-full object-cover border border-line" />
                : sel.photo_path ? <span className="h-12 w-12 rounded-full bg-cream-100 grid place-items-center"><ImageIcon size={16} className="text-muted" /></span> : null}
              <div>
                <div className="text-base font-medium text-ink">{sel.candidate}</div>
                <a href={`mailto:${sel.email}`} className="text-sm text-coral-700 inline-flex items-center gap-1.5 mt-1"><Mail size={14} /> {sel.email}</a>
                {sel.phone && <div className="text-sm text-muted inline-flex items-center gap-1.5 mt-1 ml-0"><Phone size={13} /> {sel.phone}</div>}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>Applied for: <span className="text-ink">{sel.role_applied || '—'}</span></span>
              <span className="inline-flex items-center gap-1"><Clock size={13} /> {formatDate(sel.created_at)}</span>
            </div>

            {/* Email via Gmail */}
            <div className="rounded-xl border border-line bg-white p-3">
              <div className="text-xs font-medium uppercase tracking-wide text-muted mb-2">Email via Gmail</div>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={emailTpl} onChange={(e) => setEmailTpl(e.target.value)}
                  className="h-9 rounded-lg border border-line bg-cream-paper px-2.5 text-sm text-ink focus:border-coral focus:outline-none"
                >
                  {Object.entries(EMAIL_TEMPLATES).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
                </select>
                <Button size="sm" onClick={() => emailCandidate(sel)}><Mail size={15} /> Email via Gmail</Button>
              </div>
              <p className="text-xs text-muted mt-2">Opens Gmail with the message pre-filled; review and send from there.</p>
            </div>

            {/* Files */}
            {(sel.cv_path || sel.photo_path) && (
              <div className="flex flex-wrap gap-2">
                {sel.cv_path && (files.cv
                  ? <a href={files.cv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm bg-cream-100 rounded-lg px-3 py-1.5 text-ink hover:bg-cream"><FileText size={14} /> Download CV</a>
                  : <span className="inline-flex items-center gap-1.5 text-sm text-muted"><Spinner /> CV…</span>)}
                {sel.photo_path && files.photo && (
                  <a href={files.photo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm bg-cream-100 rounded-lg px-3 py-1.5 text-ink hover:bg-cream"><ImageIcon size={14} /> View photo</a>
                )}
              </div>
            )}

            {/* Answers */}
            <div className="rounded-xl border border-line bg-white p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Salesforce certified</span><span className="text-ink inline-flex items-center gap-1">{sel.salesforce_certified === true ? <Check size={14} className="text-washed-green" /> : sel.salesforce_certified === false ? <X size={14} className="text-coral-700" /> : null}{yesno(sel.salesforce_certified)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Languages</span><span className="text-ink text-right">{sel.languages || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted">NL resident</span><span className="text-ink">{yesno(sel.netherlands_resident)}</span></div>
            </div>

            {sel.cover_note && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1.5">Cover letter</div>
                <div className="rounded-xl border border-line bg-white p-4 text-sm text-ink whitespace-pre-wrap">{sel.cover_note}</div>
              </div>
            )}

            <Select label="Stage" value={sel.status || DEFAULT_STAGE} onChange={(e) => move(sel, e.target.value)}>
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
                <SegmentedTabs
                  size="sm"
                  value={descTab}
                  onChange={setDescTab}
                  options={[
                    { value: 'write', label: 'Write', icon: <Code size={14} /> },
                    { value: 'preview', label: 'Preview', icon: <Eye size={14} /> },
                  ]}
                />
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
