import { useState, type ReactNode } from "react";
import { useDialog } from "../../contexts/dialog-context";
import { useDialogActions } from "../../hooks/useDialogActions";

interface Props {
    confirmLabel: string;
    cancelLabel?: string;
    reasonLabel?: string;
    reasonPlaceholder?: string;
    reasonRequiredMessage?: string;
    helperMessage?: ReactNode;
    onConfirm: (reason: string) => unknown | Promise<unknown>;
    onSuccess?: () => void;
}

const MIN_REASON_LENGTH = 3;

export function ReasonConfirmDialogContent({
    confirmLabel,
    cancelLabel = "Cancelar",
    reasonLabel = "Motivo",
    reasonPlaceholder = "Informe o motivo.",
    reasonRequiredMessage = "Informe um motivo com pelo menos 3 caracteres.",
    helperMessage,
    onConfirm,
    onSuccess,
}: Props) {
    const { closeDialog } = useDialog();

    const [reason, setReason] = useState("");
    const { pending, error, setError, execute } = useDialogActions({
        onSuccess,
    });

    const normalizedReason = reason.trim();
    const hasValidReason = normalizedReason.length >= MIN_REASON_LENGTH;

    const confirm = () => {
        if (!hasValidReason) {
            setError(reasonRequiredMessage);
            return;
        }

        void execute(() => onConfirm(normalizedReason));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();

            if (!pending) {
                confirm();
            }
        }
    };

    return (
        <>
            <label>
                <span>{reasonLabel}</span>

                <textarea
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                        setError(null);
                    }}
                    onKeyDown={onKeyDown}
                    minLength={MIN_REASON_LENGTH}
                    className="canceling-reason-textarea"
                    placeholder={reasonPlaceholder}
                />
            </label>

            {helperMessage && <p>{helperMessage}</p>}

            {error && <p role="alert">{error}</p>}

            <div className="app-dialog__actions">
                <button type="button" disabled={pending} onClick={closeDialog}>
                    {cancelLabel}
                </button>

                <button
                    type="button"
                    disabled={pending || !hasValidReason}
                    onClick={confirm}
                    title={!hasValidReason ? reasonRequiredMessage : undefined}
                >
                    {pending ? "Processando…" : confirmLabel}
                </button>
            </div>
        </>
    );
}
