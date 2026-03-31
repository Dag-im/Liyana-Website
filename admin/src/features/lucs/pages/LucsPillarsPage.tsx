import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ActionIconGroup from '@/components/shared/ActionIconGroup'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getCmsIcon } from '@/lib/cms-icons'
import {
  useDeleteLucsPillar,
  useLucsPillarIntro,
  useLucsPillars,
  usePublishLucsPillar,
  usePublishLucsPillarIntro,
  useUnpublishLucsPillar,
  useUnpublishLucsPillarIntro,
  useUpdateLucsPillarIntro,
} from '../useLucs'

export default function LucsPillarsPage() {
  const location = useLocation()
  const pillarIntroQuery = useLucsPillarIntro()
  const pillarsQuery = useLucsPillars()
  const updatePillarIntro = useUpdateLucsPillarIntro()
  const publishPillarIntro = usePublishLucsPillarIntro()
  const unpublishPillarIntro = useUnpublishLucsPillarIntro()
  const publishPillar = usePublishLucsPillar()
  const unpublishPillar = useUnpublishLucsPillar()
  const deletePillar = useDeleteLucsPillar()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [introTitle, setIntroTitle] = useState(pillarIntroQuery.data?.title ?? '')
  const [introDescription, setIntroDescription] = useState(pillarIntroQuery.data?.description ?? '')

  const intro = pillarIntroQuery.data
  const pillars = pillarsQuery.data ?? []

  useEffect(() => {
    if (!intro) return
    setIntroTitle(intro.title)
    setIntroDescription(intro.description)
  }, [intro])

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="What We Do"
        text="Manage the LUCS intro copy and the supporting pillar cards."
        items={[
          { label: 'LUCS', to: '/lucs-admin' },
          { label: 'What We Do' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/lucs-admin/pillars/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Pillar
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Section Intro</CardTitle>
          <CardDescription>Update the What We Do heading and description.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lucs-pillar-intro-title-page">Title</Label>
            <Input
              id="lucs-pillar-intro-title-page"
              value={introTitle}
              onChange={(event) => setIntroTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lucs-pillar-intro-description-page">Description</Label>
            <Textarea
              id="lucs-pillar-intro-description-page"
              rows={4}
              value={introDescription}
              onChange={(event) => setIntroDescription(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <PublishToggle
              isPublished={intro?.isPublished ?? false}
              isPending={publishPillarIntro.isPending || unpublishPillarIntro.isPending}
              label="Intro Status"
              onPublish={() => publishPillarIntro.mutate()}
              onUnpublish={() => unpublishPillarIntro.mutate()}
            />
            <div className="flex justify-end">
              <Button
                disabled={updatePillarIntro.isPending}
                onClick={() =>
                  updatePillarIntro.mutate({
                    title: introTitle,
                    description: introDescription,
                  })
                }
              >
                {updatePillarIntro.isPending ? 'Saving...' : 'Save Intro'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                        {pillar.bulletPoints.length} bullet points • sort order {pillar.sortOrder}
                      </CardDescription>
                    </div>
                    <ActionIconGroup
                      actions={[
                        {
                          label: 'Edit Pillar',
                          icon: Pencil,
                          to: `/lucs-admin/pillars/${pillar.id}/edit`,
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
                  {pillar.description ? (
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  ) : null}
                  <div className="space-y-2">
                    {pillar.bulletPoints.map((bulletPoint) => (
                      <div key={bulletPoint.id} className="rounded-xl border bg-slate-50 px-3 py-2">
                        <p className="text-sm font-medium text-slate-900">{bulletPoint.point}</p>
                        {bulletPoint.description ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {bulletPoint.description}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <PublishToggle
                    isPublished={pillar.isPublished}
                    isPending={publishPillar.isPending || unpublishPillar.isPending}
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
          title="No LUCS pillars yet"
          description="Create the first What We Do pillar."
          actionLabel="Add Pillar"
          onAction={() => window.location.assign('/lucs-admin/pillars/new')}
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
        description="Delete this LUCS pillar permanently?"
        confirmLabel="Delete"
      />
    </div>
  )
}
