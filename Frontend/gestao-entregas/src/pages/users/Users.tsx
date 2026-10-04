import "./Users.css";
import TableWrapper from "../../components/TableWrapper";
import { usersColumns } from "../../components/table/usersColumns";
import { useModuleTable } from "../../hooks/useModuleTable";
import { usersService } from "../../services/usersService";
import type { ColumnFilterConfigMap } from "../../hooks/useColumnFilters";

const filterConfig: ColumnFilterConfigMap = {
    name: { type: "text", label: "Nome" },
    role: {
        type: "select",
        label: "Perfil",
        options: { ADMIN: "Administrador", OPERATOR: "Operador" },
    },
};

export function Users() {
    const {
        content: users,
        error,
        loading,
        totalItems,
        totalItemsInDb,
        sortBy,
        sortAsc,
        toggleSort,
        filters,
        resetFilters,
    } = useModuleTable(usersService.list, filterConfig);

    if (loading) return <div role="status">Carregando...</div>;
    if (error) return <div role="alert">{error}</div>;

    return (
        <>
            <TableWrapper
                data={users}
                columns={usersColumns}
                rowKey={(user) => user.id}
                tableClassName="data-table users"
                emptyState="Nenhum usuário encontrado"
                onRowClick={(user) => console.log("Row clicked!:", user)}
                sortBy={sortBy}
                sortAsc={sortAsc}
                onSortChange={toggleSort}
            />
        </>
    );
}
