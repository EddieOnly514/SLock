export interface User {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    privacy_preset: string;
    created_at: string;
    phone: string | null;
}