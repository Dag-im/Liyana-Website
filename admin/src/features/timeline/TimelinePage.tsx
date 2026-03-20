import { useMemo, useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import type { TimelineCategory, TimelineItem } from '@/types/timeline.types'
import { useDeleteTimelineItem, useTimelineItems } from './useTimeline'

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

export default function TimelinePage() {
  const { page, perPage, setPage, resetPage } = usePagination()
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

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
            <Button asChild size="icon" variant="ghost">
              <Link state={{ from: '/timeline' }} to={`/timeline/${row.original.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
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
        <Button asChild>
          <Link state={{ from: '/timeline' }} to="/timeline/new">
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
          </Link>
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
