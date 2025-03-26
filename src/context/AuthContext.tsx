
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/supabase';
import { AuthError, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, name: string, experience: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUserData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error("Authentication error. Please try again.");
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from profiles table
  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createProfile(authUser);
          return;
        }
        
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (data) {
        setUser(data as UserProfile);
        
        // Check if user has admin role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authUser.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        setIsAdmin(roleData?.role === 'admin');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    }
  };
  
  // Create a profile if one doesn't exist
  const createProfile = async (authUser: User) => {
    try {
      const userData = authUser.user_metadata || {};
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: userData.name || userData.full_name || authUser.email?.split('@')[0] || 'User',
          experience_level: userData.experience_level || 'beginner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating profile:', error);
        setUser(null);
        setLoading(false); // Make sure to set loading to false on error
        return;
      }
      
      // Fetch the profile again after creation
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (profile) {
        setUser(profile as UserProfile);
      } else {
        setUser(null);
      }
      
      setLoading(false); // Make sure to set loading to false after creating profile
    } catch (error) {
      console.error('Error in createProfile:', error);
      setUser(null);
      setLoading(false); // Make sure to set loading to false on error
    }
  };

  const signUp = async (email: string, password: string, name: string, experience: string) => {
    try {
      setLoading(true);
      
      // Create user in Supabase Auth
      const { data: { user: authUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            experience_level: experience
          }
        }
      });

      if (error) throw error;
      if (!authUser) throw new Error('User creation failed');

      // Get the newly created session to use the session token for profile creation
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        // Create profile in profiles table using the session token
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            email: email,
            name: name,
            experience_level: experience,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw here - the auth user was created successfully
        }
      }

      toast.success("Account created successfully!");
      navigate('/onboarding');
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!authUser) throw new Error('Sign in failed');

      // Success toast and navigation is done here after authentication
      toast.success("Signed in successfully!");
      navigate('/chat');
      
      // Note: The profile fetching is handled by the auth state change listener
      // So we don't need to navigate here or fetch the profile manually
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign in. Please check your credentials.");
      }
      setLoading(false); // Explicitly set loading to false on error
      throw error;
    }
    // No finally block here - loading state will be updated by the auth state change listener
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setUserData = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Update user profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser({ ...user, ...data });
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error("Failed to update profile data");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUp, signIn, signOut, setUserData }}>
      {children}
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
