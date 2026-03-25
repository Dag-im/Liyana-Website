import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/features/auth/useAuth'
import { AdminDashboard } from '@/features/dashboard/AdminDashboard'
import { BloggerDashboard, CommunicationDashboard, HrDashboard } from '@/features/dashboard/CommunicationDashboard'
import { CustomerServiceDashboard } from '@/features/dashboard/CustomerServiceDashboard'
import { DivisionManagerDashboard } from '@/features/dashboard/DivisionManagerDashboard'

export default function DashboardPage() {
  const { data: user, isLoading, isError, refetch } = useAuth()

  if (isLoading) return <LoadingSpinner />
  if (isError || !user) return <ErrorState onRetry={() => refetch()} />

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />
    case 'CUSTOMER_SERVICE':
      return <CustomerServiceDashboard user={user} />
    case 'COMMUNICATION':
      return <CommunicationDashboard user={user} />
    case 'HR':
      return <HrDashboard user={user} />
    case 'BLOGGER':
      return <BloggerDashboard user={user} />
    case 'DIVISION_MANAGER':
      return <DivisionManagerDashboard user={user} />
    default:
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
        </div>
      )
  }
}
