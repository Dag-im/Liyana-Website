import { ArrowLeft, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import Pagination from '@/components/shared/Pagination'
import EmptyState from '@/components/shared/EmptyState'
import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { FileImage } from '@/components/shared/FileImage'
import { useMediaFolder, useMediaItems, useDeleteMediaItem } from './useMedia'
import { MediaItemCard } from './MediaItemCard'
import { MediaLightbox } from './MediaLightbox'
import type { MediaItem, MediaItemType } from '@/types/media.types'
import { useDebounce } from '@/hooks/useDebounce'

export default function MediaFolderDetailPage() {
  const { folderId = '' } = useParams()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType] = useState<MediaItemType | 'ALL'>('ALL')
  const navigate = useNavigate()
  const debouncedSearch = useDebounce(search, 500)

  const { data: folder, isLoading: folderLoading, isError: folderError } = useMediaFolder(folderId)
  const {
    data: items,
    isLoading: itemsLoading,
    isError: itemsError,
    refetch: refetchItems,
  } = useMediaItems(folderId, {
    page,
    perPage: 24,
    search: debouncedSearch,
    type: type === 'ALL' ? undefined : type,
  })

  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)

  const deleteMutation = useDeleteMediaItem(folderId)

  if (folderError || itemsError) return <ErrorState onRetry={refetchItems} />

  const handlePrev = () => {
    if (selectedItemIndex !== null && selectedItemIndex > 0) {
      setSelectedItemIndex(selectedItemIndex - 1)
    }
  }

  const handleNext = () => {
    if (items && selectedItemIndex !== null && selectedItemIndex < items.data.length - 1) {
      setSelectedItemIndex(selectedItemIndex + 1)
    }
  }

  return (
    <div className="container py-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/media">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
        </Link>
      </Button>

      {folderLoading ? (
        <div className="flex h-20 items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ) : (
        folder && (
          <div className="mb-8 flex flex-col gap-6 sm:flex-row">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
              <FileImage
                path={folder.coverImage}
                alt={folder.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{folder.name}</h1>
                <Badge variant="outline" className="text-sm font-normal">
                  {folder.tag.name}
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                {folder.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{folder.mediaCount} Media Items</span>
                <span>•</span>
                <Button 
                  asChild
                  size="sm"
                >
                  <Link state={{ from: `/media/${folderId}` }} to={`/media/${folderId}/items/new`}>
                    <Plus className="mr-2 h-4 w-4" /> Add Media
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={type}
          onValueChange={(val) => setType(val as MediaItemType | 'ALL')}
        >
          <TabsList>
            <TabsTrigger value="ALL">All Items</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {itemsLoading ? (
        <div className="flex h-60 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !items || items.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.data.map((item, index) => (
              <MediaItemCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItemIndex(index)}
                onEdit={() =>
                  navigate(`/media/${folderId}/items/${item.id}/edit`, {
                    state: { from: `/media/${folderId}` },
                  })
                }
                onDelete={() => setDeleteItem(item)}
              />
            ))}
          </div>

          <Pagination
            page={page}
            perPage={24}
            total={items.total}
            onPageChange={setPage}
          />
        </div>
      )}

      {selectedItemIndex !== null && items && (
        <MediaLightbox
          item={items.data[selectedItemIndex]}
          onClose={() => setSelectedItemIndex(null)}
          onPrev={selectedItemIndex > 0 ? handlePrev : undefined}
          onNext={
            selectedItemIndex < items.data.length - 1 ? handleNext : undefined
          }
        />
      )}

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem) {
            deleteMutation.mutate(deleteItem.id, {
              onSuccess: () => setDeleteItem(null),
            })
          }
        }}
        title="Delete Media Item"
        description={`Are you sure you want to delete "${deleteItem?.title}"? Associated files will be permanently removed.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
