import { productsService } from "./services/productsService";
import { createProductsColumns, productsFilterConfig } from "./productsColumns";
import { useModuleTable } from "../../shared/hooks/useModuleTable";
import { ActiveFiltersBar } from "../../shared/components/table/columnsFilter/activeFiltersBar";
import type { Product } from "./Product";
import { useDialog } from "../../shared/contexts/dialog-context";
import { ProductDetailsLoader } from "./components/productDetails/ProductDetailsLoader";
import { ProductsForm } from "./components/form/ProductsForm";
import { ModulePage } from "../../shared/components/ModulePage";
import { useMemo } from "react";
import { ProductsListProvider } from "./contexts/products-list-context";
import { TableWrapper } from "../../shared/components/table/TableWrapper";

export function ProductsPage() {
    return (
        <ModulePage<Product>
            title="Gerenciamento de Produtos"
            renderList={({ refreshToken, onEdit }) => (
                <ProductsList refreshToken={refreshToken} onEdit={onEdit} />
            )}
            renderForm={({ item, onCancel, onSaved }) => (
                <ProductsForm
                    product={item}
                    onCancel={onCancel}
                    onSaved={onSaved}
                />
            )}
            addItemBtnLabel="Novo Produto"
        />
    );
}

function ProductsList({
    refreshToken,
    onEdit,
}: {
    refreshToken: number;
    onEdit: (product: Product) => void;
}) {
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
        refetch,
    } = useModuleTable(productsService.list, productsFilterConfig, {
        silentFetch: false,
        refreshToken,
    });
    const columns = useMemo(
        () => createProductsColumns(onEdit, refetch),
        [onEdit, refetch],
    );
    const { openDialog } = useDialog();

    const actionsCtx = useMemo(
        () => ({ onEdit, onSuccess: refetch }),
        [onEdit, refetch],
    );

    const onRowClick = (product: Product) => {
        openDialog({
            title: `Detalhes do produto #${product.id}`,
            content: (
                <ProductDetailsLoader
                    productId={product.id}
                    // initialProduct={product}
                    onEdit={onEdit}
                    onSuccess={refetch}
                />
            ),
            showCloseButton: true,
            dismissOnEscape: true,
            dismissOnOutsideClick: true,
        });
    };

    if (error) return <div role="alert">{error}</div>;

    return (
        <ProductsListProvider value={actionsCtx}>
            <ActiveFiltersBar
                config={productsFilterConfig}
                filters={filters}
                totalItems={totalItems}
                totalItemsInDb={totalItemsInDb}
                onReset={resetFilters}
            />
            <TableWrapper
                data={products}
                columns={columns}
                rowKey={(product) => product.id}
                tableClassName="data-table products"
                emptyState="Nenhum produto encontrado"
                onRowClick={onRowClick}
                sortProps={{ sortBy, sortAsc, onSortChange: toggleSort }}
                filterProps={{
                    filterConfig: productsFilterConfig,
                    filters,
                    debouncedFilters,
                    openColumn,
                    setFilter,
                    setOpenColumn,
                }}
            />
        </ProductsListProvider>
    );
}
