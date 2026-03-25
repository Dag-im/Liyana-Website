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
    'error' in payload &&
    'meta' in payload
  );
};

const toReadableString = (value: unknown, fallback = 'Request failed'): string => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : fallback;
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => toReadableString(item, ''))
      .filter((item) => item.length > 0);
    return parts.length > 0 ? parts.join(', ') : fallback;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const preferredKeys = ['message', 'error', 'detail', 'title'];

    for (const key of preferredKeys) {
      if (key in record) {
        const nested = toReadableString(record[key], '');
        if (nested.length > 0) {
          return nested;
        }
      }
    }

    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return fallback;
};

const toReadableDetails = (details: unknown): unknown => {
  if (!Array.isArray(details)) {
    return details;
  }

  return details.map((detail) => {
    if (!detail || typeof detail !== 'object') {
      return { message: toReadableString(detail, 'Validation failed') };
    }

    const record = detail as Record<string, unknown>;
    return {
      ...record,
      message: toReadableString(
        record.message ?? record.error ?? detail,
        'Validation failed'
      ),
    };
  });
};

export class ApiClientError extends Error {
  readonly code: string;
  readonly details?: unknown;
  readonly traceId?: string;
  readonly status: number;

  constructor(apiError: ApiError, status: number) {
    super(toReadableString(apiError.message));
    this.name = 'ApiClientError';
    this.code = apiError.code;
    this.details = toReadableDetails(apiError.details);
    this.traceId = apiError.traceId;
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: {
        ...(init?.body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch (error) {
    throw new ApiClientError(
      {
        code: 'NETWORK_ERROR',
        message: toReadableString(error, 'Network request failed'),
      },
      0
    );
  }

  const rawPayload = await response.text();
  let payload: unknown = null;

  if (rawPayload.length > 0) {
    try {
      payload = JSON.parse(rawPayload) as unknown;
    } catch {
      payload = null;
    }
  }

  if (!isEnvelope(payload)) {
    throw new ApiClientError(
      {
        code: 'INVALID_API_RESPONSE',
        message:
          rawPayload.length > 0
            ? toReadableString(rawPayload, 'Invalid API response format.')
            : 'Invalid API response format. Expected envelope shape.',
      },
      response.status
    );
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

  return (('data' in payload ? payload.data : null) as T);
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
