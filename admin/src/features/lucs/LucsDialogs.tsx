import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

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
import type { LucsInquiry, LucsPillar } from '@/types/lucs.types'
import type { CreateLucsPillarDto } from '@/api/lucs.api'

export function LucsPillarDialog({
  open,
  onClose,
  onSubmit,
  pillar,
  isPending = false,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateLucsPillarDto) => void
  pillar?: LucsPillar | null
  isPending?: boolean
}) {
  const [formData, setFormData] = useState<CreateLucsPillarDto>({
    title: '',
    description: '',
    icon: 'HandHeart',
    sortOrder: 0,
    bulletPoints: [{ point: '', description: '' }],
  })

  useEffect(() => {
    if (!open) return
    setFormData({
      title: pillar?.title ?? '',
      description: pillar?.description ?? '',
      icon: pillar?.icon ?? 'HandHeart',
      sortOrder: pillar?.sortOrder ?? 0,
      bulletPoints:
        pillar?.bulletPoints.length
          ? pillar.bulletPoints.map((item) => ({
              point: item.point,
              description: item.description ?? '',
            }))
          : [{ point: '', description: '' }],
    })
  }, [open, pillar])

  const Icon = getCmsIcon(formData.icon)

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{pillar ? 'Edit LUCS Pillar' : 'Create LUCS Pillar'}</DialogTitle>
          <DialogDescription>
            Configure the pillar content and supporting bullet points for the What We Do tab.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit({
              ...formData,
              description: formData.description || undefined,
              bulletPoints: formData.bulletPoints.filter(
                (item) => item.point.trim().length > 0
              ),
            })
          }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lucs-pillar-title">Title</Label>
                <Input
                  id="lucs-pillar-title"
                  required
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, title: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lucs-pillar-description">Description</Label>
                <Textarea
                  id="lucs-pillar-description"
                  rows={5}
                  value={formData.description ?? ''}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lucs-pillar-sort-order">Sort Order</Label>
                <Input
                  id="lucs-pillar-sort-order"
                  min={0}
                  type="number"
                  value={String(formData.sortOrder ?? 0)}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      sortOrder: Number(event.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
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
                    bulletPoints: [
                      ...prev.bulletPoints,
                      { point: '', description: '' },
                    ],
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Point
              </Button>
            </div>
            <div className="space-y-4">
              {formData.bulletPoints.map((bulletPoint, index) => (
                <div className="grid gap-3 rounded-xl border bg-muted/20 p-3 md:grid-cols-[1fr_1fr_40px]" key={`${index}-${bulletPoint.point}`}>
                  <Input
                    placeholder="Point"
                    value={bulletPoint.point}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        bulletPoints: prev.bulletPoints.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, point: event.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                  <Textarea
                    placeholder="Optional description"
                    rows={2}
                    value={bulletPoint.description ?? ''}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        bulletPoints: prev.bulletPoints.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, description: event.target.value }
                            : item
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
                        bulletPoints: prev.bulletPoints.filter(
                          (_item, itemIndex) => itemIndex !== index
                        ),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Saving...' : pillar ? 'Save Changes' : 'Create Pillar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function LucsInquiryDetailDialog({
  open,
  onClose,
  inquiry,
}: {
  open: boolean
  onClose: () => void
  inquiry?: LucsInquiry | null
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>
            Full message and current review state for the selected LUCS inquiry.
          </DialogDescription>
        </DialogHeader>
        {inquiry ? (
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="font-medium">{inquiry.name}</p>
              <p className="text-sm text-muted-foreground">{inquiry.email}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                {inquiry.message}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border bg-white px-4 py-3">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border bg-white px-4 py-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium">
                  {inquiry.isReviewed
                    ? `Reviewed${inquiry.reviewedAt ? ` on ${new Date(inquiry.reviewedAt).toLocaleString()}` : ''}`
                    : 'Unread'}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
