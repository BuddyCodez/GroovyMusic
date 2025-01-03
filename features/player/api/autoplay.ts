import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
type searchTypeOptions = "album" | "playlist" | 'song';
export const useGetAutoPlay = (songid?: string | null) => {
    const query = useQuery({
        queryKey: ["autoplay"],
        queryFn: async () => {
            if (!songid) return [];
            try {
                const res = await client.api.autoplay[":id"].$get({ param: { id: songid } });
                const data = await res.json();
                return data.songs;
            } catch (error) {
                console.error(error);
                return [];
            }
        },
        // fetch only once
        retry: false,
        refetchOnWindowFocus: false,
    });
    return query;
}
