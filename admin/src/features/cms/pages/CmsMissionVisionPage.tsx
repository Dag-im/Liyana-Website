import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCmsIcon } from '@/lib/cms-icons'
import { formatDate } from '@/lib/utils'
import { useMissionVision } from '../useCms'

export default function CmsMissionVisionPage() {
  const location = useLocation()
  const missionVisionQuery = useMissionVision()
  const missionVision = missionVisionQuery.data

  if (!missionVision) {
    return <div className="text-sm text-muted-foreground">Loading Mission & Vision...</div>
  }

  const MissionIcon = getCmsIcon(missionVision.missionIcon)
  const VisionIcon = getCmsIcon(missionVision.visionIcon)

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="Mission & Vision"
        text="Manage mission and vision content in its own CMS page."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Mission & Vision' },
        ]}
        actions={
          <Button asChild>
            <Link state={{ from: location.pathname }} to="/cms/mission-vision/edit">
              Edit Mission & Vision
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MissionIcon className="h-5 w-5 text-cyan-700" />
                {missionVision.missionTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {missionVision.missionDescription}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VisionIcon className="h-5 w-5 text-cyan-700" />
                {missionVision.visionTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {missionVision.visionDescription}
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground">
          Last updated: {formatDate(missionVision.updatedAt)}
        </p>
      </div>
    </div>
  )
}
