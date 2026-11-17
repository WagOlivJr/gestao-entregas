import { useCallback, useState } from "react";

export interface TableSortState {
    sortBy?: string;
    sortAsc?: boolean;
}

export function useTableSort(initial: Partial<TableSortState> = {}) {
    const [state, setState] = useState<TableSortState>({
        sortBy: initial.sortBy ?? undefined,
        sortAsc: initial.sortAsc ?? undefined,
    });

    const toggleSort = useCallback((columnKey: string) => {
        setState((prev) => {
            if (prev.sortBy !== columnKey) {
                return { sortBy: columnKey, sortAsc: true };
            }
            if (prev.sortAsc) {
                return { sortBy: columnKey, sortAsc: false };
            }
            return { sortBy: undefined, sortAsc: undefined };
        });
    }, []);

    const reset = useCallback(
        () => setState({ sortBy: undefined, sortAsc: undefined }),
        [],
    );

    return { ...state, toggleSort, reset };
}
