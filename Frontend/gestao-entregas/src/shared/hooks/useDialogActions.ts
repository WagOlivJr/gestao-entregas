import { useCallback, useRef, useState } from "react";
import { useDialog } from "../contexts/dialog-context";

interface Options {
    onSuccess?: () => void;
}

type DialogAction = () => unknown | Promise<unknown>;

export function useDialogActions({ onSuccess }: Options = {}) {
    const { closeDialog } = useDialog();

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inFlightRef = useRef(false);

    const execute = useCallback(
        async (action: DialogAction): Promise<boolean> => {
            if (inFlightRef.current) {
                return false;
            }

            inFlightRef.current = true;
            setPending(true);
            setError(null);

            let succeeded = false;

            try {
                await action();
                succeeded = true;
            } catch (cause) {
                setError(
                    cause instanceof Error && cause.message.trim()
                        ? cause.message
                        : "Não foi possível concluir a ação.",
                );
            } finally {
                inFlightRef.current = false;
                setPending(false);
            }

            if (succeeded) {
                closeDialog();
                onSuccess?.();
            }

            return true;
        },
        [onSuccess, closeDialog],
    );

    return { pending, error, setError, execute };
}
