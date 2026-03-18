import { useState } from 'react'

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
import { useCreateCoreValue } from './useCms'

type CreateCoreValueDialogProps = {
  open: boolean
  onClose: () => void
}

const defaultState = {
  title: '',
  description: '',
  icon: 'Star',
  sortOrder: '0',
}

export default function CreateCoreValueDialog({ open, onClose }: CreateCoreValueDialogProps) {
  const createMutation = useCreateCoreValue()
  const [formData, setFormData] = useState(defaultState)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    createMutation.mutate(
      {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
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
          <DialogTitle>Add Core Value</DialogTitle>
          <DialogDescription>Create a new core value card.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="core-value-title">Title</Label>
            <Input
              id="core-value-title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="core-value-description">Description</Label>
            <Textarea
              id="core-value-description"
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
            <Label htmlFor="core-value-sort">Sort Order</Label>
            <Input
              id="core-value-sort"
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
              {createMutation.isPending ? 'Creating...' : 'Create Core Value'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
