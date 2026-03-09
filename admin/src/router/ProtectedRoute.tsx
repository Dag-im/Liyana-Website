import { Navigate, Outlet } from 'react-router-dom'

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/features/auth/useAuth'

export default function ProtectedRoute() {
  const authQuery = useAuth()

  if (authQuery.isLoading) {
    return <LoadingSpinner fullPage />
  }

  if (authQuery.isError || !authQuery.data) {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}
