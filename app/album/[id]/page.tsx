"use client";

import React from "react";

import { useParams } from "next/navigation";
import { SidebarLayout } from "@/layouts/sidebar-layout";
import { useFetchAlbum } from "@/features/search/api/use-get-album";
import Loader from "@/components/ui/loader";
import { Image } from "@nextui-org/image";
import { SearchBar } from "@/components/utils/search-bar";
import { Badge } from "@/components/ui/badge";
import { BoldIcon as ExplicitIcon } from "lucide-react";
import { useQueue } from "@/providers/queue-provider";
import PlayerView from "@/features/player/components/PlayerView";
import BlurFade from "@/components/ui/blur-fade";
import GradualSpacing from "@/components/ui/gradual-spacing";
import { Button } from "@/components/ui/button";
import ShimmerButton from "@/components/ui/shimmer-button";
const Album = () => {
  const { addToQueue, addMultipleToQueue, currentSong } = useQueue();
  const { id } = useParams();
  if (!id) return <div>Album not found</div>;
  const data = useFetchAlbum(id as string);
  const playAll = () => {
    if (!data.data) return;
    addMultipleToQueue(
      data.data.map((song) => ({
        ...song,
        images: song.images.map((image) => ({
          ...image,
          url: image.url || "",
        })),
      }))
    );
  };
  return (
    <main>
      <SidebarLayout>
        <SearchBar />
        <div className="w-full h-full flex flex-col items-start justify-start gap-4">
          <div className="flex w-full justify-between items-center px-4">
            <GradualSpacing
              className="font-display text-center text-3xl font-bold -tracking-widest  text-black dark:text-white md:text-4xl md:leading-[5rem]"
              text="Album"
            />
            {data?.data?.length && (
              <BlurFade inView delay={0.5}>
                <ShimmerButton borderRadius="10px" onClick={playAll}>
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    Play All
                  </span>
                </ShimmerButton>
              </BlurFade>
            )}
          </div>
          {data.isLoading ? (
            <Loader />
          ) : (
            <div className="album-content">
              {data.data?.map((song, index) => (
                <BlurFade inView delay={0.01 * index}>
                  <div
                    key={song.id}
                    className="song"
                    onClick={() =>
                      addToQueue({
                        ...song,
                        images: song.images.map((image) => ({
                          ...image,
                          url: image.url || "",
                        })),
                      }, true)
                    }
                  >
                    <Image
                      src={song.images[1].url}
                      alt={song.title}
                      width={256}
                      height={256}
                      isBlurred
                      isZoomed
                    />
                    <div className="song-info gap-1">
                      <div className="flex justify-between items-center w-full">
                        <h3 className="line-clamp-1">{song.title}</h3>
                        <p>{song?.duration?.label}</p>
                      </div>
                      <p className="line-clamp-1">
                        {song?.artist?.map((x) => x.name).join(",")}
                      </p>
                      {song.isExplicit && (
                        <Badge
                          variant="secondary"
                          className="text-xs  py-1 px-1"
                          aria-label="Explicit content"
                        >
                          <ExplicitIcon size={10} />
                        </Badge>
                      )}
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          )}
        </div>
      </SidebarLayout>
      <div className="playerView">{currentSong && <PlayerView />}</div>
    </main>
  );
};

export default Album;
