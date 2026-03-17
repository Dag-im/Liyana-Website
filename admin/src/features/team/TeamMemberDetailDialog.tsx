import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileImage } from '@/components/shared/FileImage'
import type { TeamMember } from '@/types/team.types'
import { Edit, Trash2, Calendar, User, Building2, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type TeamMemberDetailDialogProps = {
  member: TeamMember
  open: boolean
  onClose: () => void
  onEdit: (member: TeamMember) => void
  onDelete: (member: TeamMember) => void
}

export default function TeamMemberDetailDialog({
  member,
  open,
  onClose,
  onEdit,
  onDelete,
}: TeamMemberDetailDialogProps) {
  const isHidden = !member.isCorporate && member.division && (!member.division.isActive)
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <div className="grid md:grid-cols-5 h-full">
          {/* Left Column - Image & Quick Info */}
          <div className="md:col-span-2 bg-slate-50 p-6 flex flex-col items-center border-r">
            <div className="h-48 w-48 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white mb-6">
              <FileImage
                path={member.image}
                alt={member.name}
                className="h-full w-full object-cover object-top"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-4xl font-bold text-slate-400">
                    {initials}
                  </div>
                }
              />
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Affiliation</p>
                {member.isCorporate ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-cyan-700 bg-cyan-50 px-3 py-2 rounded-lg border border-cyan-100">
                    <Building2 className="h-4 w-4" />
                    Corporate Headquarters
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-2 rounded-lg border shadow-sm">
                    <Building2 className="h-4 w-4" />
                    {member.division?.name || 'No Division'}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                {isHidden ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                    <EyeOff className="h-4 w-4" />
                    Hidden from Public
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <Eye className="h-4 w-4" />
                    Publicly Visible
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Display Rank</p>
                <div className="flex items-center gap-2 text-sm font-mono bg-white px-3 py-2 rounded-lg border shadow-sm">
                  #{member.sortOrder}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Info */}
          <div className="md:col-span-3 p-8 flex flex-col">
            <DialogHeader className="mb-6">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold">{member.name}</DialogTitle>
                <p className="text-lg text-cyan-600 font-medium">{member.position}</p>
              </div>
            </DialogHeader>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider underline decoration-cyan-500/30 underline-offset-4">
                  <User className="h-3.5 w-3.5" /> Biography & credentials
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {member.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Added On</p>
                  <p className="text-xs flex items-center gap-1.5 text-slate-600">
                    <Calendar className="h-3 w-3" /> {formatDate(member.createdAt)}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Updated</p>
                  <p className="text-xs flex items-center justify-end gap-1.5 text-slate-600">
                    <Calendar className="h-3 w-3" /> {formatDate(member.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={() => onEdit(member)}>
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
              <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={() => onDelete(member)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
