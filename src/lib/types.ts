
// Define the UserProfile type for use throughout the application
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  experience_level?: string;
  trading_style?: string; // Changed from trading_goal
  skill_level?: string;
  created_at?: string;
  updated_at?: string;
}
