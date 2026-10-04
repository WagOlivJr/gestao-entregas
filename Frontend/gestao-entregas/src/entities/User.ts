export const UserRole = {
    USER: "USER",
    MANAGER: "MANAGER",
    ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    status: "ACTIVE" | "SUSPENDED" | "BANNED";
    createdAt: string;
}
