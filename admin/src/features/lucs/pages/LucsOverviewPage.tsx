import { FileText, HandHeart, Image, PencilRuler, Target } from 'lucide-react'

import OverviewCard from '@/components/shared/OverviewCard'
import PageHeader from '@/components/shared/PageHeader'
import { useLucsCta, useLucsHero, useLucsMission, useLucsPillars } from '../useLucs'

export default function LucsOverviewPage() {
  const heroQuery = useLucsHero()
  const missionQuery = useLucsMission()
  const ctaQuery = useLucsCta()
  const pillarsQuery = useLucsPillars()

  return (
    <div className="space-y-6">
      <PageHeader
        heading="LUCS Admin"
        text="Use dedicated LUCS pages for each section instead of a single control surface."
      />

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <OverviewCard
          title="Hero"
          description="Manage the LUCS hero tagline, subtitle, and background image."
          icon={Image}
          meta={heroQuery.data?.isPublished ? 'Published' : 'Draft'}
          to="/lucs-admin/hero"
        />
        <OverviewCard
          title="Who We Are"
          description="Edit the LUCS introduction in a dedicated content page."
          icon={FileText}
          meta="Rich text content"
          to="/lucs-admin/who-we-are"
        />
        <OverviewCard
          title="Mission & Vision"
          description="Maintain mission titles, descriptions, and icons."
          icon={Target}
          meta={missionQuery.data?.isPublished ? 'Published' : 'Draft'}
          to="/lucs-admin/mission"
        />
        <OverviewCard
          title="What We Do"
          description="Manage the intro copy and LUCS pillar cards."
          icon={PencilRuler}
          meta={`${pillarsQuery.data?.length ?? 0} pillars`}
          to="/lucs-admin/pillars"
        />
        <OverviewCard
          title="CTA"
          description="Update the LUCS call-to-action separately from the rest of the page."
          icon={HandHeart}
          meta={ctaQuery.data?.isPublished ? 'Published' : 'Draft'}
          to="/lucs-admin/cta"
        />
      </div>
    </div>
  )
}
