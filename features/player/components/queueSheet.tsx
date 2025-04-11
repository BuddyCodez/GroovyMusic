"use client"

import { useOpenQueue } from "../hooks/use-open-queue"
import { useQueue } from "@/providers/queue-provider"
import { CircleXIcon, GripVertical, Music2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Image } from "@heroui/image"
import { Lexend_Giga } from "next/font/google"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Reorder, AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Custom hook for staggered animations
const useStaggeredList = () => {
  return {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, x: 20 },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      },
    },
  }
}

const filterHighQualityImage = (images: any) => {
  return images[images?.length - 1].url
}

const lxgiga = Lexend_Giga({
  subsets: ["latin", "vietnamese"],
  display: "swap",
})

export const QueueSheet = () => {
  const { isOpen, onClose } = useOpenQueue()
  const { queue, currentSong, setQueue } = useQueue()
  const { toast } = useToast()

  const handleClearQueue = (id: string | undefined) => {
    if (!id) return
    const newQueue = queue.filter((song) => song.id !== id)
    setQueue(newQueue)
  }

  const handleClearAll = async () => {
    onClose()
    setQueue([])
    toast({
      title: "Queue Status",
      description: "Queue Cleared",
    })
  }

  const { container, item } = useStaggeredList()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col min-w-[20vw] px-4" style={{
        height: "calc(100vh - 90px)",
      }}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Queue</SheetTitle>
            <div className="actions flex gap-2">
              <Button variant="outline" className="cursor-pointer" onClick={handleClearAll}>
                Clear <ClearQueueIcon />
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </SheetHeader>
        <SheetDescription className="flex flex-col items-start gap-2 px-2 py-0">
          <p className={cn("text-xs text-muted-foreground font-medium", lxgiga.className)}>
            Next up: {queue.length > 0 ? queue[0]?.title : "No songs in queue..."}
          </p>
        </SheetDescription>
        <ScrollArea className="flex-1 max-h-[300px]">
          <Reorder.Group
            axis="y"
            onReorder={setQueue}
            values={queue}
            className="flex flex-col gap-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {queue.map(
                (song: any, index: number) =>
                  song && (
                    <Reorder.Item
                      key={song.id}
                      value={song}
                      initial={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: "100%",
                        scale: 0.9,
                        transition: {
                          stiffness: 200,
                          damping: 10,
                          duration: 0.3,
                        },
                      }}
                      layout
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg",
                        currentSong?.id === song?.id ? "bg-white/10" : "hover:bg-white/5",
                      )}
                    >
                      <motion.div
                        className="item-wrapper cursor-pointer flex items-center gap-3 px-2 rounded-lg overflow-x-hidden w-full"
                        layout
                      >
                        <GripVertical className="w-5 h-5 text-white/40 cursor-grab active:cursor-grabbing" />
                        <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                          {song?.images ? (
                            <Image
                              src={filterHighQualityImage(song.images) || "/placeholder.svg"}
                              alt={song.title}
                              width={40}
                              height={40}
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                              <Music2 className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white line-clamp-1">{song?.title}</p>
                          <p className="text-xs text-white/70 line-clamp-1">
                            {song?.artist?.map((x: any) => x?.name)?.join(", ")}
                          </p>
                        </div>
                        <div className="text-sm text-white/70">{song?.duration?.label}</div>
                        <Button size="icon" variant="ghost" onClick={() => handleClearQueue(song.id)}>
                          <CircleXIcon className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </Reorder.Item>
                  ),
              )}
            </AnimatePresence>
          </Reorder.Group>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

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
  )
}

