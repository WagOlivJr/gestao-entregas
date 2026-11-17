import {
    ActionsMenu,
    type ActionConfig,
} from "../../../../shared/components/actionsColumn/ActionsMenu";
import { useDialog } from "../../../../shared/contexts/dialog-context";
import {
    addDeliveryAction,
    deleteAction,
    editAction,
    seeDeliveriesAction,
    seeDetailsAction,
    toggleStatusAction,
} from "../../actions/customersActions";
import type { Customer } from "../../Customer";
import { openCustomerDetails } from "../../open-customer-details";
import { useCustomersListActions } from "./contexts/customers-list-context";

export function CustomersActions({ customer }: { customer: Customer }) {
    const { onEdit, onSuccess } = useCustomersListActions();
    const { openDialog } = useDialog();
    const deps = { openDialog, onSuccess };

    const actions: ActionConfig[] = [
        seeDetailsAction(() =>
            openCustomerDetails(openDialog, customer.id, { onEdit, onSuccess }),
        ),
        editAction(customer, onEdit),
        seeDeliveriesAction(),
        addDeliveryAction(customer),
        toggleStatusAction(customer, { openDialog, onSuccess }),
        deleteAction(customer, deps),
    ];

    return <ActionsMenu actions={actions} />;
}
