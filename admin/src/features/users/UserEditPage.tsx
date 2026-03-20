import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useDivisions } from '@/features/divisions/useDivisions'
import { useUpdateUser, useUser } from '@/features/users/useUsers'
import type { UpdateUserDto } from '@/api/users.api'
import { ROLES } from '@/lib/constants'
import { formatEnumLabel } from '@/lib/utils'

const updateUserSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(ROLES),
    divisionId: z.string().optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.role === 'CUSTOMER_SERVICE' && !data.divisionId) {
        return false
      }
      return true
    },
    {
      message: 'Division is required for Customer Service role',
      path: ['divisionId'],
    }
  )

type UpdateUserSchema = z.infer<typeof updateUserSchema>

export default function UserEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const userQuery = useUser(id)
  const updateUserMutation = useUpdateUser(id)
  const { data: divisionsData } = useDivisions({ perPage: 100 })

  const returnTo =
    (location.state as { from?: string } | undefined)?.from ?? '/users'

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'BLOGGER',
      divisionId: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (!userQuery.data) return
    form.reset({
      name: userQuery.data.name,
      email: userQuery.data.email,
      role: userQuery.data.role,
      divisionId: userQuery.data.divisionId || '',
      isActive: userQuery.data.isActive,
    })
  }, [form, userQuery.data])

  const watchRole = form.watch('role')

  const toPayload = (values: UpdateUserSchema): UpdateUserDto => ({
    ...values,
    divisionId:
      values.role === 'CUSTOMER_SERVICE' ? values.divisionId?.trim() || null : null,
  })

  const onSubmit = (values: UpdateUserSchema) => {
    if (!form.formState.isDirty) {
      navigate(returnTo)
      return
    }

    updateUserMutation.mutate(toPayload(values), {
      onSuccess: () => {
        toast.success('User updated')
        queryClient.invalidateQueries({ queryKey: ['users'] })
        navigate(returnTo)
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to update user')
      },
    })
  }

  if (userQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (userQuery.isError || !userQuery.data) {
    return <ErrorState onRetry={() => userQuery.refetch()} />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        heading={`Edit ${userQuery.data.name}`}
        text="Update account details and role assignment."
      >
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        if (value !== 'CUSTOMER_SERVICE') {
                          form.setValue('divisionId', '')
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {formatEnumLabel(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchRole === 'CUSTOMER_SERVICE' && (
                <FormField
                  control={form.control}
                  name="divisionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Division</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionsData?.data.map((division) => (
                            <SelectItem key={division.id} value={division.id}>
                              {division.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <FormLabel>Active Status</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2">
                <Button asChild type="button" variant="outline">
                  <Link to={returnTo}>Cancel</Link>
                </Button>
                <Button disabled={updateUserMutation.isPending || !form.formState.isDirty} type="submit">
                  {updateUserMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
