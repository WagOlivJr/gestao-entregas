import type { BasicUser } from "../../features/users/User";

export interface Audit {
    createdBy: string | BasicUser;
    createdAt: Date;
    updatedBy: string | BasicUser | null;
    updatedAt: Date | null;
}
