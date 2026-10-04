import api from "./api";
import type { User } from "../entities/User";
import type { PagedResponse } from "../types/page";
import type { ApiPageRequest } from "../types/pageRequest";

export const usersService = {
    list: (data: ApiPageRequest, signal?: AbortSignal) =>
        api.post<PagedResponse<User>>("/users/admin", data, { signal }),
};
