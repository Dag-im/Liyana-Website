import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ActionIconGroup from '@/components/shared/ActionIconGroup'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import PublishToggle from '@/components/shared/PublishToggle'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCmsIcon } from '@/lib/cms-icons'
import { useDeleteIrKpi, useIrKpis, usePublishIrKpi, useUnpublishIrKpi } from '../useIr'

export default function IrKpisPage() {
  const location = useLocation()
  const kpisQuery = useIrKpis()
  const publishKpi = usePublishIrKpi()
  const unpublishKpi = useUnpublishIrKpi()
  const deleteKpi = useDeleteIrKpi()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="IR KPIs"
        text="Dedicated pages replace the previous modal flow for KPI management."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'KPIs' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/ir-admin/kpis/new">
              <Plus className="mr-2 h-4 w-4" />
              New KPI
            </Link>
          </Button>
        }
      />

      {kpisQuery.data?.length ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {kpisQuery.data.map((kpi) => {
            const Icon = getCmsIcon(kpi.icon)
            return (
              <Card key={kpi.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{kpi.label}</CardTitle>
                      <CardDescription>
                        {kpi.value}
                        {kpi.suffix ?? ''}
                      </CardDescription>
                    </div>
                    <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sort: {kpi.sortOrder}</span>
                    <StatusBadge
                      type="active"
                      isActive={kpi.isPublished}
                      activeText="Published"
                      inactiveText="Draft"
                    />
                  </div>
                  <PublishToggle
                    isPending={publishKpi.isPending || unpublishKpi.isPending}
                    isPublished={kpi.isPublished}
                    label="KPI Status"
                    onPublish={() => publishKpi.mutate(kpi.id)}
                    onUnpublish={() => unpublishKpi.mutate(kpi.id)}
                  />
                  <div className="flex justify-end">
                    <ActionIconGroup
                      actions={[
                        {
                          label: 'Edit KPI',
                          icon: Pencil,
                          to: `/ir-admin/kpis/${kpi.id}/edit`,
                        },
                        {
                          label: 'Delete KPI',
                          icon: Trash2,
                          destructive: true,
                          onClick: () => setDeleteId(kpi.id),
                        },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="No KPI cards"
          description="Create the first KPI card for the investor overview."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteKpi.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete KPI"
        description="Delete this KPI card permanently?"
        confirmLabel="Delete"
      />
    </div>
  )
}
