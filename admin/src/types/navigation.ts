import type { LucideIcon } from 'lucide-react'
import { Bell, BookOpen, Building2, CalendarCheck, CalendarDays, Home, LandPlot, LayoutGrid, Newspaper, ScrollText, Users, Image, UserCircle, MessageSquare, Inbox } from 'lucide-react'
import type { UserRole } from './user.types'

export type AppRoute = {
  path: string
  label: string
  icon: LucideIcon
  roles?: UserRole[]
}

export const APP_NAVIGATION: AppRoute[] = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
  { path: '/division-categories', label: 'Division Categories', icon: LandPlot, roles: ['ADMIN'] },
  { path: '/service-categories', label: 'Service Categories', icon: LayoutGrid, roles: ['ADMIN'] },
  { path: '/divisions', label: 'Divisions', icon: Building2, roles: ['ADMIN'] },
  { path: '/news', label: 'News', icon: Newspaper, roles: ['ADMIN', 'COMMUNICATION'] },
  { path: '/events', label: 'Events', icon: CalendarDays, roles: ['ADMIN', 'COMMUNICATION'] },
  { path: '/blogs', label: 'Blogs', icon: BookOpen, roles: ['ADMIN', 'COMMUNICATION', 'BLOGGER'] },
  { path: '/corporate-network', label: 'Corporate Network', icon: LandPlot, roles: ['ADMIN', 'COMMUNICATION'] },
  { path: '/media', label: 'Media Gallery', icon: Image, roles: ['ADMIN', 'COMMUNICATION'] },
  { path: '/team', label: 'Team & Leadership', icon: UserCircle, roles: ['ADMIN', 'COMMUNICATION'] },
  { path: '/testimonials', label: 'Testimonials', icon: MessageSquare, roles: ['ADMIN', 'COMMUNICATION'] },
  { path: '/contact', label: 'Contact Us', icon: Inbox, roles: ['ADMIN', 'COMMUNICATION'] },
  { path: '/bookings', label: 'Bookings', icon: CalendarCheck, roles: ['ADMIN', 'CUSTOMER_SERVICE'] },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/audit-logs', label: 'Audit Logs', icon: ScrollText, roles: ['ADMIN'] },
]
