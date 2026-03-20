import { ArrowLeft, Edit } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import DataTable from '@/components/shared/DataTable'
import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuditLogs } from '@/features/audit-logs/useAuditLogs'
import { useUser } from '@/features/users/useUsers'
import { formatDate, truncate } from '@/lib/utils'

export default function UserDetailPage() {
  const { id = '' } = useParams()
  const userQuery = useUser(id)
  const logsQuery = useAuditLogs({ entityId: id, page: 1, perPage: 10 })

  if (userQuery.isLoading) {
    return <LoadingSpinner fullPage />
  }

  if (userQuery.isError) {
    return <ErrorState description="User not found" title="User not found" />
  }

  const user = userQuery.data

  if (!user) {
    return <ErrorState description="User not found" title="User not found" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/users">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to users
          </Button>
        </Link>
        <Button asChild variant="outline">
          <Link state={{ from: `/users/${id}` }} to={`/users/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit user
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Role:</span> {user.role}</p>
          <p><span className="font-medium">Status:</span> {user.isActive ? 'Active' : 'Inactive'}</p>
          <p><span className="font-medium">Created:</span> {formatDate(user.createdAt)}</p>
          <p><span className="font-medium">Updated:</span> {formatDate(user.updatedAt)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent audit logs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { accessorKey: 'action', header: 'Action' },
              { accessorKey: 'performedBy', header: 'Performed By' },
              {
                accessorKey: 'metadata',
                header: 'Metadata',
                render: (row: any) => truncate(JSON.stringify(row.metadata ?? {}), 60),
              },
              {
                accessorKey: 'createdAt',
                header: 'Created At',
                render: (row: any) => formatDate(row.createdAt),
              },
            ]}
            data={logsQuery.data?.data ?? []}
            isError={logsQuery.isError}
            isLoading={logsQuery.isLoading}
            onRetry={() => logsQuery.refetch()}
          />
        </CardContent>
      </Card>
    </div>
  )
}
