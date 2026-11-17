import { ActionButton } from "../actionButton/ActionButton";
import type { ActionConfig } from "../actionsColumn/ActionsMenu";

export function ActionsBar({ actions }: { actions: ActionConfig[] }) {
    const enabled = actions.filter((action) => !action.disabled);
    if (!enabled) return null;

    return (
        <>
            {enabled.map((action) => (
                <ActionButton
                    key={action.key}
                    action={action}
                    title={action.dataTitle}
                />
            ))}
        </>
    );
}
