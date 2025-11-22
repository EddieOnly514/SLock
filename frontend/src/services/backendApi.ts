async function apiRequest(path: string, options?: RequestInit) {

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(API_URL + path, {
            headers: {
            'content-type' : 'applicaiton/json',
            ...options?.headers},
            ...options
        }
    );

    if (response.status >= 400) {
        throw new Error(`Http Request failed: ${response.status}`);
    }

    return await response.json();
} 

async function registerUser(email: string, username: string, password: string) {
    return apiRequest("/api/auth/register", {
        method: 'POST', 
        body: JSON.stringify({ email, username, password })},
)}

async function loginUser(email: string, password: string) {
    return apiRequest("/api/auth/login", {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })
}

export { registerUser, loginUser };
