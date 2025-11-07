function validateRegisterPayload({ email, username, password }) {
    const trimmedEmail = email?.trim() ?? '';
    const trimmedUsername = username?.trim() ?? '';
    const trimmedPassword = password?.trim() ?? '';

    if (!trimmedEmail || !trimmedUsername || !trimmedPassword) {
        return { error: { message: 'Email, username, and password are required' } };
    }

    if (/\s/.test(trimmedEmail)) {
        return { error: { message: 'Email must not contain spaces' } };
    }

    if (/\s/.test(trimmedUsername)) {
        return { error: { message: 'Username must not contain spaces' } };
    }

    if (/\s/.test(trimmedPassword)) {
        return { error: { message: 'Password must not contain spaces' } };
    }

    if (trimmedUsername.length > 16) {
        return { error: { message: 'Username must be less than 16 characters' } };
    }

    if (trimmedPassword.length < 6) {
        return { error: { message: 'Password must contain at least 6 characters' } };
    }

    return { 
        error: null, 
        data: {
            email: trimmedEmail,
            username: trimmedUsername,
            password: trimmedPassword
        }
    };
}

function validateLoginPayload({ email, password }) {
    const trimmedEmail = email?.trim() ?? '';
    const trimmedPassword = password?.trim() ?? '';

    if (!trimmedEmail || !trimmedPassword) {
        return { error: { message: 'Email and password is required to login'} };
    }

    if (/\s/.test(trimmedEmail)) {
        return { error: { message: 'Email must not contain spaces' } };
    }

    if (/\s/.test(trimmedPassword)) {
        return { error: { message: 'Password must not contain spaces' } };
    }

    if (trimmedPassword.length < 6) {
        return { error: { message: 'Password must contain at least 6 characters' } };
    }

    return { 
        error: null, 
        data: {
            email: trimmedEmail,
            password: trimmedPassword
        }
    };
}

function validateRefreshPayload({ refreshToken }) {
    const trimmedRefreshToken = refreshToken?.trim() ?? '';

    if (!trimmedRefreshToken) {
        return { error: { message: 'refreshToken is invalid' }};
    }

    return {
        error: null,
        data: {
            refreshToken: trimmedRefreshToken
        }
    };
}

export { validateRegisterPayload, validateLoginPayload, validateRefreshPayload };
