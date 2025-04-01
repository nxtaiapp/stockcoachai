
import { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import type { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  updateUserProfile 
} from '@/services/authService';
import { AuthError } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, setUser } = useAuthState();
  const navigate = useNavigate();

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    experience: string,
    tradingStyle: string,
    skillLevel: string
  ) => {
    try {
      await signUpUser(email, password, name, experience, tradingStyle, skillLevel);
      toast.success("Account created successfully!");
      navigate('/chat');
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInUser(email, password);
      // Success toast and navigation is done after authentication state changes
      // The profile fetching is handled by the auth state change listener
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign in. Please check your credentials.");
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Even if there's no active session, we'll always clear local state
      // This ensures the user is signed out from the application perspective
      setUser(null);
      
      // Then try to sign out from Supabase
      await signOutUser();
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      
      // If we already cleared the local state, we can still consider this a successful sign out
      // from the user's perspective, even if the backend failed
      if (error instanceof AuthError && error.message.includes('session')) {
        // The user is effectively signed out locally, so still show success and redirect
        toast.success("Signed out successfully");
        navigate('/');
      } else {
        toast.error("There was an issue during sign out, but you've been logged out of this device");
        navigate('/');
      }
    }
  };

  const setUserData = async (data: Partial<typeof user>) => {
    if (!user) return;

    try {
      console.log("Updating user profile with data:", data);
      const success = await updateUserProfile(user.id, data);
      
      if (success) {
        // Update local state
        setUser({ ...user, ...data });
        toast.success("Profile updated successfully");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error("Failed to update profile data");
      throw error;
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
