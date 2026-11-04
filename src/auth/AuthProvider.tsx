import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext, type AuthContextValue, type OAuthProvider } from './authContext';

const UNAVAILABLE_MESSAGE = 'El acceso no está disponible en este momento.';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user: User | null = session?.user ?? null;
    const client = supabase;

    return {
      user,
      loading,
      signInWithPassword: async (email, password) => {
        if (!client) return { error: UNAVAILABLE_MESSAGE };
        const { error } = await client.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      signUpWithPassword: async (email, password) => {
        if (!client) return { error: UNAVAILABLE_MESSAGE, needsConfirmation: false };
        const { data, error } = await client.auth.signUp({ email, password });
        if (error) return { error: error.message, needsConfirmation: false };
        return { error: null, needsConfirmation: !data.session };
      },
      signInWithOAuth: async (provider: OAuthProvider) => {
        if (!client) return { error: UNAVAILABLE_MESSAGE };
        const { error } = await client.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin },
        });
        return { error: error?.message ?? null };
      },
      signOut: async () => {
        if (!client) return { error: UNAVAILABLE_MESSAGE };
        const { error } = await client.auth.signOut();
        return { error: error?.message ?? null };
      },
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
