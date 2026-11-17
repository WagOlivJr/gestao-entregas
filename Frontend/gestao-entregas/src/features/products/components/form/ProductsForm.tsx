import { useState, type SubmitEvent } from "react";
import type { Product } from "../../Product";
import { productsService } from "../../services/productsService";
import {
    Form,
    type InputFieldProps,
} from "../../../../shared/components/Form/Form";
import { createIdempotencyKey } from "../../../../shared/services/api";

function getFieldsConfig(product?: Product): InputFieldProps[] {
    const isEdition = !!product;
    return [
        {
            id: "form-field_product-name",
            name: "name",
            label: "Nome*",
            required: true,
            type: "text",
            className: "form-field_product-name",
            placeholder: "Nome do produto (Obrigatório).",
            defaultValue: product?.name,
        },
        {
            id: "form-field_product-status",
            name: "status",
            type: "select",
            label: "Status*",
            required: true,
            className: "form-field_product-status fit-content",
            options: [
                { value: "active", label: "Ativo" },
                ...(isEdition ? [{ value: "inactive", label: "Inativo" }] : []),
            ],
            defaultValue: product?.status || "active",
            disabled: !isEdition,
        },
        {
            id: "form-field_product-notes",
            name: "notes",
            label: "Observações",
            type: "textarea",
            className: "form-field_product-notes",
            placeholder: "Insira observações sobre o produto (Opcional).",
            defaultValue: product?.notes,
        },
        ...(isEdition
            ? [
                  {
                      id: "form-field_product-deactivation-reason",
                      name: "deactivationReason",
                      label: "Motivo da Desativação",
                      type: "textarea",
                      className: "form-field_product-deactivation-reason",
                      placeholder:
                          "Insira o motivo da desativação do produto (Opcional).",
                      defaultValue: product?.deactivationReason,
                      required: true,
                  },
              ]
            : []),
    ];
}

export interface ProductFormData {
    name: string;
    status?: "active" | "inactive";
    notes?: string;
    deactivationReason?: string;
}

interface productsFormProps {
    product?: Product;
    onCancel: () => void;
    onSaved?: () => void;
}
export function ProductsForm({
    product,
    onCancel,
    onSaved,
}: productsFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEdition = !!product;

    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const productPayload = Object.fromEntries(
            new FormData(event.currentTarget).entries(),
        ) as unknown as ProductFormData;

        !productPayload.notes && delete productPayload.notes;
        try {
            if (isEdition) {
                !productPayload.deactivationReason &&
                    delete productPayload.deactivationReason;
                await productsService.update(product.id, productPayload);
            } else {
                const idempotencykey = createIdempotencyKey();
                delete productPayload.status;
                await productsService.create(productPayload, idempotencykey);
            }
            onSaved?.();
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Erro ao salvar produto.",
            );
            setSubmitting(false);
        }
    }

    return Form({
        title: isEdition ? `Editar Produto #${product.id}` : "Novo Produto",
        fieldsConfig: getFieldsConfig(product),
        onSubmit,
        onCancel,
        submitting,
        error,
        className: "product-form",
    });
}
