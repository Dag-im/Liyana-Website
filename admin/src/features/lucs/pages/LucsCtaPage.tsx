import { useState } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useLucsCta, usePublishLucsCta, useUnpublishLucsCta, useUpdateLucsCta } from '../useLucs'

export default function LucsCtaPage() {
  const query = useLucsCta()
  const update = useUpdateLucsCta()
  const publish = usePublishLucsCta()
  const unpublish = useUnpublishLucsCta()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="LUCS CTA"
        text="Manage the LUCS call-to-action separately from the rest of the page."
        items={[
          { label: 'LUCS Admin', to: '/lucs-admin' },
          { label: 'CTA' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/lucs-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>CTA Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LucsCtaForm
            key={query.data?.updatedAt ?? 'lucs-cta-form'}
            initialData={{
              title: query.data?.title ?? '',
              description: query.data?.description ?? '',
              ctaType: query.data?.ctaType ?? 'email',
              ctaValue: query.data?.ctaValue ?? '',
              ctaLabel: query.data?.ctaLabel ?? '',
            }}
            isPublished={query.data?.isPublished ?? false}
            isSaving={update.isPending}
            isToggling={publish.isPending || unpublish.isPending}
            onPublish={() => publish.mutate()}
            onUnpublish={() => unpublish.mutate()}
            onSave={(dto) => update.mutate(dto)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function LucsCtaForm({
  initialData,
  isPublished,
  isSaving,
  isToggling,
  onPublish,
  onUnpublish,
  onSave,
}: {
  initialData: {
    title: string
    description: string
    ctaType: 'phone' | 'email' | 'url'
    ctaValue: string
    ctaLabel: string
  }
  isPublished: boolean
  isSaving: boolean
  isToggling: boolean
  onPublish: () => void
  onUnpublish: () => void
  onSave: (dto: {
    title: string
    description?: string
    ctaType: 'phone' | 'email' | 'url'
    ctaValue: string
    ctaLabel: string
  }) => void
}) {
  const [formData, setFormData] = useState(initialData)

  const placeholder =
    formData.ctaType === 'phone'
      ? 'Phone number'
      : formData.ctaType === 'url'
        ? 'Website URL'
        : 'Email address'

  return (
    <>
      <PublishToggle
        isPending={isToggling}
        isPublished={isPublished}
        label="CTA Publish Status"
        onPublish={onPublish}
        onUnpublish={onUnpublish}
      />
      <div className="space-y-2">
        <Label htmlFor="lucs-cta-title-page">Title</Label>
        <Input
          id="lucs-cta-title-page"
          value={formData.title}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, title: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lucs-cta-description-page">Description</Label>
        <Textarea
          id="lucs-cta-description-page"
          rows={4}
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>CTA Type</Label>
          <Select
            value={formData.ctaType}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                ctaType: value as typeof formData.ctaType,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="url">URL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="lucs-cta-value-page">CTA Value</Label>
          <Input
            id="lucs-cta-value-page"
            placeholder={placeholder}
            value={formData.ctaValue}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, ctaValue: event.target.value }))
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="lucs-cta-label-page">CTA Label</Label>
        <Input
          id="lucs-cta-label-page"
          value={formData.ctaLabel}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, ctaLabel: event.target.value }))
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/lucs-admin">Cancel</Link>
        </Button>
        <Button
          disabled={isSaving}
          onClick={() =>
            onSave({
              title: formData.title,
              description: formData.description || undefined,
              ctaType: formData.ctaType,
              ctaValue: formData.ctaValue,
              ctaLabel: formData.ctaLabel,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save CTA'}
        </Button>
      </div>
    </>
  )
}
