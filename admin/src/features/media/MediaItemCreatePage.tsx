import { Image as ImageIcon, Upload, Video, Youtube } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { uploadMediaItem } from '@/api/media.api'
import { FileUpload } from '@/components/shared/FileUpload'
import PageHeader from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { detectMediaType, getYouTubeThumbnail, isYouTubeUrl } from '@/lib/media-utils'
import { useCreateMediaItem } from './useMedia'

export default function MediaItemCreatePage() {
  const { folderId = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const createMutation = useCreateMediaItem(folderId)

  const [title, setTitle] = useState('')
  const [mode, setMode] = useState<'upload' | 'youtube'>('upload')
  const [url, setUrl] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [detectedType, setDetectedType] = useState<'image' | 'video'>('image')

  useEffect(() => {
    setDetectedType(detectMediaType(url))
  }, [url])

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? `/media/${folderId}`

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (mode === 'youtube' && !isYouTubeUrl(url)) return
    createMutation.mutate(
      {
        title,
        url,
        sortOrder: parseInt(sortOrder, 10) || 0,
      },
      {
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  const youtubeThumbnail = mode === 'youtube' ? getYouTubeThumbnail(url) : null

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Add Media Item" text="Upload an image or add a YouTube video.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="item-title">Title</Label>
              <Input
                id="item-title"
                placeholder="e.g. Donation Ceremony"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Media Content</Label>
              <Tabs
                value={mode}
                onValueChange={(value) => {
                  setMode(value as 'upload' | 'youtube')
                  setUrl('')
                }}
              >
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
                  currentPath={url}
                  label="Click to upload image"
                  onSuccess={setUrl}
                  onUpload={(file) => uploadMediaItem(folderId, file)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      className={url && !isYouTubeUrl(url) ? 'border-destructive' : ''}
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                    />
                    {url && !isYouTubeUrl(url) ? (
                      <p className="text-xs text-destructive">Invalid YouTube URL</p>
                    ) : null}
                  </div>

                  {youtubeThumbnail ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-sm">
                      <img
                        alt="YouTube Preview"
                        className="h-full w-full object-cover"
                        src={youtubeThumbnail}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white">
                          <Youtube className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="mr-4 flex-1 space-y-2">
                <Label htmlFor="item-sort">Sort Order</Label>
                <Input
                  id="item-sort"
                  type="number"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                />
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Label>Detected Type</Label>
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

            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button
                disabled={
                  createMutation.isPending || !url || (mode === 'youtube' && !isYouTubeUrl(url))
                }
                type="submit"
              >
                Add Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
