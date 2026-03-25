import { apiRequest } from '@/lib/api-client'
import type { PaginatedResponse, User, UserRole } from '@/types/user.types'

type SortOrder = 'ASC' | 'DESC' | 'asc' | 'desc'

export type GetUsersParams = {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: SortOrder
  search?: string
  startDate?: string
  endDate?: string
  role?: UserRole
}

export type CreateUserDto = {
  name: string
  email: string
  password: string
  role: UserRole
  divisionId?: string | null
  authorName?: string | null
  authorRole?: string | null
  isActive: boolean
}

export type UpdateUserDto = {
  name?: string
  email?: string
  role?: UserRole
  divisionId?: string | null
  authorName?: string | null
  authorRole?: string | null
  isActive?: boolean
}

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function getUsers(params: GetUsersParams): Promise<PaginatedResponse<User>> {
  return apiRequest<PaginatedResponse<User>>(`/users${toQueryString(params)}`)
}

export function getUser(id: string): Promise<User> {
  return apiRequest<User>(`/users/${id}`)
}

export function createUser(dto: CreateUserDto): Promise<User> {
  return apiRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateUser(id: string, dto: UpdateUserDto): Promise<User> {
  return apiRequest<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function changePassword(id: string, dto: { newPassword: string }): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/users/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deactivateUser(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/users/${id}`, {
    method: 'DELETE',
  })
}
