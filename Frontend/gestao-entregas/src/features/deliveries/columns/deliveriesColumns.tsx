import type { Column } from "../../../shared/components/table/Table";
import type { ColumnFilterConfigMap } from "../../../shared/hooks/useColumnFilters";
import { toDDMMYYYY } from "../../../shared/utils/time/dateTimeConvertion";
import { DeliveryActions } from "../components/actions/DeliveryActions";
import type { Delivery, DeliveryStatus } from "../types/delivery";

const STATUSES: Record<DeliveryStatus, string> = {
    pending: "PENDENTE",
    assigned: "ATRIBUÍDA",
    inProgress: "EM ANDAMENTO",
    completed: "CONCLUÍDA",
    canceled: "CANCELADA",
};

export const deliveriesDataColumns: Column<Delivery>[] = [
    {
        key: "id",
        header: "Id",
        className: "deliveries-table_id-column data-table__cell",
        headerMobile: "Id:",
    },
    {
        key: "customer",
        header: "Cliente",
        className: "",
        headerMobile: "Cliente:",
        render: (delivery) => delivery.customer.name,
        getTooltipText: (delivery) =>
            `#${delivery.customer.id} - ${delivery.customer.name}`,
        showTooltipOn: "all",
        sortRequestKey: "customer.name",
    },
    {
        key: "status",
        header: "Status",
        className: "deliveries-table_status-column status-cell",
        headerMobile: "Status:",
        render: (delivery) => (
            <span
                className="status-badge data-table__status-badge"
                data-status={delivery.status}
            >
                {STATUSES[delivery.status] ?? "-"}
            </span>
        ),
        isStatus: true,
    },
    {
        key: "purchaseDate",
        header: "Data Compra",
        className: "",
        headerMobile: "Data da Compra:",
        render: (delivery) => toDDMMYYYY(delivery.purchaseDate),
    },
    {
        key: "deliveryDate",
        header: "Data Entrega",
        className: "",
        headerMobile: "Data da Entrega:",
        render: (delivery) => toDDMMYYYY(delivery.deliveryDate),
    },
    {
        key: "actions",
        header: "Ações",
        sortable: false,
        className:
            "deliveries-table_actions-column data-table__cell data-table__cell-actions",
        render: (delivery) => <DeliveryActions delivery={delivery} />,
    },
];

export const deliveriesFilterConfig: ColumnFilterConfigMap = {
    id: {
        label: "Id",
        type: "number",
    },
    customer: {
        label: "Nome",
        type: "text",
        requestField: "customer.name",
        operator: "LIKE",
        placeholder: "Buscar por nome...",
        title: "Buscar cliente por nome",

        modes: {
            id: {
                label: "ID",
                type: "number",
                requestField: "customer.id",
                operator: "EQ",
                placeholder: "Buscar por ID...",
                title: "Buscar cliente por ID",
                debounceMs: 250,
                min: 1,
                step: 1,
            },
        },

        modeToggle: {
            mode: "id",
            label: "Buscar por ID",
        },
    },

    status: {
        label: "Status",
        type: "select",
        options: [
            { label: "Pendentes", value: "pending", key: "pending" },
            { label: "Atribuídas", value: "assigned", key: "assigned" },
            { label: "Em Andamento", value: "inProgress", key: "inProgress" },
            { label: "Concluídas", value: "completed", key: "completed" },
            { label: "Canceladas", value: "canceled", key: "canceled" },
            {
                label: "Finalizadas",
                value: ["canceled", "completed"],
                key: "open",
            },
            {
                label: "Abertas",
                value: ["pending", "assigned", "inProgress"],
                key: "closed",
            },
        ],
    },

    purchaseDate: {
        label: "Data de compra",
        type: "date",
        operator: "EQ",
    },
};

// export const _deliveriesFilterConfig: _ColumnFilterConfigMap = {
//     id: {
//         defaultMode: "id",
//         modes: {
//             id: { label: "Id", type: "number" },
//         },
//     },
//     customer: {
//         defaultMode: "name",
//         modes: {
//             name: {
//                 label: "Nome",
//                 type: "text",
//                 requestField: "customer.name",
//                 operator: "LIKE",
//             },
//             id: {
//                 label: "ID",
//                 type: "number",
//                 requestField: "customer.id",
//                 operator: "EQ",
//             },
//         },
//     },

//     status: {
//         defaultMode: "status",
//         modes: {
//             current: {
//                 label: "Status",
//                 type: "select",
//                 options: [
//                     { label: "Pendentes", value: "pending" },
//                     { label: "Atribuídas", value: "assigned" },
//                     { label: "Em Andamento", value: "inProgress" },
//                     { label: "Finalizadas", value: "completed" },
//                     { label: "Canceladas", value: "canceled" },
//                 ],
//             },
//         },
//     },

//     purchaseDate: {
//         defaultMode: "current",
//         modes: {
//             current: {
//                 label: "Data de compra",
//                 type: "date",
//                 operator: "EQ",
//             },
//         },
//     },
// };
