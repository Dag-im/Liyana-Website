import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

type PublishToggleProps = {
  isPublished: boolean
  onPublish: () => void
  onUnpublish: () => void
  isPending?: boolean
  label?: string
}

export default function PublishToggle({
  isPublished,
  onPublish,
  onUnpublish,
  isPending = false,
  label = 'Status',
}: PublishToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-white/80 px-4 py-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p
          className={cn(
            'text-xs font-medium',
            isPublished ? 'text-emerald-600' : 'text-slate-500'
          )}
        >
          {isPublished ? 'Published' : 'Draft'}
        </p>
      </div>
      <Switch
        checked={isPublished}
        disabled={isPending}
        onCheckedChange={(checked) => {
          if (checked) {
            onPublish()
            return
          }
          onUnpublish()
        }}
        className={cn(
          isPublished ? 'data-checked:bg-emerald-500' : 'data-unchecked:bg-slate-300'
        )}
      />
    </div>
  )
}
