import type {ValidationResult, RegisterData, LoginData, RefreshData, UpdateData} from "../types/validation";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//TODO: can seperate concerns between email, username, and password to improve readability and reusablility.

function validateRegisterPayload(payload: Record<string, string>): ValidationResult<RegisterData> {
  const rawEmail = payload.email;
  const rawUsername = payload.username;
  const rawPassword = payload.password;

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

  if (/\s/.test(trimmedPassword)) {
    return { error: { message: "Password must not contain spaces" }, data: null }
  }

  if (trimmedUsername.length > 16) {
    return { error: { message: "Username must be less than 16 characters" }, data: null };
  }

  if (trimmedUsername.length < 3) {
    return { error: { message: "Username must contain at least 3 characters" }, data: null };
  }

  if (trimmedPassword.length < 8) {
    return { error: { message: "Password must contain at least 8 characters" }, data: null };
  }

  if (!/[A-Z]/.test(trimmedPassword) || !/[a-z]/.test(trimmedPassword) || !/[0-9]/.test(trimmedPassword)) {
    return { error: { message: "Password must include uppercase, lowercase, and numeric characters" }, data: null };
  }

  if (trimmedPassword.includes(trimmedUsername) || trimmedPassword.includes(trimmedEmail.split("@")[0])) {
    return { error: { message: "Password must not contain your username or email" }, data: null };
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

function validateLoginPayload(payload: Record<string, string>): ValidationResult<LoginData> {
  const rawEmail = payload.email;
  const rawPassword = payload.password;

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

function validateRefreshPayload(payload: Record<string, string>): ValidationResult<RefreshData> {
  const rawRefreshToken = payload?.refreshToken;

  if (!rawRefreshToken) {
    return { error: { message: "refreshToken is required"}, data: null };
  }

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

// In the future, maybe add more things to update like a bio, password, email, etc.
function validateUpdatePayload(payload: Record<string, string>): ValidationResult<UpdateData> {
  const rawUsername = payload?.username;
  const rawAvatar_url = payload?.avatar_url;

  const trimmedUsername = rawUsername?.trim();
  const trimmedAvatar_url = rawAvatar_url?.trim();

  const updateData: UpdateData = {};

  if (trimmedUsername) {
    if (/\s/.test(trimmedUsername)) {
      return { error: { message: "Username must not contain spaces" }, data: null };
    }
  
    if (trimmedUsername.length > 16) {
      return { error: { message: "Username must be less than 16 characters" }, data: null };
    }

    if (trimmedUsername.length < 3) {
      return { error: { message: "Username must contain at least 3 characters" }, data: null };
    }

    updateData.username = trimmedUsername;
  }

  if (trimmedAvatar_url !== undefined) {
    //add further validation for url, but for now its good
    updateData.avatar_url = trimmedAvatar_url || null;
  }

  if (!trimmedUsername && !rawAvatar_url) {
    return { error: { message: "At least one filed must be provided for an update" }, data: null};
  }

  return { error: null, data: updateData };
}

export { validateRegisterPayload, 
  validateLoginPayload, 
  validateRefreshPayload, 
  validateUpdatePayload };
