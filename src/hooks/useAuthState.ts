
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';
import { fetchUserProfile } from '@/services/authService';
import { User } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { profile, isAdmin: userIsAdmin } = await fetchUserProfile(session.user);
          setUser(profile);
          setIsAdmin(userIsAdmin);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { profile, isAdmin: userIsAdmin } = await fetchUserProfile(session.user);
          setUser(profile);
          setIsAdmin(userIsAdmin);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading, setUser };
};
