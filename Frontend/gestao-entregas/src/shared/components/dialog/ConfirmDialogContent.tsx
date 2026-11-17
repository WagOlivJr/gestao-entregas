import { useDialog } from "../../contexts/dialog-context";
import { useDialogActions } from "../../hooks/useDialogActions";

interface Props {
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => unknown | Promise<unknown>;
    onSuccess?: () => void;
}

export function ConfirmDialogContent({
    confirmLabel,
    cancelLabel = "Cancelar",
    onConfirm,
    onSuccess,
}: Props) {
    const { closeDialog } = useDialog();
    const { pending, error, execute } = useDialogActions({
        onSuccess,
    });

    return (
        <>
            {error && <p role="alert">{error}</p>}

            <div className="app-dialog__actions">
                <button type="button" disabled={pending} onClick={closeDialog}>
                    {cancelLabel}
                </button>

                <button
                    type="button"
                    disabled={pending}
                    onClick={() => void execute(onConfirm)}
                >
                    {pending ? "Processando…" : confirmLabel}
                </button>
            </div>
        </>
    );
}
