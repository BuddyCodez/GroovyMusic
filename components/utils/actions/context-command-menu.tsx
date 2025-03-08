import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useQueue } from "@/providers/queue-provider";
import { Song } from "@/types/song";
import React from 'react'
interface ContextMenuProps {
    item: Song;
    onClick?: (song: Song, force?: boolean) => void;
    onOpen?: (song: Song) => void;
    children: React.ReactNode;
}
const ContextCommandMenu = ({ item, onClick, onOpen, children }: ContextMenuProps) => {
    const { addToQueue } = useQueue();
    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    {children}
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => onClick?.(item, true)}>
                        Play
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => addToQueue(item)}>
                        Add to queue
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            onOpen?.(item);
                        }}
                    >Add to Playlist</ContextMenuItem>
                    <ContextMenuItem>Like song</ContextMenuItem>
                    <ContextMenuItem>Share</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </>
    )
}

export default ContextCommandMenu;