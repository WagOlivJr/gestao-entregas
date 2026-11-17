import { create } from "zustand";

interface ItemsPerPageStore {
    itemsPerPage: number;
    setItemsPerPage: (itemsPerPage: number) => void;
    isVisible: boolean;
    toggleVisibility: (visible: boolean) => void;
}

export const useItemsPerPageStore = create<ItemsPerPageStore>((set) => ({
    itemsPerPage: 10,
    isVisible: false,
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
    toggleVisibility: (visible) => set({ isVisible: visible }),
}));
