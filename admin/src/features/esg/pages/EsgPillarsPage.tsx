import { FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ActionIconGroup from '@/components/shared/ActionIconGroup'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import PublishToggle from '@/components/shared/PublishToggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCmsIcon } from '@/lib/cms-icons'
import {
  useDeleteEsgPillar,
  useEsgPillars,
  usePublishEsgPillar,
  useUnpublishEsgPillar,
} from '../useEsg'

export default function EsgPillarsPage() {
  const location = useLocation()
  const pillarsQuery = useEsgPillars()
  const publishPillar = usePublishEsgPillar()
  const unpublishPillar = useUnpublishEsgPillar()
  const deletePillar = useDeleteEsgPillar()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const pillars = pillarsQuery.data ?? []
  const isMutating = publishPillar.isPending || unpublishPillar.isPending

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="ESG Pillars"
        text="Manage the core ESG pillar cards, their supporting initiatives, and optional documents."
        items={[
          { label: 'ESG', to: '/esg-admin' },
          { label: 'Pillars' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/esg-admin/pillars/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Pillar
            </Link>
          </Button>
        }
      />

      {pillars.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = getCmsIcon(pillar.icon)

            return (
              <Card key={pillar.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="h-5 w-5 text-cyan-700" />
                        <span>{pillar.title}</span>
                      </CardTitle>
                      <CardDescription>
                        {pillar.initiatives.length} initiatives • sort order {pillar.sortOrder}
                      </CardDescription>
                    </div>
                    <ActionIconGroup
                      actions={[
                        {
                          label: 'Edit Pillar',
                          icon: Pencil,
                          to: `/esg-admin/pillars/${pillar.id}/edit`,
                        },
                        {
                          label: 'Delete Pillar',
                          icon: Trash2,
                          destructive: true,
                          onClick: () => setDeleteId(pillar.id),
                        },
                      ]}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  <div className="space-y-2">
                    {pillar.initiatives.map((initiative) => (
                      <div
                        key={initiative.id}
                        className="rounded-xl border bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        {initiative.text}
                      </div>
                    ))}
                  </div>
                  {pillar.document ? (
                    <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="truncate">{pillar.document}</span>
                    </div>
                  ) : null}
                  <PublishToggle
                    isPublished={pillar.isPublished}
                    isPending={isMutating}
                    label="Pillar Status"
                    onPublish={() => publishPillar.mutate(pillar.id)}
                    onUnpublish={() => unpublishPillar.mutate(pillar.id)}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="No ESG pillars yet"
          description="Create the first ESG pillar to populate the public pillars section."
          actionLabel="Add Pillar"
          onAction={() => window.location.assign('/esg-admin/pillars/new')}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deletePillar.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Pillar"
        description="Delete this ESG pillar permanently?"
        confirmLabel="Delete"
      />
    </div>
  )
}
