import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { awardsApi } from '@/api/awards.api'
import ErrorState from '@/components/shared/ErrorState'
import { FileUpload } from '@/components/shared/FileUpload'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAward, useUpdateAward } from './useAwards'

type AwardFormData = {
  title: string
  organization: string
  year: string
  category: string
  description: string
  imageAlt: string
  image: string
  sortOrder: string
}

function toCreateDto(values: AwardFormData) {
  return {
    title: values.title,
    organization: values.organization,
    year: values.year,
    category: values.category,
    description: values.description,
    imageAlt: values.imageAlt,
    image: values.image,
    sortOrder: Number(values.sortOrder) || 0,
  }
}

export default function AwardEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const awardQuery = useAward(id)
  const updateMutation = useUpdateAward()
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/awards'

  const [formData, setFormData] = useState<AwardFormData>({
    title: '',
    organization: '',
    year: '',
    category: '',
    description: '',
    imageAlt: '',
    image: '',
    sortOrder: '0',
  })

  useEffect(() => {
    if (!awardQuery.data) return
    setFormData({
      title: awardQuery.data.title,
      organization: awardQuery.data.organization,
      year: awardQuery.data.year,
      category: awardQuery.data.category,
      description: awardQuery.data.description,
      imageAlt: awardQuery.data.imageAlt,
      image: awardQuery.data.image,
      sortOrder: String(awardQuery.data.sortOrder),
    })
  }, [awardQuery.data])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateMutation.mutate(
      {
        id,
        dto: toCreateDto(formData),
      },
      {
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  if (awardQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (awardQuery.isError || !awardQuery.data) {
    return <ErrorState onRetry={() => awardQuery.refetch()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Edit Award" text="Update the selected award details.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-award-title">Title</Label>
                <Input
                  id="edit-award-title"
                  required
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-award-org">Organization</Label>
                <Input
                  id="edit-award-org"
                  required
                  value={formData.organization}
                  onChange={(event) => setFormData((prev) => ({ ...prev, organization: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-award-year">Year</Label>
                <Input
                  id="edit-award-year"
                  required
                  maxLength={4}
                  value={formData.year}
                  onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-award-category">Category</Label>
                <Input
                  id="edit-award-category"
                  required
                  value={formData.category}
                  onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-award-description">Description</Label>
                <Textarea
                  id="edit-award-description"
                  required
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-award-alt">Image Alt</Label>
                <Input
                  id="edit-award-alt"
                  required
                  value={formData.imageAlt}
                  onChange={(event) => setFormData((prev) => ({ ...prev, imageAlt: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-award-sort">Sort Order</Label>
                <Input
                  id="edit-award-sort"
                  type="number"
                  min={0}
                  value={formData.sortOrder}
                  onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Image</Label>
                <FileUpload
                  currentPath={formData.image}
                  label="Replace award image"
                  onSuccess={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                  onUpload={awardsApi.uploadAwardImage}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
