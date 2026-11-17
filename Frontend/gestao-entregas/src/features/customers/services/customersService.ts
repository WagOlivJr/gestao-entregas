import type { Customer } from "../Customer";
import type { PagedResponse } from "../../../shared/types/page";
import type { ApiPageRequest } from "../../../shared/types/pageRequest";
import api from "../../../shared/services/api";
import type { CustomerPayload } from "../components/form/CustomersForm";
import type { CustomerOption } from "../../deliveries/components/form/customer-select/CustomerSelect";

export const customersService = {
    list: (
        data: ApiPageRequest,
        signal?: AbortSignal,
        options?: { silent?: boolean },
    ) =>
        api.post<PagedResponse<Customer>>("/customers/get-by-filters", data, {
            signal,
            silent: options?.silent,
        }),

    getById: async (id: number, signal?: AbortSignal) => {
        await new Promise((res) => setTimeout(res, 1000));
        return api.get<Customer>(`customers/${id}`, { signal, silent: true });
    },

    activate: (id: number) => api.patch<void>(`customers/${id}/activate`),

    deactivate: (id: number, deactivationReason: string) =>
        api.patch<void>(`customers/${id}/deactivate`, {
            deactivationReason,
        }),

    delete: (id: number) => api.delete<void>(`customers/${id}`),

    create: (data: Partial<CustomerPayload>, idempotencyKey: string) =>
        api.post<Customer>("customers", data, {
            idempotencyKey,
            successMessage: "Produto criado com sucesso.",
        }),

    update: (id: number, data: CustomerPayload) =>
        api.put<Customer>(`customers/${id}`, data, {
            successMessage: "Produto editado com sucesso.",
            delay: 2500,
        }),

    getActiveOptions: (signal?: AbortSignal) =>
        api.get<CustomerOption[]>("customers/get-active-options", {
            signal,
            // delay: 3000,
        }),
};
