import { create } from "zustand";

interface loadingStoreState {
    pendingIds: ReadonlySet<string>;
    begin: (id: string) => void;
    end: (id: string) => void;
    reset: () => void;
}

const EMPTY: ReadonlySet<string> = new Set();

export const useLoadingStore = create<loadingStoreState>((set) => ({
    pendingIds: EMPTY,
    begin: (id) =>
        set((state) => {
            if (state.pendingIds.has(id)) return state;
            const next = new Set(state.pendingIds);
            next.add(id);
            return { pendingIds: next };
        }),
    end: (id) =>
        set((state) => {
            if (!state.pendingIds.has(id)) return state;
            const next = new Set(state.pendingIds);
            next.delete(id);
            return { pendingIds: next };
        }),
    reset: () => set({ pendingIds: EMPTY }),
}));

export const selectIsloading = (s: loadingStoreState) => s.pendingIds.size > 0;
