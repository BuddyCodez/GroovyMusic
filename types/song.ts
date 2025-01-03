export interface Song {
    title?: string;
    id?: string;
    album?: { name: string };
    artist?: { name: string }[];
    images: { url: string; size: string }[];
    duration?: { totalSeconds: number; label: string };
    isExplicit?: boolean;
    addedBy?: string;
}
export interface Album {
    title?: string;
    id?: string;
    images: { url: string; size: string }[]; // Ensure url is always a string
    year?: string;
    artist?: string;
    isExplicit?: boolean;
    songs?: Song[];
}
export interface MusicAlbum {
    id: string,
    title: string,
    artists: { name: string; id: string }[],
    album: { name: string; id: string },
    images: { url: string; size: string }[],
    duration: { totalSeconds: number; label: string },
    isExplicit: boolean,
}