"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Volume1, Volume, VolumeX } from "lucide-react";
import { useQueue } from "@/providers/queue-provider";

export default function VolumeControl() {
  const [volume, setVolume] = useState(100);
  const [previousVolume, setPreviousVolume] = useState(100);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { player } = useQueue();

  // Handle clicking outside to close the volume slider
  useEffect(() => {
    if (player) {
      player?.setVolume(volume);
    }
  }, [volume]);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 30) return <Volume className="h-5 w-5" />;
    if (volume < 70) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  const handleMuteToggle = () => {
    if (volume === 0) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMuteToggle}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="h-10 w-10 volume-btn"
      >
        {getVolumeIcon()}
      </Button>
      {isOpen && (
        <div
          className="slider-div"
          onMouseLeave={() => setIsOpen(false)}
          onMouseEnter={() => setIsOpen(true)}
        >
          <Slider
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
            max={100}
            step={1}
            className="slider"
          />
        </div>
      )}
    </div>
  );
}
