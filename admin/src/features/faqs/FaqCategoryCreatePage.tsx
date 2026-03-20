import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateFaqCategory } from './useFaqs'

export default function FaqCategoryCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const createMutation = useCreateFaqCategory()

  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/faq-categories'

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createMutation.mutate(
      {
        name,
        sortOrder: Number(sortOrder) || 0,
      },
      {
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Create FAQ Category" text="Add a new FAQ category.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-sort">Sort Order</Label>
              <Input
                id="category-sort"
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
