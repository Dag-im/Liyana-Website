import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { EditServiceCategoryDialog } from './EditServiceCategoryDialog'
import { useServiceCategory } from './useServiceCategories'

export default function ServiceCategoryEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/service-categories'
  const categoryQuery = useServiceCategory(id)

  if (categoryQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (categoryQuery.isError || !categoryQuery.data) {
    return <ErrorState onRetry={() => categoryQuery.refetch()} />
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading={`Edit ${categoryQuery.data.title}`} text="Update service category details.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <EditServiceCategoryDialog
        category={categoryQuery.data}
        inline
        open
        onOpenChange={(open) => {
          if (!open) {
            navigate(returnTo)
          }
        }}
      />
    </div>
  )
}
