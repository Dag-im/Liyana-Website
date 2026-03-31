import { BarChart3, FileText, HandHeart, Image, Leaf, ShieldCheck } from 'lucide-react'

import OverviewCard from '@/components/shared/OverviewCard'
import PageHeader from '@/components/shared/PageHeader'
import { useEsgGovernance, useEsgHero, useEsgLucsBridge, useEsgMetrics, useEsgPillars, useEsgReports } from '../useEsg'

export default function EsgOverviewPage() {
  const heroQuery = useEsgHero()
  const bridgeQuery = useEsgLucsBridge()
  const pillarsQuery = useEsgPillars()
  const metricsQuery = useEsgMetrics()
  const governanceQuery = useEsgGovernance()
  const reportsQuery = useEsgReports()

  return (
    <div className="space-y-6">
      <PageHeader
        heading="ESG Admin"
        text="Use dedicated ESG pages for each published content block."
      />

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <OverviewCard
          title="Hero"
          description="Manage the ESG tagline, subtitle, and background image."
          icon={Image}
          meta={heroQuery.data?.isPublished ? 'Published' : 'Draft'}
          to="/esg-admin/hero"
        />
        <OverviewCard
          title="Strategy"
          description="Edit the rich-text ESG strategy narrative."
          icon={FileText}
          meta="Rich text content"
          to="/esg-admin/strategy"
        />
        <OverviewCard
          title="Pillars"
          description="Manage ESG pillar cards, icons, initiatives, and optional documents."
          icon={Leaf}
          meta={`${pillarsQuery.data?.length ?? 0} pillars`}
          to="/esg-admin/pillars"
        />
        <OverviewCard
          title="Metrics"
          description="Maintain the ESG metrics strip values and publish state."
          icon={BarChart3}
          meta={`${metricsQuery.data?.length ?? 0} metrics`}
          to="/esg-admin/metrics"
        />
        <OverviewCard
          title="Governance"
          description="Organize policies, certifications, and risk-control items."
          icon={ShieldCheck}
          meta={`${governanceQuery.data?.length ?? 0} items`}
          to="/esg-admin/governance"
        />
        <OverviewCard
          title="Reports"
          description="Upload ESG reports and downloadable sustainability documents."
          icon={FileText}
          meta={`${reportsQuery.data?.length ?? 0} reports`}
          to="/esg-admin/reports"
        />
        <OverviewCard
          title="LUCS Bridge"
          description="Maintain the handoff CTA from ESG to the LUCS experience."
          icon={HandHeart}
          meta={bridgeQuery.data?.isPublished ? 'Published' : 'Draft'}
          to="/esg-admin/lucs-bridge"
        />
      </div>
    </div>
  )
}
