import { ApiClientError } from '@/lib/api-client';
import { toast } from 'sonner';

const stringifyUnknown = (value: unknown, fallback: string): string => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : fallback;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => stringifyUnknown(item, ''))
      .filter((item) => item.length > 0);
    return parts.length > 0 ? parts.join(', ') : fallback;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;

    for (const key of ['message', 'error', 'detail', 'title']) {
      if (key in record) {
        const nested = stringifyUnknown(record[key], '');
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

  return fallback;
};

export function getErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred'
): string {
  if (error instanceof ApiClientError) {
    return stringifyUnknown(error.message, fallback);
  }

  if (error instanceof Error) {
    return stringifyUnknown(error.message, fallback);
  }

  return stringifyUnknown(error, fallback);
}

export function getErrorMessages(
  error: unknown,
  fallback = 'An unexpected error occurred'
): string[] {
  if (error instanceof ApiClientError && Array.isArray(error.details) && error.details.length > 0) {
    return error.details.map((detail) => {
      if (!detail || typeof detail !== 'object') {
        return stringifyUnknown(detail, fallback);
      }

      const record = detail as Record<string, unknown>;
      const field = stringifyUnknown(record.field, '').trim();
      const message = stringifyUnknown(
        record.message ?? record.error ?? detail,
        fallback
      );

      return field.length > 0 ? `${field}: ${message}` : message;
    });
  }

  return [getErrorMessage(error, fallback)];
}

export function showErrorToast(
  error: unknown,
  fallback = 'An unexpected error occurred'
) {
  getErrorMessages(error, fallback).forEach((message) => {
    toast.error(message);
  });
}

export function handleMutationError(
  error: unknown,
  fallback = 'An unexpected error occurred'
) {
  showErrorToast(error, fallback);
}
