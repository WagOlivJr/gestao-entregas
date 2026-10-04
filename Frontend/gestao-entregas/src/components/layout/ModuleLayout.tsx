import { Suspense, useEffect } from "react";
import { PaginationControls } from "../pagination/PaginationControls";
import {
    ModulePaginationProvider,
    useModulePagination,
} from "../../hooks/module-pagination-context";

interface ModuleLayoutProps {
    title?: string;
    pagination?: boolean;
    children: React.ReactNode;
}

export function ModuleLayout({ title, children }: ModuleLayoutProps) {
    useEffect(() => {
        document.title = title || "";
    }, [title]);

    return (
        <ModulePaginationProvider>
            <main className="module-container">
                {title && <h2 className="module-title">{title}</h2>}
                <div className="items-list">
                    <div className="table-controls">
                        <div className="controles-grid">
                            <ModulePaginationControls />
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
