export type ContactSubmission = {
  id: string
  name: string
  email: string
  message: string
  isReviewed: boolean
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  perPage: number
}
