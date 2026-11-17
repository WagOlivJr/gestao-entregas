import type { Audit } from "../../../shared/types/audit";
import type { BasicCustomer, Customer } from "../../customers/Customer";
import type { DeliveryItem } from "./deliveryItem";
import type { DeliveryStatus } from "./status";

export interface Delivery extends Omit<BasicDelivery, "customer">, Audit {
    customer: BasicCustomer | Customer;
    items: DeliveryItem[];
    cancelingReason?: string;
}

export interface BasicDelivery {
    id: number;
    status: DeliveryStatus;
    customer: BasicCustomer;
    purchaseDate: Date;
    startDeliveryDate: Date | null;
    deliveryDate: Date | null;
    cashierId: number | null;
    deliveryPerson: string | null;
    notes: string | null;
}

export interface DeliveryPersonOption {
    id: number;
    name: string;
}
