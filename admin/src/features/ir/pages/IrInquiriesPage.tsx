import { CheckCircle2, Eye, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { formatDate } from '@/lib/utils'
import type { IrInquiry } from '@/types/ir.types'
import { IrInquiryDetailDialog } from '../IrDialogs'
import { useDeleteIrInquiry, useIrInquiries, useReviewIrInquiry } from '../useIr'

type FilterValue = 'all' | 'reviewed' | 'unread'

export default function IrInquiriesPage() {
  const { data: user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<FilterValue>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<IrInquiry | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 300)
  const { page, perPage, setPage, setPerPage, resetPage } = usePagination()

  const inquiriesQuery = useIrInquiries({
    page,
    perPage,
    search: debouncedSearch || undefined,
    isReviewed: status === 'all' ? undefined : status === 'reviewed',
  })
  const reviewInquiry = useReviewIrInquiry()
  const deleteInquiry = useDeleteIrInquiry()

  const columns = useMemo(
    () => [
      {
        header: 'Sender',
        cell: ({ row }: { row: { original: IrInquiry } }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      {
        header: 'Message',
        cell: ({ row }: { row: { original: IrInquiry } }) => (
          <p className="max-w-100 truncate text-sm text-muted-foreground">
            {row.original.message}
          </p>
        ),
      },
      {
        header: 'Status',
        cell: ({ row }: { row: { original: IrInquiry } }) => (
          <StatusBadge
            type="active"
            isActive={row.original.isReviewed}
            activeText="Reviewed"
            inactiveText="Unread"
          />
        ),
      },
      {
        header: 'Submitted',
        cell: ({ row }: { row: { original: IrInquiry } }) =>
          formatDate(row.original.createdAt),
      },
      {
        header: 'Actions',
        cell: ({ row }: { row: { original: IrInquiry } }) => (
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSelectedInquiry(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {!row.original.isReviewed ? (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => reviewInquiry.mutate(row.original.id)}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </Button>
            ) : null}
            {isAdmin ? (
              <Button size="icon" variant="ghost" onClick={() => setDeleteId(row.original.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [isAdmin, reviewInquiry]
  )

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="IR Inquiries"
        text="Review investor inquiries with filter and pagination controls."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'Inquiries' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/ir-admin">Back to Overview</Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Label htmlFor="ir-search-inquiries-page">Search</Label>
          <Input
            id="ir-search-inquiries-page"
            className="w-full sm:w-72"
            value={search}
            placeholder="Search by sender or email..."
            onChange={(event) => {
              setSearch(event.target.value)
              resetPage()
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ir-filter-inquiries-page">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as FilterValue)
              resetPage()
            }}
          >
            <SelectTrigger id="ir-filter-inquiries-page" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={inquiriesQuery.data?.data ?? []}
        isLoading={inquiriesQuery.isLoading}
        isError={inquiriesQuery.isError}
        onRetry={() => inquiriesQuery.refetch()}
        pagination={{
          page,
          perPage,
          total: inquiriesQuery.data?.total ?? 0,
          onPageChange: setPage,
          onPerPageChange: setPerPage,
        }}
      />

      <IrInquiryDetailDialog
        inquiry={selectedInquiry}
        open={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteInquiry.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Inquiry"
        description="Delete this investor inquiry permanently?"
        confirmLabel="Delete"
      />
    </div>
  )
}
