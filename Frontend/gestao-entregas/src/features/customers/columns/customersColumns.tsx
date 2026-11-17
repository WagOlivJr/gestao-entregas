import type { Column } from "../../../shared/components/table/Table";
import type { ColumnFilterConfigMap } from "../../../shared/hooks/useColumnFilters";
import type { BasicEntityStatus } from "../../../shared/types/status";
import { formatPhone } from "../../../shared/utils/text/textFormatter";
import { CustomersActions } from "../components/customer-details-loader/CustomersActions";
import type { Customer } from "../Customer";

const STATUSES: Record<BasicEntityStatus, string> = {
    active: "ATIVO",
    inactive: "INATIVO",
};

const customersDataColumns: Column<Customer>[] = [
    {
        key: "id",
        header: "Id",
        className: "customers-table_id-column data-table__cell",
        headerMobile: "Id:",
    },
    {
        key: "name",
        header: "Nome",
        className: "customers-table_name-column data-table__cell",
        headerMobile: "Nome:",
        getTooltipText: (customer) => customer.name,
        showTooltipOn: "truncated",
    },
    {
        key: "address",
        header: "Endereço",
        className: "customers-table_address-column data-table__cell",
        headerMobile: "Endereço:",
        render: (customer) =>
            `${customer.address.street}, ${customer.address.number || "S/N"}, ${customer.address.neighborhood}`,
        showTooltipOn: "truncated",
        sortRequestKey: "addressSearch",
    },
    {
        key: "phone",
        header: "Telefone",
        className: "customers-table_phone-column data-table__cell",
        headerMobile: "Telefone:",
        render: (customer) => formatPhone(customer.phone),
    },
    {
        key: "status",
        header: "Status",
        className: "customers-table_status-column",
        headerMobile: "Status:",
        render: (customer) => (
            <span
                className="status-badge data-table__status-badge"
                data-status={customer.status}
            >
                {STATUSES[customer.status] ?? "-"}
            </span>
        ),
        isStatus: true,
    },
];

export const customersActionsColumn: Column<Customer> = {
    key: "actions",
    header: "Ações",
    sortable: false,
    className:
        "customes-table_actions-column data-table__cell data-table__cell-actions",
    render: (customer) => <CustomersActions customer={customer} />,
};

export const customersColumns: Column<Customer>[] = [
    ...customersDataColumns,
    customersActionsColumn,
];

// export const customersFilterConfig =
//     customersDataColumns.reduce<ColumnFilterConfigMap>((acc, col) => {
//         if (col.filterConfig) acc[col.key] = col.filterConfig;
//         return acc;
//     }, {});

export const customersFilterConfig: ColumnFilterConfigMap = {
    id: {
        label: "Id",
        type: "number",
    },
    name: {
        label: "Nome",
        type: "text",
    },
    status: {
        label: "Status",
        type: "select",
        options: [
            { label: "Ativos", value: "active" },
            { label: "Inativos", value: "inactive" },
        ],
    },
    address: {
        label: "Endereço",
        type: "text",
        requestField: "addressSearch",
    },
    phone: {
        label: "Telefone",
        type: "number",
        operator: "LIKE",
    },
};
