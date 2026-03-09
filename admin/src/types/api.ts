export type ApiError = {
  code: string
  message: string
  details?: unknown
  traceId?: string
}

export type ApiMeta = {
  requestId: string
  timestamp: string
  version: string
  page?: number
  perPage?: number
  total?: number
}

export type ApiEnvelope<T> = {
  success: boolean
  data: T | null
  error: ApiError | null
  meta: ApiMeta
}
