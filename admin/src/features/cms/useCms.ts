import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cmsApi } from '@/api/cms.api'
import type { MissionVision } from '@/types/cms.types'

const cmsStaleTime = 5 * 60 * 1000

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Request failed'
}

export function useMissionVision() {
  return useQuery({
    queryKey: ['cms', 'mission-vision'],
    queryFn: cmsApi.getMissionVision,
    staleTime: cmsStaleTime,
  })
}

export function useUpdateMissionVision() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: Partial<MissionVision>) => cmsApi.updateMissionVision(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'mission-vision'] })
      toast.success('Mission & Vision updated')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useWhoWeAre() {
  return useQuery({
    queryKey: ['cms', 'who-we-are'],
    queryFn: cmsApi.getWhoWeAre,
    staleTime: cmsStaleTime,
  })
}

export function useUpdateWhoWeAre() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: { content: string }) => cmsApi.updateWhoWeAre(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'who-we-are'] })
      toast.success('Who We Are updated')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useCoreValues() {
  return useQuery({
    queryKey: ['cms', 'core-values'],
    queryFn: cmsApi.getCoreValues,
    staleTime: cmsStaleTime,
  })
}

export function useCreateCoreValue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cmsApi.createCoreValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'core-values'] })
      toast.success('Core value created')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useUpdateCoreValue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string
      dto: Partial<{
        title: string
        description: string
        icon: string
        sortOrder: number
      }>
    }) => cmsApi.updateCoreValue(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'core-values'] })
      toast.success('Core value updated')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteCoreValue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cmsApi.deleteCoreValue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'core-values'] })
      toast.success('Core value deleted')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['cms', 'stats'],
    queryFn: cmsApi.getStats,
    staleTime: cmsStaleTime,
  })
}

export function useCreateStat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cmsApi.createStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'stats'] })
      toast.success('Stat created')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useUpdateStat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string
      dto: Partial<{
        label: string
        value: number
        suffix: string
        sortOrder: number
      }>
    }) => cmsApi.updateStat(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'stats'] })
      toast.success('Stat updated')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteStat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cmsApi.deleteStat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'stats'] })
      toast.success('Stat deleted')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useQualityPolicy() {
  return useQuery({
    queryKey: ['cms', 'quality-policy'],
    queryFn: cmsApi.getQualityPolicy,
    staleTime: cmsStaleTime,
  })
}

export function useUpsertQualityPolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ lang, dto }: { lang: string; dto: { goals: string[]; sortOrder?: number } }) =>
      cmsApi.upsertQualityPolicy(lang, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'quality-policy'] })
      toast.success('Quality policy saved')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteQualityPolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lang: string) => cmsApi.deleteQualityPolicy(lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'quality-policy'] })
      toast.success('Language removed')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
