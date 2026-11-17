import type { FallbackProps } from "react-error-boundary";
import "./ErrorFallback.css";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="error-fallback" role="alert" aria-live="assertive">
            <div className="error-fallback__content">
                <div className="error-fallback__icon">⚠️</div>

                <h2 className="error-fallback__title">Ocorreu um problema</h2>

                <p className="error-fallback__description">
                    Não foi possível concluir esta operação no momento. Tente
                    novamente em alguns instantes.
                </p>

                {!!error && (
                    <details className="error-fallback__details">
                        <summary>Detalhes técnicos</summary>
                        <pre className="error-fallback__message">
                            {error instanceof Error
                                ? error.message
                                : String(error)}
                        </pre>
                    </details>
                )}

                <button
                    type="button"
                    className="error-fallback__button"
                    onClick={resetErrorBoundary}
                >
                    Tentar novamente
                </button>
            </div>
        </div>
    );
}
