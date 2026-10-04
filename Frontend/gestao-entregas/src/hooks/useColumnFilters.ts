import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColumnFilter } from "../types/pageRequest";

export type ColumnFilterType = "text" | "select" | "number" | "date";

export interface ColumnFilterConfig {
    type: ColumnFilterType;
    label: string;
    placeholder?: string;
    options?: Option[];
    debounceMs?: number;
}

export type ColumnFilterConfigMap = Record<string, ColumnFilterConfig>;

function defaultDebounce(type: ColumnFilterType | undefined): number {
    return type === "select" ? 150 : 1000;
}

export type Option = { label: string; value: string };

export interface UseColumnFiltersReturn {
    filters: Record<string, string>;
    debouncedFilters: Record<string, string>;
    columnFilters: ColumnFilter[];
    hasActiveFilters: boolean;
    openColumn: string | null;
    setOpenColumn: (columnKey: string | null) => void;
    setFilter: (columnKey: string, value: string) => void;
    resetFilters: () => void;
}

export function useColumnFilters(
    config: ColumnFilterConfigMap,
    onFiltersChange?: () => void,
): UseColumnFiltersReturn {
    const [filters, setFiltersState] = useState<Record<string, string>>({});
    const [debouncedFilters, setDebouncedFilters] = useState<
        Record<string, string>
    >({});
    const [openColumn, setOpenColumn] = useState<string | null>(null);
    const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const columnFilters = useMemo(
        () => toColumnFilters(debouncedFilters, config),
        [debouncedFilters, config],
    );

    const commit = useCallback(
        (columnKey: string, value: string) => {
            setDebouncedFilters((prev) => {
                if (value === "") {
                    if (!(columnKey in prev)) return prev;
                    const next = { ...prev };
                    delete next[columnKey];
                    return next;
                }
                if (prev[columnKey] === value) return prev;
                return { ...prev, [columnKey]: value };
            });
            onFiltersChange?.();
        },
        [onFiltersChange],
    );

    const setFilter = useCallback(
        (columnKey: string, value: string) => {
            setFiltersState((prev) => ({ ...prev, [columnKey]: value }));
            clearTimeout(timersRef.current[columnKey]);

            if (value === "") {
                delete timersRef.current[columnKey];
                commit(columnKey, "");
                return;
            }

            const delay =
                config[columnKey]?.debounceMs ??
                defaultDebounce(config[columnKey]?.type);

            timersRef.current[columnKey] = setTimeout(() => {
                commit(columnKey, value);
            }, delay);
        },
        [config, commit],
    );

    const resetFilters = useCallback(() => {
        Object.values(timersRef.current).forEach(clearTimeout);
        timersRef.current = {};
        setFiltersState({});
        setOpenColumn(null);
        setDebouncedFilters({});
        onFiltersChange?.();
    }, [onFiltersChange]);

    useEffect(() => {
        Object.values(timersRef.current).forEach(clearTimeout);
    }, []);

    return {
        filters,
        debouncedFilters,
        columnFilters,
        hasActiveFilters: Object.keys(debouncedFilters).length > 0,
        openColumn,
        setOpenColumn,
        setFilter,
        resetFilters,
    };
}

function toColumnFilters(
    debouncedFilter: Record<string, string>,
    config: ColumnFilterConfigMap,
): ColumnFilter[] {
    return Object.entries(debouncedFilter).map(([field, value]) => ({
        field,
        value,
        operator: config[field]?.type === "text" ? "LIKE" : "EQ",
    }));
}
