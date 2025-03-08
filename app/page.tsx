"use client";

import { SidebarLayout } from "@/layouts/sidebar-layout";
import { Button } from "@/components/ui/button";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { SearchBar } from "@/components/utils/search-bar";
import { Suspense, useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

import { useQueue } from "@/providers/queue-provider";
import PlayerView from "@/features/player/components/PlayerView";
import { useFetchTrending } from "@/features/search/api/use-get-trending";
import { TrendingSongs } from "@/components/utils/TrendingList";
import { useGetSong } from "@/features/search/api/use-get-search";
import { TextAnimate } from "@/components/ui/text-animate";

export default function DashboardPage() {
  const { currentSong } = useQueue();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock trending songs data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size with higher pixel density
    const pixelRatio = window.devicePixelRatio || 1;
    const setSize = () => {
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Create gradient blobs
    class Blob {
      x: number;
      y: number;
      angle: number;
      speed: number;
      targetX: number;
      targetY: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 0);
        this.y = Math.random() * (canvas?.height ?? 0);
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.5 + Math.random() * 0.5;
        this.size = (canvas?.width ?? 0) * (0.1 + Math.random() * 0.2);
        this.color = [
          "#ff0080", // Hot Pink
          "#7928ca", // Purple
          "#0070f3", // Electric Blue
          "#00ff00", // Lime Green
          "#ff8a00", // Orange
          "#ff0000", // Red
          "#40e0d0", // Turquoise
          "#ff4500", // Sunset Orange
          "#8a2be2", // Violet
          "#ffd700", // Gold
          "#ff7f50", // Coral
          "#6a5acd", // Slate Blue
        ][Math.floor(Math.random() * 6)];
        this.targetX = 0;
        this.targetY = 0;
        this.setNewTarget();
      }

      setNewTarget() {
        this.targetX = Math.random() * (canvas?.width ?? 0);
        this.targetY = Math.random() * (canvas?.height ?? 0);
      }

      move() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          this.setNewTarget();
        }

        this.angle = Math.atan2(dy, dx);
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, this.color + "40");
        gradient.addColorStop(0.5, this.color + "20");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Ensure canvas dimensions are set before creating blobs
    setSize();

    // Create multiple blobs
    const blobs = Array.from({ length: 8 }, () => new Blob());

    // Animation
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw blobs
      blobs.forEach((blob) => {
        blob.move();
        blob.draw(ctx);
      });
    };

    animate();

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main>
      <SidebarLayout>
        <div className="flex flex-col gap-4">
          <header>
            <h2 className="text-white px-3 py-4 z-50 relative font-pop text-4xl font-bold ">
              Tune In to the Trends
            </h2>
          </header>
          <div className="min-h-screen  text-white overflow-hidden">
            {/* Animated Background */}
            <canvas
              ref={canvasRef}
              className="fixed w-full h-full"
              style={{
                filter: "blur(120px) brightness(0.37)",
                transform: "scale(1.2)",
                opacity: 0.8,
              }}
            />
            <section id="Trending">
              <TrendingSongs query="Global top songs" />
            </section>
            <header>
              <h2 className="text-white px-3 py-4 z-50 relative font-pop text-4xl font-bold ">
                Trending Indain Songs
              </h2>
            </header>
            <TrendingSongs query="Indian trending songs" />
          </div>
        </div>
      </SidebarLayout>
      <div className="playerView">{currentSong && <PlayerView />}</div>
    </main>
  );
}
// use server side to fetch data and pass it to the client
