import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { IconPicker } from '@/components/shared/IconPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import { useMissionVision, useUpdateMissionVision } from '../useCms'

export default function CmsMissionVisionFormPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const missionVisionQuery = useMissionVision()
  const updateMissionVision = useUpdateMissionVision()
  const current = missionVisionQuery.data
  const returnTo =
    (location.state as { from?: string } | undefined)?.from ?? '/cms/mission-vision'

  if (!current) {
    return <div className="text-sm text-muted-foreground">Loading Mission & Vision...</div>
  }

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="Edit Mission & Vision"
        text="Use a dedicated page to manage mission and vision content."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Mission & Vision', to: '/cms/mission-vision' },
          { label: 'Edit Mission & Vision' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Mission & Vision</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-5xl">
        <CardHeader>
          <CardTitle>Edit Mission & Vision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <MissionVisionEditor
            key={current.updatedAt}
            initialValue={current}
            isSaving={updateMissionVision.isPending}
            onCancel={() => navigate(returnTo)}
            onSave={(dto) =>
              updateMissionVision.mutate(dto, {
                onSuccess: () => navigate(returnTo),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

function MissionVisionEditor({
  initialValue,
  isSaving,
  onSave,
  onCancel,
}: {
  initialValue: {
    missionTitle: string
    missionDescription: string
    missionIcon: string
    visionTitle: string
    visionDescription: string
    visionIcon: string
  }
  isSaving: boolean
  onSave: (dto: {
    missionTitle: string
    missionDescription: string
    missionIcon: string
    visionTitle: string
    visionDescription: string
    visionIcon: string
  }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(initialValue)
  const MissionIcon = getCmsIcon(formData.missionIcon)
  const VisionIcon = getCmsIcon(formData.visionIcon)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border p-4">
          <h3 className="font-semibold">Mission</h3>
          <div className="space-y-2">
            <Label htmlFor="cms-mission-title-page">Title</Label>
            <Input
              id="cms-mission-title-page"
              value={formData.missionTitle}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, missionTitle: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-mission-description-page">Description</Label>
            <Textarea
              id="cms-mission-description-page"
              value={formData.missionDescription}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, missionDescription: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2">
              <MissionIcon className="h-5 w-5 text-cyan-700" />
              <span className="text-sm">{formData.missionIcon}</span>
            </div>
            <IconPicker
              value={formData.missionIcon}
              onChange={(icon) => setFormData((prev) => ({ ...prev, missionIcon: icon }))}
              options={CMS_ICON_OPTIONS}
              getIcon={getCmsIcon}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border p-4">
          <h3 className="font-semibold">Vision</h3>
          <div className="space-y-2">
            <Label htmlFor="cms-vision-title-page">Title</Label>
            <Input
              id="cms-vision-title-page"
              value={formData.visionTitle}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, visionTitle: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-vision-description-page">Description</Label>
            <Textarea
              id="cms-vision-description-page"
              value={formData.visionDescription}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, visionDescription: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2">
              <VisionIcon className="h-5 w-5 text-cyan-700" />
              <span className="text-sm">{formData.visionIcon}</span>
            </div>
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isSaving} onClick={() => onSave(formData)}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </>
  )
}
