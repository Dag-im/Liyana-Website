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
  useIrHero,
  usePublishIrHero,
  useUnpublishIrHero,
  useUpdateIrHero,
} from '../useIr'

export default function IrHeroPage() {
  const heroQuery = useIrHero()
  const updateHero = useUpdateIrHero()
  const publishHero = usePublishIrHero()
  const unpublishHero = useUnpublishIrHero()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="IR Hero"
        text="Manage the investor landing header on its own page."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'Hero' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/ir-admin">Back to Overview</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <IrHeroForm
            key={heroQuery.data?.updatedAt ?? 'ir-hero-form'}
            initialTagline={heroQuery.data?.tagline ?? ''}
            initialSubtitle={heroQuery.data?.subtitle ?? ''}
            isPublished={heroQuery.data?.isPublished ?? false}
            isSaving={updateHero.isPending}
            isToggling={publishHero.isPending || unpublishHero.isPending}
            onPublish={() => publishHero.mutate()}
            onUnpublish={() => unpublishHero.mutate()}
            onSave={(formData) => updateHero.mutate(formData)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function IrHeroForm({
  initialTagline,
  initialSubtitle,
  isPublished,
  isSaving,
  isToggling,
  onPublish,
  onUnpublish,
  onSave,
}: {
  initialTagline: string
  initialSubtitle: string
  isPublished: boolean
  isSaving: boolean
  isToggling: boolean
  onPublish: () => void
  onUnpublish: () => void
  onSave: (value: { tagline: string; subtitle: string }) => void
}) {
  const [formData, setFormData] = useState({
    tagline: initialTagline,
    subtitle: initialSubtitle,
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
        <Label htmlFor="ir-hero-tagline-page">Tagline</Label>
        <Input
          id="ir-hero-tagline-page"
          value={formData.tagline}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, tagline: event.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ir-hero-subtitle-page">Subtitle</Label>
        <Textarea
          id="ir-hero-subtitle-page"
          rows={5}
          value={formData.subtitle}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, subtitle: event.target.value }))
          }
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="outline">
          <Link to="/ir-admin">Cancel</Link>
        </Button>
        <Button disabled={isSaving} onClick={() => onSave(formData)}>
          {isSaving ? 'Saving...' : 'Save Hero'}
        </Button>
      </div>
    </>
  )
}
