import { Link, useLocation, useNavigate } from 'react-router-dom';

import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import type { NewsEventType } from '@/types/news-events.types';
import { useCreateNewsEvent } from './useNewsEvents';
import NewsEventWizard from './components/NewsEventWizard';

function resolveReturnPath(location: ReturnType<typeof useLocation>, type: NewsEventType) {
  const state = location.state as { from?: string } | undefined;
  const params = new URLSearchParams(location.search);
  return state?.from ?? params.get('returnTo') ?? (type === 'event' ? '/events' : '/news');
}

export default function NewsEventCreatePage({ type }: { type: NewsEventType }) {
  const location = useLocation();
  const navigate = useNavigate();
  const createMutation = useCreateNewsEvent();
  const returnTo = resolveReturnPath(location, type);

  return (
    <div className="space-y-4">
      <PageHeader
        heading={type === 'event' ? 'Create Event' : 'Create News Entry'}
        text="Create a new entry with guided steps."
      >
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>
      <div className="h-[calc(100vh-14rem)] min-h-[720px]">
        <NewsEventWizard
          fixedType={type}
          inline
          isLoading={createMutation.isPending}
          mode="create"
          onOpenChange={(open) => {
            if (!open) navigate(returnTo);
          }}
          onSubmit={(dto) => {
            createMutation.mutate(dto, {
              onSuccess: () => navigate(returnTo, { replace: true }),
            });
          }}
        />
      </div>
    </div>
  );
}
