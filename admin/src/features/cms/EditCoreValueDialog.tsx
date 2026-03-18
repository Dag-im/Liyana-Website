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
import type { CoreValue } from '@/types/cms.types'
import { useUpdateCoreValue } from './useCms'

type EditCoreValueDialogProps = {
  open: boolean
  onClose: () => void
  coreValue: CoreValue
}

export default function EditCoreValueDialog({ open, onClose, coreValue }: EditCoreValueDialogProps) {
  const updateMutation = useUpdateCoreValue()
  const [formData, setFormData] = useState({
    title: coreValue.title,
    description: coreValue.description,
    icon: coreValue.icon,
    sortOrder: String(coreValue.sortOrder),
  })

  useEffect(() => {
    if (open) {
      setFormData({
        title: coreValue.title,
        description: coreValue.description,
        icon: coreValue.icon,
        sortOrder: String(coreValue.sortOrder),
      })
    }
  }, [open, coreValue])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    updateMutation.mutate(
      {
        id: coreValue.id,
        dto: {
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
          sortOrder: Number(formData.sortOrder) || 0,
        },
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Core Value</DialogTitle>
          <DialogDescription>Update this core value.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-core-value-title">Title</Label>
            <Input
              id="edit-core-value-title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-core-value-description">Description</Label>
            <Textarea
              id="edit-core-value-description"
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, description: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <IconPicker
              value={formData.icon}
              onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
              options={CMS_ICON_OPTIONS}
              getIcon={getCmsIcon}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-core-value-sort">Sort Order</Label>
            <Input
              id="edit-core-value-sort"
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
            />
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
