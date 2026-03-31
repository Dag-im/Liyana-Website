import type { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/lib/constants'

export type AuditAction = (typeof AUDIT_ACTIONS)[number]
export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[number]

export type AuditLog = {
  id: string
  action: AuditAction
  entityType: AuditEntityType | string
  entityId: string
  entityName?: string
  performedBy: string
  performedByName?: string
  performedByEmail?: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}
