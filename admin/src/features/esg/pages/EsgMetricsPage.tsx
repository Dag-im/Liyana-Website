import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ActionIconGroup from '@/components/shared/ActionIconGroup'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useDeleteEsgMetric,
  useEsgMetrics,
  usePublishEsgMetric,
  useUnpublishEsgMetric,
} from '../useEsg'

export default function EsgMetricsPage() {
  const location = useLocation()
  const metricsQuery = useEsgMetrics()
  const publishMetric = usePublishEsgMetric()
  const unpublishMetric = useUnpublishEsgMetric()
  const deleteMetric = useDeleteEsgMetric()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const metrics = metricsQuery.data ?? []
  const isMutating = publishMetric.isPending || unpublishMetric.isPending

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="ESG Metrics"
        text="Maintain the ESG metric cards shown on the public page."
        items={[
          { label: 'ESG', to: '/esg-admin' },
          { label: 'Metrics' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/esg-admin/metrics/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Metric
            </Link>
          </Button>
        }
      />

      {metrics.length ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {metric.value}
                      {metric.suffix ?? ''}
                    </CardTitle>
                    <CardDescription>
                      {metric.label} • sort order {metric.sortOrder}
                    </CardDescription>
                  </div>
                  <ActionIconGroup
                    actions={[
                      {
                        label: 'Edit Metric',
                        icon: Pencil,
                        to: `/esg-admin/metrics/${metric.id}/edit`,
                      },
                      {
                        label: 'Delete Metric',
                        icon: Trash2,
                        destructive: true,
                        onClick: () => setDeleteId(metric.id),
                      },
                    ]}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {metric.description || 'No supporting description added.'}
                </p>
                <PublishToggle
                  isPublished={metric.isPublished}
                  isPending={isMutating}
                  label="Metric Status"
                  onPublish={() => publishMetric.mutate(metric.id)}
                  onUnpublish={() => unpublishMetric.mutate(metric.id)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No ESG metrics yet"
          description="Add the first ESG metric to build the public metrics strip."
          actionLabel="Add Metric"
          onAction={() => window.location.assign('/esg-admin/metrics/new')}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMetric.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Metric"
        description="Delete this ESG metric permanently?"
        confirmLabel="Delete"
      />
    </div>
  )
}
