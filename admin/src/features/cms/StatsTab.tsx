import { useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Stat } from '@/types/cms.types'
import CreateStatDialog from './CreateStatDialog'
import EditStatDialog from './EditStatDialog'
import { useDeleteStat, useStats } from './useCms'

export default function StatsTab() {
  const statsQuery = useStats()
  const deleteMutation = useDeleteStat()

  const [createOpen, setCreateOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<Stat | null>(null)
  const [deletingStat, setDeletingStat] = useState<Stat | null>(null)

  const stats = statsQuery.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stat
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Sort: {stat.sortOrder}</Badge>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Edit stat"
                    onClick={() => setEditingStat(stat)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    aria-label="Delete stat"
                    onClick={() => setDeletingStat(stat)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-3xl font-bold">
                {stat.value.toLocaleString()}
                {stat.suffix ?? ''}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!stats.length && <p className="text-sm text-muted-foreground">No stats defined yet.</p>}

      <CreateStatDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      {editingStat ? (
        <EditStatDialog
          open={Boolean(editingStat)}
          onClose={() => setEditingStat(null)}
          stat={editingStat}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingStat)}
        onClose={() => setDeletingStat(null)}
        onConfirm={() => {
          if (!deletingStat) return

          deleteMutation.mutate(deletingStat.id, {
            onSuccess: () => setDeletingStat(null),
          })
        }}
        title="Delete Stat"
        description="This stat will be permanently deleted."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
