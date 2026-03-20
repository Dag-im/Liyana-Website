import { useLocation, useNavigate } from 'react-router-dom';

import PageHeader from '@/components/shared/PageHeader';
import { CreateDivisionWizard } from './CreateDivisionWizard';

function resolveReturnPath(location: ReturnType<typeof useLocation>) {
  const state = location.state as { from?: string } | undefined;
  const params = new URLSearchParams(location.search);
  return state?.from ?? params.get('returnTo') ?? '/divisions';
}

export default function DivisionCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = resolveReturnPath(location);

  return (
    <div className="space-y-4">
      <PageHeader
        heading="Create Division"
        text="Set up a new division using guided steps."
      />
      <div className="h-[calc(100vh-14rem)] min-h-[760px]">
        <CreateDivisionWizard
          inline
          onOpenChange={(open) => {
            if (!open) navigate(returnTo);
          }}
          open
        />
      </div>
    </div>
  );
}
