import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import ActionIconGroup from '@/components/shared/ActionIconGroup'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2 } from 'lucide-react'
import { useDeleteStat, useStats } from '../useCms'
import { useState } from 'react'

export default function CmsStatsPage() {
  const location = useLocation()
  const statsQuery = useStats()
  const deleteStat = useDeleteStat()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const stats = statsQuery.data ?? []

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="Stats"
        text="Manage stats and figures on their own CMS page."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Stats' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/cms/stats/new">
              Add Stat
            </Link>
          </Button>
        }
      />

      {stats.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.id}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Sort: {stat.sortOrder}</Badge>
                  <ActionIconGroup
                    actions={[
                      {
                        label: 'Edit Stat',
                        icon: Pencil,
                        to: `/cms/stats/${stat.id}/edit`,
                      },
                      {
                        label: 'Delete Stat',
                        icon: Trash2,
                        destructive: true,
                        onClick: () => setDeleteId(stat.id),
                      },
                    ]}
                  />
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
      ) : (
        <EmptyState
          title="No stats yet"
          description="Create the first stat."
          actionLabel="Add Stat"
          onAction={() => window.location.assign('/cms/stats/new')}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteStat.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Stat"
        description="This stat will be permanently deleted."
        confirmLabel="Delete"
        isLoading={deleteStat.isPending}
      />
    </div>
  )
}
