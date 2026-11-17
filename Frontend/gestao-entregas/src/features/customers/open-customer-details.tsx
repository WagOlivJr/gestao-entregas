import type { DialogRequest } from "../../shared/contexts/dialog-context";
import type { CustomerHandlers } from "./actions/customersActions";
import { CustomerDetailsLoader } from "./components/customer-details-loader/CustomerDetailsLoader";

export function openCustomerDetails(
    openDialog: (request: DialogRequest) => void,
    customerId: number,
    handlers: CustomerHandlers,
) {
    openDialog({
        title: `Detalhes do cliente #${customerId}`,
        content: (
            <CustomerDetailsLoader
                customerId={customerId}
                handlers={handlers}
            />
        ),
        showCloseButton: true,
        dismissOnEscape: true,
        dismissOnOutsideClick: true,
    });
}
