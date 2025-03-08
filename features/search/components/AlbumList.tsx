"use client"

import type { Album } from "@/types/song"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlbumListProps {
  albums: Album[] | null
}

export default function AlbumList({ albums }: AlbumListProps) {
  if (!albums) return null

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
      {albums.map((album, index) => (
        <motion.div
          key={album.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="group relative overflow-hidden transition-all hover:bg-card/60">
            <CardContent className="p-4">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                <Image
                  src={album.images?.[0]?.url || "/placeholder.svg"}
                  alt={album.title || "Album"}
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="truncate text-sm font-medium text-white">{album.title}</h3>
                <p className="truncate text-xs text-muted-foreground">{album.artist}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

