import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCmsIcon } from '@/lib/cms-icons'
import { formatDate } from '@/lib/utils'
import EditMissionVisionDialog from './EditMissionVisionDialog'
import { useMissionVision } from './useCms'
import IconButton from '@/components/system/IconButton'
import { Pencil } from 'lucide-react'

export default function MissionVisionTab() {
  const missionVisionQuery = useMissionVision()
  const [editOpen, setEditOpen] = useState(false)

  const missionVision = missionVisionQuery.data

  if (!missionVision) {
    return <div className="text-sm text-muted-foreground">Loading Mission & Vision...</div>
  }

  const MissionIcon = getCmsIcon(missionVision.missionIcon)
  const VisionIcon = getCmsIcon(missionVision.visionIcon)

  return (
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
            <p className="text-sm text-muted-foreground whitespace-pre-line">{missionVision.missionDescription}</p>
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
            <p className="text-sm text-muted-foreground whitespace-pre-line">{missionVision.visionDescription}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Last updated: {formatDate(missionVision.updatedAt)}</p>
        <IconButton
          tooltip="Edit"
          ariaLabel="Edit Mission & Vision"
          onClick={() => setEditOpen(true)}
          icon={<Pencil />}
        />
      </div>

      <EditMissionVisionDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        missionVision={missionVision}
      />
    </div>
  )
}
