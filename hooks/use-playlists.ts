import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';

import { Song } from '@/types/song';
import { Playlist } from 'youtube-music-apis';

export function usePlaylists(userId: string) {
    const queryClient = useQueryClient();

    const playlists = useQuery({
        queryKey: ['playlists', userId],
        queryFn: async () => {
            const res = await api.playlists.getPlaylists({} as any, { userId });
            return res;
        },
    });

    const createPlaylist = useMutation({
        mutationFn: async ({ name, userId, songs, count, created_at }: { name: string, userId: string, songs?: Song[], count?: number, created_at: string }) => {
            await api.playlists.createPlaylist({} as any, { name, userId, songs, count, createdAt: created_at });
        },
        onSuccess: () => {
            console.log("Playlist created");
            queryClient.invalidateQueries({ queryKey: ['playlists', userId] });
        },
        onError(error, variables, context) {
            console.error("Failed to create playlist", error);
        },
    });

    return {
        playlists: playlists.data as Playlist[] ?? [],
        isLoading: playlists.isLoading,
        createPlaylist: (name: string, created_at: string, songs?: Song[], count?: number) => createPlaylist.mutate({ name, userId, songs, count, created_at }),
    };
}


