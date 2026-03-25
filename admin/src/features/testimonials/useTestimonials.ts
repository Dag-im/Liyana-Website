import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '@/api/testimonials.api'
import { showErrorToast } from '@/lib/error-utils'

export function useTestimonials(params: Parameters<typeof api.getTestimonials>[0]) {
  return useQuery({
    queryKey: ['testimonials', params],
    queryFn: () => api.getTestimonials(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useApproveTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.approveTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Testimonial approved')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to approve testimonial'),
  })
}

export function useUnapproveTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.unapproveTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Testimonial unapproved')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to unapprove testimonial'),
  })
}

export function useFavoriteTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.favoriteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Added to favorites')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to favorite testimonial'),
  })
}

export function useUnfavoriteTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.unfavoriteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Removed from favorites')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to unfavorite testimonial'),
  })
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Testimonial deleted')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to delete testimonial'),
  })
}
