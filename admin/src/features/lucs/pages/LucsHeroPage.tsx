import { useState } from 'react'
import { Link } from 'react-router-dom'

import * as lucsApi from '@/api/lucs.api'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { FileUpload } from '@/components/shared/FileUpload'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLucsHero, usePublishLucsHero, useUnpublishLucsHero, useUpdateLucsHero } from '../useLucs'

export default function LucsHeroPage() {
  const heroQuery = useLucsHero()
  const updateHero = useUpdateLucsHero()
  const publishHero = usePublishLucsHero()
  const unpublishHero = useUnpublishLucsHero()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="LUCS Hero"
        text="Manage the LUCS hero from a dedicated route."
        items={[
          { label: 'LUCS Admin', to: '/lucs-admin' },
          { label: 'Hero' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/lucs-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LucsHeroForm
            key={heroQuery.data?.updatedAt ?? 'lucs-hero-form'}
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

function LucsHeroForm({
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
        <Label htmlFor="lucs-hero-tagline-page">Tagline</Label>
        <Input
          id="lucs-hero-tagline-page"
          value={formData.tagline}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, tagline: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lucs-hero-subtitle-page">Subtitle</Label>
        <Textarea
          id="lucs-hero-subtitle-page"
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
          label="Upload LUCS hero image"
          maxSizeMB={8}
          onSuccess={(path) => setFormData((prev) => ({ ...prev, backgroundImage: path }))}
          onUpload={lucsApi.uploadLucsFile}
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
