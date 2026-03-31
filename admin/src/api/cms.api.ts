import { apiRequest } from '@/lib/api-client'
import type {
  CoreValue,
  MissionVision,
  QualityPolicy,
  Stat,
  WhoWeAre,
} from '@/types/cms.types'

export const cmsApi = {
  getMissionVision(): Promise<MissionVision> {
    return apiRequest<MissionVision>('/cms/mission-vision')
  },

  updateMissionVision(dto: Partial<MissionVision>): Promise<MissionVision> {
    return apiRequest<MissionVision>('/cms/mission-vision', {
      method: 'PUT',
      body: JSON.stringify(dto),
    })
  },

  getWhoWeAre(): Promise<WhoWeAre> {
    return apiRequest<WhoWeAre>('/cms/who-we-are')
  },

  updateWhoWeAre(dto: { content: string }): Promise<WhoWeAre> {
    return apiRequest<WhoWeAre>('/cms/who-we-are', {
      method: 'PUT',
      body: JSON.stringify(dto),
    })
  },

  getCoreValues(): Promise<CoreValue[]> {
    return apiRequest<CoreValue[]>('/cms/core-values')
  },

  createCoreValue(dto: {
    title: string
    description: string
    icon: string
    sortOrder?: number
  }): Promise<CoreValue> {
    return apiRequest<CoreValue>('/cms/core-values', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  updateCoreValue(
    id: string,
    dto: Partial<{
      title: string
      description: string
      icon: string
      sortOrder: number
    }>
  ): Promise<CoreValue> {
    return apiRequest<CoreValue>(`/cms/core-values/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  deleteCoreValue(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/cms/core-values/${id}`, {
      method: 'DELETE',
    })
  },

  getStats(): Promise<Stat[]> {
    return apiRequest<Stat[]>('/cms/stats')
  },

  createStat(dto: {
    label: string
    value: number
    suffix?: string
    sortOrder?: number
  }): Promise<Stat> {
    return apiRequest<Stat>('/cms/stats', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  updateStat(
    id: string,
    dto: Partial<{
      label: string
      value: number
      suffix: string
      sortOrder: number
    }>
  ): Promise<Stat> {
    return apiRequest<Stat>(`/cms/stats/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  deleteStat(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/cms/stats/${id}`, {
      method: 'DELETE',
    })
  },

  getQualityPolicy(): Promise<QualityPolicy[]> {
    return apiRequest<QualityPolicy[]>('/cms/quality-policy')
  },

  upsertQualityPolicy(
    lang: string,
    dto: {
      goals: string[]
      sortOrder?: number
    }
  ): Promise<QualityPolicy> {
    return apiRequest<QualityPolicy>(`/cms/quality-policy/${encodeURIComponent(lang)}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    })
  },

  deleteQualityPolicy(lang: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/cms/quality-policy/${encodeURIComponent(lang)}`, {
      method: 'DELETE',
    })
  },
}
