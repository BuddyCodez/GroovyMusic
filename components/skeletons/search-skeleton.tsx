import { Skeleton } from "@/components/ui/skeleton"

export function TopResultSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-card/30 backdrop-blur-sm">
      <Skeleton className="h-[200px] w-[200px] rounded-lg" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  )
}

export function SongRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-2">
      <Skeleton className="h-12 w-12 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  )
}

export function AlbumCardSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  )
}
