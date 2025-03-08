import { create } from "zustand";
type OpenPlaylistState = {
    isOpen: boolean;
    song: any;
    onOpen: (song: any) => void;
    onClose: () => void;
};
export const useOpenPlaylist = create<OpenPlaylistState>((set) => ({
    isOpen: false,
    song: null,
    onOpen: (song: any) => set({ isOpen: true, song }),
    onClose: () => set({ isOpen: false, song: null }),
}));