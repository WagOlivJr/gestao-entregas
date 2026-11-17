import { InlineError } from "../../../../shared/components/inlineError/InlineError";
import { Skeleton } from "../../../../shared/components/skeleton/Skeleton";
import { useAsyncResource } from "../../../../shared/hooks/useAsyncResource";
import type { CustomerHandlers } from "../../actions/customersActions";
import type { Customer } from "../../Customer";
import { customersService } from "../../services/customersService";
import { CustomerDetails } from "./CustomerDetails";

interface Props {
    customerId: number;
    handlers: CustomerHandlers;
    initialCustomer?: Customer;
}

export function CustomerDetailsLoader({
    customerId,
    handlers,
    initialCustomer,
}: Props) {
    const { data, error, loading, reload } = useAsyncResource(
        (signal) => customersService.getById(customerId, signal),
        [customerId],
    );

    const customer = data ?? initialCustomer ?? null;
    if (!customer && loading) return <CustomerDetailsSkeleton />;
    if (!customer && error) {
        return (
            <InlineError
                error={error}
                title="Não foi possível carregar os detalhes..."
                onRetry={reload}
            />
        );
    }
    if (customer) {
        return <CustomerDetails customer={customer} handlers={handlers} />;
    }
}

function CustomerDetailsSkeleton() {
    return (
        <Skeleton
            ariaLabel="Carregando detalhes do cliente"
            sections={[
                { lines: ["40%", "65%"] },
                { title: true, lines: ["35%", "80%", "72%"] },
                { title: true, lines: ["58%", "52%"] },
            ]}
        />
    );
}
