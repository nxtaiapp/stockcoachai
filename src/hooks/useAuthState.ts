
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';
import { fetchUserProfile } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

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
          
          // If the user was on signin or signup page, redirect to welcome dashboard
          const currentPath = window.location.pathname;
          if (currentPath === "/signin" || currentPath === "/signup") {
            navigate("/welcome");
          }
        } else {
          // No active session - ensure user state is cleared
          setUser(null);
          setIsAdmin(false);
          
          // Redirect to sign in page if on a protected route
          const currentPath = window.location.pathname;
          const publicRoutes = ["/", "/signin", "/signup", "/email-confirmation"];
          if (!publicRoutes.includes(currentPath)) {
            navigate("/signin");
          }
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
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { profile, isAdmin: userIsAdmin } = await fetchUserProfile(session.user);
            
            // Same name validation as above
            if (profile && (!profile.name || profile.name.includes('-'))) {
              profile.name = profile.email?.split('@')[0] || 'User';
            }
            
            setUser(profile);
            setIsAdmin(userIsAdmin);
            
            // Redirect to welcome page on successful sign in
            navigate("/welcome");
          } catch (error) {
            console.error("Error handling sign in:", error);
          } finally {
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear user state and redirect to sign in page
          console.log("Signed out event received");
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          navigate("/signin", { replace: true });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { user, isAdmin, loading, setUser };
};
