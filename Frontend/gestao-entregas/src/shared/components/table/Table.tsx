import { type ReactNode } from "react";
import type {
    ColumnFilterConfigMap,
    FilterValue,
} from "../../hooks/useColumnFilters";
import { ColumnControls } from "./ColumnControls/ColumnControls";
import { TableCell, type CellTooltipType } from "./tableCell/TableCell";

export interface Column<T> {
    key: keyof T | string;
    header: ReactNode;
    className?: string;
    headerMobile?: string;
    render?: (row: T) => ReactNode;
    hidden?: boolean;
    isStatus?: boolean;
    showTooltipOn?: CellTooltipType;
    getTooltipText?: (row: T) => string | undefined;
    sortable?: boolean;
    sortRequestKey?: string;
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
    filters: Record<string, FilterValue>;
    debouncedFilters: Record<string, FilterValue>;
    setFilter: (columnKey: string, value: string) => void;
    filterModes?: Record<string, string>;
    setFilterMode?: (columnKey: string, mode?: string) => void;
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
        filterModes,
        setFilterMode,
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
                        const columnFilterConfig = filterConfig[key];

                        const canFilter = columnFilterConfig !== undefined;
                        const canSort =
                            col.sortable === true ||
                            (col.sortable !== false && canFilter);
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
                                    {(canFilter || canSort) && (
                                        <ColumnControls
                                            filterProps={
                                                columnFilterConfig
                                                    ? {
                                                          columnKey: key,
                                                          config: columnFilterConfig,
                                                          value:
                                                              filters[key] ??
                                                              "",
                                                          isOpen:
                                                              key ===
                                                              openColumn,
                                                          isActive:
                                                              !!debouncedFilters?.[
                                                                  key
                                                              ],
                                                          onOpenChange: (
                                                              open,
                                                          ) =>
                                                              setOpenColumn?.(
                                                                  open
                                                                      ? key
                                                                      : null,
                                                              ),
                                                          onChange: (value) =>
                                                              setFilter?.(
                                                                  key,
                                                                  value,
                                                              ),
                                                          mode: filterModes?.[
                                                              key
                                                          ],
                                                          onModeChange:
                                                              setFilterMode
                                                                  ? (mode) =>
                                                                        setFilterMode(
                                                                            key,
                                                                            mode,
                                                                        )
                                                                  : undefined,
                                                      }
                                                    : undefined
                                            }
                                            sortProps={
                                                canSort
                                                    ? {
                                                          columnKey:
                                                              col.sortRequestKey ??
                                                              key,
                                                          sortBy,
                                                          sortAsc,
                                                          onSortChange,
                                                      }
                                                    : undefined
                                            }
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
                                const key = String(col.key);
                                const content = renderCell(row, col);
                                const tooltip =
                                    col.showTooltipOn &&
                                    (col.getTooltipText?.(row) ?? content);

                                return (
                                    <TableCell
                                        key={key}
                                        className={col.className}
                                        headerMobile={col.headerMobile}
                                        tooltip={tooltip}
                                        tooltipType={col.showTooltipOn}
                                    >
                                        {content}
                                    </TableCell>
                                );
                            })}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
