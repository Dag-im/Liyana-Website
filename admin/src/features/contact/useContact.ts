import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '@/api/contact.api'
import { showErrorToast } from '@/lib/error-utils'

export function useContactSubmissions(params: Parameters<typeof api.getContactSubmissions>[0]) {
  return useQuery({
    queryKey: ['contact', params],
    queryFn: () => api.getContactSubmissions(params),
    staleTime: 1 * 60 * 1000,
  })
}

export function useContactSubmission(id: string) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => api.getContactSubmission(id),
    enabled: !!id,
  })
}

export function useReviewContactSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.reviewContactSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] })
      toast.success('Marked as reviewed')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to review submission'),
  })
}

export function useDeleteContactSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteContactSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] })
      toast.success('Submission deleted')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to delete submission'),
  })
}
