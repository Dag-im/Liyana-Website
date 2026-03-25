import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, KeyRound, Plus, UserMinus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/useAuth'
import { useChangePassword } from '@/features/users/useUsers'
import {
  useCreateCSUser,
  useDeactivateCSUser,
  useMyTeam,
  useUpdateCSUser,
} from '@/features/my-division/useMyTeam'
import { usePagination } from '@/hooks/usePagination'
import { showErrorToast } from '@/lib/error-utils'
import type { User } from '@/types/user.types'

const createMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const editMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
})

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

type CreateMemberForm = z.infer<typeof createMemberSchema>
type EditMemberForm = z.infer<typeof editMemberSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function TeamPage() {
  const { data: user } = useAuth()
  const { page, perPage, setPage, setPerPage } = usePagination()
  const teamQuery = useMyTeam({ page, perPage })

  const createMutation = useCreateCSUser()
  const updateMutation = useUpdateCSUser()
  const deactivateMutation = useDeactivateCSUser()

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const createForm = useForm<CreateMemberForm>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const editForm = useForm<EditMemberForm>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
    },
  })

  const openEdit = (member: User) => {
    setSelectedUser(member)
    editForm.reset({
      name: member.name,
      email: member.email,
    })
    setEditOpen(true)
  }

  const openPassword = (member: User) => {
    setSelectedUser(member)
    passwordForm.reset({ newPassword: '' })
    setPasswordOpen(true)
  }

  const openDeactivate = (member: User) => {
    setSelectedUser(member)
    setDeactivateOpen(true)
  }

  const onCreate = (values: CreateMemberForm) => {
    createMutation.mutate(
      {
        ...values,
        role: 'CUSTOMER_SERVICE',
        divisionId: user?.divisionId ?? null,
        isActive: true,
      },
      {
        onSuccess: () => {
          toast.success('Team member created')
          setCreateOpen(false)
          createForm.reset()
        },
        onError: (error) => showErrorToast(error, 'Failed to create member'),
      },
    )
  }

  const onEdit = (values: EditMemberForm) => {
    if (!selectedUser) return

    updateMutation.mutate(
      {
        id: selectedUser.id,
        dto: {
          name: values.name,
          email: values.email,
        },
      },
      {
        onSuccess: () => {
          toast.success('Team member updated')
          setEditOpen(false)
          setSelectedUser(null)
        },
        onError: (error) => showErrorToast(error, 'Failed to update member'),
      },
    )
  }

  const changePasswordMutation = useChangePassword(selectedUser?.id ?? '')

  const onChangePassword = (values: PasswordForm) => {
    if (!selectedUser) return

    changePasswordMutation.mutate(
      { newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success('Password updated')
          setPasswordOpen(false)
          setSelectedUser(null)
        },
        onError: (error) => showErrorToast(error, 'Failed to update password'),
      },
    )
  }

  const onDeactivate = () => {
    if (!selectedUser) return

    deactivateMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        toast.success('Team member deactivated')
        setDeactivateOpen(false)
        setSelectedUser(null)
      },
      onError: (error) => showErrorToast(error, 'Failed to deactivate member'),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="My Team" text="Manage customer service team members for your division.">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </PageHeader>

      <DataTable
        data={teamQuery.data?.data ?? []}
        isLoading={teamQuery.isLoading}
        isError={teamQuery.isError}
        onRetry={() => teamQuery.refetch()}
        pagination={{
          page,
          perPage,
          total: teamQuery.data?.total ?? 0,
          onPageChange: setPage,
          onPerPageChange: setPerPage,
        }}
        columns={[
          {
            header: 'Name',
            accessorKey: 'name',
          },
          {
            header: 'Email',
            accessorKey: 'email',
          },
          {
            header: 'Role',
            id: 'role',
            cell: () => <Badge variant="outline">Customer Service</Badge>,
          },
          {
            header: 'Active',
            id: 'active',
            cell: ({ row }: { row: { original: User } }) => (
              <StatusBadge type="active" isActive={row.original.isActive} />
            ),
          },
          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: { original: User } }) => (
              <div className="flex items-center gap-1 justify-end">
                <Button size="icon" variant="ghost" aria-label="Edit team member" onClick={() => openEdit(row.original)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Change password" onClick={() => openPassword(row.original)}>
                  <KeyRound className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" aria-label="Deactivate user" onClick={() => openDeactivate(row.original)}>
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Create a customer service account for your division.</DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form className="space-y-4" onSubmit={createForm.handleSubmit(onCreate)}>
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  Create Member
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update name and email for this user.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form className="space-y-4" onSubmit={editForm.handleSubmit(onEdit)}>
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Set a new password for this team member.</DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onChangePassword)}>
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={changePasswordMutation.isPending}>
                  Update Password
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={onDeactivate}
        title="Deactivate Team Member"
        description="Are you sure you want to deactivate this team member?"
        confirmLabel="Deactivate"
        isLoading={deactivateMutation.isPending}
      />
    </div>
  )
}
