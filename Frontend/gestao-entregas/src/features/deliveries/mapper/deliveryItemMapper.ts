import type {
    DeliveryItem,
    DeliveryItemResponseDto,
} from "../types/deliveryItem";

export function toDeliveryItem(dto: DeliveryItemResponseDto): DeliveryItem {
    return {
        id: dto.product.id,
        name: dto.product.name,
        quantity: dto.quantity,
    };
}
