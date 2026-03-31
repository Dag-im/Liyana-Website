import { apiRequest } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/user.types'
import type {
  LucsCta,
  LucsHero,
  LucsInquiry,
  LucsMission,
  LucsPillar,
  LucsPillarIntro,
  LucsWhoWeAre,
} from '@/types/lucs.types'
import type { UploadedAsset } from '@/types/uploads.types'

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export type UpsertLucsHeroDto = {
  tagline?: string
  subtitle?: string
  backgroundImage?: string
}

export type UpsertLucsWhoWeAreDto = {
  content?: string
}

export type UpsertLucsMissionDto = {
  missionTitle?: string
  missionDescription?: string
  missionIcon?: string
  visionTitle?: string
  visionDescription?: string
  visionIcon?: string
}

export type UpsertLucsPillarIntroDto = {
  title?: string
  description?: string
}

export type LucsBulletPointInput = {
  point: string
  description?: string
}

export type CreateLucsPillarDto = {
  title: string
  description?: string
  icon: string
  sortOrder?: number
  bulletPoints: LucsBulletPointInput[]
}

export type UpdateLucsPillarDto = Partial<CreateLucsPillarDto>

export type UpsertLucsCtaDto = {
  title?: string
  description?: string
  ctaType?: 'phone' | 'email' | 'url'
  ctaValue?: string
  ctaLabel?: string
}

export type CreateLucsInquiryDto = {
  name: string
  email: string
  message: string
}

export type GetLucsInquiriesParams = {
  page?: number
  perPage?: number
  search?: string
  isReviewed?: boolean
}

export function uploadLucsFile(file: File): Promise<UploadedAsset> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UploadedAsset>('/lucs/upload', {
    method: 'POST',
    body: formData,
  })
}

export function getLucsHero(): Promise<LucsHero | null> {
  return apiRequest<LucsHero | null>('/lucs/hero')
}

export function updateLucsHero(dto: UpsertLucsHeroDto): Promise<LucsHero> {
  return apiRequest<LucsHero>('/lucs/hero', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishLucsHero(): Promise<LucsHero> {
  return apiRequest<LucsHero>('/lucs/hero/publish', { method: 'PATCH' })
}

export function unpublishLucsHero(): Promise<LucsHero> {
  return apiRequest<LucsHero>('/lucs/hero/unpublish', { method: 'PATCH' })
}

export function getLucsWhoWeAre(): Promise<LucsWhoWeAre | null> {
  return apiRequest<LucsWhoWeAre | null>('/lucs/who-we-are')
}

export function updateLucsWhoWeAre(dto: UpsertLucsWhoWeAreDto): Promise<LucsWhoWeAre> {
  return apiRequest<LucsWhoWeAre>('/lucs/who-we-are', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishLucsWhoWeAre(): Promise<LucsWhoWeAre> {
  return apiRequest<LucsWhoWeAre>('/lucs/who-we-are/publish', { method: 'PATCH' })
}

export function unpublishLucsWhoWeAre(): Promise<LucsWhoWeAre> {
  return apiRequest<LucsWhoWeAre>('/lucs/who-we-are/unpublish', { method: 'PATCH' })
}

export function getLucsMission(): Promise<LucsMission | null> {
  return apiRequest<LucsMission | null>('/lucs/mission')
}

export function updateLucsMission(dto: UpsertLucsMissionDto): Promise<LucsMission> {
  return apiRequest<LucsMission>('/lucs/mission', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishLucsMission(): Promise<LucsMission> {
  return apiRequest<LucsMission>('/lucs/mission/publish', { method: 'PATCH' })
}

export function unpublishLucsMission(): Promise<LucsMission> {
  return apiRequest<LucsMission>('/lucs/mission/unpublish', { method: 'PATCH' })
}

export function getLucsPillarIntro(): Promise<LucsPillarIntro | null> {
  return apiRequest<LucsPillarIntro | null>('/lucs/pillar-intro')
}

export function updateLucsPillarIntro(dto: UpsertLucsPillarIntroDto): Promise<LucsPillarIntro> {
  return apiRequest<LucsPillarIntro>('/lucs/pillar-intro', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishLucsPillarIntro(): Promise<LucsPillarIntro> {
  return apiRequest<LucsPillarIntro>('/lucs/pillar-intro/publish', { method: 'PATCH' })
}

export function unpublishLucsPillarIntro(): Promise<LucsPillarIntro> {
  return apiRequest<LucsPillarIntro>('/lucs/pillar-intro/unpublish', { method: 'PATCH' })
}

export function getLucsCta(): Promise<LucsCta | null> {
  return apiRequest<LucsCta | null>('/lucs/cta')
}

export function updateLucsCta(dto: UpsertLucsCtaDto): Promise<LucsCta> {
  return apiRequest<LucsCta>('/lucs/cta', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishLucsCta(): Promise<LucsCta> {
  return apiRequest<LucsCta>('/lucs/cta/publish', { method: 'PATCH' })
}

export function unpublishLucsCta(): Promise<LucsCta> {
  return apiRequest<LucsCta>('/lucs/cta/unpublish', { method: 'PATCH' })
}

export function getLucsPillars(): Promise<LucsPillar[]> {
  return apiRequest<LucsPillar[]>('/lucs/pillars')
}

export function createLucsPillar(dto: CreateLucsPillarDto): Promise<LucsPillar> {
  return apiRequest<LucsPillar>('/lucs/pillars', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateLucsPillar(id: string, dto: UpdateLucsPillarDto): Promise<LucsPillar> {
  return apiRequest<LucsPillar>(`/lucs/pillars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishLucsPillar(id: string): Promise<LucsPillar> {
  return apiRequest<LucsPillar>(`/lucs/pillars/${id}/publish`, { method: 'PATCH' })
}

export function unpublishLucsPillar(id: string): Promise<LucsPillar> {
  return apiRequest<LucsPillar>(`/lucs/pillars/${id}/unpublish`, { method: 'PATCH' })
}

export function deleteLucsPillar(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/lucs/pillars/${id}`, { method: 'DELETE' })
}

export function createLucsInquiry(dto: CreateLucsInquiryDto): Promise<LucsInquiry> {
  return apiRequest<LucsInquiry>('/lucs/inquiries', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function getLucsInquiries(params: GetLucsInquiriesParams): Promise<PaginatedResponse<LucsInquiry>> {
  return apiRequest<PaginatedResponse<LucsInquiry>>(`/lucs/inquiries${toQueryString(params)}`)
}

export function getLucsInquiry(id: string): Promise<LucsInquiry> {
  return apiRequest<LucsInquiry>(`/lucs/inquiries/${id}`)
}

export function reviewLucsInquiry(id: string): Promise<LucsInquiry> {
  return apiRequest<LucsInquiry>(`/lucs/inquiries/${id}/review`, { method: 'PATCH' })
}

export function deleteLucsInquiry(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/lucs/inquiries/${id}`, { method: 'DELETE' })
}
