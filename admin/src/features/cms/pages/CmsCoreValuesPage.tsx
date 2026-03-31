import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import ActionIconGroup from '@/components/shared/ActionIconGroup'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCmsIcon } from '@/lib/cms-icons'
import { truncate } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { useCoreValues, useDeleteCoreValue } from '../useCms'
import { useState } from 'react'

export default function CmsCoreValuesPage() {
  const location = useLocation()
  const coreValuesQuery = useCoreValues()
  const deleteCoreValue = useDeleteCoreValue()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const coreValues = coreValuesQuery.data ?? []

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="Core Values"
        text="Manage the CMS core values collection."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Core Values' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/cms/core-values/new">
              Add Core Value
            </Link>
          </Button>
        }
      />

      {coreValues.length ? (
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
                  <div className="flex justify-end">
                    <ActionIconGroup
                      actions={[
                        {
                          label: 'Edit Core Value',
                          icon: Pencil,
                          to: `/cms/core-values/${value.id}/edit`,
                        },
                        {
                          label: 'Delete Core Value',
                          icon: Trash2,
                          destructive: true,
                          onClick: () => setDeleteId(value.id),
                        },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="No core values yet"
          description="Create the first core value."
          actionLabel="Add Core Value"
          onAction={() => window.location.assign('/cms/core-values/new')}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteCoreValue.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Core Value"
        description="This core value will be permanently deleted."
        confirmLabel="Delete"
        isLoading={deleteCoreValue.isPending}
      />
    </div>
  )
}
