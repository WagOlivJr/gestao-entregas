import type { Customer } from "./Customer";
import { useModuleTable } from "../../shared/hooks/useModuleTable";
import { customersService } from "./services/customersService";
import { ModulePage } from "../../shared/components/ModulePage";
import {
    customersColumns,
    customersFilterConfig,
} from "./columns/customersColumns";
import { useMemo } from "react";
import { openCustomerDetails } from "./open-customer-details";
import { useDialog } from "../../shared/contexts/dialog-context";
import { CustomersListProvider } from "./components/customer-details-loader/contexts/customers-list-context";
import { ActiveFiltersBar } from "../../shared/components/table/columnsFilter/activeFiltersBar";
import { TableWrapper } from "../../shared/components/table/TableWrapper";
import { CustomersForm } from "./components/form/CustomersForm";

export function CustomersPage() {
    return (
        <ModulePage<Customer>
            title="Gerenciamento de Clientes"
            renderList={({ refreshToken, onEdit }) => (
                <CustomersList refreshToken={refreshToken} onEdit={onEdit} />
            )}
            renderForm={({ item, onCancel, onSaved }) => (
                <CustomersForm
                    customer={item}
                    onSaved={onSaved}
                    onCancel={onCancel}
                />
            )}
            addItemBtnLabel="Novo Cliente"
        ></ModulePage>
    );
}

export function CustomersList({
    refreshToken,
    onEdit,
}: {
    refreshToken: number;
    onEdit: (customer: Customer) => void;
}) {
    const {
        content: customers,
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
    } = useModuleTable(customersService.list, customersFilterConfig, {
        silentFetch: false,
        refreshToken,
    });

    const { openDialog } = useDialog();

    const actionsCtx = useMemo(
        () => ({ onEdit, onSuccess }),
        [onEdit, onSuccess],
    );

    const onRowClick = (customer: Customer) =>
        openCustomerDetails(openDialog, customer.id, {
            onEdit,
            onSuccess,
        });

    if (error) return <div role="alert">{error}</div>;

    return (
        <CustomersListProvider value={actionsCtx}>
            <ActiveFiltersBar
                config={customersFilterConfig}
                filters={filters}
                totalItems={totalItems}
                totalItemsInDb={totalItemsInDb}
                onReset={resetFilters}
            />
            <TableWrapper
                data={customers}
                columns={customersColumns}
                rowKey={(customer) => customer.id}
                tableClassName="data-table customers"
                emptyState="Nenhum cliente encontrado"
                onRowClick={onRowClick}
                sortProps={{ sortBy, sortAsc, onSortChange: toggleSort }}
                filterProps={{
                    filterConfig: customersFilterConfig,
                    filters,
                    debouncedFilters,
                    openColumn,
                    setFilter,
                    setOpenColumn,
                }}
            />
        </CustomersListProvider>
    );
}
