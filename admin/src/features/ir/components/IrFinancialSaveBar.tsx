import { AlertTriangle, RotateCcw, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function IrFinancialSaveBar({
  visible,
  isSaving,
  modifiedCells,
  modifiedRows,
  invalidCells,
  onDiscard,
  onSave,
}: {
  visible: boolean
  isSaving: boolean
  modifiedCells: number
  modifiedRows: number
  invalidCells: number
  onDiscard: () => void
  onSave: () => void
}) {
  return (
    visible ? (
      <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
          <div className="flex w-full max-w-5xl flex-col gap-3 border border-slate-200 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">Unsaved workbench changes</p>
              <p className="text-xs text-muted-foreground">
                {modifiedCells} modified cells across {modifiedRows} rows
              </p>
              {invalidCells > 0 ? (
                <p className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {invalidCells} invalid {invalidCells === 1 ? 'cell' : 'cells'} must be fixed before save
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={onDiscard} type="button" variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Discard Changes
              </Button>
              <Button disabled={isSaving || invalidCells > 0} onClick={onSave} type="button">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save All Updates'}
              </Button>
            </div>
          </div>
      </div>
    ) : null
  )
}
