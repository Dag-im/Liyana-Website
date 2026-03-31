import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

import * as esgApi from '@/api/esg.api'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { FileUpload } from '@/components/shared/FileUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateEsgReport, useEsgReports, useUpdateEsgReport } from '../useEsg'

export default function EsgReportFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const reportsQuery = useEsgReports()
  const createReport = useCreateEsgReport()
  const updateReport = useUpdateEsgReport()
  const current = reportsQuery.data?.find((item) => item.id === id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/esg-admin/reports'
  const title = current ? 'Edit Report' : 'New Report'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a standalone page for ESG report uploads and edits."
        items={[
          { label: 'ESG', to: '/esg-admin' },
          { label: 'Reports', to: '/esg-admin/reports' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Reports</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EsgReportEditor
            key={current?.id ?? 'new-report'}
            initialTitle={current?.title ?? ''}
            initialYear={current?.year ?? ''}
            initialType={current?.type ?? 'annual'}
            initialFilePath={current?.filePath ?? ''}
            initialSortOrder={current?.sortOrder ?? 0}
            isSaving={createReport.isPending || updateReport.isPending}
            onCancel={() => navigate(returnTo)}
            onSave={(dto) => {
              if (current) {
                updateReport.mutate({ id: current.id, dto }, { onSuccess: () => navigate(returnTo) })
                return
              }
              createReport.mutate(dto, { onSuccess: () => navigate(returnTo) })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function EsgReportEditor({
  initialTitle,
  initialYear,
  initialType,
  initialFilePath,
  initialSortOrder,
  isSaving,
  onSave,
  onCancel,
}: {
  initialTitle: string
  initialYear: string
  initialType: 'annual' | 'esg' | 'sustainability' | 'other'
  initialFilePath: string
  initialSortOrder: number
  isSaving: boolean
  onSave: (dto: esgApi.CreateEsgReportDto) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    year: initialYear,
    type: initialType,
    filePath: initialFilePath,
    sortOrder: String(initialSortOrder),
  })

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="esg-report-title-page">Title</Label>
        <Input
          id="esg-report-title-page"
          value={formData.title}
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="esg-report-year-page">Year</Label>
          <Input
            id="esg-report-year-page"
            value={formData.year}
            onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value as typeof formData.type }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="esg">ESG</SelectItem>
              <SelectItem value="sustainability">Sustainability</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="esg-report-sort-page">Sort Order</Label>
          <Input
            id="esg-report-sort-page"
            type="number"
            value={formData.sortOrder}
            onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>PDF File</Label>
        <FileUpload
          accept=".pdf,application/pdf"
          currentPath={formData.filePath || undefined}
          label="Upload ESG report PDF"
          maxSizeMB={12}
          onSuccess={(path) => setFormData((prev) => ({ ...prev, filePath: path }))}
          onUpload={esgApi.uploadEsgFile}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={!formData.filePath || isSaving}
          onClick={() =>
            onSave({
              title: formData.title,
              year: formData.year,
              type: formData.type,
              filePath: formData.filePath,
              sortOrder: Number(formData.sortOrder) || 0,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Report'}
        </Button>
      </div>
    </>
  )
}
