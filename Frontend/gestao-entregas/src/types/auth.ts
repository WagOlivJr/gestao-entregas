import type { UserRole } from "../entities/User";

export interface AuthUser {
    id: number;
    username: string;
    email?: string;
    role?: UserRole;
}

export interface AuthSession {
    access_token: string;
    user: AuthUser;
    expires_in: number;
}

export interface LoginCredentials {
    username: string;
    password: string;
}
