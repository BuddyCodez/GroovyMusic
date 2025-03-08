import { atom } from "jotai";
import { Song } from "@/types/song";
import { atomWithStorage } from 'jotai/utils'
export const queueAtom = atomWithStorage<Song[]>('queue', []);
export const shuffleAtom = atom<boolean>(false);
export const repeatAtom = atom<boolean>(false);
export const PlayerAtom = atom<any | null>(null);
export const currentSongAtom = atom<Song | null>(null);
export const songBufferingAtom = atom<boolean>(false);
export const SongHistoryStorage = atom<Song[]>([]);