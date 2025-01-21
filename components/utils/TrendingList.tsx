"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Cast,
  Clock3,
  Heart,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import NextImage from "next/image";
import { Image } from "@nextui-org/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Song } from "@/types/song";
import { ScrollArea } from "../ui/scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import BlurFade from "../ui/blur-fade";
import { useGetSong } from "@/features/search/api/use-get-search";
import { Skeleton } from "../ui/skeleton";
import { useQueue } from "@/providers/queue-provider";
import React from "react";

export function TrendingSongs({ query }: { query: string }) {
  const fetcher = useGetSong(query);
  const replaceWidthAndQuality = (url: string, width: number, quality: number) => {
    const [baseUrl, query] = url.split("?");
    const params = new URLSearchParams(query);
    params.set("w", width.toString());
    params.set("q", quality.toString());
    return `${baseUrl}?${params.toString()}`;
  }

  const trendingSongs = React.useMemo(() =>
    (fetcher.data ?? []).map((song) => ({
      ...song,
      artist:
        "artist" in song && Array.isArray(song.artist)
          ? song.artist.map((artist: any) => ({ name: artist.name }))
          : undefined,
      images: song.images.map((image: any) => ({
        ...image,
        url: replaceWidthAndQuality(image.url, 1080, 88),
      })),
    })), [fetcher.data]);

  // In your JSX, memoize the SongImage component for each song

  const { addToQueue } = useQueue();

  return (
    <div className="relative z-10">
      {/* Header */}

      {/* Main Content */}
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        {fetcher.isLoading ? (
          <div className="flex w-max space-x-4 p-4">
            <main className="grid gap-4 w-[450px]">
              {[0, 1, 2, 3, 4].map((item, index) => (
                <BlurFade
                  delay={index * 0.01}
                  className="w-[450px]"
                  key={index}
                >
                  <Skeleton className="w-full h-20 p-4" />
                </BlurFade>
              ))}
            </main>
            <main className="grid gap-4 w-[450px]">
              {[0, 1, 2, 3, 4].map((item, index) => (
                <BlurFade
                  delay={index * 0.02}
                  className="w-[450px]"
                  key={index}
                >
                  <Skeleton className="w-full h-20 p-4" />
                </BlurFade>
              ))}
            </main>
            <main className="grid gap-4 w-[450px]">
              {[0, 1, 2, 3, 4].map((item, index) => (
                <BlurFade
                  delay={index * 0.03}
                  className="w-[450px]"
                  key={index}
                >
                  <Skeleton className="w-full h-20 p-4" />
                </BlurFade>
              ))}
            </main>
            <main className="grid gap-4 w-[450px]">
              {[0, 1, 2, 3, 4].map((item, index) => (
                <BlurFade
                  delay={index * 0.04}
                  className="w-[450px]"
                  key={index}
                >
                  <Skeleton className="w-full h-20 p-4" />
                </BlurFade>
              ))}
            </main>
          </div>
        ) : (
          <div className="flex w-max space-x-4 p-4">
            {[0, 5, 10].map((val) => (
              <div className="grid gap-4" key={val} style={{ width: "450px", maxWidth: "450px" }}>
                {trendingSongs.slice(val, val + 5).map((song: any, index) => (
                  <BlurFade delay={index * 0.1} key={song.id} className="w-[450px]">
                    <div
                      onClick={() => addToQueue(song as Song)}
                      className="relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] group w-full cursor-pointer"
                    >
                      <div className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl transition-colors rounded-lg">
                        <Image
                          src={song.images[3].url}
                          alt={`Album artwork for ${song.title}`}
                          width={40}
                          height={40}
                          shadow="lg"
                          isBlurred
                          isZoomed
                          referrerPolicy="no-referrer"
                          className="rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {song.title}
                          </h3>
                          <p className="text-sm text-white/70 truncate">
                            {song.artist
                              ?.map((x: { name: string; id: string }) => x.name)
                              .join(", ")}{" "}
                            • {song.duration?.label}
                          </p>
                        </div>
                        <Menu song={song} />
                      </div>
                    </div>
                  </BlurFade>
                ))}
              </div>
            ))}
          </div>
        )
        }
        <div className="w-[100px]"></div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea >
    </div >
  );
}
const Menu = ({ song }: { song: Song }) => {
  const { addToQueue } = useQueue();
  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer hover:bg-white/10"
      >
        <Heart className="h-4 w-4" />
        <span className="sr-only">Like</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-white/10"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => addToQueue(song as Song, true)}>
            Play
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => addToQueue(song as Song)}>
            Add to queue
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Add to playlist</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
