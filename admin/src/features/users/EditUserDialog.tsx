import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useDivisions } from '@/features/divisions/useDivisions'
import { useUpdateUser } from '@/features/users/useUsers'
import type { UpdateUserDto } from '@/api/users.api'
import { ROLES } from '@/lib/constants'
import { formatEnumLabel } from '@/lib/utils'
import type { User } from '@/types/user.types'

const updateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(ROLES),
  divisionId: z.string().optional(),
  isActive: z.boolean(),
}).refine((data) => {
  if (data.role === 'CUSTOMER_SERVICE' && !data.divisionId) {
    return false
  }
  return true
}, {
  message: "Division is required for Customer Service role",
  path: ["divisionId"],
})

type UpdateUserSchema = z.infer<typeof updateUserSchema>

type EditUserDialogProps = {
  user: User
}

export default function EditUserDialog({ user }: EditUserDialogProps) {
  const queryClient = useQueryClient()
  const updateUserMutation = useUpdateUser(user.id)
  const { data: divisionsData } = useDivisions({ perPage: 100 })

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      divisionId: user.divisionId || '',
      isActive: user.isActive,
    },
  })

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      divisionId: user.divisionId || '',
      isActive: user.isActive,
    })
  }, [form, user])

  const watchRole = form.watch('role')

  const toPayload = (values: UpdateUserSchema): UpdateUserDto => ({
    ...values,
    divisionId:
      values.role === 'CUSTOMER_SERVICE' ? values.divisionId?.trim() || null : null,
  })

  const onSubmit = (values: UpdateUserSchema) => {
    if (!form.formState.isDirty) {
      return
    }

    updateUserMutation.mutate(toPayload(values), {
      onSuccess: () => {
        toast.success('User updated')
        queryClient.invalidateQueries({ queryKey: ['users'] })
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to update user')
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button size="icon" variant="ghost" />}>
        <Pencil className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Update account details for {user.name}.</DialogDescription>
        </DialogHeader>
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
                  <Select defaultValue={field.value} onValueChange={(value) => {
                    field.onChange(value)
                    if (value !== 'CUSTOMER_SERVICE') {
                      form.setValue('divisionId', '')
                    }
                  }}>
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
            <DialogFooter>
              <Button disabled={updateUserMutation.isPending || !form.formState.isDirty} type="submit" className="w-full">
                {updateUserMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
