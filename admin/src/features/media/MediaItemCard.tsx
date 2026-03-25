import { Play, Edit, Trash2, Image as ImageIcon, Video } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileImage } from '@/components/shared/FileImage'
import { useAuth } from '@/features/auth/useAuth'
import { getYouTubeThumbnail } from '@/lib/media-utils'
import type { MediaItem } from '@/types/media.types'

type MediaItemCardProps = {
  item: MediaItem
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}

export function MediaItemCard({
  item,
  onClick,
  onEdit,
  onDelete,
}: MediaItemCardProps) {
  const authQuery = useAuth()
  const user = authQuery.data
  const canManage = user?.role === 'ADMIN' || user?.role === 'COMMUNICATION'

  const thumbnail =
    item.type === 'video'
      ? item.thumbnail || getYouTubeThumbnail(item.url)
      : item.url

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-muted shadow-sm transition-all hover:shadow-sm"
      onClick={onClick}
    >
      <div className="relative aspect-square w-full">
        {thumbnail ? (
          <FileImage
            path={thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                {item.type === 'video' ? <Video className="h-10 w-10 opacity-20" /> : <ImageIcon className="h-10 w-10 opacity-20" />}
              </div>
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            {item.type === 'video' ? <Video className="h-10 w-10 opacity-20" /> : <ImageIcon className="h-10 w-10 opacity-20" />}
          </div>
        )}

        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white shadow-sm backdrop-blur-sm transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </div>
        )}

        <div className="absolute top-2 left-2">
          <Badge
            variant="secondary"
            className="bg-white/90 shadow-sm backdrop-blur-sm"
          >
            {item.type === 'image' ? (
              <ImageIcon className="mr-1 h-3 w-3" />
            ) : (
              <Video className="mr-1 h-3 w-3" />
            )}
            {item.type === 'image' ? 'Image' : 'Video'}
          </Badge>
        </div>

        {canManage && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 shadow-sm backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 shadow-sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white p-3 dark:bg-card">
        <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
      </div>
    </div>
  )
}
