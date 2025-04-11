import { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import type { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  updateUserProfile,
  resendVerificationEmail as resendEmail
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
      localStorage.setItem("signupEmail", email);
      navigate('/email-confirmation');
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

  const resendVerificationEmail = async (email: string) => {
    try {
      await resendEmail(email);
      return true;
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out...");
      setUser(null);
      
      await signOutUser();
      toast.success("Signed out successfully");
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("There was an issue during sign out, but you've been logged out");
      navigate('/signin', { replace: true });
    }
  };

  const setUserData = async (data: Partial<typeof user>) => {
    if (!user) return;

    try {
      console.log("Updating user profile with data:", data);
      const success = await updateUserProfile(user.id, data);
      
      if (success) {
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
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      signUp, 
      signIn, 
      signOut, 
      setUserData,
      resendVerificationEmail
    }}>
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
