import type { ApiEnvelope, ApiError } from '@/types/api';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

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

export function getFileUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }

  if (path.startsWith('http')) {
    return path;
  }

  const apiBase = API_BASE_URL.replace(/\/$/, '');

  if (path.startsWith('/api/v1/uploads/')) {
    return `${apiBase.replace(/\/api\/v1$/, '')}${path}`;
  }

  if (path.startsWith('/uploads/')) {
    return `${apiBase}${path}`;
  }

  if (path.startsWith('/')) {
    return `${apiBase}/uploads${path}`;
  }

  if (path.startsWith('api/v1/uploads/')) {
    return `${apiBase.replace(/\/api\/v1$/, '')}/${path}`;
  }

  if (path.startsWith('uploads/')) {
    return `${apiBase}/${path}`;
  }

  return `${apiBase}/uploads/${path}`;
}

type ApiRequestInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export async function apiRequest<T>(
  path: string,
  init?: ApiRequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json()) as unknown;

  if (!isEnvelope(payload)) {
    throw new Error('Invalid API response format. Expected envelope shape.');
  }

  if (!response.ok || !payload.success || payload.error) {
    throw new ApiClientError(
      payload.error ?? {
        code: 'UNKNOWN_ERROR',
        message: 'Request failed',
      },
      response.status,
    );
  }

  return payload.data as T;
}
