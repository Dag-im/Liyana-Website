import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ErrorState from '@/components/shared/ErrorState';
import PageHeader from '@/components/shared/PageHeader';
import { EditDivisionWizard } from './EditDivisionWizard';

function resolveReturnPath(location: ReturnType<typeof useLocation>) {
  const state = location.state as { from?: string } | undefined;
  const params = new URLSearchParams(location.search);
  return state?.from ?? params.get('returnTo') ?? '/divisions';
}

export default function DivisionEditPage() {
  const { id = '' } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = resolveReturnPath(location);

  if (!id) {
    return <ErrorState description="Missing division id." title="Invalid route" />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        heading="Edit Division"
        text="Update division details and structure."
      />
      <div className="h-[calc(100vh-14rem)] min-h-[760px]">
        <EditDivisionWizard
          divisionId={id}
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
