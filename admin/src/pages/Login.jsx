import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Button, Input, Spinner } from '../components/ui/index.jsx';
import { useToast } from '../components/ui/toast.jsx';

export default function Login() {
  const { signIn, resetPassword, configured } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'reset'

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    if (mode === 'reset') {
      const { error } = await resetPassword(email);
      setBusy(false);
      if (error) return toast(error.message, 'error');
      toast('Password reset link sent — check your inbox.', 'success');
      setMode('login');
      return;
    }
    const { error } = await signIn(email, password, remember);
    setBusy(false);
    if (error) return toast(error.message, 'error');
    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-full grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-brown text-cream p-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-coral grid place-items-center font-semibold text-white">i</div>
          <span className="text-lg font-medium">Intigris</span>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-coral mb-4">Admin Portal</div>
          <h2 className="text-4xl font-medium leading-[1.05] tracking-tight">
            Smarten up<br />your business.
          </h2>
          <p className="mt-4 text-cream/70 max-w-sm">
            One place for inquiries, subscribers, content, and your team.
          </p>
        </div>
        <div className="text-xs text-cream/50">Salesforce Consulting Partner · Since 2010</div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-coral grid place-items-center font-semibold text-white">i</div>
            <span className="text-lg font-medium text-ink">Intigris Admin</span>
          </div>

          <h1 className="text-2xl font-medium text-ink">
            {mode === 'login' ? 'Welcome back.' : 'Reset your password.'}
          </h1>
          <p className="text-sm text-muted mt-1.5">
            {mode === 'login'
              ? 'Sign in to the admin portal.'
              : 'Enter your email and we’ll send a reset link.'}
          </p>

          {!configured && (
            <div className="mt-5 rounded-xl border border-[#faedd6] bg-[#fdf3e0] px-4 py-3 text-sm text-[#7a4d0b]">
              Supabase isn’t configured yet. Add <code>VITE_SUPABASE_URL</code> and
              <code> VITE_SUPABASE_ANON_KEY</code> to enable login.
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Input
              label="Work email" type="email" required autoComplete="email"
              placeholder="you@intigris.nl" value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {mode === 'login' && (
              <Input
                label="Password" type="password" required autoComplete="current-password"
                placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                  <input
                    type="checkbox" checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-line text-coral focus:ring-coral"
                  />
                  Remember me
                </label>
                <button type="button" onClick={() => setMode('reset')} className="text-sm text-coral-700 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? <Spinner /> : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Send reset link'}
                  <ArrowRight size={18} />
                </>
              )}
            </Button>

            {mode === 'reset' && (
              <button type="button" onClick={() => setMode('login')} className="w-full text-center text-sm text-muted hover:text-ink">
                Back to sign in
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
