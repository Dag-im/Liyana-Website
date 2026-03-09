export type AuditAction =
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DEACTIVATED'
  | 'PASSWORD_CHANGED_BY_ADMIN'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'NOTIFICATION_CREATED'

export type AuditLog = {
  id: string
  action: AuditAction
  entityType: string
  entityId: string
  performedBy: string
  metadata: Record<string, unknown> | null
  createdAt: string
}
