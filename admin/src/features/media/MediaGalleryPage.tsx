import { Plus, Search, Settings, Tag } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
import type { MediaFolder } from '@/types/media.types'
import { MediaFolderCard } from './MediaFolderCard'
import { useDeleteMediaFolder, useMediaFolders } from './useMedia'
import { useMediaTags } from './useMediaTags'

export default function MediaGalleryPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [tagId, setTagId] = useState<string>('all')
  const navigate = useNavigate()
  const debouncedSearch = useDebounce(search, 500)

  const { data: tags = [] } = useMediaTags()
  const {
    data: folders,
    isLoading,
    isError,
    refetch
  } = useMediaFolders({
    page,
    perPage: 12,
    search: debouncedSearch,
    tagId: tagId === 'all' ? undefined : tagId,
  })

  const [deleteFolder, setDeleteFolder] = useState<MediaFolder | null>(null)

  const deleteMutation = useDeleteMediaFolder()

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Media Gallery"
        text="Manage media folders and their content"
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/media/tags">
              <Settings className="mr-2 h-4 w-4" /> Manage Tags
            </Link>
          </Button>
          <Button asChild>
            <Link state={{ from: '/media' }} to="/media/new">
            <Plus className="mr-2 h-4 w-4" /> Create Folder
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Card className="gap-0 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search folders..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Select value={tagId} onValueChange={(val) => setTagId(val || 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !folders || folders.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {folders.data.map((folder) => (
              <MediaFolderCard
                key={folder.id}
                folder={folder}
                onEdit={() => navigate(`/media/${folder.id}/edit`, { state: { from: '/media' } })}
                onDelete={() => setDeleteFolder(folder)}
              />
            ))}
          </div>

          <Pagination
            page={page}
            perPage={12}
            total={folders.total}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!deleteFolder}
        onClose={() => setDeleteFolder(null)}
        onConfirm={() => {
          if (deleteFolder) {
            deleteMutation.mutate(deleteFolder.id, {
              onSuccess: () => setDeleteFolder(null),
            })
          }
        }}
        title="Delete Media Folder"
        description={`Are you sure you want to delete "${deleteFolder?.name}"? This will soft delete the folder and all its items. Associated image files will be permanently removed.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
