import type { ActionConfig } from "../actionsColumn/ActionsMenu";

interface Props {
    action: ActionConfig;
    title?: string;
    dataTitle?: string;
}

export function ActionButton({ action, title, dataTitle }: Props) {
    return (
        <button
            type="button"
            className={`actions-btns__btn ${action.disabled ? "" : "actions-btns__btn--enabled"} ${action.className ?? ""}`}
            disabled={action.disabled}
            title={title}
            data-title={dataTitle}
            onClick={(e) => {
                e.stopPropagation();
                action.onClick();
            }}
        >
            <span className={`${action.icon} actions-btns__btn-icon`}></span>{" "}
            <span className="actions-btns__btn-text">{action.text}</span>
        </button>
    );
}
