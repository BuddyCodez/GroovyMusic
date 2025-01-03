"use client";
import playAudio from "@/components/api/AudioPlayer";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import YouTubePlayer from "youtube-player";
import { atom, useAtom } from "jotai";
const QueueContext = createContext<{
  queue: Song[];
  currentSong: Song | null;
  addToQueue: (song: Song, forcePlay?: boolean) => void;
  addMultipleToQueue: (songs: Song[]) => void;
  removeFromQueue: () => void;
  playPreviousSong: () => void;
  playNextSong: () => void;
  playing: boolean;
  pause: () => void;
  PlayCurrent: () => void;
  player: any | null;
  seekTo: (time: number) => void;
  currentTime: number | null;
  playeState: string;
  autoplay: boolean;
  setAutoplay: React.Dispatch<React.SetStateAction<boolean>>;
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;
}>({
  queue: [],
  currentSong: null,
  addToQueue: (song: Song) => {},
  addMultipleToQueue: (songs: Song[]) => {},
  removeFromQueue: () => {},
  playPreviousSong: () => {},
  playNextSong: () => {},
  playing: false,
  pause: () => {},
  PlayCurrent: () => {},
  player: null,
  seekTo: (time: number) => {},
  currentTime: null,
  playeState: "",
  autoplay: false,
  setAutoplay: () => {},
  setQueue: () => {},
});

// import { SocketContext } from './SocketProvider';

import { Song } from "@/types/song";
import { useUser } from "@clerk/nextjs";
import { set } from "zod";
import { client } from "@/lib/hono";
import { useGetAutoPlay } from "@/features/player/api/autoplay";
import axios from "axios";
import { PlayerAtom, queueAtom } from "@/store/jotaiStore";
export const useQueue = () => useContext(QueueContext);
// const useSocket = useContext(SocketContext);
interface QueueProviderProps {
  children: React.ReactNode;
}

export const QueueProvider = ({ children }: QueueProviderProps) => {
  // const { SetProgress } = useSeekbar();
  const { user } = useUser();
  const [player, setPlayer] = useState<any | null>(null);
  const [queue, setQueue] = useAtom(queueAtom);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playing, setPlaying] = useState(false);
  const [history, setHistory] = useState<Song[]>([]);
  const [playeState, setPlayerState] = useState("");
  const [currentTime, setCurrentTime] = useState(null);
  const [autoplay, setAutoplay] = useState(false);
  const [Player, setplayer] = useAtom(PlayerAtom);
  // const socket = useContext(SocketContext);

  const addToQueue = (song: Song, forcePlay?: boolean) => {
    if (!song.id) return console.error("Song ID is required");
    if (forcePlay) {
      setCurrentSong(song);
      if (playing) {
        player.loadVideoById({ videoId: song.id });
        player.playVideo();
      }
      return;
    }
    const toadd = {
      ...song,
      addedBy: user?.id ?? "Guest",
    };
    setQueue([...queue, toadd]);
    if (!currentSong) {
      setCurrentSong(toadd);
    }
  };
  var stateNames = {
    "-1": "Not Started",
    0: "Ended",
    1: "Playing",
    2: "Paused",
    3: "Buffering",
    5: "Song Queued",
  };

  useEffect(() => {
    if (player && currentSong) {
      player.loadVideoById({ videoId: currentSong.id });
      console.log("Cued Video", currentSong.id);
    }
    if (!player && currentSong && !playing) {
      const youtubePlayer = YouTubePlayer("player-1", {
        videoId: currentSong.id,
        width: 0,
        height: 0,
        playerVars: {
          autoplay: 1,
        },
      });
      setPlayer(youtubePlayer);
      setPlaying(true);
    }
    return () => {
      // Clean up event listeners when component unmounts
    };
  }, [player, currentSong]);

  // useEffect(() => {
  //   if (player && currentSong) {
  //     console.log("Player state Binded");
  //     player.on("stateChange", (e: any) => {
  //       if (e.data == 1) {
  //         const updateCurrentTime = async () => {
  //           const time = await player.getCurrentTime();
  //           const duration = await player.getDuration();
  //           setCurrentTime(time);
  //           requestAnimationFrame(updateCurrentTime); // Keep updating efficiently
  //         };
  //         requestAnimationFrame(updateCurrentTime);
  //       }
  //       const objectKeys = Object.keys(stateNames);
  //       const objectValues = Object.values(stateNames);
  //       const state = objectValues[objectKeys.indexOf(String(e.data))];
  //       if (e.data == 0 || state.toLowerCase() == "ended") {
  //         console.log("Song Ended");
  //         playNextSong();
  //       }

  //       setPlayerState(state);
  //       console.log("State Changed", state);
  //     });
  //   }
  // }, [player, currentSong]);

  useEffect(() => {
    if (player && currentSong) {
      console.log("Player state Binded");

      const handleStateChange = (e: any) => {
        if (e.data === 1) {
          // Playing
          setPlaying(true);
          const updateCurrentTime: any = async () => {
            const time = await player.getCurrentTime();
            const duration = await player.getDuration();
            setCurrentTime(time);
          };
          const intervalId = setInterval(updateCurrentTime, 1000); // Update every second

          return () => clearInterval(intervalId); // Clean up interval on unmount
        }

        const objectKeys = Object.keys(stateNames);
        const objectValues = Object.values(stateNames);
        const state = objectValues[objectKeys.indexOf(String(e.data))];

        if (e.data === 0 || state.toLowerCase() === "ended") {
          console.log("Song Ended");
          playNextSong();
        }

        setPlayerState(playing ? "Playing" : state);
        console.log("State Changed", state);
      };

      player.addEventListener("onStateChange", handleStateChange);

      return () => {
        // Clean up event listeners when component unmounts
        player.removeEventListener("onStateChange", handleStateChange);
      };
    }
  }, [player, playing, currentSong]);
  useEffect(() => {
    if (autoplay) {
      AddAutoPlaySongs();
    }
  }, [queue, currentSong, autoplay]);
  const removeFromQueue = () => {};
  const playPreviousSong = () => {
    const lastSong = history.pop();
    if (lastSong) {
      const newQueue = [currentSong, ...queue];
      setQueue(newQueue.filter((song): song is Song => song !== null));
      setCurrentSong(lastSong);
      player.loadVideoById({ videoId: lastSong.id });
    }
  };
  const AddAutoPlaySongs = async (limit: number = 10) => {
    if (!autoplay) return;
    if (queue.length > 1 || queue.length < 0) return;
    console.log(queue.length, "Queue Length");
    const fetchAutoplaySongs = async () => {
      if (!currentSong) return;
      console.log("Fetching autoplay songs for", currentSong.id);
      try {
        const songsData = await axios.get(`/api/autoplay/${currentSong.id}`);
        if (songsData.data) {
          console.log("Autoplay songs fetched:", songsData.data);
          const validSongs = songsData.data?.songs?.map((song: any) => ({
            ...song,
            images: song.images.map((image: any) => ({
              ...image,
              url: image.url || "", // Ensure image URL is valid
            })),
          }));
          addMultipleToQueue([...validSongs.slice(0, limit)]); // Add the new songs to the queue
          console.log("Autoplay songs added to queue");
        }
      } catch (error) {
        console.error("Error fetching autoplay songs:", error);
      }
    };
    await fetchAutoplaySongs();
  };
  const addMultipleToQueue = (songs: Song[]) => {
    if (!playing || !currentSong) {
      setCurrentSong(songs[0]);
      const newQueue = songs.slice(1);
      setQueue([...newQueue]);
      // console.log(newQueue);
      return;
    }
    setQueue([...queue, ...songs]);
    // AddAutoPlaySongs();
  };
  const playNextSong = () => {
    const nextSong = queue.shift();
    const newQueue = queue.filter((song) => song.id !== nextSong?.id) || [];
    const newHistory = [...history, currentSong].filter(
      (song): song is Song => song !== null
    );
    setCurrentSong(nextSong || null);
    if (nextSong) {
      player.loadVideoById({ videoId: nextSong.id });
    }
    setQueue(newQueue);
    setHistory(newHistory);
  };

  const PlayCurrent = () => {
    player && player.playVideo();
    setPlayerState("Playing");
    setPlaying(true);
  };
  const pause = () => {
    player && player.pauseVideo();
    setPlaying(false);
    setPlayerState("Paused");
  };
  const seekTo = (time: number) => {
    // player && socket?.emit("seekToSync", time);
  };
  return (
    <QueueContext.Provider
      value={{
        queue,
        currentSong,
        addToQueue,
        removeFromQueue,
        playPreviousSong,
        playNextSong,
        playing,
        pause,
        PlayCurrent,
        player,
        seekTo,
        currentTime,
        playeState,
        autoplay,
        setAutoplay,
        addMultipleToQueue,
        setQueue,
      }}
    >
      <div
        id="player-1"
        style={{
          width: 0,
          height: 0,
          display: "none",
          visibility: "hidden",
        }}
      ></div>
      {children}
    </QueueContext.Provider>
  );
};
export default QueueProvider;
