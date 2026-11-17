interface Props {
    purchaseDate?: string | Date;
    canEdit?: boolean;
}
export function PurchaseDateInput({ canEdit, purchaseDate }: Props) {
    const formattedDate = getFormattedDateOrNow(purchaseDate);
    return (
        <div className="form-field">
            <label htmlFor="delivery-purchase-date">Data da compra</label>

            <input
                className="fit-content"
                type="date"
                name={canEdit ? "purchaseDate" : undefined}
                id="delivery-purchase-date"
                title="Data de compra da entrega"
                defaultValue={formattedDate}
                required
                max={new Date().toLocaleDateString("en-CA")}
                disabled={!canEdit}
            />
            {!canEdit && (
                <input
                    type="hidden"
                    name="purchaseDate"
                    value={formattedDate}
                />
            )}
        </div>
    );
}

export function getFormattedDateOrNow(date?: string | Date) {
    if (!date) {
        return new Date().toLocaleDateString("en-CA");
    }
    if (date instanceof Date) {
        return date.toLocaleDateString("en-CA");
    }
    return date.slice(0, 10);
}
