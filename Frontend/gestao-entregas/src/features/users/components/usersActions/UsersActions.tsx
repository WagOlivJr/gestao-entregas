import {
    ActionsMenu,
    type ActionConfig,
} from "../../../../shared/components/actionsColumn/ActionsMenu";
import { ConfirmDialogContent } from "../../../../shared/components/dialog/ConfirmDialogContent";
import {
    useDialog,
    type DialogRequest,
} from "../../../../shared/contexts/dialog-context";
import { usersService } from "../../services/usersService";
import type { User } from "../../User";
import { UserDetailsLoader } from "../userDetails/UserDetailsLoader";
import "./UsersActions.css";

interface Props {
    user: User;
    isModal?: boolean;
    onSuccess?: () => void;
    // onEdit?: (user: User) => void;
}

function getUsersActionsConfig(
    user: User,
    openDialog: (request: DialogRequest) => void,
    onSuccess?: () => void,
): ActionConfig[] {
    const canRestoreAccess = user.status === "SUSPENDED";
    const canEdit = user.status !== "BANNED";
    const canSuspend = user.status === "ACTIVE";

    return [
        {
            key: "seeDetails",
            text: "Ver detalhes",
            icon: "fa fa-info-circle",
            className: "actions-btns__btn--see-details",
            dataTitle: "Visualizar detalhes deste usuário",
            title: "",
            displayOnModal: false,
            onClick: () =>
                openDialog({
                    title: `Detalhes do usuário #${user.id}`,
                    content: (
                        <UserDetailsLoader
                            userId={user.id}
                            // initialProduct={product}
                        />
                    ),
                    showCloseButton: true,
                    dismissOnEscape: true,
                    dismissOnOutsideClick: true,
                }),
        },
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
            onClick: () =>
                openDialog({
                    title: "Confirmar Restabelecimento de Acesso",
                    description: `O usuário ${user.username} voltará a ter acesso ao sistema. Deseja continuar?`,
                    content: (
                        <ConfirmDialogContent
                            confirmLabel="Confirmar"
                            onConfirm={() =>
                                usersService.restoreAccess(user.id)
                            }
                            onSuccess={onSuccess}
                        />
                    ),
                    dismissOnEscape: true,
                    dismissOnOutsideClick: true,
                    showCloseButton: false,
                }),
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
            onClick: () =>
                openDialog({
                    title: "Confirmar bloqueio",
                    description: `O usuário ${user.username} não poderá acessar o sistema até que seja desbloquado. Deseja continuar?`,
                    content: (
                        <ConfirmDialogContent
                            confirmLabel="Bloquar usuário"
                            onConfirm={() =>
                                usersService.restoreAccess(user.id)
                            }
                            onSuccess={onSuccess}
                        />
                    ),
                    dismissOnEscape: true,
                    dismissOnOutsideClick: true,
                    showCloseButton: false,
                }),
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
            onClick: () =>
                openDialog({
                    title: "Confirmar banimento",
                    description: `O banimento de ${user.username} é uma ação irreversível. Deseja continuar?`,
                    content: (
                        <ConfirmDialogContent
                            confirmLabel="Banir usuário"
                            onConfirm={() => {
                                console.log(
                                    `Banir usuário ${user.id} do sistema.`,
                                );
                            }}
                            onSuccess={onSuccess}
                        />
                    ),
                    dismissOnEscape: false,
                    dismissOnOutsideClick: false,
                    showCloseButton: false,
                }),
        },
    ];
}

export function UsersActions({ user, isModal, onSuccess }: Props) {
    const { openDialog } = useDialog();
    const actions = getUsersActionsConfig(user, openDialog, onSuccess);

    return <ActionsMenu actions={actions} isModal={isModal} />;
}
