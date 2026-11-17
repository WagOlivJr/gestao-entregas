import { createContext, useContext, type ReactNode } from "react";

export interface DialogRequest {
    title: string;
    description?: ReactNode;
    content: ReactNode;
    dismissOnEscape?: boolean;
    dismissOnOutsideClick?: boolean;
    showCloseButton?: boolean;
}

export interface DialogContextValue {
    openDialog: (request: DialogRequest) => void;
    closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog deve ser usado dentro de DialogProvider.");
    }
    return context;
}
