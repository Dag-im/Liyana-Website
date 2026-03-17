import { apiRequest } from '@/lib/api-client'
import type { TeamMember } from '@/types/team.types'
import type { PaginatedResponse } from '@/types/user.types'

export async function uploadTeamMemberImage(file: File): Promise<{ path: string }> {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest<{ path: string }>('/team/upload', {
    method: 'POST',
    body: formData,
  })
}

export async function getTeamMembers(params: {
  page?: number
  perPage?: number
  search?: string
  divisionId?: string
  isCorporate?: boolean
  includeHidden?: boolean
}): Promise<PaginatedResponse<TeamMember>> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, value.toString())
  })
  const query = searchParams.toString()
  return apiRequest<PaginatedResponse<TeamMember>>(`/team${query ? `?${query}` : ''}`)
}

export async function getTeamMember(id: string): Promise<TeamMember> {
  return apiRequest<TeamMember>(`/team/${id}`)
}

export async function createTeamMember(dto: {
  name: string
  position: string
  bio: string
  image?: string
  isCorporate: boolean
  divisionId?: string
  sortOrder?: number
}): Promise<TeamMember> {
  return apiRequest<TeamMember>('/team', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export async function updateTeamMember(
  id: string,
  dto: Partial<{
    name: string
    position: string
    bio: string
    image: string
    isCorporate: boolean
    divisionId: string | null
    sortOrder: number
  }>
): Promise<TeamMember> {
  return apiRequest<TeamMember>(`/team/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export async function deleteTeamMember(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/team/${id}`, {
    method: 'DELETE',
  })
}
