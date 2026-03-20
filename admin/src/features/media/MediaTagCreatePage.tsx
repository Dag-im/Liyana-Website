import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { slugify } from '@/lib/media-utils'
import { useCreateMediaTag } from './useMediaTags'

export default function MediaTagCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const createMutation = useCreateMediaTag()
  const [name, setName] = useState('')

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/media/tags'

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createMutation.mutate(
      { name },
      {
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Create Media Tag" text="Create a new media tag for folder categorization.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. CSR, Hospital Events"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              {name ? (
                <p className="text-xs text-muted-foreground">
                  Slug preview: <span className="font-mono">{slugify(name)}</span>
                </p>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                Create Tag
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
