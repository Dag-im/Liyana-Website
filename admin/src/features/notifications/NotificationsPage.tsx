import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { StatusBadge } from '@/components/shared/StatusBadge'
import UrgencyBadge from '@/components/shared/UrgencyBadge'
import { Button } from '@/components/ui/button'
import NotificationFilters from '@/features/notifications/NotificationFilters'
import { useMarkRead, useNotifications } from '@/features/notifications/useNotifications'
import { usePagination } from '@/hooks/usePagination'
import { showErrorToast } from '@/lib/error-utils'
import { formatDate, truncate } from '@/lib/utils'

type NotificationTab = 'all' | 'unread' | 'read'

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const { page, perPage, resetPage, setPage, setPerPage } = usePagination()
  const [tab, setTab] = useState<NotificationTab>('all')
  const [expandedId, setExpandedId] = useState<string | undefined>()

  const notificationsQuery = useNotifications({
    page,
    perPage,
    isRead: tab === 'all' ? undefined : tab === 'read',
  })

  const markReadMutation = useMarkRead()

  const columns = useMemo(
    () => [
      { accessorKey: 'title', header: 'Title' },
      {
        accessorKey: 'message',
        header: 'Message',
        render: (row: any) => truncate(row.message, 80),
      },
      {
        accessorKey: 'urgency',
        header: 'Urgency',
        render: (row: any) => <UrgencyBadge urgency={row.urgency} />,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        render: (row: any) => formatDate(row.createdAt),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        render: (row: any) => <StatusBadge type="read" isRead={row.isRead} />,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        render: (row: any) => (
          <Button
            disabled={row.isRead || markReadMutation.isPending}
            onClick={(event) => {
              event.stopPropagation()
              markReadMutation.mutate(row.id, {
                onSuccess: () => {
                  toast.success('Marked as read')
                  queryClient.invalidateQueries({ queryKey: ['notifications'] })
                  queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
                },
                onError: (error) => showErrorToast(error, 'Failed to mark as read'),
              })
            }}
            size="sm"
            variant="outline"
          >
            Mark as read
          </Button>
        ),
      },
    ],
    [markReadMutation, queryClient],
  )

  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="mb-4">
        <NotificationFilters
          onChange={(nextValue) => {
            setTab(nextValue)
            resetPage()
          }}
          value={tab}
        />
      </div>

      <div className="rounded-md border" role="presentation">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={notificationsQuery.data?.data ?? []}
            expandedRowId={expandedId}
            onRowClick={(row: any) => {
              setExpandedId((prev) => (prev === row.id ? undefined : row.id))
            }}
            isError={notificationsQuery.isError}
            isLoading={notificationsQuery.isLoading}
            onRetry={() => notificationsQuery.refetch()}
            renderExpanded={(row: any) => <p className="text-sm">{row.message}</p>}
          />
        </div>
      </div>

      <Pagination
        onPageChange={setPage}
          onPerPageChange={setPerPage}
        page={page}
        perPage={perPage}
        total={notificationsQuery.data?.total ?? 0}
      />
    </div>
  )
}
