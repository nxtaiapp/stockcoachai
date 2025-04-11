import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';
import { User } from '@supabase/supabase-js';

// Create a profile if one doesn't exist
export const createProfile = async (authUser: User): Promise<UserProfile | null> => {
  try {
    const userData = authUser.user_metadata || {};
    
    // First check if profile already exists to avoid duplicates
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();
      
    if (existingProfile) {
      console.log('Profile already exists for user', authUser.id);
      return existingProfile as UserProfile;
    }
    
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: authUser.id,
        email: authUser.email,
        name: userData.name || userData.full_name || authUser.email?.split('@')[0] || 'User',
        first_name: userData.first_name || userData.name?.split(' ')[0] || '',
        last_name: userData.last_name || (userData.name?.includes(' ') ? userData.name.split(' ').slice(1).join(' ') : ''),
        experience_level: userData.experience_level || 'beginner',
        trading_style: userData.trading_style || 'long-term',
        skill_level: userData.skill_level || 'beginner',
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

// Fetch user profile from profiles table with retry mechanism
export const fetchUserProfile = async (authUser: User, retryCount = 2): Promise<{ 
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
      
      // Retry fetching the profile in case of transient errors
      if (retryCount > 0) {
        console.log(`Retrying profile fetch, attempts remaining: ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return fetchUserProfile(authUser, retryCount - 1);
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
    
    // Retry fetching the profile in case of transient errors
    if (retryCount > 0) {
      console.log(`Retrying profile fetch after error, attempts remaining: ${retryCount}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return fetchUserProfile(authUser, retryCount - 1);
    }
    
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
  experience: string,
  tradingStyle: string = 'long-term',
  skillLevel: string = 'beginner'
): Promise<User | null> => {
  // Extract first and last name from the full name
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const { data: { user: authUser }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        first_name: firstName,
        last_name: lastName,
        experience_level: experience,
        trading_style: tradingStyle,
        skill_level: skillLevel
      }
    }
  });

  if (error) throw error;
  return authUser || null;
};

// Resend verification email
export const resendVerificationEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email
  });
  
  if (error) throw error;
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
  try {
    console.log('Signing out user from Supabase...');
    
    // Try to get the current session first
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      console.log('No active session found during sign out');
      // Clean up local storage as a precaution even without a session
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      return; // Exit early since there's no session to sign out from
    }
    
    // If we have a session, proceed with sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during sign out from Supabase:', error);
      throw error;
    }
    
    console.log('Successfully signed out from Supabase');
    
    // Clear any auth-related items from local storage as an extra precaution
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
  } catch (error) {
    console.error('Error during sign out process:', error);
    // Don't throw error here, which would prevent navigation to sign-in page
    // Instead, we'll force-clear the auth state regardless of errors
  }
};

// Change user password
export const changeUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    // First verify the current password by attempting a sign-in
    const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
      email: (await supabase.auth.getUser()).data.user?.email || '',
      password: currentPassword
    });

    if (signInError) {
      throw new Error("Current password is incorrect");
    }

    // Now update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
