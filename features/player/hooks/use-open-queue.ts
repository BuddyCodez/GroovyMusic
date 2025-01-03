import { create } from "zustand";
type OpenQueueState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};
export const useOpenQueue = create<OpenQueueState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));