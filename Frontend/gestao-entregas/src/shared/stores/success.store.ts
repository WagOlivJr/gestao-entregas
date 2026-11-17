import { create } from "zustand";

interface SuccessStoreState {
    queue: string[];
    enqueue: (message: string) => void;
    dequeue: () => string | null;
}

export const useSuccessStore = create<SuccessStoreState>((set, get) => ({
    queue: [],
    enqueue: (message) =>
        set((state) => ({ queue: [...state.queue, message] })),
    dequeue: () => {
        const [message, ...rest] = get().queue;
        if (message === undefined) return null;
        set({ queue: rest });
        return message;
    },
}));
