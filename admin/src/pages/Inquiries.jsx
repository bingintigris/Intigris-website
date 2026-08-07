import { useEffect, useMemo, useState } from 'react';
import { Search, Inbox as InboxIcon, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Card, Badge, Spinner } from '../components/ui/index.jsx';
import { listInquiries, STATUSES, statusMeta } from '../lib/inquiries';
import { timeAgo } from '../lib/format';
import InquiryDrawer from './InquiryDrawer';

// Resolved inquiries live in their own collapsed section, so the main
// inbox only shows what still needs attention.
const FILTERS = [{ value: 'all', label: 'All' }, ...STATUSES.filter((s) => s.value !== 'resolved')];
const PRIO_TONE = { high: 'coral', medium: 'yellow', low: 'neutral' };

function InquiryTable({ rows, onSelect }) {
  return (
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
        {rows.map((r) => {
          const sm = statusMeta(r.status);
          return (
            <tr
              key={r.id}
              onClick={() => onSelect(r)}
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
  );
}

export default function Inquiries() {
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    listInquiries().then(({ rows, sample, error }) => {
      setRows(rows); setSample(sample); setLoadError(error || '');
    });
  }, []);

  // Split the inbox: everything still open, and everything resolved.
  const active = useMemo(() => (rows || []).filter((r) => r.status !== 'resolved'), [rows]);
  const resolved = useMemo(() => (rows || []).filter((r) => r.status === 'resolved'), [rows]);

  const counts = useMemo(() => {
    const c = { all: active.length };
    for (const s of STATUSES) c[s.value] = active.filter((r) => r.status === s.value).length;
    return c;
  }, [active]);

  const matchesSearch = (r) => {
    if (!q.trim()) return true;
    const t = q.toLowerCase();
    return [r.name, r.company, r.email, r.subject, r.message]
      .filter(Boolean).some((v) => v.toLowerCase().includes(t));
  };

  const visible = useMemo(() => {
    let list = active;
    if (filter !== 'all') list = list.filter((r) => r.status === filter);
    return list.filter(matchesSearch);
  }, [active, filter, q]);

  const visibleResolved = useMemo(() => resolved.filter(matchesSearch), [resolved, q]);

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
            {loadError ? (
              <>
                <p className="text-sm text-ink font-medium">Couldn’t load inquiries.</p>
                <p className="text-sm text-muted mt-1">{loadError}</p>
              </>
            ) : active.length === 0 ? (
              <>
                <p className="text-sm text-ink font-medium">
                  {resolved.length > 0 ? 'Nothing open right now.' : 'No inquiries yet.'}
                </p>
                <p className="text-sm text-muted mt-1">
                  {resolved.length > 0
                    ? 'All inquiries are resolved. You’ll find them under “Resolved cases” below.'
                    : 'New “Let’s talk” submissions from the website will appear here automatically.'}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">No inquiries match this view.</p>
            )}
          </div>
        ) : (
          <InquiryTable rows={visible} onSelect={setSelected} />
        )}
      </Card>

      {/* Resolved cases: collapsed by default */}
      {resolved.length > 0 && (
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowResolved((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-cream-100 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <CheckCircle2 size={17} className="text-washed-green" />
              <span className="font-medium text-ink">Resolved cases</span>
              <span className="text-sm text-muted">({resolved.length})</span>
            </span>
            <ChevronDown
              size={18}
              className={`text-muted transition-transform ${showResolved ? 'rotate-180' : ''}`}
            />
          </button>

          {showResolved && (
            <div className="border-t border-line">
              {visibleResolved.length === 0 ? (
                <p className="text-sm text-muted px-5 py-6">No resolved cases match your search.</p>
              ) : (
                <InquiryTable rows={visibleResolved} onSelect={setSelected} />
              )}
            </div>
          )}
        </Card>
      )}

      <InquiryDrawer
        inquiry={selected}
        sample={sample}
        onClose={() => setSelected(null)}
        onChange={applyLocalChange}
      />
    </div>
  );
}
