"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import YouTubePlayer from "youtube-player";
import { atom, useAtom } from "jotai";
import { Song } from "@/types/song";
import axios from "axios";
import {
  currentSongAtom,
  PlayerAtom,
  queueAtom,
  songBufferingAtom,
} from "@/store/jotaiStore";

// Types
type QueueContextType = {
  queue: Song[];
  currentSong: Song | null;
  buffering: boolean;
  addToQueue: (song: Song, forcePlay?: boolean) => void;
  addMultipleToQueue: (songs: Song[]) => void;
  removeFromQueue: () => void;
  playPreviousSong: () => void;
  playNextSong: (Queue?: Song[]) => void;
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
  playSongsNow: (Songs: Song[]) => void;
};

// Initial values to prevent unnecessary re-creation on renders
const INITIAL_QUEUE_CONTEXT: QueueContextType = {
  queue: [],
  currentSong: null,
  addToQueue: () => {},
  addMultipleToQueue: () => {},
  removeFromQueue: () => {},
  playPreviousSong: () => {},
  playNextSong: () => {},
  playing: false,
  pause: () => {},
  PlayCurrent: () => {},
  player: null,
  buffering: false,
  seekTo: () => {},
  currentTime: null,
  playeState: "",
  autoplay: false,
  setAutoplay: () => {},
  setQueue: () => {},
  playSongsNow: () => {},
};

const QueueContext = createContext<QueueContextType>(INITIAL_QUEUE_CONTEXT);

export const useQueue = () => useContext(QueueContext);

interface QueueProviderProps {
  children: React.ReactNode;
}

// Player state mapping - moved outside component to avoid recreation
const STATE_NAMES = {
  "-1": "Not Started",
  0: "Ended",
  1: "Playing",
  2: "Paused",
  3: "Buffering",
  5: "Song Queued",
};

export const QueueProvider = ({ children }: QueueProviderProps) => {
  const playerRef = useRef<any>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialRender = useRef(true);
  const isManualChange = useRef(false); // Flag to track if a change was manual or automatic
  const currentSongIdRef = useRef<string | null>(null); // Keep track of current song ID

  // Jotai atoms for global state
  const [queue, setQueue] = useAtom(queueAtom);
  const [currentSong, setCurrentSong] = useAtom(currentSongAtom);
  const [buffering, setBuffering] = useAtom(songBufferingAtom);

  // Local state
  const [playing, setPlaying] = useState(false);
  const [history, setHistory] = useState<Song[]>([]);
  const [playerState, setPlayerState] = useState("");
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [autoplay, setAutoplay] = useState(false);

  // Update the reference when current song changes
  useEffect(() => {
    if (currentSong) {
      currentSongIdRef.current = currentSong.id ?? null;
    } else {
      currentSongIdRef.current = null;
    }
  }, [currentSong]);

  // Memoized handlers to prevent recreation on every render
  const addToQueue = useCallback(
    (song: Song, forcePlay?: boolean) => {
      if (!song.id) {
        console.error("Song ID is required");
        return;
      }

      // When forcePlay is true, immediately play this song
      if (forcePlay) {
        isManualChange.current = true;
        setCurrentSong(song);
        if (playerRef.current) {
          playerRef.current.loadVideoById({ videoId: song.id });
          playerRef.current.playVideo();
          setPlaying(true);
        }
        return;
      }

      // If no current song exists, make this the current song but DON'T play it
      if (!currentSong) {
        console.log("No current song, setting as current without playing");
        setCurrentSong(song);
        return;
      }

      // Otherwise, just add to queue - this is the critical case we need to fix
      console.log("Adding song to queue:", song.id);
      const songToAdd = {
        ...song,
        addedBy: "Guest",
      };

      // Simply add to queue without modifying current song or playing state
      setQueue((prev) => [...prev, songToAdd]);
    },
    [currentSong, setCurrentSong, setQueue]
  );

  const addMultipleToQueue = useCallback(
    (songs: Song[]) => {
      if (!songs.length) return;

      if (!currentSong) {
        // If nothing is playing, set the first song as current and queue the rest
        setCurrentSong(songs[0]);
        setQueue(songs.slice(1));
        return;
      }

      // Otherwise add all songs to queue
      setQueue((prev) => [...prev, ...songs]);
    },
    [currentSong, setCurrentSong, setQueue]
  );

  const playSongsNow = useCallback(
    (songs: Song[]) => {
      if (!songs.length) return;

      // Immediately override current song and queue
      isManualChange.current = true;
      setCurrentSong(songs[0]);
      setQueue(songs.slice(1));

      if (playerRef.current) {
        playerRef.current.loadVideoById({ videoId: songs[0].id });
        playerRef.current.playVideo();
        setPlaying(true);
      }
    },
    [setCurrentSong, setQueue]
  );

  const playPreviousSong = useCallback(() => {
    if (!history.length) return;

    const newHistory = [...history];
    const lastSong = newHistory.pop();

    if (lastSong) {
      isManualChange.current = true;
      // Move current song to beginning of queue if it exists
      if (currentSong) {
        setQueue((prev) => [currentSong, ...prev]);
      }

      setCurrentSong(lastSong);
      setHistory(newHistory);

      if (playerRef.current) {
        playerRef.current.loadVideoById({ videoId: lastSong.id });
        playerRef.current.playVideo();
        setPlaying(true);
      }
    }
  }, [history, currentSong, setQueue, setCurrentSong]);

  const playNextSong = useCallback(
    (providedQueue?: Song[]) => {
      // first of all set slider value to 0
      setCurrentTime(0);

      // Get the latest queue directly from state
      const currentQueue = queue;
      console.log(
        "playNextSong called, queue length:",
        providedQueue?.length || currentQueue.length
      );

      // Use provided queue or the existing one
      const songQueue = providedQueue ?? currentQueue;
      console.log("Song Queue:", songQueue);
      if (!songQueue || songQueue.length === 0) {
        console.log("Queue is empty, stopping playback");
        // Handle empty queue case
        if (currentSong) {
          // Add current song to history before clearing
          setHistory((prev) => [...prev.filter(Boolean), currentSong]);
        }

        // Check if autoplay is enabled before stopping completely
        if (autoplay) {
          console.log("Autoplay is enabled, will fetch more songs soon");
          // We'll let the autoplay effect handle this
          // fetchAutoplaySongs(10);
        } else {
          setCurrentSong(null);
          setPlaying(false);
          playerRef.current?.stopVideo();
        }
        return;
      }

      // Get next song and remaining queue
      const [nextSong, ...remainingQueue] = songQueue;

      // Update history if we have a current song
      if (currentSong) {
        setHistory((prev) => [...prev.filter(Boolean), currentSong]);
      }

      // Update state
      isManualChange.current = true;
      setCurrentSong(nextSong);
      setQueue(remainingQueue);

      // Start playback if we have a player and song
      if (playerRef.current && nextSong) {
        console.log("Playing next song:", nextSong.title);
        // Changed: Use loadVideoById instead of cueVideoById to force playback
        playerRef.current.loadVideoById({ videoId: nextSong.id });
        playerRef.current.playVideo(); // Explicitly play the video
        setPlaying(true);
      }
    },
    [queue, currentSong]
  );

  const PlayCurrent = useCallback(() => {
    if (!playerRef.current || !currentSong) return;

    playerRef.current.playVideo();
    setPlayerState("Playing");
    setPlaying(true);
  }, [currentSong]);

  const pause = useCallback(() => {
    if (!playerRef.current) return;

    playerRef.current.pauseVideo();
    setPlaying(false);
    setPlayerState("Paused");
  }, []);

  const seekTo = useCallback((time: number) => {
    if (!playerRef.current) return;

    playerRef.current.seekTo(time);
  }, []);

  // Autoplay functionality - fetch related songs when queue is empty
  const fetchAutoplaySongs = useCallback(
    async (limit: number = 20) => {
      if (!autoplay || !currentSong || queue.length > 0) return;

      try {
        console.log("Fetching autoplay songs for", currentSong.id);
        const response = await axios.get(`/api/autoplay/${currentSong.id}`);

        if (response.data?.songs) {
          // Process and clean the song data
          const validSongs = response.data.songs.map((song: any) => ({
            ...song,
            images: song.images.map((image: any) => ({
              ...image,
              url: image.url || "",
            })),
          }));

          // Filter out songs already in queue
          const newSongs = validSongs
            .filter((song: any) => !queue.find((qSong) => qSong.id === song.id))
            .slice(0, limit);

          if (newSongs.length) {
            addMultipleToQueue(newSongs);
            console.log("Added", newSongs.length, "autoplay songs to queue");
          }
        }
      } catch (error) {
        console.error("Error fetching autoplay songs:", error);
      }
    },
    [autoplay, currentSong, queue, addMultipleToQueue]
  );

  // Handle queue loading on first render
  useEffect(() => {
    if (
      (!currentSong || !playing) &&
      queue.length > 0 &&
      isInitialRender.current
    ) {
      // Queue has songs but nothing is playing, so set the first song as current
      // but DO NOT play it automatically
      const [firstSong, ...newQueue] = queue;
      setCurrentSong(firstSong);
      setQueue(newQueue);
      console.log("[QUEUE]: Song State has been Revised after Website Load");
      isInitialRender.current = false;
    }
  }, [queue, currentSong, playing, setCurrentSong, setQueue]);

  // Initialize player only once
  useEffect(() => {
    // Only initialize the player once when we have a current song
    if (!playerRef.current && currentSong) {
      console.log("Initializing YouTube player with", currentSong.id);
      const youtubePlayer = YouTubePlayer("player-1", {
        videoId: currentSong.id,
        width: 0,
        height: 0,
        playerVars: {
          autoplay: isManualChange.current ? 1 : 0,
        },
      });

      playerRef.current = youtubePlayer;

      // Set up state change handler
      youtubePlayer.on("stateChange", (e) => {
        const state = e.data;

        // Handle different player states
        switch (state) {
          case 0: // Ended
            console.log("Song Ended");
            // When song ends, mark the next change as manual so it will auto-play
            isManualChange.current = true;
            playNextSong(queue);
            break;

          case 1: // Playing
            console.log("Song Playing: ", currentSong.title);
            setPlaying(true);
            setBuffering(false);
            setPlayerState("Playing");

            // Start time tracking
            if (timeUpdateIntervalRef.current) {
              clearInterval(timeUpdateIntervalRef.current);
            }

            timeUpdateIntervalRef.current = setInterval(async () => {
              const time = await youtubePlayer.getCurrentTime();
              setCurrentTime(time);
            }, 1000);
            break;

          case 2: // Paused
            setPlaying(false);
            setBuffering(false);
            setPlayerState("Paused");

            // Stop time tracking
            if (timeUpdateIntervalRef.current) {
              clearInterval(timeUpdateIntervalRef.current);
              timeUpdateIntervalRef.current = null;
            }
            break;

          case 3: // Buffering
            setBuffering(true);
            break;

          case 5: // Video cued
            // If a video is cued and it was a manual change, play it
            if (isManualChange.current) {
              youtubePlayer.playVideo();
              isManualChange.current = false;
            }
            setBuffering(false);
            break;

          case -1: // Unstarted
            // setBuffering(true);
            setCurrentTime(0);
            break;
        }
      });
    }

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
    };
  }, [currentSong]);

  // Handle current song changes (separate from player initialization)
  useEffect(() => {
    // Skip if no player or no current song
    if (!playerRef.current || !currentSong) return;

    // Check if this is actually a new song (to prevent reloading the same song)
    if (currentSongIdRef.current !== currentSong.id) {
      console.log("Current song changed to:", currentSong.id);

      // Check if this song change was triggered manually (user interaction)
      if (isManualChange.current) {
        console.log(
          "Manual change detected, loading and playing video:",
          currentSong.id
        );
        playerRef.current.loadVideoById({ videoId: currentSong.id });
        playerRef.current.playVideo();
        isManualChange.current = false; // Reset flag
      } else {
        console.log(
          "Automatic change detected, just cueing video:",
          currentSong.id
        );
        // Just cue the video without playing
        playerRef.current.cueVideoById({ videoId: currentSong.id });
      }

      // Update the ref to the new song ID
      currentSongIdRef.current = currentSong.id ?? null;
    }
  }, [currentSong]);

  // Handle autoplay
  useEffect(() => {
    if (autoplay && queue.length === 0) {
      fetchAutoplaySongs();
    }
  }, [autoplay, queue.length, fetchAutoplaySongs]);

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = {
    queue,
    currentSong,
    addToQueue,
    addMultipleToQueue,
    removeFromQueue: () => {}, // Placeholder - not implemented in original code
    playPreviousSong,
    playNextSong,
    playSongsNow,
    playing,
    pause,
    PlayCurrent,
    player: playerRef.current,
    seekTo,
    currentTime,
    playeState: playerState,
    autoplay,
    setAutoplay,
    setQueue,
    buffering,
  };

  return (
    <QueueContext.Provider value={contextValue}>
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

// Use memo to prevent unnecessary re-renders when parent components update
export default memo(QueueProvider);
