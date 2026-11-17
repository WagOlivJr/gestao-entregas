import {
    ActionsMenu,
    type ActionConfig,
} from "../../../../shared/components/actionsColumn/ActionsMenu";
import { useDialog } from "../../../../shared/contexts/dialog-context";
import {
    formatPhone,
    formatZipCode,
} from "../../../../shared/utils/text/textFormatter";
import { toDDMMYYYYYHHMM } from "../../../../shared/utils/time/dateTimeConvertion";
import type { Customer } from "../../../customers/Customer";
import type { BasicUser, User } from "../../../users/User";
import {
    cancelAction,
    deleteAction,
    editAction,
    progressAction,
    seeProductsAction,
    type DeliveryHandlers,
} from "../../actions/deliveryActions";
import type { Delivery } from "../../types/delivery";
import { openProducts } from "../../open-deliveries-details";
import { STATUS_LABELS, type DeliveryStatus } from "../../types/status";

interface Props {
    delivery: Delivery;
    handlers: DeliveryHandlers;
}

const STATUS_DATA_ATTR: Record<DeliveryStatus, string> = {
    pending: "pendente",
    assigned: "atribuida",
    inProgress: "Em andamento",
    completed: "concluida",
    canceled: "cancelada",
};

export function DeliveryDetails({ delivery, handlers }: Props) {
    const { openDialog, closeDialog } = useDialog();
    const { onEdit, onSuccess } = handlers;

    const handleEdit = (delivery: Delivery) => {
        closeDialog();
        onEdit(delivery);
    };

    const statusDataAttr = STATUS_DATA_ATTR[delivery.status];
    const statusLabel = STATUS_LABELS[delivery.status];

    const deps = { openDialog, onSuccess };
    const actions: ActionConfig[] = [
        seeProductsAction(() => openProducts(openDialog, delivery)),
        editAction(delivery, handleEdit),
        progressAction(delivery, deps),
        cancelAction(delivery, deps),
        deleteAction(delivery, deps),
    ];

    const customer = delivery.customer as Customer;

    const isClosed =
        delivery.status === "completed" || delivery.status === "canceled";

    return (
        <>
            <div className="modal__body">
                <div className="modal__main-content">
                    <div className="detalhes-entrega">
                        <div className="modal__section">
                            <h3 className="modal__section-title">
                                Informações Gerais
                            </h3>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className="status-badge"
                                    data-status={statusDataAttr}
                                >
                                    {statusLabel}
                                </span>
                            </p>

                            {delivery.cancelingReason && (
                                <p style={{ whiteSpace: "pre-line" }}>
                                    <strong>Motivo do cancelamento:</strong>
                                    <br />
                                    {delivery.cancelingReason}
                                </p>
                            )}

                            <p>
                                <strong>Data da Compra:</strong>{" "}
                                {toDDMMYYYYYHHMM(delivery.purchaseDate)}
                            </p>

                            {delivery.startDeliveryDate && (
                                <p>
                                    <strong>Data de Início da Entrega:</strong>{" "}
                                    {toDDMMYYYYYHHMM(
                                        delivery.startDeliveryDate,
                                    )}
                                </p>
                            )}

                            {delivery.deliveryDate && (
                                <p>
                                    <strong>
                                        Data de Conclusão da Entrega:
                                    </strong>{" "}
                                    {toDDMMYYYYYHHMM(delivery.deliveryDate)}
                                </p>
                            )}
                        </div>

                        <div className="modal__section">
                            <h3 className="modal__section-title">Cliente</h3>

                            <p>
                                <strong>Nome:</strong>{" "}
                                {`#${customer.id} - ${customer.name}`}
                            </p>

                            <p>
                                <strong>Telefone:</strong>{" "}
                                {formatPhone(customer.phone)}
                            </p>

                            <p>
                                <strong>Endereço:</strong>{" "}
                                {customer.address.street},{" "}
                                {customer.address.number ?? "s/n"}
                                {customer.address.complement &&
                                    `, ${customer.address.complement}`}
                                {" - "}
                                {customer.address.neighborhood}
                            </p>

                            <p>
                                {customer.address.city}/{customer.address.state}
                                {" - CEP: "}
                                {formatZipCode(customer.address.zipCode)}
                            </p>
                        </div>

                        <div className="modal__section">
                            <h3 className="modal__section-title">
                                Responsáveis
                            </h3>

                            <p>
                                <strong>Operador:</strong>{" "}
                                {getUserString(delivery.cashierId)}
                            </p>

                            {delivery.deliveryPerson && (
                                <p>
                                    <strong>Entregador:</strong>{" "}
                                    {getUserString(delivery.deliveryPerson)}
                                </p>
                            )}

                            <p>
                                <strong>Criada por:</strong>{" "}
                                {getUserString(delivery.createdBy)} em{" "}
                                {toDDMMYYYYYHHMM(delivery.createdAt)}
                            </p>

                            {delivery.updatedAt && (
                                <p>
                                    <strong>
                                        {isClosed ? "Encerrada" : "Editada"}{" "}
                                        por:
                                    </strong>{" "}
                                    {getUserString(delivery.updatedBy)} em{" "}
                                    {toDDMMYYYYYHHMM(delivery.updatedAt)}
                                </p>
                            )}
                        </div>

                        {delivery.notes && (
                            <div className="modal__section">
                                <h3 className="modal__section-title">
                                    Observações Gerais
                                </h3>

                                <p style={{ whiteSpace: "pre-line" }}>
                                    {delivery.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="app-dialog__actions modal__actions-container">
                {/* <ActionsBar actions={actions} /> */}
                <ActionsMenu actions={actions} isModal={true} />
            </div>
        </>
    );
}

function getUserString(
    user: BasicUser | User | string | number | null | undefined,
): string {
    if (typeof user === "string") {
        return user;
    }
    if (typeof user === "number") {
        return `#${user}`;
    }
    if (!user) {
        return "SYSTEM  ";
    }
    return `#${user.id} - ${user.username}`;
}
