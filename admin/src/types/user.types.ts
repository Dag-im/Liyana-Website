import type { Division } from './services.types'

export type UserRole =
  | 'ADMIN'
  | 'COMMUNICATION'
  | 'HR'
  | 'BLOGGER'
  | 'CUSTOMER_SERVICE'
  | 'DIVISION_MANAGER'
  | 'LUCS_ADMIN'

export type User = {
  id: string
  name: string
  authorName: string | null
  authorRole: string | null
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
