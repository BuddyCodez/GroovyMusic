import { atom } from "jotai";
import { Song } from "@/types/song";

export const queueAtom = atom<Song[]>([]);
export const shuffleAtom = atom<boolean>(false);
export const repeatAtom = atom<boolean>(false);
export const PlayerAtom = atom<any | null>(null);
export const currentSongAtom = atom<Song | null>(null);
export const songBufferingAtom = atom<boolean>(true);