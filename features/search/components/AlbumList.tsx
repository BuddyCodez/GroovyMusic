"use client";

import { Album, Song } from "@/types/song";
import { Image } from "@nextui-org/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useQueue } from "@/providers/queue-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import NextImage from "next/image";
interface AlbumListProps {
  albums: Album[] | null;
  className?: string;
}

export default function AlbumList({ albums, className }: AlbumListProps) {
  const { open } = useSidebar();
  const router = useRouter();
  const { addToQueue, queue } = useQueue();
  const handleClick = useCallback(
    (id: string | undefined) => {
      if (!id) return;
      router.push(`/album/${id}`);
    },
    [router]
  );
  if (!albums?.length) {
    return null;
  }
  // console.log(albums);

  return (
    <ScrollArea
      className={cn("w-full whitespace-nowrap rounded-md", className)}
    >
      <div className="flex w-max space-x-4 p-4 gap-2">
        {albums.map((album) => (
          <div
            role="button"
            key={album.id}
            className="relative flex flex-col gap-2 w-[300px]  cursor-pointer overflow-hidden"
            onClick={() => handleClick(album.id)} // Use the memoized handler
            tabIndex={0} // Ensures accessibility for keyboard users
          >
            <div className="overflow-hidden rounded-md ">
              <NextImage
                src={album.images[2]?.url || "/path/to/default/image.jpg"} // Add a fallback image URL in case the primary image is missing
                alt={album.title || "Album cover"}
                width={250}
                height={160}
                className="aspect-square h-auto w-[160px] object-cover transition-all group-hover:scale-105"
                blurDataURL={album.images[0]?.url}
                onError={() =>
                  console.error("Image failed to load:", album.images[0]?.url)
                } // Log any loading errors
              />
            </div>
            <figcaption className="space-y-1">
              <h3 className="font-medium leading-none group-hover:text-primary line-clamp-1">
                {trimmer(album.title || "", 20)}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {trimmer(album.artist || "", 20)}
              </p>
            </figcaption>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
}
const trimmer = (str: string, length: number) =>
  str.length > length ? str.slice(0, length) + "..." : str;
