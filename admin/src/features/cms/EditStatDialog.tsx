import { useEffect, useState } from 'react'

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
import type { Stat } from '@/types/cms.types'
import { useUpdateStat } from './useCms'

type EditStatDialogProps = {
  open: boolean
  onClose: () => void
  stat: Stat
}

export default function EditStatDialog({ open, onClose, stat }: EditStatDialogProps) {
  const updateMutation = useUpdateStat()
  const [formData, setFormData] = useState({
    label: stat.label,
    value: String(stat.value),
    suffix: stat.suffix ?? '',
    sortOrder: String(stat.sortOrder),
  })

  useEffect(() => {
    if (open) {
      setFormData({
        label: stat.label,
        value: String(stat.value),
        suffix: stat.suffix ?? '',
        sortOrder: String(stat.sortOrder),
      })
    }
  }, [open, stat])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    updateMutation.mutate(
      {
        id: stat.id,
        dto: {
          label: formData.label,
          value: Number(formData.value) || 0,
          suffix: formData.suffix,
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
          <DialogTitle>Edit Stat</DialogTitle>
          <DialogDescription>Update this metric card.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-stat-label">Label</Label>
            <Input
              id="edit-stat-label"
              value={formData.label}
              onChange={(event) => setFormData((prev) => ({ ...prev, label: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-stat-value">Value</Label>
            <Input
              id="edit-stat-value"
              type="number"
              min={0}
              value={formData.value}
              onChange={(event) => setFormData((prev) => ({ ...prev, value: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-stat-suffix">Suffix (optional)</Label>
            <Input
              id="edit-stat-suffix"
              value={formData.suffix}
              onChange={(event) => setFormData((prev) => ({ ...prev, suffix: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-stat-sort-order">Sort Order</Label>
            <Input
              id="edit-stat-sort-order"
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
