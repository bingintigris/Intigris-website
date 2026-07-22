import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { Button, Input, Spinner } from '../components/ui/index.jsx';
import { useToast } from '../components/ui/toast.jsx';

// Reached via the reset link emailed by Supabase. Supabase places a recovery
// session in the URL; detectSessionInUrl (see supabase.js) picks it up, so the
// user can set a new password here.
export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirm) return toast('Passwords don’t match.', 'error');
    if (password.length < 8) return toast('Use at least 8 characters.', 'error');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast(error.message, 'error');
    toast('Password updated. You can sign in now.', 'success');
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-full grid place-items-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-medium text-ink">Set a new password.</h1>
        <p className="text-sm text-muted mt-1.5">Choose a strong password you don’t use elsewhere.</p>

        {!supabaseConfigured && (
          <div className="mt-5 rounded-xl border border-[#faedd6] bg-[#fdf3e0] px-4 py-3 text-sm text-[#7a4d0b]">
            Supabase isn’t configured yet.
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input label="New password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <Input label="Confirm password" type="password" required value={confirm}
            onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <Spinner /> : (<>Update password <ArrowRight size={18} /></>)}
          </Button>
        </form>
      </div>
    </div>
  );
}
