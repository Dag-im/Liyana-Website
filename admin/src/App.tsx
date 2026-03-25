import { Outlet, Route, Routes } from 'react-router-dom';

import CommunicationRoute from '@/components/auth/CommunicationRoute';
import AppShell from '@/components/layout/AppShell';
import AuditLogDetailPage from '@/features/audit-logs/AuditLogDetailPage';
import AuditLogsPage from '@/features/audit-logs/AuditLogsPage';
import LoginPage from '@/features/auth/LoginPage';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import AwardsPage from '@/features/awards/AwardsPage';
import AwardCreatePage from '@/features/awards/AwardCreatePage';
import AwardEditPage from '@/features/awards/AwardEditPage';
import BlogCreatePage from '@/features/blogs/BlogCreatePage';
import BlogCategoriesPage from '@/features/blogs/BlogCategoriesPage';
import BlogDetailPage from '@/features/blogs/BlogDetailPage';
import BlogEditPage from '@/features/blogs/BlogEditPage';
import BlogsPage from '@/features/blogs/BlogsPage';
import BookingsPage from '@/features/bookings/BookingsPage';
import ContactPage from '@/features/contact/ContactPage';
import CorporateNetworkPage from '@/features/corporate-network/CorporateNetworkPage';
import NetworkEntityCreatePage from '@/features/corporate-network/NetworkEntityCreatePage';
import NetworkEntityEditPage from '@/features/corporate-network/NetworkEntityEditPage';
import NetworkRelationsPage from '@/features/corporate-network/NetworkRelationsPage';
import CmsPage from '@/features/cms/CmsPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import DivisionCategoriesPage from '@/features/division-categories/DivisionCategoriesPage';
import DivisionCategoryCreatePage from '@/features/division-categories/DivisionCategoryCreatePage';
import DivisionCategoryEditPage from '@/features/division-categories/DivisionCategoryEditPage';
import DivisionCreatePage from '@/features/divisions/DivisionCreatePage';
import DivisionDetailPage from '@/features/divisions/DivisionDetailPage';
import DivisionEditPage from '@/features/divisions/DivisionEditPage';
import DivisionsPage from '@/features/divisions/DivisionsPage';
import FaqCategoriesPage from '@/features/faqs/FaqCategoriesPage';
import FaqCategoryCreatePage from '@/features/faqs/FaqCategoryCreatePage';
import FaqCategoryEditPage from '@/features/faqs/FaqCategoryEditPage';
import FaqCreatePage from '@/features/faqs/FaqCreatePage';
import FaqEditPage from '@/features/faqs/FaqEditPage';
import FaqsPage from '@/features/faqs/FaqsPage';
import MediaFolderDetailPage from '@/features/media/MediaFolderDetailPage';
import MediaFolderCreatePage from '@/features/media/MediaFolderCreatePage';
import MediaFolderEditPage from '@/features/media/MediaFolderEditPage';
import MediaGalleryPage from '@/features/media/MediaGalleryPage';
import MediaItemCreatePage from '@/features/media/MediaItemCreatePage';
import MediaItemEditPage from '@/features/media/MediaItemEditPage';
import MediaTagCreatePage from '@/features/media/MediaTagCreatePage';
import MediaTagEditPage from '@/features/media/MediaTagEditPage';
import MediaTagsPage from '@/features/media/MediaTagsPage';
import EventsPage from '@/features/news-events/EventsPage';
import NewsEventCreatePage from '@/features/news-events/NewsEventCreatePage';
import NewsEventDetailPage from '@/features/news-events/NewsEventDetailPage';
import NewsEventEditPage from '@/features/news-events/NewsEventEditPage';
import NewsPage from '@/features/news-events/NewsPage';
import NotificationsPage from '@/features/notifications/NotificationsPage';
import BasicsPage from '@/features/my-division/BasicsPage';
import MyDivisionBookingsPage from '@/features/my-division/BookingsPage';
import DescriptionPage from '@/features/my-division/DescriptionPage';
import ExtrasPage from '@/features/my-division/ExtrasPage';
import MedicalTeamPage from '@/features/my-division/MedicalTeamPage';
import MediaPage from '@/features/my-division/MediaPage';
import TeamPageManaged from '@/features/my-division/TeamPage';
import ServiceCategoriesPage from '@/features/service-categories/ServiceCategoriesPage';
import ServiceCategoryCreatePage from '@/features/service-categories/ServiceCategoryCreatePage';
import ServiceCategoryDetailPage from '@/features/service-categories/ServiceCategoryDetailPage';
import ServiceCategoryEditPage from '@/features/service-categories/ServiceCategoryEditPage';
import TeamPage from '@/features/team/TeamPage';
import TeamCreatePage from '@/features/team/TeamCreatePage';
import TeamEditPage from '@/features/team/TeamEditPage';
import TestimonialsPage from '@/features/testimonials/TestimonialsPage';
import TimelinePage from '@/features/timeline/TimelinePage';
import TimelineCreatePage from '@/features/timeline/TimelineCreatePage';
import TimelineEditPage from '@/features/timeline/TimelineEditPage';
import UserDetailPage from '@/features/users/UserDetailPage';
import UserCreatePage from '@/features/users/UserCreatePage';
import UserEditPage from '@/features/users/UserEditPage';
import UsersPage from '@/features/users/UsersPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminRoute from '@/router/AdminRoute';
import ProtectedRoute from '@/router/ProtectedRoute';
import RoleRoute from '@/router/RoleRoute';
import { useAuth } from '@/features/auth/useAuth';

export default function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />} path="/">
          <Route element={<DashboardPage />} index />
          <Route element={<DashboardPage />} path="dashboard" />
          <Route element={<NotificationsPage />} path="notifications" />

          {/* Customer Service & Admin */}
          <Route
            element={<RoleRoute allowedRoles={['ADMIN', 'CUSTOMER_SERVICE']} />}
          >
            <Route element={<BookingsPage />} path="bookings" />
          </Route>

          <Route element={<DivisionManagerRoute />}>
            <Route element={<BasicsPage />} path="my-division/basics" />
            <Route element={<MediaPage />} path="my-division/media" />
            <Route element={<DescriptionPage />} path="my-division/description" />
            <Route element={<ExtrasPage />} path="my-division/extras" />
            <Route element={<MedicalTeamPage />} path="my-division/medical-team" />
            <Route element={<MyDivisionBookingsPage />} path="my-division/bookings" />
            <Route element={<TeamPageManaged />} path="my-division/team" />
          </Route>

          {/* Admin, Communication, Blogger */}
          <Route
            element={
              <RoleRoute allowedRoles={['ADMIN', 'COMMUNICATION', 'BLOGGER']} />
            }
          >
            <Route element={<BlogsPage />} path="blogs" />
            <Route element={<BlogCategoriesPage />} path="blogs/categories" />
            <Route element={<BlogCreatePage />} path="blogs/new" />
            <Route element={<BlogDetailPage />} path="blogs/:id" />
            <Route element={<BlogEditPage />} path="blogs/:id/edit" />
          </Route>

          {/* Communication & Admin */}
          <Route element={<CommunicationRoute />}>
            <Route element={<NewsPage />} path="news" />
            <Route element={<NewsEventCreatePage type="news" />} path="news/new" />
            <Route element={<EventsPage />} path="events" />
            <Route element={<NewsEventCreatePage type="event" />} path="events/new" />
            <Route element={<NewsEventDetailPage />} path="news/:id" />
            <Route element={<NewsEventEditPage />} path="news/:id/edit" />
            <Route element={<NewsEventDetailPage />} path="events/:id" />
            <Route element={<NewsEventEditPage />} path="events/:id/edit" />
            <Route element={<MediaGalleryPage />} path="media" />
            <Route element={<MediaFolderCreatePage />} path="media/new" />
            <Route element={<MediaTagsPage />} path="media/tags" />
            <Route element={<MediaTagCreatePage />} path="media/tags/new" />
            <Route element={<MediaTagEditPage />} path="media/tags/:id/edit" />
            <Route element={<MediaFolderDetailPage />} path="media/:folderId" />
            <Route element={<MediaFolderEditPage />} path="media/:folderId/edit" />
            <Route element={<MediaItemCreatePage />} path="media/:folderId/items/new" />
            <Route element={<MediaItemEditPage />} path="media/:folderId/items/:itemId/edit" />
            <Route element={<TeamPage />} path="team" />
            <Route element={<TeamCreatePage />} path="team/new" />
            <Route element={<TeamEditPage />} path="team/:id/edit" />
            <Route element={<TestimonialsPage />} path="testimonials" />
            <Route element={<ContactPage />} path="contact" />
            <Route element={<AwardsPage />} path="awards" />
            <Route element={<AwardCreatePage />} path="awards/new" />
            <Route element={<AwardEditPage />} path="awards/:id/edit" />
            <Route element={<TimelinePage />} path="timeline" />
            <Route element={<TimelineCreatePage />} path="timeline/new" />
            <Route element={<TimelineEditPage />} path="timeline/:id/edit" />
          </Route>

          {/* Admin Only */}
          <Route element={<AdminRoute />}>
            <Route element={<UsersPage />} path="users" />
            <Route element={<UserCreatePage />} path="users/new" />
            <Route element={<UserDetailPage />} path="users/:id" />
            <Route element={<UserEditPage />} path="users/:id/edit" />
            <Route
              element={<DivisionCategoriesPage />}
              path="division-categories"
            />
            <Route
              element={<DivisionCategoryCreatePage />}
              path="division-categories/new"
            />
            <Route
              element={<DivisionCategoryEditPage />}
              path="division-categories/:id/edit"
            />
            <Route
              element={<ServiceCategoriesPage />}
              path="service-categories"
            />
            <Route
              element={<ServiceCategoryCreatePage />}
              path="service-categories/new"
            />
            <Route
              element={<ServiceCategoryDetailPage />}
              path="service-categories/:id"
            />
            <Route
              element={<ServiceCategoryEditPage />}
              path="service-categories/:id/edit"
            />
            <Route element={<DivisionsPage />} path="divisions" />
            <Route element={<DivisionCreatePage />} path="divisions/new" />
            <Route element={<DivisionDetailPage />} path="divisions/:id" />
            <Route element={<DivisionEditPage />} path="divisions/:id/edit" />
            <Route
              element={<CorporateNetworkPage />}
              path="corporate-network"
            />
            <Route
              element={<NetworkEntityCreatePage />}
              path="corporate-network/new"
            />
            <Route
              element={<NetworkEntityEditPage />}
              path="corporate-network/:id/edit"
            />
            <Route
              element={<NetworkRelationsPage />}
              path="corporate-network/relations"
            />
            <Route element={<FaqsPage />} path="faqs" />
            <Route element={<FaqCreatePage />} path="faqs/new" />
            <Route element={<FaqEditPage />} path="faqs/:id/edit" />
            <Route element={<FaqCategoriesPage />} path="faq-categories" />
            <Route element={<FaqCategoryCreatePage />} path="faq-categories/new" />
            <Route element={<FaqCategoryEditPage />} path="faq-categories/:id/edit" />
            <Route element={<CmsPage />} path="cms" />
            <Route element={<AuditLogsPage />} path="audit-logs" />
            <Route element={<AuditLogDetailPage />} path="audit-logs/:id" />
          </Route>
        </Route>
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

function DivisionManagerRoute() {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (user?.role !== 'DIVISION_MANAGER') {
    return <div className="p-8 text-center text-slate-500">Access Denied</div>;
  }

  return <Outlet />;
}
