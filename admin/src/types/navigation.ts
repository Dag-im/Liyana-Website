import { Bell, Home, ScrollText, Users } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export type AppRoute = {
  path: string
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const APP_NAVIGATION: AppRoute[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/audit-logs', label: 'Audit Logs', icon: ScrollText, adminOnly: true },
]
