import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { awardsApi } from '@/api/awards.api'
import { FileUpload } from '@/components/shared/FileUpload'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateAward } from './useAwards'

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

export default function AwardCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const createMutation = useCreateAward()
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

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createMutation.mutate(toCreateDto(formData), {
      onSuccess: () => navigate(returnTo),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Create Award" text="Add a new award entry.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="award-title">Title</Label>
                <Input
                  id="award-title"
                  required
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-org">Organization</Label>
                <Input
                  id="award-org"
                  required
                  value={formData.organization}
                  onChange={(event) => setFormData((prev) => ({ ...prev, organization: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-year">Year</Label>
                <Input
                  id="award-year"
                  required
                  maxLength={4}
                  value={formData.year}
                  onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-category">Category</Label>
                <Input
                  id="award-category"
                  required
                  value={formData.category}
                  onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="award-description">Description</Label>
                <Textarea
                  id="award-description"
                  required
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-alt">Image Alt</Label>
                <Input
                  id="award-alt"
                  required
                  value={formData.imageAlt}
                  onChange={(event) => setFormData((prev) => ({ ...prev, imageAlt: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-sort">Sort Order</Label>
                <Input
                  id="award-sort"
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
                  label="Upload award image"
                  onSuccess={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                  onUpload={awardsApi.uploadAwardImage}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Award'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
