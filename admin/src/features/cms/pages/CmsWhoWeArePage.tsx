import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import WhoWeAreTab from '../WhoWeAreTab'

export default function CmsWhoWeArePage() {
  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="Who We Are"
        text="Edit the CMS Who We Are section on a dedicated page."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Who We Are' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/cms">Back to CMS</Link>
          </Button>
        }
      />
      <WhoWeAreTab />
    </div>
  )
}
