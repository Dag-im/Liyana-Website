import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as teamApi from '@/api/team.api'
import { showErrorToast } from '@/lib/error-utils'

export function useTeamMembers(params: {
  page?: number
  perPage?: number
  search?: string
  divisionId?: string
  isCorporate?: boolean
  includeHidden?: boolean
}) {
  return useQuery({
    queryKey: ['team', params],
    queryFn: () => teamApi.getTeamMembers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useTeamMember(id: string) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => teamApi.getTeamMember(id),
    enabled: !!id,
  })
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamApi.createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      toast.success('Team member added')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to add team member'),
  })
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => teamApi.updateTeamMember(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      toast.success('Team member updated')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to update team member'),
  })
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamApi.deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      toast.success('Team member deleted')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to delete team member'),
  })
}
