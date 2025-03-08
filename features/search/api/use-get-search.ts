import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetSong = (keyword: string, en?: boolean) => {
    return useQuery({
        queryKey: ["search", keyword],
        enabled: en ?? true,
        queryFn: async () => {
            if (!keyword) return [];
            try {
                const res = await client.api.songs[":query"].$get({
                    param: { query: keyword }, 
                    query: { type: 'song' }
                });
                const data = await res.json();
                // Stabilize the data structure
                return data.videos.map((video: any) => ({
                    ...video,
                    images: video.images.map((image: any) => ({
                        url: image.url || "",
                        size: image.size
                    }))
                }));
            } catch (error) {
                console.error(error);
                return [];
            }
        },
        // Add staleTime to prevent unnecessary refetches
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}


export const useGetAlbum = (keyword: string) => {
    const query = useQuery({
        queryKey: ["searchAlbum", keyword],
        queryFn: async () => {
            if (!keyword) return [];
            try {
                const res = await axios.get('/api/songs/' + keyword + '?type=album');
                const data = await res.data;
                return data.videos;
            } catch (error) {
                console.error(error);
                return [];
            }
        },
    });
    return query;
}
export const useGetPlaylist = (keyword: string) => {
    return useQuery({
        queryKey: ["searchPlaylist", keyword],
        queryFn: async () => {
            if (!keyword) return [];
            try {
                const res = await axios.get('/api/songs/' + keyword + '?type=playlist');
                const data = await res.data;
                // console.log("Playlist data", data.videos);
                return data.videos;
            } catch (error) {
                console.error(error);
                return [];
            }
        },
    });
}