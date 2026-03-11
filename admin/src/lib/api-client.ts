import type { ApiEnvelope, ApiError } from '@/types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

const isEnvelope = (value: unknown): value is ApiEnvelope<unknown> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    'success' in payload &&
    'data' in payload &&
    'error' in payload &&
    'meta' in payload
  );
};

export class ApiClientError extends Error {
  readonly code: string;
  readonly details?: unknown;
  readonly traceId?: string;
  readonly status: number;

  constructor(apiError: ApiError, status: number) {
    super(apiError.message);
    this.name = 'ApiClientError';
    this.code = apiError.code;
    this.details = apiError.details;
    this.traceId = apiError.traceId;
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      ...(init?.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json()) as unknown;

  if (!isEnvelope(payload)) {
    throw new Error('Invalid API response format. Expected envelope shape.');
  }

  if (!response.ok || !payload.success || payload.error) {
    if (
      response.status === 401 &&
      typeof window !== 'undefined' &&
      window.location.pathname !== '/login'
    ) {
      window.location.assign('/login');
    }

    throw new ApiClientError(
      payload.error ?? {
        code: 'UNKNOWN_ERROR',
        message: 'Request failed',
      },
      response.status
    );
  }

  return payload.data as T;
}

export async function fileRequest(path: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiClientError(
      {
        code: 'FILE_FETCH_FAILED',
        message: `Failed to fetch file: ${path}`,
      },
      response.status
    );
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
