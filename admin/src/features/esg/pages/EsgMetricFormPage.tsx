import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateEsgMetric, useEsgMetrics, useUpdateEsgMetric } from '../useEsg'

export default function EsgMetricFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const metricsQuery = useEsgMetrics()
  const createMetric = useCreateEsgMetric()
  const updateMetric = useUpdateEsgMetric()
  const current = metricsQuery.data?.find((item) => item.id === id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/esg-admin/metrics'
  const title = current ? 'Edit Metric' : 'New Metric'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a dedicated form page for ESG metric create and edit flows."
        items={[
          { label: 'ESG', to: '/esg-admin' },
          { label: 'Metrics', to: '/esg-admin/metrics' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Metrics</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EsgMetricEditor
            key={current?.id ?? 'new-metric'}
            initialLabel={current?.label ?? ''}
            initialValue={current?.value ?? ''}
            initialSuffix={current?.suffix ?? ''}
            initialDescription={current?.description ?? ''}
            initialSortOrder={current?.sortOrder ?? 0}
            isSaving={createMetric.isPending || updateMetric.isPending}
            onCancel={() => navigate(returnTo)}
            onSave={(dto) => {
              if (current) {
                updateMetric.mutate({ id: current.id, dto }, { onSuccess: () => navigate(returnTo) })
                return
              }
              createMetric.mutate(dto, { onSuccess: () => navigate(returnTo) })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function EsgMetricEditor({
  initialLabel,
  initialValue,
  initialSuffix,
  initialDescription,
  initialSortOrder,
  isSaving,
  onSave,
  onCancel,
}: {
  initialLabel: string
  initialValue: string
  initialSuffix: string
  initialDescription: string
  initialSortOrder: number
  isSaving: boolean
  onSave: (dto: {
    label: string
    value: string
    suffix?: string
    description?: string
    sortOrder: number
  }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    label: initialLabel,
    value: initialValue,
    suffix: initialSuffix,
    description: initialDescription,
    sortOrder: String(initialSortOrder),
  })

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="esg-metric-label-page">Label</Label>
          <Input
            id="esg-metric-label-page"
            value={formData.label}
            onChange={(event) => setFormData((prev) => ({ ...prev, label: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="esg-metric-value-page">Value</Label>
          <Input
            id="esg-metric-value-page"
            value={formData.value}
            onChange={(event) => setFormData((prev) => ({ ...prev, value: event.target.value }))}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="esg-metric-suffix-page">Suffix</Label>
          <Input
            id="esg-metric-suffix-page"
            value={formData.suffix}
            onChange={(event) => setFormData((prev) => ({ ...prev, suffix: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="esg-metric-sort-page">Sort Order</Label>
          <Input
            id="esg-metric-sort-page"
            type="number"
            value={formData.sortOrder}
            onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="esg-metric-description-page">Description</Label>
        <Textarea
          id="esg-metric-description-page"
          rows={4}
          value={formData.description}
          onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={isSaving}
          onClick={() =>
            onSave({
              label: formData.label,
              value: formData.value,
              suffix: formData.suffix || undefined,
              description: formData.description || undefined,
              sortOrder: Number(formData.sortOrder) || 0,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Metric'}
        </Button>
      </div>
    </>
  )
}
