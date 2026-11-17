import type { BasicEntityStatus } from "../../shared/types/status";

export interface Address {
    street: string;
    number: number | null;
    complement: string | null;
    neighborhood: string;
    zipCode: string;
    city: string;
    state: string;
}

export interface Customer {
    id: number;
    name: string;
    status: BasicEntityStatus;
    phone: string;
    address: Address;
    notes?: string;
    deactivationReason?: string;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
}

export interface BasicCustomer {
    id: number;
    name: string;
    status: BasicEntityStatus;
}
