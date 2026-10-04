import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { getPageNumbers } from "./usePaginator";
import { useItemsPerPageStore } from "../stores/itemsPerPageStore";

export interface PaginationMeta {
    totalItems: number;
    totalItemsInDb: number;
    totalPages: number;
}

export interface ModulePaginationContextValue {
    page: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    totalItemsInDb: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    pageNumbers: number[];
    goToPage: (displayPage: number) => void;
    setPage: (page: number) => void;
    reportMeta: (meta: PaginationMeta) => void;
}

const ModulePaginationContext =
    createContext<ModulePaginationContextValue | null>(null);

export interface ModulePaginationProviderProps {
    pageSize?: number;
    visiblePages?: number;
    children: ReactNode;
}

export function ModulePaginationProvider({
    pageSize,
    visiblePages = 5,
    children,
}: ModulePaginationProviderProps) {
    const [page, setPageState] = useState(0);
    const [meta, setMeta] = useState<PaginationMeta>({
        totalItems: 0,
        totalItemsInDb: 0,
        totalPages: 1,
    });
    const itemsPerPage = useItemsPerPageStore((s) => s.itemsPerPage);
    const effectivePageSize = pageSize ?? itemsPerPage;

    const reportMeta = useCallback((next: PaginationMeta) => setMeta(next), []);
    const goToPage = useCallback(
        (displayPage: number) => {
            const zeroBased = displayPage - 1;
            setPageState((prev) => {
                if (zeroBased < 0 || zeroBased > meta.totalPages - 1) {
                    return prev;
                }
                return zeroBased;
            });
        },
        [meta.totalPages],
    );

    const setPage = useCallback((next: number) => {
        setPageState(next);
    }, []);

    const value = useMemo<ModulePaginationContextValue>(
        () => ({
            page,
            pageSize: effectivePageSize,
            currentPage: page + 1,
            totalPages: meta.totalPages,
            totalItems: meta.totalItems,
            totalItemsInDb: meta.totalItemsInDb,
            hasPreviousPage: page > 0,
            hasNextPage: page < meta.totalPages - 1,
            pageNumbers: getPageNumbers(
                page + 1,
                meta.totalPages,
                visiblePages,
            ),
            goToPage,
            reportMeta,
            setPage,
        }),
        [
            page,
            meta,
            goToPage,
            setPage,
            reportMeta,
            effectivePageSize,
            visiblePages,
        ],
    );

    return (
        <ModulePaginationContext.Provider value={value}>
            {children}
        </ModulePaginationContext.Provider>
    );
}

export function useModulePagination(): ModulePaginationContextValue {
    const ctx = useContext(ModulePaginationContext);
    if (!ctx)
        throw new Error(
            "useModulePagination precisa estar dentro de um ModuleLayout",
        );
    return ctx;
}
