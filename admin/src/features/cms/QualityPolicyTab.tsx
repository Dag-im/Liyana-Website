import { useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QualityPolicy } from '@/types/cms.types'
import UpsertQualityPolicyDialog from './UpsertQualityPolicyDialog'
import { useDeleteQualityPolicy, useQualityPolicy } from './useCms'

export default function QualityPolicyTab() {
  const qualityPolicyQuery = useQualityPolicy()
  const deleteMutation = useDeleteQualityPolicy()

  const [upsertOpen, setUpsertOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<QualityPolicy | undefined>(undefined)
  const [deletingPolicy, setDeletingPolicy] = useState<QualityPolicy | null>(null)

  const policies = qualityPolicyQuery.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingPolicy(undefined)
            setUpsertOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>{policy.lang}</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditingPolicy(policy)
                    setUpsertOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeletingPolicy(policy)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                {policy.goals.map((goal, index) => (
                  <li key={`${policy.id}-goal-${index}`}>{goal}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>

      {!policies.length && (
        <p className="text-sm text-muted-foreground">
          No quality policy languages defined yet. Supported now: English and Amharic, with room for more.
        </p>
      )}

      <UpsertQualityPolicyDialog
        open={upsertOpen}
        onClose={() => setUpsertOpen(false)}
        existing={editingPolicy}
      />

      <ConfirmDialog
        open={Boolean(deletingPolicy)}
        onClose={() => setDeletingPolicy(null)}
        onConfirm={() => {
          if (!deletingPolicy) return

          deleteMutation.mutate(deletingPolicy.lang, {
            onSuccess: () => setDeletingPolicy(null),
          })
        }}
        title="Delete Language Policy"
        description={`This will remove the ${deletingPolicy?.lang ?? ''} quality policy. This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
