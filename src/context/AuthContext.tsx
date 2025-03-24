
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  experience_level?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, experience: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUserData: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // This is a placeholder for Supabase integration
  // We'll mock the authentication for now
  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('stockcoach_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string, experience: string) => {
    try {
      setLoading(true);
      // Mock signup - will be replaced with Supabase
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        experience_level: experience
      };
      
      // Store user in localStorage for now
      localStorage.setItem('stockcoach_user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success("Account created successfully!");
      navigate('/onboarding');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error("Failed to create account. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock sign in - will be replaced with Supabase
      // For demo, we'll just create a user if one doesn't exist
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
      };
      
      localStorage.setItem('stockcoach_user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success("Signed in successfully!");
      navigate('/chat');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error("Failed to sign in. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Mock sign out - will be replaced with Supabase
      localStorage.removeItem('stockcoach_user');
      setUser(null);
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const setUserData = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('stockcoach_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, setUserData }}>
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
