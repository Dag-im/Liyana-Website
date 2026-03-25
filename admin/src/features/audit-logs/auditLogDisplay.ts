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
  const result = getMetadataReadable(log, { maxEntries: 3, maxLength: 80 })
  return result.preview
}

type MetadataEntry = {
  key: string
  label: string
  value: string
  oldValue?: string
  newValue?: string
}

type GetMetadataReadableOptions = {
  maxEntries?: number
  maxLength?: number
}

function toHumanLabel(key: string): string {
  const noSuffix = key.replace(/_/g, ' ')
  const withSpaces = noSuffix.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  const normalized = withSpaces.trim().toLowerCase()
  if (!normalized) return key
  return normalized
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function toDisplayString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    const items = value
      .map((v) => toDisplayString(v))
      .filter(Boolean)
    if (items.length === 0) return ''
    return items.length > 3 ? `${items.slice(0, 3).join(', ')} +${items.length - 3}` : items.join(', ')
  }

  if (typeof value === 'object') {
    try {
      const text = JSON.stringify(value)
      return text === '{}' ? '' : truncate(text, 80)
    } catch {
      return ''
    }
  }

  return ''
}

function extractChangeLike(value: unknown): { oldValue?: unknown; newValue?: unknown } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const record = value as Record<string, unknown>

  const oldValue =
    record.oldValue ?? record.old ?? record.previous ?? record.from
  const newValue =
    record.newValue ?? record.new ?? record.current ?? record.to

  if (oldValue === undefined && newValue === undefined) return null

  return { oldValue, newValue }
}

function metadataKeyScore(key: string): number {
  const lower = key.toLowerCase()
  if (/(field|property|change|changes|status|role|name|title|label)/.test(lower)) return 0
  if (/(type|entity|summary|reason)/.test(lower)) return 2
  return 5
}

export function getMetadataReadable(
  log: AuditLog,
  { maxEntries = 8, maxLength = 80 }: GetMetadataReadableOptions = {},
): { entries: MetadataEntry[]; preview: string; remainingCount: number; totalCount: number } {
  const metadata = sanitizeMetadata(log.metadata)
  const entries: Array<MetadataEntry & { score: number }> = []

  const pushSimple = (key: string, rawValue: unknown) => {
    const value = toDisplayString(rawValue)
    if (!value) return
    entries.push({
      key,
      label: toHumanLabel(key),
      value,
      score: metadataKeyScore(key),
    })
  }

  const pushChange = (key: string, rawValue: unknown) => {
    const change = extractChangeLike(rawValue)
    if (!change) return

    const oldValue = toDisplayString(change.oldValue)
    const newValue = toDisplayString(change.newValue)
    if (!oldValue && !newValue) return

    entries.push({
      key,
      label: toHumanLabel(key),
      value: newValue || oldValue,
      oldValue: oldValue || undefined,
      newValue: newValue || undefined,
      score: metadataKeyScore(key),
    })
  }

  Object.entries(metadata).forEach(([key, rawValue]) => {
    // Heuristic: if the value itself is a change-like object, show as Old -> New.
    const change = extractChangeLike(rawValue)
    if (change) {
      pushChange(key, rawValue)
      return
    }

    // Heuristic: if the value is a map of changes, explode it.
    if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
      const record = rawValue as Record<string, unknown>
      const changeCandidates = Object.entries(record).filter(([, v]) => extractChangeLike(v) !== null)
      if (changeCandidates.length > 0) {
        changeCandidates.forEach(([subKey, subValue]) => {
          const subChange = extractChangeLike(subValue)
          if (!subChange) return
          const oldValue = toDisplayString(subChange.oldValue)
          const newValue = toDisplayString(subChange.newValue)
          if (!oldValue && !newValue) return
          entries.push({
            key: `${key}.${subKey}`,
            label: toHumanLabel(subKey),
            value: newValue || oldValue,
            oldValue: oldValue || undefined,
            newValue: newValue || undefined,
            score: metadataKeyScore(key),
          })
        })
        return
      }
    }

    pushSimple(key, rawValue)
  })

  const sorted = entries.sort((a, b) => a.score - b.score).map(({ score, ...rest }) => rest)

  const totalCount = sorted.length
  const shown = sorted.slice(0, maxEntries)
  const remainingCount = Math.max(0, totalCount - shown.length)

  const preview = (() => {
    if (shown.length === 0) return 'No metadata'
    const parts = shown.map((e) => {
      if (e.oldValue || e.newValue) {
        const oldText = e.oldValue ?? '—'
        const newText = e.newValue ?? '—'
        return `${e.label}: ${oldText} -> ${newText}`
      }
      return `${e.label}: ${e.value}`
    })
    const joined = parts.join(', ')
    return joined.length > maxLength ? truncate(joined, maxLength) : joined
  })()

  return { entries: shown, preview, remainingCount, totalCount }
}
