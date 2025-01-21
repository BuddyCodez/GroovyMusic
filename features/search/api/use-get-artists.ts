import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
export const useSearchArtists = (keywords?: string | null) => {
    const query = useQuery({
        queryKey: ["artists", keywords],
        queryFn: async () => {
            if (!keywords) return [];
            try {
                const res = await client.api.songs[":query"].$get({ param: { query: keywords }, query: { type: 'artist' } });
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
