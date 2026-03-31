import { FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ActionIconGroup from '@/components/shared/ActionIconGroup'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { EsgReport } from '@/types/esg.types'
import {
  useDeleteEsgReport,
  useEsgReports,
  usePublishEsgReport,
  useUnpublishEsgReport,
} from '../useEsg'

type ReportFilter = 'all' | EsgReport['type']

export default function EsgReportsPage() {
  const location = useLocation()
  const reportsQuery = useEsgReports()
  const publishReport = usePublishEsgReport()
  const unpublishReport = useUnpublishEsgReport()
  const deleteReport = useDeleteEsgReport()
  const [typeFilter, setTypeFilter] = useState<ReportFilter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const reports = useMemo(() => {
    const items = reportsQuery.data ?? []
    if (typeFilter === 'all') return items
    return items.filter((item) => item.type === typeFilter)
  }, [reportsQuery.data, typeFilter])

  const isMutating = publishReport.isPending || unpublishReport.isPending

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="ESG Reports"
        text="Upload and manage annual, ESG, sustainability, and other downloadable reports."
        items={[
          { label: 'ESG', to: '/esg-admin' },
          { label: 'Reports' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ReportFilter)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="esg">ESG</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <Link state={{ from: location.pathname }} to="/esg-admin/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Report
              </Link>
            </Button>
          </div>
        }
      />

      {reports.length ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>
                      {report.year} • {report.type} • sort order {report.sortOrder}
                    </CardDescription>
                  </div>
                  <ActionIconGroup
                    actions={[
                      {
                        label: 'Edit Report',
                        icon: Pencil,
                        to: `/esg-admin/reports/${report.id}/edit`,
                      },
                      {
                        label: 'Delete Report',
                        icon: Trash2,
                        destructive: true,
                        onClick: () => setDeleteId(report.id),
                      },
                    ]}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="truncate">{report.filePath}</span>
                </div>
                <PublishToggle
                  isPublished={report.isPublished}
                  isPending={isMutating}
                  label="Report Status"
                  onPublish={() => publishReport.mutate(report.id)}
                  onUnpublish={() => unpublishReport.mutate(report.id)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No ESG reports found"
          description="Upload the first report or adjust the selected report type."
          actionLabel="Add Report"
          onAction={() => window.location.assign('/esg-admin/reports/new')}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteReport.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Report"
        description="Delete this ESG report permanently?"
        confirmLabel="Delete"
      />
    </div>
  )
}
