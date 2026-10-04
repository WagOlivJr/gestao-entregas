import axios, {
    AxiosHeaders,
    CanceledError,
    type AxiosRequestConfig,
} from "axios";
import { HttpError, type HttpErrorBody } from "./HttpError";
import { clearSessionAcrossTabs, useAuthStore } from "../stores/authStore";
import type { AuthSession } from "../types/auth";

export interface ApiOptions<D = unknown> extends Omit<
    AxiosRequestConfig<D>,
    "headers"
> {
    headers?: ConstructorParameters<typeof AxiosHeaders>[0];
    refreshOn401Error?: boolean;
    authenticated?: boolean;
    // POST/PATCH só recebem retry se o backend deduplicar esta chave.
    idempotencyKey?: string;
    retry?: boolean;
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

function checkCanceled(options: ApiOptions) {
    if (options.signal?.aborted) throw new CanceledError();
}

async function request<T>(
    endpoint: string,
    options: ApiOptions = {},
): Promise<T> {
    const {
        refreshOn401Error = true,
        authenticated = true,
        idempotencyKey,
        retry = true,
        ...config
    } = options;
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
            const response = await transport.request<T>({
                ...config,
                url: endpoint,
                method,
                headers,
            });
            return response.data;
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

export function refreshSession(): Promise<void> {
    if (refreshPromise) return refreshPromise;
    const revision = useAuthStore.getState().revision;
    refreshPromise = request<AuthSession>("/auth/refresh", {
        method: "POST",
        withCredentials: true,
        timeout: 5_000,
        authenticated: false,
        refreshOn401Error: false,
        retry: false,
        idempotencyKey: createIdempotencyKey(),
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
    get: <T>(url: string, options?: ApiOptions) =>
        request<T>(url, { ...options, method: "GET" }),
    post: <T>(url: string, data?: unknown, options?: ApiOptions) =>
        request<T>(url, { ...options, method: "POST", data }),
    put: <T>(url: string, data?: unknown, options?: ApiOptions) =>
        request<T>(url, { ...options, method: "PUT", data }),
    patch: <T>(url: string, data?: unknown, options?: ApiOptions) =>
        request<T>(url, { ...options, method: "PATCH", data }),
    delete: <T = void>(url: string, options?: ApiOptions) =>
        request<T>(url, { ...options, method: "DELETE" }),
};

export default api;
