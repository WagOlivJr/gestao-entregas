import { useCallback, useState, type ReactNode } from "react";
import { ModuleLayout } from "./layout/ModuleLayout";

type View<T> = { mode: "list" } | { mode: "form"; item?: T };

interface Props<T> {
    title: string;
    canAdd?: boolean;
    renderList: (ctx: {
        refreshToken: number;
        onEdit: (item: T) => void;
    }) => ReactNode;
    renderForm: (ctx: {
        item?: T;
        onCancel: () => void;
        onSaved: () => void;
    }) => ReactNode;
    addItemBtnLabel?: string;
}

export function ModulePage<T>({
    title,
    canAdd = true,
    renderList,
    renderForm,
    addItemBtnLabel,
}: Props<T>) {
    const [view, setView] = useState<View<T>>({ mode: "list" });
    const [refreshToken, setRefreshToken] = useState(0);

    const backToList = useCallback(() => setView({ mode: "list" }), []);
    const onSaved = useCallback(() => {
        setRefreshToken((prev) => prev + 1);
        backToList();
    }, [backToList]);
    const handleEdit = useCallback(
        (item: T) => setView({ mode: "form", item }),
        [],
    );

    const isList = view.mode === "list";

    return (
        <ModuleLayout
            title={title}
            onAdd={() => setView({ mode: "form" })}
            canAdd={isList && canAdd}
            controlsHidden={!isList}
            addItemBtnLabel={addItemBtnLabel}
        >
            <div style={{ display: isList ? "contents" : "none" }}>
                {renderList({
                    refreshToken,
                    onEdit: handleEdit,
                })}
            </div>
            {!isList &&
                renderForm({
                    item: view.item,
                    onCancel: backToList,
                    onSaved,
                })}
        </ModuleLayout>
    );
}
