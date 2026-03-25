import { useState } from 'react';
import { Link } from 'react-router-dom';

import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import Pagination from '@/components/shared/Pagination';
import {
  getMetadataPreview,
  getPerformedByLabel,
} from '@/features/audit-logs/auditLogDisplay';
import AuditLogFilters from '@/features/audit-logs/AuditLogFilters';
import { useAuditLogs } from '@/features/audit-logs/useAuditLogs';
import { usePagination } from '@/hooks/usePagination';
import { formatDate, formatEnumLabel } from '@/lib/utils';
import type { AuditAction, AuditLog } from '@/types/audit-log.types';

export default function AuditLogsPage() {
  const { page, perPage, resetPage, setPage, setPerPage } = usePagination();
  const [filters, setFilters] = useState<{
    action?: AuditAction;
    entityType?: string;
    performedBy?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const logsQuery = useAuditLogs({
    page,
    perPage,
    ...filters,
  });

  return (
    <div>
      <PageHeader title="Audit Logs" />
      <AuditLogFilters
        onChange={(nextFilters) => {
          setFilters(nextFilters);
          resetPage();
        }}
        value={filters}
      />

      <DataTable
        columns={[
          {
            accessorKey: 'action',
            header: 'Action',
            render: (row: AuditLog) => formatEnumLabel(row.action),
          },
          {
            accessorKey: 'entityType',
            header: 'Entity Type',
            render: (row: AuditLog) => formatEnumLabel(row.entityType),
          },
          {
            accessorKey: 'performedByName',
            header: 'Performed By',
            render: (row: AuditLog) => getPerformedByLabel(row),
          },
          {
            accessorKey: 'metadata',
            header: 'Metadata',
            cell: ({ row }) => (
              <Link
                className="text-cyan-700 hover:text-cyan-800 hover:underline font-medium"
                to={`/audit-logs/${row.original.id}`}
              >
                {getMetadataPreview(row.original)}
              </Link>
            ),
          },
          {
            accessorKey: 'createdAt',
            header: 'Created At',
            render: (row: AuditLog) => formatDate(row.createdAt),
          },
        ]}
        data={logsQuery.data?.data ?? []}
        isError={logsQuery.isError}
        isLoading={logsQuery.isLoading}
        onRetry={() => logsQuery.refetch()}
      />

      <Pagination
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        page={page}
        perPage={perPage}
        total={logsQuery.data?.total ?? 0}
      />
    </div>
  );
}
