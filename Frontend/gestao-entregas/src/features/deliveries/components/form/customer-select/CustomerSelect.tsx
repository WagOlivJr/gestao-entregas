import { useMemo, useState } from "react";
import { useAsyncResource } from "../../../../../shared/hooks/useAsyncResource";
import type { BasicCustomer } from "../../../../customers/Customer";
import { customersService } from "../../../../customers/services/customersService";
import { normalizeText } from "../../../../../shared/utils/text/textFormatter";

export interface CustomerOption {
    id: number;
    name: string;
}

interface Props {
    customer?: BasicCustomer;
    canEdit?: boolean;
}

interface SearchableOption extends CustomerOption {
    searchTerm: string;
}

export function CustomerSelect({ customer, canEdit }: Props) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState("");
    const [showClearButton, setShowClearButton] = useState(false);

    const { data } = useAsyncResource(
        (signal) => customersService.getActiveOptions(signal),
        [],
        canEdit,
    );

    const options = useMemo(
        () =>
            data?.map<SearchableOption>(({ id, name }) => ({
                id,
                name,
                searchTerm: `${String(id)}${normalizeText(name)}`,
            })) ?? [],
        [data],
    );

    const normalizedSearch = normalizeText(search);
    const visibleOptions = useMemo(
        () =>
            options.filter((op) => {
                return op.searchTerm.includes(normalizedSearch);
            }),
        [options, normalizedSearch],
    );

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);

        const normalized = normalizeText(newSearch);
        if (!normalized) {
            setSelected("");
            return;
        }

        const first = options.find((op) => op.searchTerm.includes(normalized));
        setSelected(first ? String(first.id) : "");
    };

    return (
        <fieldset className="selection-fields" id="customer-selection">
            <legend>
                {canEdit ? "Selecionar Cliente" : "Cliente selecionado"}
            </legend>

            {canEdit && (
                <div
                    className="form-field"
                    onBlur={(e) => {
                        setShowClearButton(
                            !!e.currentTarget.contains(e.relatedTarget),
                        );
                    }}
                >
                    <input
                        type="text"
                        id="busca-clientes"
                        placeholder="Digite para buscar clientes"
                        value={search}
                        onChange={(e) =>
                            handleSearchChange(e.currentTarget.value)
                        }
                        onFocus={() => setShowClearButton(true)}
                    />

                    {search && showClearButton && (
                        <button
                            tabIndex={-1}
                            type="button"
                            className="form-clear-search clear-customer"
                            onClick={() => handleSearchChange("")}
                        >
                            Limpar
                        </button>
                    )}
                </div>
            )}

            <div className="form-field customer-select-container">
                <select
                    id="entrega-cliente"
                    name={canEdit ? "customerId" : undefined}
                    value={selected}
                    onChange={(e) => setSelected(String(e.currentTarget.value))}
                    disabled={!canEdit}
                    required
                >
                    {canEdit ? (
                        visibleOptions.length === 0 ? (
                            <option value="" disabled>
                                Clientes não encontrados
                            </option>
                        ) : (
                            <>
                                {visibleOptions.length > 1 && (
                                    <option value="" disabled>
                                        Selecione um cliente*
                                    </option>
                                )}

                                {visibleOptions.map(({ id, name }) => (
                                    <option key={id} value={id}>
                                        {getCustomerLabel({ id, name })}
                                    </option>
                                ))}
                            </>
                        )
                    ) : (
                        <option>{getCustomerLabel(customer)}</option>
                    )}
                </select>
                {!canEdit && (
                    <input
                        type="hidden"
                        name="customerId"
                        value={customer?.id}
                    />
                )}
            </div>
        </fieldset>
    );
}

function getCustomerLabel(customer?: CustomerOption) {
    if (!customer) return "SYSTEM";
    return `${customer.id} - ${customer.name}`;
}
