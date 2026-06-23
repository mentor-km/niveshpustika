import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isAdminUser, updateLastActive } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      if (nextSession?.user?.id) {
        updateLastActive(nextSession.user.id).catch(() => {});
      }
    });

    return () => subscription.unsubscribe();
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
