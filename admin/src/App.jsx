import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './components/ui/toast.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';

// Wraps a page in the shell + module-level access control.
function Guarded({ module, children }) {
  return (
    <ProtectedRoute module={module}>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={<Guarded module="dashboard"><Dashboard /></Guarded>} />
            <Route path="/inquiries" element={<Guarded module="inquiries"><Placeholder title="Lead & Contact Inquiry Manager" /></Guarded>} />
            <Route path="/newsletter" element={<Guarded module="newsletter"><Placeholder title="Newsletter Subscriber Hub" /></Guarded>} />
            <Route path="/blog" element={<Guarded module="blog"><Placeholder title="Blog Content Management" /></Guarded>} />
            <Route path="/hr" element={<Guarded module="hr"><Placeholder title="HR & Team Management" /></Guarded>} />
            <Route path="/settings" element={<Guarded module="settings"><Placeholder title="Media Library & Settings" /></Guarded>} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
