import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
export const useFetchTrending = (country?: string, limit?: number, offset?: number) => {
    const query = useQuery({
        queryKey: ['trending'],
        queryFn: async () => {
            try {
                const res = await client.api.trending.$get({
                    query: {
                        limit: limit?.toString(),
                        offset: offset?.toString(),
                        country: country,
                    }
                });
                const data = await res.json();
                return data.albums
            } catch (error) {
                console.error(error);
                return [];
            }
        },
    });
    return query;
}
