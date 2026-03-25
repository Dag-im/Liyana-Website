import { formatEnumLabel, truncate } from '@/lib/utils'
import type { AuditLog } from '@/types/audit-log.types'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry))
  }

  if (value && typeof value === 'object') {
    return sanitizeMetadata(value as Record<string, unknown>)
  }

  if (isUuid(value)) {
    return '[hidden]'
  }

  return value
}

export function sanitizeMetadata(
  metadata: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!metadata || typeof metadata !== 'object') {
    return {}
  }

  return Object.entries(metadata).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (key.toLowerCase().endsWith('id')) {
      return acc
    }

    const sanitized = sanitizeValue(value)
    if (sanitized === null || sanitized === undefined || sanitized === '') {
      return acc
    }

    acc[key] = sanitized
    return acc
  }, {})
}

export function getPerformedByLabel(log: AuditLog): string {
  if (log.performedByName?.trim()) {
    return log.performedByName
  }

  if (log.performedBy === 'public') {
    return 'Public User'
  }

  return 'System User'
}

export function getEntityLabel(log: AuditLog): string {
  if (log.entityName?.trim()) {
    return log.entityName
  }

  const metadata = sanitizeMetadata(log.metadata)
  const fallbackKeys = [
    'entityName',
    'title',
    'name',
    'label',
    'categoryName',
    'divisionName',
    'blogTitle',
    'newsTitle',
    'eventTitle',
    'folderName',
    'tagName',
    'email',
  ]

  for (const key of fallbackKeys) {
    const value = metadata[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return formatEnumLabel(log.entityType)
}

export function getMetadataPreview(log: AuditLog): string {
  const metadata = sanitizeMetadata(log.metadata)
  const text = JSON.stringify(metadata)
  return text === '{}' ? 'No metadata' : truncate(text, 80)
}
