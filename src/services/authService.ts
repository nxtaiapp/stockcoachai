
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';
import { User } from '@supabase/supabase-js';

// Create a profile if one doesn't exist
export const createProfile = async (authUser: User): Promise<UserProfile | null> => {
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
      return null;
    }
    
    // Fetch the profile again after creation
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
      
    return profile as UserProfile || null;
  } catch (error) {
    console.error('Error in createProfile:', error);
    return null;
  }
};

// Fetch user profile from profiles table
export const fetchUserProfile = async (authUser: User): Promise<{ 
  profile: UserProfile | null; 
  isAdmin: boolean;
}> => {
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
        const createdProfile = await createProfile(authUser);
        
        // Check admin role for new profile
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authUser.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        return { 
          profile: createdProfile, 
          isAdmin: roleData?.role === 'admin' 
        };
      }
      
      return { profile: null, isAdmin: false };
    }

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authUser.id)
      .eq('role', 'admin')
      .maybeSingle();
      
    return { 
      profile: data as UserProfile, 
      isAdmin: roleData?.role === 'admin' 
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return { profile: null, isAdmin: false };
  }
};

// Update user profile data
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Sign up a new user
export const signUpUser = async (
  email: string, 
  password: string, 
  name: string, 
  experience: string
): Promise<User | null> => {
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
  return authUser || null;
};

// Sign in an existing user
export const signInUser = async (email: string, password: string): Promise<User | null> => {
  const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return authUser || null;
};

// Sign out the current user
export const signOutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
