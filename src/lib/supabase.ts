
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from './types';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Use the properly configured Supabase client from the integration
export const supabase = supabaseClient;

// Re-export UserProfile type to maintain compatibility with existing code
export type { UserProfile };
