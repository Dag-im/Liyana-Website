import { useState, useEffect } from 'react'
import { Image as ImageIcon, Video, Youtube, Upload } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUpload } from '@/components/shared/FileUpload'
import { useUpdateMediaItem } from './useMedia'
import { uploadMediaItem } from '@/api/media.api'
import { isYouTubeUrl, getYouTubeThumbnail, detectMediaType } from '@/lib/media-utils'
import type { MediaItem } from '@/types/media.types'

type EditMediaItemDialogProps = {
  item: MediaItem
  open: boolean
  onClose: () => void
  folderId: string
}

export default function EditMediaItemDialog({
  item,
  open,
  onClose,
  folderId,
}: EditMediaItemDialogProps) {
  const [title, setTitle] = useState(item.title)
  const [mode, setMode] = useState<'upload' | 'youtube'>(
    isYouTubeUrl(item.url) ? 'youtube' : 'upload'
  )
  const [url, setUrl] = useState(item.url)
  const [sortOrder, setSortOrder] = useState(item.sortOrder.toString())
  const [detectedType, setDetectedType] = useState<'image' | 'video'>(item.type)

  const updateMutation = useUpdateMediaItem(folderId, item.id)

  useEffect(() => {
    setDetectedType(detectMediaType(url))
  }, [url])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'youtube' && !isYouTubeUrl(url)) {
      return
    }

    updateMutation.mutate(
      {
        title,
        url,
        sortOrder: parseInt(sortOrder) || 0,
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  const youtubeThumbnail = mode === 'youtube' ? getYouTubeThumbnail(url) : null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Media Item</DialogTitle>
          <DialogDescription>
            Update your media item information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-item-title">Title</Label>
            <Input
              id="edit-item-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Media Content</Label>
            <Tabs value={mode} onValueChange={(v) => {
              setMode(v as 'upload' | 'youtube')
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Upload Image
                </TabsTrigger>
                <TabsTrigger value="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" /> YouTube URL
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {mode === 'upload' ? (
              <FileUpload
                onUpload={(file) => uploadMediaItem(folderId, file)}
                onSuccess={setUrl}
                currentPath={url}
                label="Change image"
              />
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={url && !isYouTubeUrl(url) ? 'border-destructive' : ''}
                  />
                  {url && !isYouTubeUrl(url) && (
                    <p className="text-xs text-destructive">Invalid YouTube URL</p>
                  )}
                </div>
                
                {youtubeThumbnail && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted shadow-sm">
                    <img
                      src={youtubeThumbnail}
                      alt="YouTube Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white">
                        <Youtube className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1 mr-4">
              <Label htmlFor="edit-item-sort">Sort Order</Label>
              <Input
                id="edit-item-sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <Label>Current Type</Label>
              <Badge variant="secondary" className="h-10 px-4 capitalize">
                {detectedType === 'image' ? (
                  <ImageIcon className="mr-2 h-4 w-4" />
                ) : (
                  <Video className="mr-2 h-4 w-4" />
                )}
                {detectedType}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                updateMutation.isPending || 
                !url || 
                (mode === 'youtube' && !isYouTubeUrl(url))
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
