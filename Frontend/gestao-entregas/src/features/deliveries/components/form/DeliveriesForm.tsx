import { useEffect, useRef, useState, type SubmitEvent } from "react";
import type { Delivery } from "../../types/delivery";
import {
    parseDeliveryStatus,
    parseNullableNumber,
    readOptionalString,
    readString,
} from "../../../../shared/utils/form/formReader";
import { deliveriesService } from "../../services/deliveriesService";
import { createIdempotencyKey } from "../../../../shared/services/api";
import "./DeliveriesForm.css";
import { useAsyncResource } from "../../../../shared/hooks/useAsyncResource";
import type { DeliveryStatus } from "../../types/status";
import { SelectDeliveryStatus } from "./delivery-status-select/SelectDeliveryStatus";
import { FormButtons } from "../../../../shared/components/Form/form-buttons/FormButtons";
import type { DeliveryItem } from "../../types/deliveryItem";
import { CustomerSelect } from "./customer-select/CustomerSelect";
import { PurchaseDateInput } from "./purchase-date-select/PurchaseDateSelect";
import { ProductsSelect } from "./products-select/ProductsSelect";
import { DeliveryPersonSelect } from "./delivery-person/DeliveryPersonSelect";

export interface DeliveryItemPayload {
    productId: number;
    quantity: number;
}

export interface DeliveryPayload {
    id?: number;
    customerId: number;
    status?: DeliveryStatus;
    items: DeliveryItemPayload[];
    purchaseDate: string;
    deliveryPerson: number | null;
    notes: string | null;
    cancelingReason?: string;
}

interface Props {
    delivery?: Delivery;
    onCancel: () => void;
    onSaved: () => void;
}

export function DeliveriesForm({ delivery, onCancel, onSaved }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEdition = !!delivery;
    const deliveryId = delivery?.id ?? 0;

    const {
        data,
        // error: fetchError,
        // loading,
        // reload,
    } = useAsyncResource(
        (signal) => deliveriesService.getById(deliveryId, signal),
        [deliveryId],
        !!deliveryId && !delivery?.items,
    );

    const fecthedDelivery = data ?? delivery;

    const [items, setItems] = useState<DeliveryItem[]>(
        fecthedDelivery?.items ?? [],
    );

    useEffect(() => {
        if (fecthedDelivery?.items) setItems(fecthedDelivery.items);
    }, [fecthedDelivery]);

    const updateItems = (
        id: number,
        quantity?: number,
        name?: string,
        acc?: boolean,
    ) => {
        setItems((prev) => {
            const itemIndex = prev.findIndex((item) => item.id === id);
            if (itemIndex > -1) {
                const currentItem = prev[itemIndex];

                const nextQuantity =
                    acc && quantity !== undefined
                        ? currentItem.quantity + quantity
                        : (quantity ?? 0);

                if (nextQuantity < 1) {
                    return prev.toSpliced(itemIndex, 1);
                }

                return prev.with(itemIndex, {
                    ...currentItem,
                    quantity: nextQuantity,
                });
            }

            if (quantity && quantity > 0 && name) {
                return [...prev, { id, name, quantity }];
            }

            console.warn(
                "Dados inválidos ou item não encontrado para atualização:",
                { id, quantity, name },
            );

            return prev;
        });
    };

    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const deliveryPayload = getDeliveryPayload(
            event.currentTarget,
            items,
            isEdition,
        );

        try {
            if (isEdition) {
                await deliveriesService.update(delivery.id, deliveryPayload);
            } else {
                await deliveriesService.create(
                    deliveryPayload,
                    createIdempotencyKey(),
                );
            }
            onSaved?.();
            console.log(deliveryPayload);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar entregra",
            );
            setSubmitting(false);
        }
    }

    const formContainerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const onCancelRef = useRef(onCancel);
    onCancelRef.current = onCancel;

    useEffect(() => {
        const handleEscapeKeydown = (event: KeyboardEvent) =>
            event.key === "Escape" && onCancel();

        const handleClickOutside = (event: MouseEvent) =>
            !formContainerRef.current?.contains(event.target as Node) &&
            onCancel();

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKeydown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKeydown);
        };
    }, []);

    const title = isEdition
        ? `Editar Entrega #${fecthedDelivery?.id}`
        : "Nova Entrega";

    const itemsEditableStatuses: DeliveryStatus[] = ["pending", "assigned"];
    const canEditItems =
        !isEdition ||
        (!!fecthedDelivery &&
            itemsEditableStatuses.includes(fecthedDelivery.status));

    return (
        <>
            <div className="form-overlay active"></div>
            <div ref={formContainerRef} className="new-item-form delivery-form">
                <h3 className="form-title">{title}</h3>
                <form ref={formRef} onSubmit={onSubmit}>
                    <div className="form-columns-wrapper">
                        <div className="form-left">
                            <CustomerSelect
                                canEdit={!isEdition}
                                customer={fecthedDelivery?.customer}
                            />
                            <div className="form__horizontal-fields-container">
                                <PurchaseDateInput
                                    canEdit={!isEdition}
                                    purchaseDate={fecthedDelivery?.purchaseDate}
                                />
                                <SelectDeliveryStatus
                                    delivery={fecthedDelivery}
                                    formRef={formRef}
                                />
                                <DeliveryPersonSelect
                                    canEdit={
                                        !isEdition ||
                                        fecthedDelivery?.status === "pending"
                                    }
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="delivery-form-notes">
                                    Observações
                                </label>
                                <textarea
                                    id="delivery-form-notes"
                                    name="notes"
                                    placeholder="Observações (Opcional)"
                                    title="Observações (Opcinoal)"
                                    defaultValue={fecthedDelivery?.notes ?? ""}
                                    onKeyDown={(e) => {
                                        if (e.key == "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            formRef.current?.requestSubmit();
                                        }
                                    }}
                                    cols={50}
                                />
                            </div>
                        </div>
                        <div className="form-right">
                            <ProductsSelect
                                items={items}
                                updateItems={updateItems}
                                canEdit={canEditItems}
                            />
                        </div>
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <FormButtons
                        onCancel={onCancelRef.current}
                        submitting={submitting}
                    />
                </form>
            </div>
        </>
    );
}

function getDeliveryPayload(
    form: HTMLFormElement,
    items: DeliveryItem[],
    isEdition?: boolean,
): DeliveryPayload {
    const fd = new FormData(form);

    const payload: DeliveryPayload = {
        customerId: parseNullableNumber(readString(fd, "customerId")) ?? 0,
        purchaseDate: readString(fd, "purchaseDate"),
        deliveryPerson: parseNullableNumber(readString(fd, "deliveryPerson")),
        items: items.map<DeliveryItemPayload>(({ id, quantity }) => ({
            productId: id,
            quantity,
        })),
        notes: readOptionalString(fd, "notes"),
        cancelingReason: readOptionalString(fd, "cancelingReason") ?? undefined,
        status: isEdition
            ? parseDeliveryStatus(readString(fd, "status"))
            : undefined,
    };

    return payload;
}
