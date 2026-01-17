type ValidationError = { message: string };

interface ValidationResult<T> {
  data: T | null;
  error: ValidationError | null;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RefreshData {
  refreshToken: string;
}

interface UpdateData {
  //Can update later to provide functionality for more info (like updating password or email)
  username?: string;
  avatar_url?: string | null;
}

interface AddAppData {
  app_id: string;
  is_blocked?: boolean;
  is_tracked?: boolean;
}

interface UpdateAppData {
  is_blocked?: boolean;
  is_tracked?: boolean;
}

interface FocusSessionData {
  scheduled_duration?: number;
  app_ids: string[];
}

interface UpdateFocusSessionData {
  end_time?: string;
  status?: 'active' | 'completed' | 'overridden';
}

interface AppUsageData {
  app_id: string;
  date: string;
  duration_minutes?: number; 
  sessions_count?: number;
}

interface AppScheduleData {
  app_id: string;
  days_of_week: string[];
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

interface UpdateAppScheduleData {
  app_id?: string;
  days_of_week?: string[];
  start_time?: string;
  end_time?: string;
  is_active?: boolean;
}

interface FriendRequestData {
  friend_id: string;
}

interface UpdateFriendData {
  status?: 'pending' | 'accepted' | 'blocked';
}

interface ActivityData {
  type: 'session_completed' | 'session_override' | 'streak_milestone' | 'friend_joined';
  circle_id?: string;
  session_id?: string;
}

//maybe add ActivityDataUpdate later

export type { 
  ValidationResult, 
  RegisterData, 
  LoginData, 
  RefreshData, 
  UpdateData, 
  AddAppData,
  UpdateAppData,
  FocusSessionData,
  UpdateFocusSessionData,
  AppUsageData,
  AppScheduleData,
  UpdateAppScheduleData,
  FriendRequestData,
  UpdateFriendData,
  ActivityData };