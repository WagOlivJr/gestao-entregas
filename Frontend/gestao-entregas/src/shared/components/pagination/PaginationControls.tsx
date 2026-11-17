import type { ReactNode } from "react";

interface PaginationLabels {
    first?: string;
    previous?: string;
    last?: string;
    next?: string;
}

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    pageNumbers: number[];
    onPageChange: (page: number) => void;
    labels?: PaginationLabels;
    showFirstLast?: boolean;
    showPageNumbers?: boolean;
    showPrevNext?: boolean;
    showInfo?: boolean;
    showOnSinglePage?: boolean;
    showFloating?: boolean;
}

const DEFAULT_LABELS: Required<PaginationLabels> = {
    first: "Primeira",
    previous: "Anterior",
    next: "Próxima",
    last: "Última",
};

export function PaginationControls({
    currentPage,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    pageNumbers,
    onPageChange,
    labels,
    showFirstLast = true,
    showPageNumbers = true,
    showPrevNext = true,
    showInfo = true,
    showOnSinglePage = false,
    showFloating = false,
}: PaginationControlsProps) {
    if ((!showOnSinglePage && totalPages <= 1) || totalPages === 0) {
        return null;
    }

    const mergedLabels = { ...DEFAULT_LABELS, ...labels };

    const renderButton = (
        label: string,
        page: number,
        disabled: boolean,
        active = false,
    ) => (
        <button
            key={`${label}-${page}`}
            type="button"
            className={`pagination-btn${active ? " active" : ""}`}
            disabled={disabled}
            title={disabled ? undefined : `Ir para a página ${page}`}
            onClick={() => onPageChange(page)}
        >
            {label}
        </button>
    );

    const content: ReactNode = (
        <div className="pagination-container">
            {showInfo && (
                <div className="pagination-info">
                    Página {currentPage} de {totalPages}
                </div>
            )}

            {showFirstLast &&
                renderButton(mergedLabels.first, 1, !hasPreviousPage)}

            {showPrevNext &&
                renderButton(
                    mergedLabels.previous,
                    currentPage - 1,
                    !hasPreviousPage,
                )}

            {showPageNumbers &&
                pageNumbers?.map((num) =>
                    renderButton(String(num), num, false, num === currentPage),
                )}

            {showPrevNext &&
                renderButton(mergedLabels.next, currentPage + 1, !hasNextPage)}

            {showFirstLast &&
                renderButton(mergedLabels.last, totalPages, !hasNextPage)}
        </div>
    );

    if (!showFloating) return content;

    return (
        <>
            {content}
            <div className="floating-pagination">{content}</div>
        </>
    );
}
