import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { slugify } from '@/lib/media-utils'
import { useMediaTags, useUpdateMediaTag } from './useMediaTags'

export default function MediaTagEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const tagsQuery = useMediaTags()
  const updateMutation = useUpdateMediaTag()
  const [name, setName] = useState('')

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/media/tags'
  const tag = tagsQuery.data?.find((item) => item.id === id)

  useEffect(() => {
    if (!tag) return
    setName(tag.name)
  }, [tag])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!tag) return
    updateMutation.mutate(
      { id: tag.id, dto: { name } },
      {
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  if (tagsQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (tagsQuery.isError || !tag) {
    return <ErrorState onRetry={() => tagsQuery.refetch()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Edit Media Tag" text="Update media tag details.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Slug preview: <span className="font-mono">{slugify(name)}</span>
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
