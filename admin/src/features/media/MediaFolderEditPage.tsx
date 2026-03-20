import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { uploadFolderCover } from '@/api/media.api'
import ErrorState from '@/components/shared/ErrorState'
import { FileUpload } from '@/components/shared/FileUpload'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
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
import { useMediaFolder, useUpdateMediaFolder } from './useMedia'
import { useMediaTags } from './useMediaTags'

export default function MediaFolderEditPage() {
  const { folderId = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const folderQuery = useMediaFolder(folderId)
  const { data: tags = [] } = useMediaTags()
  const updateMutation = useUpdateMediaFolder(folderId)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tagId, setTagId] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/media'

  useEffect(() => {
    if (!folderQuery.data) return
    setName(folderQuery.data.name)
    setDescription(folderQuery.data.description)
    setCoverImage(folderQuery.data.coverImage)
    setTagId(folderQuery.data.tagId)
    setSortOrder(String(folderQuery.data.sortOrder))
  }, [folderQuery.data])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateMutation.mutate(
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

  if (folderQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (folderQuery.isError || !folderQuery.data) {
    return <ErrorState onRetry={() => folderQuery.refetch()} />
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading={`Edit ${folderQuery.data.name}`} text="Update media folder details.">
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
                  <Label htmlFor="edit-folder-name">Name</Label>
                  <Input
                    id="edit-folder-name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-tag">Tag</Label>
                    <Link
                      className="flex items-center text-xs text-primary hover:underline"
                      state={{ from: `/media/${folderId}/edit` }}
                      to="/media/tags/new"
                    >
                      <Plus className="mr-1 h-3 w-3" /> New Tag
                    </Link>
                  </div>
                  <Select value={tagId} onValueChange={(value) => setTagId(value ?? '')}>
                    <SelectTrigger id="edit-tag">
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
                  <Label htmlFor="edit-sort-order">Sort Order</Label>
                  <Input
                    id="edit-sort-order"
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
                    label="Change Folder Cover"
                    onSuccess={setCoverImage}
                    onUpload={uploadFolderCover}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-folder-desc">Description</Label>
              <Textarea
                className="resize-none"
                id="edit-folder-desc"
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
              <Button disabled={updateMutation.isPending || !coverImage || !tagId} type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
