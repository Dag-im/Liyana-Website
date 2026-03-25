import { awardsApi, type CreateAwardDto, type GetAwardsParams, type UpdateAwardDto } from '@/api/awards.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { showErrorToast } from '@/lib/error-utils'

export function useAwards(params: GetAwardsParams) {
  return useQuery({
    queryKey: ['awards', params],
    queryFn: () => awardsApi.getAwards(params),
  })
}

export function useAward(id: string) {
  return useQuery({
    queryKey: ['awards', id],
    queryFn: () => awardsApi.getAward(id),
    enabled: Boolean(id),
  })
}

export function useCreateAward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateAwardDto) => awardsApi.createAward(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      toast.success('Award created')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to create award'),
  })
}

export function useUpdateAward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAwardDto }) => awardsApi.updateAward(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['awards', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      toast.success('Award updated')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to update award'),
  })
}

export function useDeleteAward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => awardsApi.deleteAward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      toast.success('Award deleted')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to delete award'),
  })
}
