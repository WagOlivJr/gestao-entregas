import { useEffect, useRef, useState } from "react";
import { selectIsloading, useLoadingStore } from "../../stores/loading.store";
import { createPortal } from "react-dom";
import "./GLobalLoadingIndicator.css";
import { useSuccessStore } from "../../stores/success.store";

const SHOW_DELAY_MS = 150;
const MIN_VISIBLE_MS = 400;

export function GlobalLoadingIndicator({ message }: { message?: string } = {}) {
    const isLoading = useLoadingStore(selectIsloading);
    const [visible, setVisible] = useState(false);
    const shownAtRef = useRef(0);

    const queuedSuccessCount = useSuccessStore((state) => state.queue.length);
    const dequeueSuccess = useSuccessStore((state) => state.dequeue);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) {
            if (visible) return;
            const t = setTimeout(() => {
                shownAtRef.current = Date.now();
                setVisible(true);
            }, SHOW_DELAY_MS);
            return () => clearTimeout(t);
        }

        if (!visible) return;

        const elapsed = Date.now() - shownAtRef.current;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
        const t = setTimeout(() => setVisible(false), remaining);
        return () => clearTimeout(t);
    }, [isLoading, visible]);

    useEffect(() => {
        if (
            isLoading ||
            visible ||
            successMessage !== null ||
            queuedSuccessCount === 0
        ) {
            return;
        }

        const nextMessage = dequeueSuccess();
        if (nextMessage !== null) {
            setSuccessMessage(nextMessage);
        }
    }, [
        isLoading,
        visible,
        successMessage,
        queuedSuccessCount,
        dequeueSuccess,
    ]);

    useEffect(() => {
        if (successMessage === null) return;

        const close = () => setSuccessMessage(null);

        const timeoutId = setTimeout(close, 2500);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                close();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [successMessage]);

    if (!visible && successMessage === null) return null;

    const closeSuccess = () => setSuccessMessage(null);

    return createPortal(
        <>
            {visible && <LoadingSpinner message={message} />}
            {successMessage !== null && (
                <SuccessMessage
                    closeSuccess={closeSuccess}
                    successMessage={successMessage}
                />
            )}
        </>,
        document.body,
    );
}

function LoadingSpinner({ message }: { message?: string }) {
    return (
        <div
            className="app-loading"
            role="alert"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="app-loading__backdrop" />
            <div className="app-loading__box">
                <span className="app-loading__spinner" aria-hidden="true" />
                <span className="app-loading__label" aria-hidden="true">
                    {message ?? "Carregando..."}
                </span>
            </div>
        </div>
    );
}

function SuccessMessage({
    closeSuccess,
    successMessage,
}: {
    closeSuccess: () => void;
    successMessage?: string;
}) {
    return (
        <div className="app-success" onClick={closeSuccess}>
            <div className="app-success__backdrop" />

            <div
                className="app-success__box"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="app-success-title"
                onClick={(event) => event.stopPropagation()}
            >
                <span className="app-success__icon" aria-hidden="true">
                    ✓
                </span>

                <h2 id="app-success-title">Sucesso</h2>

                <p>{successMessage}</p>

                <button
                    type="button"
                    className="app-success__button"
                    onClick={closeSuccess}
                >
                    OK
                </button>
            </div>
        </div>
    );
}
