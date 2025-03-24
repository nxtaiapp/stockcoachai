
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client if credentials are missing (for development/testing)
let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Using mock client for development.');
  // Create a mock client for development that won't cause runtime errors
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.reject(new Error('Supabase credentials not configured')),
      signInWithPassword: () => Promise.reject(new Error('Supabase credentials not configured')),
      signOut: () => Promise.reject(new Error('Supabase credentials not configured')),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null }),
          order: () => Promise.resolve({ data: [] }),
        }),
        order: () => Promise.resolve({ data: [] }),
      }),
      insert: () => Promise.reject(new Error('Supabase credentials not configured')),
      update: () => ({
        eq: () => Promise.reject(new Error('Supabase credentials not configured')),
      }),
      delete: () => ({
        eq: () => Promise.reject(new Error('Supabase credentials not configured')),
      }),
    }),
  } as unknown as SupabaseClient;
} else {
  // Create the real Supabase client when credentials are available
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

interface User {
  id: string;
  email: string;
  name: string;
  experience_level?: string;
  trading_goal?: string;
  skill_level?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, experience: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUserData: (data: Partial<User>) => void;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for the user session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        
        if (!supabaseUrl || !supabaseAnonKey) {
          toast.error("Supabase credentials not configured. Please set up your environment variables.");
          setLoading(false);
          return;
        }
        
        // Get session from supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile from the profiles table (we'll create this later)
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // Combine auth user with profile data
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.email?.split('@')[0] || '',
            experience_level: profile?.experience_level,
            trading_goal: profile?.trading_goal,
            skill_level: profile?.skill_level,
          });
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get user profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.name || session.user.email?.split('@')[0] || '',
          experience_level: profile?.experience_level,
          trading_goal: profile?.trading_goal,
          skill_level: profile?.skill_level,
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    fetchSession();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, experience: string) => {
    try {
      setLoading(true);
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create a profile record in our profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              experience_level: experience,
              created_at: new Date(),
            }
          ]);

        if (profileError) throw profileError;
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name,
          experience_level: experience,
        });
        
        toast.success("Account created successfully!");
        navigate('/onboarding');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || "Failed to create account. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.email?.split('@')[0] || '',
          experience_level: profile?.experience_level,
          trading_goal: profile?.trading_goal,
          skill_level: profile?.skill_level,
        });
        
        toast.success("Signed in successfully!");
        navigate('/chat');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || "Failed to sign out. Please try again.");
    }
  };

  const setUserData = async (data: Partial<User>) => {
    if (user) {
      try {
        // Update the user profile in the database
        const { error } = await supabase
          .from('profiles')
          .update({
            ...data,
            updated_at: new Date(),
          })
          .eq('id', user.id);

        if (error) throw error;
        
        // Update the local user state
        setUser({ ...user, ...data });
        toast.success("Profile updated successfully");
      } catch (error: any) {
        console.error('Error updating profile:', error);
        toast.error(error.message || "Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      signOut, 
      setUserData,
      supabase 
    }}>
      {!supabaseUrl || !supabaseAnonKey ? (
        <div className="flex h-screen items-center justify-center p-4 bg-destructive/10">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Configuration Error</h2>
            <p className="mb-4">
              Supabase URL and/or Anonymous Key are missing. Please set the following environment variables:
            </p>
            <ul className="text-left mb-6 bg-muted p-4 rounded">
              <li className="font-mono text-sm mb-2">VITE_SUPABASE_URL</li>
              <li className="font-mono text-sm">VITE_SUPABASE_ANON_KEY</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Note: You'll need to restart the application after setting these variables.
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
