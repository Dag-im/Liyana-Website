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
import BookingsComingSoonPage from '@/features/bookings/BookingsComingSoonPage';
import ContactPage from '@/features/contact/ContactPage';
import CorporateNetworkPage from '@/features/corporate-network/CorporateNetworkPage';
import NetworkEntityCreatePage from '@/features/corporate-network/NetworkEntityCreatePage';
import NetworkEntityEditPage from '@/features/corporate-network/NetworkEntityEditPage';
import NetworkRelationsPage from '@/features/corporate-network/NetworkRelationsPage';
import CmsCoreValuesPage from '@/features/cms/pages/CmsCoreValuesPage';
import CmsCoreValueFormPage from '@/features/cms/pages/CmsCoreValueFormPage';
import CmsMissionVisionFormPage from '@/features/cms/pages/CmsMissionVisionFormPage';
import CmsMissionVisionPage from '@/features/cms/pages/CmsMissionVisionPage';
import CmsOverviewPage from '@/features/cms/pages/CmsOverviewPage';
import CmsQualityPolicyFormPage from '@/features/cms/pages/CmsQualityPolicyFormPage';
import CmsQualityPolicyPage from '@/features/cms/pages/CmsQualityPolicyPage';
import CmsStatFormPage from '@/features/cms/pages/CmsStatFormPage';
import CmsStatsPage from '@/features/cms/pages/CmsStatsPage';
import CmsWhoWeArePage from '@/features/cms/pages/CmsWhoWeArePage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import EsgBridgePage from '@/features/esg/pages/EsgBridgePage';
import EsgGovernancePage from '@/features/esg/pages/EsgGovernancePage';
import EsgGovernanceFormPage from '@/features/esg/pages/EsgGovernanceFormPage';
import EsgHeroPage from '@/features/esg/pages/EsgHeroPage';
import EsgMetricsPage from '@/features/esg/pages/EsgMetricsPage';
import EsgMetricFormPage from '@/features/esg/pages/EsgMetricFormPage';
import EsgOverviewPage from '@/features/esg/pages/EsgOverviewPage';
import EsgPillarsPage from '@/features/esg/pages/EsgPillarsPage';
import EsgPillarFormPage from '@/features/esg/pages/EsgPillarFormPage';
import EsgReportFormPage from '@/features/esg/pages/EsgReportFormPage';
import EsgReportsPage from '@/features/esg/pages/EsgReportsPage';
import EsgStrategyPage from '@/features/esg/pages/EsgStrategyPage';
import DivisionCategoriesPage from '@/features/division-categories/DivisionCategoriesPage';
import DivisionCategoryCreatePage from '@/features/division-categories/DivisionCategoryCreatePage';
import DivisionCategoryEditPage from '@/features/division-categories/DivisionCategoryEditPage';
import IrContactPage from '@/features/ir/pages/IrContactPage';
import IrDocumentFormPage from '@/features/ir/pages/IrDocumentFormPage';
import IrDocumentsPage from '@/features/ir/pages/IrDocumentsPage';
import IrFinancialsPage from '@/features/ir/pages/IrFinancialsPage';
import IrHeroPage from '@/features/ir/pages/IrHeroPage';
import IrInquiriesPage from '@/features/ir/pages/IrInquiriesPage';
import IrKpiFormPage from '@/features/ir/pages/IrKpiFormPage';
import IrKpisPage from '@/features/ir/pages/IrKpisPage';
import IrOverviewPage from '@/features/ir/pages/IrOverviewPage';
import IrStrategyPage from '@/features/ir/pages/IrStrategyPage';
import LucsCtaPage from '@/features/lucs/pages/LucsCtaPage';
import LucsHeroPage from '@/features/lucs/pages/LucsHeroPage';
import LucsInquiriesPage from '@/features/lucs/pages/LucsInquiriesPage';
import LucsMissionPage from '@/features/lucs/pages/LucsMissionPage';
import LucsOverviewPage from '@/features/lucs/pages/LucsOverviewPage';
import LucsPillarFormPage from '@/features/lucs/pages/LucsPillarFormPage';
import LucsPillarsPage from '@/features/lucs/pages/LucsPillarsPage';
import LucsWhoWeArePage from '@/features/lucs/pages/LucsWhoWeArePage';
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
            <Route element={<BookingsComingSoonPage />} path="bookings" />
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
            <Route element={<EsgOverviewPage />} path="esg-admin" />
            <Route element={<EsgHeroPage />} path="esg-admin/hero" />
            <Route element={<EsgStrategyPage />} path="esg-admin/strategy" />
            <Route element={<EsgPillarsPage />} path="esg-admin/pillars" />
            <Route element={<EsgPillarFormPage />} path="esg-admin/pillars/new" />
            <Route element={<EsgPillarFormPage />} path="esg-admin/pillars/:id/edit" />
            <Route element={<EsgMetricsPage />} path="esg-admin/metrics" />
            <Route element={<EsgMetricFormPage />} path="esg-admin/metrics/new" />
            <Route element={<EsgMetricFormPage />} path="esg-admin/metrics/:id/edit" />
            <Route element={<EsgGovernancePage />} path="esg-admin/governance" />
            <Route element={<EsgGovernanceFormPage />} path="esg-admin/governance/new" />
            <Route element={<EsgGovernanceFormPage />} path="esg-admin/governance/:id/edit" />
            <Route element={<EsgReportsPage />} path="esg-admin/reports" />
            <Route element={<EsgReportFormPage />} path="esg-admin/reports/new" />
            <Route element={<EsgReportFormPage />} path="esg-admin/reports/:id/edit" />
            <Route element={<EsgBridgePage />} path="esg-admin/lucs-bridge" />
            <Route element={<IrOverviewPage />} path="ir-admin" />
            <Route element={<IrHeroPage />} path="ir-admin/hero" />
            <Route element={<IrKpisPage />} path="ir-admin/kpis" />
            <Route element={<IrKpiFormPage />} path="ir-admin/kpis/new" />
            <Route element={<IrKpiFormPage />} path="ir-admin/kpis/:id/edit" />
            <Route element={<IrStrategyPage />} path="ir-admin/strategy" />
            <Route element={<IrFinancialsPage />} path="ir-admin/financials" />
            <Route element={<IrDocumentsPage />} path="ir-admin/documents" />
            <Route element={<IrDocumentFormPage />} path="ir-admin/documents/new" />
            <Route element={<IrDocumentFormPage />} path="ir-admin/documents/:id/edit" />
            <Route element={<IrContactPage />} path="ir-admin/contact" />
            <Route element={<IrInquiriesPage />} path="ir-admin/inquiries" />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN', 'LUCS_ADMIN']} />}>
            <Route element={<LucsOverviewPage />} path="lucs-admin" />
            <Route element={<LucsHeroPage />} path="lucs-admin/hero" />
            <Route element={<LucsWhoWeArePage />} path="lucs-admin/who-we-are" />
            <Route element={<LucsMissionPage />} path="lucs-admin/mission" />
            <Route element={<LucsPillarsPage />} path="lucs-admin/pillars" />
            <Route element={<LucsPillarFormPage />} path="lucs-admin/pillars/new" />
            <Route element={<LucsPillarFormPage />} path="lucs-admin/pillars/:id/edit" />
            <Route element={<LucsCtaPage />} path="lucs-admin/cta" />
            <Route element={<LucsInquiriesPage />} path="lucs-admin/inquiries" />
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
            <Route element={<CmsOverviewPage />} path="cms" />
            <Route element={<CmsMissionVisionPage />} path="cms/mission-vision" />
            <Route element={<CmsMissionVisionFormPage />} path="cms/mission-vision/edit" />
            <Route element={<CmsWhoWeArePage />} path="cms/who-we-are" />
            <Route element={<CmsCoreValuesPage />} path="cms/core-values" />
            <Route element={<CmsCoreValueFormPage />} path="cms/core-values/new" />
            <Route element={<CmsCoreValueFormPage />} path="cms/core-values/:id/edit" />
            <Route element={<CmsStatsPage />} path="cms/stats" />
            <Route element={<CmsStatFormPage />} path="cms/stats/new" />
            <Route element={<CmsStatFormPage />} path="cms/stats/:id/edit" />
            <Route element={<CmsQualityPolicyPage />} path="cms/quality-policy" />
            <Route element={<CmsQualityPolicyFormPage />} path="cms/quality-policy/new" />
            <Route element={<CmsQualityPolicyFormPage />} path="cms/quality-policy/:lang/edit" />
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
