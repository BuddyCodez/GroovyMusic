"use client";

import { Toaster } from "@/components/ui/toaster";
import { QueueSheet } from "@/features/player/components/queueSheet";
// import { PlaylistSheet } from "@/features/playlist/component/playlist-sheet";
import { useMountedState } from "react-use";

export const SheetsProvider = ({ }) => {
  const isMounted = useMountedState();
  if (!isMounted) return null;
  return (
    <>
      <div id="toaster">
        <Toaster />
      </div>
      <QueueSheet />
      {/* <PlaylistSheet /> */}
    </>
  );
};
