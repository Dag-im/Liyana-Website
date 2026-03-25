export const DEFAULT_PAGE_SIZE = 20
export const NOTIFICATION_REFETCH_INTERVAL = 30_000
export const ROLES = ['ADMIN', 'COMMUNICATION', 'HR', 'BLOGGER', 'CUSTOMER_SERVICE', 'DIVISION_MANAGER'] as const
export const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const
export const SELECTION_TYPES = ['general', 'service', 'doctor'] as const
export const URGENCY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const
export const AUDIT_ACTIONS = [
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DEACTIVATED',
  'PASSWORD_CHANGED_BY_ADMIN',
  'USER_LOGIN',
  'USER_LOGOUT',
  'NOTIFICATION_CREATED',
] as const
