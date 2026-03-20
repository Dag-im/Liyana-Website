import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { timelineApi } from '@/api/timeline.api'
import ErrorState from '@/components/shared/ErrorState'
import { FileUpload } from '@/components/shared/FileUpload'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import type { TimelineCategory, TimelineItem } from '@/types/timeline.types'
import { useTimelineItem, useUpdateTimelineItem } from './useTimeline'

type TimelineFormData = {
  year: string
  title: string
  description: string
  location: string
  achievement: string
  image: string
  category: TimelineCategory | 'none'
  sortOrder: string
}

function toDto(values: TimelineFormData) {
  return {
    year: values.year,
    title: values.title,
    description: values.description,
    location: values.location.trim() ? values.location : null,
    achievement: values.achievement.trim() ? values.achievement : null,
    image: values.image.trim() ? values.image : null,
    category: values.category === 'none' ? null : values.category,
    sortOrder: Number(values.sortOrder) || 0,
  }
}

function toFormData(item: TimelineItem): TimelineFormData {
  return {
    year: item.year,
    title: item.title,
    description: item.description,
    location: item.location ?? '',
    achievement: item.achievement ?? '',
    image: item.image ?? '',
    category: item.category ?? 'none',
    sortOrder: String(item.sortOrder),
  }
}

export default function TimelineEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const itemQuery = useTimelineItem(id)
  const updateMutation = useUpdateTimelineItem()
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/timeline'

  const [formData, setFormData] = useState<TimelineFormData>({
    year: '',
    title: '',
    description: '',
    location: '',
    achievement: '',
    image: '',
    category: 'none',
    sortOrder: '0',
  })

  useEffect(() => {
    if (!itemQuery.data) return
    setFormData(toFormData(itemQuery.data))
  }, [itemQuery.data])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateMutation.mutate(
      {
        id,
        dto: toDto(formData),
      },
      {
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  if (itemQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (itemQuery.isError || !itemQuery.data) {
    return <ErrorState onRetry={() => itemQuery.refetch()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Edit Timeline Entry" text="Update timeline entry details.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-timeline-year">Year</Label>
                <Input
                  id="edit-timeline-year"
                  required
                  maxLength={4}
                  value={formData.year}
                  onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-timeline-sort">Sort Order</Label>
                <Input
                  id="edit-timeline-sort"
                  type="number"
                  min={0}
                  value={formData.sortOrder}
                  onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-timeline-title">Title</Label>
                <Input
                  id="edit-timeline-title"
                  required
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-timeline-description">Description</Label>
                <Textarea
                  id="edit-timeline-description"
                  required
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-timeline-location">Location (optional)</Label>
                <Input
                  id="edit-timeline-location"
                  value={formData.location}
                  onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-timeline-achievement">Achievement (optional)</Label>
                <Input
                  id="edit-timeline-achievement"
                  value={formData.achievement}
                  onChange={(event) => setFormData((prev) => ({ ...prev, achievement: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    const nextValue = value ?? 'none'
                    setFormData((prev) => ({ ...prev, category: nextValue as TimelineCategory | 'none' }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="expansion">Expansion</SelectItem>
                    <SelectItem value="innovation">Innovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Image (optional)</Label>
                <FileUpload
                  currentPath={formData.image}
                  label="Replace timeline image"
                  onSuccess={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                  onUpload={timelineApi.uploadTimelineImage}
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
