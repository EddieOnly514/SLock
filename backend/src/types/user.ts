export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null; 
  privacy_preset: string;
  created_at: string;
  phone: string | null;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

