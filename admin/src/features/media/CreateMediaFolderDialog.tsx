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
import { useCreateMediaFolder } from './useMedia'
import { uploadFolderCover } from '@/api/media.api'

type CreateMediaFolderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateMediaFolderDialog({
  open,
  onOpenChange,
}: CreateMediaFolderDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tagId, setTagId] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

  const { data: tags = [] } = useMediaTags()
  const createMutation = useCreateMediaFolder()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
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
          setName('')
          setDescription('')
          setCoverImage('')
          setTagId('')
          setSortOrder('0')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Media Folder</DialogTitle>
          <DialogDescription>
            Organize your media items into a new folder.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Name</Label>
                <Input
                  id="folder-name"
                  placeholder="e.g. CSR Event 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tag">Tag</Label>
                  <Link
                    to="/media/tags"
                    className="text-xs text-primary hover:underline flex items-center"
                  >
                    <Plus className="mr-1 h-3 w-3" /> New Tag
                  </Link>
                </div>
                <Select value={tagId} onValueChange={(val) => setTagId(val || '')} required>
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
                  label="Upload Folder Cover"
                />
                {!coverImage && (
                  <p className="text-xs text-destructive">Cover image is required</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-desc">Description</Label>
            <Textarea
              id="folder-desc"
              placeholder="Tell something about this collection..."
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
              disabled={createMutation.isPending || !coverImage}
            >
              Create Folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
