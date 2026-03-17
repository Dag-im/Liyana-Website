import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/shared/FileUpload'
import { useMediaTags } from './useMediaTags'
import { useUpdateMediaFolder } from './useMedia'
import { uploadFolderCover } from '@/api/media.api'
import type { MediaFolder } from '@/types/media.types'

type EditMediaFolderDialogProps = {
  folder: MediaFolder
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditMediaFolderDialog({
  folder,
  open,
  onOpenChange,
}: EditMediaFolderDialogProps) {
  const [name, setName] = useState(folder.name)
  const [description, setDescription] = useState(folder.description)
  const [coverImage, setCoverImage] = useState(folder.coverImage)
  const [tagId, setTagId] = useState(folder.tagId)
  const [sortOrder, setSortOrder] = useState(folder.sortOrder.toString())

  const { data: tags = [] } = useMediaTags()
  const updateMutation = useUpdateMediaFolder(folder.id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(
      {
        name,
        description,
        coverImage,
        tagId,
        sortOrder: parseInt(sortOrder) || 0,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Media Folder</DialogTitle>
          <DialogDescription>
            Update your media folder information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-folder-name">Name</Label>
                <Input
                  id="edit-folder-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-tag">Tag</Label>
                  <Link
                    to="/media/tags"
                    className="text-xs text-primary hover:underline flex items-center"
                  >
                    <Plus className="mr-1 h-3 w-3" /> New Tag
                  </Link>
                </div>
                <Select value={tagId} onValueChange={(val) => setTagId(val || '')} required>
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
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <FileUpload
                  onUpload={uploadFolderCover}
                  onSuccess={setCoverImage}
                  currentPath={coverImage}
                  label="Change Folder Cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-folder-desc">Description</Label>
            <Textarea
              id="edit-folder-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending || !coverImage}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
