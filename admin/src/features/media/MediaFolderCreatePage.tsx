import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { uploadFolderCover } from '@/api/media.api'
import { FileUpload } from '@/components/shared/FileUpload'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateMediaFolder } from './useMedia'
import { useMediaTags } from './useMediaTags'

export default function MediaFolderCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: tags = [] } = useMediaTags()
  const createMutation = useCreateMediaFolder()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tagId, setTagId] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/media'

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createMutation.mutate(
      {
        name,
        description,
        coverImage,
        tagId,
        sortOrder: parseInt(sortOrder, 10) || 0,
      },
      {
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Create Media Folder" text="Organize your media items into a new folder.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folder-name">Name</Label>
                  <Input
                    id="folder-name"
                    placeholder="e.g. CSR Event 2024"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tag">Tag</Label>
                    <Link
                      className="flex items-center text-xs text-primary hover:underline"
                      state={{ from: '/media/new' }}
                      to="/media/tags/new"
                    >
                      <Plus className="mr-1 h-3 w-3" /> New Tag
                    </Link>
                  </div>
                  <Select value={tagId} onValueChange={(value) => setTagId(value ?? '')}>
                    <SelectTrigger id="tag">
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort-order">Sort Order</Label>
                  <Input
                    id="sort-order"
                    type="number"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <FileUpload
                    currentPath={coverImage}
                    label="Upload Folder Cover"
                    onSuccess={setCoverImage}
                    onUpload={uploadFolderCover}
                  />
                  {!coverImage ? (
                    <p className="text-xs text-destructive">Cover image is required</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="folder-desc">Description</Label>
              <Textarea
                className="resize-none"
                id="folder-desc"
                placeholder="Tell something about this collection..."
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button disabled={createMutation.isPending || !coverImage || !tagId} type="submit">
                Create Folder
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
