import { Construction } from 'lucide-react';
import { Card } from '../components/ui/index.jsx';

export default function Placeholder({ title }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-10 text-center">
        <div className="h-12 w-12 rounded-full bg-cream-100 grid place-items-center mx-auto mb-4">
          <Construction size={22} className="text-coral-700" />
        </div>
        <h2 className="text-xl font-medium text-ink">{title}</h2>
        <p className="text-sm text-muted mt-2 max-w-md mx-auto">
          This module is part of the roadmap and will be built next. The navigation,
          access control, and layout are already wired up.
        </p>
      </Card>
    </div>
  );
}
