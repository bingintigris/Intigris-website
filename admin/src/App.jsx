import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './components/ui/toast.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Inquiries from './pages/Inquiries';
import Newsletter from './pages/Newsletter';
import Blog from './pages/Blog';
import Recruitment from './pages/Recruitment';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';

// Wraps a page in the shell + module-level access control.
function Guarded({ module, children }) {
  return (
    <ProtectedRoute module={module}>
      <AppShell><ErrorBoundary>{children}</ErrorBoundary></AppShell>
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
            <Route path="/inquiries" element={<Guarded module="inquiries"><Inquiries /></Guarded>} />
            <Route path="/newsletter" element={<Guarded module="newsletter"><Newsletter /></Guarded>} />
            <Route path="/blog" element={<Guarded module="blog"><Blog /></Guarded>} />
            <Route path="/recruitment" element={<Guarded module="recruitment"><Recruitment /></Guarded>} />
            <Route path="/team" element={<Guarded module="team"><Team /></Guarded>} />
            {/* legacy path -> recruitment */}
            <Route path="/hr" element={<Navigate to="/recruitment" replace />} />
            <Route path="/settings" element={<Guarded module="settings"><Settings /></Guarded>} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
