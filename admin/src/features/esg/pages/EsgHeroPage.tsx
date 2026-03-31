import { useState } from 'react'
import { Link } from 'react-router-dom'

import * as esgApi from '@/api/esg.api'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { FileUpload } from '@/components/shared/FileUpload'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useEsgHero, usePublishEsgHero, useUnpublishEsgHero, useUpdateEsgHero } from '../useEsg'

export default function EsgHeroPage() {
  const heroQuery = useEsgHero()
  const updateHero = useUpdateEsgHero()
  const publishHero = usePublishEsgHero()
  const unpublishHero = useUnpublishEsgHero()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="ESG Hero"
        text="Edit the ESG hero as a dedicated page."
        items={[
          { label: 'ESG Admin', to: '/esg-admin' },
          { label: 'Hero' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/esg-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EsgHeroForm
            key={heroQuery.data?.updatedAt ?? 'esg-hero-form'}
            initialTagline={heroQuery.data?.tagline ?? ''}
            initialSubtitle={heroQuery.data?.subtitle ?? ''}
            initialBackgroundImage={heroQuery.data?.backgroundImage ?? ''}
            isPublished={heroQuery.data?.isPublished ?? false}
            isSaving={updateHero.isPending}
            isToggling={publishHero.isPending || unpublishHero.isPending}
            onPublish={() => publishHero.mutate()}
            onUnpublish={() => unpublishHero.mutate()}
            onSave={(dto) => updateHero.mutate(dto)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function EsgHeroForm({
  initialTagline,
  initialSubtitle,
  initialBackgroundImage,
  isPublished,
  isSaving,
  isToggling,
  onPublish,
  onUnpublish,
  onSave,
}: {
  initialTagline: string
  initialSubtitle: string
  initialBackgroundImage: string
  isPublished: boolean
  isSaving: boolean
  isToggling: boolean
  onPublish: () => void
  onUnpublish: () => void
  onSave: (dto: { tagline: string; subtitle: string; backgroundImage?: string }) => void
}) {
  const [formData, setFormData] = useState({
    tagline: initialTagline,
    subtitle: initialSubtitle,
    backgroundImage: initialBackgroundImage,
  })

  return (
    <>
      <PublishToggle
        isPending={isToggling}
        isPublished={isPublished}
        label="Hero Publish Status"
        onPublish={onPublish}
        onUnpublish={onUnpublish}
      />

      <div className="space-y-2">
        <Label htmlFor="esg-hero-tagline-page">Tagline</Label>
        <Input
          id="esg-hero-tagline-page"
          value={formData.tagline}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, tagline: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="esg-hero-subtitle-page">Subtitle</Label>
        <Textarea
          id="esg-hero-subtitle-page"
          rows={5}
          value={formData.subtitle}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, subtitle: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Background Image</Label>
        <FileUpload
          currentPath={formData.backgroundImage || undefined}
          label="Upload hero background"
          maxSizeMB={8}
          onSuccess={(path) => setFormData((prev) => ({ ...prev, backgroundImage: path }))}
          onUpload={esgApi.uploadEsgFile}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/esg-admin">Cancel</Link>
        </Button>
        <Button
          disabled={isSaving}
          onClick={() =>
            onSave({
              tagline: formData.tagline,
              subtitle: formData.subtitle,
              backgroundImage: formData.backgroundImage || undefined,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Hero'}
        </Button>
      </div>
    </>
  )
}
