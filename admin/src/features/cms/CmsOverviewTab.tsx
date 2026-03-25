import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCmsIcon } from '@/lib/cms-icons'
import { formatDate, truncate } from '@/lib/utils'
import { useCoreValues, useMissionVision, useQualityPolicy, useStats, useWhoWeAre } from './useCms'
import type { CmsTabValue } from './CmsPage'
import IconButton from '@/components/system/IconButton'
import { Pencil } from 'lucide-react'

type CmsOverviewTabProps = {
  onEditSection: (tab: CmsTabValue) => void
}

export default function CmsOverviewTab({ onEditSection }: CmsOverviewTabProps) {
  const missionVisionQuery = useMissionVision()
  const whoWeAreQuery = useWhoWeAre()
  const coreValuesQuery = useCoreValues()
  const statsQuery = useStats()
  const qualityPolicyQuery = useQualityPolicy()

  const missionVision = missionVisionQuery.data
  const whoWeAre = whoWeAreQuery.data
  const coreValues = coreValuesQuery.data ?? []
  const stats = statsQuery.data ?? []
  const policies = qualityPolicyQuery.data ?? []

  const MissionIcon = getCmsIcon(missionVision?.missionIcon ?? 'Target')
  const VisionIcon = getCmsIcon(missionVision?.visionIcon ?? 'Eye')

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Mission & Vision</CardTitle>
          <CardDescription>
            {missionVision ? `Updated ${formatDate(missionVision.updatedAt)}` : 'Not configured yet'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <MissionIcon className="h-5 w-5 text-cyan-700" />
            <div>
              <p className="font-medium">{missionVision?.missionTitle ?? 'Mission'}</p>
              <p className="text-sm text-muted-foreground">
                {truncate(missionVision?.missionDescription ?? '', 120) || 'No mission description'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <VisionIcon className="h-5 w-5 text-cyan-700" />
            <div>
              <p className="font-medium">{missionVision?.visionTitle ?? 'Vision'}</p>
              <p className="text-sm text-muted-foreground">
                {truncate(missionVision?.visionDescription ?? '', 120) || 'No vision description'}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <IconButton
              tooltip="Edit Mission & Vision"
              ariaLabel="Edit Mission & Vision"
              onClick={() => onEditSection('mission-vision')}
              icon={<Pencil />}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Who We Are</CardTitle>
          <CardDescription>
            {whoWeAre ? `Updated ${formatDate(whoWeAre.updatedAt)}` : 'Not configured yet'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {truncate(whoWeAre?.content ?? '', 240) || 'No content available'}
          </p>
          <div className="flex justify-end">
            <IconButton
              tooltip="Edit Who We Are"
              ariaLabel="Edit Who We Are"
              onClick={() => onEditSection('who-we-are')}
              icon={<Pencil />}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{coreValues.length} core values defined</p>
          <div className="flex justify-end">
            <IconButton
              tooltip="Edit Core Values"
              ariaLabel="Edit Core Values"
              onClick={() => onEditSection('core-values')}
              icon={<Pencil />}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {stats.slice(0, 4).map((stat) => (
              <div key={stat.id} className="rounded-md border p-2">
                <p className="text-sm font-semibold">{stat.value.toLocaleString()}{stat.suffix ?? ''}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
            {!stats.length && <p className="text-sm text-muted-foreground">No stats configured</p>}
          </div>
          <div className="flex justify-end">
            <IconButton
              tooltip="Edit Stats"
              ariaLabel="Edit Stats"
              onClick={() => onEditSection('stats')}
              icon={<Pencil />}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Quality Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {policies.map((policy) => (
              <Badge key={policy.id} variant="secondary">
                {policy.lang}
              </Badge>
            ))}
            {!policies.length && <p className="text-sm text-muted-foreground">No languages configured</p>}
          </div>
          <div className="flex justify-end">
            <IconButton
              tooltip="Edit Quality Policy"
              ariaLabel="Edit Quality Policy"
              onClick={() => onEditSection('quality-policy')}
              icon={<Pencil />}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
