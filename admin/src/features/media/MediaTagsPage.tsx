import { Plus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useMediaTags,
  useCreateMediaTag,
  useUpdateMediaTag,
  useDeleteMediaTag,
} from './useMediaTags'
import { slugify } from '@/lib/media-utils'
import type { MediaTag } from '@/types/media.types'

export default function MediaTagsPage() {
  const { data: tags = [], isLoading, isError, refetch } = useMediaTags()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editTag, setEditTag] = useState<MediaTag | null>(null)
  const [deleteTag, setDeleteTag] = useState<MediaTag | null>(null)

  const deleteMutation = useDeleteMediaTag()

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
      cell: ({ row }: { row: { original: MediaTag } }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {row.original.slug}
        </code>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: { original: MediaTag } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditTag(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTag(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="container py-6">
      <PageHeader heading="Media Tags" text="Manage tags for categorizing media folders">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Tag
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={tags}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />

      <CreateMediaTagDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {editTag && (
        <EditMediaTagDialog
          tag={editTag}
          open={!!editTag}
          onOpenChange={(open) => !open && setEditTag(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTag}
        onClose={() => setDeleteTag(null)}
        onConfirm={() => {
          if (deleteTag) {
            deleteMutation.mutate(deleteTag.id, {
              onSuccess: () => setDeleteTag(null),
            })
          }
        }}
        title="Delete Media Tag"
        description={`Are you sure you want to delete "${deleteTag?.name}"? This action cannot be undone and will fail if folders are assigned to this tag.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

function CreateMediaTagDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [name, setName] = useState('')
  const createMutation = useCreateMediaTag()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      { name },
      {
        onSuccess: () => {
          onOpenChange(false)
          setName('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Media Tag</DialogTitle>
          <DialogDescription>
            Create a new tag to categorize your media folders.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. CSR, Hospital Events"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {name && (
              <p className="text-xs text-muted-foreground">
                Slug preview:{' '}
                <span className="font-mono">{slugify(name)}</span>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Create Tag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditMediaTagDialog({
  tag,
  open,
  onOpenChange,
}: {
  tag: MediaTag
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [name, setName] = useState(tag.name)
  const updateMutation = useUpdateMediaTag()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(
      { id: tag.id, dto: { name } },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Media Tag</DialogTitle>
          <DialogDescription>
            Update the name of the media tag.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Slug preview:{' '}
              <span className="font-mono">{slugify(name)}</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              Update Tag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
