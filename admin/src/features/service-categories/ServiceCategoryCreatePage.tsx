import { Link, useLocation, useNavigate } from 'react-router-dom'

import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { CreateServiceCategoryDialog } from './CreateServiceCategoryDialog'

export default function ServiceCategoryCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/service-categories'

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Create Service Category" text="Add a new top-level service grouping.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <CreateServiceCategoryDialog
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
