import type {
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
  UpdateFriendData } from "../types/validation";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//TODO: can seperate concerns between email, username, and password to improve readability and reusablility.

function validateRegisterPayload(payload: Record<string, string>): ValidationResult<RegisterData> {
  const rawEmail = payload.email;
  const rawUsername = payload.username;
  const rawPassword = payload.password;

  const trimmedEmail = rawEmail?.trim();
  const trimmedUsername = rawUsername?.trim();
  const trimmedPassword = rawPassword?.trim();

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
  const raw_scheduled_duration = payload?.scheduled_duration;
  const app_ids = payload.app_ids;

  if (!app_ids) {
    return { error: { message: 'app_ids must be provided'}, data: null };
  }

  if (!(Array.isArray(app_ids))) {
    return { error: { message: 'app_ids are not in proper array format'}, data: null }
  }

  if (app_ids.length === 0) {
    return { error: { message: 'must provide at least one app_id'}, data: null };
  }

  const data: FocusSessionData = {app_ids};

  if (raw_scheduled_duration !== undefined) {
    const scheduled_duration = Number(raw_scheduled_duration);

    if(!(Number.isInteger(scheduled_duration))) {
      return { error: { message: 'scheduled_duration must be an integer'}, data: null }
    }

    if (scheduled_duration <= 0) {
      return { error: { message: 'schedule_duration must be a positive integer' }, data: null };
    }

    data.scheduled_duration = scheduled_duration;
  }

  return { data, error: null };
}

function validateUpdateSessionPayload(payload: Record<string, string>): ValidationResult<UpdateFocusSessionData> {
  const raw_end_time = payload?.end_time;
  const status = payload?.status;

  const updateData: UpdateFocusSessionData = {};

  if (status !== undefined) {
    if (status === 'active' || status === 'completed' || status === 'overridden') {
      updateData.status = status;
    } else {
      return { error: { message: 'Invalid status'}, data: null};
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

function validateAppUsagePayload(payload: Record<string, string>): ValidationResult<AppUsageData> {
  const raw_app_id = payload.app_id;
  const raw_date = payload.date;
  const raw_duration_minutes = payload?.duration_minutes;
  const raw_sessions_count = payload?.sessions_count;
  
  if (raw_app_id === undefined) {
    return { error: { message: 'app_id must be provided' }, data: null };
  }

  const app_id = raw_app_id.trim();

  if (!app_id) {
    return { error: { message: 'app_id must not be an empty string' }, data: null};
  }

  if (raw_date === undefined) {
    return { error: { message: 'date must be provided'}, data: null};
  }

  const date = new Date(raw_date);

  if (Number.isNaN(date.valueOf())) {
    return { error: { message: 'Must be a valid date' }, data: null };
  } 

  const AppUsagePayload: AppUsageData = {app_id, date: raw_date};

  if (raw_duration_minutes !== undefined) {
    const duration_minutes = Number(raw_duration_minutes);

    if (isNaN(duration_minutes)) {
      return { error: { message: 'duration_minutes must be a number' }, data: null };
    }

    if(!(Number.isInteger(duration_minutes))) {
      return { error: { message: 'duration_minutes must be an integer' }, data: null }
    }

    if (duration_minutes < 0) {
      return { error: { message: 'duration_minutes must be a non-negative integer' }, data: null };
    }

    AppUsagePayload.duration_minutes = duration_minutes;
  } else {
    AppUsagePayload.duration_minutes = 0;
  }

  if (raw_sessions_count !== undefined) {
    const sessions_count = Number(raw_sessions_count);

    if (isNaN(sessions_count)) {
      return { error: { message: 'sessions_count must be a number' }, data: null };
    }

    if(!(Number.isInteger(sessions_count))) {
      return { error: { message: 'sessions_count must be an integer' }, data: null };
    }

    if (sessions_count < 0) {
      return { error: { message: 'sessions_count must be a non-negative integer' }, data: null };
    }

    AppUsagePayload.sessions_count = sessions_count;
  } else {
    AppUsagePayload.sessions_count = 0;
  }

  return { data: AppUsagePayload, error: null };
}

function validateCreateSchedulePayload(payload: Record<string, any>): ValidationResult<AppScheduleData> { 
  const raw_app_id = payload.app_id;
  const raw_days_of_week = payload.days_of_week;
  const raw_start_time = payload.start_time;
  const raw_end_time = payload.end_time;
  const raw_is_active = payload?.is_active;

  if (raw_app_id === undefined) {
    return { error: { message: 'app_id must be provided'}, data: null};
  }

  if (!raw_app_id.trim()) {
    return { error: { message: 'app_id must be provided'}, data: null};
  }

  if (raw_days_of_week === undefined) {
    return { error: { message: 'days_of_week must be provided'}, data: null};
  }

  if (!Array.isArray(raw_days_of_week)) {
    return { error: { message: 'days_of_week must be an array'}, data: null};
  }

  if (raw_days_of_week.length === 0) {
    return { error: { message: 'days_of_week must not be empty'}, data: null};
  }

  const normalizedDays = raw_days_of_week.map(day => day.toLowerCase());
  const unique_days = new Set(normalizedDays);

  if (unique_days.size !== normalizedDays.length) {
    return { error: { message: 'days_of_week must not contain duplicates'}, data: null};
  }

  if (!normalizedDays.every(item => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(item))) {
    return { error: { message: 'each element in days of week must be a valid day name'}, data: null};
  }

  if (raw_start_time === undefined) {
    return { error: { message: 'start_time must not be empty' }, data: null};
  }

  if (!(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(raw_start_time))) {
    return { error: { message: 'start_time must be in a valid HH:MM:SS format'}, data: null};
  }

  if (raw_end_time === undefined) {
    return { error: { message: 'end_time must not be empty' }, data: null};
  }

  if (!(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(raw_end_time))) {
    return { error: { message: 'end_time must be in a valid HH:MM:SS format'}, data: null};
  }

  if (raw_start_time >= raw_end_time) {
    return { error: { message: 'start_time must be less than end_time'}, data: null};
  }

  const appSchedulePayload: AppScheduleData = {
                                      app_id: raw_app_id.trim(), 
                                      days_of_week: normalizedDays, 
                                      start_time: raw_start_time,
                                      end_time: raw_end_time}

  if (raw_is_active === undefined) {
    appSchedulePayload.is_active = true;
  }

  if (raw_is_active !== undefined) {
    if (typeof raw_is_active === 'boolean') {
      appSchedulePayload.is_active = raw_is_active;
    } else if (typeof raw_is_active === 'string') {
      if (raw_is_active === 'false') {
        appSchedulePayload.is_active = false;
      } else if (raw_is_active === 'true') {
        appSchedulePayload.is_active = true;
      } else {
        return { error: { message: 'Invalid value for is_active '}, data: null};
      }
    } else {
      return { error: { message: 'Invalid type for is_active '}, data: null };
    }
  }

  return { data: appSchedulePayload, error: null };
}

function validateUpdateSchedulePayload(payload: Record<string, any>): ValidationResult<UpdateAppScheduleData> {  
  const raw_app_id = payload?.app_id;
  const raw_days_of_week = payload?.days_of_week;
  const raw_start_time = payload?.start_time;
  const raw_end_time = payload?.end_time;
  const raw_is_active = payload?.is_active;

  const updateFields: UpdateAppScheduleData = {};

  if (raw_app_id !== undefined) {
    if (typeof raw_app_id !== 'string' || !raw_app_id.trim()) {
      return { error: { message: 'app_id must be provided'}, data: null};
    }  
    updateFields.app_id = raw_app_id.trim();
  }

  if (raw_days_of_week !== undefined) {
    if (!Array.isArray(raw_days_of_week)) {
      return { error: { message: 'days_of_week must be an array'}, data: null};
    }
  
    if (raw_days_of_week.length === 0) {
      return { error: { message: 'days_of_week must not be empty'}, data: null};
    }

    if (!raw_days_of_week.every(item => typeof item === 'string')) {
      return { error: { message: 'each element in days_of_week must be a string'}, data: null};
    }
  
    const days_of_week = raw_days_of_week.map(day => day.toLowerCase());
    const unique_days = new Set(days_of_week);
  
    if (unique_days.size !== days_of_week.length) {
      return { error: { message: 'days_of_week must not contain duplicates'}, data: null};
    }
  
    if (!days_of_week.every(item => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(item))) {
      return { error: { message: 'each element in days of week must be a valid day name'}, data: null};
    }
    updateFields.days_of_week = days_of_week;
  }

  if (raw_start_time !== undefined) {
    if (typeof raw_start_time !== 'string' || !(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(raw_start_time))) {
      return { error: { message: 'start_time must be in a valid HH:MM:SS format'}, data: null};
    }
    updateFields.start_time = raw_start_time;
  }

  if (raw_end_time !== undefined) {
    if (typeof raw_end_time !== 'string' || !(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(raw_end_time))) {
      return { error: { message: 'end_time must be in a valid HH:MM:SS format'}, data: null};
    }
    updateFields.end_time = raw_end_time;
  }

  if (updateFields.start_time && updateFields.end_time) {
    if (updateFields.start_time >= updateFields.end_time) {
      return { error: { message: 'start_time must be less than end_time'}, data: null};
    }
  }

  if (raw_is_active !== undefined) {
    if (typeof raw_is_active === 'boolean') {
      updateFields.is_active = raw_is_active;
    } else if (typeof raw_is_active === 'string') {
      if (raw_is_active === 'false') {
        updateFields.is_active = false;
      } else if (raw_is_active === 'true') {
        updateFields.is_active = true;
      } else {
        return { error: { message: 'Invalid value for is_active '}, data: null};
      }
    } else {
      return { error: { message: 'Invalid type for is_active '}, data: null };
    }
  }

  return { data: updateFields, error: null};
}

function validateFriendRequestPayload(payload: Record<string, string>): ValidationResult<FriendRequestData> {
  const raw_friend_id = payload.friend_id;

  if (raw_friend_id === undefined) {
    return { error: { message: 'friend_id must be provided' }, data: null};
  }

  if (typeof raw_friend_id !== 'string') {
    return { error: { message: 'friend_id must be a string' }, data: null};
  }

  const friend_id = raw_friend_id.trim();

  if (!friend_id) {
    return { error: { message: 'friend_id must not be empty' }, data: null};
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(friend_id)) {
    return { error: { message: 'friend_id must be a valid UUID' }, data: null};
  }

  return { data: { friend_id }, error: null};
}

function validateUpdateFriendPayload(payload: Record<string, string>): ValidationResult<UpdateFriendData> {
  const raw_status = payload.status;

  if (raw_status === undefined) {
    return { error: { message: 'status must be provided'}, data: null};
  }

  if (typeof raw_status !== 'string') {
    return { error: { message: 'status must be a string'}, data: null};
  }

  const validStatuses = ['pending', 'accepted', 'blocked'];
  if (!validStatuses.includes(raw_status)) {
    return { error: { message: 'status must be one of: pending, accepted, blocked'}, data: null};
  }

  return { data: { status: raw_status as 'pending' | 'accepted' | 'blocked' }, error: null};
}

export { validateRegisterPayload, 
  validateLoginPayload, 
  validateRefreshPayload, 
  validateUpdatePayload,
  validateAddAppPayload,
  validateUpdateAppPayload,
  validateCreateSessionPayload,
  validateUpdateSessionPayload,
  validateAppUsagePayload,
  validateCreateSchedulePayload,
  validateUpdateSchedulePayload,
  validateFriendRequestPayload,
  validateUpdateFriendPayload };
