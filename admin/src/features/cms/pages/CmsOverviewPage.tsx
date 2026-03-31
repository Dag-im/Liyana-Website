import { BarChart3, FileText, ShieldCheck, Star, Target } from 'lucide-react'

import OverviewCard from '@/components/shared/OverviewCard'
import PageHeader from '@/components/shared/PageHeader'
import { useCoreValues, useMissionVision, useQualityPolicy, useStats, useWhoWeAre } from '../useCms'

export default function CmsOverviewPage() {
  const missionVisionQuery = useMissionVision()
  const whoWeAreQuery = useWhoWeAre()
  const coreValuesQuery = useCoreValues()
  const statsQuery = useStats()
  const qualityPolicyQuery = useQualityPolicy()

  return (
    <div className="space-y-6">
      <PageHeader
        heading="CMS"
        text="Use dedicated CMS pages for each content section instead of a single tab-heavy workspace."
      />

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <OverviewCard
          title="Mission & Vision"
          description="Maintain mission and vision copy with icon selection."
          icon={Target}
          meta={missionVisionQuery.data ? 'Configured' : 'Not configured'}
          to="/cms/mission-vision"
        />
        <OverviewCard
          title="Who We Are"
          description="Edit the main Who We Are content block."
          icon={FileText}
          meta={whoWeAreQuery.data ? 'Configured' : 'Not configured'}
          to="/cms/who-we-are"
        />
        <OverviewCard
          title="Core Values"
          description="Manage the core values cards and their ordering."
          icon={Star}
          meta={`${coreValuesQuery.data?.length ?? 0} values`}
          to="/cms/core-values"
        />
        <OverviewCard
          title="Stats"
          description="Manage homepage stats and supporting figures."
          icon={BarChart3}
          meta={`${statsQuery.data?.length ?? 0} stats`}
          to="/cms/stats"
        />
        <OverviewCard
          title="Quality Policy"
          description="Manage language-specific quality policy entries."
          icon={ShieldCheck}
          meta={`${qualityPolicyQuery.data?.length ?? 0} locales`}
          to="/cms/quality-policy"
        />
      </div>
    </div>
  )
}
