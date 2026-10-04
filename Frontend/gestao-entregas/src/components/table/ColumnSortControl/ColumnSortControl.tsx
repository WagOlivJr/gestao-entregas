export interface ColumnSortControlProps {
    columnKey: string;
    sortBy?: string;
    sortAsc?: boolean;
    onSortChange?: (columnKey: string) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ColumnSortControl({
    columnKey,
    sortBy,
    sortAsc,
    onSortChange,
    containerRef,
}: ColumnSortControlProps) {
    const sortState = sortBy === columnKey ? (sortAsc ? "asc" : "desc") : null;
    const visual = getSortVisual(sortState);

    return (
        <div className="table-controls-container">
            <span
                className={visual.className}
                title={visual.title}
                data-fallback={visual.fallback}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                    e.stopPropagation();
                    onSortChange?.(columnKey);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSortChange?.(columnKey);
                    }
                }}
            />
        </div>
    );
}

function getSortVisual(state: "asc" | "desc" | null) {
    switch (state) {
        case "asc":
            return {
                className: "fas fa-sort-up table-sort-icon sort-active",
                title: "Ordenação crescente (A-Z)",
                fallback: "⭡",
            };
        case "desc":
            return {
                className: "fas fa-sort-down table-sort-icon sort-active",
                title: "Ordenação decrescente (Z-A)",
                fallback: "⭣",
            };
        case null:
            return {
                className: "fas fa-sort table-sort-icon",
                title: "Clique para ordenar",
                fallback: "⮃",
            };
    }
}
