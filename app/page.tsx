"use client";

import { SidebarLayout } from "@/layouts/sidebar-layout";
import { Button } from "@/components/ui/button";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { SearchBar } from "@/components/utils/search-bar";
import { useEffect } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

import { useQueue } from "@/providers/queue-provider";
import PlayerView from "@/features/player/components/PlayerView";

export default function DashboardPage() {

  const { currentSong } = useQueue();

  return (
    <main>
      <SidebarLayout>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <SearchBar />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2"></div>
        </div>
      </SidebarLayout>
      <div className="playerView">{currentSong && <PlayerView />}</div>
    </main>
  );
}
