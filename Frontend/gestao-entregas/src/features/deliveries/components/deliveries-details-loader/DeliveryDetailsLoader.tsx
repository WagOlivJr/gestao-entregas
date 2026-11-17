import { InlineError } from "../../../../shared/components/inlineError/InlineError";
import { Skeleton } from "../../../../shared/components/skeleton/Skeleton";
import { useAsyncResource } from "../../../../shared/hooks/useAsyncResource";
import type { DeliveryHandlers } from "../../actions/deliveryActions";
import type { Delivery } from "../../types/delivery";
import { deliveriesService } from "../../services/deliveriesService";
import { DeliveryDetails } from "./DeliveryDetails";

interface Props {
    deliveryId: number;
    handlers: DeliveryHandlers;
    initialDelivery?: Delivery;
}

export function DeliveryDetailsLoader({
    deliveryId,
    handlers,
    initialDelivery,
}: Props) {
    const { data, error, loading, reload } = useAsyncResource(
        (signal) => deliveriesService.getById(deliveryId, signal),
        [deliveryId],
    );

    console.log({ error });

    const delivery = data ?? initialDelivery ?? null;
    if (!delivery && loading) return <DeliveryDetailsSkeleton />;
    if (!delivery && error) {
        return (
            <InlineError
                error={error}
                title="Não foi possível carregar os detalhes..."
                onRetry={reload}
            />
        );
    }
    if (delivery) {
        return <DeliveryDetails delivery={delivery} handlers={handlers} />;
    }
}

function DeliveryDetailsSkeleton() {
    return (
        <Skeleton
            ariaLabel="Carregando detalhes da entrega"
            sections={[
                { lines: ["40%", "65%"] },
                { title: true, lines: ["35%", "80%", "72%"] },
                { title: true, lines: ["58%", "52%"] },
            ]}
        />
    );
}
