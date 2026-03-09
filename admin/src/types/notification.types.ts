import type { UserRole } from './user.types'

export type NotificationUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type Notification = {
  id: string
  title: string
  message: string
  urgency: NotificationUrgency
  targetRole: UserRole
  relatedEntityType: string | null
  relatedEntityId: string | null
  createdBy: string
  createdAt: string
  isRead: boolean
}
