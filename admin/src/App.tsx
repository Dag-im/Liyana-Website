import { Navigate, Route, Routes } from 'react-router-dom'

import AppShell from '@/components/layout/AppShell'
import LoginPage from '@/features/auth/LoginPage'
import AuditLogsPage from '@/features/audit-logs/AuditLogsPage'
import NotificationsPage from '@/features/notifications/NotificationsPage'
import UserDetailPage from '@/features/users/UserDetailPage'
import UsersPage from '@/features/users/UsersPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminRoute from '@/router/AdminRoute'
import ProtectedRoute from '@/router/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />} path="/">
          <Route element={<Navigate replace to="/users" />} index />
          <Route element={<HomePage />} path="home" />
          <Route element={<UsersPage />} path="users" />
          <Route element={<UserDetailPage />} path="users/:id" />
          <Route element={<NotificationsPage />} path="notifications" />

          <Route element={<AdminRoute />}>
            <Route element={<AuditLogsPage />} path="audit-logs" />
          </Route>
        </Route>
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  )
}
