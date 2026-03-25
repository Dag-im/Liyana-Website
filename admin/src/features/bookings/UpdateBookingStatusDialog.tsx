import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { BookingStatus } from '@/types/booking.types'
import { CheckCircle2, Loader2, X, XCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUpdateBookingStatus } from './useBookings'
import IconButton from '@/components/system/IconButton'

export function UpdateBookingStatusDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [status, setStatus] = useState<BookingStatus>('CONFIRMED')
  const [notes, setNotes] = useState('')
  const updateMutation = useUpdateBookingStatus()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(
      { id, status, notes },
      {
        onSuccess: () => {
          toast.success(`Booking marked as ${status.toLowerCase()}`)
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
          <DialogDescription>Change the status of this patient request.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONFIRMED" className="text-emerald-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Confirmed
                  </div>
                </SelectItem>
                <SelectItem value="CANCELLED" className="text-red-600">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Cancelled
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="e.g. Patient contacted and appointment scheduled for Tuesday."
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              rows={3}
            />
            <p className="text-[10px] text-muted-foreground italic">These notes will be visible to other staff members.</p>
          </div>

          <DialogFooter>
            <IconButton
              tooltip="Cancel"
              ariaLabel="Cancel"
              onClick={() => onOpenChange(false)}
              icon={<X />}
            />
            <Button type="submit" disabled={updateMutation.isPending} variant={status === 'CANCELLED' ? 'destructive' : 'default'}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply {status === 'CONFIRMED' ? 'Confirmation' : 'Cancellation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
