import { Edit, Eye, Trash2 } from 'lucide-react'
import DataTable from '@/components/shared/DataTable'
import type { TeamMember } from '@/types/team.types'
import { Badge } from '@/components/ui/badge'
import { FileImage } from '@/components/shared/FileImage'
import IconButton from '@/components/system/IconButton'

type TeamListViewProps = {
  members: TeamMember[]
  isLoading: boolean
  onEdit: (member: TeamMember) => void
  onDelete: (member: TeamMember) => void
  onView: (member: TeamMember) => void
}

export function TeamListView({ members, isLoading, onEdit, onDelete, onView }: TeamListViewProps) {
  const columns = [
    {
      header: 'Member',
      accessorKey: 'name',
      cell: ({ row }: { row: { original: TeamMember } }) => {
        const member = row.original
        const initials = member.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center border">
              <FileImage
                path={member.image}
                alt={member.name}
                className="h-full w-full object-cover object-top"
                fallback={<span className="text-xs font-bold text-slate-500">{initials}</span>}
              />
            </div>
            <div>
              <div className="font-medium">{member.name}</div>
              <div className="text-xs text-cyan-600">{member.position}</div>
            </div>
          </div>
        )
      },
    },
    {
      header: 'Subsidiary',
      accessorKey: 'divisionId',
      cell: ({ row }: { row: { original: TeamMember } }) => {
        const member = row.original
        if (member.isCorporate) {
          return <Badge className="bg-cyan-500 text-white border-none hover:bg-cyan-600">Corporate</Badge>
        }
        return (
          <span className="text-sm font-medium">
            {member.division?.name || 'No Division'}
          </span>
        )
      },
    },
    {
      header: 'Sort Order',
      accessorKey: 'sortOrder',
      cell: ({ row }: { row: { original: TeamMember } }) => (
        <span className="font-mono text-sm">{row.original.sortOrder}</span>
      ),
    },
    {
      header: 'Visibility',
      id: 'visibility',
      cell: ({ row }: { row: { original: TeamMember } }) => {
        const member = row.original
        const isHidden = !member.isCorporate && member.division && (!member.division.isActive)
        
        if (isHidden) {
          return (
            <Badge className="bg-amber-500 text-white border-none">
              Hidden
            </Badge>
          )
        }
        
        return (
          <Badge className="bg-green-500 text-white border-none">
            Visible
          </Badge>
        )
      },
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: { original: TeamMember } }) => (
        <div className="flex items-center gap-2 justify-end">
          <IconButton
            tooltip="View"
            ariaLabel="View team member"
            onClick={() => onView(row.original)}
            icon={<Eye />}
          />
          <IconButton
            tooltip="Edit"
            ariaLabel="Edit team member"
            onClick={() => onEdit(row.original)}
            icon={<Edit />}
          />
          <IconButton
            tooltip="Delete"
            ariaLabel="Delete team member"
            onClick={() => onDelete(row.original)}
            icon={<Trash2 />}
            destructive
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={members}
      isLoading={isLoading}
    />
  )
}
