import type { Product } from "../../entities/Product";
import type { Column } from "../table/Table";

const STATUSES: Record<string, string> = {
    active: "ATIVO",
    inactive: "INATIVO",
};

export const productsColumns: Column<Product>[] = [
    {
        key: "id",
        header: "Id",
        className: "users-table_id-column data-table__cell",
        dataLabel: "Id:",
        filterConfig: {
            label: "Id",
            type: "number",
        },
    },
    {
        key: "name",
        header: "Nome",
        className: "users-table_username-column data-table__cell",
        dataLabel: "Nome:",
        render: (product) => (
            <div className="pos-anchor" data-full-text={product.name}>
                <div className="item-name truncatable-cell">
                    <span>{product.name}</span>
                </div>
            </div>
        ),
        filterConfig: {
            label: "Nome",
            type: "text",
        },
    },
    {
        key: "status",
        header: "Status",
        className: "users-table_status-column",
        dataLabel: "Status:",
        render: (product: Product) => (
            <span
                className="status-badge data-table__status-badge"
                data-status={product.status}
            >
                {STATUSES[product.status] ?? "-"}
            </span>
        ),
        isStatus: true,
        filterConfig: {
            label: "Status",
            type: "select",
            options: [
                { label: "Ativos", value: "active" },
                { label: "Inativos", value: "inactive" },
            ],
        },
    },
    {
        key: "actions",
        header: "Ações",
        sortable: false,
    },
];
