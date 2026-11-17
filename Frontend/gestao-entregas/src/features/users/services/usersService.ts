import api from "../../../shared/services/api";
import type { User } from "../User";
import type { PagedResponse } from "../../../shared/types/page";
import type { ApiPageRequest } from "../../../shared/types/pageRequest";

export const usersService = {
    list: (data: ApiPageRequest, signal?: AbortSignal) =>
        api.post<PagedResponse<User>>("/users/admin", data, { signal }),

    getById: (id: number, signal?: AbortSignal) =>
        api.get<User>(`/users/admin/${id}`, {
            signal,
            delay: 3000,
            silent: true,
        }),

    restoreAccess: (id: number) =>
        api.patch<void>(
            `/users/admin/${id}/restore-access`,
            {},
            {
                successMessage: "Acesso restabelecido com sucesso.",
                delay: 3000,
            },
        ),

    suspend: (id: number) =>
        api.patch<void>(
            `/users/admin/${id}/suspend`,
            {},
            { successMessage: "Usuário suspendo com sucesso.", delay: 3000 },
        ),

    ban: (id: number) =>
        api.patch<void>(
            `/users/admin/${id}/ban`,
            {},
            { successMessage: "Usuário banido com sucesso.", delay: 3000 },
        ),
};
