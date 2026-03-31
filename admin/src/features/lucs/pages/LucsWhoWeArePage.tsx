import { useState } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import PublishToggle from '@/components/shared/PublishToggle'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useLucsWhoWeAre,
  usePublishLucsWhoWeAre,
  useUnpublishLucsWhoWeAre,
  useUpdateLucsWhoWeAre,
} from '../useLucs'

export default function LucsWhoWeArePage() {
  const query = useLucsWhoWeAre()
  const update = useUpdateLucsWhoWeAre()
  const publish = usePublishLucsWhoWeAre()
  const unpublish = useUnpublishLucsWhoWeAre()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="LUCS Who We Are"
        text="Edit the LUCS introduction in a standalone page."
        items={[
          { label: 'LUCS Admin', to: '/lucs-admin' },
          { label: 'Who We Are' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/lucs-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Who We Are Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LucsWhoWeAreForm
            key={query.data?.updatedAt ?? 'lucs-who-form'}
            initialContent={query.data?.content ?? ''}
            isPublished={query.data?.isPublished ?? false}
            isSaving={update.isPending}
            isToggling={publish.isPending || unpublish.isPending}
            onPublish={() => publish.mutate()}
            onUnpublish={() => unpublish.mutate()}
            onSave={(content) => update.mutate({ content })}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function LucsWhoWeAreForm({
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
        label="Who We Are Publish Status"
        onPublish={onPublish}
        onUnpublish={onUnpublish}
      />
      <RichTextEditor
        minHeight={420}
        value={content}
        onChange={setContent}
        placeholder="Write the LUCS introduction..."
      />
      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/lucs-admin">Cancel</Link>
        </Button>
        <Button disabled={isSaving} onClick={() => onSave(content)}>
          {isSaving ? 'Saving...' : 'Save Content'}
        </Button>
      </div>
    </>
  )
}
