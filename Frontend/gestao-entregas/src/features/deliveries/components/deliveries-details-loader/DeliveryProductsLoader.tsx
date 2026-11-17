import { useAsyncResource } from "../../../../shared/hooks/useAsyncResource";
import { deliveriesService } from "../../services/deliveriesService";
import { InlineError } from "../../../../shared/components/inlineError/InlineError";
import { type Delivery } from "../../types/delivery";
import { useDialog } from "../../../../shared/contexts/dialog-context";
import { CLOSED_STATUSES, type DeliveryStatus } from "../../types/status";
import type { DeliveryItem } from "../../types/deliveryItem";

interface Props {
    delivery: Delivery;
    editDelivery?: (delivery: Delivery) => void;
}

export function DeliveryProductsLoader({ delivery, editDelivery }: Props) {
    const { closeDialog } = useDialog();
    const deliveryId = delivery.id;
    const { data, loading, error, reload } = useAsyncResource(
        (signal) => deliveriesService.getById(deliveryId, signal),
        [deliveryId],
        !delivery.items,
    );

    const resolvedDelivery = data ?? delivery;
    if (!resolvedDelivery) return;

    const onEditClick = () => {
        closeDialog();
        editDelivery?.(resolvedDelivery);
    };

    const deliveryItems = resolvedDelivery?.items ?? [];

    const isOpenToEdit = !(
        CLOSED_STATUSES as readonly DeliveryStatus[]
    ).includes(resolvedDelivery.status);

    if (!deliveryItems.length && loading) {
        return <div>Carregando produtos da entrega #{deliveryId}...</div>;
    }
    if (!deliveryItems.length && error) {
        return (
            <InlineError
                error={error}
                title="Não foi possível carregar os produtos..."
                onRetry={reload}
            />
        );
    }
    if (deliveryItems.length) {
        return (
            <>
                <DeliveryItemsList deliveryItems={deliveryItems} />
                {editDelivery && isOpenToEdit && (
                    <div className="modal__btns-area">
                        <button
                            className="btn--edit btns-area_btn"
                            id="btn-produtos-editar"
                            onClick={onEditClick}
                        >
                            Editar
                        </button>
                    </div>
                )}
            </>
        );
    }
}

function DeliveryItemsList({
    deliveryItems,
}: {
    deliveryItems: DeliveryItem[];
}) {
    return (
        <>
            <div className="modal__body">
                <table className="tabela-produtos">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>

                    <tbody>
                        {deliveryItems.map(({ id, name, quantity }) => (
                            <tr key={id}>
                                <td>{`#${id} - ${name}`}</td>
                                <td>{quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
