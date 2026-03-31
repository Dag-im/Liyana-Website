import { FileText, Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ActionIconGroup from '@/components/shared/ActionIconGroup'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { EsgGovernanceItem } from '@/types/esg.types'
import {
  useDeleteEsgGovernanceItem,
  useEsgGovernance,
  usePublishEsgGovernanceItem,
  useUnpublishEsgGovernanceItem,
} from '../useEsg'

const GROUPS: EsgGovernanceItem['type'][] = ['policy', 'certification', 'risk']

export default function EsgGovernancePage() {
  const location = useLocation()
  const governanceQuery = useEsgGovernance()
  const publishItem = usePublishEsgGovernanceItem()
  const unpublishItem = useUnpublishEsgGovernanceItem()
  const deleteItem = useDeleteEsgGovernanceItem()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const groupedItems = useMemo(() => {
    const items = governanceQuery.data ?? []
    return GROUPS.map((type) => ({
      type,
      items: items.filter((item) => item.type === type),
    }))
  }, [governanceQuery.data])

  const isMutating = publishItem.isPending || unpublishItem.isPending

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="Governance & Compliance"
        text="Manage policies, certifications, and risk-control items for the ESG page."
        items={[
          { label: 'ESG', to: '/esg-admin' },
          { label: 'Governance' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/esg-admin/governance/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        }
      />

      {(governanceQuery.data ?? []).length ? (
        <div className="grid gap-6 xl:grid-cols-3">
          {groupedItems.map((group) => (
            <div className="space-y-4" key={group.type}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-700" />
                <h2 className="text-base font-semibold capitalize">{group.type}</h2>
              </div>
              {group.items.length ? (
                group.items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>Sort order {item.sortOrder}</CardDescription>
                        </div>
                        <ActionIconGroup
                          actions={[
                            {
                              label: 'Edit Item',
                              icon: Pencil,
                              to: `/esg-admin/governance/${item.id}/edit`,
                            },
                            {
                              label: 'Delete Item',
                              icon: Trash2,
                              destructive: true,
                              onClick: () => setDeleteId(item.id),
                            },
                          ]}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.document ? (
                        <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span className="truncate">{item.document}</span>
                        </div>
                      ) : null}
                      <PublishToggle
                        isPublished={item.isPublished}
                        isPending={isMutating}
                        label="Item Status"
                        onPublish={() => publishItem.mutate(item.id)}
                        onUnpublish={() => unpublishItem.mutate(item.id)}
                      />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <EmptyState
                  title={`No ${group.type} items`}
                  description={`Add the first ${group.type} entry for this column.`}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No governance items yet"
          description="Create policies, certifications, or risk items for the ESG governance section."
          actionLabel="Add Item"
          onAction={() => window.location.assign('/esg-admin/governance/new')}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteItem.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Governance Item"
        description="Delete this governance item permanently?"
        confirmLabel="Delete"
      />
    </div>
  )
}
