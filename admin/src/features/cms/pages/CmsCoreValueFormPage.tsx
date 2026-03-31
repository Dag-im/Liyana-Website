import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { IconPicker } from '@/components/shared/IconPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import { useCoreValues, useCreateCoreValue, useUpdateCoreValue } from '../useCms'

export default function CmsCoreValueFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const coreValuesQuery = useCoreValues()
  const createCoreValue = useCreateCoreValue()
  const updateCoreValue = useUpdateCoreValue()
  const current = coreValuesQuery.data?.find((item) => item.id === id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/cms/core-values'
  const title = current ? 'Edit Core Value' : 'New Core Value'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a dedicated page to create and edit core values."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Core Values', to: '/cms/core-values' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Core Values</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CoreValueEditor
            key={current?.id ?? 'new-core-value'}
            initialTitle={current?.title ?? ''}
            initialDescription={current?.description ?? ''}
            initialIcon={current?.icon ?? 'Star'}
            initialSortOrder={current?.sortOrder ?? 0}
            isSaving={createCoreValue.isPending || updateCoreValue.isPending}
            onCancel={() => navigate(returnTo)}
            onSave={(dto) => {
              if (current) {
                updateCoreValue.mutate({ id: current.id, dto }, { onSuccess: () => navigate(returnTo) })
                return
              }
              createCoreValue.mutate(dto, { onSuccess: () => navigate(returnTo) })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function CoreValueEditor({
  initialTitle,
  initialDescription,
  initialIcon,
  initialSortOrder,
  isSaving,
  onSave,
  onCancel,
}: {
  initialTitle: string
  initialDescription: string
  initialIcon: string
  initialSortOrder: number
  isSaving: boolean
  onSave: (dto: { title: string; description: string; icon: string; sortOrder: number }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
    icon: initialIcon,
    sortOrder: String(initialSortOrder),
  })
  const Icon = getCmsIcon(formData.icon)

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="cms-core-value-title-page">Title</Label>
        <Input
          id="cms-core-value-title-page"
          value={formData.title}
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cms-core-value-description-page">Description</Label>
        <Textarea
          id="cms-core-value-description-page"
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>
      <div className="space-y-3">
        <Label>Icon</Label>
        <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-3">
          <Icon className="h-5 w-5 text-cyan-700" />
          <span className="text-sm">{formData.icon}</span>
        </div>
        <IconPicker
          value={formData.icon}
          onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
          options={CMS_ICON_OPTIONS}
          getIcon={getCmsIcon}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cms-core-value-sort-page">Sort Order</Label>
        <Input
          id="cms-core-value-sort-page"
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
              title: formData.title,
              description: formData.description,
              icon: formData.icon,
              sortOrder: Number(formData.sortOrder) || 0,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Core Value'}
        </Button>
      </div>
    </>
  )
}
