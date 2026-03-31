import { CheckCheck, CheckCircle2, Plus, Settings2, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import EmptyState from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import type { IrFinancialColumn, IrFinancialRow } from '@/types/ir.types'
import IrFinancialMetricsDrawer, { type WorkbenchColumn } from './IrFinancialMetricsDrawer'
import IrFinancialSaveBar from './IrFinancialSaveBar'

type WorkbenchRow = {
  id: string
  period: string
  periodType: 'annual' | 'quarterly'
  sortOrder: number
  isPublished: boolean
  isNew?: boolean
}

type WorkbenchState = {
  columns: WorkbenchColumn[]
  rows: WorkbenchRow[]
  cells: Record<string, Record<string, string>>
  deletedColumnIds: string[]
  deletedRowIds: string[]
}

type DiffSummary = {
  hasChanges: boolean
  modifiedCells: number
  modifiedRows: number
}

type RowGroup = {
  year: string
  label: string
  rows: WorkbenchRow[]
  missingEntries: Array<(typeof PERIOD_SEQUENCE)[number]>
}

type RowTypeFilter = 'all' | 'annual' | 'quarterly'

const PERIOD_SEQUENCE = ['Q1', 'Q2', 'Q3', 'Q4', 'Annual Report'] as const
const VALID_FINANCIAL_VALUE = /^[\s$€£¥₦₱₹%(),.\-+0-9/]*$/

export default function IrFinancialWorkbench({
  columns,
  rows,
  isLoading,
  createColumn,
  updateColumn,
  deleteColumn,
  createRow,
  updateRow,
  deleteRow,
  publishRow,
  unpublishRow,
}: {
  columns: IrFinancialColumn[]
  rows: IrFinancialRow[]
  isLoading: boolean
  createColumn: (dto: { label: string; key: string; sortOrder?: number }) => Promise<IrFinancialColumn>
  updateColumn: (args: {
    id: string
    dto: { label?: string; key?: string; sortOrder?: number }
  }) => Promise<IrFinancialColumn>
  deleteColumn: (id: string) => Promise<unknown>
  createRow: (dto: {
    period: string
    periodType: 'annual' | 'quarterly'
    sortOrder?: number
    cells: Array<{ columnId: string; value: string }>
  }) => Promise<IrFinancialRow>
  updateRow: (args: {
    id: string
    dto: {
      period?: string
      periodType?: 'annual' | 'quarterly'
      sortOrder?: number
      cells?: Array<{ columnId: string; value: string }>
    }
  }) => Promise<IrFinancialRow>
  deleteRow: (id: string) => Promise<unknown>
  publishRow: (id: string) => Promise<unknown>
  unpublishRow: (id: string) => Promise<unknown>
}) {
  const datasetKey = useMemo(
    () =>
      JSON.stringify({
        columns: columns.map((column) => [column.id, column.label, column.key, column.sortOrder]),
        rows: rows.map((row) => [
          row.id,
          row.period,
          row.periodType,
          row.sortOrder,
          row.isPublished,
          row.cells.map((cell) => [cell.columnId, cell.value]),
        ]),
      }),
    [columns, rows]
  )

  const [initialState, setInitialState] = useState<WorkbenchState>(() => buildWorkbenchState(columns, rows))
  const [workingState, setWorkingState] = useState<WorkbenchState>(() => buildWorkbenchState(columns, rows))
  const [activeCell, setActiveCell] = useState<{ rowId: string; columnId: string } | null>(null)
  const [metricsDrawerOpen, setMetricsDrawerOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [typeFilter, setTypeFilter] = useState<RowTypeFilter>('all')
  const cellRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    const nextState = buildWorkbenchState(columns, rows)
    setInitialState(nextState)
    setWorkingState(nextState)
    setActiveCell(null)
    setSelectedRows([])
    setTypeFilter('all')
  }, [datasetKey, columns, rows])

  useEffect(() => {
    if (!activeCell) return
    const key = getCellKey(activeCell.rowId, activeCell.columnId)
    const input = cellRefs.current[key]
    if (!input) return
    window.requestAnimationFrame(() => {
      input.focus()
      input.select()
    })
  }, [activeCell])

  const diff = useMemo(() => getDiffSummary(initialState, workingState), [initialState, workingState])
  const filteredRows = useMemo(
    () =>
      typeFilter === 'all'
        ? workingState.rows
        : workingState.rows.filter((row) => row.periodType === typeFilter),
    [typeFilter, workingState.rows]
  )
  const groupedRows = useMemo(() => buildRowGroups(filteredRows), [filteredRows])
  const visibleRowIds = useMemo(
    () => groupedRows.flatMap((group) => group.rows.map((row) => row.id)),
    [groupedRows]
  )
  const invalidCells = useMemo(() => getInvalidCellCount(workingState), [workingState])
  const selectedRowSet = useMemo(() => new Set(selectedRows), [selectedRows])

  const summaryCards = useMemo(
    () => [
      {
        label: 'Metrics',
        value: String(workingState.columns.length),
        hint: `${getMetricChangeCount(initialState, workingState)} changed`,
      },
      {
        label: 'Periods',
        value: String(filteredRows.length),
        hint:
          typeFilter === 'all'
            ? `${workingState.rows.filter((row) => !row.isPublished).length} drafts`
            : `${typeFilter} rows`,
      },
      {
        label: 'Selected',
        value: String(selectedRows.length),
        hint: 'Bulk actions ready',
      },
      {
        label: 'Issues',
        value: String(invalidCells),
        hint: invalidCells ? 'Resolve invalid cells before save' : 'All values valid',
      },
    ],
    [filteredRows.length, initialState, invalidCells, selectedRows.length, typeFilter, workingState]
  )

  const setCellValue = (rowId: string, columnId: string, value: string) => {
    setWorkingState((prev) => ({
      ...prev,
      cells: {
        ...prev.cells,
        [rowId]: {
          ...(prev.cells[rowId] ?? {}),
          [columnId]: value,
        },
      },
    }))
  }

  const setRowPatch = (rowId: string, patch: Partial<WorkbenchRow>) => {
    setWorkingState((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    }))
  }

  const addMetric = () => {
    const tempId = createTempId('column')
    setWorkingState((prev) => {
      const nextColumns = [
        ...prev.columns,
        {
          id: tempId,
          label: `Metric ${prev.columns.length + 1}`,
          key: `metric_${prev.columns.length + 1}`,
          sortOrder: prev.columns.length,
          isNew: true,
        },
      ]

      return {
        ...prev,
        columns: nextColumns,
        cells: Object.fromEntries(
          prev.rows.map((row) => [
            row.id,
            {
              ...(prev.cells[row.id] ?? {}),
              [tempId]: '',
            },
          ])
        ),
      }
    })
  }

  const updateMetric = (columnId: string, patch: Partial<WorkbenchColumn>) => {
    setWorkingState((prev) => ({
      ...prev,
      columns: prev.columns.map((column) =>
        column.id === columnId ? { ...column, ...patch } : column
      ),
    }))
  }

  const moveMetric = (fromIndex: number, toIndex: number) => {
    setWorkingState((prev) => ({
      ...prev,
      columns: reorder(prev.columns, fromIndex, toIndex).map((column, index) => ({
        ...column,
        sortOrder: index,
      })),
    }))
  }

  const deleteMetricLocally = (columnId: string) => {
    setWorkingState((prev) => {
      const target = prev.columns.find((column) => column.id === columnId)
      if (!target) return prev

      const nextCells = Object.fromEntries(
        prev.rows.map((row) => {
          const rowCells = { ...(prev.cells[row.id] ?? {}) }
          delete rowCells[columnId]
          return [row.id, rowCells]
        })
      )

      return {
        ...prev,
        columns: prev.columns
          .filter((column) => column.id !== columnId)
          .map((column, index) => ({ ...column, sortOrder: index })),
        deletedColumnIds:
          target.isNew || prev.deletedColumnIds.includes(columnId)
            ? prev.deletedColumnIds
            : [...prev.deletedColumnIds, columnId],
        cells: nextCells,
      }
    })
  }

  const addRow = (periodType: 'annual' | 'quarterly', period = '') => {
    const tempId = createTempId('row')
    setWorkingState((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          id: tempId,
          period,
          periodType,
          sortOrder: prev.rows.length,
          isPublished: false,
          isNew: true,
        },
      ],
      cells: {
        ...prev.cells,
        [tempId]: Object.fromEntries(prev.columns.map((column) => [column.id, ''])),
      },
    }))
  }

  const addMissingEntry = (year: string, entry: (typeof PERIOD_SEQUENCE)[number]) => {
    const period =
      entry === 'Annual Report' ? `FY ${year} Annual Report` : `${entry} ${year}`
    addRow(entry === 'Annual Report' ? 'annual' : 'quarterly', period)
  }

  const removeRowLocally = (rowId: string) => {
    setWorkingState((prev) => {
      const target = prev.rows.find((row) => row.id === rowId)
      if (!target) return prev
      const nextCells = { ...prev.cells }
      delete nextCells[rowId]

      return {
        ...prev,
        rows: prev.rows.filter((row) => row.id !== rowId).map((row, index) => ({
          ...row,
          sortOrder: index,
        })),
        deletedRowIds:
          target.isNew || prev.deletedRowIds.includes(rowId)
            ? prev.deletedRowIds
            : [...prev.deletedRowIds, rowId],
        cells: nextCells,
      }
    })
    setSelectedRows((prev) => prev.filter((id) => id !== rowId))
    if (activeCell?.rowId === rowId) {
      setActiveCell(null)
    }
  }

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    )
  }

  const toggleAllRows = () => {
    setSelectedRows((prev) => (prev.length === visibleRowIds.length ? [] : visibleRowIds))
  }

  const bulkSetPublication = (isPublished: boolean) => {
    setWorkingState((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        selectedRowSet.has(row.id) ? { ...row, isPublished } : row
      ),
    }))
    setSelectedRows([])
  }

  const bulkDeleteRows = () => {
    selectedRows.forEach((rowId) => removeRowLocally(rowId))
  }

  const discardChanges = () => {
    const reset = cloneWorkbenchState(initialState)
    setWorkingState(reset)
    setSelectedRows([])
    setActiveCell(null)
  }

  const navigateCell = (
    rowId: string,
    columnId: string,
    direction: 'left' | 'right' | 'up' | 'down' | 'tab'
  ) => {
    const rowIndex = visibleRowIds.indexOf(rowId)
    const columnIndex = workingState.columns.findIndex((column) => column.id === columnId)
    if (rowIndex === -1 || columnIndex === -1) return

    let nextRowIndex = rowIndex
    let nextColumnIndex = columnIndex

    if (direction === 'left') nextColumnIndex = Math.max(0, columnIndex - 1)
    if (direction === 'right') nextColumnIndex = Math.min(workingState.columns.length - 1, columnIndex + 1)
    if (direction === 'up') nextRowIndex = Math.max(0, rowIndex - 1)
    if (direction === 'down') nextRowIndex = Math.min(visibleRowIds.length - 1, rowIndex + 1)
    if (direction === 'tab') {
      if (columnIndex === workingState.columns.length - 1) {
        nextColumnIndex = 0
        nextRowIndex = Math.min(visibleRowIds.length - 1, rowIndex + 1)
      } else {
        nextColumnIndex = columnIndex + 1
      }
    }

    const nextRowId = visibleRowIds[nextRowIndex]
    const nextColumnId = workingState.columns[nextColumnIndex]?.id
    if (nextRowId && nextColumnId) {
      setActiveCell({ rowId: nextRowId, columnId: nextColumnId })
    }
  }

  const saveAllChanges = async () => {
    if (!workingState.columns.length) {
      toast.error('Add at least one metric before saving')
      return
    }

    if (invalidCells > 0) {
      toast.error('Resolve invalid cell values before saving')
      return
    }

    if (workingState.columns.some((column) => !column.label.trim() || !column.key.trim())) {
      toast.error('Every metric needs both a label and a key')
      return
    }

    if (workingState.rows.some((row) => !row.period.trim())) {
      toast.error('Every period row needs a label')
      return
    }

    setIsSavingAll(true)

    try {
      const snapshot = cloneWorkbenchState(workingState)
      const columnIdMap = new Map<string, string>()
      const rowIdMap = new Map<string, string>()

      for (const [index, column] of snapshot.columns.entries()) {
        const payload = {
          label: column.label.trim(),
          key: column.key.trim(),
          sortOrder: index,
        }

        if (column.isNew) {
          const originalId = column.id
          const saved = await createColumn(payload)
          columnIdMap.set(originalId, saved.id)
          column.id = saved.id
          column.sortOrder = saved.sortOrder
          delete column.isNew
          continue
        }

        if (didColumnChange(initialState, column, index)) {
          await updateColumn({ id: column.id, dto: payload })
        }
      }

      snapshot.columns = snapshot.columns.map((column, index) => ({
        ...column,
        id: columnIdMap.get(column.id) ?? column.id,
        sortOrder: index,
      }))
      snapshot.cells = remapColumnsInCells(snapshot.cells, columnIdMap)

      for (const [index, row] of snapshot.rows.entries()) {
        const payload = {
          period: row.period.trim(),
          periodType: row.periodType,
          sortOrder: index,
          cells: snapshot.columns.map((column) => ({
            columnId: column.id,
            value: snapshot.cells[row.id]?.[column.id] ?? '',
          })),
        }

        if (row.isNew) {
          const originalId = row.id
          const saved = await createRow(payload)
          rowIdMap.set(originalId, saved.id)
          row.id = saved.id
          row.sortOrder = saved.sortOrder
          delete row.isNew
          if (!row.isPublished) {
            await unpublishRow(saved.id)
          }
          continue
        }

        if (didRowChange(initialState, snapshot, row, index)) {
          await updateRow({ id: row.id, dto: payload })
        }

        const initialRow = initialState.rows.find((item) => item.id === row.id)
        if (initialRow && initialRow.isPublished !== row.isPublished) {
          if (row.isPublished) {
            await publishRow(row.id)
          } else {
            await unpublishRow(row.id)
          }
        }
      }

      if (rowIdMap.size > 0) {
        snapshot.rows = snapshot.rows.map((row) => ({
          ...row,
          id: rowIdMap.get(row.id) ?? row.id,
        }))
        snapshot.cells = remapRowsInCells(snapshot.cells, rowIdMap)
      }

      for (const deletedRowId of snapshot.deletedRowIds) {
        await deleteRow(deletedRowId)
      }

      for (const deletedColumnId of snapshot.deletedColumnIds) {
        await deleteColumn(deletedColumnId)
      }

      const nextState = stripWorkbenchMeta(snapshot)
      setInitialState(nextState)
      setWorkingState(nextState)
      setSelectedRows([])
      setActiveCell(null)
      toast.success('Financial workbench saved')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save the financial workbench'
      toast.error(message)
    } finally {
      setIsSavingAll(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading financial workbench...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.label} size="sm">
            <CardContent className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 border-b border-slate-200/80 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle>Financial Workbench</CardTitle>
            <CardDescription>
              Edit the entire investor table in one draft, then save all updates together.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 border border-slate-200 bg-slate-50 p-1">
              <Toggle
                className="rounded-none px-3 data-[state=on]:bg-white"
                onClick={() => setTypeFilter('all')}
                pressed={typeFilter === 'all'}
              >
                All
              </Toggle>
              <Toggle
                className="rounded-none px-3 data-[state=on]:bg-white"
                onClick={() => setTypeFilter('quarterly')}
                pressed={typeFilter === 'quarterly'}
              >
                Quarterly
              </Toggle>
              <Toggle
                className="rounded-none px-3 data-[state=on]:bg-white"
                onClick={() => setTypeFilter('annual')}
                pressed={typeFilter === 'annual'}
              >
                Annual
              </Toggle>
            </div>
            <Button type="button" variant="outline" onClick={() => setMetricsDrawerOpen(true)}>
              <Settings2 className="mr-2 h-4 w-4" />
              Manage Metrics
            </Button>
            <Button type="button" variant="outline" onClick={() => addRow('annual')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Annual Row
            </Button>
            <Button type="button" onClick={() => addRow('quarterly')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Quarterly Row
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          {selectedRows.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-200 bg-cyan-50/70 px-5 py-3">
              <div className="text-sm font-medium text-slate-900">
                {selectedRows.length} selected rows
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => bulkSetPublication(true)}>
                  Publish Selected
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => bulkSetPublication(false)}>
                  Unpublish Selected
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={bulkDeleteRows}>
                  Delete Selected
                </Button>
              </div>
            </div>
          ) : null}

          {!workingState.columns.length ? (
            <div className="p-6">
              <EmptyState
                title="No financial metrics yet"
                description="Create your first metric and the workbench will open up for table editing."
                actionLabel="Add Metric"
                onAction={addMetric}
              />
            </div>
          ) : !groupedRows.length ? (
            <div className="p-6">
              <EmptyState
                title="No rows in this view"
                description={`There are no ${typeFilter} financial rows yet. Change the filter or add a new row.`}
                actionLabel={typeFilter === 'annual' ? 'Add Annual Row' : 'Add Quarterly Row'}
                onAction={() => addRow(typeFilter === 'annual' ? 'annual' : 'quarterly')}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur">
                  <tr className="border-b border-slate-200">
                    <th className="w-12 px-4 py-3 text-left">
                      <input
                        aria-label="Select all rows"
                        checked={visibleRowIds.length > 0 && selectedRows.length === visibleRowIds.length}
                        onChange={toggleAllRows}
                        type="checkbox"
                      />
                    </th>
                    <th className="sticky left-0 z-20 min-w-[240px] bg-slate-50/95 px-4 py-3 text-left font-semibold text-slate-900">
                      Reporting Period
                    </th>
                    {workingState.columns.map((column) => (
                      <th
                        className="min-w-[170px] px-4 py-3 text-left font-semibold text-slate-900"
                        key={column.id}
                      >
                        <div className="space-y-1">
                          <p>{column.label}</p>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            {column.key}
                          </p>
                        </div>
                      </th>
                    ))}
                    <th className="w-44 px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                    <th className="w-16 px-4 py-3 text-left font-semibold text-slate-900">Remove</th>
                  </tr>
                </thead>

                {groupedRows.map((group) => (
                  <tbody key={group.year}>
                    <tr className="sticky top-[49px] z-10 border-y border-slate-200 bg-slate-100/95 backdrop-blur">
                      <td colSpan={workingState.columns.length + 4} className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{group.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {group.rows.length} line items
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.missingEntries.map((entry) => (
                              <Button
                                key={`${group.year}-${entry}`}
                                onClick={() => addMissingEntry(group.year, entry)}
                                size="sm"
                                type="button"
                                variant="outline"
                              >
                                Add {entry}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>

                    {group.rows.map((row) => {
                      const rowIsDirty = isRowDirty(initialState, workingState, row.id)
                      const periodVariant = row.periodType === 'quarterly' ? 'Quarterly' : 'Annual'

                      return (
                        <tr
                          className={cn(
                            'border-b border-slate-200/70 align-top',
                            row.isPublished ? 'bg-white' : 'bg-amber-50/30'
                          )}
                          key={row.id}
                        >
                          <td className={cn('px-4 py-3', !row.isPublished && 'border-l-4 border-l-amber-300')}>
                            <input
                              aria-label={`Select ${row.period || 'row'}`}
                              checked={selectedRowSet.has(row.id)}
                              onChange={() => toggleRowSelection(row.id)}
                              type="checkbox"
                            />
                          </td>
                          <td className="sticky left-0 bg-inherit px-4 py-3">
                            <div className="space-y-3">
                              <Input
                                onChange={(event) => setRowPatch(row.id, { period: event.target.value })}
                                placeholder={row.periodType === 'quarterly' ? 'Q1 2026' : 'FY 2026 Annual Report'}
                                value={row.period}
                              />
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">{periodVariant}</Badge>
                                {row.isPublished ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                    <CheckCheck className="h-3.5 w-3.5" />
                                    Published
                                  </span>
                                ) : (
                                  <span className="text-xs font-medium text-amber-700">Draft</span>
                                )}
                                {rowIsDirty ? (
                                  <span className="text-xs font-medium text-cyan-700">Edited</span>
                                ) : null}
                              </div>
                            </div>
                          </td>

                          {workingState.columns.map((column) => {
                            const value = workingState.cells[row.id]?.[column.id] ?? ''
                            const invalid = !isFinancialValueValid(value)
                            const isActive =
                              activeCell?.rowId === row.id && activeCell?.columnId === column.id
                            const cellKey = getCellKey(row.id, column.id)

                            return (
                              <td className="px-4 py-3" key={cellKey}>
                                {isActive ? (
                                  <Input
                                    className={cn(
                                      'h-10',
                                      invalid && 'border-red-400 bg-red-50 text-red-700 focus-visible:ring-red-200'
                                    )}
                                    onBlur={() => setActiveCell(null)}
                                    onChange={(event) => setCellValue(row.id, column.id, event.target.value)}
                                    onKeyDown={(event) => {
                                      if (event.key === 'Tab') {
                                        event.preventDefault()
                                        navigateCell(row.id, column.id, 'tab')
                                      }
                                      if (event.key === 'ArrowLeft') {
                                        event.preventDefault()
                                        navigateCell(row.id, column.id, 'left')
                                      }
                                      if (event.key === 'ArrowRight') {
                                        event.preventDefault()
                                        navigateCell(row.id, column.id, 'right')
                                      }
                                      if (event.key === 'ArrowUp') {
                                        event.preventDefault()
                                        navigateCell(row.id, column.id, 'up')
                                      }
                                      if (event.key === 'ArrowDown') {
                                        event.preventDefault()
                                        navigateCell(row.id, column.id, 'down')
                                      }
                                    }}
                                    ref={(element) => {
                                      cellRefs.current[cellKey] = element
                                    }}
                                    value={value}
                                  />
                                ) : (
                                  <button
                                    className={cn(
                                      'flex min-h-10 w-full items-center border border-transparent px-3 py-2 text-left transition',
                                      'hover:border-slate-200 hover:bg-slate-50',
                                      !value && 'text-slate-400',
                                      invalid && 'border-red-200 bg-red-50 text-red-700'
                                    )}
                                    onClick={() => setActiveCell({ rowId: row.id, columnId: column.id })}
                                    type="button"
                                  >
                                    {value || 'Click to edit'}
                                  </button>
                                )}
                              </td>
                            )
                          })}

                          <td className="px-4 py-3">
                            <div className="space-y-2">
                              <Badge
                                className={cn(
                                  'gap-1 border',
                                  row.isPublished
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                                )}
                                variant="outline"
                              >
                                {row.isPublished ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Published
                                  </>
                                ) : (
                                  'Draft'
                                )}
                              </Badge>
                              <Button
                                onClick={() => setRowPatch(row.id, { isPublished: !row.isPublished })}
                                size="sm"
                                type="button"
                                variant="outline"
                              >
                                {row.isPublished ? 'Move to Draft' : 'Mark Published'}
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              onClick={() => removeRowLocally(row.id)}
                              size="icon"
                              type="button"
                              variant="ghost"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}

                    <GhostRow
                      missingEntries={group.missingEntries}
                      onAdd={(entry) => addMissingEntry(group.year, entry)}
                      yearLabel={group.label}
                    />
                  </tbody>
                ))}
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <IrFinancialMetricsDrawer
        columns={workingState.columns}
        onAdd={addMetric}
        onChange={updateMetric}
        onClose={() => setMetricsDrawerOpen(false)}
        onDelete={deleteMetricLocally}
        onMove={moveMetric}
        open={metricsDrawerOpen}
      />

      <IrFinancialSaveBar
        invalidCells={invalidCells}
        isSaving={isSavingAll}
        modifiedCells={diff.modifiedCells}
        modifiedRows={diff.modifiedRows}
        onDiscard={discardChanges}
        onSave={saveAllChanges}
        visible={diff.hasChanges}
      />
    </div>
  )
}

function GhostRow({
  yearLabel,
  missingEntries,
  onAdd,
}: {
  yearLabel: string
  missingEntries: Array<(typeof PERIOD_SEQUENCE)[number]>
  onAdd: (entry: (typeof PERIOD_SEQUENCE)[number]) => void
}) {
  return (
    <tr className="bg-slate-50/70">
      <td colSpan={999} className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
          <span>Add another line item inside {yearLabel}</span>
          <div className="flex flex-wrap gap-2">
            {missingEntries.length ? (
              missingEntries.map((entry) => (
                <Button key={entry} onClick={() => onAdd(entry)} size="sm" type="button" variant="outline">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  {entry}
                </Button>
              ))
            ) : (
              <Button onClick={() => onAdd('Q1')} size="sm" type="button" variant="outline">
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add Quarter
              </Button>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}

function buildWorkbenchState(columns: IrFinancialColumn[], rows: IrFinancialRow[]): WorkbenchState {
  const orderedColumns = [...columns].sort((a, b) => a.sortOrder - b.sortOrder)
  const orderedRows = [...rows]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((row) => ({
      id: row.id,
      period: row.period,
      periodType: row.periodType,
      sortOrder: row.sortOrder,
      isPublished: row.isPublished,
    }))

  return {
    columns: orderedColumns.map((column) => ({ ...column })),
    rows: orderedRows,
    cells: Object.fromEntries(
      orderedRows.map((row) => [
        row.id,
        Object.fromEntries(
          orderedColumns.map((column) => [
            column.id,
            rows
              .find((item) => item.id === row.id)
              ?.cells.find((cell) => cell.columnId === column.id)?.value ?? '',
          ])
        ),
      ])
    ),
    deletedColumnIds: [],
    deletedRowIds: [],
  }
}

function buildRowGroups(rows: WorkbenchRow[]): RowGroup[] {
  const grouped = new Map<string, WorkbenchRow[]>()

  rows.forEach((row) => {
    const year = extractYear(row.period) ?? 'Unscheduled'
    grouped.set(year, [...(grouped.get(year) ?? []), row])
  })

  return [...grouped.entries()]
    .sort(([left], [right]) => {
      if (left === 'Unscheduled') return 1
      if (right === 'Unscheduled') return -1
      return Number(right) - Number(left)
    })
    .map(([year, groupRows]) => {
      const sortedRows = [...groupRows].sort(compareRowsWithinYear)
      return {
        year,
        label: year === 'Unscheduled' ? 'Unscheduled Periods' : `FY ${year}`,
        rows: sortedRows,
        missingEntries: getMissingEntries(sortedRows),
      }
    })
}

function compareRowsWithinYear(left: WorkbenchRow, right: WorkbenchRow) {
  const leftRank = getPeriodRank(left)
  const rightRank = getPeriodRank(right)
  if (leftRank !== rightRank) return leftRank - rightRank
  return left.sortOrder - right.sortOrder
}

function getMissingEntries(rows: WorkbenchRow[]) {
  const present = new Set(rows.map(getPeriodLabel))
  return PERIOD_SEQUENCE.filter((entry) => !present.has(entry))
}

function getPeriodRank(row: WorkbenchRow) {
  const label = getPeriodLabel(row)
  const index = PERIOD_SEQUENCE.indexOf(label)
  return index === -1 ? PERIOD_SEQUENCE.length : index
}

function getPeriodLabel(row: WorkbenchRow) {
  if (row.periodType === 'annual') return 'Annual Report'
  const match = row.period.toUpperCase().match(/Q([1-4])/)
  return match ? (`Q${match[1]}` as (typeof PERIOD_SEQUENCE)[number]) : 'Q4'
}

function extractYear(period: string) {
  return period.match(/\b(19|20)\d{2}\b/)?.[0] ?? null
}

function getDiffSummary(initialState: WorkbenchState, workingState: WorkbenchState): DiffSummary {
  let modifiedCells = 0
  const modifiedRows = new Set<string>()

  const rowIds = new Set([
    ...initialState.rows.map((row) => row.id),
    ...workingState.rows.map((row) => row.id),
  ])

  rowIds.forEach((rowId) => {
    const initialRow = initialState.rows.find((row) => row.id === rowId)
    const workingRow = workingState.rows.find((row) => row.id === rowId)

    if (!initialRow || !workingRow) {
      modifiedRows.add(rowId)
      const sourceCells = workingRow ? workingState.cells[rowId] ?? {} : initialState.cells[rowId] ?? {}
      modifiedCells += Object.keys(sourceCells).length
      return
    }

    if (
      initialRow.period !== workingRow.period ||
      initialRow.periodType !== workingRow.periodType ||
      initialRow.isPublished !== workingRow.isPublished ||
      initialRow.sortOrder !== workingRow.sortOrder
    ) {
      modifiedRows.add(rowId)
    }

    const columnIds = new Set([
      ...Object.keys(initialState.cells[rowId] ?? {}),
      ...Object.keys(workingState.cells[rowId] ?? {}),
    ])

    columnIds.forEach((columnId) => {
      const initialValue = initialState.cells[rowId]?.[columnId] ?? ''
      const workingValue = workingState.cells[rowId]?.[columnId] ?? ''
      if (initialValue !== workingValue) {
        modifiedCells += 1
        modifiedRows.add(rowId)
      }
    })
  })

  const columnsChanged =
    initialState.columns.length !== workingState.columns.length ||
    initialState.columns.some((column, index) => {
      const workingColumn = workingState.columns[index]
      return (
        !workingColumn ||
        column.id !== workingColumn.id ||
        column.label !== workingColumn.label ||
        column.key !== workingColumn.key ||
        column.sortOrder !== workingColumn.sortOrder
      )
    }) ||
    workingState.deletedColumnIds.length > 0 ||
    workingState.deletedRowIds.length > 0

  return {
    hasChanges: modifiedCells > 0 || modifiedRows.size > 0 || columnsChanged,
    modifiedCells,
    modifiedRows: modifiedRows.size,
  }
}

function getMetricChangeCount(initialState: WorkbenchState, workingState: WorkbenchState) {
  let count = 0

  workingState.columns.forEach((column, index) => {
    const initialColumn = initialState.columns.find((item) => item.id === column.id)
    if (
      !initialColumn ||
      initialColumn.label !== column.label ||
      initialColumn.key !== column.key ||
      initialColumn.sortOrder !== index
    ) {
      count += 1
    }
  })

  return count + workingState.deletedColumnIds.length
}

function getInvalidCellCount(state: WorkbenchState) {
  return state.rows.reduce((count, row) => {
    return (
      count +
      state.columns.reduce((rowCount, column) => {
        const value = state.cells[row.id]?.[column.id] ?? ''
        return rowCount + (isFinancialValueValid(value) ? 0 : 1)
      }, 0)
    )
  }, 0)
}

function isFinancialValueValid(value: string) {
  return value.trim() === '' || VALID_FINANCIAL_VALUE.test(value)
}

function isRowDirty(initialState: WorkbenchState, workingState: WorkbenchState, rowId: string) {
  const initialRow = initialState.rows.find((row) => row.id === rowId)
  const workingRow = workingState.rows.find((row) => row.id === rowId)

  if (!initialRow || !workingRow) return true
  if (
    initialRow.period !== workingRow.period ||
    initialRow.periodType !== workingRow.periodType ||
    initialRow.isPublished !== workingRow.isPublished ||
    initialRow.sortOrder !== workingRow.sortOrder
  ) {
    return true
  }

  return workingState.columns.some((column) => {
    const initialValue = initialState.cells[rowId]?.[column.id] ?? ''
    const workingValue = workingState.cells[rowId]?.[column.id] ?? ''
    return initialValue !== workingValue
  })
}

function didColumnChange(initialState: WorkbenchState, column: WorkbenchColumn, nextIndex: number) {
  const initialColumn = initialState.columns.find((item) => item.id === column.id)
  if (!initialColumn) return true
  return (
    initialColumn.label !== column.label.trim() ||
    initialColumn.key !== column.key.trim() ||
    initialColumn.sortOrder !== nextIndex
  )
}

function didRowChange(
  initialState: WorkbenchState,
  workingState: WorkbenchState,
  row: WorkbenchRow,
  nextIndex: number
) {
  const initialRow = initialState.rows.find((item) => item.id === row.id)
  if (!initialRow) return true

  if (
    initialRow.period !== row.period.trim() ||
    initialRow.periodType !== row.periodType ||
    initialRow.sortOrder !== nextIndex
  ) {
    return true
  }

  return workingState.columns.some((column) => {
    const initialValue = initialState.cells[row.id]?.[column.id] ?? ''
    const workingValue = workingState.cells[row.id]?.[column.id] ?? ''
    return initialValue !== workingValue
  })
}

function remapColumnsInCells(
  cells: Record<string, Record<string, string>>,
  columnIdMap: Map<string, string>
) {
  if (columnIdMap.size === 0) return cells

  return Object.fromEntries(
    Object.entries(cells).map(([rowId, rowCells]) => [
      rowId,
      Object.fromEntries(
        Object.entries(rowCells).map(([columnId, value]) => [columnIdMap.get(columnId) ?? columnId, value])
      ),
    ])
  )
}

function remapRowsInCells(
  cells: Record<string, Record<string, string>>,
  rowIdMap: Map<string, string>
) {
  if (rowIdMap.size === 0) return cells

  return Object.fromEntries(
    Object.entries(cells).map(([rowId, rowCells]) => [rowIdMap.get(rowId) ?? rowId, rowCells])
  )
}

function cloneWorkbenchState(state: WorkbenchState): WorkbenchState {
  return {
    columns: state.columns.map((column) => ({ ...column })),
    rows: state.rows.map((row) => ({ ...row })),
    cells: Object.fromEntries(
      Object.entries(state.cells).map(([rowId, rowCells]) => [rowId, { ...rowCells }])
    ),
    deletedColumnIds: [...state.deletedColumnIds],
    deletedRowIds: [...state.deletedRowIds],
  }
}

function stripWorkbenchMeta(state: WorkbenchState): WorkbenchState {
  return {
    columns: state.columns.map((column) => {
      const nextColumn = { ...column }
      delete nextColumn.isNew
      return nextColumn
    }),
    rows: state.rows.map((row) => {
      const nextRow = { ...row }
      delete nextRow.isNew
      return nextRow
    }),
    cells: Object.fromEntries(
      Object.entries(state.cells).map(([rowId, rowCells]) => [rowId, { ...rowCells }])
    ),
    deletedColumnIds: [],
    deletedRowIds: [],
  }
}

function reorder<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  if (!moved) return next
  next.splice(toIndex, 0, moved)
  return next
}

function createTempId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getCellKey(rowId: string, columnId: string) {
  return `${rowId}:${columnId}`
}
