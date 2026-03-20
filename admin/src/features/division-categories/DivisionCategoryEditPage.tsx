import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleMutationError } from '@/lib/error-utils'
import { useDivisionCategories, useUpdateDivisionCategory } from './useDivisionCategories'

export default function DivisionCategoryEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const categoriesQuery = useDivisionCategories()
  const updateMutation = useUpdateDivisionCategory()
  const [formData, setFormData] = useState({ name: '', label: '', description: '' })

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/division-categories'

  const category = categoriesQuery.data?.find((item) => item.id === id)

  useEffect(() => {
    if (!category) return
    setFormData({
      name: category.name,
      label: category.label,
      description: category.description || '',
    })
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return

    updateMutation.mutate(
      { id: category.id, dto: formData },
      {
        onSuccess: () => navigate(returnTo),
        onError: handleMutationError,
      }
    )
  }

  if (categoriesQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (categoriesQuery.isError || !category) {
    return <ErrorState onRetry={() => categoriesQuery.refetch()} />
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading={`Edit ${category.label}`} text="Update category details.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name (Slug-like)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="e.g. inpatient-care"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="label">Display Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. Inpatient Care"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button disabled={updateMutation.isPending} type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
