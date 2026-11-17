import type { Product } from "../../Product";
import { ActionsMenu } from "../../../../shared/components/actionsColumn/ActionsMenu";
import { useDialog } from "../../../../shared/contexts/dialog-context";
import { getActionsConfig } from "../ProductsActions/ProductsActions";
import "./ProductDetails.css";
import { toDDMMYYYYYHHMM } from "../../../../shared/utils/time/dateTimeConvertion";

const STATUS_LABEL = {
    active: "Ativo",
    inactive: "Inativo",
};

export function ProductDetails({
    product,
    onEdit,
    onSuccess,
}: {
    product: Product;
    onEdit: (product: Product) => void;
    onSuccess: () => void;
}) {
    const { openDialog, closeDialog } = useDialog();

    // const { onSuccess, onEdit } = useProductsListActions();

    const handleEdit = (product: Product) => {
        closeDialog();
        onEdit(product);
    };

    const isActive = product.status === "active";

    const actionsConfig = getActionsConfig(
        product,
        openDialog,
        handleEdit,
        onSuccess,
    );

    return (
        <>
            <div className="modal__body">
                <div className="modal__main-content">
                    <section className="modal__section">
                        <p>
                            <strong>Id: </strong>
                            {product.id}
                        </p>
                        <p>
                            <strong>Nome: </strong>
                            {product.name}
                        </p>
                    </section>

                    <section className="modal__section">
                        <h3 className="modal__section-title">
                            Informações Gerais
                        </h3>
                        <p>
                            <strong>Status: </strong>
                            <span
                                className="status-badge modal__item-status-inline"
                                data-status={product.status}
                            >
                                {STATUS_LABEL[product.status]}
                            </span>
                        </p>

                        {!isActive && product.deactivationReason && (
                            <p className="modal__multiline">
                                <strong>Motivo da desativação:</strong>
                                <br />
                                {product.deactivationReason}
                            </p>
                        )}

                        {product.notes && (
                            <p className="modal__multiline">
                                <strong>Observações Gerais:</strong>
                                <br />
                                {product.notes}
                            </p>
                        )}
                    </section>

                    <section className="modal__section">
                        <h3 className="modal__section-title">Histórico</h3>
                        <p>
                            <strong>Criado por:</strong>{" "}
                            {product.createdBy || "SYSTEM"} em{" "}
                            {toDDMMYYYYYHHMM(product.createdAt ?? null)}
                        </p>

                        {product.updatedAt && (
                            <p>
                                <strong>
                                    {!isActive ? "Inativado" : "Editado"} por:
                                </strong>{" "}
                                {product.updatedBy || "SYSTEM"} em{" "}
                                {toDDMMYYYYYHHMM(product.updatedAt)}
                            </p>
                        )}
                    </section>
                </div>
            </div>
            <div className="app-dialog__actions">
                <ActionsMenu actions={actionsConfig} isModal={true} />
            </div>
        </>
    );
}

// function getIdAndName(user?: BasicUser): string | undefined {
//     if (!user) return;
//     return `${user.id} - ${user.username}`;
// }
