import { useEffect, useState } from 'react'
import { Pencil, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/utils'
import { useUpdateWhoWeAre, useWhoWeAre } from './useCms'
import IconButton from '@/components/system/IconButton'

export default function WhoWeAreTab() {
  const whoWeAreQuery = useWhoWeAre()
  const updateMutation = useUpdateWhoWeAre()

  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (whoWeAreQuery.data) {
      setContent(whoWeAreQuery.data.content)
    }
  }, [whoWeAreQuery.data])

  if (!whoWeAreQuery.data) {
    return <div className="text-sm text-muted-foreground">Loading Who We Are...</div>
  }

  const save = () => {
    updateMutation.mutate(
      { content },
      {
        onSuccess: () => setIsEditing(false),
      }
    )
  }

  return (
    <div className="space-y-4">
      {isEditing ? (
        <div className="space-y-3">
          <Textarea value={content} onChange={(event) => setContent(event.target.value)} className="min-h-56" />
          <div className="flex items-center gap-2">
            <Button onClick={save} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <IconButton
              tooltip="Cancel"
              ariaLabel="Cancel editing"
              onClick={() => {
                setContent(whoWeAreQuery.data?.content ?? '')
                setIsEditing(false)
              }}
              icon={<X />}
            />
          </div>
        </div>
      ) : (
        <>
          <blockquote className="rounded-md border-l-4 border-cyan-500 bg-muted/20 p-4 text-sm whitespace-pre-line">
            {whoWeAreQuery.data.content}
          </blockquote>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Last updated: {formatDate(whoWeAreQuery.data.updatedAt)}</p>
            <IconButton
              tooltip="Edit"
              ariaLabel="Edit Who We Are"
              onClick={() => setIsEditing(true)}
              icon={<Pencil />}
            />
          </div>
        </>
      )}
    </div>
  )
}
