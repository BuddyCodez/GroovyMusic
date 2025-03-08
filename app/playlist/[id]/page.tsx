// app/playlist/[id]/page.tsx
"use client"

import { SidebarLayout } from "@/layouts/sidebar-layout"
import { SearchBar } from "@/components/utils/search-bar"
import { motion } from "framer-motion"
import { useQueue } from "@/providers/queue-provider"
import { Song } from "@/types/song"
import { Button } from "@/components/ui/button"
import { Play, ListMusic, Clock, Plus, Edit, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Image } from "@heroui/image";
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import GradualSpacing from "@/components/ui/gradual-spacing"
import PlayerView from "@/features/player/components/PlayerView"
import { useAuth } from "@clerk/nextjs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
function getFirstTwoLetters(name: string) {
    return name.split(" ").map((x) => x[0]).join("")
}
export default function PlaylistPage({ params }: { params: { id: string } }) {
    const { id } = params
    const { addMultipleToQueue, currentSong, addToQueue, queue, playSongsNow } = useQueue()
    const { toast } = useToast()
    const { userId } = useAuth();
    const [isEditing, setIsEditing] = useState(false)
    const [editedDescription, setEditedDescription] = useState("")
    const [editedImage, setEditedImage] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const playNow = (songs: Song[]) => {
        playSongsNow(songs);
    }
    const addPlaylistToQueue = (songs: Song[]) => {
        if (songs.length === 0) return;
        if (queue.length === 0) return playNow(songs);
        addMultipleToQueue(songs);
        toast({
            title: "Added to Queue",
            description: `${songs.length} songs added to queue`,
        });
    }

    // Fetch playlist data from Convex
    const playlist = useQuery(api.playlists.getPlaylistSongs, { _id: id as Id<"playlists"> });
    const updatePlaylist = useMutation(api.playlists.updatePlaylist);
    const isLoading = playlist === undefined;
    const isOwner = playlist?.userId === userId;
    // console.log(playlist)
    if (isLoading) return <PlaylistSkeleton />
    const handleEditClick = async () => {
        if (isEditing) {
            // Save changes
            updatePlaylist({
                _id: id as Id<"playlists">,
                description: editedDescription,
                image: editedImage ? await toBase64(editedImage) : '',
            }).then(() => {
                toast({ title: "Playlist updated successfully" })
                setIsEditing(false)
            })
        } else {
            // Enter edit mode
            setEditedDescription(playlist?.description || "")
            setIsEditing(true)
        }
    }
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 1 * 1024 * 1024) { // 1 MB in bytes
                toast({
                    title: "File too large",
                    description: "Please upload an image smaller than 1 MB.",
                    variant: "destructive",
                })
                return
            }
            setEditedImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const toBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }
    return (
        <main className="min-h-screen bg-gradient-to-b from-background/10 to-background">
            <SidebarLayout>
                <div>
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg p-4">
                        <SearchBar />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="px-6 pb-24"
                    >
                        {/* Playlist Header */}
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-8">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative aspect-square w-full md:w-64 lg:w-80 shadow-xl rounded-lg overflow-hidden"
                            >
                                {!isEditing && <Image
                                    src={playlist?.image}
                                    alt={playlist?.name || "Playlist"}
                                    fallbackSrc={"/placeholder.jpg"}
                                    referrerPolicy='no-referrer'
                                    className="object-cover w-full h-full"
                                    removeWrapper
                                />}
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Label htmlFor="image-upload" className="cursor-pointer">
                                            <Edit className="w-6 h-6 text-white" />
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                max="1"
                                                onChange={handleImageChange}
                                            />
                                        </Label>
                                    </div>
                                )}
                            </motion.div>

                            <div className="space-y-4 flex-1">
                                <GradualSpacing
                                    className="text-4xl md:text-5xl font-bold text-white"
                                    text={playlist?.name || "Untitled Playlist"}
                                />
                                {isEditing ? (
                                    <Input
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        placeholder="Enter playlist description"
                                    />
                                ) : (
                                    <p className="text-muted-foreground line-clamp-3">
                                        {playlist?.description || "No description"}
                                    </p>
                                )}

                                <div className="flex gap-4">
                                    <Button
                                        size="lg"
                                        className="gap-2 bg-primary/90 hover:bg-primary"
                                        onClick={() => playlist?.songs && playNow(playlist.songs)}
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        Play Now
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="gap-2"
                                        onClick={() => playlist?.songs && addPlaylistToQueue(playlist.songs)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add to Queue
                                    </Button>
                                    {isOwner && (
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            className="gap-2"
                                            onClick={handleEditClick}
                                        >
                                            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                                            {isEditing ? "Save" : "Edit"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Songs List */}
                        {playlist?.songs?.length ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-5">Title</div>
                                    <div className="col-span-4">Album</div>
                                    <div className="col-span-2 flex justify-end">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                </div>

                                {playlist.songs.map((song: Song, index: number) => (
                                    <motion.div
                                        key={song.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div
                                            className={cn(
                                                "grid grid-cols-12 gap-4 px-4 py-2 rounded-lg",
                                                "hover:bg-white/5 transition-colors cursor-pointer",
                                                "group items-center"
                                            )}
                                            onClick={() => addToQueue(song, true)}
                                        >
                                            <div className="col-span-1 text-muted-foreground">
                                                {index + 1}
                                            </div>
                                            <div className="col-span-5 flex items-center gap-4">
                                                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                                    <Image
                                                        src={song?.images?.[0]?.url || "/placeholder.svg"}
                                                        alt={song.title ?? "Unkown song"}
                                                        className="object-cover"
                                                        referrerPolicy='no-referrer'
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-white truncate">{song.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {song?.artist?.map((x) => x.name).join(", ") || "Unknown Artist"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-span-4 text-muted-foreground truncate">
                                                {song.album?.name || "Unknown Album"}
                                            </div>
                                            <div className="col-span-2 text-right text-muted-foreground">
                                                {song.duration?.label || "0:00"}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-96 gap-4"
                            >
                                <ListMusic className="w-16 h-16 text-muted-foreground" />
                                <p className="text-xl text-muted-foreground">
                                    No songs in this playlist
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </SidebarLayout>
            <div className="playerView">{currentSong && <PlayerView />}</div>
        </main>
    )
}

function PlaylistSkeleton() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-background/10 to-background">
            <SidebarLayout>
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg p-4">
                    <SearchBar />
                </div>

                <div className="px-6 pb-24">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-8">
                        <Skeleton className="aspect-square w-full md:w-64 lg:w-80 rounded-lg" />
                        <div className="space-y-4 flex-1 w-full">
                            <Skeleton className="h-12 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="flex gap-4 mt-4">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-40" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            </SidebarLayout>
        </main>
    )
}