import api from "../../../shared/services/api";
import type { PagedResponse } from "../../../shared/types/page";
import type { ApiPageRequest } from "../../../shared/types/pageRequest";
import type { DeliveryPayload } from "../components/form/DeliveriesForm";
import type { BasicDelivery, Delivery } from "../types/delivery";
import type { DeliveryResponseDto } from "../types/dtos/DeliveryResponseDTO";
import { toBasicDeliveryPage, toDelivery } from "../mapper/deliveryMapper";

class DeliveriesService {
    async list(
        data: ApiPageRequest,
        signal?: AbortSignal,
        options?: { silent?: boolean },
    ) {
        return api.post<
            PagedResponse<DeliveryResponseDto>,
            PagedResponse<BasicDelivery>
        >("deliveries/get-by-filters", data, {
            signal,
            silent: options?.silent,
            mapResponse: toBasicDeliveryPage,
        });
    }

    async delete(id: number) {
        return api.delete<void>(`deliveries/${id}`);
    }

    async progress(
        id: number,
        status: string,
        cancelingReason?: string,
        deliveryPerson?: number,
    ) {
        return api.patch<void>(`deliveries/${id}/advance-status`, {
            status,
            cancelingReason,
            deliveryPerson,
        });
    }

    async cancel(id: number, cancelingReason?: string) {
        return this.progress(id, "canceled", cancelingReason);
    }

    async assignDeliveryPerson(id: number, deliveryPersonId: number) {
        return this.progress(id, "assigned", undefined, deliveryPersonId);
    }

    async getById(id: number, signal?: AbortSignal) {
        return api.get<DeliveryResponseDto, Delivery>(`deliveries/${id}`, {
            signal,
            mapResponse: toDelivery,
            // delay: 3000,
        });
    }

    async create(data: Partial<DeliveryPayload>, idempotencyKey: string) {
        return api.post<Delivery>("deliveries", data, {
            idempotencyKey,
            successMessage: "Entrega criada com sucesso.",
        });
    }

    async update(id: number, data: DeliveryPayload) {
        return api.put<Delivery>(`deliveries/${id}`, data, {
            successMessage: "Entrega editada com sucesso.",
            delay: 2500,
        });
    }
}

export const deliveriesService = new DeliveriesService();
