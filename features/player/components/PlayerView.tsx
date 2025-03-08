"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@heroui/image";
import {
  ListMusic,
  Mic,
  ListPlus,
  Loader,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  LoaderCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { useQueue } from "@/providers/queue-provider";
import { useOpenQueue } from "../hooks/use-open-queue";
import { useAtomValue } from "jotai";
import { songBufferingAtom } from "@/store/jotaiStore";
import { useIsMobile } from "@/hooks/use-mobile";
import MobilePlayerView from "./MobilePlayerView";
import { VolumeControl } from "./VolumeSlider";
import { filterHighQualityImage } from "@/features/search/components/MusicList";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PlayerView() {
  const {
    currentSong,
    playing,
    playNextSong,
    playPreviousSong,
    pause,
    PlayCurrent,
    player,
    currentTime,
    queue,
    setQueue,
    autoplay,
    setAutoplay,
    buffering: isBuffering,
  } = useQueue();
  const { onOpen } = useOpenQueue();
  const isMobile = useIsMobile();
  const currentSongRef = useRef(currentSong);
  const [value, setValue] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [progressBarHover, setProgressBarHover] = useState(false);

  // Reset value when the song changes
  useEffect(() => {
    setValue(0);
  }, [currentSong?.id]);

  // Update currentSongRef when currentSong changes
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  // Improved shuffle functionality that doesn't pause the song
  const toggleShuffle = useCallback(() => {
    const newShuffleState = !isShuffling;
    setIsShuffling(newShuffleState);
    if (newShuffleState && queue.length > 1) {
      // Create a new queue array
      const newQueue = [...queue];
      // Find current song index
      const currentSongId = currentSongRef.current?.id;
      const currentIndex = newQueue.findIndex(
        (song) => song.id === currentSongId
      );
      if (currentIndex !== -1) {
        // Remove current song from the array
        const currentSongItem = newQueue.splice(currentIndex, 1)[0];
        // Shuffle the remaining songs
        for (let i = newQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
        }
        // Reinsert current song at its original position
        newQueue.splice(currentIndex, 0, currentSongItem);
        // Update the queue without affecting the current song
        setQueue(newQueue);
      }
    }
  }, [isShuffling, queue, setQueue]);

  // Format time helper function
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const parts = [
      hours > 0 && String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].filter(Boolean);
    return parts.join(":") || "00:00";
  };

  // Update progress slider with animation
  useEffect(() => {
    if (!dragging && currentSong) {
      const updateProgressBar = () => {
        player?.getDuration().then((duration: number) => {
          if (duration > 0) {
            // Use requestAnimationFrame for smoother updates
            setValue((prevValue) => {
              const targetValue = ((currentTime ?? 0) / duration) * 100;
              // Smooth transition logic - interpolate towards target value
              const diff = targetValue - prevValue;
              // Return exact value if difference is very small
              if (Math.abs(diff) < 0.1) return targetValue;
              // Otherwise do a small step towards target value
              return prevValue + diff * 0.1; // Adjust this coefficiient for faster/slower animatons
            });
          }
        });
      };

      // Use requestAnimationFrame for smooth animation
      const animationId = requestAnimationFrame(updateProgressBar);
      return () => cancelAnimationFrame(animationId);
    }
  }, [currentTime, dragging, currentSong, player]);

  const handleProgressClick = (val: number[]) => {
    setValue(val[0]);
    const seekTime =
      (val[0] / 100) * (currentSong?.duration?.totalSeconds ?? 0);
    player.seekTo(seekTime);
  };

  // Mobile view rendering
  if (isMobile) {
    return (
      <MobilePlayerView
        dragging={dragging}
        setDragging={setDragging}
        setValue={setValue}
        value={value}
      />
    );
  }

  // Calculate duration
  const duration = currentSong?.duration?.totalSeconds ?? 0;
  const progress = (currentTime ?? 0) / duration;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-opacity-90 border-t border-gray-800 bg-background">
      <div className="max-w-screen-xl mx-auto p-2">
        <div className="flex flex-col items-center justify-between">
          {/* Progress Bar */}
          <div
            className="absolute top-0 left-0 right-0 group cursor-pointer"
            onMouseEnter={() => setProgressBarHover(true)}
            onMouseLeave={() => setProgressBarHover(false)}
          >
            <Slider
              value={[value]}
              onValueChange={handleProgressClick}
              onValueCommit={() => setDragging(false)}
              onDrag={() => setDragging(true)}
              max={100}
              className={cn(
                "absolute top-0 w-full group-hover:h-2 transition-all",
                progressBarHover ? "h-2" : "h-1"
              )}
            />
          </div>

          <div className="w-full mt-4 flex items-center justify-between">
            <div className="flex space-x-4 items-center w-1/3">
              {/* Song Info - Left Side - Fixed width */}
              <div className="flex items-center space-x-3 min-w-0 gap-1">
                <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                  {currentSong?.images ? (
                    <Image
                      src={filterHighQualityImage(currentSong?.images)}
                      alt={currentSong?.title || ""}
                      height={56}
                      width={56}
                      className="object-cover h-full w-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-700 flex items-center justify-center">
                      <ListMusic size={24} className="text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">
                    {currentSong?.title || "No track selected"}
                  </div>

                  <div className="truncate text-xs text-gray-400">
                    {currentSong?.artist
                      ?.map((x) => x?.name || "Unknown Artist")
                      .join(", ") || "Unknown Artist"}
                  </div>
                </div>
              </div>
            </div>

            {/* Playback Controls - Center - Fixed position */}
            <div className="flex items-center justify-center space-x-4 w-1/3">
              <Button
                size="icon"
                variant="ghost"
                onClick={playPreviousSong}
                className="text-gray-500 hover:text-white transition"
                aria-label="Previous"
              >
                <SkipBack size={20} style={{ fill: "white" }} />
              </Button>

              <Button
                size="icon"
                variant="secondary"
                onClick={() => (playing ? pause() : PlayCurrent())}
                className=" text-white hover:bg-gray-200 rounded-full h-10 w-10"
                aria-label={playing ? "Pause" : "Play"}
              >
                {isBuffering ? (
                  <LoaderCircleIcon
                    size={20}
                    className="animate-spin text-white"
                  />
                ) : playing ? (
                  <Pause size={20} style={{ fill: "white" }} />
                ) : (
                  <Play
                    size={20}
                    className="ml-0.5"
                    style={{ fill: "white" }}
                  />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => playNextSong()}
                className="text-gray-500 hover:text-white transition"
                aria-label="Next"
              >
                <SkipForward size={20} style={{ fill: "white" }} />
              </Button>
            </div>

            {/* Action Buttons - Right Side */}
            <div className="flex items-center justify-end space-x-2 w-1/3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={cn(
                        "text-gray-500 hover:text-white transition",
                        isFavorite && "text-red-500"
                      )}
                      aria-label="Favorite"
                    >
                      <Heart
                        size={20}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Favorite</TooltipContent>
                </Tooltip>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleShuffle}
                  className={cn(
                    "text-gray-500 hover:text-white transition",
                    isShuffling && "text-blue-500"
                  )}
                  aria-label="Shuffle"
                >
                  <Shuffle size={20} />
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowLyrics(!showLyrics)}
                      className={cn(
                        "text-gray-500 hover:text-white transition",
                        showLyrics && "text-blue-500"
                      )}
                      aria-label="Lyrics"
                    >
                      <Mic size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Lyrics</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsRepeating(!isRepeating)}
                      className={cn(
                        "text-gray-500 hover:text-white transition",
                        isRepeating && "text-blue-500"
                      )}
                      aria-label="Repeat"
                    >
                      <Repeat size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Repeat</TooltipContent>
                </Tooltip>

                <VolumeControl />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onOpen}
                      className="text-gray-500 hover:text-white transition"
                      aria-label="Queue"
                    >
                      <ListMusic size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Queue</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Time Display */}
          <div className="w-full flex justify-between text-xs text-gray-400 mt-1 px-1">
            <p>{formatTime(currentTime || 0)}</p>
            <p>{currentSong?.duration?.label || "00:00"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
