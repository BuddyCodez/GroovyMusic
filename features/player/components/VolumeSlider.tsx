"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Volume1 } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@heroui/react"
import { useQueue } from "@/providers/queue-provider"

export function VolumeControl() {
  const [volume, setVolume] = React.useState(100)
  const [prevVolume, setPrevVolume] = React.useState(100)
  const [isOpen, setIsOpen] = React.useState(false)
  const { player } = useQueue();

  const VolumeIcon = React.useMemo(() => {
    if (volume === 0) return VolumeX
    if (volume < 50) return Volume1
    return Volume2
  }, [volume])

  const handleVolumeToggle = () => {
    if (volume === 0) {
      setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      setVolume(0)
    }
    player?.setVolume(volume === 0 ? prevVolume : 0);
  }
  const handleVolumeChange = (value: number) => {
    if (value === 0) {
      setPrevVolume(volume)
    }
    setVolume(value)
    player?.setVolume(value);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground relative group"
          onClick={handleVolumeToggle}
          onMouseOver={() => setIsOpen(true)}
          
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={volume === 0 ? "muted" : "unmuted"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <VolumeIcon className="h-4 w-4" />
            </motion.div>
          </AnimatePresence>
          <motion.div
            className="absolute bottom-0 left-1/2 h-1 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: isOpen ? "80%" : "0%",
            }}
            style={{
              translateX: "-50%",
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="silderPopover px-3 py-4"
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => {
          setTimeout(() => { setIsOpen(false) }, 200)
        }}
      >
        <div className="volumeSliderWrapper flex flex-col justify-center">
          <Slider
            aria-label="Volume"
            defaultValue={volume}
            maxValue={100}
            minValue={0}
            orientation="vertical"
            size="sm"
            step={1}
            onChange={(value) => handleVolumeChange(value as number)}
            onChangeEnd={(value) => handleVolumeChange(value as number)}
          />
        </div>
        <div className="mt-2 text-xs text-center font-medium min-w-[20px]">{volume}%</div>
      </PopoverContent>
    </Popover>
  )
}

