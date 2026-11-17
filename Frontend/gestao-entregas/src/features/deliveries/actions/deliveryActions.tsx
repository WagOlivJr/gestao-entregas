import type { ActionConfig } from "../../../shared/components/actionsColumn/ActionsMenu";
import { ConfirmDialogContent } from "../../../shared/components/dialog/ConfirmDialogContent";
import { ReasonConfirmDialogContent } from "../../../shared/components/dialog/ReasonConfirmDialogContent";
import type { DialogRequest } from "../../../shared/contexts/dialog-context";
import { AssignDeliveryPersonDialogContent } from "../components/dialogs/AssignDeliveryPersonDialogContent";
import { type Delivery } from "../types/delivery";
import { deliveriesService } from "../services/deliveriesService";
import {
    CLOSED_STATUSES,
    STATUS_LABELS,
    STATUSES_SEQUENCE,
    type DeliveryStatus,
} from "../types/status";

type voidAndNoParamFn = () => void;

export interface DeliveryHandlers {
    onEdit: (delivery: Delivery) => void;
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
        dataTitle: "Visualizar detalhes desta entrega",
        onClick: onOpen,
    };
}

export function editAction(
    delivery: Delivery,
    onEdit: (delivery: Delivery) => void,
): ActionConfig {
    const canEdit = !(CLOSED_STATUSES as readonly DeliveryStatus[]).includes(
        delivery.status,
    );
    return {
        key: "edit",
        text: "Editar",
        icon: "fa fa-edit",
        className: "actions-btns__btn--edit",
        disabled: !canEdit,
        dataTitle: canEdit ? "Editar entrega" : undefined,
        title: canEdit ? undefined : "Entrega finalizada não pode ser editada.",
        onClick: () => onEdit(delivery),
    };
}

export function deleteAction(
    delivery: Delivery,
    { openDialog, onSuccess }: DialogDeps,
): ActionConfig {
    return {
        key: "delete",
        text: "Excluir",
        icon: "fa fa-trash",
        className: "actions-btns__btn--delete",
        dataTitle: "Excluir entrega",
        onClick: () =>
            openDialog({
                title: "Confirmar exclusão",
                description: `A exclusão da entrega #${delivery.id} é uma ação irreversível. Deseja continuar?`,
                content: (
                    <ConfirmDialogContent
                        confirmLabel="Excluir entrega"
                        onConfirm={() => deliveriesService.delete(delivery.id)}
                        onSuccess={onSuccess}
                    />
                ),
                dismissOnEscape: false,
                dismissOnOutsideClick: false,
                showCloseButton: false,
            }),
    };
}

// export function progressAction(
//     delivery: Delivery,
//     { openDialog, onSuccess }: DialogDeps,
// ): ActionConfig {
//     const currentIndex = statusesSequence.indexOf(delivery.status);
//     const nextStatus = statusesSequence[currentIndex + 1];
//     const requiresDeliveryPerson =
//         delivery.status === "pending" && !delivery.deliveryPerson;

//     const isActive = true;

//     const [verb, noun] = isActive
//         ? ["Desativar", "desativação"]
//         : ["Reativar", "reativação"];

//     return {
//         key: "progress",
//         text: verb,
//         icon: `fa fa-arrow-right`,
//         className: "status-progress actions-btns__btn--next-status",
//         dataTitle: `Progredir status da entrega para "${STATUS_LABELS[nextStatus]}"`,
//         onClick: () =>
//             openDialog({
//                 title: `${verb} cliente`,
//                 description: `Confirme a ${noun} do cliente #${customer.id} - ${customer.name}`,
//                 content: (
//                     <ConfirmDialogContent
//                         confirmLabel={`${verb} cliente`}
//                         onConfirm={(reason) =>
//                             isActive
//                                 ? customersService.deactivate(
//                                       customer.id,
//                                       reason!,
//                                   )
//                                 : customersService.activate(customer.id)
//                         }
//                         requiresReason={isActive}
//                         onSuccess={onSuccess}
//                     />
//                 ),
//                 dismissOnEscape: false,
//                 dismissOnOutsideClick: false,
//                 showCloseButton: false,
//             }),
//     };
// }

export function progressAction(
    delivery: Delivery,
    { openDialog, onSuccess }: DialogDeps,
): ActionConfig {
    const currentIndex = (
        STATUSES_SEQUENCE as readonly DeliveryStatus[]
    ).indexOf(delivery.status);

    const nextStatus =
        !(CLOSED_STATUSES as readonly DeliveryStatus[]).includes(
            delivery.status,
        ) && currentIndex >= 0
            ? STATUSES_SEQUENCE[currentIndex + 1]
            : undefined;

    const requiresDeliveryPerson =
        delivery.status === "pending" &&
        nextStatus === "assigned" &&
        !delivery.deliveryPerson;

    const canProgress = nextStatus !== undefined;

    return {
        key: "progress",
        text: "Progredir status",
        icon: "fa fa-arrow-right",
        className: "status-progress actions-btns__btn--next-status",
        dataTitle: canProgress
            ? `Progredir status da entrega para "${STATUS_LABELS[nextStatus]}"`
            : undefined,
        disabled: !canProgress,
        title: canProgress
            ? undefined
            : "Esta entrega não possui uma próxima etapa.",

        onClick: () => {
            if (!nextStatus) return;

            const dialogOptions = {
                dismissOnEscape: false,
                dismissOnOutsideClick: false,
                showCloseButton: false,
            };

            if (requiresDeliveryPerson) {
                openDialog({
                    ...dialogOptions,
                    title: "Selecionar entregador",
                    // description: `Selecione o entregador para a entrega #${delivery.id}.`,
                    content: (
                        <AssignDeliveryPersonDialogContent
                            deliveryId={delivery.id}
                            onAssign={(deliveryPersonId) =>
                                deliveriesService.assignDeliveryPerson(
                                    delivery.id,
                                    deliveryPersonId,
                                )
                            }
                            onSuccess={onSuccess}
                        />
                    ),
                });

                return;
            }

            openDialog({
                ...dialogOptions,
                title: "Alteração de status de entrega",
                description: `Confirme a progressão da entrega #${delivery.id}: ${STATUS_LABELS[delivery.status]} → ${STATUS_LABELS[nextStatus]}. Esta ação é irreversível.`,
                content: (
                    <ConfirmDialogContent
                        confirmLabel={`Avançar para ${STATUS_LABELS[nextStatus]}`}
                        onConfirm={() =>
                            deliveriesService.progress(delivery.id, nextStatus)
                        }
                        onSuccess={onSuccess}
                    />
                ),
            });
        },
    };
}

export function seeProductsAction(onOpen: voidAndNoParamFn): ActionConfig {
    return {
        key: "seeProducts",
        text: "Ver produtos",
        icon: "fa fa-cart-shopping",
        className: "actions-btns__btn--see-products",
        dataTitle: "Visualizar produtos desta entrega",
        onClick: onOpen,
    };
}

export function cancelAction(
    delivery: Delivery,
    { openDialog, onSuccess }: DialogDeps,
): ActionConfig {
    const canCancel = !(CLOSED_STATUSES as readonly DeliveryStatus[]).includes(
        delivery.status,
    );
    return {
        key: "cancel",
        text: "Cancelar",
        icon: "fa fa-times-circle",
        className: "actions-btns__btn--cancel",
        dataTitle: "Cancelar entrega",
        disabled: !canCancel,
        onClick: () =>
            openDialog({
                title: `Confirmar cancelamento da entrega #${delivery.id}`,
                description: `O cancelamento da entrega #${delivery.id} é uma ação irreversível. Deseja continuar?`,
                content: (
                    <ReasonConfirmDialogContent
                        confirmLabel="Cancelar entrega"
                        onConfirm={(reason) =>
                            deliveriesService.cancel(delivery.id, reason)
                        }
                        onSuccess={onSuccess}
                        cancelLabel="Voltar"
                        reasonLabel="Informe o motivo do cancelamento da entrega"
                        reasonPlaceholder="Digite o motivo do cancelamento (obrigatório. Mínino de 3 caracteres)."
                        reasonRequiredMessage="O motivo do cancelamento é obrigatório"
                    />
                ),
                dismissOnEscape: false,
                dismissOnOutsideClick: false,
                showCloseButton: false,
            }),
    };
}
