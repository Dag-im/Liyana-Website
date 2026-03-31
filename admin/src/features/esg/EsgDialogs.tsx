import { useEffect, useMemo, useState } from 'react'
import { FileText, Plus, Trash2 } from 'lucide-react'

import { FileUpload } from '@/components/shared/FileUpload'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import type {
  EsgGovernanceItem,
  EsgMetric,
  EsgPillar,
  EsgReport,
} from '@/types/esg.types'
import type { UploadedAsset } from '@/types/uploads.types'
import type {
  CreateEsgGovernanceItemDto,
  CreateEsgMetricDto,
  CreateEsgPillarDto,
  CreateEsgReportDto,
} from '@/api/esg.api'

type UploadFn = (file: File) => Promise<UploadedAsset>

type PillarDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateEsgPillarDto) => void
  uploadFile: UploadFn
  pillar?: EsgPillar | null
  isPending?: boolean
}

export function EsgPillarDialog({
  open,
  onClose,
  onSubmit,
  uploadFile,
  pillar,
  isPending = false,
}: PillarDialogProps) {
  const [formData, setFormData] = useState<CreateEsgPillarDto>({
    title: '',
    description: '',
    icon: 'Leaf',
    sortOrder: 0,
    document: '',
    initiatives: [''],
  })

  useEffect(() => {
    if (!open) return

    setFormData({
      title: pillar?.title ?? '',
      description: pillar?.description ?? '',
      icon: pillar?.icon ?? 'Leaf',
      sortOrder: pillar?.sortOrder ?? 0,
      document: pillar?.document ?? '',
      initiatives:
        pillar?.initiatives.length
          ? pillar.initiatives.map((initiative) => initiative.text)
          : [''],
    })
  }, [open, pillar])

  const SelectedIcon = getCmsIcon(formData.icon)

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{pillar ? 'Edit ESG Pillar' : 'Create ESG Pillar'}</DialogTitle>
          <DialogDescription>
            Manage the copy, icon, document, and initiative list for this pillar.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit({
              ...formData,
              document: formData.document || undefined,
              initiatives: formData.initiatives.filter((item) => item.trim().length > 0),
            })
          }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="esg-pillar-title">Title</Label>
                <Input
                  id="esg-pillar-title"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, title: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="esg-pillar-description">Description</Label>
                <Textarea
                  id="esg-pillar-description"
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="esg-pillar-sort-order">Sort Order</Label>
                <Input
                  id="esg-pillar-sort-order"
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
                  <SelectedIcon className="h-5 w-5 text-cyan-700" />
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
                <Label>Document (optional PDF)</Label>
                <FileUpload
                  accept=".pdf,application/pdf"
                  currentPath={formData.document || undefined}
                  label="Upload supporting document"
                  maxSizeMB={10}
                  onSuccess={(path) =>
                    setFormData((prev) => ({ ...prev, document: path }))
                  }
                  onUpload={uploadFile}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Initiatives</h3>
                <p className="text-sm text-muted-foreground">
                  Add each initiative as a separate line item.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    initiatives: [...prev.initiatives, ''],
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Initiative
              </Button>
            </div>

            <div className="space-y-3">
              {formData.initiatives.map((initiative, index) => (
                <div className="flex items-center gap-2" key={`${index}-${initiative}`}>
                  <Input
                    value={initiative}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        initiatives: prev.initiatives.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item
                        ),
                      }))
                    }
                    placeholder={`Initiative ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={formData.initiatives.length === 1}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        initiatives: prev.initiatives.filter(
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

type MetricDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateEsgMetricDto) => void
  metric?: EsgMetric | null
  isPending?: boolean
}

export function EsgMetricDialog({
  open,
  onClose,
  onSubmit,
  metric,
  isPending = false,
}: MetricDialogProps) {
  const [formData, setFormData] = useState<CreateEsgMetricDto>({
    label: '',
    value: '',
    suffix: '',
    description: '',
    sortOrder: 0,
  })

  useEffect(() => {
    if (!open) return
    setFormData({
      label: metric?.label ?? '',
      value: metric?.value ?? '',
      suffix: metric?.suffix ?? '',
      description: metric?.description ?? '',
      sortOrder: metric?.sortOrder ?? 0,
    })
  }, [metric, open])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{metric ? 'Edit ESG Metric' : 'Create ESG Metric'}</DialogTitle>
          <DialogDescription>
            Configure the values shown in the ESG metrics strip.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit({
              ...formData,
              suffix: formData.suffix || undefined,
              description: formData.description || undefined,
            })
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="esg-metric-label">Label</Label>
            <Input
              id="esg-metric-label"
              required
              value={formData.label}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, label: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="esg-metric-value">Value</Label>
              <Input
                id="esg-metric-value"
                required
                value={formData.value}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, value: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esg-metric-suffix">Suffix</Label>
              <Input
                id="esg-metric-suffix"
                value={formData.suffix}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, suffix: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="esg-metric-description">Description</Label>
            <Textarea
              id="esg-metric-description"
              rows={4}
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="esg-metric-sort-order">Sort Order</Label>
            <Input
              id="esg-metric-sort-order"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Saving...' : metric ? 'Save Changes' : 'Create Metric'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type GovernanceDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateEsgGovernanceItemDto) => void
  uploadFile: UploadFn
  item?: EsgGovernanceItem | null
  isPending?: boolean
}

export function EsgGovernanceDialog({
  open,
  onClose,
  onSubmit,
  uploadFile,
  item,
  isPending = false,
}: GovernanceDialogProps) {
  const [formData, setFormData] = useState<CreateEsgGovernanceItemDto>({
    title: '',
    description: '',
    type: 'policy',
    document: '',
    sortOrder: 0,
  })

  useEffect(() => {
    if (!open) return
    setFormData({
      title: item?.title ?? '',
      description: item?.description ?? '',
      type: item?.type ?? 'policy',
      document: item?.document ?? '',
      sortOrder: item?.sortOrder ?? 0,
    })
  }, [item, open])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Governance Item' : 'Create Governance Item'}</DialogTitle>
          <DialogDescription>
            Create policies, certifications, and risk items for the governance tab.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit({ ...formData, document: formData.document || undefined })
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="esg-governance-title">Title</Label>
            <Input
              id="esg-governance-title"
              required
              value={formData.title}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="esg-governance-type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  type: value as CreateEsgGovernanceItemDto['type'],
                }))
              }
            >
              <SelectTrigger id="esg-governance-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="risk">Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="esg-governance-description">Description</Label>
            <Textarea
              id="esg-governance-description"
              rows={5}
              required
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Optional Document</Label>
            <FileUpload
              accept=".pdf,application/pdf"
              currentPath={formData.document || undefined}
              label="Upload governance file"
              maxSizeMB={10}
              onSuccess={(path) =>
                setFormData((prev) => ({ ...prev, document: path }))
              }
              onUpload={uploadFile}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="esg-governance-sort-order">Sort Order</Label>
            <Input
              id="esg-governance-sort-order"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Saving...' : item ? 'Save Changes' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type ReportDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateEsgReportDto) => void
  uploadFile: UploadFn
  report?: EsgReport | null
  isPending?: boolean
}

export function EsgReportDialog({
  open,
  onClose,
  onSubmit,
  uploadFile,
  report,
  isPending = false,
}: ReportDialogProps) {
  const [formData, setFormData] = useState<CreateEsgReportDto>({
    title: '',
    year: '',
    type: 'annual',
    filePath: '',
    sortOrder: 0,
  })

  useEffect(() => {
    if (!open) return
    setFormData({
      title: report?.title ?? '',
      year: report?.year ?? '',
      type: report?.type ?? 'annual',
      filePath: report?.filePath ?? '',
      sortOrder: report?.sortOrder ?? 0,
    })
  }, [open, report])

  const fileLabel = useMemo(
    () => formData.filePath.split('/').pop() || 'No document uploaded',
    [formData.filePath]
  )

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{report ? 'Edit ESG Report' : 'Create ESG Report'}</DialogTitle>
          <DialogDescription>
            Upload the source PDF and define its metadata for the reports list.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit(formData)
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="esg-report-title">Title</Label>
            <Input
              id="esg-report-title"
              required
              value={formData.title}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="esg-report-year">Year</Label>
              <Input
                id="esg-report-year"
                required
                value={formData.year}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, year: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esg-report-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: value as CreateEsgReportDto['type'],
                  }))
                }
              >
                <SelectTrigger id="esg-report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="esg">ESG</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>PDF File</Label>
            <FileUpload
              accept=".pdf,application/pdf"
              currentPath={formData.filePath || undefined}
              label="Upload ESG report PDF"
              maxSizeMB={12}
              onSuccess={(path) =>
                setFormData((prev) => ({ ...prev, filePath: path }))
              }
              onUpload={uploadFile}
            />
            {formData.filePath ? (
              <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="truncate">{fileLabel}</span>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="esg-report-sort-order">Sort Order</Label>
            <Input
              id="esg-report-sort-order"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isPending || !formData.filePath} type="submit">
              {isPending ? 'Saving...' : report ? 'Save Changes' : 'Create Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
