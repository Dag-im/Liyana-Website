import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useParams } from 'react-router-dom';

import { getAuditLog } from '@/api/audit-logs.api';
import ErrorState from '@/components/shared/ErrorState';
import PageHeader from '@/components/shared/PageHeader';
import {
  getEntityLabel,
  getPerformedByLabel,
  getMetadataReadable,
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
  const metadataReadable = log
    ? getMetadataReadable(log, { maxEntries: 10, maxLength: 120 })
    : {
        entries: [],
        preview: 'No metadata',
        remainingCount: 0,
        totalCount: 0,
      };

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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="aura-label text-slate-500">Metadata</h2>
              {metadataReadable.totalCount > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Showing {metadataReadable.entries.length} of {metadataReadable.totalCount}
                </p>
              ) : null}
            </div>

            {metadataReadable.entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No metadata available.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {metadataReadable.entries.map((entry) => (
                  <div
                    key={entry.key}
                    className="rounded-xl border border-border/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                  >
                    <div className="aura-label text-slate-500">{entry.label}</div>

                    {entry.oldValue || entry.newValue ? (
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                            Old
                          </div>
                          <div className="aura-body text-sm font-medium">
                            {entry.oldValue ?? '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                            New
                          </div>
                          <div className="aura-body text-sm font-medium">
                            {entry.newValue ?? '—'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 aura-body text-sm font-medium">
                        {entry.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {metadataReadable.remainingCount > 0 ? (
              <p className="mt-4 text-xs text-muted-foreground">
                +{metadataReadable.remainingCount} more fields
              </p>
            ) : null}
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
