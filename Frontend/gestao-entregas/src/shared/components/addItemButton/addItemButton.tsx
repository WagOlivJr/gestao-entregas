interface Props {
    label?: string;
    onClick: () => void;
    isVisible: boolean;
}

export function AddItemButton({ onClick, isVisible, label }: Props) {
    if (!isVisible) return null;

    return (
        <div>
            <button type="button" className="btn-add-item" onClick={onClick}>
                <span className="fas fa-plus" data-fallback="➕"></span>
                {label ?? "Adicionar"}
            </button>
        </div>
    );
}
