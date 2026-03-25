import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useParams } from 'react-router-dom';

import { getAuditLog } from '@/api/audit-logs.api';
import ErrorState from '@/components/shared/ErrorState';
import PageHeader from '@/components/shared/PageHeader';
import {
  getEntityLabel,
  getPerformedByLabel,
  sanitizeMetadata,
} from '@/features/audit-logs/auditLogDisplay';
import { formatDate, formatEnumLabel } from '@/lib/utils';

export default function AuditLogDetailPage() {
  const { id } = useParams<{ id: string }>();

  const query = useQuery({
    queryKey: ['audit-log', id],
    queryFn: () => getAuditLog(id as string),
    enabled: Boolean(id),
    staleTime: 60_000,
  });

  if (!id) {
    return <Navigate replace to="/audit-logs" />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  const log = query.data;
  const metadata = sanitizeMetadata(log?.metadata);

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Audit Log Details"
        text="Readable details for this activity log entry."
      >
        <Link
          className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          to="/audit-logs"
        >
          Back to audit logs
        </Link>
      </PageHeader>

      {query.isLoading || !log ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading details...
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <dl className="grid grid-cols-1 gap-0 md:grid-cols-2">
            <DetailRow label="Action" value={formatEnumLabel(log.action)} />
            <DetailRow
              label="Entity Type"
              value={formatEnumLabel(log.entityType)}
            />
            <DetailRow label="Entity" value={getEntityLabel(log)} />
            <DetailRow label="Performed By" value={getPerformedByLabel(log)} />
            <DetailRow label="Created At" value={formatDate(log.createdAt)} />
            <DetailRow
              label="Actor Email"
              value={log.performedByEmail?.trim() || 'N/A'}
            />
          </dl>

          <div className="border-t border-border p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Metadata
            </h2>
            {Object.keys(metadata).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No metadata available.
              </p>
            ) : (
              <pre className="max-h-130 overflow-auto rounded-lg bg-muted/40 p-4 text-xs leading-relaxed text-foreground">
                {JSON.stringify(metadata, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border p-5 md:border-r even:md:border-r-0">
      <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
