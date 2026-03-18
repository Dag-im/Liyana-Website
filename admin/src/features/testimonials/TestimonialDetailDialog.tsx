import { CheckCircle2, Clock, Star, XCircle } from 'lucide-react'
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
import { formatDate } from '@/lib/utils'
import type { Testimonial } from '@/types/testimonial.types'
import {
  useApproveTestimonial,
  useFavoriteTestimonial,
  useUnapproveTestimonial,
  useUnfavoriteTestimonial,
} from './useTestimonials'

interface TestimonialDetailDialogProps {
  open: boolean
  onClose: () => void
  testimonial: Testimonial | null
}

export function TestimonialDetailDialog({
  open,
  onClose,
  testimonial,
}: TestimonialDetailDialogProps) {
  const approveMutation = useApproveTestimonial()
  const unapproveMutation = useUnapproveTestimonial()
  const favoriteMutation = useFavoriteTestimonial()
  const unfavoriteMutation = useUnfavoriteTestimonial()

  if (!testimonial) return null

  const handleApprove = () => {
    approveMutation.mutate(testimonial.id)
  }

  const handleUnapprove = () => {
    unapproveMutation.mutate(testimonial.id)
  }

  const handleFavorite = () => {
    favoriteMutation.mutate(testimonial.id)
  }

  const handleUnfavorite = () => {
    unfavoriteMutation.mutate(testimonial.id)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Testimonial Details</DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(testimonial.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-muted-foreground">
                {testimonial.role} at {testimonial.company}
              </p>
            </div>
            <div className="flex gap-2">
              {testimonial.isApproved ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Approved
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              )}
              {testimonial.isFavorite && (
                <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100 border-cyan-200">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  Favorite
                </Badge>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <blockquote className="relative italic text-muted-foreground before:absolute before:-left-1 before:-top-2 before:text-4xl before:content-['\201C']">
              {testimonial.message}
            </blockquote>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex flex-1 gap-2">
            {!testimonial.isApproved ? (
              <Button
                className="flex-1 sm:flex-none"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
              >
                Approve
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                onClick={handleUnapprove}
                disabled={unapproveMutation.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Unapprove
              </Button>
            )}

            {testimonial.isFavorite ? (
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={handleUnfavorite}
                disabled={unfavoriteMutation.isPending}
              >
                <Star className="mr-2 h-4 w-4" />
                Unfavorite
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={handleFavorite}
                disabled={!testimonial.isApproved || favoriteMutation.isPending}
                title={!testimonial.isApproved ? 'Approve first' : ''}
              >
                <Star className="mr-2 h-4 w-4" />
                Favorite
              </Button>
            )}
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
