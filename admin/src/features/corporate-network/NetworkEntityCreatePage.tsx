import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { CreateNetworkEntityDialog } from './CreateNetworkEntityDialog'

export default function NetworkEntityCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/corporate-network'
  const parentId = searchParams.get('parentId')
  const parentName = searchParams.get('parentName') ?? undefined

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Add Network Entity"
        text={parentId ? `Adding child to ${parentName ?? 'selected entity'}.` : 'Create a root-level network entity.'}
      >
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <CreateNetworkEntityDialog
        inline
        onClose={() => navigate(returnTo)}
        open
        parentId={parentId}
        parentName={parentName}
      />
    </div>
  )
}
