import { useEffect, useState } from 'react'

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
import { CMS_ICON_OPTIONS, getCmsIcon } from '@/lib/cms-icons'
import type {
  IrDocument,
  IrFinancialColumn,
  IrFinancialRow,
  IrInquiry,
  IrKpi,
} from '@/types/ir.types'
import type { UploadedAsset } from '@/types/uploads.types'
import type {
  CreateIrDocumentDto,
  CreateIrFinancialColumnDto,
  CreateIrFinancialRowDto,
  CreateIrKpiDto,
} from '@/api/ir.api'

type UploadFn = (file: File) => Promise<UploadedAsset>

export function IrKpiDialog({
  open,
  onClose,
  onSubmit,
  kpi,
  isPending = false,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateIrKpiDto) => void
  kpi?: IrKpi | null
  isPending?: boolean
}) {
  const [formData, setFormData] = useState<CreateIrKpiDto>({
    label: '',
    value: '',
    suffix: '',
    icon: 'BarChart3',
    sortOrder: 0,
  })

  useEffect(() => {
    if (!open) return
    setFormData({
      label: kpi?.label ?? '',
      value: kpi?.value ?? '',
      suffix: kpi?.suffix ?? '',
      icon: kpi?.icon ?? 'BarChart3',
      sortOrder: kpi?.sortOrder ?? 0,
    })
  }, [kpi, open])

  const Icon = getCmsIcon(formData.icon)

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{kpi ? 'Edit KPI' : 'Create KPI'}</DialogTitle>
          <DialogDescription>
            Add a performance KPI card for the investor relations page.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit({ ...formData, suffix: formData.suffix || undefined })
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="ir-kpi-label">Label</Label>
            <Input
              id="ir-kpi-label"
              required
              value={formData.label}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, label: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ir-kpi-value">Value</Label>
              <Input
                id="ir-kpi-value"
                required
                value={formData.value}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, value: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ir-kpi-suffix">Suffix</Label>
              <Input
                id="ir-kpi-suffix"
                value={formData.suffix}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, suffix: event.target.value }))
                }
              />
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="ir-kpi-sort-order">Sort Order</Label>
            <Input
              id="ir-kpi-sort-order"
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
              {isPending ? 'Saving...' : kpi ? 'Save Changes' : 'Create KPI'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function IrFinancialColumnDialog({
  open,
  onClose,
  onSubmit,
  column,
  isPending = false,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateIrFinancialColumnDto) => void
  column?: IrFinancialColumn | null
  isPending?: boolean
}) {
  const [formData, setFormData] = useState<CreateIrFinancialColumnDto>({
    label: '',
    key: '',
    sortOrder: 0,
  })

  useEffect(() => {
    if (!open) return
    setFormData({
      label: column?.label ?? '',
      key: column?.key ?? '',
      sortOrder: column?.sortOrder ?? 0,
    })
  }, [column, open])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{column ? 'Edit Financial Column' : 'Create Financial Column'}</DialogTitle>
          <DialogDescription>
            Columns define each metric shown in the financial table.
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
            <Label htmlFor="ir-column-label">Label</Label>
            <Input
              id="ir-column-label"
              required
              value={formData.label}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, label: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ir-column-key">Key</Label>
            <Input
              id="ir-column-key"
              required
              value={formData.key}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, key: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ir-column-sort-order">Sort Order</Label>
            <Input
              id="ir-column-sort-order"
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
              {isPending ? 'Saving...' : column ? 'Save Changes' : 'Create Column'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function IrFinancialRowDialog({
  open,
  onClose,
  onSubmit,
  columns,
  row,
  isPending = false,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateIrFinancialRowDto) => void
  columns: IrFinancialColumn[]
  row?: IrFinancialRow | null
  isPending?: boolean
}) {
  const [formData, setFormData] = useState<CreateIrFinancialRowDto>({
    period: '',
    periodType: 'annual',
    sortOrder: 0,
    cells: [],
  })

  useEffect(() => {
    if (!open) return
    setFormData({
      period: row?.period ?? '',
      periodType: row?.periodType ?? 'annual',
      sortOrder: row?.sortOrder ?? 0,
      cells: columns.map((column) => ({
        columnId: column.id,
        value:
          row?.cells.find((cell) => cell.columnId === column.id)?.value ?? '',
      })),
    })
  }, [columns, open, row])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{row ? 'Edit Financial Row' : 'Create Financial Row'}</DialogTitle>
          <DialogDescription>
            Enter one row for a reporting period and populate values for each column.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit(formData)
          }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ir-row-period">Period</Label>
              <Input
                id="ir-row-period"
                required
                value={formData.period}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, period: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ir-row-period-type">Period Type</Label>
              <Select
                value={formData.periodType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    periodType: value as CreateIrFinancialRowDto['periodType'],
                  }))
                }
              >
                <SelectTrigger id="ir-row-period-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ir-row-sort-order">Sort Order</Label>
            <Input
              id="ir-row-sort-order"
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

          <div className="space-y-3 rounded-xl border p-4">
            <div>
              <h3 className="font-medium">Cell Values</h3>
              <p className="text-sm text-muted-foreground">
                Enter the value for each defined financial column.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {columns.map((column, index) => (
                <div className="space-y-2" key={column.id}>
                  <Label htmlFor={`ir-row-cell-${column.id}`}>{column.label}</Label>
                  <Input
                    id={`ir-row-cell-${column.id}`}
                    value={formData.cells[index]?.value ?? ''}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        cells: prev.cells.map((cell, cellIndex) =>
                          cellIndex === index
                            ? { ...cell, value: event.target.value }
                            : cell
                        ),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isPending || columns.length === 0} type="submit">
              {isPending ? 'Saving...' : row ? 'Save Changes' : 'Create Row'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function IrDocumentDialog({
  open,
  onClose,
  onSubmit,
  uploadFile,
  document,
  isPending = false,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (dto: CreateIrDocumentDto) => void
  uploadFile: UploadFn
  document?: IrDocument | null
  isPending?: boolean
}) {
  const [formData, setFormData] = useState<CreateIrDocumentDto>({
    title: '',
    year: '',
    category: 'report',
    filePath: '',
    sortOrder: 0,
  })

  useEffect(() => {
    if (!open) return
    setFormData({
      title: document?.title ?? '',
      year: document?.year ?? '',
      category: document?.category ?? 'report',
      filePath: document?.filePath ?? '',
      sortOrder: document?.sortOrder ?? 0,
    })
  }, [document, open])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{document ? 'Edit IR Document' : 'Create IR Document'}</DialogTitle>
          <DialogDescription>
            Upload a document and assign the correct category.
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
            <Label htmlFor="ir-document-title">Title</Label>
            <Input
              id="ir-document-title"
              required
              value={formData.title}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ir-document-year">Year</Label>
              <Input
                id="ir-document-year"
                required
                value={formData.year}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, year: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ir-document-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value as CreateIrDocumentDto['category'],
                  }))
                }
              >
                <SelectTrigger id="ir-document-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="filing">Filing</SelectItem>
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
              label="Upload document PDF"
              maxSizeMB={12}
              onSuccess={(path) =>
                setFormData((prev) => ({ ...prev, filePath: path }))
              }
              onUpload={uploadFile}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ir-document-sort-order">Sort Order</Label>
            <Input
              id="ir-document-sort-order"
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
              {isPending ? 'Saving...' : document ? 'Save Changes' : 'Create Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function IrInquiryDetailDialog({
  open,
  onClose,
  inquiry,
}: {
  open: boolean
  onClose: () => void
  inquiry?: IrInquiry | null
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>
            Full message and review context for the selected investor inquiry.
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
