import { useEffect, useState } from 'react'

import { IconPicker } from '@/components/shared/IconPicker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import type { MissionVision } from '@/types/cms.types'
import { useUpdateMissionVision } from './useCms'

type EditMissionVisionDialogProps = {
  open: boolean
  onClose: () => void
  missionVision: MissionVision
}

export default function EditMissionVisionDialog({
  open,
  onClose,
  missionVision,
}: EditMissionVisionDialogProps) {
  const updateMutation = useUpdateMissionVision()

  const [formData, setFormData] = useState({
    missionTitle: missionVision.missionTitle,
    missionDescription: missionVision.missionDescription,
    missionIcon: missionVision.missionIcon,
    visionTitle: missionVision.visionTitle,
    visionDescription: missionVision.visionDescription,
    visionIcon: missionVision.visionIcon,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        missionTitle: missionVision.missionTitle,
        missionDescription: missionVision.missionDescription,
        missionIcon: missionVision.missionIcon,
        visionTitle: missionVision.visionTitle,
        visionDescription: missionVision.visionDescription,
        visionIcon: missionVision.visionIcon,
      })
    }
  }, [open, missionVision])

  const MissionIcon = getCmsIcon(formData.missionIcon)
  const VisionIcon = getCmsIcon(formData.visionIcon)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    updateMutation.mutate(formData, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Mission & Vision</DialogTitle>
          <DialogDescription>Update mission and vision content and iconography.</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border p-4">
              <h3 className="font-semibold">Mission</h3>

              <div className="space-y-2">
                <Label htmlFor="mission-title">Title</Label>
                <Input
                  id="mission-title"
                  value={formData.missionTitle}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, missionTitle: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission-description">Description</Label>
                <Textarea
                  id="mission-description"
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
                <Label htmlFor="vision-title">Title</Label>
                <Input
                  id="vision-title"
                  value={formData.visionTitle}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, visionTitle: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision-description">Description</Label>
                <Textarea
                  id="vision-description"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
