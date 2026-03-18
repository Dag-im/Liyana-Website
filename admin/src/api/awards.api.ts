import { apiRequest } from '@/lib/api-client'
import type { Award } from '@/types/awards.types'
import type { PaginatedResponse } from '@/types/user.types'

export type GetAwardsParams = {
  page?: number
  perPage?: number
  search?: string
  year?: string
  category?: string
}

export type CreateAwardDto = Omit<Award, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateAwardDto = Partial<CreateAwardDto>

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const awardsApi = {
  async uploadAwardImage(file: File): Promise<{ path: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const result = await apiRequest<{ path?: string; url?: string }>('/awards/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    })

    return { path: result.path ?? result.url ?? '' }
  },

  getAwards(params: GetAwardsParams): Promise<PaginatedResponse<Award>> {
    return apiRequest<PaginatedResponse<Award>>(`/awards${buildQuery(params)}`)
  },

  getAward(id: string): Promise<Award> {
    return apiRequest<Award>(`/awards/${id}`)
  },

  createAward(dto: CreateAwardDto): Promise<Award> {
    return apiRequest<Award>('/awards', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  updateAward(id: string, dto: UpdateAwardDto): Promise<Award> {
    return apiRequest<Award>(`/awards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  deleteAward(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/awards/${id}`, {
      method: 'DELETE',
    })
  },
}
