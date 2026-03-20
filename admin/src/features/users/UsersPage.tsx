import { useQueryClient } from '@tanstack/react-query';
import { Edit, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import DataTable from '@/components/shared/DataTable';
import ErrorState from '@/components/shared/ErrorState';
import PageHeader from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/features/auth/useAuth';
import ChangePasswordDialog from '@/features/users/ChangePasswordDialog';
import DeactivateUserDialog from '@/features/users/DeactivateUserDialog';
import { useUsers } from '@/features/users/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { ROLES } from '@/lib/constants';
import { formatDate, formatEnumLabel, getRoleBadgeColor } from '@/lib/utils';
import type { UserRole } from '@/types/user.types';

type RoleFilter = UserRole | 'ALL';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const authQuery = useAuth();
  const { page, perPage, resetPage, setPage } = usePagination();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<RoleFilter>('ALL');
  const debouncedSearch = useDebounce(search, 400);

  const usersQuery = useUsers({
    page,
    perPage,
    search: debouncedSearch || undefined,
    role: role === 'ALL' ? undefined : role,
  });

  const isAdmin = authQuery.data?.role === 'ADMIN';

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        render: (row: any) => (
          <Link className="font-medium hover:underline" to={`/users/${row.id}`}>
            {row.name}
          </Link>
        ),
      },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'role',
        header: 'Role',
        render: (row: any) => (
          <span
            className={`rounded-full px-2 py-1 text-xs ${getRoleBadgeColor(row.role)}`}
          >
            {row.role}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        render: (row: any) => (
          <StatusBadge type="active" isActive={row.isActive} />
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        render: (row: any) => formatDate(row.createdAt),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        render: (row: any) =>
          isAdmin ? (
            <div className="flex items-center gap-1">
              <Link
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                state={{ from: '/users' }}
                title="Edit user"
                to={`/users/${row.id}/edit`}
              >
                <Edit className="h-4 w-4" />
              </Link>
              <ChangePasswordDialog user={row} />
              <DeactivateUserDialog user={row} />
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
    ],
    [isAdmin]
  );

  if (usersQuery.isError) {
    return (
      <ErrorState
        onRetry={() => {
          void queryClient.invalidateQueries({ queryKey: ['users'] });
          toast.error('Failed to load users');
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Users">
        {isAdmin ? (
          <Button asChild>
            <Link to="/users/new">
              <Plus className="h-4 w-4" />
              Create User
            </Link>
          </Button>
        ) : null}
      </PageHeader>

      <Card className="gap-0 p-4">
        <div className="flex flex-wrap gap-3">
          <Input
            className="max-w-sm"
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder="Search users"
            value={search}
          />
          <Select
            onValueChange={(value) => {
              const nextValue = (value ?? 'ALL') as RoleFilter;
              setRole(nextValue);
              resetPage();
            }}
            value={role}
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              {ROLES.map((roleOption) => (
                <SelectItem key={roleOption} value={roleOption}>
                  {formatEnumLabel(roleOption)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={usersQuery.data?.data ?? []}
        emptyDescription="Try adjusting your search or filter criteria."
        isError={usersQuery.isError}
        isLoading={usersQuery.isLoading}
        onRetry={() => usersQuery.refetch()}
        pagination={{
          page,
          perPage,
          total: usersQuery.data?.total ?? 0,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
