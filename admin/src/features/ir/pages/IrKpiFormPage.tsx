import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { IconPicker } from '@/components/shared/IconPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import { useCreateIrKpi, useIrKpis, useUpdateIrKpi } from '../useIr'

export default function IrKpiFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const kpisQuery = useIrKpis()
  const createKpi = useCreateIrKpi()
  const updateKpi = useUpdateIrKpi()
  const current = kpisQuery.data?.find((item) => item.id === id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/ir-admin/kpis'
  const title = current ? 'Edit KPI' : 'New KPI'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a dedicated form page for KPI create and edit flows."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'KPIs', to: '/ir-admin/kpis' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to KPIs</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <IrKpiEditor
            key={current?.id ?? 'new-kpi'}
            initialLabel={current?.label ?? ''}
            initialValue={current?.value ?? ''}
            initialSuffix={current?.suffix ?? ''}
            initialIcon={current?.icon ?? 'BarChart3'}
            initialSortOrder={current?.sortOrder ?? 0}
            isSaving={createKpi.isPending || updateKpi.isPending}
            onSave={(dto) => {
              if (current) {
                updateKpi.mutate(
                  { id: current.id, dto },
                  { onSuccess: () => navigate(returnTo) }
                )
                return
              }

              createKpi.mutate(dto, {
                onSuccess: () => navigate(returnTo),
              })
            }}
            onCancel={() => navigate(returnTo)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function IrKpiEditor({
  initialLabel,
  initialValue,
  initialSuffix,
  initialIcon,
  initialSortOrder,
  isSaving,
  onSave,
  onCancel,
}: {
  initialLabel: string
  initialValue: string
  initialSuffix: string
  initialIcon: string
  initialSortOrder: number
  isSaving: boolean
  onSave: (dto: {
    label: string
    value: string
    suffix?: string
    icon: string
    sortOrder: number
  }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    label: initialLabel,
    value: initialValue,
    suffix: initialSuffix,
    icon: initialIcon,
    sortOrder: String(initialSortOrder),
  })

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ir-kpi-title-page">Label</Label>
          <Input
            id="ir-kpi-title-page"
            value={formData.label}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, label: event.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ir-kpi-value-page">Value</Label>
          <Input
            id="ir-kpi-value-page"
            value={formData.value}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, value: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ir-kpi-suffix-page">Suffix</Label>
          <Input
            id="ir-kpi-suffix-page"
            value={formData.suffix}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, suffix: event.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ir-kpi-sort-page">Sort Order</Label>
          <Input
            id="ir-kpi-sort-page"
            type="number"
            value={formData.sortOrder}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Icon</Label>
        <p className="text-sm text-muted-foreground">Selected: {formData.icon}</p>
        <IconPicker
          value={formData.icon}
          onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
          options={CMS_ICON_OPTIONS}
          getIcon={getCmsIcon}
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
              icon: formData.icon,
              sortOrder: Number(formData.sortOrder) || 0,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save KPI'}
        </Button>
      </div>
    </>
  )
}
