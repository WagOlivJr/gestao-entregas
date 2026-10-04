export interface HttpErrorBody {
    message?: string | string[];
    timestamp?: string;
    error?: string;
    errorCode?: string;
    path?: string;
    detail?: string;
    fields?: unknown[];
}

export type HttpErrorKind = "http" | "network" | "timeout";

export class HttpError extends Error {
    readonly status: number | null;
    readonly timestamp: string;
    readonly error: string | null;
    readonly errorCode: string | null;
    readonly path: string | null;
    readonly detail: string | null;
    readonly fields: unknown[] | null;
    readonly kind: HttpErrorKind;

    constructor(message: string | string[] | null = null,
        response: { status: number } | null = null,
        body: HttpErrorBody | null = null,
        kind: HttpErrorKind = response ? "http" : "network") {
        const raw = (Array.isArray(message) ? message.join(";\n") : message)?.trim()
            || "Erro desconhecido";
        super(/[.!?]$/.test(raw) ? raw : `${raw}.`);
        this.name = "HttpError";
        this.status = response?.status ?? null;
        this.timestamp = body?.timestamp ?? new Date().toISOString();
        this.error = body?.error ?? null;
        this.errorCode = body?.errorCode ?? null;
        this.path = body?.path ?? null;
        this.detail = body?.detail ?? null;
        this.fields = Array.isArray(body?.fields) ? body.fields : null;
        this.kind = kind;
    }

    get isValidationError() { return this.status === 422 && this.fields !== null; }
    get isNotFound() { return this.status === 404; }
    get isBusinessError() { return this.status === 422 && !this.isValidationError; }
    get isTimeout() { return this.kind === "timeout"; }
    get isRetryable() {
        return this.kind === "network" || this.isTimeout
            || this.status === 429 || (this.status !== null && this.status >= 500);
    }
}
