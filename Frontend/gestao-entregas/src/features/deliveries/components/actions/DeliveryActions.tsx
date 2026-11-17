import {
    ActionsMenu,
    type ActionConfig,
} from "../../../../shared/components/actionsColumn/ActionsMenu";
import { useDialog } from "../../../../shared/contexts/dialog-context";
import {
    cancelAction,
    deleteAction,
    editAction,
    progressAction,
    seeDetailsAction,
    seeProductsAction,
} from "../../actions/deliveryActions";
import { useDeliveriesListActions } from "../../contexts/customers-list-context";
import type { Delivery } from "../../types/delivery";
import {
    openDeliveryDetails,
    openProducts,
} from "../../open-deliveries-details";

export function DeliveryActions({ delivery }: { delivery: Delivery }) {
    const { onEdit, onSuccess } = useDeliveriesListActions();
    const { openDialog } = useDialog();
    const deps = { openDialog, onSuccess };

    const actions: ActionConfig[] = [
        progressAction(delivery, { openDialog, onSuccess }),
        seeDetailsAction(() =>
            openDeliveryDetails(openDialog, delivery.id, { onEdit, onSuccess }),
        ),
        editAction(delivery, onEdit),
        seeProductsAction(() => openProducts(openDialog, delivery, onEdit)),
        cancelAction(delivery, deps),
        deleteAction(delivery, deps),
    ];

    return <ActionsMenu actions={actions} />;
}
