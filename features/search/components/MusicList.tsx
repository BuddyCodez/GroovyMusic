import React from "react";
import { Play, BoldIcon as ExplicitIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image } from "@heroui/react";
import { Song } from "@/types/song";
import { useQueue } from "@/providers/queue-provider";
import BlurFade from "@/components/ui/blur-fade";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import NextImage from "next/image";
import { useOpenPlaylist } from "@/features/playlist/hooks/use-open-playlist";
import ContextCommandMenu from "@/components/utils/actions/context-command-menu";
import { useIsMobile } from "@/hooks/use-mobile";
interface MusicListProps {
  songs: Song[];
  topResult?: Song | null;
}

export const filterHighQualityImage = (
  images: { url: string; size: string }[],
  index?: number
): string => {
  // console.log(images);
  return images[index ?? images.length - 1]?.url;
};
const MusicList = ({ songs, topResult }: MusicListProps) => {
  const { addToQueue } = useQueue();
  // console.log(topResult);
  return (
    <div className="container">
      {/* // 2 grid  */}
      <div className="topSection">
        {topResult && (
          <div className="result">
            <BlurFade inView delay={0.25}>
              <TopResult data={topResult} onclick={addToQueue} />
            </BlurFade>
          </div>
        )}
        <div className="songs">
          <Songs data={songs} onClick={addToQueue} />
        </div>
      </div>
    </div>
  );
};
interface SongsProps {
  data: Song[];
  length?: number;
  onClick?: (song: Song, force?: boolean) => void;
}
const Songs = ({ data, length = 5, onClick }: SongsProps) => {
  const { onOpen } = useOpenPlaylist();
  return (
    <>
      {data.slice(0, length).map((item, index) => (
        <ContextCommandMenu key={index} onClick={() => onClick?.(item, true) ?? undefined} item={item} onOpen={() => onOpen(item)}>
          <BlurFade inView delay={0.1 * index}>
            <Card
              className="cursor-pointer flex
                broder-none border-0
              "
              style={{
                width: "100%",
                height: "70px",
              }}
              onClick={() => {
                onClick?.(item, true);
              }}
            >
              <CardContent className="px-1 flex items-center gap-2 w-full">
                <Image
                  src={filterHighQualityImage(item.images)}
                  alt={item.title}
                  isBlurred
                  isZoomed
                  referrerPolicy='no-referrer'
                  height={60}
                  width={60}
                  style={{
                    minWidth: "60px",
                    minHeight: "60px",
                  }}
                  srcSet={item.images.map((x) => x.url).join(", ")}
                />
                <div className="space-y-2 w-full">
                  <div className="flex items-start gap-2">
                    <h3 className="font-semibold text-md line-clamp-1">
                      {item.title}
                    </h3>
                    {item.isExplicit && (
                      <Badge
                        variant="secondary"
                        className="text-xs  py-1 px-1"
                        aria-label="Explicit content"
                      >
                        <ExplicitIcon size={10} />
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1  w-full">
                    <p className="text-xs text-muted-foreground/75 line-clamp-1">
                      {item.album?.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </ContextCommandMenu>
      ))}
    </>
  );
};
interface TopResultProps {
  data: Song;
  onclick: (song: Song, force?: boolean) => void;
}
const TopResult = ({ data, onclick }: TopResultProps) => {
  return (
    <div
      className="top-result-container flex flex-col gap-4"
      onClick={() => onclick(data, true)}
    >
      <h3>Top Result</h3>
      <Image
        src={filterHighQualityImage(data.images)}
        alt={data.title}
        referrerPolicy='no-referrer'
        isBlurred
        isZoomed
        height={150}
        width={150}
      />
      <div className="flex">
        <div className="space-y-2">
          <div className="flex items-start gap-2 ">
            <h4 className="font-semibold text-lg line-clamp-1">
              {data.title}
            </h4>
            {data.isExplicit && (
              <Badge
                variant="secondary"
                className="text-xs  py-1 px-1"
                aria-label="Explicit content"
              >
                <ExplicitIcon size={10} />
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground/75 line-clamp-1 ">
              Song • {data.artist?.map((x) => x.name).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicList;
