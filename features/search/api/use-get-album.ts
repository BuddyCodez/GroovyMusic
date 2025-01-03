import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
type searchTypeOptions = "album" | "playlist" | 'song';
export const useFetchAlbum = (id?: string | null) => {
    const query = useQuery({
        queryKey: ["album", id],
        queryFn: async () => {
            if (!id) return [];
            try {
                const res = await client.api.albums[":id"].$get({ param: { id: id } });
                const data = await res.json();
                return data.songs;
            } catch (error) {
                console.error(error);
                return [];
            }
        },
    });
    return query;
}
