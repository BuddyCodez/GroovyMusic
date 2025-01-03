import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { searchForAlbums, searchForMusic, searchForPlaylists } from "youtube-music-apis";
function thumbnailFormatter(thumbnailUrl?: string): { url?: string; size: string }[] {
    if (!thumbnailUrl) return [];
    // eg: https://lh3.googleusercontent.com/_Mo0lkPoyRGSSI75itXTrHsatViUDwjRNffMHO4myeyaBygG4X4q71kbvF0CopU5Agm4u6v-zfaJZ_yr=w514-h514-l90-rj
    const sizes = ["w120-h120-l90-rj", "w256-h256-l90-rj", "w512-h512-l90-rj", "w1024-h1024-l90-rj",];
    const sizeNames = ["low", "medium", "high", "extra"];
    return sizes.map((size) => {
        return {
            url: thumbnailUrl.replace('w120-h120-l90-rj', size),
            size: sizeNames[sizes.indexOf(size)],
        };
    });
}
const app = new Hono()
    .get('/:query', zValidator('param', z.object({ query: z.string() })), zValidator('query', z.object({
        type: z.string(),
    })), async (c) => {
        const { query } = c.req.valid("param");
        const { type } = c.req.valid("query");
        console.log(query, type);

        let videos = [];

        // Use a switch-case for better readability
        if (type === 'album') {
            const albums = await searchForAlbums(query); // await directly instead of .then()
            videos = albums.map(album => ({
                title: album.title,
                id: album.albumId,
                images: thumbnailFormatter(album.thumbnailUrl),
                year: album.year,
                artist: album.artist,
                isExplicit: album.isExplicit,
            }));
        }
        else if (type === 'playlist') {
            const playlists = await searchForPlaylists(query); // await directly instead of .then()
            videos = playlists.map(playlist => ({
                title: playlist.title,
                id: playlist.playlistId,
                images: thumbnailFormatter(playlist.thumbnailUrl),
                totalSongs: playlist.totalSongs,
            }));
        }
        else {
            const songs = await searchForMusic(query); // await directly instead of .then()
            videos = songs.map(song => ({
                title: song.title,
                id: song.youtubeId,
                album: song.album,
                artist: song.artists,
                images: thumbnailFormatter(song.thumbnailUrl),
                duration: song.duration,
                isExplicit: song.isExplicit,
            }));
        }

        return c.json({ videos });
    });


app.onError((e, c) => {
    if (e instanceof HTTPException) {
        return e.getResponse();
    }
    console.error(e);
    return c.json({ error: "Internal Server Error" }, 500);
});
export default app;