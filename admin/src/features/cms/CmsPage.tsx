import { useEffect, useState } from 'react'

import PageHeader from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CmsOverviewTab from './CmsOverviewTab'
import CoreValuesTab from './CoreValuesTab'
import MissionVisionTab from './MissionVisionTab'
import QualityPolicyTab from './QualityPolicyTab'
import StatsTab from './StatsTab'
import WhoWeAreTab from './WhoWeAreTab'

export type CmsTabValue =
  | 'overview'
  | 'mission-vision'
  | 'who-we-are'
  | 'core-values'
  | 'stats'
  | 'quality-policy'

const tabLabelMap: Array<{ value: CmsTabValue; label: string }> = [
  { value: 'overview', label: 'Overview' },
  { value: 'mission-vision', label: 'Mission & Vision' },
  { value: 'who-we-are', label: 'Who We Are' },
  { value: 'core-values', label: 'Core Values' },
  { value: 'stats', label: 'Stats' },
  { value: 'quality-policy', label: 'Quality Policy' },
]

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<CmsTabValue>('overview')
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(() =>
    window.matchMedia('(min-width: 768px)').matches ? 'vertical' : 'horizontal'
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const syncOrientation = () => {
      setOrientation(mediaQuery.matches ? 'vertical' : 'horizontal')
    }

    syncOrientation()
    mediaQuery.addEventListener('change', syncOrientation)

    return () => mediaQuery.removeEventListener('change', syncOrientation)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader heading="CMS" text="Manage singleton and structured content." />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CmsTabValue)}
        orientation={orientation}
        className="gap-6"
      >
        <Card className="h-fit p-2 md:sticky md:top-24">
          <TabsList
            className={
              orientation === 'vertical'
                ? 'w-full flex-row overflow-x-auto md:w-64 md:flex-col md:overflow-visible'
                : 'w-full overflow-x-auto'
            }
            variant="line"
          >
            {tabLabelMap.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Card>

        <TabsContent value="overview">
          <CmsOverviewTab onEditSection={setActiveTab} />
        </TabsContent>

        <TabsContent value="mission-vision">
          <MissionVisionTab />
        </TabsContent>

        <TabsContent value="who-we-are">
          <WhoWeAreTab />
        </TabsContent>

        <TabsContent value="core-values">
          <CoreValuesTab />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab />
        </TabsContent>

        <TabsContent value="quality-policy">
          <QualityPolicyTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
