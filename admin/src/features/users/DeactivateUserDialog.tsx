import { useQueryClient } from '@tanstack/react-query'
import { Ban } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useDeactivateUser } from '@/features/users/useUsers'
import type { User } from '@/types/user.types'

type DeactivateUserDialogProps = {
  user: User
}

export default function DeactivateUserDialog({ user }: DeactivateUserDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const deactivateMutation = useDeactivateUser()

  const onConfirm = () => {
    deactivateMutation.mutate(user.id, {
      onSuccess: () => {
        toast.success('User deactivated')
        queryClient.invalidateQueries({ queryKey: ['users'] })
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to deactivate user')
      },
    })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="icon" variant="ghost">
        <Ban className="h-4 w-4" />
      </Button>
      <ConfirmDialog
        confirmLabel="Deactivate"
        description={`Are you sure you want to deactivate ${user.name}? This action cannot be undone.`}
        isLoading={deactivateMutation.isPending}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        open={open}
        title="Deactivate user"
      />
    </>
  )
}
