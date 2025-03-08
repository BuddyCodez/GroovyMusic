"use client"

import { SidebarLayout } from "@/layouts/sidebar-layout"
import { SearchBar } from "@/components/utils/search-bar"
import { useSearch } from "@/components/api/use-search"
import { useEffect } from "react"
import { useGetAlbum, useGetPlaylist, useGetSong } from "@/features/search/api/use-get-search"
import MusicList, { filterHighQualityImage } from "@/features/search/components/MusicList"
import PlayerView from "@/features/player/components/PlayerView"
import { useQueue } from "@/providers/queue-provider"
import { type Album, Song } from "@/types/song"
import GradualSpacing from "@/components/ui/gradual-spacing"
import { TopResultSkeleton, SongRowSkeleton, AlbumCardSkeleton } from "@/components/skeletons/search-skeleton"
import { motion } from "framer-motion"
import AlbumList from "@/features/search/components/AlbumList"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import BlurFade from "@/components/ui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Clock, Play } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

function HighestRegexMatch(data: any, query: string) {
  if (!data || !data.length) return null
  const regex = new RegExp(query.toLowerCase(), "i")

  let highestMatch = null
  let highestScore = 0

  data.forEach((item: { title: string }) => {
    const match = item.title.match(regex)
    if (match) {
      const score = match[0].length
      if (score > highestScore) {
        highestScore = score
        highestMatch = item
      }
    }
  })

  return highestMatch || data[0]
}

export default function SearchPage() {
  const search = useSearch()
  const { currentSong, addMultipleToQueue } = useQueue()
  const { data: songsData, isLoading: isSongsLoading, refetch } = useGetSong(search.query)
  const { data: albumsData, isLoading: isAlbumsLoading } = useGetAlbum(search.query)
  const { data: playlistData, isLoading: isPlaylistLoading } = useGetPlaylist(search.query)
  const TopResult = HighestRegexMatch(songsData, search.query)
  const { toast } = useToast()

  useEffect(() => {
    document.getElementById("search")?.focus()
  }, [search.query])

  useEffect(() => {
    if (search.query) {
      refetch()
    }
  }, [search.query, refetch])

  const transformedAlbumsData: Album[] | null = albumsData
    ? albumsData.map((album: any) => ({
      ...album,
      images: album?.images?.map((image: any) => ({
        ...image,
        url: image.url || "",
      })),
      artist:
        "artist" in album && album.artist
          ? typeof album.artist === "string"
            ? album.artist
            : album.artist.map((a: any) => a.name).join(", ")
          : undefined,
    }))
    : null

  const addPlaylistToQueue = async (id: string) => {
    const { data } = await axios.get('/api/playlist/' + id)
    const songs = data.songs as Song[]
    songs.forEach(song => {
      song.album = song.album || { name: "Unknown Album" }
    })
    addMultipleToQueue(songs)
    toast({
      title: "Playlist added to queue",
      description: "All songs from the playlist have been added to the queue",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background/10 to-background">
      <SidebarLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4 pb-24"
        >

          {search.query && (
            <div className="px-4">
              <h1 className="text-4xl font-bold text-white mb-8">Search results for "{search.query}"</h1>
            </div>
          )}

          {isSongsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 px-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Top Result</h2>
                <TopResultSkeleton />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Songs</h2>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SongRowSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            songsData && <MusicList songs={songsData} topResult={TopResult} />
          )}

          {search.query && (
            <div className="px-6 mt-8">
              <GradualSpacing className="font-display text-3xl font-bold text-white mb-6" text="Albums" />
              {isAlbumsLoading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <AlbumCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                albumsData && <AlbumList albums={transformedAlbumsData} />
              )}
            </div>
          )}

          {search.query && (
            <div className="px-6 mt-8">
              <GradualSpacing className="font-display text-3xl font-bold text-white mb-6" text="Playlists" />
              {isPlaylistLoading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <AlbumCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                playlistData && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {playlistData?.map((playlist: any, index: number) => (
                      <BlurFade key={playlist.id} inView delay={0.01 * index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          whileHover={{ y: -4 }}
                        >
                          <ContextMenu>
                            <ContextMenuTrigger>
                              <Card className="group cursor-pointer border-0 bg-white/5 transition-colors hover:bg-white/10">
                                <CardContent className="p-4">
                                  <div className="relative aspect-square w-full overflow-hidden rounded-md">
                                    <Image
                                      src={filterHighQualityImage(playlist.images) || "/placeholder.svg"}
                                      alt={playlist.title}
                                      height={200}
                                      width={200}
                                      referrerPolicy="no-referrer"
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                  </div>
                                  <div className="mt-4 space-y-1">
                                    <h3 className="line-clamp-1 text-sm font-medium text-white group-hover:text-white/90">
                                      {playlist.title}
                                    </h3>
                                    <p className="line-clamp-1 text-xs text-white/60">{playlist.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-white/40">
                                      <span>{playlist.totalSongs} songs</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-56">
                              <ContextMenuItem onClick={() => addPlaylistToQueue(playlist.id)}>Add to queue</ContextMenuItem>
                              <ContextMenuItem>Add to playlist</ContextMenuItem>
                              <ContextMenuItem>Share playlist</ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        </motion.div>
                      </BlurFade>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </motion.div>
      </SidebarLayout>
      {currentSong && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="playerView"
        >
          <PlayerView />
        </motion.div>
      )}
    </main>
  )
}