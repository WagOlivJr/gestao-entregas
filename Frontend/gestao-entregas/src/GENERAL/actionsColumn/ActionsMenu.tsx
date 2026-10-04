import "./ActionsMenu.css";

export interface ActionConfig {
    key: string;
    text: string;
    icon: string;
    className?: string;
    disabled?: boolean;
    title?: string;
    dataTitle?: string;
    onClick: () => void;
}

interface ActionsMenuProps {
    actions: ActionConfig[];
}

export function ActionsMenu({ actions }: ActionsMenuProps) {
    return (
        <div className="data-table__actions-container">
            <button
                type="button"
                className="actions__trigger"
                onClick={(e) => e.stopPropagation()}
            >
                Ações&thinsp;
                <span className="actions__trigger-icon">☰</span>
            </button>

            <div className="actions-btns">
                {actions.map((action) => (
                    <button
                        key={action.key}
                        type="button"
                        className={`actions-btns__btn ${action.disabled ? "" : "actions-btns__btn--enabled"} ${action.className}`}
                        disabled={action.disabled}
                        title={action.title}
                        data-title={action.dataTitle}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!action.disabled) {
                                action.onClick();
                            }
                        }}
                    >
                        <span
                            className={`${action.icon} actions-btns__btn-icon`}
                        ></span>
                        <span className="actions-btns__btn-text">
                            {action.text}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
