export type UserRole = 'ADMIN' | 'COMMUNICATION' | 'HR' | 'BLOGGER'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
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
