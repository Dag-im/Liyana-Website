import { useState } from 'react'
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
import { useCreateTeamMember } from './useTeam'
import { useDivisions } from '../divisions/useDivisions'
import { uploadTeamMemberImage } from '@/api/team.api'
import { InfoIcon } from 'lucide-react'
import { useTempUploadSession } from '@/lib/temp-upload-session'

type CreateTeamMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  inline?: boolean
}

export default function CreateTeamMemberDialog({
  open,
  onOpenChange,
  inline = false,
}: CreateTeamMemberDialogProps) {
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')
  const [isCorporate, setIsCorporate] = useState(false)
  const [divisionId, setDivisionId] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const tempUploads = useTempUploadSession()

  const { data: divisionsData } = useDivisions({ perPage: 100, isActive: true })
  const divisions = divisionsData?.data || []

  const createMutation = useCreateTeamMember()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!isCorporate && !divisionId) {
      return
    }

    createMutation.mutate(
      {
        name,
        position,
        bio,
        image: image || undefined,
        isCorporate,
        divisionId: isCorporate ? undefined : divisionId,
        sortOrder: parseInt(sortOrder) || 0,
      },
      {
        onSuccess: () => {
          tempUploads.clear()
          onOpenChange(false)
          resetForm()
        },
      }
    )
  }

  const resetForm = () => {
    setName('')
    setPosition('')
    setBio('')
    setImage('')
    setIsCorporate(false)
    setDivisionId('')
    setSortOrder('0')
  }

  const content = (
    <>
        {inline ? (
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold">Add Team Member</h2>
            <p className="text-sm text-muted-foreground">
              Create a new staff entry for the team or leadership section.
            </p>
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Create a new staff entry for the team or leadership section.
            </DialogDescription>
          </DialogHeader>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Chief Medical Officer"
                  required
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between space-x-2 rounded-xl border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label htmlFor="type-corporate">Corporate Member</Label>
                    <p className="text-[0.8rem] text-muted-foreground">
                      This member belongs to the corporate headquarters.
                    </p>
                  </div>
                  <Switch
                    id="type-corporate"
                    checked={isCorporate}
                    onCheckedChange={setIsCorporate}
                  />
                </div>

                {!isCorporate && (
                  <div className="space-y-2">
                    <Label htmlFor="division">Subsidiary / Division</Label>
                    <Select value={divisionId} onValueChange={(val) => setDivisionId(val || '')} required={!isCorporate}>
                      <SelectTrigger id="division">
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
                  <div className="flex items-start gap-2 rounded-xl bg-cyan-50 p-3 text-sm text-cyan-800 border border-cyan-100">
                    <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>Corporate members are displayed under the main headquarters team.</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort-order">Display Sort Order</Label>
                <Input
                  id="sort-order"
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
                  label="Upload Member Photo"
                />
                {!image && (
                  <p className="text-xs text-muted-foreground italic">
                    No image — initials will be displayed as placeholder.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography / Credentials</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief bio about the member..."
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
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Create Member'}
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
      onOpenChange={(val) => {
        if (!val) {
          void tempUploads.releaseAll({ silent: true })
        }
        onOpenChange(val)
        if (!val) resetForm()
      }}
    >
      <DialogContent className="max-w-2xl">{content}</DialogContent>
    </Dialog>
  )
}
