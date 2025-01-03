"use client";

import { SidebarLayout } from "@/layouts/sidebar-layout";
import { SearchBar } from "@/components/utils/search-bar";
import { useSearch } from "@/components/api/use-search";
import { useEffect } from "react";
import { useGetAlbum, useGetSong } from "@/features/search/api/use-get-search";
import MusicList from "@/features/search/components/MusicList";
import PlayerView from "@/features/player/components/PlayerView";
import { useQueue } from "@/providers/queue-provider";
import Loader from "@/components/ui/loader";
import AlbumList from "@/features/search/components/AlbumList";
import { Album, Song } from "@/types/song";
import GradualSpacing from "@/components/ui/gradual-spacing";
function HighestRegexMatch(data: any, query: string) {
  if (!data || !data.length) return null;
  const regex = new RegExp(query, "i");

  let highestMatch = null;
  let highestScore = 0;

  data.forEach((item: { title: string }) => {
    const match = item.title.match(regex);
    if (match) {
      const score = match[0].length;
      if (score > highestScore) {
        highestScore = score;
        highestMatch = item;
      }
    }
  });

  return highestMatch;
}
export default function HomePage() {
  const search = useSearch();
  const { currentSong } = useQueue();
  const data = useGetSong(search.query);
  const albums = useGetAlbum(search.query);
  const TopResult = HighestRegexMatch(data?.data, search.query);
  useEffect(() => {
    // focus the search input
    document.getElementById("search")?.focus();
  }, [search.query]);
  useEffect(() => {
    if (search.query) {
      data.refetch();
    }
  }, [search.query]);
  // console.log(albums?.data, "albums");
  const transformedAlbumsData: Album[] | null = albums?.data
    ? albums.data.map((album: any) => ({
        ...album,
        images: album?.images?.map((image: any) => ({
          ...image,
          url: image.url || "", // Ensure url is a string
        })),
        artist:
          "artist" in album && album.artist
            ? typeof album.artist === "string"
              ? album.artist
              : album.artist.map((a: any) => a.name).join(", ")
            : undefined,
      }))
    : null;
  return (
    <main>
      <SidebarLayout>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <SearchBar onSearch={() => data.refetch()} />
          </div>
          {data?.isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            Array.isArray(data.data) && (
              <MusicList
                songs={
                  Array.isArray(data.data)
                    ? data.data.map((item: any) => ({
                        ...item,
                        images: item?.images.map((image: any) => ({
                          ...image,
                          url: image.url || "",
                        })),
                        artist:
                          "artist" in item && item.artist
                            ? [
                                {
                                  name:
                                    typeof item.artist === "string"
                                      ? item.artist
                                      : item.artist
                                          .map((a: any) => a.name)
                                          .join(", "),
                                },
                              ]
                            : undefined,
                      }))
                    : ([] as Song[])
                }
                topResult={TopResult}
              />
            )
          )}
        </div>
        {/* // albums  */}
        {albums.isLoading ? (
          <div className="w-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          albums.data && (
            <div className="flex items-start p-2 px-4 pl-8 flex-col ">
              <GradualSpacing
                className="font-display text-center text-4xl font-bold -tracking-widest  text-black dark:text-white md:text-4xl md:leading-[5rem]"
                text="Albums"
                
              />
              <AlbumList albums={transformedAlbumsData} />
            </div>
          )
        )}
        <br />
        <br />
        <br />
        <br />
        <br />
      </SidebarLayout>
      <div className="playerView">{currentSong && <PlayerView />}</div>
    </main>
  );
}
