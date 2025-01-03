"use client";
import { Button } from "@/components/ui/button";
import { useQueue } from "@/providers/queue-provider";
import { Image } from "@nextui-org/image";
import {
  ListMusicIcon,
  ListPlusIcon,
  LoaderIcon,
  MicVocalIcon,
  PauseIcon,
  PlayIcon,
  Repeat2Icon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
} from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useOpenQueue } from "../hooks/use-open-queue";

import { Toggle } from "@/components/ui/toggle";

import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Portal } from "@radix-ui/react-portal";
const PlayerView = () => {
  const {
    currentSong,
    playing,
    playNextSong,
    playPreviousSong,
    playeState,
    pause,
    PlayCurrent,
    player,
    currentTime,
    autoplay,
    setAutoplay,
  } = useQueue();
  const LoadingSong = ["not started", "buffering"];
  const Loading = LoadingSong.includes(playeState.toLowerCase());
  const { onOpen } = useOpenQueue();
  const getImage = (index?: number) =>
    currentSong?.images[index || currentSong?.images.length - 1]?.url || "";

  const [volume, setVolume] = useState(100);
  const [value, setValue] = useState(0);
  const [dragging, SetDragging] = useState(false);

  const isMobile = window.innerWidth < 768;

  const getTime = () => {
    const seconds = Math.floor(currentTime ?? 0);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    let time = `${formattedMinutes}:${formattedSeconds}`;
    if (hours) {
      time = `${formattedHours}:${time}`;
    }
    time = time.includes("NaN") ? "00:00" : time;
    return time;
  };
  useEffect(() => {
    if (!dragging && currentSong) {
      requestAnimationFrame(() => {
        SetDragging(false);
        const cTime = currentTime || 0;
        const duration = currentSong.duration?.totalSeconds || 0;
        const percent = (cTime / duration) * 100;
        setValue(percent || 0);
      });
    }
    return () => {
      // Clean up event listeners when component unmounts
    };
  }, [currentTime, dragging, currentSong]);

  return (
    <div className="w-full h-[300px]">
      <Slider
        defaultValue={[0]}
        value={[value]}
        max={100}
        step={1}
        onValueChange={(val) => {
          setValue(val[0]);
          const seekTime =
            (val[0] / 100) * (currentSong?.duration?.totalSeconds ?? 0);
          player.seekTo(seekTime);
        }}
        className="w-full"
      />
      <div className="sseekbar px-1 py-2">
        <div className="flex justify-between w-full px-2">
          <div className="flex gap-2">
            <small>{getTime()}</small>
          </div>
          <div className="flex gap-2">
            <small>{currentSong?.duration?.label}</small>
          </div>
        </div>
      </div>
      <div className="w-full px-2">
        <div className="songInfo flex justify-between items-center ">
          <div className="flex gap-2 itmes-center text-white">
            <Image
              src={getImage()}
              width={50}
              height={50}
              isBlurred
              srcSet={currentSong?.images.map((x) => x.url).join(", ")}
            />
            <div className="ml-2 flex flex-col">
              <h1 className="line-clamp-1">{currentSong?.title}</h1>
              <p className="line-clamp-1">
                {currentSong?.artist?.map((x) => x.name)?.join(",")}
              </p>
            </div>
          </div>
          <div className="flex player-actions gap-2 text-white">
            <Button
              size="icon"
              variant="outline"
              className="cursor-pointer"
              onClick={playPreviousSong}
            >
              <SkipBackIcon />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="cursor-pointer"
              disabled={!currentSong || Loading}
              onClick={playing ? pause : PlayCurrent}
            >
              {Loading ? (
                <LoaderIcon className="animate-spin w-6 h-6" />
              ) : playing ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="cursor-pointer"
              onClick={playNextSong}
            >
              <SkipForwardIcon />
            </Button>
          </div>
          {!isMobile && (
            <div className="flex actions gap-2 text-white">
              <Button size="icon" variant="outline" className="cursor-pointer">
                <ShuffleIcon />
              </Button>
              <Button size="icon" variant="outline" className="cursor-pointer">
                <Volume2Icon />
              </Button>
              <Button size="icon" variant="outline" className="cursor-pointer">
                <Repeat2Icon />
              </Button>
              <Toggle
                aria-label="Toggle autoplay"
                variant="outline"
                onPressedChange={setAutoplay}
                pressed={autoplay}
                title="Autoplay songs"
              >
                <ListPlusIcon />
              </Toggle>
              <Button size="icon" variant="outline" className="cursor-pointer">
                <MicVocalIcon />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer"
                onClick={onOpen}
              >
                <ListMusicIcon />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerView;
