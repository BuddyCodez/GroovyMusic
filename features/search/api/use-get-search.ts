import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
type searchTypeOptions = "album" | "playlist" | 'song';
export const useGetSong = (keyword: string,) => {
    const query = useQuery({
        queryKey: ["search", keyword],
        queryFn: async () => {
            if (!keyword) return [];
            try {
                const res = await client.api.songs[":query"].$get({
                    param: { query: keyword }, query: { type: 'song' }
                });
                const data = await res.json();
                return data.videos;
            } catch (error) {
                console.error(error);
                return [];
            }
        },
    });
    return query;
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