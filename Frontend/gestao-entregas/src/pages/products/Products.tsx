import { productsService } from "../../services/productsService";
import { TableWrapper } from "../../components/TableWrapper";
import { productsColumns } from "../../components/products/productsColumns";
import { useModuleTable } from "../../hooks/useModuleTable";
import { ActiveFiltersBar } from "../../components/table/columnsFilter/activeFiltersBar";
import { type ColumnFilterConfigMap } from "../../hooks/useColumnFilters";

const filterConfig = productsColumns.reduce<ColumnFilterConfigMap>(
    (acc, col) => {
        if (col.filterConfig) acc[col.key] = col.filterConfig;
        return acc;
    },
    {},
);

export function Products() {
    const {
        content: products,
        error,
        loading,
        totalItems,
        totalItemsInDb,
        sortBy,
        sortAsc,
        toggleSort,
        filters,
        resetFilters,
        openColumn,
        setOpenColumn,
        debouncedFilters,
        setFilter,
    } = useModuleTable(productsService.list, filterConfig);

    if (loading) return <div role="status">Carregando...</div>;
    if (error) return <div role="alert">{error}</div>;

    return (
        <>
            <ActiveFiltersBar
                config={filterConfig}
                filters={filters}
                totalItems={totalItems}
                totalItemsInDb={totalItemsInDb}
                onReset={resetFilters}
            />
            <TableWrapper
                data={products}
                columns={productsColumns}
                rowKey={(product) => product.id}
                tableClassName="data-table products"
                emptyState="Nenhum produto encontrado"
                onRowClick={(product) => console.log("Row clicked!:", product)}
                sortProps={{ sortBy, sortAsc, onSortChange: toggleSort }}
                filterProps={{
                    filterConfig,
                    filters,
                    debouncedFilters,
                    openColumn,
                    setFilter,
                    setOpenColumn,
                }}
            />
            <div className="items-form"></div>
        </>
    );
}
