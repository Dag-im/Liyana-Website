import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '@/api/lucs.api'
import { getErrorMessage } from '@/lib/error-utils'

const onMutationError = (error: unknown) => {
  toast.error(getErrorMessage(error))
}

function useInvalidateOnSuccess(message: string, queryKey: unknown[]) {
  const queryClient = useQueryClient()

  return {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success(message)
    },
    onError: onMutationError,
  } as const
}

export function useLucsHero() {
  return useQuery({
    queryKey: ['lucs', 'hero'],
    queryFn: api.getLucsHero,
  })
}

export function useUpdateLucsHero() {
  return useMutation({
    mutationFn: api.updateLucsHero,
    ...useInvalidateOnSuccess('LUCS hero updated', ['lucs']),
  })
}

export function usePublishLucsHero() {
  return useMutation({
    mutationFn: api.publishLucsHero,
    ...useInvalidateOnSuccess('LUCS hero published', ['lucs']),
  })
}

export function useUnpublishLucsHero() {
  return useMutation({
    mutationFn: api.unpublishLucsHero,
    ...useInvalidateOnSuccess('LUCS hero unpublished', ['lucs']),
  })
}

export function useLucsWhoWeAre() {
  return useQuery({
    queryKey: ['lucs', 'who-we-are'],
    queryFn: api.getLucsWhoWeAre,
  })
}

export function useUpdateLucsWhoWeAre() {
  return useMutation({
    mutationFn: api.updateLucsWhoWeAre,
    ...useInvalidateOnSuccess('Who We Are updated', ['lucs']),
  })
}

export function usePublishLucsWhoWeAre() {
  return useMutation({
    mutationFn: api.publishLucsWhoWeAre,
    ...useInvalidateOnSuccess('Who We Are published', ['lucs']),
  })
}

export function useUnpublishLucsWhoWeAre() {
  return useMutation({
    mutationFn: api.unpublishLucsWhoWeAre,
    ...useInvalidateOnSuccess('Who We Are unpublished', ['lucs']),
  })
}

export function useLucsMission() {
  return useQuery({
    queryKey: ['lucs', 'mission'],
    queryFn: api.getLucsMission,
  })
}

export function useUpdateLucsMission() {
  return useMutation({
    mutationFn: api.updateLucsMission,
    ...useInvalidateOnSuccess('Mission & Vision updated', ['lucs']),
  })
}

export function usePublishLucsMission() {
  return useMutation({
    mutationFn: api.publishLucsMission,
    ...useInvalidateOnSuccess('Mission & Vision published', ['lucs']),
  })
}

export function useUnpublishLucsMission() {
  return useMutation({
    mutationFn: api.unpublishLucsMission,
    ...useInvalidateOnSuccess('Mission & Vision unpublished', ['lucs']),
  })
}

export function useLucsPillarIntro() {
  return useQuery({
    queryKey: ['lucs', 'pillar-intro'],
    queryFn: api.getLucsPillarIntro,
  })
}

export function useUpdateLucsPillarIntro() {
  return useMutation({
    mutationFn: api.updateLucsPillarIntro,
    ...useInvalidateOnSuccess('What We Do intro updated', ['lucs']),
  })
}

export function usePublishLucsPillarIntro() {
  return useMutation({
    mutationFn: api.publishLucsPillarIntro,
    ...useInvalidateOnSuccess('What We Do intro published', ['lucs']),
  })
}

export function useUnpublishLucsPillarIntro() {
  return useMutation({
    mutationFn: api.unpublishLucsPillarIntro,
    ...useInvalidateOnSuccess('What We Do intro unpublished', ['lucs']),
  })
}

export function useLucsPillars() {
  return useQuery({
    queryKey: ['lucs', 'pillars'],
    queryFn: api.getLucsPillars,
  })
}

export function useCreateLucsPillar() {
  return useMutation({
    mutationFn: api.createLucsPillar,
    ...useInvalidateOnSuccess('LUCS pillar created', ['lucs', 'pillars']),
  })
}

export function useUpdateLucsPillar() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: api.UpdateLucsPillarDto }) =>
      api.updateLucsPillar(id, dto),
    ...useInvalidateOnSuccess('LUCS pillar updated', ['lucs', 'pillars']),
  })
}

export function usePublishLucsPillar() {
  return useMutation({
    mutationFn: api.publishLucsPillar,
    ...useInvalidateOnSuccess('LUCS pillar published', ['lucs', 'pillars']),
  })
}

export function useUnpublishLucsPillar() {
  return useMutation({
    mutationFn: api.unpublishLucsPillar,
    ...useInvalidateOnSuccess('LUCS pillar unpublished', ['lucs', 'pillars']),
  })
}

export function useDeleteLucsPillar() {
  return useMutation({
    mutationFn: api.deleteLucsPillar,
    ...useInvalidateOnSuccess('LUCS pillar deleted', ['lucs', 'pillars']),
  })
}

export function useLucsCta() {
  return useQuery({
    queryKey: ['lucs', 'cta'],
    queryFn: api.getLucsCta,
  })
}

export function useUpdateLucsCta() {
  return useMutation({
    mutationFn: api.updateLucsCta,
    ...useInvalidateOnSuccess('CTA updated', ['lucs']),
  })
}

export function usePublishLucsCta() {
  return useMutation({
    mutationFn: api.publishLucsCta,
    ...useInvalidateOnSuccess('CTA published', ['lucs']),
  })
}

export function useUnpublishLucsCta() {
  return useMutation({
    mutationFn: api.unpublishLucsCta,
    ...useInvalidateOnSuccess('CTA unpublished', ['lucs']),
  })
}

export function useLucsInquiries(params: api.GetLucsInquiriesParams) {
  return useQuery({
    queryKey: ['lucs', 'inquiries', params],
    queryFn: () => api.getLucsInquiries(params),
  })
}

export function useLucsInquiry(id: string) {
  return useQuery({
    queryKey: ['lucs', 'inquiries', id],
    queryFn: () => api.getLucsInquiry(id),
    enabled: !!id,
  })
}

export function useReviewLucsInquiry() {
  return useMutation({
    mutationFn: api.reviewLucsInquiry,
    ...useInvalidateOnSuccess('Inquiry marked reviewed', ['lucs', 'inquiries']),
  })
}

export function useDeleteLucsInquiry() {
  return useMutation({
    mutationFn: api.deleteLucsInquiry,
    ...useInvalidateOnSuccess('Inquiry deleted', ['lucs', 'inquiries']),
  })
}
