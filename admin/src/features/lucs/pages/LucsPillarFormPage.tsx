import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import type { CreateLucsPillarDto } from '@/api/lucs.api'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { IconPicker } from '@/components/shared/IconPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import { useCreateLucsPillar, useLucsPillars, useUpdateLucsPillar } from '../useLucs'

export default function LucsPillarFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const pillarsQuery = useLucsPillars()
  const createPillar = useCreateLucsPillar()
  const updatePillar = useUpdateLucsPillar()
  const current = pillarsQuery.data?.find((item) => item.id === id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/lucs-admin/pillars'
  const title = current ? 'Edit Pillar' : 'New Pillar'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a dedicated page for LUCS pillar create and edit flows."
        items={[
          { label: 'LUCS', to: '/lucs-admin' },
          { label: 'What We Do', to: '/lucs-admin/pillars' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to What We Do</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LucsPillarEditor
            key={current?.id ?? 'new-lucs-pillar'}
            initialTitle={current?.title ?? ''}
            initialDescription={current?.description ?? ''}
            initialIcon={current?.icon ?? 'HandHeart'}
            initialSortOrder={current?.sortOrder ?? 0}
            initialBulletPoints={
              current?.bulletPoints.map((item) => ({
                point: item.point,
                description: item.description ?? '',
              })) ?? [{ point: '', description: '' }]
            }
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

function LucsPillarEditor({
  initialTitle,
  initialDescription,
  initialIcon,
  initialSortOrder,
  initialBulletPoints,
  isSaving,
  onSave,
  onCancel,
}: {
  initialTitle: string
  initialDescription: string
  initialIcon: string
  initialSortOrder: number
  initialBulletPoints: Array<{ point: string; description: string }>
  isSaving: boolean
  onSave: (dto: CreateLucsPillarDto) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
    icon: initialIcon,
    sortOrder: String(initialSortOrder),
    bulletPoints: initialBulletPoints.length ? initialBulletPoints : [{ point: '', description: '' }],
  })
  const Icon = getCmsIcon(formData.icon)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lucs-pillar-title-page">Title</Label>
            <Input
              id="lucs-pillar-title-page"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lucs-pillar-description-page">Description</Label>
            <Textarea
              id="lucs-pillar-description-page"
              rows={5}
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lucs-pillar-sort-page">Sort Order</Label>
            <Input
              id="lucs-pillar-sort-page"
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
        </div>
      </div>

      <div className="space-y-3 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Bullet Points</h3>
            <p className="text-sm text-muted-foreground">
              Add each bullet point with an optional supporting description.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                bulletPoints: [...prev.bulletPoints, { point: '', description: '' }],
              }))
            }
          >
            Add Point
          </Button>
        </div>
        <div className="space-y-4">
          {formData.bulletPoints.map((bulletPoint, index) => (
            <div className="grid gap-3 rounded-xl border bg-muted/20 p-3 md:grid-cols-[1fr_1fr_40px]" key={index}>
              <Input
                placeholder="Point"
                value={bulletPoint.point}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    bulletPoints: prev.bulletPoints.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, point: event.target.value } : item
                    ),
                  }))
                }
              />
              <Textarea
                placeholder="Optional description"
                rows={2}
                value={bulletPoint.description}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    bulletPoints: prev.bulletPoints.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, description: event.target.value } : item
                    ),
                  }))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={formData.bulletPoints.length === 1}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    bulletPoints: prev.bulletPoints.filter((_item, itemIndex) => itemIndex !== index),
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
              description: formData.description || undefined,
              icon: formData.icon,
              sortOrder: Number(formData.sortOrder) || 0,
              bulletPoints: formData.bulletPoints.filter((item) => item.point.trim().length > 0),
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Pillar'}
        </Button>
      </div>
    </>
  )
}
