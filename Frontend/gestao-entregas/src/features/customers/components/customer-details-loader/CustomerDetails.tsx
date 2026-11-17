import { ActionsBar } from "../../../../shared/components/actionsBar/ActionsBar";
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
import {
    deleteAction,
    editAction,
    toggleStatusAction,
    type CustomerHandlers,
} from "../../actions/customersActions";
import type { Customer } from "../../Customer";

interface Props {
    customer: Customer;
    handlers: CustomerHandlers;
}

const STATUS_LABEL = {
    active: "Ativo",
    inactive: "Inativo",
};

export function CustomerDetails({ customer, handlers }: Props) {
    const { openDialog, closeDialog } = useDialog();
    const { onEdit, onSuccess } = handlers;

    const handleEdit = (customer: Customer) => {
        closeDialog();
        onEdit(customer);
    };

    const deps = { openDialog, onSuccess };
    const actions: ActionConfig[] = [
        editAction(customer, handleEdit),
        toggleStatusAction(customer, deps),
        deleteAction(customer, deps),
    ];

    const isActive = customer.status === "active";

    return (
        <>
            <div className="modal__body">
                <div className="modal__main-content">
                    <div className="modal__section">
                        <h3 className="modal__section-title">
                            Informações Gerais
                        </h3>
                        <p>
                            <strong>Status:</strong>
                            <span
                                className="status-badge"
                                data-status={customer.status}
                            >
                                {STATUS_LABEL[customer.status]}
                            </span>
                        </p>

                        {customer.deactivationReason && !isActive && (
                            <p style={{ whiteSpace: "pre-line" }}>
                                <strong>Motivo da Inativação:</strong>{" "}
                                {customer.deactivationReason}
                            </p>
                        )}

                        {customer.notes && (
                            <div className="modal__section">
                                <p style={{ whiteSpace: "pre-line" }}>
                                    <strong>Observações:</strong>
                                    {"\n"}
                                    {customer.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="modal__section">
                        <h3 className="modal__section-title">Dados Pessoais</h3>
                        <p>
                            <strong>Nome:</strong> {customer.name}
                        </p>
                        <p>
                            <strong>Telefone:</strong>{" "}
                            {formatPhone(customer.phone)}
                        </p>
                    </div>

                    <div className="modal__section">
                        <h3 className="modal__section-title">Endereço</h3>
                        <p>
                            <strong>Logradouro:</strong>{" "}
                            {customer.address.street},{" "}
                            {customer.address.number || "S/N"}
                            {customer.address.complement
                                ? `, ${customer.address.complement}`
                                : ""}
                        </p>
                        <p>
                            <strong>Bairro:</strong>{" "}
                            {customer.address.neighborhood}
                        </p>
                        <p>
                            <strong>Cidade/UF:</strong> {customer.address.city}/
                            {customer.address.state}
                        </p>
                        <p>
                            <strong>CEP:</strong>{" "}
                            {formatZipCode(customer.address.zipCode)}
                        </p>
                    </div>

                    <div className="modal__section">
                        <h3 className="modal__section-title">Histórico</h3>
                        <p>
                            <strong>Cadastrado por:</strong>{" "}
                            {customer.createdBy || "Sistema"} em{" "}
                            {toDDMMYYYYYHHMM(customer.createdAt)}
                        </p>

                        {customer.updatedAt && (
                            <p>
                                <strong>
                                    {!isActive ? "Inativado" : "Atualizado"}{" "}
                                    por:
                                </strong>{" "}
                                {customer.updatedBy || "Sistema"} em{" "}
                                {toDDMMYYYYYHHMM(customer.updatedAt)}
                            </p>
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
