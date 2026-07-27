import { useEffect, useRef, useState } from 'react';
import { Upload, Copy, Trash2, FileText, Image as ImageIcon, ExternalLink, UserPlus, Check } from 'lucide-react';
import { Card, Badge, Button, Select, Input, Spinner, Drawer } from '../components/ui/index.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { ROLES } from '../lib/roles';
import { initials, timeAgo } from '../lib/format';
import {
  listUsers, updateUserRole, inviteUser, listActivity,
  listMedia, uploadMedia, deleteMedia, isImage, formatBytes,
} from '../lib/settings';

const TABS = [['users', 'Users & roles'], ['media', 'Media library'], ['activity', 'Activity log']];

export default function Settings() {
  const [tab, setTab] = useState('users');
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h2 className="text-2xl font-medium text-ink">Settings</h2>
        <p className="text-sm text-muted mt-1">Manage access, media, and review activity.</p>
      </div>
      <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1 w-fit">
        {TABS.map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === v ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'users' && <Users />}
      {tab === 'media' && <Media />}
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
