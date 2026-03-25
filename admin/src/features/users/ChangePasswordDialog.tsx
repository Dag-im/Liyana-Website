import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { KeyRound, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useChangePassword } from '@/features/users/useUsers'
import type { User } from '@/types/user.types'
import { Button } from '@/components/ui/button'
import { showErrorToast } from '@/lib/error-utils'
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

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

type ChangePasswordDialogProps = {
  user: User
}

export default function ChangePasswordDialog({ user }: ChangePasswordDialogProps) {
  const queryClient = useQueryClient()
  const changePasswordMutation = useChangePassword(user.id)

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: ChangePasswordSchema) => {
    changePasswordMutation.mutate(
      { newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success('Password changed')
          queryClient.invalidateQueries({ queryKey: ['users'] })
          form.reset()
        },
        onError: (error) => showErrorToast(error, 'Failed to change password'),
      },
    )
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon" variant="ghost">
          <KeyRound className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Update password for {user.name}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={changePasswordMutation.isPending} type="submit">
                {changePasswordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Update password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
