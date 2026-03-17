import type { TeamMember } from '@/types/team.types'
import { TeamMemberCard } from './TeamMemberCard'

type TeamGridViewProps = {
  members: TeamMember[]
  onEdit: (member: TeamMember) => void
  onDelete: (member: TeamMember) => void
  onView: (member: TeamMember) => void
}

export function TeamGridView({ members, onEdit, onDelete, onView }: TeamGridViewProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <TeamMemberCard
          key={member.id}
          member={member}
          onEdit={() => onEdit(member)}
          onDelete={() => onDelete(member)}
          onView={() => onView(member)}
        />
      ))}
    </div>
  )
}
