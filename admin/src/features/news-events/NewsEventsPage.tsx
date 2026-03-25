import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/features/auth/useAuth'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { formatDate, truncate } from '@/lib/utils'
import type { NewsEvent, NewsEventStatus, NewsEventType } from '@/types/news-events.types'
import { Edit, Eye, Trash2 } from 'lucide-react'
import {
  useDeleteNewsEvent,
  useNewsEvents,
  usePublishNewsEvent,
  useUnpublishNewsEvent,
} from './useNewsEvents'
import NewsEventStatusBadge from './components/NewsEventStatusBadge'

type StatusFilter = 'ALL' | NewsEventStatus

type Props = {
  type: NewsEventType
  basePath: '/news' | '/events'
  title: string
}

export default function NewsEventsPage({ type, basePath, title }: Props) {
  const location = useLocation()
  const authQuery = useAuth()
  const userRole = authQuery.data?.role
  const isEditor = userRole === 'ADMIN' || userRole === 'COMMUNICATION'
  const isAdmin = userRole === 'ADMIN'

  const { page, perPage, setPage, resetPage, setPerPage } = usePagination()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const query = useNewsEvents({
    page,
    perPage,
    search: debouncedSearch || undefined,
    type,
    status: status === 'ALL' ? undefined : status,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  const publishMutation = usePublishNewsEvent()
  const unpublishMutation = useUnpublishNewsEvent()
  const deleteMutation = useDeleteNewsEvent()

  const renderActions = (entry: NewsEvent) => {
    const canPublish = isEditor
    const canEdit = isEditor
    const canDelete = isAdmin

    return (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" asChild title="View">
          <Link to={`${basePath}/${entry.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        {canEdit ? (
          <Button size="sm" variant="outline" className="h-8 gap-2" asChild>
            <Link to={`${basePath}/${entry.id}/edit`} state={{ from: `${location.pathname}${location.search}` }}>
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
        ) : null}
        {canPublish ? (
          entry.status === 'PUBLISHED' ? (
            <Button
              size="sm"
              variant="secondary"
              className="h-8"
              onClick={() => unpublishMutation.mutate(entry.id)}
              disabled={unpublishMutation.isPending}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              size="sm"
              variant="default"
              className="h-8"
              onClick={() => publishMutation.mutate(entry.id)}
              disabled={publishMutation.isPending}
            >
              Publish
            </Button>
          )
        ) : null}
        {canDelete ? (
          <ConfirmDialog
            title="Delete Entry"
            description="This will permanently delete the entry and all associated images."
            onConfirm={() => deleteMutation.mutate(entry.id)}
            isLoading={deleteMutation.isPending}
            trigger={
              <Button size="icon" variant="ghost" className="text-destructive" title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        ) : null}
      </div>
    )
  }

  const columns = useMemo(
    () => {
      const common = [
        {
          header: 'Title',
          accessorKey: 'title',
          cell: ({ row }: { row: { original: NewsEvent } }) => (
            <span className="font-medium">{truncate(row.original.title, 60)}</span>
          ),
        },
        {
          header: type === 'news' ? 'Created By' : 'Location',
          accessorKey: type === 'news' ? 'createdByName' : 'location',
          cell: ({ row }: { row: { original: NewsEvent } }) =>
            type === 'news'
              ? row.original.createdByName
              : row.original.location || '—',
        },
        {
          header: 'Date',
          accessorKey: 'date',
          cell: ({ row }: { row: { original: NewsEvent } }) => formatDate(row.original.date),
        },
        {
          header: 'Status',
          accessorKey: 'status',
          cell: ({ row }: { row: { original: NewsEvent } }) => (
            <NewsEventStatusBadge status={row.original.status} />
          ),
        },
        {
          header: 'Actions',
          id: 'actions',
          cell: ({ row }: { row: { original: NewsEvent } }) => renderActions(row.original),
        },
      ]
      return common
    },
    [publishMutation.isPending, unpublishMutation.isPending, deleteMutation.isPending, isAdmin, isEditor, type]
  )

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading={title}>
        {isEditor ? (
          <Button asChild>
            <Link to={`${basePath}/new`} state={{ from: `${location.pathname}${location.search}` }}>
              Create
            </Link>
          </Button>
        ) : null}
      </PageHeader>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Status</label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus((value ?? 'ALL') as StatusFilter)
              resetPage()
            }}
          >
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Search</label>
          <Input
            className="w-64"
            placeholder="Search by title"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              resetPage()
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value)
              resetPage()
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value)
              resetPage()
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => query.refetch()}
      />

      <Pagination
        page={page}
        perPage={perPage}
        total={query.data?.total ?? 0}
        onPageChange={setPage}
          onPerPageChange={setPerPage}
      />
    </div>
  )
}
