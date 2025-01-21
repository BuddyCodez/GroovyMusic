'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SongImageProps {
  images: { url: string; size: string }[];
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  isBlurred?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
} as const

const customLoader = ({ src }: { src: string }) => {
  // For Google URLs, ensure we're using the original quality
  if (src.includes('googleusercontent.com') || src.includes('ggpht.com')) {
    const url = new URL(src)
    url.searchParams.delete('w')
    url.searchParams.delete('q')
    return url.toString()
  }
  return src
}

const SongImageNext = React.memo(function SongImageNext({
  images,
  alt,
  width = 300,
  height = 300,
  className,
  isBlurred = false,
  shadow = 'none',
}: SongImageProps) {
  const imageUrl = images[images.length - 1]?.url

  if (!imageUrl) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted/10 rounded-lg',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-xs text-muted-foreground">No image</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted/10',
        shadowStyles[shadow],
        isBlurred && [
          'before:absolute before:inset-0 before:backdrop-blur-xl before:bg-background/10 before:z-10',
          'after:absolute after:inset-0 after:backdrop-blur-xl after:bg-background/10 after:z-10',
        ],
        className
      )}
      style={{
        width,
        height,
      }}
    >
      <Image
        loader={customLoader}
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover"
        priority
        unoptimized
      />
    </div>
  )
})

SongImageNext.displayName = 'SongImageNext'

export { SongImageNext }

