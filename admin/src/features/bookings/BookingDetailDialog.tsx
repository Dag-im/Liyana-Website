import { BookingStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Booking } from '@/types/booking.types'
import { Building, FileText, Phone, User } from 'lucide-react'

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
  onUpdateStatus,
}: {
  booking: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <DialogTitle>Booking Details</DialogTitle>
            <BookingStatusBadge status={booking.status} />
          </div>
          <DialogDescription>
            Reference ID: {booking.id} • Received {new Date(booking.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <User className="h-3 w-3" /> Patient Name
              </p>
              <p className="font-semibold text-base">{booking.patientName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone Number
              </p>
              <p className="font-medium">{booking.patientPhone}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Building className="h-3 w-3" /> Division / Department
                  </p>
                  <p className="font-medium">{booking.divisionName || 'Administrative'}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 justify-end">
                    <FileText className="h-3 w-3" /> Selection Type
                  </p>
                  <p className="text-sm px-2 py-0.5 bg-muted rounded inline-block font-medium">{booking.selectionType}</p>
                </div>
             </div>
             <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Target Selection</p>
                <p className="text-lg font-bold text-primary">{booking.selectionLabel}</p>
             </div>
          </div>

          {booking.notes && (
            <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-dashed">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Admin Notes</p>
              <p className="text-sm italic">"{booking.notes}"</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {booking.status === 'PENDING' && (
            <Button onClick={onUpdateStatus}>Update Status</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
