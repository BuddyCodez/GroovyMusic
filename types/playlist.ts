import { Song } from "./song";

export interface Playlist {
  _id: string;
  name: string;
  userId: string;
  songs: Song[];
  count: number;
}

