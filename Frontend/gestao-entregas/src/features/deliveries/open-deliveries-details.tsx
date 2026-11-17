import type { DialogRequest } from "../../shared/contexts/dialog-context";
import type { DeliveryHandlers } from "./actions/deliveryActions";
import { DeliveryDetailsLoader } from "./components/deliveries-details-loader/DeliveryDetailsLoader";
import { DeliveryProductsLoader } from "./components/deliveries-details-loader/DeliveryProductsLoader";
import type { Delivery } from "./types/delivery";

export function openDeliveryDetails(
    openDialog: (request: DialogRequest) => void,
    deliveryId: number,
    handlers: DeliveryHandlers,
) {
    openDialog({
        title: `Detalhes da entrega #${deliveryId}`,
        content: (
            <DeliveryDetailsLoader
                deliveryId={deliveryId}
                handlers={handlers}
            />
        ),
        showCloseButton: true,
        dismissOnEscape: true,
        dismissOnOutsideClick: true,
    });
}

export function openProducts(
    openDialog: (request: DialogRequest) => void,
    delivery: Delivery,
    editDelivery?: (delivery: Delivery) => void,
) {
    openDialog({
        title: `Produtos da entrega #${delivery.id}`,
        content: (
            <DeliveryProductsLoader
                delivery={delivery}
                editDelivery={editDelivery}
            />
        ),
        showCloseButton: true,
        dismissOnEscape: true,
        dismissOnOutsideClick: true,
    });
}
