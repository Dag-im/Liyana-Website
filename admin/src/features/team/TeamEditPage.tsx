import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import EditTeamMemberDialog from './EditTeamMemberDialog'
import { useTeamMember } from './useTeam'

export default function TeamEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const memberQuery = useTeamMember(id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/team'

  if (memberQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (memberQuery.isError || !memberQuery.data) {
    return <ErrorState onRetry={() => memberQuery.refetch()} />
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading={`Edit ${memberQuery.data.name}`} text="Update credentials and affiliation.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <EditTeamMemberDialog
        member={memberQuery.data}
        inline
        open
        onOpenChange={(open) => {
          if (!open) navigate(returnTo)
        }}
      />
    </div>
  )
}
