import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/features/auth/useAuth'
import type { UserRole } from '@/types/user.types'
import { Navigate, Outlet } from 'react-router-dom'

export default function RoleRoute({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const authQuery = useAuth()

  if (authQuery.isLoading) {
    return <LoadingSpinner fullPage />
  }

  if (authQuery.isError || !authQuery.data) {
    return <Navigate replace to="/login" />
  }

  if (!allowedRoles.includes(authQuery.data.role as any)) {
    return <ErrorState description="You do not have permission to access this page." title="Access denied" />
  }

  return <Outlet />
}
