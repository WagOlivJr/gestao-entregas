import { useState } from "react";
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
    displayOnModal?: boolean;
}

interface ActionsMenuProps {
    actions: ActionConfig[];
    isModal?: boolean;
}

export function ActionsMenu({ actions, isModal }: ActionsMenuProps) {
    const [isVisible, setIsVisible] = useState(false);

    const visibleActions = actions.filter((ac) =>
        isModal ? (ac.displayOnModal ?? true) && !ac.disabled : true,
    );

    if (isModal && !visibleActions.length) {
        return null;
    }

    return (
        <div
            className={`${isModal ? "modal" : "data-table"}__actions-container`}
        >
            <button
                type="button"
                className={
                    "actions__trigger" +
                    (isVisible ? " actions__trigger--active" : "")
                }
                onClick={(e) => {
                    setIsVisible((prev) => !prev);
                    e.stopPropagation();
                }}
                title={`${isVisible ? "Fechar" : "Abrir"} menu de ações`}
            >
                Ações&thinsp;
                <span className="actions__trigger-icon">
                    {isVisible ? "✕" : "☰"}
                </span>
            </button>

            <div
                className={
                    "actions-btns" + (isVisible ? " actions-btns--show" : "")
                }
            >
                {visibleActions.map((action) => (
                    <button
                        key={action.key}
                        type="button"
                        className={`actions-btns__btn ${action.disabled ? "" : "actions-btns__btn--enabled"} ${action.className}`}
                        disabled={action.disabled}
                        title={isModal ? action.dataTitle : action.title}
                        data-title={!isModal ? action.dataTitle : undefined}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!action.disabled) {
                                action.onClick();
                            }
                        }}
                    >
                        <span
                            className={`${action.icon} actions-btns__btn-icon`}
                        ></span>{" "}
                        <span className="actions-btns__btn-text">
                            {action.text}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
