import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateStat, useStats, useUpdateStat } from '../useCms'

export default function CmsStatFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const statsQuery = useStats()
  const createStat = useCreateStat()
  const updateStat = useUpdateStat()
  const current = statsQuery.data?.find((item) => item.id === id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/cms/stats'
  const title = current ? 'Edit Stat' : 'New Stat'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a dedicated page to create and edit stats."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Stats', to: '/cms/stats' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Stats</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StatEditor
            key={current?.id ?? 'new-stat'}
            initialLabel={current?.label ?? ''}
            initialValue={current ? String(current.value) : '0'}
            initialSuffix={current?.suffix ?? ''}
            initialSortOrder={current?.sortOrder ?? 0}
            isSaving={createStat.isPending || updateStat.isPending}
            onCancel={() => navigate(returnTo)}
            onSave={(dto) => {
              if (current) {
                updateStat.mutate({ id: current.id, dto }, { onSuccess: () => navigate(returnTo) })
                return
              }
              createStat.mutate(dto, { onSuccess: () => navigate(returnTo) })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function StatEditor({
  initialLabel,
  initialValue,
  initialSuffix,
  initialSortOrder,
  isSaving,
  onSave,
  onCancel,
}: {
  initialLabel: string
  initialValue: string
  initialSuffix: string
  initialSortOrder: number
  isSaving: boolean
  onSave: (dto: { label: string; value: number; suffix?: string; sortOrder: number }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    label: initialLabel,
    value: initialValue,
    suffix: initialSuffix,
    sortOrder: String(initialSortOrder),
  })

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="cms-stat-label-page">Label</Label>
        <Input
          id="cms-stat-label-page"
          value={formData.label}
          onChange={(event) => setFormData((prev) => ({ ...prev, label: event.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cms-stat-value-page">Value</Label>
        <Input
          id="cms-stat-value-page"
          type="number"
          value={formData.value}
          onChange={(event) => setFormData((prev) => ({ ...prev, value: event.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cms-stat-suffix-page">Suffix</Label>
        <Input
          id="cms-stat-suffix-page"
          value={formData.suffix}
          onChange={(event) => setFormData((prev) => ({ ...prev, suffix: event.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cms-stat-sort-page">Sort Order</Label>
        <Input
          id="cms-stat-sort-page"
          type="number"
          value={formData.sortOrder}
          onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
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
              value: Number(formData.value) || 0,
              suffix: formData.suffix || undefined,
              sortOrder: Number(formData.sortOrder) || 0,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Stat'}
        </Button>
      </div>
    </>
  )
}
