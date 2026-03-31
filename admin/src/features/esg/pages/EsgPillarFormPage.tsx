import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import * as esgApi from '@/api/esg.api'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { FileUpload } from '@/components/shared/FileUpload'
import { IconPicker } from '@/components/shared/IconPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import { useCreateEsgPillar, useEsgPillars, useUpdateEsgPillar } from '../useEsg'

export default function EsgPillarFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const pillarsQuery = useEsgPillars()
  const createPillar = useCreateEsgPillar()
  const updatePillar = useUpdateEsgPillar()
  const current = pillarsQuery.data?.find((item) => item.id === id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/esg-admin/pillars'
  const title = current ? 'Edit Pillar' : 'New Pillar'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a dedicated form page for ESG pillar create and edit flows."
        items={[
          { label: 'ESG', to: '/esg-admin' },
          { label: 'Pillars', to: '/esg-admin/pillars' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Pillars</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EsgPillarEditor
            key={current?.id ?? 'new-pillar'}
            initialTitle={current?.title ?? ''}
            initialDescription={current?.description ?? ''}
            initialIcon={current?.icon ?? 'Leaf'}
            initialSortOrder={current?.sortOrder ?? 0}
            initialDocument={current?.document ?? ''}
            initialInitiatives={current?.initiatives.map((item) => item.text) ?? ['']}
            isSaving={createPillar.isPending || updatePillar.isPending}
            onCancel={() => navigate(returnTo)}
            onSave={(dto) => {
              if (current) {
                updatePillar.mutate({ id: current.id, dto }, { onSuccess: () => navigate(returnTo) })
                return
              }

              createPillar.mutate(dto, { onSuccess: () => navigate(returnTo) })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function EsgPillarEditor({
  initialTitle,
  initialDescription,
  initialIcon,
  initialSortOrder,
  initialDocument,
  initialInitiatives,
  isSaving,
  onSave,
  onCancel,
}: {
  initialTitle: string
  initialDescription: string
  initialIcon: string
  initialSortOrder: number
  initialDocument: string
  initialInitiatives: string[]
  isSaving: boolean
  onSave: (dto: esgApi.CreateEsgPillarDto) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
    icon: initialIcon,
    sortOrder: String(initialSortOrder),
    document: initialDocument,
    initiatives: initialInitiatives.length ? initialInitiatives : [''],
  })
  const Icon = getCmsIcon(formData.icon)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="esg-pillar-title-page">Title</Label>
            <Input
              id="esg-pillar-title-page"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="esg-pillar-description-page">Description</Label>
            <Textarea
              id="esg-pillar-description-page"
              rows={6}
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="esg-pillar-sort-page">Sort Order</Label>
            <Input
              id="esg-pillar-sort-page"
              type="number"
              value={formData.sortOrder}
              onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
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
            <Label>Document</Label>
            <FileUpload
              accept=".pdf,application/pdf"
              currentPath={formData.document || undefined}
              label="Upload supporting document"
              maxSizeMB={10}
              onSuccess={(path) => setFormData((prev) => ({ ...prev, document: path }))}
              onUpload={esgApi.uploadEsgFile}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Initiatives</h3>
            <p className="text-sm text-muted-foreground">Add each initiative as a separate line item.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData((prev) => ({ ...prev, initiatives: [...prev.initiatives, ''] }))
            }
          >
            Add Initiative
          </Button>
        </div>
        <div className="space-y-3">
          {formData.initiatives.map((initiative, index) => (
            <div className="flex items-center gap-2" key={index}>
              <Input
                value={initiative}
                placeholder={`Initiative ${index + 1}`}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    initiatives: prev.initiatives.map((item, itemIndex) =>
                      itemIndex === index ? event.target.value : item
                    ),
                  }))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={formData.initiatives.length === 1}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    initiatives: prev.initiatives.filter((_item, itemIndex) => itemIndex !== index),
                  }))
                }
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
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
              document: formData.document || undefined,
              initiatives: formData.initiatives.filter((item) => item.trim().length > 0),
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Pillar'}
        </Button>
      </div>
    </>
  )
}
