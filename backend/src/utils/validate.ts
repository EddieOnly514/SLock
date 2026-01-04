import type {
  ValidationResult, 
  RegisterData, 
  LoginData, 
  RefreshData, 
  UpdateData,
  AddAppData,
  UpdateAppData,
  FocusSessionData,
  UpdateFocusSessionData} from "../types/validation";

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

  if (rawAvatar_url !== undefined) {
    //add further validation for url, but for now its good
    updateData.avatar_url = trimmedAvatar_url || null;
  }

  return { error: null, data: updateData };
}

function validateAddAppPayload(payload: Record<string, string>): ValidationResult<AddAppData> {
  const rawApp_id = payload.app_id;
  const is_blocked = payload?.is_blocked;
  const is_tracked = payload?.is_tracked;

  if (!rawApp_id) {
    return { error: { message: "App id must be provided" }, data: null };
  }

  const AddAppPayload: AddAppData = {app_id: rawApp_id.trim()};

  if (is_blocked !== undefined) {
    if (typeof is_blocked === 'boolean') {
      AddAppPayload.is_blocked = is_blocked;
    } else if (typeof is_blocked === 'string') {
      if (is_blocked === 'false') {
        AddAppPayload.is_blocked = false;
      } else if (is_blocked === 'true') {
        AddAppPayload.is_blocked = true;
      } else {
        return { error: { message: 'Invalid value for is_blocked '}, data: null};
      }
    } else {
      return { error: { message: 'Invalid type for is_blocked '}, data: null };
    }
  }

  if (is_tracked !== undefined) {
    if (typeof is_tracked === 'boolean') {
      AddAppPayload.is_tracked = is_tracked;
    } else if (typeof is_tracked === 'string') {
      if (is_tracked === 'false') {
        AddAppPayload.is_tracked = false;
      } else if (is_tracked === 'true') {
        AddAppPayload.is_tracked = true;
      } else {
        return { error: { message: 'Invalid value for is_tracked '}, data: null};
      }
    } else {
      return { error: { message: 'Invalid type for is_tracked '}, data: null };
    }
  }

  return { error: null, data: AddAppPayload };
}

// look at repetition in code between validateAddAppPayload
// and validateUpdateAppPayload you can change this into a unified function
// but we'll come back to that laters

function validateUpdateAppPayload(payload: Record<string, string | boolean>): ValidationResult<UpdateAppData> {
  const is_blocked = payload?.is_blocked;
  const is_tracked = payload?.is_tracked;

  const UpdateAppPayload: UpdateAppData = {};

  if (is_blocked !== undefined) {
    if (typeof is_blocked === 'boolean') {
      UpdateAppPayload.is_blocked = is_blocked;
    } else if (typeof is_blocked === 'string') {
      if (is_blocked === 'false') {
        UpdateAppPayload.is_blocked = false;
      } else if (is_blocked === 'true') {
        UpdateAppPayload.is_blocked = true;
      } else {
        return { error: { message: 'Invalid value for is_blocked' }, data: null};
      }
    } else {
      return { error: { message: 'Invalid type for is_blocked' }, data: null };
    }
  }

  if (is_tracked !== undefined) {
    if (typeof is_tracked === 'boolean') {
      UpdateAppPayload.is_tracked = is_tracked;
    } else if (typeof is_tracked === 'string') {
      if (is_tracked === 'false') {
        UpdateAppPayload.is_tracked = false;
      } else if (is_tracked === 'true') {
        UpdateAppPayload.is_tracked = true;
      } else {
        return { error: { message: 'Invalid value for is_tracked' }, data: null};
      }
    } else {
      return { error: { message: 'Invalid type for is_tracked' }, data: null };
    }
  }

  return { error: null, data: UpdateAppPayload };
}

function validateCreateSessionPayload(payload: Record<string, string & string[]>): ValidationResult<FocusSessionData> {
  const raw_scheduled_duration = payload.scheduled_duration;
  const app_ids = payload.app_ids;

  if (raw_scheduled_duration === undefined || raw_scheduled_duration === null) {
    return { error: { message: 'schedule_duration must be provided'}, data: null };
  }

  if (!app_ids) {
    return { error: { message: 'app_ids must be provided'}, data: null };
  }

  const scheduled_duration = Number(raw_scheduled_duration);

  if(!(Number.isInteger(scheduled_duration))) {
    return { error: { message: 'schedule_duration must be an integer'}, data: null }
  }

  if (scheduled_duration <= 0) {
    return { error: { message: 'schedule_duration must be a positive integer' }, data: null };
  }

  if (!(Array.isArray(app_ids))) {
    return { error: { message: 'app_ids are not in proper array format'}, data: null }
  }

  if (app_ids.length === 0) {
    return { error: { message: 'must provide at least one app_id'}, data: null };
  }

  return { data: {scheduled_duration, app_ids} , error: null };
}

function validateUpdateSessionPayload(payload: Record<string, any>): ValidationResult<UpdateFocusSessionData> {
  const raw_end_time = payload?.end_time;
  const was_completed = payload?.was_completed;

  const updateData: UpdateFocusSessionData = {};

  if (was_completed !== undefined) {
    if (typeof was_completed === 'boolean') {
      updateData.was_completed = was_completed;
    } else if (typeof was_completed === 'string') {
      if (was_completed === 'false') {
        updateData.was_completed = false;
      } else if (was_completed === 'true') {
        updateData.was_completed = true;
      } else {
        return { error: { message: 'Invalid value for was_completed' }, data: null };
      }
    } else {
      return { error: { message: 'Invalid type for was_completed' }, data: null };
    }
  }

  // if someone passes in an integer it could possibly passby, but the database enforces that its a timestamp so you can come back to
  // this if needed
  if (raw_end_time !== undefined) {
    const d = new Date(raw_end_time);
    if (!Number.isNaN(d.valueOf())) {
      updateData.end_time = raw_end_time;
    } else {
      return { error: { message: 'Invalid ISO timestamp format for end time' }, data: null };
    }
  }

  return { data: updateData, error: null };

}



export { validateRegisterPayload, 
  validateLoginPayload, 
  validateRefreshPayload, 
  validateUpdatePayload,
  validateAddAppPayload,
  validateUpdateAppPayload,
  validateCreateSessionPayload,
  validateUpdateSessionPayload };
