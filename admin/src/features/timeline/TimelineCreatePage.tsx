import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { timelineApi } from '@/api/timeline.api'
import { FileUpload } from '@/components/shared/FileUpload'
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
import type { TimelineCategory } from '@/types/timeline.types'
import { useCreateTimelineItem } from './useTimeline'

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

export default function TimelineCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const createMutation = useCreateTimelineItem()
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

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createMutation.mutate(toDto(formData), {
      onSuccess: () => navigate(returnTo),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Create Timeline Entry" text="Add a new timeline milestone.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeline-year">Year</Label>
                <Input
                  id="timeline-year"
                  required
                  maxLength={4}
                  value={formData.year}
                  onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline-sort">Sort Order</Label>
                <Input
                  id="timeline-sort"
                  type="number"
                  min={0}
                  value={formData.sortOrder}
                  onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="timeline-title">Title</Label>
                <Input
                  id="timeline-title"
                  required
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="timeline-description">Description</Label>
                <Textarea
                  id="timeline-description"
                  required
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline-location">Location (optional)</Label>
                <Input
                  id="timeline-location"
                  value={formData.location}
                  onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline-achievement">Achievement (optional)</Label>
                <Input
                  id="timeline-achievement"
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
                  label="Upload timeline image"
                  onSuccess={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                  onUpload={timelineApi.uploadTimelineImage}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Entry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
