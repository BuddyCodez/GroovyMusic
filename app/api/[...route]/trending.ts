import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { MaxInt, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { z } from "zod";
const clientId = 'ca7e103fb7c14c28b829deb58c9a6c5c';
const clientSecret = '29f279e32b85484b8c57f9854d17febc';
const app = new Hono()
    .get('/',
        zValidator('query', z.object({
            country: z.string().optional().default('IN'),
            limit: z.string().optional().default('10'),
            offset: z.string().optional().default('0'),
        })),
        async (c) => {
            // setCredentials('ca7e103fb7c14c28b829deb58c9a6c5c', '29f279e32b85484b8c57f9854d17febc');
            // const data = await trackSearch('Olivia Rodrigo good 4 u');
            // return c.json(data);
            const { country, limit, offset } = c.req.valid('query');
            const sdk = SpotifyApi.withClientCredentials(clientId, clientSecret);
            const allowedLimits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50];
            const validLimit = allowedLimits.includes(Number(limit)) ? Number(limit) : 10;
            const data = await sdk.browse.getNewReleases(country, validLimit as 0 | 2 | 1 | 3 | 10 | 4 | 5 | 6 | 7 | 8 | 9 | 50, Number(offset));
            // const data = await sdk.browse.getCategories('IN', 'en_IN', 10, 0);
            return c.json(data);
        })
export default app;