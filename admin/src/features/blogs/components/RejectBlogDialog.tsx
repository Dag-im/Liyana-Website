import { useState } from 'react'
import { XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useRejectBlog } from '../useBlogs'

export default function RejectBlogDialog({
  blogId,
  disabled,
  label = 'Reject',
}: {
  blogId: string
  disabled?: boolean
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const rejectMutation = useRejectBlog()
  const triggerAriaLabel = label === 'Reject' ? 'Reject blog post' : label

  if (disabled) {
    return (
      <Button size="icon" variant="destructive" disabled aria-label={triggerAriaLabel}>
        <XCircle className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button size="icon" variant="destructive" aria-label={triggerAriaLabel}>
            <XCircle className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Blog Post</DialogTitle>
          <DialogDescription>Provide a reason for rejecting this blog.</DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason for rejection"
        />
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={rejectMutation.isPending || reason.trim().length < 3}
            onClick={() =>
              rejectMutation.mutate(
                { id: blogId, dto: { rejectionReason: reason } },
                { onSuccess: () => { setOpen(false); setReason('') } }
              )
            }
            size="icon"
            aria-label="Reject blog post"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
