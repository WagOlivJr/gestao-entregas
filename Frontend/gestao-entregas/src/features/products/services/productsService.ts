import api from "../../../shared/services/api";
import { type Product } from "../Product";
import { type PagedResponse } from "../../../shared/types/page";
import type { ApiPageRequest } from "../../../shared/types/pageRequest";
import type { ProductFormData } from "../components/form/ProductsForm";
import type { ProductOption } from "../../deliveries/components/form/products-select/ProductsSelect";

export const productsService = {
    list: (
        data: ApiPageRequest,
        signal?: AbortSignal,
        options?: { silent?: boolean },
    ) =>
        api.post<PagedResponse<Product>>("/products/get-by-filters", data, {
            signal,
            silent: options?.silent,
        }),

    getById: (id: number, signal?: AbortSignal) =>
        api.get<Product>(`products/${id}`, {
            signal,
            silent: true,
            delay: 1000,
        }),

    activate: (id: number) => api.patch<void>(`products/${id}/activate`),

    deactivate: (id: number, deactivationReason: string) =>
        api.patch<void>(`products/${id}/deactivate`, { deactivationReason }),

    delete: (id: number) => api.delete<void>(`products/${id}`),

    create: (data: Partial<ProductFormData>, idempotencyKey: string) =>
        api.post<Product>("products", data, {
            idempotencyKey,
            successMessage: "Produto criado com sucesso.",
        }),

    update: (id: number, data: ProductFormData) =>
        api.put<Product>(`products/${id}`, data, {
            successMessage: "Produto editado com sucesso.",
            delay: 2500,
        }),

    getActiveOptions: (signal?: AbortSignal) =>
        api.get<ProductOption[]>("products/get-active-options", {
            signal,
            // delay: 3000,
        }),
};
