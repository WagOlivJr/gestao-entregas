import { useMemo } from "react";
import { useDialog } from "../../shared/contexts/dialog-context";
import { useModuleTable } from "../../shared/hooks/useModuleTable";
import {
    deliveriesDataColumns,
    deliveriesFilterConfig,
} from "./columns/deliveriesColumns";
import type { Delivery } from "./types/delivery";
import { deliveriesService } from "./services/deliveriesService";
import { DeliveriesListProvider } from "./contexts/customers-list-context";
import { ActiveFiltersBar } from "../../shared/components/table/columnsFilter/activeFiltersBar";
import { TableWrapper } from "../../shared/components/table/TableWrapper";
import { ModulePage } from "../../shared/components/ModulePage";
import { openDeliveryDetails } from "./open-deliveries-details";
import { DeliveriesForm } from "./components/form/DeliveriesForm";

export function DeliveriesPage() {
    return (
        <ModulePage<Delivery>
            title="Gerenciamento de Entregas"
            renderList={({ refreshToken, onEdit }) => (
                <DeliveriesList refreshToken={refreshToken} onEdit={onEdit} />
            )}
            renderForm={({ item, onCancel, onSaved }) => (
                <DeliveriesForm
                    delivery={item}
                    onSaved={onSaved}
                    onCancel={onCancel}
                />
            )}
            addItemBtnLabel="Nova Entrega"
        ></ModulePage>
    );
}

function DeliveriesList({
    refreshToken,
    onEdit,
}: {
    refreshToken: number;
    onEdit: (delivery: Delivery) => void;
}) {
    const {
        content: deliveries,
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
        refetch: onSuccess,
        filterModes,
        setFilterMode,
    } = useModuleTable(deliveriesService.list, deliveriesFilterConfig, {
        silentFetch: false,
        refreshToken,
    });

    const { openDialog } = useDialog();

    const actionsCtx = useMemo(
        () => ({
            onEdit, //: (item: Delivery) => console.log("edit item " + item?.id),
            onSuccess,
        }),
        [onEdit, onSuccess],
    );

    const onRowClick = (delivery: Delivery) =>
        openDeliveryDetails(openDialog, delivery.id, {
            onEdit: (item: Delivery) => console.log("edit item " + item?.id),
            onSuccess,
        });

    if (error) return <div role="alert">{error}</div>;

    return (
        <DeliveriesListProvider value={actionsCtx}>
            <ActiveFiltersBar
                config={deliveriesFilterConfig}
                filters={debouncedFilters}
                totalItems={totalItems}
                totalItemsInDb={totalItemsInDb}
                onReset={resetFilters}
            />
            <TableWrapper
                data={deliveries}
                columns={deliveriesDataColumns}
                rowKey={(customer) => customer.id}
                tableClassName="data-table deliveries"
                emptyState="Nenhuma entrega encontrada"
                onRowClick={onRowClick}
                sortProps={{ sortBy, sortAsc, onSortChange: toggleSort }}
                filterProps={{
                    filterConfig: deliveriesFilterConfig,
                    filters,
                    debouncedFilters,
                    openColumn,
                    setFilter,
                    setOpenColumn,
                    filterModes,
                    setFilterMode,
                }}
            />
        </DeliveriesListProvider>
    );
}
