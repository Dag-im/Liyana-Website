import { useState } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useEsgLucsBridge,
  usePublishEsgLucsBridge,
  useUnpublishEsgLucsBridge,
  useUpdateEsgLucsBridge,
} from '../useEsg'

export default function EsgBridgePage() {
  const bridgeQuery = useEsgLucsBridge()
  const updateBridge = useUpdateEsgLucsBridge()
  const publishBridge = usePublishEsgLucsBridge()
  const unpublishBridge = useUnpublishEsgLucsBridge()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="ESG LUCS Bridge"
        text="Edit the LUCS bridge content on its own route."
        items={[
          { label: 'ESG Admin', to: '/esg-admin' },
          { label: 'LUCS Bridge' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/esg-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Bridge Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EsgBridgeForm
            key={bridgeQuery.data?.updatedAt ?? 'esg-bridge-form'}
            initialTitle={bridgeQuery.data?.title ?? ''}
            initialDescription={bridgeQuery.data?.description ?? ''}
            initialButtonText={bridgeQuery.data?.buttonText ?? ''}
            isPublished={bridgeQuery.data?.isPublished ?? false}
            isSaving={updateBridge.isPending}
            isToggling={publishBridge.isPending || unpublishBridge.isPending}
            onPublish={() => publishBridge.mutate()}
            onUnpublish={() => unpublishBridge.mutate()}
            onSave={(dto) => updateBridge.mutate(dto)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function EsgBridgeForm({
  initialTitle,
  initialDescription,
  initialButtonText,
  isPublished,
  isSaving,
  isToggling,
  onPublish,
  onUnpublish,
  onSave,
}: {
  initialTitle: string
  initialDescription: string
  initialButtonText: string
  isPublished: boolean
  isSaving: boolean
  isToggling: boolean
  onPublish: () => void
  onUnpublish: () => void
  onSave: (dto: { title: string; description: string; buttonText: string }) => void
}) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
    buttonText: initialButtonText,
  })

  return (
    <>
      <PublishToggle
        isPending={isToggling}
        isPublished={isPublished}
        label="Bridge Publish Status"
        onPublish={onPublish}
        onUnpublish={onUnpublish}
      />
      <div className="space-y-2">
        <Label htmlFor="esg-bridge-title-page">Title</Label>
        <Input
          id="esg-bridge-title-page"
          value={formData.title}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, title: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="esg-bridge-description-page">Description</Label>
        <Textarea
          id="esg-bridge-description-page"
          rows={5}
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="esg-bridge-button-page">Button Text</Label>
        <Input
          id="esg-bridge-button-page"
          value={formData.buttonText}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, buttonText: event.target.value }))
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/esg-admin">Cancel</Link>
        </Button>
        <Button disabled={isSaving} onClick={() => onSave(formData)}>
          {isSaving ? 'Saving...' : 'Save Bridge'}
        </Button>
      </div>
    </>
  )
}
