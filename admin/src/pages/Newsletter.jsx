import { useEffect, useMemo, useState } from 'react';
import { Search, Download, Mail, Users, Send } from 'lucide-react';
import { Card, Badge, Button, Input, Textarea, Spinner } from '../components/ui/index.jsx';
import { listSubscribers, exportSubscribersCsv } from '../lib/newsletter';
import { useToast } from '../components/ui/toast.jsx';
import { formatDate } from '../lib/format';

export default function Newsletter() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [q, setQ] = useState('');
  const [source, setSource] = useState('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => { listSubscribers().then(({ rows, sample }) => { setRows(rows); setSample(sample); }); }, []);

  const sources = useMemo(() => {
    const set = new Set((rows || []).map((r) => r.source_page || '—'));
    return ['all', ...Array.from(set)];
  }, [rows]);

  const visible = useMemo(() => {
    let list = rows || [];
    if (source !== 'all') list = list.filter((r) => (r.source_page || '—') === source);
    if (q.trim()) list = list.filter((r) => r.email.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [rows, q, source]);

  if (!rows) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  function doExport() {
    exportSubscribersCsv(visible);
    toast(`Exported ${visible.length} subscriber${visible.length === 1 ? '' : 's'} to CSV.`, 'success');
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-medium text-ink">Newsletter</h2>
          <p className="text-sm text-muted mt-1">
            {rows.length} subscriber{rows.length === 1 ? '' : 's'}.
            {sample && <span className="ml-2 inline-flex"><Badge tone="yellow">Sample data</Badge></span>}
          </p>
        </div>
        <Button onClick={doExport}><Download size={16} /> Export CSV</Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Directory */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-line rounded-full px-3.5 h-10 flex-1 min-w-[180px]">
              <Search size={16} className="text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email…"
                className="bg-transparent text-sm outline-none flex-1 text-ink placeholder:text-muted/60" />
            </div>
            <select value={source} onChange={(e) => setSource(e.target.value)}
              className="h-10 rounded-full border border-line bg-white px-3.5 text-sm text-ink focus:border-coral focus:outline-none">
              {sources.map((s) => <option key={s} value={s}>{s === 'all' ? 'All sources' : s}</option>)}
            </select>
          </div>

          <Card className="overflow-hidden">
            {visible.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted">No subscribers match this view.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
                    <th className="font-medium px-5 py-3">Email</th>
                    <th className="font-medium px-3 py-3">Source</th>
                    <th className="font-medium px-3 py-3 text-right whitespace-nowrap">Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="px-5 py-3 text-ink">
                        <span className="inline-flex items-center gap-2"><Mail size={14} className="text-muted" /> {r.email}</span>
                      </td>
                      <td className="px-3 py-3"><Badge tone="neutral">{r.source_page || '—'}</Badge></td>
                      <td className="px-3 py-3 text-right text-muted whitespace-nowrap">{formatDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* Broadcast composer */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-ink">Broadcast composer</h3>
            </div>
            <p className="text-xs text-muted mb-4 inline-flex items-center gap-1.5">
              <Users size={13} /> {visible.length} recipient{visible.length === 1 ? '' : 's'} in current view
            </p>

            <div className="space-y-3">
              <Input label="Subject" placeholder="A short, clear subject line" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Textarea label="Message" rows={6} placeholder="Write your update…" value={body} onChange={(e) => setBody(e.target.value)} />
            </div>

            {/* Live preview */}
            <div className="mt-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1.5">Preview</div>
              <div className="rounded-xl border border-line overflow-hidden">
                <div className="bg-brown text-cream px-4 py-3 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-md bg-coral grid place-items-center text-white text-xs font-semibold">i</span>
                  <span className="text-sm">Intigris</span>
                </div>
                <div className="bg-white p-4">
                  <div className="text-base font-medium text-ink">{subject || 'Your subject line'}</div>
                  <div className="mt-2 text-sm text-ink whitespace-pre-wrap min-h-[60px]">
                    {body || 'Your message will appear here as you type.'}
                  </div>
                  <div className="mt-4 pt-3 border-t border-line text-xs text-muted">
                    Intigris · Kraanspoor 42, Amsterdam · Unsubscribe
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button disabled={!subject.trim() || !body.trim()}
                onClick={() => toast('Draft ready. Connecting an email service will enable sending.', 'info')}>
                <Send size={15} /> Prepare send
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Composing + preview work now. Actually sending needs an email service
              (e.g. Resend or Mailchimp) — a later add-on.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
