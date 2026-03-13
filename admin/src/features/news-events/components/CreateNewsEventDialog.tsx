import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { NewsEventType } from '@/types/news-events.types'
import { useCreateNewsEvent } from '../useNewsEvents'
import NewsEventWizard from './NewsEventWizard'

export type CreateNewsEventDialogProps = {
  defaultType: NewsEventType
}

export default function CreateNewsEventDialog({ defaultType }: CreateNewsEventDialogProps) {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateNewsEvent()

  const title = defaultType === 'event' ? 'Create Event' : 'Create News Entry'
  const description =
    defaultType === 'event'
      ? 'Add a new event entry using the guided steps.'
      : 'Add a new news entry using the guided steps.'

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button>Create</Button>} />
      <DialogContent className="max-w-7xl w-[98vw] h-[92vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <NewsEventWizard
          fixedType={defaultType}
          isLoading={createMutation.isPending}
          mode="create"
          onSubmit={(dto) => {
            createMutation.mutate(dto, {
              onSuccess: () => {
                setOpen(false)
              },
            })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
