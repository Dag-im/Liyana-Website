import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import DataTable from '@/components/shared/DataTable'
import ErrorState from '@/components/shared/ErrorState'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import StatusBadge from '@/components/shared/StatusBadge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/features/auth/useAuth'
import ChangePasswordDialog from '@/features/users/ChangePasswordDialog'
import CreateUserDialog from '@/features/users/CreateUserDialog'
import DeactivateUserDialog from '@/features/users/DeactivateUserDialog'
import EditUserDialog from '@/features/users/EditUserDialog'
import { useUsers } from '@/features/users/useUsers'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { ROLES } from '@/lib/constants'
import { formatDate, getRoleBadgeColor } from '@/lib/utils'
import type { UserRole } from '@/types/user.types'

type RoleFilter = UserRole | 'ALL'

export default function UsersPage() {
  const queryClient = useQueryClient()
  const authQuery = useAuth()
  const { page, perPage, resetPage, setPage } = usePagination()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<RoleFilter>('ALL')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 400)

  const usersQuery = useUsers({
    page,
    perPage,
    search: debouncedSearch || undefined,
    role: role === 'ALL' ? undefined : role,
  })

  const isAdmin = authQuery.data?.role === 'ADMIN'

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        render: (row: any) => (
          <Link className="font-medium hover:underline" to={`/users/${row.id}`}>
            {row.name}
          </Link>
        ),
      },
      { key: 'email', header: 'Email' },
      {
        key: 'role',
        header: 'Role',
        render: (row: any) => (
          <span className={`rounded-full px-2 py-1 text-xs ${getRoleBadgeColor(row.role)}`}>
            {row.role}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (row: any) => <StatusBadge isActive={row.isActive} />,
      },
      {
        key: 'createdAt',
        header: 'Created At',
        render: (row: any) => formatDate(row.createdAt),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row: any) =>
          isAdmin ? (
            <div className="flex items-center gap-1">
              <EditUserDialog user={row} />
              <ChangePasswordDialog user={row} />
              <DeactivateUserDialog user={row} />
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
    ],
    [isAdmin],
  )

  if (usersQuery.isError) {
    return (
      <ErrorState
        onRetry={() => {
          void queryClient.invalidateQueries({ queryKey: ['users'] })
          toast.error('Failed to load users')
        }}
      />
    )
  }

  return (
    <div>
      <PageHeader title="Users">
        {isAdmin ? <CreateUserDialog onOpenChange={setCreateDialogOpen} open={createDialogOpen} /> : null}
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          className="max-w-sm"
          onChange={(event) => {
            setSearch(event.target.value)
            resetPage()
          }}
          placeholder="Search users"
          value={search}
        />
        <Select
          onValueChange={(value) => {
            const nextValue = (value ?? 'ALL') as RoleFilter
            setRole(nextValue)
            resetPage()
          }}
          value={role}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            {ROLES.map((roleOption) => (
              <SelectItem key={roleOption} value={roleOption}>
                {roleOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={usersQuery.data?.data ?? []}
        isError={usersQuery.isError}
        isLoading={usersQuery.isLoading}
        onRetry={() => usersQuery.refetch()}
      />

      <Pagination
        onPageChange={setPage}
        page={page}
        perPage={perPage}
        total={usersQuery.data?.total ?? 0}
      />
    </div>
  )
}
