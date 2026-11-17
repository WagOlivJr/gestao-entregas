import type {
    ColumnFilterConfigMap,
    FilterValue,
} from "../../../hooks/useColumnFilters";

export interface ActiveFiltersBarProps {
    config: ColumnFilterConfigMap;
    filters: Record<string, FilterValue>;
    totalItems: number;
    totalItemsInDb: number;
    onReset: () => void;
}

function describeFilterValue(
    columnKey: string,
    value: FilterValue,
    config: ColumnFilterConfigMap,
): string {
    const columnConfig = config[columnKey];
    // if (
    //     columnConfig?.type === "select" &&
    //     !Array.isArray(columnConfig.options)
    // ) {
    //     return columnConfig.options?.[value] ?? value;
    // }
    if (columnConfig?.type === "select") {
        return (
            columnConfig.options?.find(
                (option) => option.value === String(value),
            )?.label ?? String(value)
        );
    }

    return String(value);
}

export function ActiveFiltersBar({
    config,
    filters,
    totalItems,
    totalItemsInDb,
    onReset,
}: ActiveFiltersBarProps) {
    const entries = Object.entries(filters);
    if (entries.length === 0) return null;

    const summary = entries
        .map(
            ([columnKey, value]) =>
                `${config[columnKey]?.label ?? columnKey}: '${describeFilterValue(columnKey, value, config)}'`,
        )
        .join(", ");

    const resultsText =
        totalItems === 0
            ? "Nenhum registro encontrado"
            : `Encontrado${totalItems === 1 ? "" : "s"} ${totalItems} de ${totalItemsInDb} registros.`;

    return (
        <div className="table-filter-indicator filter-indicator">
            <span>Filtros ativos: [{summary}].</span> <span>{resultsText}</span>
            <button
                type="button"
                className="table-filter-reset"
                onClick={onReset}
            >
                Limpar Filtros
            </button>
        </div>
    );
}
