import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { EditNetworkEntityDialog } from './EditNetworkEntityDialog'
import { useNetworkEntity } from './useNetworkEntities'

export default function NetworkEntityEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const entityQuery = useNetworkEntity(id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/corporate-network'
  const entity = entityQuery.data ?? null

  if (entityQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (entityQuery.isError || !entity) {
    return <ErrorState onRetry={() => entityQuery.refetch()} />
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading={`Edit ${entity.name}`} text="Update network entity details.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <EditNetworkEntityDialog
        entity={entity}
        inline
        onClose={() => navigate(returnTo)}
        open
      />
    </div>
  )
}
