import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColumnFilter } from "../types/pageRequest";

export type ColumnFilterType = "text" | "select" | "number" | "date";

export interface ColumnFilterConfig {
    type: ColumnFilterType;
    label: string;
    requestField?: string;
    operator?: ColumnFilter["operator"];
    placeholder?: string;
    options?: Option[];
    debounceMs?: number;
    title?: string;
}

export interface ColumnFilterModeConfig {
    type: ColumnFilterType;
    label: string;
    requestField?: string;
    operator?: ColumnFilter["operator"];
    placeholder?: string;
    options?: Option[];
    debounceMs?: number;
    title?: string;
    //avaliar necessidade:
    min?: number;
    max?: number;
    step?: number;
}

export interface ColumnFilterConfig extends ColumnFilterModeConfig {
    modes?: Record<string, ColumnFilterModeConfig>;
    modeToggle?: { mode: string; label: string };
}

export type ColumnFilterConfigMap = Partial<Record<string, ColumnFilterConfig>>;

function defaultDebounce(type: ColumnFilterType | undefined): number {
    return type === "select" ? 150 : 1000;
}

export type FilterValue = string | string[];

export type Option = { label: string; value: FilterValue; key?: string };

export interface UseColumnFiltersReturn {
    filters: Record<string, FilterValue>;
    debouncedFilters: Record<string, FilterValue>;
    columnFilters: ColumnFilter[];
    hasActiveFilters: boolean;
    openColumn: string | null;
    filterModes: Record<string, string>;
    setOpenColumn: (columnKey: string | null) => void;
    setFilter: (columnKey: string, value: FilterValue) => void;
    setFilterMode: (columnKey: string, mode?: string) => void;
    resetFilters: () => void;
}

export function resolveColumnFilterConfig(
    config: ColumnFilterConfig,
    mode?: string,
): ColumnFilterModeConfig {
    if (mode && config.modes) {
        return config.modes[mode];
    }
    return config;
}

export function useColumnFilters(
    config: ColumnFilterConfigMap,
    onFiltersChange?: () => void,
): UseColumnFiltersReturn {
    const [filters, setFiltersState] = useState<Record<string, FilterValue>>(
        {},
    );
    const [debouncedFilters, setDebouncedFilters] = useState<
        Record<string, FilterValue>
    >({});

    const [filterModes, setFilterModes] = useState<Record<string, string>>({});
    const [openColumn, setOpenColumn] = useState<string | null>(null);
    const [appliedFilterModes, setAppliedFilterModes] = useState<
        Record<string, string>
    >({});

    const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const columnFilters = useMemo(
        () => toColumnFilters(debouncedFilters, appliedFilterModes, config),
        [debouncedFilters, appliedFilterModes, config],
    );

    const commit = useCallback(
        (columnKey: string, value: FilterValue, mode?: string) => {
            const hasCurrentValue = Object.prototype.hasOwnProperty.call(
                debouncedFilters,
                columnKey,
            );

            const currentMode = appliedFilterModes[columnKey];

            if (CheckEmptyValue(value)) {
                if (!hasCurrentValue) return;

                setDebouncedFilters((prev) => removeKey(prev, columnKey));
                setAppliedFilterModes((prev) => removeKey(prev, columnKey));
            } else {
                const effectiveMode =
                    mode && config[columnKey]?.modes?.[mode] ? mode : undefined;
                if (
                    isSameFilterValue(debouncedFilters[columnKey], value) &&
                    currentMode === effectiveMode
                ) {
                    return;
                }

                setDebouncedFilters((prev) =>
                    prev[columnKey] === value
                        ? prev
                        : { ...prev, [columnKey]: value },
                );

                setAppliedFilterModes((prev) => {
                    if (!effectiveMode) {
                        return removeKey(prev, columnKey);
                    }

                    if (prev[columnKey] === effectiveMode) {
                        return prev;
                    }

                    return { ...prev, [columnKey]: effectiveMode };
                });
            }
            onFiltersChange?.();
        },
        [appliedFilterModes, config, debouncedFilters, onFiltersChange],
    );

    const setFilter = useCallback(
        (columnKey: string, value: FilterValue) => {
            setFiltersState((prev) => {
                if (CheckEmptyValue(value)) {
                    return removeKey(prev, columnKey);
                }

                if (prev[columnKey] === value) {
                    return prev;
                }

                return { ...prev, [columnKey]: value };
            });

            const timer = timersRef.current[columnKey];

            if (timer !== undefined) {
                clearTimeout(timer);
            }

            if (CheckEmptyValue(value)) {
                delete timersRef.current[columnKey];
                commit(columnKey, "");
                return;
            }

            const baseConfig = config[columnKey];
            const activeConfig = baseConfig
                ? resolveColumnFilterConfig(baseConfig, filterModes[columnKey])
                : undefined;

            const delay =
                activeConfig?.debounceMs ?? defaultDebounce(activeConfig?.type);

            const mode = filterModes[columnKey];

            timersRef.current[columnKey] = setTimeout(() => {
                delete timersRef.current[columnKey];
                commit(columnKey, value, mode);
            }, delay);
        },
        [filterModes, config, commit],
    );

    const setFilterMode = useCallback(
        (columnKey: string, mode?: string) => {
            const columnConfig = config[columnKey];
            const alternateMode = columnConfig?.modeToggle?.mode;

            if (
                !columnConfig ||
                !alternateMode ||
                !columnConfig?.modes?.[alternateMode]
            ) {
                return;
            }

            if (mode !== undefined && mode !== alternateMode) {
                return;
            }

            const timer = timersRef.current[columnKey];
            if (timer !== undefined) {
                clearTimeout(timer);
                delete timersRef.current[columnKey];
            }

            const hadAppliedFilter = Object.prototype.hasOwnProperty.call(
                debouncedFilters,
                columnKey,
            );

            setFilterModes((prev) =>
                mode
                    ? { ...prev, [columnKey]: mode }
                    : removeKey(prev, columnKey),
            );

            setFiltersState((prev) => removeKey(prev, columnKey));
            setDebouncedFilters((prev) => removeKey(prev, columnKey));
            setAppliedFilterModes((prev) => removeKey(prev, columnKey));

            if (hadAppliedFilter) {
                onFiltersChange?.();
            }
        },
        [config, debouncedFilters, filterModes, onFiltersChange],
    );

    const resetFilters = useCallback(() => {
        Object.values(timersRef.current).forEach(clearTimeout);
        timersRef.current = {};

        setFiltersState({});
        setOpenColumn(null);
        setDebouncedFilters({});
        setFilterModes({});
        setAppliedFilterModes({});

        onFiltersChange?.();
    }, [onFiltersChange]);

    useEffect(
        () => () => Object.values(timersRef.current).forEach(clearTimeout),
        [],
    );

    return {
        filters,
        debouncedFilters,
        columnFilters,
        hasActiveFilters: Object.keys(debouncedFilters).length > 0,
        openColumn,
        filterModes,
        setOpenColumn,
        setFilter,
        setFilterMode,
        resetFilters,
    };
}

function toColumnFilters(
    debouncedFilter: Record<string, string | string[]>,
    appliedFilterModes: Record<string, string>,
    config: ColumnFilterConfigMap,
): ColumnFilter[] {
    return Object.entries(debouncedFilter).map(([columnKey, value]) => {
        const baseConfig = config[columnKey];
        const activeConfig = baseConfig
            ? resolveColumnFilterConfig(
                  baseConfig,
                  appliedFilterModes[columnKey],
              )
            : undefined;

        if (Array.isArray(value)) {
            return {
                field: activeConfig?.requestField ?? columnKey,
                operator: "IN",
                values: value,
            };
        }

        return {
            field: activeConfig?.requestField ?? columnKey,
            operator:
                activeConfig?.operator ??
                (activeConfig?.type === "text" ? "LIKE" : "EQ"),
            value,
        } as ColumnFilter;
    });
}

function removeKey<T>(
    values: Record<string, T>,
    key: string,
): Record<string, T> {
    if (!Object.prototype.hasOwnProperty.call(values, key)) {
        return values;
    }

    const next = { ...values };
    delete next[key];
    return next;
}

function CheckEmptyValue(value: FilterValue) {
    return value === "" || (Array.isArray(value) && value.length === 0);
}

function isSameFilterValue(a?: FilterValue, b?: FilterValue): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((v, i) => v === b[i]);
    }

    return a === b;
}
