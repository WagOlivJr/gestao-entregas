import "./Users.css";
import { TableWrapper } from "../../components/TableWrapper";
import {
    usersDataColumns,
    usersFilterConfig,
} from "../../shared/components/table/usersColumns";
import { useModuleTable } from "../../shared/hooks/useModuleTable";
import { usersService } from "./services/usersService";
import { ActiveFiltersBar } from "../../shared/components/table/columnsFilter/activeFiltersBar";
import type { User } from "./User";
import { ModulePage } from "../../shared/components/ModulePage";
import { useDialog } from "../../shared/contexts/dialog-context";
import { UserDetailsLoader } from "./components/userDetails/UserDetailsLoader";

const filterConfig = usersFilterConfig;

export function UsersPage() {
    return (
        <ModulePage<User>
            title="Gerenciamento de Usuários"
            renderList={({ refreshToken }) => (
                <UsersList refreshToken={refreshToken}></UsersList>
            )}
            renderForm={() => <></>}
            addItemBtnLabel="Convidar Usuário"
            canAdd={false}
        ></ModulePage>
    );
}

function UsersList({ refreshToken }: { refreshToken: number }) {
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
        openColumn,
        setOpenColumn,
        debouncedFilters,
        setFilter,
    } = useModuleTable(usersService.list, filterConfig, {
        silentFetch: false,
        refreshToken,
    });

    const { openDialog } = useDialog();
    const onRowClick = (user: User) => {
        openDialog({
            title: `Detalhes do usuário #${user.id}`,
            content: (
                <UserDetailsLoader
                    userId={user.id}
                    // initialUser={user}
                    // onEdit={onEdit}
                />
            ),
            showCloseButton: true,
            dismissOnEscape: true,
            dismissOnOutsideClick: true,
        });
    };

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
                data={users}
                columns={usersDataColumns}
                rowKey={(user) => user.id}
                tableClassName="data-table users"
                emptyState="Nenhum usuário encontrado"
                onRowClick={onRowClick}
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
        </>
    );
}
