import type { BasicEntityStatus } from "../../shared/types/status";

export interface Product {
    id: number;
    name: string;
    status: BasicEntityStatus;
    notes?: string;
    deactivationReason?: string;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
}

export interface BasicProduct {
    id: number;
    name: string;
}
