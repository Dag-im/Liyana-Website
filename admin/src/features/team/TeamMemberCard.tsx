import { Edit, Eye, Trash2 } from 'lucide-react'
import type { TeamMember } from '@/types/team.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileImage } from '@/components/shared/FileImage'

type TeamMemberCardProps = {
  member: TeamMember
  onEdit: () => void
  onDelete: () => void
  onView: () => void
}

export function TeamMemberCard({ member, onEdit, onDelete, onView }: TeamMemberCardProps) {
  const isHidden = !member.isCorporate && member.division && (!member.division.isActive)
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <FileImage
            path={member.image}
            alt={member.name}
            className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-slate-200 text-2xl font-bold text-slate-500">
                {initials}
              </div>
            }
          />

          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {member.isCorporate ? (
              <Badge className="bg-cyan-500 text-white border-none hover:bg-cyan-600">Corporate</Badge>
            ) : (
              <Badge variant="secondary" className="max-w-[120px] truncate">
                {member.division?.name || 'No Division'}
              </Badge>
            )}

            {isHidden && (
              <Badge className="bg-amber-500 text-white border-none">
                Hidden
              </Badge>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="icon" variant="secondary" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold leading-none mb-1">{member.name}</h3>
          <p className="text-sm text-cyan-600 font-medium mb-2">{member.position}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
        </div>
      </CardContent>
    </Card>
  )
}
