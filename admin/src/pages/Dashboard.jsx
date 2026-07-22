import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Inbox, FileText, Briefcase, ArrowUpRight, PenSquare,
  UserPlus, Download, AlertCircle, Circle,
} from 'lucide-react';
import { getDashboardData } from '../lib/db';
import { useAuth } from '../lib/auth';
import { Card, Badge, Button, Spinner } from '../components/ui/index.jsx';
import { timeAgo } from '../lib/format';

const KPIS = [
  { key: 'subscribers', label: 'Newsletter subscribers', icon: Users, tone: 'text-[#1f4c86]' },
  { key: 'inquiriesNew', label: 'Pending inquiries', icon: Inbox, tone: 'text-coral-700' },
  { key: 'blogPublished', label: 'Published posts', icon: FileText, tone: 'text-washed-green' },
  { key: 'applicationsActive', label: 'Active applications', icon: Briefcase, tone: 'text-[#7a4d0b]' },
];

const ACTIVITY_DOT = {
  inquiry: 'bg-coral', subscriber: 'bg-[#1f4c86]', blog: 'bg-washed-green', application: 'bg-[#7a4d0b]',
};

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => { getDashboardData().then(setData); }, []);

  if (!data) {
    return <div className="h-64 grid place-items-center text-muted"><Spinner className="text-coral" /></div>;
  }

  const firstName = (profile?.full_name || '').split(' ')[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-ink">
          {firstName ? `Good to see you, ${firstName}.` : 'Executive dashboard'}
        </h2>
        <p className="text-sm text-muted mt-1">
          Here’s what’s happening across the business today.
          {data.usingSample && (
            <span className="ml-2 inline-flex"><Badge tone="yellow">Sample data</Badge></span>
          )}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(({ key, label, icon: Icon, tone }) => (
          <Card key={key} className="p-5">
            <div className="flex items-start justify-between">
              <Icon size={20} className={tone} />
            </div>
            <div className="mt-3 text-3xl font-medium text-ink tabular-nums">
              {Number(data.counts[key] ?? 0).toLocaleString('en-GB')}
            </div>
            <div className="text-sm text-muted mt-0.5">{label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Requires follow-up */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-coral-700" />
              <h3 className="font-medium text-ink">Requires follow-up</h3>
            </div>
            <button onClick={() => navigate('/inquiries')} className="text-sm text-coral-700 hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <ul className="divide-y divide-line">
            {data.followUps.length === 0 && (
              <li className="py-6 text-center text-sm text-muted">Nothing needs attention. Nice.</li>
            )}
            {data.followUps.map((f) => (
              <li key={f.id} className="py-3 flex items-center gap-3">
                <Circle size={8} className={`shrink-0 fill-current ${f.priority === 'high' ? 'text-coral' : 'text-[#c9a24a]'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-ink truncate">{f.title}</div>
                  <div className="text-xs text-muted">{f.meta}</div>
                </div>
                <Badge tone={f.priority === 'high' ? 'coral' : 'yellow'}>
                  {f.priority === 'high' ? 'High' : 'Medium'}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        {/* Quick actions */}
        <Card className="p-5">
          <h3 className="font-medium text-ink mb-4">Quick actions</h3>
          <div className="space-y-2.5">
            <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/blog')}>
              <PenSquare size={16} /> New blog post
            </Button>
            <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/hr')}>
              <UserPlus size={16} /> Add consultant profile
            </Button>
            <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/newsletter')}>
              <Download size={16} /> Export subscribers
            </Button>
          </div>
        </Card>
      </div>

      {/* Activity feed */}
      <Card className="p-5">
        <h3 className="font-medium text-ink mb-4">Recent activity</h3>
        <ul className="space-y-3.5">
          {data.activity.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${ACTIVITY_DOT[a.kind] || 'bg-muted'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink">{a.text}</div>
                <div className="text-xs text-muted">{timeAgo(a.at)}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
