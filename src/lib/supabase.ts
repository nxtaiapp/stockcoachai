
import { createClient } from '@supabase/supabase-js';

// Set default placeholder values to prevent runtime errors
// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create the Supabase client with the provided credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if using placeholder values and log warning
if (supabaseUrl === 'https://placeholder-url.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.warn('⚠️ Using placeholder Supabase credentials. Authentication and database features will not work correctly. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  experience_level?: string;
  trading_goal?: string;
  skill_level?: string;
  created_at?: string;
  updated_at?: string;
}
