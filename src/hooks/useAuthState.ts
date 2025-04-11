
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';
import { fetchUserProfile } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

export const useAuthState = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();

  // Handle user profile data processing in one place
  const processUserProfile = useCallback(async (session: any) => {
    if (!session?.user) {
      setUser(null);
      setIsAdmin(false);
      return false;
    }

    try {
      const { profile, isAdmin: userIsAdmin } = await fetchUserProfile(session.user);
      
      // Ensure the profile has a proper name, not an ID
      if (profile && (!profile.name || profile.name.includes('-'))) {
        // If name is missing or looks like a UUID, use email or a fallback
        profile.name = profile.email?.split('@')[0] || 'User';
      }
      
      setUser(profile);
      setIsAdmin(userIsAdmin);
      return true;
    } catch (error) {
      console.error('Error processing user profile:', error);
      return false;
    }
  }, []);

  // Determine if current path is public or requires authentication
  const isPublicPath = useCallback((path: string) => {
    const publicRoutes = ["/", "/signin", "/signup", "/email-confirmation"];
    return publicRoutes.includes(path);
  }, []);

  // Handle navigation based on auth state
  const handleAuthNavigation = useCallback((isAuthenticated: boolean) => {
    const currentPath = window.location.pathname;
    
    if (isAuthenticated) {
      if (currentPath === "/signin" || currentPath === "/signup") {
        navigate("/welcome");
      }
    } else {
      if (!isPublicPath(currentPath)) {
        navigate("/signin");
      }
    }
  }, [navigate, isPublicPath]);

  // Initialize auth state from Supabase session
  useEffect(() => {
    let isActive = true; // For preventing state updates after unmount

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isActive) {
          const profileLoaded = await processUserProfile(session);
          
          // Update navigation based on authentication status
          handleAuthNavigation(!!profileLoaded);
          
          setSessionChecked(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isActive) {
          setUser(null);
          setIsAdmin(false);
          handleAuthNavigation(false);
          setSessionChecked(true);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (!isActive) return; // Prevent state updates after unmount
        
        if (event === 'SIGNED_IN') {
          setLoading(true);
          const profileLoaded = await processUserProfile(session);
          setLoading(false);
          
          if (profileLoaded) {
            // Redirect to welcome page on successful sign in
            navigate("/welcome");
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear user state and redirect to sign in page
          console.log("Signed out event received");
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          
          // Avoid unnecessary navigation if already on a public route
          if (!isPublicPath(window.location.pathname)) {
            navigate("/signin", { replace: true });
          }
        }
      }
    );

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [navigate, processUserProfile, handleAuthNavigation, isPublicPath]);

  return { 
    user, 
    isAdmin, 
    loading, 
    setUser,
    sessionChecked 
  };
};
