import { useState } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import PublishToggle from '@/components/shared/PublishToggle'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useIrStrategy,
  usePublishIrStrategy,
  useUnpublishIrStrategy,
  useUpdateIrStrategy,
} from '../useIr'

export default function IrStrategyPage() {
  const strategyQuery = useIrStrategy()
  const updateStrategy = useUpdateIrStrategy()
  const publishStrategy = usePublishIrStrategy()
  const unpublishStrategy = useUnpublishIrStrategy()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="IR Strategy"
        text="Edit the investor strategy in a dedicated content page."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'Strategy' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/ir-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Strategy Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <IrStrategyForm
            key={strategyQuery.data?.updatedAt ?? 'ir-strategy-form'}
            initialContent={strategyQuery.data?.content ?? ''}
            isPublished={strategyQuery.data?.isPublished ?? false}
            isSaving={updateStrategy.isPending}
            isToggling={publishStrategy.isPending || unpublishStrategy.isPending}
            onPublish={() => publishStrategy.mutate()}
            onUnpublish={() => unpublishStrategy.mutate()}
            onSave={(content) => updateStrategy.mutate({ content })}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function IrStrategyForm({
  initialContent,
  isPublished,
  isSaving,
  isToggling,
  onPublish,
  onUnpublish,
  onSave,
}: {
  initialContent: string
  isPublished: boolean
  isSaving: boolean
  isToggling: boolean
  onPublish: () => void
  onUnpublish: () => void
  onSave: (content: string) => void
}) {
  const [content, setContent] = useState(initialContent)

  return (
    <>
      <PublishToggle
        isPending={isToggling}
        isPublished={isPublished}
        label="Strategy Publish Status"
        onPublish={onPublish}
        onUnpublish={onUnpublish}
      />
      <RichTextEditor
        minHeight={420}
        value={content}
        onChange={setContent}
        placeholder="Write the investor strategy..."
      />
      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/ir-admin">Cancel</Link>
        </Button>
        <Button disabled={isSaving} onClick={() => onSave(content)}>
          {isSaving ? 'Saving...' : 'Save Strategy'}
        </Button>
      </div>
    </>
  )
}
