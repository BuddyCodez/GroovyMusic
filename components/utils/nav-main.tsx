"use client";

import * as React from 'react'
import { ChevronRight, Home, History, TrendingUp, Plus, ListMusic, TypeIcon as type, LucideIcon, Edit2Icon, EditIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { usePlaylists } from "@/hooks/use-playlists"

const mainNavItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    absolute: true
  },
  {
    title: "Trending",
    url: "/trending",
    icon: TrendingUp,
    absolute: true
  },
  {
    title: "History",
    url: "/history",
    icon: History,
    absolute: true
  }
]
import { SignIn, SignInButton, useAuth } from "@clerk/nextjs";
import { Label } from '../ui/label';

import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { useQuery } from 'convex/react';

export function NavMain() {
  const [data, setData] = React.useState<{
    name?: string,
    id?: string
  }>({
    name: '',
    id: ''
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  // TODO: Replace with actual user ID from your auth system

  const { userId, isSignedIn } = useAuth();


  // const { playlists, createPlaylist } = usePlaylists(userId ?? "")
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const handleCreatePlaylist = async () => {
    if (data.name?.trim()) {
      const playlist = await client.mutation(api.playlists.createOrUpdate as any, {
        name: data.name,
        userId
      });
    }
    setIsDialogOpen(false);
  }
  const handelUpdatePlaylist = async () => {
    if (data.name?.trim()) {
      if (!userId) return console.error("User ID is required to create a playlist")
      const playlist = await client.mutation(api.playlists.createOrUpdate as any, {
        _id: data.id,
        name: data.name,
        userId
      })
      setData({ name: '', id: '' });
      setIsDialogOpen(false);
    }
  }
  const playlists = useQuery(api.playlists.get as any, { userId }) ?? []
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between">
          <span>Your Playlists</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Create playlist</span>
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby='dialog-description' >
              <DialogHeader>
                <DialogTitle>
                  {data?.id ? 'Edit Playlist' : 'Create Playlist'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {!isSignedIn ? (
                  <div className='space-y-4'>
                    <Label>Before we proceed you must login.</Label>
                    <SignInButton>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </SignInButton>
                  </div>
                ) : (
                  <>
                    <Input
                      placeholder="Playlist name"
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          data.id ? handelUpdatePlaylist() : handleCreatePlaylist()
                        }
                      }}
                    />
                    <Button onClick={() => {
                      data.id ? handelUpdatePlaylist() : handleCreatePlaylist()
                    }} className="w-full">
                      {data?.id ? 'Update Playlist' : 'Create Playlist'}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </SidebarGroupLabel>
        <SidebarMenu>
          {playlists?.map((playlist: any) => (
            <SidebarMenuItem key={playlist._id}>
              <SidebarMenuButton asChild>
                <Link href={`/playlist/${playlist.id}`} className='w-full flex items-center justify-between'>
                  <div className="item-data flex gap-2 items-center">
                    <ListMusic className="w-4 h-4" />
                    <span>{playlist.name}</span>
                    {playlist.songCount !== undefined && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {playlist.songCount}
                      </span>
                    )}
                  </div>
                  <div className="editIcon">
                    <EditIcon className='size-3 hover:opacity-45 transition' onClick={(e) => {
                      e.preventDefault();
                      setData({ name: playlist.name, id: playlist._id });
                      setIsDialogOpen(true);
                    }} />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

