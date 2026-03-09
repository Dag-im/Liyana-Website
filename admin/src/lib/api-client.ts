import type { ApiEnvelope, ApiError } from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const isEnvelope = (value: unknown): value is ApiEnvelope<unknown> => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const payload = value as Record<string, unknown>
  return 'success' in payload && 'data' in payload && 'error' in payload && 'meta' in payload
}

export class ApiClientError extends Error {
  readonly code: string
  readonly details?: unknown
  readonly traceId?: string
  readonly status: number

  constructor(apiError: ApiError, status: number) {
    super(apiError.message)
    this.name = 'ApiClientError'
    this.code = apiError.code
    this.details = apiError.details
    this.traceId = apiError.traceId
    this.status = status
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const payload = (await response.json()) as unknown

  if (!isEnvelope(payload)) {
    throw new Error('Invalid API response format. Expected envelope shape.')
  }

  if (!response.ok || !payload.success || payload.error) {
    throw new ApiClientError(
      payload.error ?? {
        code: 'UNKNOWN_ERROR',
        message: 'Request failed',
      },
      response.status,
    )
  }

  return payload.data as T
}
