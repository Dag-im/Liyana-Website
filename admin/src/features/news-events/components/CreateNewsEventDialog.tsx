import { useState } from 'react'
import { Plus } from 'lucide-react'

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
      <Button onClick={() => setOpen(true)} size="icon" aria-label="Create entry">
        <Plus className="h-4 w-4" />
      </Button>
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
