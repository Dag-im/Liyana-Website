import { Navigate, Outlet } from 'react-router-dom'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/features/auth/useAuth'

export default function CommunicationRoute() {
  const authQuery = useAuth()

  if (authQuery.isLoading) {
    return <LoadingSpinner fullPage />
  }

  if (authQuery.isError || !authQuery.data) {
    return <Navigate replace to="/login" />
  }

  if (authQuery.data.role !== 'ADMIN' && authQuery.data.role !== 'COMMUNICATION') {
    return <ErrorState description="You do not have permission to access this page." title="Access denied" />
  }

  return <Outlet />
}
