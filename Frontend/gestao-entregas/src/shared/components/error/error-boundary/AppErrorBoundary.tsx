import type { ErrorInfo, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../fallback/ErrorFallback";

function logErrorToService(error: unknown, info: ErrorInfo) {
    console.error("[BUG CRÍTICO]", error, info.componentStack);
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={logErrorToService}
        >
            {children}
        </ErrorBoundary>
    );
}
