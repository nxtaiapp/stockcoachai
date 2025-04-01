
import type { UserProfile } from '@/lib/types';
import { AuthError } from '@supabase/supabase-js';

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (
    email: string, 
    password: string, 
    name: string, 
    experience: string,
    tradingGoal: string,
    skillLevel: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUserData: (data: Partial<UserProfile>) => Promise<void>;
}

export type AuthActionError = AuthError | Error | unknown;
