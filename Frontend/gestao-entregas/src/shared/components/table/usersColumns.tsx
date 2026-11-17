import type { User } from "../../../features/users/User";
import type { Column } from "./Table";
import { UsersActions } from "../../../features/users/components/usersActions/UsersActions";
import type { ColumnFilterConfigMap } from "../../hooks/useColumnFilters";

const STATUSES: Record<string, string> = {
    ACTIVE: "ATIVO",
    SUSPENDED: "SUSPENSO",
    BANNED: "BANIDO",
};

export const usersDataColumns: Column<User>[] = [
    {
        key: "id",
        header: "Id",
        className: "users-table_id-column data-table__cell",
        headerMobile: "Id:",
        filterConfig: {
            label: "Id",
            type: "number",
        },
    },

    {
        key: "username",
        header: "Usuário",
        className: "users-table_username-column data-table__cell",
        headerMobile: "Usuário:",
        // render: (user) => (
        //     <div className="pos-anchor" data-full-text={user.username}>
        //         <div className="item-name truncatable-cell">
        //             <span>{user.username}</span>
        //         </div>
        //     </div>
        // ),
        render: (user) => (
            <div className="truncatable-cell">
                <span>{user.username}</span>
            </div>
        ),
        truncate: true,
        getTruncatedText: (user) => user.username,
        filterConfig: {
            label: "Usuário",
            type: "text",
        },
    },

    {
        key: "email",
        header: "E-mail",
        className: "users-table_email-column data-table__cell",
        headerMobile: "E-mail:",
        render: (user) => (
            <div className="truncatable-cell">
                <span>{user.email}</span>
            </div>
        ),
        truncate: true,
        getTruncatedText: (user) => user.email,
        filterConfig: {
            label: "Email",
            type: "text",
        },
    },

    {
        key: "role",
        header: "Perfil",
        headerMobile: "Perfil:",
        className: "users-table_role-column",
        filterConfig: {
            label: "Perfil",
            type: "select",
            options: [
                { label: "Admin", value: "ADMIN" },
                { label: "Gestor", value: "MANAGER" },
                { label: "Usuário", value: "USER" },
            ],
        },
    },

    {
        key: "status",
        header: "Status",
        headerMobile: "Status:",
        className: "users-table_status-column data-table__cell status-cell",
        render: (user: User) => (
            <span
                className="status-badge data-table__status-badge"
                data-status={user.status}
            >
                {STATUSES[user.status] ?? "-"}
            </span>
        ),
        isStatus: true,
        filterConfig: {
            label: "Status",
            type: "select",
            options: [
                { label: "Ativo", value: "ACTIVE" },
                { label: "Bloqueado", value: "SUSPENDED" },
                { label: "Banido", value: "BANNED" },
            ],
        },
    },

    {
        key: "actions",
        header: "Ações",
        className:
            "users-table_actions-column data-table__cell data-table__cell-actions",
        render: (user) => <UsersActions user={user} />,
    },

    // {
    //     key: "enabled",
    //     header: "Habilitado",
    //     className: "data-table__cell status-cell",
    //     headerMobile: "Habilitado:",
    //     render: (user) => (
    //         <span
    //             className="status-badge data-table__status-badge"
    //             data-status={user.enabled ? "ACTIVE" : "INACTIVE"}
    //         >
    //             {user.enabled ? "Ativo" : "Inativo"}
    //         </span>
    //     ),
    // },
];

export const usersFilterConfig = usersDataColumns.reduce<ColumnFilterConfigMap>(
    (acc, col) => {
        if (col.filterConfig) acc[col.key] = col.filterConfig;
        return acc;
    },
    {},
);
