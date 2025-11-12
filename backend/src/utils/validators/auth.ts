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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function validateRegisterPayload(payload: Record<string, unknown>): ValidationResult<RegisterData> {
  const rawEmail = isString(payload.email) ? payload.email : "";
  const rawUsername = isString(payload.username) ? payload.username : "";
  const rawPassword = isString(payload.password) ? payload.password : "";

  const trimmedEmail = rawEmail.trim();
  const trimmedUsername = rawUsername.trim();
  const trimmedPassword = rawPassword.trim();

  if (!trimmedEmail || !trimmedUsername || !trimmedPassword) {
    return { error: { message: "Email, username, and password are required" }, data: null };
  }

  if (!emailRegex.test(trimmedEmail)) {
    return { error: { message: "Email format is invalid" }, data: null };
  }

  if (/\s/.test(trimmedUsername)) {
    return { error: { message: "Username must not contain spaces" }, data: null };
  }

  if (trimmedUsername.length > 16) {
    return { error: { message: "Username must be less than 16 characters" }, data: null };
  }

  if (trimmedPassword.length < 8) {
    return { error: { message: "Password must contain at least 8 characters" }, data: null };
  }

  if (!/[A-Z]/.test(trimmedPassword) || !/[a-z]/.test(trimmedPassword) || !/[0-9]/.test(trimmedPassword)) {
    return { error: { message: "Password must include uppercase, lowercase, and numeric characters" }, data: null };
  }

  if (trimmedPassword.includes(trimmedUsername) || trimmedPassword.includes(trimmedEmail.split("@")[0])) {
    return { error: { message: "Password must not contain your username or email local-part" }, data: null };
  }

  return {
    error: null,
    data: {
      email: trimmedEmail.toLowerCase(),
      username: trimmedUsername,
      password: trimmedPassword,
    },
  };
}

function validateLoginPayload(payload: Record<string, unknown>): ValidationResult<LoginData> {
  const rawEmail = isString(payload.email) ? payload.email : "";
  const rawPassword = isString(payload.password) ? payload.password : "";

  const trimmedEmail = rawEmail.trim();
  const trimmedPassword = rawPassword.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return { error: { message: "Email and password are required to login" }, data: null };
  }

  if (!emailRegex.test(trimmedEmail)) {
    return { error: { message: "Email format is invalid" }, data: null };
  }

  if (trimmedPassword.length < 8) {
    return { error: { message: "Password must contain at least 8 characters" }, data: null };
  }

  return {
    error: null,
    data: {
      email: trimmedEmail.toLowerCase(),
      password: trimmedPassword,
    },
  };
}

function validateRefreshPayload(payload: Record<string, unknown>): ValidationResult<RefreshData> {
  const rawRefreshToken = isString(payload.refreshToken) ? payload.refreshToken : "";
  const trimmedRefreshToken = rawRefreshToken.trim();

  if (!trimmedRefreshToken) {
    return { error: { message: "refreshToken is invalid" }, data: null };
  }

  return {
    error: null,
    data: {
      refreshToken: trimmedRefreshToken,
    },
  };
}

export type { RegisterData, LoginData, RefreshData, ValidationResult };
export { validateRegisterPayload, validateLoginPayload, validateRefreshPayload };
