import { useEffect, useRef, useState, type SubmitEvent } from "react";
import type { Address, Customer } from "../../Customer";
import { customersService } from "../../services/customersService";
import { createIdempotencyKey } from "../../../../shared/services/api";
import "./CustomerForm.css";
import type { BasicEntityStatus } from "../../../../shared/types/status";
import { useUpdateEffect } from "../../../../shared/hooks/useUpdateEffect";
import {
    parseEntityStatus,
    parseNullableNumber,
    readOptionalString,
    readString,
} from "../../../../shared/utils/form/formReader";
import { FormButtons } from "../../../../shared/components/Form/form-buttons/FormButtons";

export interface CustomerPayload {
    id?: number;
    name: string;
    status?: BasicEntityStatus;
    address: Address;
    phone: string;
    notes: string | null;
    deactivationReason?: string;
}

interface Props {
    customer?: Customer;
    onCancel: () => void;
    onSaved: () => void;
}

export function CustomersForm({ customer, onCancel, onSaved }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEdition = !!customer;

    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const customerPayload = getCustomerPayload(
            event.currentTarget,
            isEdition,
        );

        try {
            if (isEdition) {
                await customersService.update(customer.id, customerPayload);
            } else {
                await customersService.create(
                    customerPayload,
                    createIdempotencyKey(),
                );
            }
            onSaved?.();
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Erro as salvar cliente.",
            );
            setSubmitting(false);
        }
    }

    return Form({
        title: isEdition ? `Editar Cliente #${customer.id}` : "Novo Cliente",
        onSubmit,
        onCancel,
        submitting,
        error,
        className: "customer-form",
        customer,
    });
}

interface FormProps {
    title: string;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void> | void;
    onCancel: () => void;
    className?: string;
    submitting?: boolean;
    error?: string | null;
    customer?: Customer;
}

function Form({
    title,
    submitting,
    onCancel,
    onSubmit,
    className,
    error,
    customer,
}: FormProps) {
    const formContainerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [addressNumber, setAddressNumber] = useState<number | null>(
        Number(customer?.address.number) || null,
    );
    const [isNumberNull, setIsNumberNull] = useState(
        customer ? !customer?.address.number : false,
    );

    const [status, setStatus] = useState<BasicEntityStatus>(
        customer?.status || "active",
    );
    const originalStatus = customer?.status || "active";
    const shouldShowReasonField =
        originalStatus === "active" && status === "inactive";
    const isEdition = !!customer;

    const onCancelRef = useRef(onCancel);
    onCancelRef.current = onCancel;
    const reasonFieldElRef = useRef<HTMLTextAreaElement>(null);

    const addressNumberFieldRef = useRef<HTMLInputElement>(null);

    useUpdateEffect(() => {
        !isNumberNull && addressNumberFieldRef.current?.focus();
    }, [isNumberNull]);

    useUpdateEffect(() => {
        if (shouldShowReasonField) reasonFieldElRef.current?.focus();
    }, [shouldShowReasonField]);

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

    return (
        <>
            <div className="form-overlay active"></div>
            <div
                ref={formContainerRef}
                className={`new-item-form ${className}`}
            >
                <h3 className="form-title">{title}</h3>
                <form ref={formRef} onSubmit={onSubmit}>
                    <div className="form-field">
                        <label htmlFor="customer-form-name">Nome*</label>
                        <input
                            id="customer-form-name"
                            name="name"
                            type="text"
                            placeholder="Insira o nome completo do cliente"
                            title="Insira o nome completo do cliente"
                            required
                            defaultValue={customer?.name}
                            className="form_customer-name"
                        />
                    </div>
                    <fieldset className="customer-address">
                        <legend>Endereço do cliente</legend>
                        <div className="form__horizontal-fields-container">
                            <div className="form-field">
                                <label htmlFor="customer-form-address-street">
                                    Logradouro*
                                </label>
                                <input
                                    id="customer-form-address-street"
                                    name="address.street"
                                    type="text"
                                    placeholder="Insira o logradouro* (Rua, Avenida, etc...)"
                                    title="Insira o logradouro* (Rua, Avenida, etc...)"
                                    required
                                    defaultValue={customer?.address.street}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="customer-form-address-number">
                                    Número*
                                </label>
                                <input
                                    id="customer-form-address-number"
                                    name="address.number"
                                    type="number"
                                    className="address-number"
                                    pattern="\d{1,8}"
                                    placeholder={
                                        isNumberNull
                                            ? "Sem número"
                                            : "Insira o número do endereço*"
                                    }
                                    title="Insira o número do endereço*"
                                    required={!isNumberNull}
                                    disabled={isNumberNull}
                                    value={
                                        isNumberNull
                                            ? ""
                                            : (addressNumber ?? "")
                                    }
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setAddressNumber(
                                            val !== "" ? Number(val) : null,
                                        );
                                    }}
                                    ref={addressNumberFieldRef}
                                />

                                <div className="address-without-number">
                                    <input
                                        id="customer-form-address-no-number"
                                        type="checkbox"
                                        checked={isNumberNull}
                                        onChange={(e) =>
                                            setIsNumberNull(e.target.checked)
                                        }
                                    />
                                    <label
                                        className={`without-number-label${isNumberNull ? " label-active" : ""}`}
                                        htmlFor="customer-form-address-no-number"
                                    >
                                        Sem número
                                    </label>
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="customer-form-address-complement">
                                    Complemento
                                </label>
                                <input
                                    id="customer-form-address-complement"
                                    name="address.complement"
                                    type="text"
                                    placeholder="Complemento (Opcional)"
                                    title="Complemento (Opcional)"
                                    defaultValue={
                                        customer?.address.complement ??
                                        undefined
                                    }
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="customer-form-address-neighborhood">
                                    Bairro*
                                </label>
                                <input
                                    id="customer-form-address-neighborhood"
                                    name="address.neighborhood"
                                    type="text"
                                    placeholder="Insira o bairro*"
                                    title="Insira o bairro*"
                                    defaultValue={
                                        customer?.address.neighborhood
                                    }
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="customer-form-address-zip-code">
                                    CEP*
                                </label>
                                <input
                                    id="customer-form-address-zip-code"
                                    name="address.zipCode"
                                    type="text"
                                    placeholder="Insira o CEP*"
                                    title="Insira o CEP*"
                                    required
                                    defaultValue={
                                        customer?.address.zipCode || "46765-000"
                                    }
                                    className="zip-code"
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="customer-form-address-city">
                                    Município*
                                </label>
                                <input
                                    id="customer-form-address-city"
                                    name="address.city"
                                    className="city"
                                    type="text"
                                    placeholder="Insira o município*"
                                    title="Insira o município*"
                                    required
                                    defaultValue={
                                        customer?.address.city || "Piatã"
                                    }
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="customer-form-address-state">
                                    Estado*
                                </label>
                                <input
                                    id="customer-form-address-state"
                                    name="address.state"
                                    type="text"
                                    className="state"
                                    placeholder="Insira a UF*"
                                    title="Insira o estado*"
                                    required
                                    defaultValue={
                                        customer?.address.state || "BA"
                                    }
                                />
                            </div>
                        </div>
                    </fieldset>
                    <div className="form__horizontal-fields-container">
                        <div className="form-field">
                            <label htmlFor="customer-form-phone">
                                Telefone*
                            </label>
                            <input
                                id="customer-form-phone"
                                name="phone"
                                type="number"
                                className="tel-width"
                                placeholder="Insira o telefone do cliente*"
                                title="Insira o telefone do cliente*"
                                defaultValue={customer?.phone}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="customer-form-status">
                                Status*
                            </label>
                            <select
                                id="customer-form-status"
                                name="status"
                                className="status"
                                title="Status do cliente*"
                                onChange={(e) =>
                                    setStatus(
                                        e.currentTarget
                                            .value as BasicEntityStatus,
                                    )
                                }
                                defaultValue="acitve"
                                disabled={!isEdition}
                            >
                                <option value="active">Ativo</option>
                                {isEdition && (
                                    <option value="inactive">Inativo</option>
                                )}
                            </select>
                        </div>
                        {shouldShowReasonField && (
                            <div className="form-field">
                                <label htmlFor="customer-form-deactivation-reason">
                                    Motivo da desativação*
                                </label>
                                <textarea
                                    id="customer-form-deactivation-reason"
                                    ref={reasonFieldElRef}
                                    name="deactivationReason"
                                    placeholder="Motivo da desativação do cliente*"
                                    title="Motivo da desativação do cliente*"
                                    cols={50}
                                    defaultValue={customer?.deactivationReason}
                                    required
                                />
                            </div>
                        )}
                        <div className="form-field">
                            <label htmlFor="customer-form-notes">
                                Observações
                            </label>
                            <textarea
                                id="customer-form-notes"
                                name="notes"
                                placeholder="Observações (Opcional)"
                                title="Observações (Opcinoal)"
                                defaultValue={customer?.notes}
                                cols={50}
                            />
                        </div>
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <FormButtons onCancel={onCancel} submitting={submitting} />
                </form>
            </div>
        </>
    );
}

function getCustomerPayload(
    form: HTMLFormElement,
    isEdition?: boolean,
): CustomerPayload {
    const fd = new FormData(form);

    const payload: CustomerPayload = {
        name: readString(fd, "name"),
        phone: readString(fd, "phone"),
        address: {
            street: readString(fd, "address.street"),
            number: parseNullableNumber(readString(fd, "address.number")),
            complement: readOptionalString(fd, "address.complement") ?? null,
            neighborhood: readString(fd, "address.neighborhood"),
            zipCode: readString(fd, "address.zipCode"),
            city: readString(fd, "address.city"),
            state: readString(fd, "address.state"),
        },
        status: isEdition
            ? parseEntityStatus(readString(fd, "status"))
            : undefined,
        notes: readOptionalString(fd, "notes"),
        deactivationReason:
            readOptionalString(fd, "deactivationReason") ?? undefined,
    };

    return payload;
}
