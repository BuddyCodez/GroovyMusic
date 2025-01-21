import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// export const createPlaylist = mutation({
//     args: {
//         name: v.string(),
//         userId: v.string(),
//         songs: v.optional(v.array(v.any())),
//         createdAt: v.string(),
//         count: v.optional(v.number())
//     },
//     handler: async (ctx, args) => {
//         const { db } = ctx;
//         const { name, userId, songs, createdAt, count } = args;
//         // before creating a playlist, check if the playlist already exists
//         const playlistExists = await db.query("playlists").filter((q) => q.and(q.eq(q.field("name"), name), q.eq(q.field("userId"), userId))).first();
//         if (playlistExists) {
//             throw new Error("Playlist already exists");
//         }
//         const playlist = { name, userId, songs: [], createdAt, count };
//         await db.insert("playlists", playlist).then(() => {
//             console.log("Playlist created");
//         });
//     }
// });

// export const getPlaylists = query({
//     args: {
//         userId: v.string()
//     },
//     handler: async ({ db }, { userId }) => {
//         const playlists = await db.query("playlists").filter((q) => q.eq(q.field("userId"), userId)).collect();
//         return playlists;
//     }
// });
// export const getPlaylist = query({
//     args: {
//         id: v.string()
//     },
//     handler: async ({ db }, { id }) => {
//         const playlist = await db.query("playlists").filter((q) => q.eq(q.field("id"), id)).first();
//         return playlist;
//     }
// });

export const createOrUpdate = mutation({
    args: {
        _id: v.optional(v.string()),
        name: v.string(),
        songs: v.optional(v.array(v.any())),
        count: v.optional(v.number()),
        userId: v.string(),
    },
    handler: async (ctx, { _id, name, songs, count, userId }) => {
        // const identity = await ctx.auth.getUserIdentity();
        // console.log("identity", identity);
        // if (identity === null) {
        //     throw new Error("User is not authenticated to create a playlist");
        // }

        if (_id) {
            // indcates that we have to update playlist.
            const data = await ctx.db.get(_id as Id<string>);
            if (!data) {
                throw new Error("No playlist found for Update!");

            }
            await ctx.db.patch(_id as Id<string>, {
                name, songs, count, userId
            });
            console.log(" playlist Updated");

        } else {
            await ctx.db.insert('playlists', {
                name, songs, count, userId
            })
            console.log("New playlist created");
        }
        // update data in realtime

    },
});
export const get = query({
    args: {
        userId: v.string()
    },
    handler: async ({ db }, { userId }) => {
        const playlists = await db.query("playlists").filter((q) => q.eq(q.field("userId"), userId)).collect();
        return playlists;
    }
});