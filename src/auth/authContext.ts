import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';

export type OAuthProvider = 'google' | 'apple' | 'facebook';

export interface AuthResult {
  error: string | null;
}

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (
    email: string,
    password: string,
  ) => Promise<AuthResult & { needsConfirmation: boolean }>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
