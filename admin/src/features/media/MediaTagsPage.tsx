import { Plus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  useMediaTags,
  useDeleteMediaTag,
} from './useMediaTags'
import type { MediaTag } from '@/types/media.types'

export default function MediaTagsPage() {
  const { data: tags = [], isLoading, isError, refetch } = useMediaTags()
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
            asChild
            variant="ghost"
            size="icon"
          >
            <Link
              state={{ from: '/media/tags' }}
              to={`/media/tags/${row.original.id}/edit`}
            >
              <Edit className="h-4 w-4" />
            </Link>
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
        <Button asChild>
          <Link state={{ from: '/media/tags' }} to="/media/tags/new">
          <Plus className="mr-2 h-4 w-4" /> Add Tag
          </Link>
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={tags}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />

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
