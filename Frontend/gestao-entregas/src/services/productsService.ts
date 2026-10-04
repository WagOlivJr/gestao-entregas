import api from "./api";
import { type Product } from "../entities/Product";
import { type PagedResponse } from "../types/page";
import type { ApiPageRequest } from "../types/pageRequest";

export const productsService = {
    list: (data: ApiPageRequest, signal?: AbortSignal) =>
        api.post<PagedResponse<Product>>("/products/get-by-filters", data, {
            signal,
        }),

    // save: () =>
};
