import { useState } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { IconPicker } from '@/components/shared/IconPicker'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import {
  useLucsMission,
  usePublishLucsMission,
  useUnpublishLucsMission,
  useUpdateLucsMission,
} from '../useLucs'

export default function LucsMissionPage() {
  const query = useLucsMission()
  const update = useUpdateLucsMission()
  const publish = usePublishLucsMission()
  const unpublish = useUnpublishLucsMission()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="LUCS Mission & Vision"
        text="Mission and vision content now lives on its own route."
        items={[
          { label: 'LUCS Admin', to: '/lucs-admin' },
          { label: 'Mission & Vision' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/lucs-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Mission & Vision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LucsMissionForm
            key={query.data?.updatedAt ?? 'lucs-mission-form'}
            initialData={{
              missionTitle: query.data?.missionTitle ?? '',
              missionDescription: query.data?.missionDescription ?? '',
              missionIcon: query.data?.missionIcon ?? 'Target',
              visionTitle: query.data?.visionTitle ?? '',
              visionDescription: query.data?.visionDescription ?? '',
              visionIcon: query.data?.visionIcon ?? 'Eye',
            }}
            isPublished={query.data?.isPublished ?? false}
            isSaving={update.isPending}
            isToggling={publish.isPending || unpublish.isPending}
            onPublish={() => publish.mutate()}
            onUnpublish={() => unpublish.mutate()}
            onSave={(dto) => update.mutate(dto)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function LucsMissionForm({
  initialData,
  isPublished,
  isSaving,
  isToggling,
  onPublish,
  onUnpublish,
  onSave,
}: {
  initialData: {
    missionTitle: string
    missionDescription: string
    missionIcon: string
    visionTitle: string
    visionDescription: string
    visionIcon: string
  }
  isPublished: boolean
  isSaving: boolean
  isToggling: boolean
  onPublish: () => void
  onUnpublish: () => void
  onSave: (dto: {
    missionTitle: string
    missionDescription: string
    missionIcon: string
    visionTitle: string
    visionDescription: string
    visionIcon: string
  }) => void
}) {
  const [formData, setFormData] = useState(initialData)

  return (
    <>
      <PublishToggle
        isPending={isToggling}
        isPublished={isPublished}
        label="Mission & Vision Publish Status"
        onPublish={onPublish}
        onUnpublish={onUnpublish}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border p-4">
          <div className="space-y-2">
            <Label htmlFor="lucs-mission-title-page">Mission Title</Label>
            <Input
              id="lucs-mission-title-page"
              value={formData.missionTitle}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, missionTitle: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lucs-mission-description-page">Mission Description</Label>
            <Textarea
              id="lucs-mission-description-page"
              rows={5}
              value={formData.missionDescription}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  missionDescription: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Mission Icon</Label>
            <p className="text-sm text-muted-foreground">Selected: {formData.missionIcon}</p>
            <IconPicker
              value={formData.missionIcon}
              onChange={(icon) => setFormData((prev) => ({ ...prev, missionIcon: icon }))}
              options={CMS_ICON_OPTIONS}
              getIcon={getCmsIcon}
            />
          </div>
        </div>
        <div className="space-y-4 rounded-xl border p-4">
          <div className="space-y-2">
            <Label htmlFor="lucs-vision-title-page">Vision Title</Label>
            <Input
              id="lucs-vision-title-page"
              value={formData.visionTitle}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, visionTitle: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lucs-vision-description-page">Vision Description</Label>
            <Textarea
              id="lucs-vision-description-page"
              rows={5}
              value={formData.visionDescription}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  visionDescription: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Vision Icon</Label>
            <p className="text-sm text-muted-foreground">Selected: {formData.visionIcon}</p>
            <IconPicker
              value={formData.visionIcon}
              onChange={(icon) => setFormData((prev) => ({ ...prev, visionIcon: icon }))}
              options={CMS_ICON_OPTIONS}
              getIcon={getCmsIcon}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/lucs-admin">Cancel</Link>
        </Button>
        <Button disabled={isSaving} onClick={() => onSave(formData)}>
          {isSaving ? 'Saving...' : 'Save Mission & Vision'}
        </Button>
      </div>
    </>
  )
}
