import { User } from "../../../types";

interface RegisterResponse {
    message: string,
};

interface LoginResponse {
    accessToken: string,
    refreshToken: string,
    user: User,
};

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
    
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(API_URL + path, {
            headers: {
            'content-type' : 'application/json',
            ...options?.headers},
            ...options
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

export { registerUser, loginUser, refreshSession };
