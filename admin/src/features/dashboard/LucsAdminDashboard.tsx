import DataTable from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { useLucsCta, useLucsHero, useLucsInquiries, useLucsMission, useLucsPillarIntro, useLucsPillars, useLucsWhoWeAre } from '@/features/lucs/useLucs'
import type { LucsInquiry } from '@/types/lucs.types'
import { Mail, MessageSquare, PencilRuler, Sparkles } from 'lucide-react'
import { DashboardHero, MetricCard, QuickActionGrid, SectionCard } from './DashboardPrimitives'

export function LucsAdminDashboard() {
  const heroQuery = useLucsHero()
  const whoWeAreQuery = useLucsWhoWeAre()
  const missionQuery = useLucsMission()
  const pillarIntroQuery = useLucsPillarIntro()
  const ctaQuery = useLucsCta()
  const pillarsQuery = useLucsPillars()
  const inquiriesQuery = useLucsInquiries({ page: 1, perPage: 5 })
  const unreadInquiriesQuery = useLucsInquiries({ page: 1, perPage: 1, isReviewed: false })

  const sections = [
    heroQuery.data,
    whoWeAreQuery.data,
    missionQuery.data,
    pillarIntroQuery.data,
    ctaQuery.data,
  ]

  const publishedSections = sections.filter((section) => section?.isPublished).length
  const draftSections = sections.length - publishedSections
  const unreadCount = unreadInquiriesQuery.data?.total ?? 0

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="LUCS"
        title="LUCS Admin Dashboard"
        description="Track LUCS section readiness, watch inbound inquiries, and jump directly into the key content areas."
        chips={[
          `${publishedSections} sections published`,
          `${draftSections} sections in draft`,
          `${pillarsQuery.data?.length ?? 0} pillars`,
        ]}
        actions={[
          { label: 'Open LUCS Overview', to: '/lucs-admin' },
          { label: 'Open Inquiries', to: '/lucs-admin/inquiries', variant: 'outline' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Page Status"
          value={`${publishedSections}/${sections.length}`}
          description={`${draftSections} sections still in draft`}
          icon={Sparkles}
          tone="emerald"
          to="/lucs-admin"
        />
        <MetricCard
          title="Unread Inquiries"
          value={unreadCount}
          description="Messages waiting for review"
          icon={Mail}
          tone={unreadCount > 0 ? 'amber' : 'default'}
          to="/lucs-admin/inquiries"
        />
        <MetricCard
          title="What We Do"
          value={pillarsQuery.data?.length ?? 0}
          description="Configured LUCS pillars"
          icon={PencilRuler}
          tone="cyan"
          to="/lucs-admin/pillars"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <SectionCard
          title="Recent Inquiries"
          description="Latest five LUCS inquiries"
          className="xl:col-span-8"
        >
          <DataTable
            columns={[
              {
                header: 'Sender',
                cell: ({ row }: { row: { original: LucsInquiry } }) => (
                  <div className="space-y-1">
                    <p className="font-medium">{row.original.name}</p>
                    <p className="text-xs text-muted-foreground">{row.original.email}</p>
                  </div>
                ),
              },
              {
                header: 'Message',
                cell: ({ row }: { row: { original: LucsInquiry } }) => (
                  <p className="max-w-100 truncate text-sm text-muted-foreground">
                    {row.original.message}
                  </p>
                ),
              },
              {
                header: 'Status',
                cell: ({ row }: { row: { original: LucsInquiry } }) => (
                  <Badge
                    variant="outline"
                    className={
                      row.original.isReviewed
                        ? 'border-slate-200 bg-slate-50 text-slate-600'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }
                  >
                    {row.original.isReviewed ? 'Reviewed' : 'Unread'}
                  </Badge>
                ),
              },
              {
                header: 'Date',
                cell: ({ row }: { row: { original: LucsInquiry } }) => (
                  <span className="text-sm">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                  </span>
                ),
              },
            ]}
            data={inquiriesQuery.data?.data ?? []}
            isLoading={inquiriesQuery.isLoading}
            isError={inquiriesQuery.isError}
            onRetry={() => inquiriesQuery.refetch()}
          />
        </SectionCard>

        <SectionCard
          title="Quick Links"
          description="The same section links exposed in the LUCS sidebar"
          className="xl:col-span-4"
        >
          <QuickActionGrid
            actions={[
              { label: 'Hero', to: '/lucs-admin/hero', icon: Sparkles },
              { label: 'Who We Are', to: '/lucs-admin/who-we-are', icon: MessageSquare },
              { label: 'Mission & Vision', to: '/lucs-admin/mission', icon: PencilRuler },
              { label: 'What We Do', to: '/lucs-admin/pillars', icon: PencilRuler },
              { label: 'CTA', to: '/lucs-admin/cta', icon: Mail },
              { label: 'Inquiries', to: '/lucs-admin/inquiries', icon: Mail },
            ]}
          />
        </SectionCard>
      </div>
    </div>
  )
}
