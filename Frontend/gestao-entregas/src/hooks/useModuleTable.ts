import { useCallback, useEffect, useRef, useState } from "react";
import type { PagedResponse } from "../types/page";
import type { ApiPageRequest, ColumnFilter } from "../types/pageRequest";
import { useModulePagination } from "./module-pagination-context";
import { useTableSort } from "./useTableSorter";
import {
    useColumnFilters,
    type ColumnFilterConfigMap,
} from "./useColumnFilters";

export interface UseModulePagedFetchOptions {
    sortBy?: string;
    sortAsc?: boolean;
    filters?: ColumnFilter[];
}

export interface UseModuleTableReturn<T> {
    content: T[];
    loading: boolean;
    error: string | null;
    totalItems: number;
    totalItemsInDb: number;
    sortBy?: string;
    sortAsc?: boolean;
    toggleSort: (columnKey: string) => void;
    filters: Record<string, string>;
    debouncedFilters?: Record<string, string>;
    openColumn: string | null;
    setOpenColumn: (columnKey: string | null) => void;
    setFilter: (columnKey: string, value: string) => void;
    resetFilters: () => void;
}

export function useModuleTable<T>(
    fetchPage: (
        request: ApiPageRequest,
        signal: AbortSignal,
    ) => Promise<PagedResponse<T>>,
    filtersConfig: ColumnFilterConfigMap,
): UseModuleTableReturn<T> {
    const { page, pageSize, setPage, reportMeta, totalItems, totalItemsInDb } =
        useModulePagination();
    const [content, setContent] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const skipNextFetchRef = useRef(false);

    const { sortBy, sortAsc, toggleSort } = useTableSort();

    const prevSortRef = useRef({ sortBy, sortAsc });

    const fetchPageRef = useRef(fetchPage);
    fetchPageRef.current = fetchPage;

    const handleFilterChange = useCallback(() => setPage(0), [setPage]);

    const {
        filters,
        debouncedFilters,
        resetFilters,
        setOpenColumn,
        openColumn,
        setFilter,
        columnFilters,
    } = useColumnFilters(filtersConfig, handleFilterChange);

    const backendFilters = columnFilters;

    useEffect(() => {
        const sortChanged =
            prevSortRef.current.sortBy !== sortBy ||
            prevSortRef.current.sortAsc !== sortAsc;

        prevSortRef.current = { sortBy, sortAsc };

        if (sortChanged && page !== 0) {
            setPage(0);
            return;
        }

        if (skipNextFetchRef.current) {
            skipNextFetchRef.current = false;
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        fetchPageRef
            .current(
                {
                    page,
                    size: pageSize,
                    sortBy,
                    sortAsc,
                    filters: backendFilters ?? [],
                },
                controller.signal,
            )
            .then((response) => {
                if (controller.signal.aborted) return;

                setContent(response.content);
                reportMeta({
                    totalItems: response.totalItems,
                    totalItemsInDb: response.totalItemsInDB,
                    totalPages: response.totalPages,
                });
                setError(null);

                if (response.currentPage !== page) {
                    skipNextFetchRef.current = true;
                    setPage(response.currentPage);
                }
            })
            .catch((cause: unknown) => {
                if (!controller.signal.aborted) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Erro ao carregar dados",
                    );
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [page, pageSize, setPage, reportMeta, sortBy, sortAsc, backendFilters]);

    return {
        content,
        loading,
        error,
        totalItems,
        totalItemsInDb,
        sortAsc,
        sortBy,
        toggleSort,
        filters,
        debouncedFilters,
        setFilter,
        resetFilters,
        openColumn,
        setOpenColumn,
    };
}
