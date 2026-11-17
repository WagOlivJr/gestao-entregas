export function DeliveryPersonSelect({ canEdit }: { canEdit?: boolean }) {
    return (
        <div className="form-field">
            <label htmlFor="delivery-form-delivery-person">Entregador</label>

            <select
                className="fit-content"
                id="delivery-form-delivery-person"
                name={canEdit ? "deliveryPerson" : undefined}
                title="Entregador"
                defaultValue=""
                disabled={!canEdit}
            >
                <option value="" disabled>
                    Selecione um entregador
                </option>
            </select>
            {!canEdit && (
                <input type="hidden" defaultValue={""} name="deliveryPerson" />
            )}
        </div>
    );
}
