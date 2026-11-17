import { CanceledError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { HttpError } from "../services/HttpError";
import { useErrorBoundary } from "react-error-boundary";

export interface AsyncResourceState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    reload: () => void;
}

export function useAsyncResource<T>(
    fetcher: (signal: AbortSignal) => Promise<T>,
    deps: readonly unknown[],
    enabled = true,
): AsyncResourceState<T> {
    const { showBoundary } = useErrorBoundary();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [nonce, setNonce] = useState(0);

    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    useEffect(() => {
        if (!enabled) return;

        const controller = new AbortController();

        setLoading(true);
        setError(null);

        fetcherRef
            .current(controller.signal)
            .then((result) => {
                if (controller.signal.aborted) return;
                setData(result);
            })
            .catch((cause: unknown) => {
                if (
                    controller.signal.aborted ||
                    cause instanceof CanceledError
                ) {
                    return;
                }
                if (cause instanceof HttpError) {
                    setError(cause);
                } else {
                    showBoundary(error);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [...deps, nonce, enabled]);

    const reload = useCallback(() => setNonce((n) => n + 1), []);
    return { data, loading, error, reload };
}
