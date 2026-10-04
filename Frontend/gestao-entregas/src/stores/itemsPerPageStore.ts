import { create } from "zustand";

interface ItemsPerPageStore {
    itemsPerPage: number;
    setItemsPerPage: (itemsPerPage: number) => void;
}

export const useItemsPerPageStore = create<ItemsPerPageStore>((set) => ({
    itemsPerPage: 10,
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
}));
