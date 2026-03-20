import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  FolderTree,
  Home,
  Image,
  Inbox,
  LandPlot,
  LayoutGrid,
  MessageSquare,
  Milestone,
  Network,
  Newspaper,
  ScrollText,
  Tag,
  Trophy,
  UserCircle,
  Users,
} from 'lucide-react';
import type { UserRole } from './user.types';

export type AppRoute = {
  path: string;
  label: string;
  icon: LucideIcon;
  group?: 'overview' | 'operations' | 'content' | 'system';
  roles?: UserRole[];
  children?: AppRoute[];
};

export const APP_NAVIGATION: AppRoute[] = [
  { path: '/', label: 'Dashboard', icon: Home, group: 'overview' },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: Bell,
    group: 'overview',
  },
  { path: '/bookings', label: 'Bookings', icon: CalendarCheck, roles: ['ADMIN', 'CUSTOMER_SERVICE'], group: 'operations' },
  { path: '/users', label: 'Users', icon: Users, roles: ['ADMIN'], group: 'operations' },
  {
    path: '/division-categories',
    label: 'Division Categories',
    icon: LandPlot,
    roles: ['ADMIN'],
    group: 'operations',
  },
  {
    path: '/service-categories',
    label: 'Service Categories',
    icon: LayoutGrid,
    roles: ['ADMIN'],
    group: 'operations',
  },
  { path: '/divisions', label: 'Divisions', icon: Building2, roles: ['ADMIN'], group: 'operations' },
  {
    path: '/corporate-network',
    label: 'Corporate Network',
    icon: LandPlot,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'operations',
    children: [
      {
        path: '/corporate-network/relations',
        label: 'Relations',
        icon: Network,
        roles: ['ADMIN', 'COMMUNICATION'],
        group: 'operations',
      },
    ],
  },
  {
    path: '/faqs',
    label: 'FAQs',
    icon: CircleHelp,
    roles: ['ADMIN'],
    group: 'operations',
    children: [
      {
        path: '/faq-categories',
        label: 'FAQ Categories',
        icon: FolderTree,
        roles: ['ADMIN'],
        group: 'operations',
      },
    ],
  },
  {
    path: '/news',
    label: 'News',
    icon: Newspaper,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'content',
  },
  {
    path: '/events',
    label: 'Events',
    icon: CalendarDays,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'content',
  },
  {
    path: '/blogs',
    label: 'Blogs',
    icon: BookOpen,
    roles: ['ADMIN', 'COMMUNICATION', 'BLOGGER'],
    group: 'content',
    children: [
      {
        path: '/blogs/categories',
        label: 'Blog Categories',
        icon: FolderTree,
        roles: ['ADMIN', 'COMMUNICATION', 'BLOGGER'],
        group: 'content',
      },
    ],
  },
  {
    path: '/media',
    label: 'Media Gallery',
    icon: Image,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'content',
    children: [
      {
        path: '/media/tags',
        label: 'Media Tags',
        icon: Tag,
        roles: ['ADMIN', 'COMMUNICATION'],
        group: 'content',
      },
    ],
  },
  {
    path: '/team',
    label: 'Team & Leadership',
    icon: UserCircle,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'content',
  },
  {
    path: '/testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'content',
  },
  {
    path: '/contact',
    label: 'Contact Us',
    icon: Inbox,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'content',
  },
  {
    path: '/awards',
    label: 'Awards',
    icon: Trophy,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'content',
  },
  {
    path: '/timeline',
    label: 'Timeline',
    icon: Milestone,
    roles: ['ADMIN', 'COMMUNICATION'],
    group: 'content',
  },
  {
    path: '/cms',
    label: 'CMS',
    icon: ClipboardCheck,
    roles: ['ADMIN'],
    group: 'system',
  },
  {
    path: '/audit-logs',
    label: 'Audit Logs',
    icon: ScrollText,
    roles: ['ADMIN'],
    group: 'system',
  },
];
