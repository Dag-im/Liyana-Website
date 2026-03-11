import { Route, Routes } from 'react-router-dom'

import AppShell from '@/components/layout/AppShell'
import AuditLogsPage from '@/features/audit-logs/AuditLogsPage'
import LoginPage from '@/features/auth/LoginPage'
import BookingsPage from '@/features/bookings/BookingsPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import DivisionCategoriesPage from '@/features/division-categories/DivisionCategoriesPage'
import DivisionDetailPage from '@/features/divisions/DivisionDetailPage'
import DivisionsPage from '@/features/divisions/DivisionsPage'
import NotificationsPage from '@/features/notifications/NotificationsPage'
import ServiceCategoriesPage from '@/features/service-categories/ServiceCategoriesPage'
import ServiceCategoryDetailPage from '@/features/service-categories/ServiceCategoryDetailPage'
import UserDetailPage from '@/features/users/UserDetailPage'
import UsersPage from '@/features/users/UsersPage'
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

          {/* Admin Only */}
          <Route element={<AdminRoute />}>
            <Route element={<UsersPage />} path="users" />
            <Route element={<UserDetailPage />} path="users/:id" />
            <Route element={<DivisionCategoriesPage />} path="division-categories" />
            <Route element={<ServiceCategoriesPage />} path="service-categories" />
            <Route element={<ServiceCategoryDetailPage />} path="service-categories/:id" />
            <Route element={<DivisionsPage />} path="divisions" />
            <Route element={<DivisionDetailPage />} path="divisions/:id" />
            <Route element={<AuditLogsPage />} path="audit-logs" />
          </Route>
        </Route>
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  )
}
