import { useCallback, useEffect, useState } from "react";
import type { DeliveryPersonOption } from "../types/delivery";
import { usersService } from "../../users/services/usersService";

export function useDeliveryPeople() {
    const [deliveryPeople, setDeliveryPeople] = useState<
        DeliveryPersonOption[]
    >([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState(0);

    const retry = useCallback(() => setReloadToken((curr) => curr + 1), []);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                // const result = await usersService.listDeliveryPeople();

                if (!cancelled) {
                    setDeliveryPeople([
                        { id: 1, name: "João" },
                        { id: 2, name: "Maria" },
                    ]);
                }
            } catch (cause) {
                if (!cancelled) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Não foi possível carregar os entregadores.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [reloadToken]);

    return {
        deliveryPeople,
        loading,
        error,
        retry,
    };
}
