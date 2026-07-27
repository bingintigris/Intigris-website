import { useEffect, useMemo, useState } from 'react';
import { Search, Inbox as InboxIcon } from 'lucide-react';
import { Card, Badge, Spinner } from '../components/ui/index.jsx';
import { listInquiries, STATUSES, statusMeta } from '../lib/inquiries';
import { timeAgo } from '../lib/format';
import InquiryDrawer from './InquiryDrawer';

const FILTERS = [{ value: 'all', label: 'All' }, ...STATUSES];
const PRIO_TONE = { high: 'coral', medium: 'yellow', low: 'neutral' };

export default function Inquiries() {
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => { listInquiries().then(({ rows, sample }) => { setRows(rows); setSample(sample); }); }, []);

  const counts = useMemo(() => {
    const c = { all: rows?.length || 0 };
    for (const s of STATUSES) c[s.value] = (rows || []).filter((r) => r.status === s.value).length;
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    let list = rows || [];
    if (filter !== 'all') list = list.filter((r) => r.status === filter);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((r) =>
        [r.name, r.company, r.email, r.subject, r.message].filter(Boolean).some((v) => v.toLowerCase().includes(t))
      );
    }
    return list;
  }, [rows, filter, q]);

  function applyLocalChange(next) {
    setRows((prev) => (prev || []).map((r) => (r.id === next.id ? next : r)));
  }

  if (!rows) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-medium text-ink">Inquiries</h2>
          <p className="text-sm text-muted mt-1">
            “Let’s talk” submissions from the website.
            {sample && <span className="ml-2 inline-flex"><Badge tone="yellow">Sample data</Badge></span>}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-line rounded-full px-3.5 h-10 w-64 max-w-full">
          <Search size={16} className="text-muted" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search inquiries…"
            className="bg-transparent text-sm outline-none flex-1 text-ink placeholder:text-muted/60"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm border transition-colors ${
              filter === f.value ? 'bg-brown text-cream border-brown' : 'bg-white text-ink border-line hover:bg-cream-100'
            }`}
          >
            {f.label}
            <span className={`text-xs ${filter === f.value ? 'text-cream/70' : 'text-muted'}`}>{counts[f.value] ?? 0}</span>
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {visible.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-12 w-12 rounded-full bg-cream-100 grid place-items-center mx-auto mb-3">
              <InboxIcon size={22} className="text-muted" />
            </div>
            <p className="text-sm text-muted">No inquiries match this view.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
                <th className="font-medium px-5 py-3">From</th>
                <th className="font-medium px-3 py-3">Subject</th>
                <th className="font-medium px-3 py-3">Priority</th>
                <th className="font-medium px-3 py-3">Status</th>
                <th className="font-medium px-3 py-3 text-right whitespace-nowrap">Received</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const sm = statusMeta(r.status);
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="border-b border-line last:border-0 hover:bg-cream-100 cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-ink">{r.name || 'Unknown'}</div>
                      <div className="text-xs text-muted">{r.company || r.email}</div>
                    </td>
                    <td className="px-3 py-3.5 text-ink max-w-xs truncate">{r.subject}</td>
                    <td className="px-3 py-3.5"><Badge tone={PRIO_TONE[r.priority] || 'neutral'}>{r.priority}</Badge></td>
                    <td className="px-3 py-3.5"><Badge tone={sm.tone}>{sm.label}</Badge></td>
                    <td className="px-3 py-3.5 text-right text-muted whitespace-nowrap">{timeAgo(r.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <InquiryDrawer
        inquiry={selected}
        sample={sample}
        onClose={() => setSelected(null)}
        onChange={applyLocalChange}
      />
    </div>
  );
}
