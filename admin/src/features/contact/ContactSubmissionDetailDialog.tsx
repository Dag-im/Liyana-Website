import { CheckCircle2, Clock, Mail, User, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/features/auth/useAuth'
import { formatDate } from '@/lib/utils'
import {
  useContactSubmission,
  useDeleteContactSubmission,
  useReviewContactSubmission,
} from './useContact'

interface ContactSubmissionDetailDialogProps {
  open: boolean
  onClose: () => void
  id: string | null
}

export function ContactSubmissionDetailDialog({
  open,
  onClose,
  id,
}: ContactSubmissionDetailDialogProps) {
  const { data: submission, isLoading } = useContactSubmission(id ?? '')
  const reviewMutation = useReviewContactSubmission()
  const deleteMutation = useDeleteContactSubmission()
  const authQuery = useAuth()
  const isAdmin = authQuery.data?.role === 'ADMIN'

  const handleReview = () => {
    if (id) {
      reviewMutation.mutate(id)
    }
  }

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id, {
        onSuccess: () => onClose(),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : !submission ? (
          <div className="p-12 text-center text-muted-foreground">Submission not found</div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Contact Submission</DialogTitle>
              <DialogDescription>
                Submitted on {formatDate(submission.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{submission.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {submission.email}
                    </a>
                  </div>
                </div>
                <div>
                  {submission.isReviewed ? (
                    <div className="flex flex-col items-end gap-1">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Reviewed
                      </Badge>
                      {submission.reviewedAt && (
                        <span className="text-[10px] text-muted-foreground">
                          at {formatDate(submission.reviewedAt)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-amber-600 border-amber-200 bg-amber-50"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Unreviewed
                    </Badge>
                  )}
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {submission.message}
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <div className="flex flex-1 gap-2">
                {!submission.isReviewed && (
                  <Button
                    className="flex-1 sm:flex-none"
                    onClick={handleReview}
                    disabled={reviewMutation.isPending}
                  >
                    Mark as Reviewed
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
