import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { NewsEventType } from '@/types/news-events.types'
import { useCreateNewsEvent } from '../useNewsEvents'
import NewsEventWizard from './NewsEventWizard'

export type CreateNewsEventDialogProps = {
  defaultType: NewsEventType
}

export default function CreateNewsEventDialog({ defaultType }: CreateNewsEventDialogProps) {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateNewsEvent()

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create</Button>
      <NewsEventWizard
        fixedType={defaultType}
        isLoading={createMutation.isPending}
        mode="create"
        onOpenChange={setOpen}
        open={open}
        onSubmit={(dto) => {
          createMutation.mutate(dto, {
            onSuccess: () => {
              setOpen(false)
            },
          })
        }}
      />
    </>
  )
}
