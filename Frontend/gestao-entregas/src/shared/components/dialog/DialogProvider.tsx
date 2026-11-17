import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
    DialogContext,
    type DialogRequest,
} from "../../contexts/dialog-context";
import "./DialogProvider.css";

export function DialogProvider({ children }: { children: ReactNode }) {
    const [request, setRequest] = useState<DialogRequest | null>(null);
    const restoreFocusTo = useRef<HTMLElement | null>(null);
    const titleId = useId();
    const descriptionId = useId();

    const openDialog = useCallback(
        (nextRequest: DialogRequest) => {
            if (!request) {
                restoreFocusTo.current =
                    document.activeElement instanceof HTMLElement
                        ? document.activeElement
                        : null;
            }
            setRequest(nextRequest);
        },
        [request],
    );

    const closeDialog = useCallback(() => {
        setRequest(null);
    }, []);

    const dismissOnEscape = request?.dismissOnEscape ?? true;
    const dismissOnOutsideClick = request?.dismissOnOutsideClick ?? true;

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}
            <Dialog.Root
                open={request !== null}
                onOpenChange={(open) => {
                    if (open) return;
                    if (dismissOnEscape || dismissOnOutsideClick) {
                        closeDialog();
                    }
                }}
            >
                {request && (
                    <Dialog.Portal>
                        <Dialog.Overlay className="app-dialog__overlay" />
                        <Dialog.Content
                            className="app-dialog__content modal"
                            aria-labelledby={titleId}
                            aria-describedby={
                                request.description ? descriptionId : undefined
                            }
                            onEscapeKeyDown={(event) => {
                                if (!dismissOnEscape) event.preventDefault();
                            }}
                            onPointerDownOutside={(event) => {
                                if (!dismissOnOutsideClick)
                                    event.preventDefault();
                            }}
                            onCloseAutoFocus={(event) => {
                                event.preventDefault();
                                restoreFocusTo.current?.focus({
                                    preventScroll: true,
                                });
                                restoreFocusTo.current = null;
                            }}
                        >
                            <header className="app-dialog__header">
                                <Dialog.Title
                                    id={titleId}
                                    className="app-dialog__title"
                                >
                                    {request.title}
                                </Dialog.Title>
                                {request.showCloseButton !== false && (
                                    <Dialog.Close
                                        className="app-dialog__close"
                                        aria-label="Fechar"
                                        onClick={closeDialog}
                                    >
                                        ×
                                    </Dialog.Close>
                                )}
                            </header>
                            {request.description && (
                                <Dialog.Description
                                    id={descriptionId}
                                    className="app-dialog__description"
                                >
                                    {request.description}
                                </Dialog.Description>
                            )}
                            <div className="app-dialog__body">
                                {request.content}
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </Dialog.Root>
        </DialogContext.Provider>
    );
}
