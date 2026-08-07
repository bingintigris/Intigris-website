import { useEffect, useMemo, useState } from 'react';
import { Search, Download, Mail, Users, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '../components/ui/index.jsx';
import { listSubscribers, exportSubscribersCsv, syncToKlaviyo } from '../lib/newsletter';
import { useToast } from '../components/ui/toast.jsx';
import { formatDate } from '../lib/format';

export default function Newsletter() {
  const { toast } = useToast();
  const [rows, setRows] = useState(null);
  const [sample, setSample] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [q, setQ] = useState('');
  const [source, setSource] = useState('all');
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');

  function load() {
    return listSubscribers().then(({ rows, sample, error }) => {
      setRows(rows); setSample(sample); setLoadError(error || '');
    });
  }

  useEffect(() => { load(); }, []);

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

  // Klaviyo state, derived from the sync stamp on each row.
  const pending = useMemo(() => (rows || []).filter((r) => !r.klaviyo_synced_at), [rows]);
  const lastSync = useMemo(() => {
    const stamps = (rows || []).map((r) => r.klaviyo_synced_at).filter(Boolean).sort();
    return stamps.length ? stamps[stamps.length - 1] : null;
  }, [rows]);

  if (!rows) return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;

  function doExport() {
    exportSubscribersCsv(visible);
    toast(`Exported ${visible.length} subscriber${visible.length === 1 ? '' : 's'} to CSV.`, 'success');
  }

  async function doSync(all = false) {
    setSyncing(true); setSyncError('');
    try {
      const res = await syncToKlaviyo({ all });
      await load();
      if (res?.synced) {
        toast(`Sent ${res.synced} subscriber${res.synced === 1 ? '' : 's'} to Klaviyo.`, 'success');
      } else {
        toast(res?.message || 'Klaviyo is already up to date.', 'info');
      }
      if (res?.warnings?.length) setSyncError(res.warnings[0]);
    } catch (e) {
      setSyncError(e.message);
      toast('Sync to Klaviyo failed.', 'error');
    } finally {
      setSyncing(false);
    }
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
              <div className="p-12 text-center text-sm text-muted">
                {loadError
                  ? <>Could not load subscribers. <span className="text-ink">{loadError}</span></>
                  : rows.length === 0
                    ? 'No sign-ups yet. New subscribers from the website appear here automatically.'
                    : 'No subscribers match this view.'}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
                    <th className="font-medium px-5 py-3">Email</th>
                    <th className="font-medium px-3 py-3">Source</th>
                    <th className="font-medium px-3 py-3">Klaviyo</th>
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
                      <td className="px-3 py-3">
                        {r.klaviyo_synced_at
                          ? <span className="inline-flex items-center gap-1.5 text-xs text-muted"><CheckCircle2 size={13} className="text-green-600" /> Synced</span>
                          : <Badge tone="coral">Pending</Badge>}
                      </td>
                      <td className="px-3 py-3 text-right text-muted whitespace-nowrap">{formatDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* Klaviyo sync */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-ink">Klaviyo</h3>
              {pending.length === 0 && rows.length > 0 && (
                <Badge tone="green">In sync</Badge>
              )}
            </div>
            <p className="text-sm text-muted">
              Push these subscribers to your Klaviyo <span className="text-ink">Newsletter</span> list.
              Campaigns are then written and sent from Klaviyo.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line bg-white px-4 py-3">
                <div className="text-2xl font-medium text-ink">{rows.length}</div>
                <div className="text-xs text-muted mt-0.5 inline-flex items-center gap-1.5">
                  <Users size={12} /> total subscribers
                </div>
              </div>
              <div className="rounded-xl border border-line bg-white px-4 py-3">
                <div className={`text-2xl font-medium ${pending.length ? 'text-coral' : 'text-ink'}`}>{pending.length}</div>
                <div className="text-xs text-muted mt-0.5">waiting to sync</div>
              </div>
            </div>

            <div className="mt-3 text-xs text-muted">
              {lastSync
                ? <>Last sync {formatDate(lastSync)}.</>
                : <>Nothing has been sent to Klaviyo yet.</>}
            </div>

            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Button onClick={() => doSync(false)} disabled={syncing || pending.length === 0}>
                {syncing
                  ? <><Spinner className="text-white" /> Syncing…</>
                  : <><RefreshCw size={15} /> Sync {pending.length || ''} to Klaviyo</>}
              </Button>
              <Button variant="ghost" onClick={() => doSync(true)} disabled={syncing || rows.length === 0}>
                Re-sync all
              </Button>
            </div>

            {syncError && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-coral/30 bg-coral/5 px-3.5 py-3 text-xs text-ink">
                <AlertCircle size={14} className="text-coral mt-0.5 shrink-0" />
                <span>{syncError}</span>
              </div>
            )}

            {!syncError && pending.length === 0 && rows.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                <CheckCircle2 size={14} className="text-green-600" />
                Every subscriber is in Klaviyo.
              </div>
            )}

            <a href="https://www.klaviyo.com/lists" target="_blank" rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-coral hover:underline">
              Open Klaviyo lists <ExternalLink size={12} />
            </a>

            <p className="mt-4 pt-3 border-t border-line text-xs text-muted">
              Sync only adds and updates people, it never deletes. Unsubscribes are
              handled in Klaviyo.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
