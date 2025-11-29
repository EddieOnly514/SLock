import { User } from "../../../types";

// logoutResponse has the same interface as RegisterResponse
interface RegisterResponse {
    message: string,
};

// LoginResponse has the same interface as refreshResponse
interface LoginResponse {
    accessToken: string,
    refreshToken: string,
    user: User,
};

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
    
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(API_URL + path, {
            ...options,
            headers: {
            'content-type' : 'application/json',
            ...options?.headers}
        }
    );

    if (response.status >= 400) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occured' }));
        throw new Error(errorData.error || `Http Request failed: ${response.status}`);
    }

    return await response.json();
} 

async function registerUser(email: string, username: string, password: string): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>('/api/auth/register', {
        method: 'POST', 
        body: JSON.stringify({ email, username, password })})
}

async function loginUser(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

async function refreshSession(refreshToken: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
    });
}

async function logoutUser(accessToken: string, refreshToken: string): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>('/api/auth/logout', {
        headers: { Authorization: `Bearer ${accessToken}`},
        method: 'POST',
        body: JSON.stringify({ refreshToken })
    })
}

export { registerUser, loginUser, refreshSession, logoutUser };
