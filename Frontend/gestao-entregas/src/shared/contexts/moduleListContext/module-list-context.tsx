import { createContext, useContext } from "react";

export interface ModuleListActions<T> {
    onEdit: (item: T) => void;
    onSuccess: () => void;
}

export function createModuleListContext<T>(name: string) {
    const Context = createContext<ModuleListActions<T> | null>(null);
    Context.displayName = name;

    function useModuleListActions(): ModuleListActions<T> {
        const value = useContext(Context);
        if (!value) {
            throw new Error(`use${name}Actions fora de <${name}Provider>`);
        }

        return value;
    }

    return [Context.Provider, useModuleListActions] as const;
}
