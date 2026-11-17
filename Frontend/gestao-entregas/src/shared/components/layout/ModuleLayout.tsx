import { Suspense, useEffect, type ReactNode } from "react";
import { PaginationControls } from "../pagination/PaginationControls";
import {
    ModulePaginationProvider,
    useModulePagination,
} from "../../contexts/module-pagination-context";
import { useItemsPerPageStore } from "../../stores/itemsPerPageStore";
import { AddItemButton } from "../addItemButton/addItemButton";

interface Props {
    title?: string;
    hasTable?: boolean;
    children: ReactNode;
    onAdd?: () => void;
    canAdd?: boolean;
    addItemBtnLabel?: string;
    controlsHidden?: boolean;
}

export function ModuleLayout({
    title,
    children,
    hasTable = true,
    onAdd,
    canAdd = true,
    controlsHidden = false,
    addItemBtnLabel,
}: Props) {
    const toggleItemsPerPageVisibility = useItemsPerPageStore(
        (state) => state.toggleVisibility,
    );

    useEffect(() => {
        document.title = title || "";
        toggleItemsPerPageVisibility(hasTable);
    }, [title, hasTable, toggleItemsPerPageVisibility]);

    if (!hasTable)
        return (
            <Suspense fallback={<div>Carregando página...</div>}>
                {children}
            </Suspense>
        );

    return (
        <ModulePaginationProvider>
            <main className="module-container">
                {title && (
                    <h2 className={`module-title ${controlsHidden && "form"}`}>
                        {title}
                    </h2>
                )}
                <div className="items-list">
                    <div
                        style={{
                            display: controlsHidden ? "none" : undefined,
                        }}
                        className="table-controls"
                    >
                        <div className="controles-grid">
                            <ModulePaginationControls />
                            {onAdd && (
                                <AddItemButton
                                    label={addItemBtnLabel}
                                    onClick={onAdd}
                                    isVisible={canAdd}
                                />
                            )}
                        </div>
                    </div>
                    <Suspense fallback={<div>Carregando página...</div>}>
                        {children}
                    </Suspense>
                </div>
            </main>
        </ModulePaginationProvider>
    );
}

function ModulePaginationControls() {
    const paginator = useModulePagination();
    return (
        <PaginationControls
            {...paginator}
            onPageChange={paginator.goToPage}
            labels={{
                first: "«",
                previous: "‹",
                next: "›",
                last: "»",
            }}
            showPageNumbers={false}
        />
    );
}
