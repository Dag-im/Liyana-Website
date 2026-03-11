import type { LucideIcon } from 'lucide-react'
import { Bell, Building2, CalendarCheck, Home, LandPlot, LayoutGrid, ScrollText, Users } from 'lucide-react'
import type { UserRole } from './user.types'

export type AppRoute = {
  path: string
  label: string
  icon: LucideIcon
  roles?: UserRole[]
}

export const APP_NAVIGATION: AppRoute[] = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/bookings', label: 'Bookings', icon: CalendarCheck, roles: ['ADMIN', 'CUSTOMER_SERVICE'] },
  { path: '/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
  { path: '/division-categories', label: 'Division Categories', icon: LandPlot, roles: ['ADMIN'] },
  { path: '/service-categories', label: 'Service Categories', icon: LayoutGrid, roles: ['ADMIN'] },
  { path: '/divisions', label: 'Divisions', icon: Building2, roles: ['ADMIN'] },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/audit-logs', label: 'Audit Logs', icon: ScrollText, roles: ['ADMIN'] },
]
