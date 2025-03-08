import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useQueue } from "@/providers/queue-provider";
import { filterHighQualityImage } from "@/features/search/components/MusicList";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import discIcon from "@/public/disc-icon.gif";
import { Image, VisuallyHidden } from "@heroui/react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOpenPlaylist } from "../hooks/use-open-playlist";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Select } from "@/components/utils/select";
import { useAuth } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import React from "react";
import { useConvexClient } from "@/hooks/use-convex-client";


export const PlaylistSheet = () => {
    const { isOpen, onClose, song } = useOpenPlaylist();
    const { toast } = useToast();
    const { userId } = useAuth();
    const [value, setValue] = React.useState("");
    const client = useConvexClient();
    const playlists = useQuery(api.playlists.get as any, { userId: userId ?? "" });
    const playlistOptions = (playlists ?? []).map((data: any) => ({
        label: data.name,
        value: data._id,
    }));
    const onCreatePlaylist = (name: string) => client.mutation(api.playlists.createOrUpdate as any, {
        name,
        userId,
    });
    const handleSubmit = () => {
        console.log(value);
        if (!value) {
            toast({
                title: "Please select a playlist",
                description: "You need to select a playlist to add the song to.",
                variant: 'destructive'
            })
            return;
        }
        client.mutation(api.playlists.add as any, {
            _id: value,
            song: song,
        }).then(() => {
            onClose();
            toast({
                title: "Playlist:",
                description: `${song?.title} has been added to ${playlistOptions.find((playlist: { value: string }) => playlist.value === value)?.label}`,
            })
        });
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-2xl h-[70vh] flex flex-col px-2 py-1"
                
            >
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Playlist</DialogTitle>
                    </VisuallyHidden>
                </DialogHeader>
                <div className=" flex gap-2 items-center justify-between  w-full">
                    <div className="px-3">
                        <Label className="text-sm">Playlist</Label>
                    </div>
                    <div className="flex gap-2 items-center ">
                        <Button
                            variant="outline"
                            className="cursor-pointer px-2"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>

                <div className="flex-1 max-h-[400px] px-3 py-4 flex flex-col gap-1 ">
                    {playlists == null ? (
                        <h1>Uuh, you dont have any playlists.</h1>
                    ) :
                        <Select
                            placeholder="Select a playlist"
                            options={playlistOptions}
                            onChange={(selected) => {
                                setValue(selected as string);
                            }}
                            value={value}
                            onCreate={onCreatePlaylist}
                        />
                    }
                    <Button variant="outline" className="mt-4" onClick={handleSubmit}>
                        Add to playlist
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
const PlaylistPicker = () => {

}
