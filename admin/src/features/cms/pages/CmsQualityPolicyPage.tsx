import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import ActionIconGroup from '@/components/shared/ActionIconGroup'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QualityPolicy } from '@/types/cms.types'
import { useDeleteQualityPolicy, useQualityPolicy } from '../useCms'

export default function CmsQualityPolicyPage() {
  const location = useLocation()
  const qualityPolicyQuery = useQualityPolicy()
  const deleteQualityPolicy = useDeleteQualityPolicy()
  const [deletingPolicy, setDeletingPolicy] = useState<QualityPolicy | null>(null)
  const policies = qualityPolicyQuery.data ?? []

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="Quality Policy"
        text="Manage multilingual quality policy entries on a dedicated CMS page."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Quality Policy' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/cms/quality-policy/new">
              Add Language
            </Link>
          </Button>
        }
      />

      {policies.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {policies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>{policy.lang}</CardTitle>
                <ActionIconGroup
                  actions={[
                    {
                      label: 'Edit Language Policy',
                      icon: Edit,
                      to: `/cms/quality-policy/${encodeURIComponent(policy.lang)}/edit`,
                    },
                    {
                      label: 'Delete Language Policy',
                      icon: Trash2,
                      destructive: true,
                      onClick: () => setDeletingPolicy(policy),
                    },
                  ]}
                />
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
      ) : (
        <EmptyState
          title="No quality policy languages yet"
          description="Add the first language policy entry."
          actionLabel="Add Language"
          onAction={() => window.location.assign('/cms/quality-policy/new')}
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingPolicy)}
        onClose={() => setDeletingPolicy(null)}
        onConfirm={() => {
          if (!deletingPolicy) return
          deleteQualityPolicy.mutate(deletingPolicy.lang, {
            onSuccess: () => setDeletingPolicy(null),
          })
        }}
        title="Delete Language Policy"
        description={`This will remove the ${deletingPolicy?.lang ?? ''} quality policy. This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteQualityPolicy.isPending}
      />
    </div>
  )
}
