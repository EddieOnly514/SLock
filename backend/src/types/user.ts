export interface UserProfile {
  id: string;
  email: string | null;
  username: string;
  avatar_url: string | null;
  privacy_preset: string;
  created_at: string;
  phone?: string | null;
  [key: string]: unknown;
}

