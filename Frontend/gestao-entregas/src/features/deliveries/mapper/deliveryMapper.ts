import type { PagedResponse } from "../../../shared/types/page";
import { mapPagedResponse } from "../../../shared/utils/mapper/pagedResponseMapper";
import {
    parseApiDate,
    parseOptionalApiDate,
} from "../../../shared/utils/time/dateTimeConvertion";
import type { BasicDelivery, Delivery } from "../types/delivery";
import type { DeliveryResponseDto } from "../types/dtos/DeliveryResponseDTO";
import { toDeliveryItem } from "./deliveryItemMapper";

export function toDelivery(dto: DeliveryResponseDto): Delivery {
    return {
        ...dto,
        purchaseDate: parseApiDate(dto.purchaseDate, "purchaseDate", true),
        startDeliveryDate: parseOptionalApiDate(
            dto.startDeliveryDate,
            "startDeliveryDate",
        ),
        deliveryDate: parseOptionalApiDate(dto.deliveryDate, "deliveryDate"),
        createdAt: parseApiDate(dto.createdAt, "createdAt"),
        updatedAt: parseOptionalApiDate(dto.updatedAt, "updatedAt"),
        items: dto.items.map(toDeliveryItem),
    };
}

export function toBasicDelivery(dto: DeliveryResponseDto): BasicDelivery {
    return {
        ...dto,
        purchaseDate: parseApiDate(dto.purchaseDate, "purchaseDate", true),
        startDeliveryDate: parseOptionalApiDate(
            dto.startDeliveryDate,
            "startDeliveryDate",
        ),
        deliveryDate: parseOptionalApiDate(dto.deliveryDate, "deliveryDate"),
    };
}

export function toBasicDeliveryPage(page: PagedResponse<DeliveryResponseDto>) {
    return mapPagedResponse(page, toBasicDelivery);
}
