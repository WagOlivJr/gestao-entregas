import {
    ActionsMenu,
    type ActionConfig,
} from "../../GENERAL/actionsColumn/ActionsMenu";
import type { User } from "../../entities/User";
import "./UsersActions.css";

interface UsersActionsProps {
    user: User;
}

export function UsersActions({ user }: UsersActionsProps) {
    const canRestoreAccess = user.status === "SUSPENDED";
    const canEdit = user.status !== "BANNED";
    const canSuspend = user.status === "ACTIVE";

    const actions: ActionConfig[] = [
        {
            key: "restoreAccess",
            text: "Restabelecer",
            icon: "fa fa-user-check",
            className: "actions-btns__btn--restore-access",
            disabled: !canRestoreAccess,
            dataTitle: canRestoreAccess
                ? `Restabelecer acesso do usuário ${user.username} ao sistema`
                : undefined,
            title: canRestoreAccess ? undefined : "Usuário já está ativo",
            onClick: () => {
                console.log(
                    `restabelecer acesso do sistema ao usuário ${user.username}.`,
                );
            },
        },
        {
            key: "suspend",
            text: "Suspender",
            icon: "fa fa-user-lock",
            className: "actions-btns__btn--suspend-user",
            disabled: !canSuspend,
            title: canSuspend ? undefined : "Usuário já está suspenso",
            dataTitle: canSuspend
                ? `Suspender acesso do usuário ${user.username} ao sistema`
                : undefined,
            onClick: () => {
                console.log("Suspender acesso:", user.id);
            },
        },
        {
            key: "ban",
            text: "Banir",
            icon: "fa fa-ban",
            className: "actions-btns__btn--delete",
            disabled: !canEdit,
            dataTitle: canEdit
                ? `Banir usuário ${user.username} do sistema (ação irreversível)`
                : undefined,
            title: canEdit ? undefined : "Usuário banido não pode ser alterado",
            onClick: () => {
                console.log(`Banir usuário ${user.id} do sistema.`);
            },
        },
    ];

    return <ActionsMenu actions={actions} />;
}
