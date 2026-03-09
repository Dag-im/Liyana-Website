import { useState } from 'react'

import AuditLogFilters from '@/features/audit-logs/AuditLogFilters'
import { useAuditLogs } from '@/features/audit-logs/useAuditLogs'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { formatDate, truncate } from '@/lib/utils'

export default function AuditLogsPage() {
  const { page, perPage, resetPage, setPage } = usePagination()
  const [filters, setFilters] = useState<{
    action?: any
    entityType?: string
    performedBy?: string
    startDate?: string
    endDate?: string
  }>({})

  const logsQuery = useAuditLogs({
    page,
    perPage,
    ...filters,
  })

  return (
    <div>
      <PageHeader title="Audit Logs" />
      <AuditLogFilters
        onChange={(nextFilters) => {
          setFilters(nextFilters)
          resetPage()
        }}
        value={filters}
      />

      <DataTable
        columns={[
          { key: 'action', header: 'Action' },
          { key: 'entityType', header: 'Entity Type' },
          { key: 'entityId', header: 'Entity ID' },
          { key: 'performedBy', header: 'Performed By' },
          {
            key: 'metadata',
            header: 'Metadata',
            render: (row: any) => truncate(JSON.stringify(row.metadata ?? {}), 60),
          },
          {
            key: 'createdAt',
            header: 'Created At',
            render: (row: any) => formatDate(row.createdAt),
          },
        ]}
        data={logsQuery.data?.data ?? []}
        isError={logsQuery.isError}
        isLoading={logsQuery.isLoading}
        onRetry={() => logsQuery.refetch()}
      />

      <Pagination
        onPageChange={setPage}
        page={page}
        perPage={perPage}
        total={logsQuery.data?.total ?? 0}
      />
    </div>
  )
}
