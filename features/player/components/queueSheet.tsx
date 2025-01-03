import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOpenQueue } from "../hooks/use-open-queue";
import { useQueue } from "@/providers/queue-provider";
import { filterHighQualityImage } from "@/features/search/components/MusicList";
import { GripVertical, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import discIcon from "@/public/disc-icon.gif";
import Image from "next/image";
import { Image as NextUiImage, VisuallyHidden } from "@nextui-org/react";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

type ItemType = {
  id: string;
  index: number;
};

const ItemTypes = {
  QUEUE_ITEM: "queueItem",
};

const QueueItem = ({ song, index, moveItem, handleClearQueue }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.QUEUE_ITEM,
    item: { id: song.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => index !== 0, // Prevent dragging the current song
  });

  const [, drop] = useDrop({
    accept: ItemTypes.QUEUE_ITEM,
    hover(item: ItemType) {
      if (item.index === index) {
        return;
      }
      moveItem(item.index, index);
      item.index = index;
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) {
          drag(drop(node));
        }
      }}
      className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
        isDragging
          ? "opacity-50 bg-accent border-accent"
          : "bg-background hover:bg-accent/10"
      }`}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-4 flex-1">
        {index === 0 ? (
          <Image src={discIcon} alt="Playing" width={40} height={40} />
        ) : (
          <button
            onClick={() => handleClearQueue(song.id)}
            className="p-2 hover:text-destructive transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}

        <Image
          src={filterHighQualityImage(song.images)}
          width={50}
          height={50}
          className="rounded-md"
          alt={"Queue Item"}
        />

        <div className="flex flex-col min-w-0">
          <h3 className="font-medium truncate">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {song.artist?.map((x: any) => x.name)?.join(", ")}
          </p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground px-2">
        {song.duration?.label}
      </div>
    </div>
  );
};

export const QueueSheet = () => {
  const { isOpen, onClose } = useOpenQueue();
  const { queue, currentSong, setQueue } = useQueue();
  const items = [currentSong, ...queue];
  const { toast } = useToast();

  const handleClearQueue = (id: string | undefined) => {
    if (!id) return;
    const newQueue = queue.filter((song) => song.id !== id);
    setQueue(newQueue);
  };

  const handleClearAll = async () => {
    onClose();
    setQueue([]);
    toast({
      title: "Queue Status",
      description: "Queue Cleared",
    });
  };
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (dragIndex === 0 || hoverIndex === 0) return; // Prevent moving to/from current song position

      const newQueue = [...queue];
      const dragItem = newQueue[dragIndex - 1]; // Adjust index for queue array
      newQueue.splice(dragIndex - 1, 1);
      newQueue.splice(hoverIndex - 1, 0, dragItem);
      setQueue(newQueue);
    },
    [queue, setQueue]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl h-[70vh] flex flex-col"
        id="queue-sheet"
      >
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Queue</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="absolute top-4 right-4 flex gap-2 items-center justify-between  w-full">
          <div className="px-8">
            <Label>Queue</Label>
          </div>
          <div className="flex gap-2 items-center ">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleClearAll}
            >
              Clear queue <ClearQueueIcon />
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-2"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-scroll max-h-[400px] mt-8 px-3">
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-2">
              {items.map(
                (song: any, index: number) =>
                  song && (
                    <QueueItem
                      key={song.id}
                      song={song}
                      index={index}
                      moveItem={moveItem}
                      handleClearQueue={handleClearQueue}
                    />
                  )
              )}
            </div>
          </DndProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const ClearQueueIcon = () => {
  return (
    <div className="icon w-[40px] h-[40px]">
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M6.75 7.75L7.59115 17.4233C7.68102 18.4568 8.54622 19.25 9.58363 19.25H14.4164C15.4538 19.25 16.319 18.4568 16.4088 17.4233L17.25 7.75"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9.75 7.5V6.75C9.75 5.64543 10.6454 4.75 11.75 4.75H12.25C13.3546 4.75 14.25 5.64543 14.25 6.75V7.5"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M5 7.75H19"
        ></path>
      </svg>
    </div>
  );
};
