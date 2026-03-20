import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFaqCategories, useUpdateFaqCategory } from './useFaqs'

export default function FaqCategoryEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const categoriesQuery = useFaqCategories()
  const updateMutation = useUpdateFaqCategory()

  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/faq-categories'
  const category = categoriesQuery.data?.find((item) => item.id === id)

  useEffect(() => {
    if (!category) return
    setName(category.name)
    setSortOrder(String(category.sortOrder))
  }, [category])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!category) return

    updateMutation.mutate(
      {
        id: category.id,
        dto: {
          name,
          sortOrder: Number(sortOrder) || 0,
        },
      },
      {
        onSuccess: () => navigate(returnTo),
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
    <div className="space-y-6">
      <PageHeader heading="Edit FAQ Category" text="Update this category.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-sort">Sort Order</Label>
              <Input
                id="edit-category-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              />
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
