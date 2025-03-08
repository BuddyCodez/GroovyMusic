import { api } from '@/convex/_generated/api';
import { useQuery, useMutation, useConvex } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';
import { SignInButton, useAuth } from '@clerk/nextjs';
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus, ListMusic, EditIcon } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from '../ui/label';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";

type PlaylistDialogData = {
  name: string;
  id?: Id<"playlists">;
}

const NavPlaylistWrapper = () => {
    const [dialogData, setDialogData] = useState<PlaylistDialogData>({ name: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { userId, isSignedIn } = useAuth();
    const convex = useConvex();

    // Query for playlists
    const playlists = useQuery(api.playlists.get, userId ? { userId } : "skip");
    
    // Mutations
    const createOrUpdatePlaylist = useMutation(api.playlists.createOrUpdate);

    const handleSubmitPlaylist = async () => {
        if (!dialogData.name.trim() || !userId) return;
        
        try {
            await createOrUpdatePlaylist({
                ...(dialogData.id && { _id: dialogData.id }),
                name: dialogData.name,
                userId
            });
            setIsDialogOpen(false);
            setDialogData({ name: '' });
        } catch (error) {
            console.error("Failed to save playlist:", error);
        }
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
                <span>Your Playlists</span>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4"
                            aria-label="Create playlist"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {dialogData.id ? 'Edit Playlist' : 'Create Playlist'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {!isSignedIn ? (
                                <div className='space-y-4'>
                                    <Label>Sign in to create playlists</Label>
                                    <SignInButton>
                                        <Button variant="outline" className="w-full">
                                            Sign In
                                        </Button>
                                    </SignInButton>
                                </div>
                            ) : (
                                <>
                                    <Input
                                        placeholder="Playlist name"
                                        value={dialogData.name}
                                        onChange={(e) => setDialogData(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitPlaylist()}
                                    />
                                    <Button 
                                        onClick={handleSubmitPlaylist}
                                        className="w-full"
                                        disabled={!dialogData.name.trim()}
                                    >
                                        {dialogData.id ? 'Save Changes' : 'Create Playlist'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </SidebarGroupLabel>

            <SidebarMenu>
                {playlists === undefined ? (
                    Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full my-1" />
                    ))
                ) : playlists?.length === 0 ? (
                    <div className="text-sm text-muted-foreground px-4">
                        No playlists yet
                    </div>
                ) : (
                    playlists?.map((playlist) => (
                        <SidebarMenuItem key={playlist._id}>
                            <SidebarMenuButton asChild>
                                <Link 
                                    href={`/playlist/${playlist._id}`}
                                    className="w-full flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <ListMusic className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{playlist.name}</span>
                                        <span className="text-xs text-muted-foreground ml-2">
                                            {playlist.songCount}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setDialogData({
                                                name: playlist.name,
                                                id: playlist._id
                                            });
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <EditIcon className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default NavPlaylistWrapper