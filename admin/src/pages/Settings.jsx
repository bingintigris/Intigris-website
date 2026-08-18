import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Upload, Copy, Trash2, FileText, Image as ImageIcon, ExternalLink, UserPlus, Check,
  AlertCircle, Plug, KeyRound,
} from 'lucide-react';
import { Card, Badge, Button, Select, Input, Textarea, Spinner, Drawer, SegmentedTabs } from '../components/ui/index.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { ROLES } from '../lib/roles';
import { initials, timeAgo } from '../lib/format';
import {
  listUsers, updateUserRole, inviteUser, listActivity,
  listMedia, uploadMedia, deleteMedia, isImage, formatBytes,
} from '../lib/settings';
import {
  listConnectors, updateConnector, klaviyoSyncSummary, STATUSES, STATUS_TONE,
} from '../lib/connectors';

const TABS = [
  ['users', 'Users & roles'],
  ['connectors', 'Connectors'],
  ['activity', 'Activity log'],
  ['media', 'Media library'],
];

export default function Settings() {
  const [tab, setTab] = useState('users');
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h2 className="text-2xl font-medium text-ink">Settings</h2>
        <p className="text-sm text-muted mt-1">Manage access, media, connectors, and review activity.</p>
      </div>
      <SegmentedTabs value={tab} onChange={setTab} options={TABS} />
      {tab === 'users' && <Users />}
      {tab === 'media' && <Media />}
      {tab === 'connectors' && <Connectors />}
      {tab === 'activity' && <Activity />}
    </div>
  );
}

/* ---------- Users & roles ---------- */
function Users() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'support_lead' });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { email, tempPassword }

  function load() { listUsers().then(setRows); }
  useEffect(() => { load(); }, []);

  async function change(u, role) {
    setRows((prev) => prev.map((r) => (r.id === u.id ? { ...r, role } : r)));
    const { error } = await updateUserRole(u.id, role);
    if (error) toast(error.message, 'error'); else toast(`${u.full_name || u.email} is now ${ROLES[role]}.`, 'success');
  }

  function openAdd() { setForm({ full_name: '', email: '', role: 'support_lead' }); setResult(null); setAdding(true); }

  async function submitInvite() {
    if (!form.email.trim()) return toast('Enter an email.', 'error');
    setBusy(true);
    try {
      const res = await inviteUser(form);
      setResult(res);
      toast('User created.', 'success');
      load();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function copyPw() {
    try { await navigator.clipboard.writeText(result.tempPassword); toast('Password copied.', 'success'); } catch { /* ignore */ }
  }

  if (!rows) return <div className="h-40 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}><UserPlus size={16} /> Add user</Button>
      </div>
      <Card className="overflow-hidden">
      {rows.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted">No users found.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
              <th className="font-medium px-5 py-3">User</th>
              <th className="font-medium px-3 py-3">Email</th>
              <th className="font-medium px-3 py-3 w-52">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-full bg-coral text-white grid place-items-center text-xs font-medium">{initials(u.full_name || u.email)}</span>
                    <span className="text-ink">{u.full_name || '—'}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-muted">{u.email}</td>
                <td className="px-3 py-3">
                  <Select value={u.role} onChange={(e) => change(u, e.target.value)}>
                    {Object.entries(ROLES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </Card>

      <Drawer
        open={adding}
        onClose={() => setAdding(false)}
        title="Add user"
        footer={!result && (
          <Button className="w-full" onClick={submitInvite} disabled={busy}>
            {busy ? <Spinner /> : <><UserPlus size={15} /> Create user</>}
          </Button>
        )}
      >
        {result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-washed-green">
              <Check size={18} /> <span className="font-medium">User created</span>
            </div>
            <p className="text-sm text-muted">
              Share these sign-in details with <span className="text-ink">{result.email}</span>. They can change the
              password after logging in (via “Forgot password?” on the login screen).
            </p>
            <div className="rounded-xl border border-line bg-cream-100 p-4 space-y-2">
              <div className="text-sm"><span className="text-muted">Email:</span> <span className="text-ink">{result.email}</span></div>
              <div className="text-sm flex items-center gap-2">
                <span className="text-muted">Temp password:</span>
                <code className="text-ink bg-white border border-line rounded px-2 py-0.5">{result.tempPassword}</code>
                <button onClick={copyPw} className="text-coral-700 hover:text-coral inline-flex items-center gap-1 text-xs"><Copy size={13} /> Copy</button>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setAdding(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input label="Full name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Anna de Vries" />
            <Input label="Work email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="anna@intigris.nl" />
            <Select label="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              {Object.entries(ROLES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
            <p className="text-xs text-muted">A temporary password will be generated for you to share. They can reset it after first login.</p>
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ---------- Media library ---------- */
function Media() {
  const { toast } = useToast();
  const [state, setState] = useState(null); // { files, error }
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  function load() { listMedia().then(setState); }
  useEffect(() => { load(); }, []);

  async function onFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    for (const f of files) {
      const { error } = await uploadMedia(f);
      if (error) { toast(`${f.name}: ${error.message}`, 'error'); setBusy(false); return; }
    }
    setBusy(false);
    toast(`Uploaded ${files.length} file${files.length === 1 ? '' : 's'}.`, 'success');
    if (fileRef.current) fileRef.current.value = '';
    load();
  }

  async function copy(url) {
    try { await navigator.clipboard.writeText(url); toast('URL copied.', 'success'); }
    catch { toast('Copy failed — select and copy manually.', 'error'); }
  }

  async function remove(name) {
    if (!window.confirm('Delete this file?')) return;
    const { error } = await deleteMedia(name);
    if (error) return toast(error.message, 'error');
    toast('Deleted.', 'success'); load();
  }

  if (!state) return <div className="h-40 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  // Bucket missing / not set up yet.
  if (state.error && /not found|does not exist|bucket/i.test(state.error)) {
    return (
      <Card className="p-8 text-center">
        <div className="h-12 w-12 rounded-full bg-cream-100 grid place-items-center mx-auto mb-3"><ImageIcon size={22} className="text-muted" /></div>
        <h3 className="font-medium text-ink">Media bucket not set up yet</h3>
        <p className="text-sm text-muted mt-2 max-w-md mx-auto">
          In Supabase: Storage → New bucket → name it <code>media</code> → tick “Public bucket” → Create.
          Then run <code>admin/supabase/storage.sql</code>. Reload this page after.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{state.files.length} file{state.files.length === 1 ? '' : 's'}. Upload images or PDFs, then copy the URL into a blog cover or team headshot.</p>
        <input ref={fileRef} type="file" multiple onChange={onFiles} className="hidden" accept="image/*,application/pdf" />
        <Button onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? <Spinner /> : <><Upload size={16} /> Upload</>}</Button>
      </div>

      {state.files.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted">No files yet. Upload your first asset.</Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {state.files.map((f) => (
            <Card key={f.name} className="overflow-hidden">
              <div className="aspect-[4/3] bg-cream-100 grid place-items-center overflow-hidden">
                {isImage(f.type, f.name)
                  ? <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                  : <FileText size={28} className="text-muted" />}
              </div>
              <div className="p-3">
                <div className="text-xs text-ink truncate" title={f.name}>{f.name}</div>
                <div className="text-[11px] text-muted mt-0.5">{formatBytes(f.size)}</div>
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => copy(f.url)} className="inline-flex items-center gap-1 text-xs text-coral-700 hover:text-coral"><Copy size={13} /> Copy URL</button>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-muted hover:text-ink" title="Open"><ExternalLink size={14} /></a>
                  <button onClick={() => remove(f.name)} className="text-muted hover:text-coral-700" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Activity log ---------- */
const DOT = { inquiry: 'bg-coral', subscriber: 'bg-[#1f4c86]', blog: 'bg-washed-green', application: 'bg-[#7a4d0b]', system: 'bg-muted' };

/* ============================== Connectors ==============================
   A register of the external services the website and portal talk to. It
   records what is connected, what each one does, where its credential lives
   and where to manage it, so none of that has to be rediscovered from the
   code later. It does not hold any secrets itself.
   ====================================================================== */
function Connectors() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [klaviyo, setKlaviyo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    return listConnectors().then(({ rows, error }) => {
      setRows(rows);
      setLoadError(error || '');
    });
  }

  useEffect(() => {
    load();
    klaviyoSyncSummary().then(setKlaviyo);
  }, []);

  // Group by category, preserving the sort order within each.
  const groups = useMemo(() => {
    const out = new Map();
    for (const r of rows || []) {
      if (!out.has(r.category)) out.set(r.category, []);
      out.get(r.category).push(r);
    }
    return Array.from(out.entries());
  }, [rows]);

  const counts = useMemo(() => {
    const c = { connected: 0, needs_setup: 0, not_connected: 0, planned: 0 };
    for (const r of rows || []) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [rows]);

  if (!rows) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  async function save() {
    setSaving(true);
    try {
      await updateConnector(editing.id, {
        status: editing.status,
        owner: editing.owner?.trim() || null,
        setup_notes: editing.setup_notes?.trim() || null,
      });
      await load();
      toast(`${editing.name} updated.`, 'success');
      setEditing(null);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle size={20} className="text-coral mx-auto mb-3" />
        <p className="text-sm text-ink">{loadError}</p>
        <p className="text-xs text-muted mt-2">
          Supabase → SQL Editor → paste <span className="text-ink">admin/supabase/connectors.sql</span> → Run.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted max-w-xl">
          Every external service the website and this portal rely on. Secrets are never
          stored here, only a note of where each one lives.
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {counts.connected > 0 && <Badge tone="green">{counts.connected} connected</Badge>}
          {counts.needs_setup > 0 && <Badge tone="yellow">{counts.needs_setup} needs setup</Badge>}
          {counts.not_connected > 0 && <Badge tone="neutral">{counts.not_connected} not connected</Badge>}
        </div>
      </div>

      {groups.map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">{category}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((c) => (
              <Card key={c.id} className="p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-8 w-8 rounded-lg bg-cream-100 grid place-items-center shrink-0">
                      <Plug size={15} className="text-muted" />
                    </span>
                    <h4 className="font-medium text-ink truncate">{c.name}</h4>
                  </div>
                  <Badge tone={STATUS_TONE[c.status]}>
                    {(STATUSES.find(([v]) => v === c.status) || [, c.status])[1]}
                  </Badge>
                </div>

                {c.purpose && <p className="text-sm text-muted mt-3 leading-relaxed">{c.purpose}</p>}

                {/* Klaviyo's real state is already in the database, so show that
                    rather than trusting the status field to be current. */}
                {c.key === 'klaviyo' && klaviyo && (
                  <p className="text-xs text-muted mt-2.5">
                    {klaviyo.total} subscriber{klaviyo.total === 1 ? '' : 's'}
                    {klaviyo.pending > 0
                      ? <>, <span className="text-coral">{klaviyo.pending} waiting to sync</span></>
                      : klaviyo.total > 0 ? ', all synced' : ''}
                    {klaviyo.lastSync && <>, last sync {timeAgo(klaviyo.lastSync)}</>}
                  </p>
                )}

                {c.credential_location && (
                  <p className="text-xs text-muted mt-3 flex items-start gap-1.5">
                    <KeyRound size={12} className="mt-0.5 shrink-0" />
                    <span>{c.credential_location}</span>
                  </p>
                )}

                {c.setup_notes && (
                  <div className="mt-3 rounded-xl bg-cream-100 px-3.5 py-2.5 text-xs text-ink leading-relaxed">
                    {c.setup_notes}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-3">
                  <span className="text-xs text-muted truncate">
                    {c.owner ? `Owner: ${c.owner}` : 'No owner set'}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {c.console_url && (
                      <a href={c.console_url} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-coral hover:underline px-2 py-1">
                        Open <ExternalLink size={11} />
                      </a>
                    )}
                    <Button size="sm" variant="secondary" onClick={() => setEditing({ ...c })}>Edit</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing ? editing.name : ''}>
        {editing && (
          <div className="space-y-4">
            <p className="text-sm text-muted">{editing.purpose}</p>

            <Select label="Status" value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
              {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>

            <Input label="Owner" placeholder="Who looks after this?"
              value={editing.owner || ''}
              onChange={(e) => setEditing({ ...editing, owner: e.target.value })} />

            <Textarea label="Setup notes" rows={5}
              placeholder="What is left to do, or anything worth knowing."
              value={editing.setup_notes || ''}
              onChange={(e) => setEditing({ ...editing, setup_notes: e.target.value })} />

            {editing.credential_location && (
              <div className="rounded-xl border border-line bg-cream px-3.5 py-3 text-xs text-muted">
                <span className="text-ink font-medium">Credential:</span> {editing.credential_location}
              </div>
            )}

            <p className="text-xs text-muted">
              Do not paste keys or tokens here. This register is readable by every portal
              user; secrets belong in Supabase Edge Function secrets.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Button onClick={save} disabled={saving}>
                {saving ? <><Spinner className="text-white" /> Saving…</> : <><Check size={15} /> Save</>}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Activity() {
  const [rows, setRows] = useState(null);
  useEffect(() => { listActivity().then(setRows); }, []);
  if (!rows) return <div className="h-40 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;
  return (
    <Card className="p-5">
      {rows.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted">No activity recorded yet.</div>
      ) : (
        <ul className="space-y-3.5">
          {rows.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${DOT[a.kind] || 'bg-muted'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink">{a.message}</div>
                <div className="text-xs text-muted">{a.kind} · {timeAgo(a.created_at)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
