import { useEffect, useMemo, useRef, useState } from 'react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMyDivision, useUpdateMyDivision } from '@/features/my-division/useMyDivision'
import { showErrorToast } from '@/lib/error-utils'

const AUTO_SAVE_DELAY = 2000

type SaveState = 'idle' | 'saving' | 'saved'

export default function DescriptionPage() {
  const { data: division, isLoading } = useMyDivision()
  const updateMutation = useUpdateMyDivision()

  const [content, setContent] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!division) return
    setContent(division.description ?? '')
    initializedRef.current = true
    setSaveState('idle')
  }, [division])

  const saveNow = (nextContent: string) => {
    setSaveState('saving')
    updateMutation.mutate(
      { description: nextContent },
      {
        onSuccess: () => {
          setSaveState('saved')
        },
        onError: (error) => {
          setSaveState('idle')
          showErrorToast(error, 'Failed to save description')
        },
      },
    )
  }

  useEffect(() => {
    if (!initializedRef.current) return
    const timer = window.setTimeout(() => {
      saveNow(content)
    }, AUTO_SAVE_DELAY)

    return () => {
      window.clearTimeout(timer)
    }
  }, [content])

  const statusLabel = useMemo(() => {
    if (saveState === 'saving' || updateMutation.isPending) return 'Saving...'
    if (saveState === 'saved') return 'Saved'
    return 'Idle'
  }, [saveState, updateMutation.isPending])

  if (isLoading) return <LoadingSpinner fullPage />

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Division Description"
        text="Maintain your division long-form content."
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{statusLabel}</span>
          <Button
            onClick={() => saveNow(content)}
            disabled={updateMutation.isPending}
            size="sm"
          >
            Save Now
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          <RichTextEditor
            value={content}
            onChange={setContent}
            minHeight={520}
            placeholder="Write detailed division description..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
