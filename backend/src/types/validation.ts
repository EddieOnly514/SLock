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

export type { ValidationResult, RegisterData, LoginData, RefreshData };