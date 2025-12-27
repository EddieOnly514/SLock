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

export type { ValidationResult, RegisterData, LoginData, RefreshData, UpdateData, AddAppData };