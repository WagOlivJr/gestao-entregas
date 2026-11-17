import type { Product } from "../../Product";
import {
    ActionsMenu,
    type ActionConfig,
} from "../../../../shared/components/actionsColumn/ActionsMenu";
import { productsService } from "../../services/productsService";
import { ConfirmDialogContent } from "../../../../shared/components/dialog/ConfirmDialogContent";
import {
    useDialog,
    type DialogRequest,
} from "../../../../shared/contexts/dialog-context";
import { ProductDetailsLoader } from "../productDetails/ProductDetailsLoader";

interface ProductsActionsProps {
    product: Product;
    onEdit: (product: Product) => void;
    onSuccess: () => void;
}

export function getActionsConfig(
    product: Product,
    openDialog: (request: DialogRequest) => void,
    onEdit: (product: Product) => void,
    onSuccess: () => void,
): ActionConfig[] {
    const isActive = product.status === "active";
    const canEdit = isActive;

    const onToggleStatusConfirm = (reason?: string): Promise<void> => {
        return isActive
            ? productsService.deactivate(product.id, reason!)
            : productsService.activate(product.id);
    };

    return [
        {
            key: "seeDetails",
            text: "Ver detalhes",
            icon: "fa fa-info-circle",
            className: "actions-btns__btn--see-details",
            dataTitle: "Visualizar detalhes deste produto",
            title: "",
            displayOnModal: false,
            onClick: () =>
                openDialog({
                    title: `Detalhes do produto #${product.id}`,
                    content: (
                        <ProductDetailsLoader
                            productId={product.id}
                            // initialProduct={product}
                            onEdit={onEdit}
                            onSuccess={onSuccess}
                        />
                    ),
                    showCloseButton: true,
                    dismissOnEscape: true,
                    dismissOnOutsideClick: true,
                }),
        },
        {
            key: "edit",
            text: "Editar",
            icon: "fa fa-edit",
            className: "actions-btns__btn--edit",
            disabled: !canEdit,
            dataTitle: canEdit ? "Editar produto" : undefined,
            title: canEdit
                ? undefined
                : "Produto inativo não pode ser editado.",
            onClick: () => onEdit(product),
        },
        {
            key: "seeDeliveries",
            text: "Ver entregas",
            icon: "fa fa-truck",
            className: "actions-btns__btn--deliveries",
            dataTitle: "Visualizar entregas com este produto",
            onClick: () =>
                console.log(
                    "Implementar navegação para o modulo de entregas com filtro",
                ),
        },
        {
            key: "addDeliveries",
            text: "Add. Entrega",
            icon: "fa fa-plus-circle",
            className: "actions-btns__btn--add-delivery",
            disabled: !isActive,
            dataTitle: isActive ? "Criar entrega com este produto" : undefined,
            title: isActive
                ? undefined
                : "Não é possível criar entrega para produto inativo.",
            onClick: () =>
                console.log(
                    "Implementar navegação para o modulo de entregas com criação de entrega associada a produto específico",
                ),
        },
        {
            key: "toggleStatus",
            text: `${isActive ? "Des" : "Re"}ativar`,
            icon: `fa fa-toggle-${isActive ? "on" : "off"}`,
            className: "actions-btns__btn--toggle-status",
            dataTitle: `${isActive ? "Des" : "Re"}ativar produto`,
            onClick: () => {
                openDialog({
                    title: `${isActive ? "Des" : "Re"}ativar produto`,
                    description: `Confirme a ${isActive ? "Des" : "Re"}ativação do produto #${product.id} - ${product.name}`,
                    content: (
                        <ConfirmDialogContent
                            confirmLabel={`${isActive ? "Des" : "Re"}ativar produto`}
                            onConfirm={onToggleStatusConfirm}
                            requiresReason={isActive}
                            onSuccess={onSuccess}
                            reasonLabel="Informe o motivo da desativação do produto"
                            reasonPlaceholder="Digite o motivo da desativação (obrigatório. Mínino de 3 caracteres)."
                            reasonRequiredMessage="O motivo da desativação é obrigatório"
                        />
                    ),
                    dismissOnEscape: false,
                    dismissOnOutsideClick: false,
                    showCloseButton: false,
                });
            },
        },
        {
            key: "delete",
            text: "Excluir",
            icon: "fa fa-trash",
            className: "actions-btns__btn--delete",
            dataTitle: "Excluir produto",
            onClick: () => {
                openDialog({
                    title: "Confirmar exclusão",
                    description: `A exclusão do produto #${product.id} - ${product.name} é uma ação irreversível. Deseja continuar?`,
                    content: (
                        <ConfirmDialogContent
                            confirmLabel="Excluir produto"
                            onConfirm={() => productsService.delete(product.id)}
                            onSuccess={onSuccess}
                        />
                    ),
                    dismissOnEscape: false,
                    dismissOnOutsideClick: false,
                    showCloseButton: false,
                });
            },
        },
    ];
}

export function ProductsActions({
    product,
    onEdit,
    onSuccess,
}: ProductsActionsProps) {
    const { openDialog } = useDialog();

    const actions: ActionConfig[] = getActionsConfig(
        product,
        openDialog,
        onEdit,
        onSuccess,
    );

    return <ActionsMenu actions={actions} />;
}
