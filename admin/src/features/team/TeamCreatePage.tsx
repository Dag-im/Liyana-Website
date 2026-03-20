import { Link, useLocation, useNavigate } from 'react-router-dom'

import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import CreateTeamMemberDialog from './CreateTeamMemberDialog'

export default function TeamCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/team'

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Add Team Member" text="Create a new staff entry for the team or leadership section.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <CreateTeamMemberDialog
        inline
        open
        onOpenChange={(open) => {
          if (!open) navigate(returnTo)
        }}
      />
    </div>
  )
}
