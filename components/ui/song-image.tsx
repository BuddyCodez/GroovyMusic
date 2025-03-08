'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Image as NextUiImage } from "@heroui/react";

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

const isGoogleUrl = (url: string) => {
  return url.includes('googleusercontent.com') || url.includes('ggpht.com')
}

const SongImage = React.memo(function SongImage({
  images,
  alt,
  width = 300,
  height = 300,
  className,
  isBlurred = false,
  shadow = 'none',
}: SongImageProps) {
  const imageUrl = React.useMemo(() => {
    const highestQualityImage = images[images.length - 1]
    if (!highestQualityImage) return ''
    
    if (isGoogleUrl(highestQualityImage.url)) {
      const url = new URL(highestQualityImage.url)
      url.searchParams.delete('w')
      url.searchParams.delete('q')
      return url.toString()
    }
    
    return highestQualityImage.url
  }, [images])

  if (!imageUrl) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center rounded-lg',
          'bg-muted/10',
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
        'relative overflow-hidden rounded-lg',
        shadowStyles[shadow],
        className
      )}
      style={{
        width,
        height,
      }}
    >
      <NextUiImage
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'h-full w-full object-cover',
          isBlurred && 'backdrop-blur-xl'
        )}
        referrerPolicy='no-referrer'
        isBlurred={isBlurred}
      />
      {isBlurred && (
        <div 
          className="absolute inset-0 bg-background/10 backdrop-blur-xl pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  )
})

SongImage.displayName = 'SongImage'

export { SongImage }

