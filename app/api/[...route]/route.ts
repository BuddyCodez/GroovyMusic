import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import songs from "./songs"
import albums from "./album"
import autoplay from "./autoplay"
import playlist from "./playlist"
import trending from "./trending"
import { HTTPException } from "hono/http-exception";

export const runtime = 'edge';
const app = new Hono().basePath('/api');
app.onError((e, c) => {
    if (e instanceof HTTPException) {
        return e.getResponse();
    }
    console.error(e);
    return c.json({ error: "Internal Server Error" }, 500);
});

const routes = app
    .route('/songs', songs)
    .route('/albums', albums)
    .route('/autoplay', autoplay)
    .route('/playlist', playlist)
    // .route('/trending', trending)


export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;


export interface APIResponse {
    status: number;
    data: any;
}