import { GripVertical, Plus, Trash2, X } from 'lucide-react'

import TooltipWrapper from '@/components/system/TooltipWrapper'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { IrFinancialColumn } from '@/types/ir.types'

export type WorkbenchColumn = IrFinancialColumn & { isNew?: boolean }

export default function IrFinancialMetricsDrawer({
  open,
  columns,
  onClose,
  onAdd,
  onChange,
  onDelete,
  onMove,
}: {
  open: boolean
  columns: WorkbenchColumn[]
  onClose: () => void
  onAdd: () => void
  onChange: (columnId: string, patch: Partial<WorkbenchColumn>) => void
  onDelete: (columnId: string) => void
  onMove: (fromIndex: number, toIndex: number) => void
}) {
  return (
    open ? (
      <>
        <button
          className="fixed inset-0 z-40 bg-slate-950/30"
          onClick={onClose}
          type="button"
        />
        <aside className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
            <div className="space-y-6 p-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                    Metrics
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">Manage Financial Metrics</h2>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    Rename metrics, change their order, or remove them from the workbench.
                    Drag cards to reorder the table columns.
                  </p>
                </div>
                <Button onClick={onClose} size="icon" type="button" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between gap-3">
                <Badge variant="outline">{columns.length} metrics</Badge>
                <Button onClick={onAdd} type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Metric
                </Button>
              </div>

              <div className="space-y-3">
                {columns.map((column, index) => (
                  <div
                    className="space-y-4 border border-slate-200 bg-slate-50/40 p-4"
                    draggable
                    key={column.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move'
                      event.dataTransfer.setData('text/plain', String(index))
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      const fromIndex = Number(event.dataTransfer.getData('text/plain'))
                      if (!Number.isNaN(fromIndex)) {
                        onMove(fromIndex, index)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">Metric {index + 1}</p>
                          <p className="text-xs text-muted-foreground">
                            Drag to change display order
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          disabled={index === 0}
                          onClick={() => onMove(index, index - 1)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Up
                        </Button>
                        <Button
                          disabled={index === columns.length - 1}
                          onClick={() => onMove(index, index + 1)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Down
                        </Button>
                        <TooltipWrapper content="Delete metric">
                          <Button onClick={() => onDelete(column.id)} size="icon" type="button" variant="ghost">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipWrapper>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`ir-financial-column-label-${column.id}`}>Label</Label>
                        <Input
                          id={`ir-financial-column-label-${column.id}`}
                          onChange={(event) => onChange(column.id, { label: event.target.value })}
                          value={column.label}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`ir-financial-column-key-${column.id}`}>Key</Label>
                        <Input
                          id={`ir-financial-column-key-${column.id}`}
                          onChange={(event) => onChange(column.id, { key: event.target.value })}
                          value={column.key}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </aside>
      </>
    ) : null
  )
}
