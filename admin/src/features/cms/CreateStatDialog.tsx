import { useState } from 'react'

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
import { useCreateStat } from './useCms'

type CreateStatDialogProps = {
  open: boolean
  onClose: () => void
}

const defaultState = {
  label: '',
  value: '0',
  suffix: '',
  sortOrder: '0',
}

export default function CreateStatDialog({ open, onClose }: CreateStatDialogProps) {
  const createMutation = useCreateStat()
  const [formData, setFormData] = useState(defaultState)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    createMutation.mutate(
      {
        label: formData.label,
        value: Number(formData.value) || 0,
        suffix: formData.suffix || undefined,
        sortOrder: Number(formData.sortOrder) || 0,
      },
      {
        onSuccess: () => {
          onClose()
          setFormData(defaultState)
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
          setFormData(defaultState)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stat</DialogTitle>
          <DialogDescription>Create a new metric card.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="stat-label">Label</Label>
            <Input
              id="stat-label"
              value={formData.label}
              onChange={(event) => setFormData((prev) => ({ ...prev, label: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stat-value">Value</Label>
            <Input
              id="stat-value"
              type="number"
              min={0}
              value={formData.value}
              onChange={(event) => setFormData((prev) => ({ ...prev, value: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stat-suffix">Suffix (optional)</Label>
            <Input
              id="stat-suffix"
              value={formData.suffix}
              onChange={(event) => setFormData((prev) => ({ ...prev, suffix: event.target.value }))}
              placeholder="e.g. +"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stat-sort-order">Sort Order</Label>
            <Input
              id="stat-sort-order"
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
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Stat'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
