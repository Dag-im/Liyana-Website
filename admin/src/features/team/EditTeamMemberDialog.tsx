import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { FileUpload } from '@/components/shared/FileUpload'
import { useUpdateTeamMember } from './useTeam'
import { useDivisions } from '../divisions/useDivisions'
import { uploadTeamMemberImage } from '@/api/team.api'
import { AlertCircle, InfoIcon } from 'lucide-react'
import { useTempUploadSession } from '@/lib/temp-upload-session'
import type { TeamMember } from '@/types/team.types'

type EditTeamMemberDialogProps = {
  member: TeamMember
  open: boolean
  onOpenChange: (open: boolean) => void
  inline?: boolean
}

export default function EditTeamMemberDialog({
  member,
  open,
  onOpenChange,
  inline = false,
}: EditTeamMemberDialogProps) {
  const [name, setName] = useState(member.name)
  const [position, setPosition] = useState(member.position)
  const [bio, setBio] = useState(member.bio)
  const [image, setImage] = useState(member.image || '')
  const [isCorporate, setIsCorporate] = useState(member.isCorporate)
  const [divisionId, setDivisionId] = useState(member.divisionId || '')
  const [sortOrder, setSortOrder] = useState(member.sortOrder.toString())
  const tempUploads = useTempUploadSession()

  useEffect(() => {
    if (open) {
      setName(member.name)
      setPosition(member.position)
      setBio(member.bio)
      setImage(member.image || '')
      setIsCorporate(member.isCorporate)
      setDivisionId(member.divisionId || '')
      setSortOrder(member.sortOrder.toString())
    }
  }, [open, member])

  const { data: divisionsData } = useDivisions({ perPage: 100, isActive: true })
  const divisions = divisionsData?.data || []

  const updateMutation = useUpdateTeamMember()

  const isHidden = !member.isCorporate && member.division && (!member.division.isActive)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!isCorporate && !divisionId) {
      return
    }

    updateMutation.mutate(
      {
        id: member.id,
        dto: {
          name,
          position,
          bio,
          image: image || null,
          isCorporate,
          divisionId: isCorporate ? null : divisionId,
          sortOrder: parseInt(sortOrder) || 0,
        },
      },
      {
        onSuccess: () => {
          tempUploads.clear()
          onOpenChange(false)
        },
      }
    )
  }

  const content = (
    <>
        {inline ? (
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold">Edit Team Member</h2>
            <p className="text-sm text-muted-foreground">
              Update credentials and affiliation for {member.name}.
            </p>
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update credentials and affiliation for {member.name}.
            </DialogDescription>
          </DialogHeader>
        )}

        {isHidden && (
          <div className="flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 shrink-0" />
            <div className="space-y-1">
              <h5 className="font-semibold text-amber-800 leading-none tracking-tight">Visibility Warning</h5>
              <div className="text-sm text-amber-700">
                This member is currently hidden because their division is inactive or deleted. Reassign to an active division or mark as corporate to make them visible.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-type-corporate">Corporate Member</Label>
                    <p className="text-[0.8rem] text-muted-foreground">
                      This member belongs to the corporate headquarters.
                    </p>
                  </div>
                  <Switch
                    id="edit-type-corporate"
                    checked={isCorporate}
                    onCheckedChange={setIsCorporate}
                  />
                </div>

                {!isCorporate && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-division">Subsidiary / Division</Label>
                    <Select 
                      value={divisionId} 
                      onValueChange={(val) => setDivisionId(val || '')} 
                      required={!isCorporate}
                    >
                      <SelectTrigger id="edit-division">
                        <SelectValue placeholder="Select a division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {isCorporate && (
                  <div className="flex items-start gap-2 rounded-lg bg-cyan-50 p-3 text-sm text-cyan-800 border border-cyan-100">
                    <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>Corporate members are displayed under the main headquarters team.</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sort-order">Display Sort Order</Label>
                <Input
                  id="edit-sort-order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Portrait Image</Label>
                <FileUpload
                  onUpload={uploadTeamMemberImage}
                  onSuccess={setImage}
                  onUploadedAsset={tempUploads.registerUpload}
                  currentPath={image}
                  label="Update Member Photo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bio">Biography / Credentials</Label>
                <Textarea
                  id="edit-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[160px] resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void tempUploads.releaseAll({ silent: true })
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Update Member'}
            </Button>
          </DialogFooter>
        </form>
    </>
  )

  if (inline) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          void tempUploads.releaseAll({ silent: true })
        }
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="max-w-2xl">{content}</DialogContent>
    </Dialog>
  )
}
