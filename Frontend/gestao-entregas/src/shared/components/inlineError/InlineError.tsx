import { HttpError } from "../../services/HttpError";

interface InlineErrorProps {
    error?: Error;
    onRetry?: () => void;
    title?: string;
}

export function InlineError({ error, onRetry, title }: InlineErrorProps) {
    const message =
        error instanceof HttpError || error instanceof Error
            ? error.message
            : "Erro inesperado.";

    return (
        <div role="alert" className="inline-error">
            <strong className="inline-error__title">{title}</strong>
            <p className="inline-error__message">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    className="inline-error__retry"
                    onClick={onRetry}
                >
                    Tentar de novo
                </button>
            )}
        </div>
    );
}
