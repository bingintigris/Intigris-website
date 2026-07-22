import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, supabaseConfigured } from './supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!supabaseConfigured || !userId) { setProfile(null); return; }
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, avatar_url, email')
      .eq('id', userId)
      .single();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return; }
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) await loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
      setSession(next);
      if (next?.user) await loadProfile(next.user.id);
      else setProfile(null);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  const signIn = useCallback(async (email, password, remember) => {
    if (!supabaseConfigured) return { error: { message: 'Supabase is not configured.' } };
    // "Remember me": when off, only keep the session for this tab.
    try {
      window.localStorage.setItem('intigris.remember', remember ? '1' : '0');
    } catch { /* ignore storage errors */ }
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!supabaseConfigured) return { error: { message: 'Supabase is not configured.' } };
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabaseConfigured) return;
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = {
    session,
    user: session?.user || null,
    profile,
    role: profile?.role || null,
    loading,
    configured: supabaseConfigured,
    signIn,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
