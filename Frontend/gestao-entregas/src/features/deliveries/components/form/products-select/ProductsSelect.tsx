import { useMemo, useRef, useState } from "react";
import type { DeliveryItem } from "../../../types/deliveryItem";
import { productsService } from "../../../../products/services/productsService";
import { useAsyncResource } from "../../../../../shared/hooks/useAsyncResource";
import { normalizeText } from "../../../../../shared/utils/text/textFormatter";

interface Props {
    canEdit?: boolean;
    items: DeliveryItem[];
    updateItems: (
        id: number,
        quantity?: number,
        name?: string,
        acc?: boolean,
    ) => void;
}

export interface ProductOption {
    id: number;
    name: string;
}

interface SearchableOption extends ProductOption {
    searchTerm: string;
}

export function ProductsSelect({ canEdit, items, updateItems }: Props) {
    const [itemQuantity, setItemQuantity] = useState("1");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [search, setSearch] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const quantityInputRef = useRef<HTMLInputElement>(null);
    const [showClearButton, setShowClearButton] = useState(false);

    const { data } = useAsyncResource(
        (signal) => productsService.getActiveOptions(signal),
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

    const selectedProduct = options?.find(
        (item) => item?.id === Number(selectedProductId),
    );

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);

        const normalized = normalizeText(newSearch);
        if (!normalized) {
            setSelectedProductId("");
            return;
        }

        const first = options.find((op) => op.searchTerm.includes(normalized));
        setSelectedProductId(first ? String(first.id) : "");
    };

    const handleAddItem = () => {
        if (!(selectedProduct && itemQuantity)) return;

        updateItems(
            selectedProduct.id,
            Number(itemQuantity),
            selectedProduct.name,
            true,
        );

        setItemQuantity("1");
        handleSearchChange("");
        searchInputRef.current?.focus();
    };

    return (
        <fieldset id="container-produtos">
            <legend>{`${canEdit ? "Adicionar " : ""}Produtos`}</legend>

            {canEdit && (
                <div id="add-products-section">
                    <div className="selection-fields">
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
                                placeholder="Digite para buscar produtos"
                                onChange={(e) =>
                                    handleSearchChange(e.currentTarget.value)
                                }
                                value={search}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return;
                                    if (search) {
                                        e.preventDefault();
                                        handleAddItem();
                                    }
                                }}
                                onFocus={() => setShowClearButton(true)}
                                ref={searchInputRef}
                            />

                            {search && showClearButton && (
                                <button
                                    tabIndex={-1}
                                    type="button"
                                    className="form-clear-search clear-product"
                                    onClick={() => {
                                        handleSearchChange("");
                                        searchInputRef.current?.focus();
                                    }}
                                >
                                    Limpar
                                </button>
                            )}
                        </div>

                        <div className="form-field product-select-container">
                            <select
                                id="product-select"
                                value={selectedProductId}
                                onChange={(e) => {
                                    setSelectedProductId(e.target.value);
                                    quantityInputRef.current?.focus();
                                    quantityInputRef.current?.select();
                                }}
                            >
                                <ProductsOptions options={visibleOptions} />
                            </select>
                        </div>
                    </div>

                    <div className="add-products-row">
                        <div className="form-field">
                            <label htmlFor="form-input-item-quantity">
                                Quantidade*
                            </label>

                            <input
                                type="number"
                                min={1}
                                step={1}
                                id="form-input-item-quantity"
                                value={itemQuantity}
                                onChange={(e) =>
                                    setItemQuantity(e.target.value)
                                }
                                ref={quantityInputRef}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return;
                                    if (search) {
                                        e.preventDefault();
                                        handleAddItem();
                                    }
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <button
                                type="button"
                                id="btn-adicionar-produto"
                                className="btn"
                                onClick={handleAddItem}
                                disabled={!selectedProduct || !itemQuantity}
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <SelectedProductsTable
                items={items}
                updateItems={updateItems}
                canUpdateItems={canEdit}
            />
        </fieldset>
    );
}

interface ItemsTableProps {
    items: DeliveryItem[];
    updateItems: (id: number, quantity?: number, name?: string) => void;
    canUpdateItems?: boolean;
}

function SelectedProductsTable({
    items,
    updateItems,
    canUpdateItems,
}: ItemsTableProps) {
    return (
        <div className="produtos-selecionados">
            <h4>Produtos Selecionados:</h4>

            <table className="added-products-table">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody id="lista-produtos-entrega">
                    {items.map(({ id, name, quantity }) => (
                        <tr key={id}>
                            <td>{`#${id} - ${name}`}</td>
                            <td>
                                <div className="quantity-control">
                                    <button
                                        type="button"
                                        disabled={
                                            !canUpdateItems || quantity < 2
                                        }
                                        className="delivery-items-control btn-quantity"
                                        onClick={() =>
                                            updateItems(id, quantity - 1)
                                        }
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        type="button"
                                        className="delivery-items-control btn-quantity"
                                        onClick={() =>
                                            updateItems(id, quantity + 1)
                                        }
                                        disabled={!canUpdateItems}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td>
                                <button
                                    className="delivery-items-control delivery-item-remove-btn"
                                    onClick={() => updateItems(id)}
                                    type="button"
                                    disabled={!canUpdateItems}
                                >
                                    <span className="fa fa-trash" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {!items.length && (
                <p className={"empty-delivery-items-indicator"}>
                    Ainda não foi adicionado nenhum produto.
                </p>
            )}
        </div>
    );
}

interface OptionsProps {
    options: ProductOption[];
}
export function ProductsOptions({ options = [] }: OptionsProps) {
    if (options.length === 0) {
        return (
            <option value="" disabled>
                Produtos não encontrados
            </option>
        );
    }

    return (
        <>
            {options.length > 1 && (
                <option value="" disabled>
                    Adicione produtos
                </option>
            )}

            {options.map(({ id, name }) => (
                <option key={id} value={id}>
                    {`${id} - ${name}`}
                </option>
            ))}
        </>
    );
}
