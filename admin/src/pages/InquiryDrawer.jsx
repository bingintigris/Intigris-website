import { useEffect, useState } from 'react';
import { Mail, Send, Clock } from 'lucide-react';
import { Drawer, Badge, Button, Select, Textarea, Spinner } from '../components/ui/index.jsx';
import { STATUSES, PRIORITIES, statusMeta, updateInquiry, listNotes, addNote, listAssignees } from '../lib/inquiries';
import { useAuth } from '../lib/auth';
import { useToast } from '../components/ui/toast.jsx';
import { formatDate, timeAgo } from '../lib/format';

export default function InquiryDrawer({ inquiry, sample, onClose, onChange }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [row, setRow] = useState(inquiry);
  const [assignees, setAssignees] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteBody, setNoteBody] = useState('');
  const [reply, setReply] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => { setRow(inquiry); }, [inquiry]);

  useEffect(() => {
    if (!inquiry) return;
    listAssignees().then(setAssignees);
    if (!sample) {
      setLoadingNotes(true);
      listNotes(inquiry.id).then((n) => { setNotes(n); setLoadingNotes(false); });
    } else {
      setNotes([]); setLoadingNotes(false);
    }
  }, [inquiry, sample]);

  // `row` is seeded from `inquiry` via the effect above, so on the first render
  // after an inquiry is selected it can still be null — guard on both.
  if (!inquiry || !row) return null;

  async function patch(field, value) {
    const next = { ...row, [field]: value };
    setRow(next);
    onChange?.(next);
    if (sample) return toast('Sample data — changes aren’t saved.', 'info');
    const { error } = await updateInquiry(inquiry.id, { [field]: value });
    if (error) toast(error.message, 'error');
    else toast('Updated.', 'success');
  }

  async function submitNote(e) {
    e.preventDefault();
    if (!noteBody.trim()) return;
    if (sample) { setNoteBody(''); return toast('Sample data — notes aren’t saved.', 'info'); }
    setSavingNote(true);
    const { error } = await addNote(inquiry.id, noteBody.trim(), user?.id);
    setSavingNote(false);
    if (error) return toast(error.message, 'error');
    setNoteBody('');
    setNotes(await listNotes(inquiry.id));
    toast('Note added.', 'success');
  }

  function sendReply() {
    const subject = encodeURIComponent(`Re: ${row.subject || 'Your enquiry'}`);
    const body = encodeURIComponent(reply || '');
    window.location.href = `mailto:${row.email}?subject=${subject}&body=${body}`;
  }

  const sm = statusMeta(row.status);

  return (
    <Drawer
      open={!!inquiry}
      onClose={onClose}
      title={row.subject || 'Inquiry'}
      footer={
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Close</Button>
          <Button className="flex-1" onClick={() => patch('status', 'resolved')} disabled={row.status === 'resolved'}>
            Mark resolved
          </Button>
        </div>
      }
    >
      {/* From */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-medium text-ink">{row.name || 'Unknown'}</div>
          <div className="text-sm text-muted">{row.company}</div>
        </div>
        <Badge tone={sm.tone}>{sm.label}</Badge>
      </div>
      <div className="mt-2 flex items-center gap-3 text-sm text-muted">
        <a href={`mailto:${row.email}`} className="inline-flex items-center gap-1.5 hover:text-coral-700">
          <Mail size={14} /> {row.email}
        </a>
        <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {formatDate(row.created_at)}</span>
      </div>
      {row.source_page && <div className="mt-1 text-xs text-muted">Submitted from {row.source_page}</div>}

      {/* Message */}
      <div className="mt-4 rounded-xl border border-line bg-white p-4 text-[15px] leading-relaxed text-ink whitespace-pre-wrap">
        {row.message}
      </div>

      {/* Controls */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Select label="Status" value={row.status} onChange={(e) => patch('status', e.target.value)}>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>
        <Select label="Priority" value={row.priority} onChange={(e) => patch('priority', e.target.value)}>
          {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </Select>
        <div className="col-span-2">
          <Select label="Assigned to" value={row.assigned_to || ''} onChange={(e) => patch('assigned_to', e.target.value || null)}>
            <option value="">Unassigned</option>
            {assignees.map((a) => <option key={a.id} value={a.id}>{a.full_name || a.email}</option>)}
          </Select>
        </div>
      </div>

      {/* Quick reply */}
      <div className="mt-6">
        <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1.5">Quick reply</div>
        <Textarea rows={3} placeholder={`Write a reply to ${row.name || 'the sender'}…`} value={reply} onChange={(e) => setReply(e.target.value)} />
        <div className="mt-2 flex items-center gap-2">
          <Button size="sm" onClick={sendReply} disabled={!reply.trim()}>
            <Send size={15} /> Send reply
          </Button>
          <span className="text-xs text-muted">Opens your email client, pre-filled.</span>
        </div>
      </div>

      {/* Internal notes */}
      <div className="mt-6">
        <div className="text-xs font-medium uppercase tracking-wide text-muted mb-2">Internal notes</div>
        <form onSubmit={submitNote} className="flex items-start gap-2">
          <input
            value={noteBody} onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Add a private note…"
            className="flex-1 h-10 rounded-xl border border-line bg-cream-paper px-3 text-sm text-ink placeholder:text-muted/60 focus:border-coral focus:outline-none"
          />
          <Button size="sm" type="submit" disabled={savingNote || !noteBody.trim()}>
            {savingNote ? <Spinner /> : 'Add'}
          </Button>
        </form>
        <ul className="mt-3 space-y-2.5">
          {loadingNotes && <li className="text-sm text-muted">Loading…</li>}
          {!loadingNotes && notes.length === 0 && <li className="text-sm text-muted">No notes yet.</li>}
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg bg-white border border-line p-3">
              <div className="text-sm text-ink whitespace-pre-wrap">{n.body}</div>
              <div className="mt-1 text-xs text-muted">
                {(assignees.find((a) => a.id === n.author_id)?.full_name) || 'Someone'} · {timeAgo(n.created_at)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  );
}
