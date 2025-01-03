import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getMusicBasedSuggestions, listMusicFromAlbum, searchForAlbums, searchForMusic, searchForPlaylists } from "youtube-music-apis";
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
    .get('/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
        const { id } = c.req.valid("param");
        const album = await listMusicFromAlbum(id);

        const songs = album.map((song) => {
            return {
                id: song.youtubeId,
                title: song.title,
                artist: song.artists,
                album: song.album,
                images: thumbnailFormatter(song.thumbnailUrl),
                duration: song.duration,
                isExplicit: song.isExplicit,
            }
        })
        return c.json({ songs });
    })


app.onError((e, c) => {
    if (e instanceof HTTPException) {
        return e.getResponse();
    }
    console.error(e);
    return c.json({ error: "Internal Server Error" }, 500);
});
export default app;