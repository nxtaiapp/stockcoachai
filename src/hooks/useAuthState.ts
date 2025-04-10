
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';
import { fetchUserProfile } from '@/services/authService';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuthState = () => {
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
          const { profile, isAdmin: userIsAdmin } = await fetchUserProfile(session.user);
          
          // Ensure the profile has a proper name, not an ID
          if (profile && (!profile.name || profile.name.includes('-'))) {
            // If name is missing or looks like a UUID, use email or a fallback
            profile.name = profile.email?.split('@')[0] || 'User';
          }
          
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
          
          // Same name validation as above
          if (profile && (!profile.name || profile.name.includes('-'))) {
            profile.name = profile.email?.split('@')[0] || 'User';
          }
          
          setUser(profile);
          setIsAdmin(userIsAdmin);

          // Handle newly signed in user or session changes
          if (event === 'SIGNED_IN') {
            // If profile exists but doesn't have experience_level, direct to onboarding
            if (profile && !profile.experience_level) {
              navigate('/onboarding');
            } else {
              // User has completed onboarding, direct to dashboard
              navigate('/welcome');
            }
          }
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
  }, [navigate]);

  return { user, isAdmin, loading, setUser };
};
