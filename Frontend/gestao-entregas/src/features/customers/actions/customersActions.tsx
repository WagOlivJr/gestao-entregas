import type { ActionConfig } from "../../../shared/components/actionsColumn/ActionsMenu";
import { ConfirmDialogContent } from "../../../shared/components/dialog/ConfirmDialogContent";
import { ReasonConfirmDialogContent } from "../../../shared/components/dialog/ReasonConfirmDialogContent";
import type { DialogRequest } from "../../../shared/contexts/dialog-context";
import type { Customer } from "../Customer";
import { customersService } from "../services/customersService";

type voidAndNoParamFn = () => void;

export interface CustomerHandlers {
    onEdit: (customer: Customer) => void;
    onSuccess: voidAndNoParamFn;
}

interface DialogDeps {
    openDialog: (request: DialogRequest) => void;
    onSuccess: voidAndNoParamFn;
}

export function seeDetailsAction(onOpen: voidAndNoParamFn): ActionConfig {
    return {
        key: "seeDetails",
        text: "Ver detalhes",
        icon: "fa fa-info-circle",
        className: "actions-btns__btn--see-details",
        dataTitle: "Visualizar detalhes deste cliente",
        onClick: onOpen,
    };
}

export function editAction(
    customer: Customer,
    onEdit: (customer: Customer) => void,
): ActionConfig {
    const canEdit = customer.status === "active";
    return {
        key: "edit",
        text: "Editar",
        icon: "fa fa-edit",
        className: "actions-btns__btn--edit",
        disabled: !canEdit,
        dataTitle: canEdit ? "Editar cliente" : undefined,
        title: canEdit ? undefined : "Cliente inativo não pode ser editado.",
        onClick: () => onEdit(customer),
    };
}

export function seeDeliveriesAction(): ActionConfig {
    return {
        key: "seeDeliveries",
        text: "Ver entregas",
        icon: "fa fa-truck",
        className: "actions-btns__btn--deliveries",
        dataTitle: "Visualizar entregas deste cliente",
        onClick: () => {
            // TODO: navegar para entregas com filtro por produto
        },
    };
}

export function addDeliveryAction(customer: Customer): ActionConfig {
    const isActive = customer.status === "active";
    return {
        key: "addDeliveries",
        text: "Add. Entrega",
        icon: "fa fa-plus-circle",
        className: "actions-btns__btn--add-delivery",
        disabled: !isActive,
        dataTitle: isActive ? "Criar entrega para este cliente" : undefined,
        title: isActive
            ? undefined
            : "Não é possível criar entrega para cliente inativo.",
        onClick: () => {
            // TODO: navegar para entregas com criação associada ao produto
        },
    };
}

export function toggleStatusAction(
    customer: Customer,
    { openDialog, onSuccess }: DialogDeps,
): ActionConfig {
    const isActive = customer.status === "active";
    const ConfirmComponent = isActive
        ? ReasonConfirmDialogContent
        : ConfirmDialogContent;
    const onConfirm = isActive
        ? (reason?: string) =>
              customersService.deactivate(customer.id, reason ?? "")
        : () => customersService.activate(customer.id);
    const [verb, noun] = isActive
        ? ["Desativar", "desativação"]
        : ["Reativar", "reativação"];

    return {
        key: "toggleStatus",
        text: verb,
        icon: `fa fa-toggle-${isActive ? "on" : "off"}`,
        className: "actions-btns__btn--toggle-status",
        dataTitle: `${verb} cliente`,
        onClick: () =>
            openDialog({
                title: `${verb} cliente`,
                description: `Confirme a ${noun} do cliente #${customer.id} - ${customer.name}`,
                content: (
                    <ConfirmComponent
                        confirmLabel={`${verb} cliente`}
                        onSuccess={onSuccess}
                        onConfirm={onConfirm}
                        {...(isActive && {
                            reasonLabel:
                                "Informe o motivo da desativação do cliente",
                            reasonPlaceholder:
                                "Digite o motivo da desativação (obrigatório. Mínino de 3 caracteres).",
                            reasonRequiredMessage:
                                "O motivo da desativação é obrigatório",
                            helperMessage:
                                "Não é possível associar entregas a clientes desativados.",
                        })}
                    />
                ),
                dismissOnEscape: false,
                dismissOnOutsideClick: false,
                showCloseButton: false,
            }),
    };
}

export function deleteAction(
    customer: Customer,
    { openDialog, onSuccess }: DialogDeps,
): ActionConfig {
    return {
        key: "delete",
        text: "Excluir",
        icon: "fa fa-trash",
        className: "actions-btns__btn--delete",
        dataTitle: "Excluir cliente",
        onClick: () =>
            openDialog({
                title: "Confirmar exclusão",
                description: `A exclusão do cliente #${customer.id} - ${customer.name} é uma ação irreversível. Deseja continuar?`,
                content: (
                    <ConfirmDialogContent
                        confirmLabel="Excluir cliente"
                        onConfirm={() => customersService.delete(customer.id)}
                        onSuccess={onSuccess}
                    />
                ),
                dismissOnEscape: false,
                dismissOnOutsideClick: false,
                showCloseButton: false,
            }),
    };
}
