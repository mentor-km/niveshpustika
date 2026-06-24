import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isAdminUser, updateLastActive, ensureProfile } from '@/lib/supabase';

const AuthContext = createContext(null);

async function bootstrapSessionUser(session) {
  if (!session?.user?.id) return;
  try {
    await ensureProfile(session.user);
    await updateLastActive(session.user.id);
  } catch {
    // Profile bootstrap is best-effort; RLS or network may fail transiently.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySession = (nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      void bootstrapSessionUser(nextSession);
    };

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      applySession(currentSession);
      if (mounted) setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
      if (mounted) setLoading(false);
    });

    const loadingTimeout = window.setTimeout(() => {
      if (mounted) setLoading(false);
    }, 10_000);

    return () => {
      mounted = false;
      window.clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAdmin: isAdminUser(user),
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
