import { useCallback, useEffect, useState } from "react";

export interface PaginatorState {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    pageNumbers: number[];
}

export interface UsePaginatorOptions {
    totalItems: number;
    itemsPerPage?: number;
    initialPage?: number;
    visiblePages?: number;
}

export interface UsePaginatorReturn extends PaginatorState {
    goToPage: (page: number) => void;
}

export function getPageNumbers(
    currentPage: number,
    totalPages: number,
    visiblePages: number,
): number[] {
    if (totalPages <= visiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let end = Math.min(totalPages, start + visiblePages - 1);
    start = Math.max(1, end - visiblePages + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => i + 1);
}

export function usePaginator({
    totalItems,
    itemsPerPage = 10,
    initialPage = 1,
    visiblePages = 5,
}: UsePaginatorOptions): UsePaginatorReturn {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
    }, [totalPages]);

    const goToPage = useCallback(
        (page: number) => {
            setCurrentPage((prev) => {
                if (page < 1 || page > totalPages || page === prev) return prev;
                return page;
            });
        },
        [totalPages],
    );

    return {
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
        pageNumbers: getPageNumbers(currentPage, totalPages, visiblePages),
        goToPage,
    };
}
