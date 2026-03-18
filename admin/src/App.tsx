import { Route, Routes } from 'react-router-dom'

import AppShell from '@/components/layout/AppShell'
import AuditLogsPage from '@/features/audit-logs/AuditLogsPage'
import LoginPage from '@/features/auth/LoginPage'
import BlogDetailPage from '@/features/blogs/BlogDetailPage'
import BlogsPage from '@/features/blogs/BlogsPage'
import BookingsPage from '@/features/bookings/BookingsPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import DivisionCategoriesPage from '@/features/division-categories/DivisionCategoriesPage'
import DivisionDetailPage from '@/features/divisions/DivisionDetailPage'
import DivisionsPage from '@/features/divisions/DivisionsPage'
import EventsPage from '@/features/news-events/EventsPage'
import NewsEventDetailPage from '@/features/news-events/NewsEventDetailPage'
import NewsPage from '@/features/news-events/NewsPage'
import NotificationsPage from '@/features/notifications/NotificationsPage'
import ServiceCategoriesPage from '@/features/service-categories/ServiceCategoriesPage'
import ServiceCategoryDetailPage from '@/features/service-categories/ServiceCategoryDetailPage'
import UserDetailPage from '@/features/users/UserDetailPage'
import UsersPage from '@/features/users/UsersPage'
import CorporateNetworkPage from '@/features/corporate-network/CorporateNetworkPage'
import NetworkRelationsPage from '@/features/corporate-network/NetworkRelationsPage'
import MediaGalleryPage from '@/features/media/MediaGalleryPage'
import MediaTagsPage from '@/features/media/MediaTagsPage'
import MediaFolderDetailPage from '@/features/media/MediaFolderDetailPage'
import TeamPage from '@/features/team/TeamPage'
import TestimonialsPage from '@/features/testimonials/TestimonialsPage'
import ContactPage from '@/features/contact/ContactPage'
import CommunicationRoute from '@/components/auth/CommunicationRoute'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminRoute from '@/router/AdminRoute'
import ProtectedRoute from '@/router/ProtectedRoute'
import RoleRoute from '@/router/RoleRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />} path="/">
          <Route element={<DashboardPage />} index />
          <Route element={<NotificationsPage />} path="notifications" />

          {/* Customer Service & Admin */}
          <Route element={<RoleRoute allowedRoles={['ADMIN', 'CUSTOMER_SERVICE']} />}>
            <Route element={<BookingsPage />} path="bookings" />
          </Route>

          {/* Admin, Communication, Blogger */}
          <Route element={<RoleRoute allowedRoles={['ADMIN', 'COMMUNICATION', 'BLOGGER']} />}>
            <Route element={<BlogsPage />} path="blogs" />
            <Route element={<BlogDetailPage />} path="blogs/:id" />
          </Route>

          {/* Communication & Admin */}
          <Route element={<CommunicationRoute />}>
            <Route element={<NewsPage />} path="news" />
            <Route element={<EventsPage />} path="events" />
            <Route element={<NewsEventDetailPage />} path="news/:id" />
            <Route element={<NewsEventDetailPage />} path="events/:id" />
            <Route element={<MediaGalleryPage />} path="media" />
            <Route element={<MediaTagsPage />} path="media/tags" />
            <Route element={<MediaFolderDetailPage />} path="media/:folderId" />
            <Route element={<TeamPage />} path="team" />
            <Route element={<TestimonialsPage />} path="testimonials" />
            <Route element={<ContactPage />} path="contact" />
          </Route>

          {/* Admin Only */}
          <Route element={<AdminRoute />}>
            <Route element={<UsersPage />} path="users" />
            <Route element={<UserDetailPage />} path="users/:id" />
            <Route element={<DivisionCategoriesPage />} path="division-categories" />
            <Route element={<ServiceCategoriesPage />} path="service-categories" />
            <Route element={<ServiceCategoryDetailPage />} path="service-categories/:id" />
            <Route element={<DivisionsPage />} path="divisions" />
            <Route element={<DivisionDetailPage />} path="divisions/:id" />
            <Route element={<CorporateNetworkPage />} path="corporate-network" />
            <Route element={<NetworkRelationsPage />} path="corporate-network/relations" />
            <Route element={<AuditLogsPage />} path="audit-logs" />
          </Route>
        </Route>
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  )
}
