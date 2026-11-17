interface Props {
    onCancel?: () => void;
    cancelLabel?: string;
    onSubmit?: () => void;
    submitting?: boolean;
}

export function FormButtons({
    onCancel,
    cancelLabel,
    onSubmit,
    submitting,
}: Props) {
    return (
        <div className="form-buttons">
            <button type="button" onClick={onCancel}>
                {cancelLabel ?? "Cancelar"}
            </button>
            <button type="submit" onClick={onSubmit} disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar"}
            </button>
        </div>
    );
}
