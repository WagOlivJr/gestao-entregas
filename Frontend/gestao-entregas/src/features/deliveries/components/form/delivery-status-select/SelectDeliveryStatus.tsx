import { useRef, useState, type RefObject } from "react";
import {
    STATUS_LABELS,
    STATUSES_TRANSITIONS,
    type DeliveryStatus,
} from "../../../types/status";
import { useUpdateEffect } from "../../../../../shared/hooks/useUpdateEffect";
import type { Delivery } from "../../../types/delivery";

interface Props {
    delivery?: Delivery;
    formRef?: RefObject<HTMLFormElement | null>;
}

export function SelectDeliveryStatus({ delivery, formRef }: Props) {
    const isEdition = !!delivery;
    const originalStatus: DeliveryStatus = delivery?.status ?? "pending";

    const [status, setStatus] = useState<DeliveryStatus>(originalStatus);

    const shouldShowReasonField =
        isEdition && originalStatus !== "canceled" && status === "canceled";

    const reasonFieldElRef = useRef<HTMLTextAreaElement>(null);

    useUpdateEffect(() => {
        if (shouldShowReasonField) reasonFieldElRef.current?.focus();
    }, [shouldShowReasonField]);

    const availableStatuses: readonly DeliveryStatus[] = isEdition
        ? [originalStatus, ...STATUSES_TRANSITIONS[originalStatus]]
        : [originalStatus];

    return (
        <>
            <div className="form-field">
                <label htmlFor="delivery-form-status">Status*</label>
                <select
                    id="delivery-form-status"
                    name="status"
                    className="status fit-content"
                    title="Status da entrega*"
                    onChange={(e) =>
                        setStatus(e.currentTarget.value as DeliveryStatus)
                    }
                    value={status}
                    disabled={!isEdition}
                >
                    {availableStatuses.map((status) => (
                        <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>
            </div>
            {shouldShowReasonField && (
                <div className="form-field">
                    <label htmlFor="delivery-form-canceling-reason">
                        Motivo do cancelamento*
                    </label>
                    <textarea
                        id="delivery-form-canceling-reason"
                        ref={reasonFieldElRef}
                        name="cancelingReason"
                        placeholder="Motivo do cancelamento da entrega*"
                        title="Motivo do cancelamento da entrega*"
                        cols={50}
                        defaultValue={delivery?.cancelingReason}
                        required
                        onKeyDown={(e) => {
                            if (e.key == "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                formRef?.current?.requestSubmit();
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}
