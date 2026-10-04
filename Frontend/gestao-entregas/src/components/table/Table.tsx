import { type ReactNode } from "react";
import { TruncatedTableCell } from "./truncatedTableCell/TruncatedTableCell";
import type {
    ColumnFilterConfig,
    ColumnFilterConfigMap,
} from "../../hooks/useColumnFilters";
import { ColumnControls } from "./ColumnControls/ColumnControls";

export interface Column<T> {
    key: keyof T | string;
    header: ReactNode;
    className?: string;
    dataLabel?: string;
    render?: (row: T) => ReactNode;
    hidden?: boolean;
    isStatus?: boolean;
    truncate?: boolean;
    getTruncateText?: (row: T) => string | undefined;
    sortable?: boolean;
    filterConfig?: ColumnFilterConfig;
}

export interface TableSortProps {
    sortBy?: string;
    sortAsc?: boolean;
    onSortChange: (columnKey: string) => void;
}

export interface TableFilterProps {
    openColumn: string | null;
    setOpenColumn: (columnKey: string | null) => void;
    filterConfig: ColumnFilterConfigMap;
    filters: Record<string, string>;
    debouncedFilters?: Record<string, string>;
    setFilter: (columnKey: string, value: string) => void;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    rowKey: (row: T) => string | number;
    className?: string;
    tableClassName?: string;
    emptyState?: ReactNode;
    onRowClick?: (row: T) => void;
    sortProps: TableSortProps;
    filterProps: TableFilterProps;
}

export function Table<T>({
    data,
    columns,
    rowKey,
    tableClassName,
    emptyState,
    onRowClick,
    sortProps: { sortBy, sortAsc, onSortChange },
    filterProps: {
        openColumn,
        setOpenColumn,
        filterConfig,
        filters,
        debouncedFilters,
        setFilter,
    },
}: TableProps<T>) {
    const visibleColumns = columns.filter((col) => !col.hidden);

    const renderCell = (row: T, column: Column<T>) => {
        if (column.render) {
            return column.render(row);
        }

        return (row as Record<string, unknown>)[
            String(column.key)
        ] as ReactNode;
    };

    return (
        <table className={tableClassName} aria-label="Tabela">
            <thead>
                <tr>
                    {visibleColumns.map((col) => {
                        const key = String(col.key);
                        const isSortable =
                            col.sortable !== false && col.filterConfig;
                        return (
                            <th
                                key={key}
                                scope="col"
                                className={col.className}
                                data-column={key}
                            >
                                <div
                                    className={`th-content${col.isStatus ? " status" : ""}`}
                                >
                                    <span>{col.header}</span>
                                    {isSortable && (
                                        <ColumnControls
                                            filterProps={{
                                                columnKey: key,
                                                config: filterConfig[key],
                                                value: filters[key] ?? "",
                                                isOpen: key === openColumn,
                                                isActive:
                                                    !!debouncedFilters?.[key],
                                                onOpenChange: (open) =>
                                                    setOpenColumn?.(
                                                        open ? key : null,
                                                    ),
                                                onChange: (value) =>
                                                    setFilter?.(key, value),
                                            }}
                                            sortProps={{
                                                columnKey: key,
                                                sortBy,
                                                sortAsc,
                                                onSortChange,
                                            }}
                                        />
                                    )}
                                </div>
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={visibleColumns.length}>
                            {emptyState ?? "Nenhum registro"}
                        </td>
                    </tr>
                ) : (
                    data.map((row) => (
                        <tr
                            key={rowKey(row)}
                            onClick={
                                onRowClick ? () => onRowClick?.(row) : undefined
                            }
                            className={
                                onRowClick
                                    ? "data-table__row data-table__row--clickable"
                                    : "data-table__row"
                            }
                        >
                            {visibleColumns.map((col) => {
                                const content = col.render
                                    ? col.render(row)
                                    : String(row[col.key as keyof T] ?? "");
                                if (col.truncate) {
                                    return (
                                        <TruncatedTableCell
                                            key={String(col.key)}
                                            className={col.className}
                                            dataLabel={col.dataLabel}
                                            text={col.getTruncateText?.(row)}
                                        >
                                            {content}
                                        </TruncatedTableCell>
                                    );
                                }

                                return (
                                    <td
                                        key={String(col.key)}
                                        className={col.className}
                                        data-label={col.dataLabel}
                                    >
                                        {col.dataLabel && (
                                            <span className="header-mobile">
                                                {col.dataLabel}&nbsp;
                                            </span>
                                        )}

                                        {renderCell(row, col)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
