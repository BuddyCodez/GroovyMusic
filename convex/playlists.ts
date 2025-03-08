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
        description: v.optional(v.string()),
        image: v.optional(v.string()),
    },
    handler: async (ctx, { _id, name, songs, count, userId, description, image}) => {
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
                name, songs, count, userId, description, image
            });
            console.log(" playlist Updated");

        } else {
            await ctx.db.insert('playlists', {
                name, songs, count, userId, 
                description: description || "",
                image: image || "/placeholder.jpg",
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
export const add = mutation({
    args: {
        _id: v.string(),
        song: v.any()
    },
    handler: async (ctx, { _id, song }) => {
        const playlist = await ctx.db.get(_id as Id<string>);
        if (!playlist) {
            throw new Error("Playlist not found");
        }
        // if song is already in the playlist, do not add it again
        if (Array(playlist.song).includes(song)) {
            return;
        }
        await ctx.db.patch(_id as Id<string>, {
            songs: playlist?.songs ? [...playlist.songs, song] : [song]
        });
        console.log("Song added to playlist");
    }
});
export const getPlaylistSongs = query({
    args: {
        _id: v.string()
    },
    handler: async ({ db }, { _id }) => {
        const playlist = await db.get(_id as Id<string>);
        if (!playlist) {
            throw new Error("Playlist not found");
        }
        return playlist;
    }
});

export const updatePlaylist = mutation({
    args: {
        _id: v.string(),
        description: v.optional(v.string()),
        image: v.optional(v.string()), // Base64 encoded image
    },
    handler: async (ctx, { _id, description, image }) => {
        const data: { description?: string; image?: string } = {}
        if (description !== undefined) data.description = description
        if (image !== undefined) data.image = image
        await ctx.db.patch(_id as Id<"playlists">, data)
    },
})