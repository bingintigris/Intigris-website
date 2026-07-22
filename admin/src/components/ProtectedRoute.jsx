import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { canAccess } from '../lib/roles';
import { Spinner } from './ui/index.jsx';

export default function ProtectedRoute({ children, module }) {
  const { session, loading, role, configured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-full grid place-items-center text-muted">
        <Spinner className="text-coral" />
      </div>
    );
  }

  // Not signed in (or Supabase not set up) -> go to login.
  if (!configured || !session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Signed in but role lacks access to this module.
  if (module && role && !canAccess(module, role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
