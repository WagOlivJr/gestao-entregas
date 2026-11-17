import type { Product } from "./Product";
import type { ColumnFilterConfigMap } from "../../shared/hooks/useColumnFilters";
import type { Column } from "../../shared/components/table/Table";
import { ProductsActions } from "./components/ProductsActions/ProductsActions";

const STATUSES: Record<string, string> = {
    active: "ATIVO",
    inactive: "INATIVO",
};

const productsDataColumns: Column<Product>[] = [
    {
        key: "id",
        header: "Id",
        className: "users-table_id-column data-table__cell",
        headerMobile: "Id:",
    },
    {
        key: "name",
        header: "Nome",
        className: "users-table_username-column data-table__cell",
        headerMobile: "Nome:",
        showTooltipOn: "truncated",
    },
    {
        key: "status",
        header: "Status",
        className: "users-table_status-column",
        headerMobile: "Status:",
        render: (product: Product) => (
            <span
                className="status-badge data-table__status-badge"
                data-status={product.status}
            >
                {STATUSES[product.status] ?? "-"}
            </span>
        ),
        isStatus: true,
    },
];

export const productsFilterConfig: ColumnFilterConfigMap = {
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
};

export function createProductsActionsColumn(
    onEdit: (product: Product) => void,
    onSuccess: () => void,
): Column<Product> {
    return {
        key: "actions",
        header: "Ações",
        sortable: false,
        className:
            "products-table_actions-column data-table__cell data-table__cell-actions",
        render: (product) => (
            <ProductsActions
                product={product}
                onEdit={onEdit}
                onSuccess={onSuccess}
            />
        ),
    };
}

export function createProductsColumns(
    onEdit: (product: Product) => void,
    onSuccess: () => void,
): Column<Product>[] {
    return [
        ...productsDataColumns,
        createProductsActionsColumn(onEdit, onSuccess),
    ];
}
