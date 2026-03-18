import { useMemo, useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'

import { timelineApi } from '@/api/timeline.api'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import { FileUpload } from '@/components/shared/FileUpload'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { Badge } from '@/components/ui/badge'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import type { TimelineCategory, TimelineItem } from '@/types/timeline.types'
import {
  useCreateTimelineItem,
  useDeleteTimelineItem,
  useTimelineItems,
  useUpdateTimelineItem,
} from './useTimeline'

type TimelineFormData = {
  year: string
  title: string
  description: string
  location: string
  achievement: string
  image: string
  category: TimelineCategory | 'none'
  sortOrder: string
}

const defaultFormData: TimelineFormData = {
  year: '',
  title: '',
  description: '',
  location: '',
  achievement: '',
  image: '',
  category: 'none',
  sortOrder: '0',
}

const categoryLabel: Record<TimelineCategory, string> = {
  milestone: 'Milestone',
  achievement: 'Achievement',
  expansion: 'Expansion',
  innovation: 'Innovation',
}

const categoryClass: Record<TimelineCategory, string> = {
  milestone: 'bg-purple-100 text-purple-800 border-purple-200',
  achievement: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  expansion: 'bg-green-100 text-green-800 border-green-200',
  innovation: 'bg-orange-100 text-orange-800 border-orange-200',
}

function toDto(values: TimelineFormData) {
  return {
    year: values.year,
    title: values.title,
    description: values.description,
    location: values.location.trim() ? values.location : null,
    achievement: values.achievement.trim() ? values.achievement : null,
    image: values.image.trim() ? values.image : null,
    category: values.category === 'none' ? null : values.category,
    sortOrder: Number(values.sortOrder) || 0,
  }
}

function toFormData(item: TimelineItem): TimelineFormData {
  return {
    year: item.year,
    title: item.title,
    description: item.description,
    location: item.location ?? '',
    achievement: item.achievement ?? '',
    image: item.image ?? '',
    category: item.category ?? 'none',
    sortOrder: String(item.sortOrder),
  }
}

export default function TimelinePage() {
  const { page, perPage, setPage, resetPage } = usePagination()
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [createOpen, setCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<TimelineItem | null>(null)

  const debouncedSearch = useDebounce(search, 400)
  const debouncedYear = useDebounce(yearFilter, 400)

  const timelineQuery = useTimelineItems({
    page,
    perPage,
    search: debouncedSearch || undefined,
    year: debouncedYear || undefined,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  })

  const deleteMutation = useDeleteTimelineItem()

  const columns = useMemo(
    () => [
      {
        header: 'Year',
        id: 'year',
        cell: ({ row }: { row: { original: TimelineItem } }) => {
          const category = row.original.category
          return (
            <Badge className={category ? categoryClass[category] : undefined}>
              <span className="font-semibold">{row.original.year}</span>
            </Badge>
          )
        },
      },
      {
        header: 'Title',
        id: 'title',
        cell: ({ row }: { row: { original: TimelineItem } }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">{row.original.location || '—'}</p>
          </div>
        ),
      },
      {
        header: 'Category',
        id: 'category',
        cell: ({ row }: { row: { original: TimelineItem } }) => {
          const category = row.original.category
          if (!category) {
            return '—'
          }

          return <Badge className={categoryClass[category]}>{categoryLabel[category]}</Badge>
        },
      },
      {
        header: 'Achievement',
        id: 'achievement',
        cell: ({ row }: { row: { original: TimelineItem } }) => (
          <span className="line-clamp-1 max-w-[220px] text-sm text-muted-foreground">
            {row.original.achievement || '—'}
          </span>
        ),
      },
      {
        header: 'Sort Order',
        accessorKey: 'sortOrder',
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }: { row: { original: TimelineItem } }) => (
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => setEditingItem(row.original)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteItem(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader heading="Timeline" text="Manage company milestones and timeline entries.">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Search timeline entries..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            resetPage()
          }}
        />

        <Input
          placeholder="Filter by year..."
          value={yearFilter}
          onChange={(event) => {
            setYearFilter(event.target.value)
            resetPage()
          }}
        />

        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value ?? 'all')
            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="milestone">Milestone</SelectItem>
            <SelectItem value="achievement">Achievement</SelectItem>
            <SelectItem value="expansion">Expansion</SelectItem>
            <SelectItem value="innovation">Innovation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-white">
        <DataTable
          columns={columns}
          data={timelineQuery.data?.data ?? []}
          isLoading={timelineQuery.isLoading}
          isError={timelineQuery.isError}
          onRetry={() => timelineQuery.refetch()}
        />
        <Pagination
          page={page}
          perPage={perPage}
          total={timelineQuery.data?.total ?? 0}
          onPageChange={setPage}
        />
      </div>

      <CreateTimelineDialog open={createOpen} onOpenChange={setCreateOpen} />

      {editingItem ? (
        <EditTimelineDialog
          item={editingItem}
          open={Boolean(editingItem)}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (!deleteItem) return
          deleteMutation.mutate(deleteItem.id, {
            onSuccess: () => setDeleteItem(null),
          })
        }}
        title="Delete Timeline Entry"
        description="Are you sure you want to delete this timeline entry? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

function CreateTimelineDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createMutation = useCreateTimelineItem()
  const [formData, setFormData] = useState<TimelineFormData>(defaultFormData)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createMutation.mutate(toDto(formData), {
      onSuccess: () => {
        onOpenChange(false)
        setFormData(defaultFormData)
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) {
          setFormData(defaultFormData)
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Timeline Entry</DialogTitle>
          <DialogDescription>Add a new timeline milestone.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timeline-year">Year</Label>
              <Input
                id="timeline-year"
                required
                maxLength={4}
                value={formData.year}
                onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline-sort">Sort Order</Label>
              <Input
                id="timeline-sort"
                type="number"
                min={0}
                value={formData.sortOrder}
                onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="timeline-title">Title</Label>
              <Input
                id="timeline-title"
                required
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="timeline-description">Description</Label>
              <Textarea
                id="timeline-description"
                required
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline-location">Location (optional)</Label>
              <Input
                id="timeline-location"
                value={formData.location}
                onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline-achievement">Achievement (optional)</Label>
              <Input
                id="timeline-achievement"
                value={formData.achievement}
                onChange={(event) => setFormData((prev) => ({ ...prev, achievement: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  const nextValue = value ?? 'none'
                  setFormData((prev) => ({ ...prev, category: nextValue as TimelineCategory | 'none' }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="expansion">Expansion</SelectItem>
                  <SelectItem value="innovation">Innovation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Image (optional)</Label>
              <FileUpload
                onUpload={timelineApi.uploadTimelineImage}
                onSuccess={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                currentPath={formData.image}
                label="Upload timeline image"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Entry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditTimelineDialog({
  item,
  open,
  onOpenChange,
}: {
  item: TimelineItem
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const updateMutation = useUpdateTimelineItem()
  const [formData, setFormData] = useState<TimelineFormData>(() => toFormData(item))

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateMutation.mutate(
      {
        id: item.id,
        dto: toDto(formData),
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (nextOpen) {
          setFormData(toFormData(item))
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Timeline Entry</DialogTitle>
          <DialogDescription>Update timeline entry details.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-timeline-year">Year</Label>
              <Input
                id="edit-timeline-year"
                required
                maxLength={4}
                value={formData.year}
                onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-timeline-sort">Sort Order</Label>
              <Input
                id="edit-timeline-sort"
                type="number"
                min={0}
                value={formData.sortOrder}
                onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-timeline-title">Title</Label>
              <Input
                id="edit-timeline-title"
                required
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-timeline-description">Description</Label>
              <Textarea
                id="edit-timeline-description"
                required
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-timeline-location">Location (optional)</Label>
              <Input
                id="edit-timeline-location"
                value={formData.location}
                onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-timeline-achievement">Achievement (optional)</Label>
              <Input
                id="edit-timeline-achievement"
                value={formData.achievement}
                onChange={(event) => setFormData((prev) => ({ ...prev, achievement: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  const nextValue = value ?? 'none'
                  setFormData((prev) => ({ ...prev, category: nextValue as TimelineCategory | 'none' }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="expansion">Expansion</SelectItem>
                  <SelectItem value="innovation">Innovation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Image (optional)</Label>
              <FileUpload
                onUpload={timelineApi.uploadTimelineImage}
                onSuccess={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                currentPath={formData.image}
                label="Replace timeline image"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
