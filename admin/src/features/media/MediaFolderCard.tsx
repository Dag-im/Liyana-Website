import { Edit, Trash2, Calendar, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileImage } from '@/components/shared/FileImage'
import { useAuth } from '@/features/auth/useAuth'
import { formatDate } from '@/lib/utils'
import type { MediaFolder } from '@/types/media.types'

type MediaFolderCardProps = {
  folder: MediaFolder
  onEdit: () => void
  onDelete: () => void
}

export function MediaFolderCard({
  folder,
  onEdit,
  onDelete,
}: MediaFolderCardProps) {
  const authQuery = useAuth()
  const user = authQuery.data
  const canManage = user?.role === 'ADMIN' || user?.role === 'COMMUNICATION'

  return (
    <Card className="group relative h-full overflow-hidden transition-all hover:shadow-sm">
      <Link to={`/media/${folder.id}`} className="block h-full">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <FileImage
            path={folder.coverImage}
            alt={folder.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                No Preview
              </div>
            }
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 shadow-sm backdrop-blur-sm">
              {folder.tag.name}
            </Badge>
          </div>
          
          {canManage && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onEdit()
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="line-clamp-1 font-semibold text-lg">{folder.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {folder.description || 'No description'}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>{folder.mediaCount} items</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Updated {formatDate(folder.lastUpdated)}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
