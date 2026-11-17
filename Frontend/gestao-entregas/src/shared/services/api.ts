import axios, {
    AxiosHeaders,
    CanceledError,
    type AxiosRequestConfig,
} from "axios";
import { clearSessionAcrossTabs, useAuthStore } from "../stores/authStore";
import type { AuthSession } from "../types/auth";
import { useLoadingStore } from "../stores/loading.store";
import { useSuccessStore } from "../stores/success.store";
import { HttpError, type HttpErrorBody } from "./HttpError";

export interface ApiOptions<
    D = any,
    TResponse = any,
    TResult = any,
> extends Omit<AxiosRequestConfig<D>, "headers"> {
    headers?: ConstructorParameters<typeof AxiosHeaders>[0];
    refreshOn401Error?: boolean;
    authenticated?: boolean;
    idempotencyKey?: string;
    retry?: boolean;
    silent?: boolean;
    successMessage?: string;
    mapResponse?(data: TResponse): TResult;

    delay?: number;
}

export const transport = axios.create({
    baseURL:
        import.meta.env?.VITE_API_BASE_URL || "http://10.8.0.217:8080/api/v1",
    timeout: 10_000,
    withCredentials: false,
});

function normalizeError(error: unknown): Error {
    if (axios.isCancel(error) || error instanceof HttpError) return error;
    if (!axios.isAxiosError(error)) {
        return error instanceof Error ? error : new Error("Erro inesperado.");
    }
    const data: unknown = error.response?.data;
    const body =
        data && typeof data === "object" ? (data as HttpErrorBody) : null;
    const message = body?.message ?? body?.detail ?? body?.error;
    const safeMessage =
        typeof message === "string" ||
        (Array.isArray(message) &&
            message.every((item) => typeof item === "string"))
            ? message
            : null;
    if (error.response) {
        return new HttpError(
            safeMessage ?? `Erro HTTP ${error.response.status}`,
            error.response,
            body,
        );
    }
    const timeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    return new HttpError(
        timeout
            ? "Tempo máximo de espera atingido"
            : "Não foi possível estabelecer uma conexão com o servidor",
        null,
        null,
        timeout ? "timeout" : "network",
    );
}

function checkCanceled<D, TResponse, TResult>(
    options: ApiOptions<D, TResponse, TResult>,
) {
    if (options.signal?.aborted) throw new CanceledError();
}

let requestCounter = 0;
function nextRequestId(): string {
    return `req-${++requestCounter}`;
}

async function request<TResponse, TResult = TResponse, D = unknown>(
    endpoint: string,
    options: ApiOptions<D, TResponse, TResult> = {},
): Promise<TResult> {
    const {
        refreshOn401Error = true,
        authenticated = true,
        idempotencyKey,
        retry = true,
        silent = false,
        successMessage,
        mapResponse,
        delay,
        ...config
    } = options;

    const loadingId = silent ? null : nextRequestId();
    if (loadingId) useLoadingStore.getState().begin(loadingId);

    try {
        const method = (config.method ?? "GET").toUpperCase();
        const headers = AxiosHeaders.from(config.headers);
        if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);
        const canRetry =
            ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"].includes(method) ||
            !!headers.get("Idempotency-Key");
        const revision = useAuthStore.getState().revision;
        let refreshed = false;
        let retried = false;
        for (;;) {
            checkCanceled(options);
            const token = useAuthStore.getState().token;
            if (authenticated && token)
                headers.set("Authorization", `Bearer ${token}`);
            else headers.delete("Authorization");
            try {
                await new Promise((resolve) => setTimeout(resolve, delay));
                const response = await transport.request<TResponse>({
                    ...config,
                    url: endpoint,
                    method,
                    headers,
                });

                const result = mapResponse
                    ? mapResponse(response.data)
                    : (response.data as unknown as TResult);

                if (successMessage?.trim()) {
                    useSuccessStore.getState().enqueue(successMessage);
                }

                return result;
            } catch (cause) {
                checkCanceled(options);
                const error = normalizeError(cause);
                if (
                    error instanceof HttpError &&
                    error.status === 401 &&
                    authenticated &&
                    refreshOn401Error &&
                    !refreshed
                ) {
                    refreshed = true;
                    // Um 401 atrasado pode pertencer ao token anterior ao refresh.
                    if (useAuthStore.getState().token === token) {
                        if (useAuthStore.getState().revision !== revision)
                            throw error;
                        await refreshSession();
                    }
                    checkCanceled(options);
                    if (!useAuthStore.getState().isAuthenticated) throw error;
                    continue;
                }
                if (
                    error instanceof HttpError &&
                    error.isRetryable &&
                    retry &&
                    canRetry &&
                    !retried
                ) {
                    retried = true;
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    continue;
                }
                throw error;
            }
        }
    } finally {
        if (loadingId) useLoadingStore.getState().end(loadingId);
    }
}

let refreshPromise: Promise<void> | null = null;

export function validateSession(session: AuthSession) {
    if (
        !session ||
        typeof session.access_token !== "string" ||
        !session.access_token ||
        !session.user ||
        typeof session.expires_in !== "number"
    ) {
        throw new HttpError("Resposta de sessão inválida", { status: 200 });
    }
}

export function refreshSession(
    isBoot: boolean = false,
    idempotencyKey?: string,
): Promise<void> {
    if (refreshPromise) return refreshPromise;
    const revision = useAuthStore.getState().revision;
    refreshPromise = request<AuthSession>("/auth/refresh", {
        method: "POST",
        withCredentials: true,
        timeout: 5_000,
        authenticated: false,
        refreshOn401Error: false,
        retry: false,
        silent: !isBoot,
        idempotencyKey: idempotencyKey ?? createIdempotencyKey(),
    })
        .then((session) => {
            validateSession(session);
            if (useAuthStore.getState().revision === revision)
                useAuthStore.getState().setSession(session);
        })
        .catch((error: unknown) => {
            if (
                error instanceof HttpError &&
                error.status === 401 &&
                useAuthStore.getState().revision === revision
            ) {
                clearSessionAcrossTabs(
                    "Sua sessão expirou. Faça login novamente.",
                );
            }
            throw error;
        })
        .finally(() => {
            refreshPromise = null;
        });
    return refreshPromise;
}

export function createIdempotencyKey(): string {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (c: number) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16),
    );
}

const api = {
    request,
    get: <TResponse, TResult = TResponse>(
        url: string,
        options?: ApiOptions<unknown, TResponse, TResult>,
    ) =>
        request<TResponse, TResult>(url, {
            ...options,
            method: "GET",
        }),

    post: <TResponse, TResult = TResponse>(
        url: string,
        data?: unknown,
        options?: ApiOptions<unknown, TResponse, TResult>,
    ) =>
        request<TResponse, TResult>(url, {
            ...options,
            method: "POST",
            data,
        }),

    put: <TResponse, TResult = TResponse>(
        url: string,
        data?: unknown,
        options?: ApiOptions<unknown, TResponse, TResult>,
    ) =>
        request<TResponse, TResult>(url, {
            ...options,
            method: "PUT",
            data,
        }),

    patch: <TResponse, TResult = TResponse>(
        url: string,
        data?: unknown,
        options?: ApiOptions<unknown, TResponse, TResult>,
    ) =>
        request<TResponse, TResult>(url, {
            ...options,
            method: "PATCH",
            data,
        }),

    delete: <TResponse = void, TResult = TResponse>(
        url: string,
        options?: ApiOptions<unknown, TResponse, TResult>,
    ) =>
        request<TResponse, TResult>(url, {
            ...options,
            method: "DELETE",
        }),
};

export default api;
