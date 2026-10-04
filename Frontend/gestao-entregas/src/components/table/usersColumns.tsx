import type { User } from "../../entities/User";
import type { Column } from "./Table";
import { UsersActions } from "../users/UsersActions";

const STATUSES: Record<string, string> = {
    ACTIVE: "ATIVO",
    SUSPENDED: "SUSPENSO",
    BANNED: "BANIDO",
};

export const usersColumns: Column<User>[] = [
    {
        key: "id",
        header: "Id",
        className: "users-table_id-column data-table__cell",
        dataLabel: "Id:",
    },

    {
        key: "username",
        header: "Usuário",
        className: "users-table_username-column data-table__cell",
        dataLabel: "Usuário:",
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
        getTruncateText: (user) => user.username,
    },

    {
        key: "email",
        header: "E-mail",
        className: "users-table_email-column data-table__cell",
        dataLabel: "E-mail:",
        render: (user) => (
            <div className="truncatable-cell">
                <span>{user.email}</span>
            </div>
        ),
        truncate: true,
        getTruncateText: (user) => user.email,
    },

    {
        key: "role",
        header: "Perfil",
        dataLabel: "Perfil:",
        className: "users-table_role-column",
    },

    {
        key: "status",
        header: "Status",
        dataLabel: "Status:",
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
    //     dataLabel: "Habilitado:",
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
