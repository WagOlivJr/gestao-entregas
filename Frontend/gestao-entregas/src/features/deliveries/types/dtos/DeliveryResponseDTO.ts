import type { Delivery } from "../delivery";
import type { DeliveryItemResponseDto } from "../deliveryItem";

type ApiDate = string | null;

export type DeliveryResponseDto = Omit<
    Delivery,
    | "purchaseDate"
    | "startDeliveryDate"
    | "deliveryDate"
    | "createdAt"
    | "updatedAt"
    | "items"
> & {
    items: DeliveryItemResponseDto[];
    purchaseDate: string;
    startDeliveryDate: ApiDate;
    deliveryDate: ApiDate;
    createdAt: string;
    updatedAt: ApiDate;
};
