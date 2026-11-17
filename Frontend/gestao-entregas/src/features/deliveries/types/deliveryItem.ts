export interface DeliveryItem {
    id: number;
    name: string;
    quantity: number;
}

export interface DeliveryItemResponseDto {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        status: string;
        notes: string;
        deactivationReason: null | string;
    };
}
