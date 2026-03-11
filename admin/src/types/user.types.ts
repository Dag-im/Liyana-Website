import type { Division } from './services.types'

export type UserRole = 'ADMIN' | 'COMMUNICATION' | 'HR' | 'BLOGGER' | 'CUSTOMER_SERVICE'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  divisionId: string | null
  division: Division | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  perPage: number
}
