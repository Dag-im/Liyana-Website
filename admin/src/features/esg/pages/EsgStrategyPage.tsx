import { useState } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import PublishToggle from '@/components/shared/PublishToggle'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useEsgStrategy,
  usePublishEsgStrategy,
  useUnpublishEsgStrategy,
  useUpdateEsgStrategy,
} from '../useEsg'

export default function EsgStrategyPage() {
  const strategyQuery = useEsgStrategy()
  const updateStrategy = useUpdateEsgStrategy()
  const publishStrategy = usePublishEsgStrategy()
  const unpublishStrategy = useUnpublishEsgStrategy()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="ESG Strategy"
        text="Rich-text ESG strategy is now edited from its own page."
        items={[
          { label: 'ESG Admin', to: '/esg-admin' },
          { label: 'Strategy' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/esg-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Strategy Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EsgStrategyForm
            key={strategyQuery.data?.updatedAt ?? 'esg-strategy-form'}
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

function EsgStrategyForm({
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
        placeholder="Write the ESG strategy..."
      />
      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/esg-admin">Cancel</Link>
        </Button>
        <Button disabled={isSaving} onClick={() => onSave(content)}>
          {isSaving ? 'Saving...' : 'Save Strategy'}
        </Button>
      </div>
    </>
  )
}
