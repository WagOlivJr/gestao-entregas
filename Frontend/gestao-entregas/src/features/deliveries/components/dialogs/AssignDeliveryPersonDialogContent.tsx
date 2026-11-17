import { useState } from "react";
import { useDialog } from "../../../../shared/contexts/dialog-context";
import { useDeliveryPeople } from "../../hooks/useDeliveryPeople";
import { useDialogActions } from "../../../../shared/hooks/useDialogActions";

interface Props {
    deliveryId: number;
    onAssign: (deliveryPersonId: number) => unknown | Promise<unknown>;
    onSuccess?: () => void;
    cancelLabel?: string;
    confirmLabel?: string;
}

export function AssignDeliveryPersonDialogContent({
    deliveryId,
    onAssign,
    onSuccess,
    cancelLabel = "Cancelar",
    confirmLabel = "Atribuir",
}: Props) {
    const { closeDialog } = useDialog();
    const {
        deliveryPeople,
        loading,
        error: loadError,
        retry,
    } = useDeliveryPeople();
    const { pending, error, setError, execute } = useDialogActions({
        onSuccess,
    });

    const [selectedId, setSelectedId] = useState<string>("");

    const selectedDeliveryPerson = deliveryPeople.find(
        (person) => person.id === Number(selectedId),
    );

    const handleConfirm = () => {
        if (!selectedDeliveryPerson) {
            setError("Selecione um entregador para atribuir à entrega.");
            return;
        }

        void execute(() => onAssign(selectedDeliveryPerson.id));
    };

    const isConfirmDisabled = pending || !selectedId;

    return (
        <>
            <p>Selecione o entregador para a entrega #{deliveryId}:</p>

            <p>
                A atribuição alterará o status da entrega de
                <strong> Pendente</strong> para
                <strong> Atribuída</strong>.
            </p>

            <label>
                <span>Entregador</span>

                <select
                    className="form-select"
                    value={selectedId}
                    disabled={
                        pending ||
                        loading ||
                        !!loadError ||
                        deliveryPeople.length === 0
                    }
                    onChange={(e) => {
                        setSelectedId(e.target.value);
                        setError(null);
                    }}
                >
                    <option value="">
                        {loading
                            ? "Carregando entregadores..."
                            : "-- Selecione um entregador --"}
                    </option>

                    {deliveryPeople.map((person) => (
                        <option key={person.id} value={person.id}>
                            {person.name}
                        </option>
                    ))}
                </select>
            </label>

            {loadError && (
                <div>
                    <p role="alert">{loadError}</p>

                    <button
                        type="button"
                        disabled={loading || pending}
                        onClick={retry}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {!loading && !loadError && deliveryPeople.length === 0 && (
                <p role="status">
                    Não existem entregadores disponíveis para atribuição.
                </p>
            )}

            {error && <p role="alert">{error}</p>}

            <div className="app-dialog__actions">
                <button type="button" disabled={pending} onClick={closeDialog}>
                    {cancelLabel}
                </button>

                <button
                    type="button"
                    disabled={isConfirmDisabled}
                    onClick={handleConfirm}
                >
                    {pending ? "Processando…" : confirmLabel}
                </button>
            </div>
        </>
    );
}
