import { useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCmsIcon } from '@/lib/cms-icons'
import { truncate } from '@/lib/utils'
import type { CoreValue } from '@/types/cms.types'
import CreateCoreValueDialog from './CreateCoreValueDialog'
import EditCoreValueDialog from './EditCoreValueDialog'
import { useCoreValues, useDeleteCoreValue } from './useCms'

export default function CoreValuesTab() {
  const coreValuesQuery = useCoreValues()
  const deleteMutation = useDeleteCoreValue()

  const [createOpen, setCreateOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null)
  const [deletingValue, setDeletingValue] = useState<CoreValue | null>(null)

  const coreValues = coreValuesQuery.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Core Value
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coreValues.map((value) => {
          const Icon = getCmsIcon(value.icon)

          return (
            <Card key={value.id}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                    <Icon className="h-5 w-5 text-cyan-700" />
                  </div>
                  <Badge variant="secondary">Sort: {value.sortOrder}</Badge>
                </div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {truncate(value.description, 140)}
                </p>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Edit core value"
                    onClick={() => setEditingValue(value)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    aria-label="Delete core value"
                    onClick={() => setDeletingValue(value)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!coreValues.length && (
        <p className="text-sm text-muted-foreground">No core values defined yet.</p>
      )}

      <CreateCoreValueDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      {editingValue ? (
        <EditCoreValueDialog
          open={Boolean(editingValue)}
          onClose={() => setEditingValue(null)}
          coreValue={editingValue}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingValue)}
        onClose={() => setDeletingValue(null)}
        onConfirm={() => {
          if (!deletingValue) return

          deleteMutation.mutate(deletingValue.id, {
            onSuccess: () => setDeletingValue(null),
          })
        }}
        title="Delete Core Value"
        description="This core value will be permanently deleted."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
