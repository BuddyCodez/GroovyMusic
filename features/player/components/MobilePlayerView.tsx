"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useQueue } from "@/providers/queue-provider";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  LoaderIcon,
  Pause,
  PauseIcon,
  Play,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import { songBufferingAtom } from "@/store/jotaiStore";
import { useAtom, useAtomValue } from "jotai";

interface MobilePlayerViewProps {
  dragging: boolean;
  setDragging: (dragging: boolean) => void;
  value: number;
  setValue: (value: number) => void;
}

const MobilePlayerView = ({
  dragging,
  setDragging,
  value,
  setValue,
}: MobilePlayerViewProps) => {
  const {
    currentSong,
    playing,
    playNextSong,
    playPreviousSong,
    pause,
    PlayCurrent,
    player,
    playeState,

  } = useQueue();

  // Motion values for drag
  const y = useMotionValue(0);
  const height = typeof window !== "undefined" ? window.innerHeight : 0;
  const isBuffering = useAtomValue(songBufferingAtom);

  // Transform the y motion value to opacity and scale
  const opacity = useTransform(y, [0, height * 0.92], [1, 0]);
  const scale = useTransform(y, [0, height * 0.92], [1, 0.8]);
  const visibility = useTransform(y, [0, height * 0.92], ["visible", "hidden"]);
  const display = useTransform(y, [0, height * 0.92], ["flex", "none"]);
  const miniPlayerOpacity = useTransform(y, [0, height * 0.3], [0, 1]);

  // Handle drag end
  const onDragEnd = () => {
    const currentY = y.get();
    if (currentY > height * 0.4) {
      y.set(height * 0.85); // Snap to bottom
    } else {
      y.set(0); // Snap to top
    }
    setDragging(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-player touch-none"
      style={{ y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: height * 0.92 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={onDragEnd}
      initial={{ y: height }}
      animate={{ y: height * 0.92 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {/* Mini Player - Visible when dragged down */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[300px] border-t flex items-center px-4 gap-4 py-2"
        style={{ opacity: miniPlayerOpacity }}
      >
        <Image
          src={currentSong?.images[2]?.url || ""}
          width={40}
          height={40}
          className="rounded"
          alt="Song Image"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium truncate">{currentSong?.title}</h2>
          <p className="text-xs text-muted-foreground truncate">
            {currentSong?.artist?.map((x) => x.name)?.join(", ")}
          </p>
        </div>
        <Button
          className="cursor-pointer rounded-full"
          onClick={playing ? pause : PlayCurrent}
          variant="ghost"
          size="icon"
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </Button>
      </motion.div>

      {/* Full Player View */}
      <motion.div
        className="flex flex-col w-full h-full items-center justify-start px-4 gap-8"
        style={{
          opacity, scale, visibility, display,
          paddingTop: "3rem"
        }}
      >
        <div className="nav-header w-full flex justify-between items-center py-2 absolute top-0 left-0 right-0 px-4 z-50">
          <div className="backbtn">
            <Button
              className="cursor-pointer rounded-full"
              onClick={() => y.set(height * 0.92)}
              variant="ghost"
              size="icon"
            >
              <ArrowLeftIcon />
            </Button>
          </div>
          <h1 className="text-lg font-semibold">Now Playing</h1>
          <div className="actions">
            <Button
              className="cursor-pointer rounded-full"
              variant="ghost"
              size="icon"
            >
              <EllipsisVerticalIcon />
            </Button>
          </div>
        </div>
        <div className="w-full max-w-md aspect-square relative px-3 py-4 flex items-center justify-center pt-4">
          <Image
            src={currentSong?.images[2]?.url || ""}
            width={300}
            height={300}
            className="rounded-lg object-cover"
            alt="Song Image"
            draggable={false}
            style={{ cursor: "grab" }}
            onPointerDown={(e) => {
              const parent = e.currentTarget.closest("div[drag]");
              const parentDragEvent = new PointerEvent("pointerdown", {
                clientX: e.clientX,
                clientY: e.clientY,
                bubbles: true,
              });
              parent?.dispatchEvent(parentDragEvent);
            }}
          />
        </div>

        <div className="w-full max-w-md space-y-2">
          <h1 className="text-2xl font-semibold truncate">
            {currentSong?.title}
          </h1>
          <p className="text-base text-muted-foreground truncate space-y-4">
            {currentSong?.artist?.map((x) => x.name)?.join(", ")}
          </p>
        </div>

        <div
          className="w-full max-w-md flex flex-col items-center justify-center gap-2"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
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

          <div className="flex justify-center items-center gap-4">
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
              disabled={!currentSong || isBuffering}
              onClick={playing ? pause : PlayCurrent}
            >
              {isBuffering ? (
                <LoaderIcon className="animate-spin w-6 h-6" />
              ) : playing ? (
                <PauseIcon
                  strokeWidth={0.2}
                  className="opacity-90"
                  fill="currentColor"
                />
              ) : (
                <PlayIcon fill="currentColor" />
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobilePlayerView;
