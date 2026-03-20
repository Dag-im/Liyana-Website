import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import type { CreateNewsEventDto } from '@/api/news-events.api';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import type { NewsEvent } from '@/types/news-events.types';
import { useNewsEvent, useUpdateNewsEvent } from './useNewsEvents';
import NewsEventWizard from './components/NewsEventWizard';

const toDefaultValues = (entry: NewsEvent): Partial<CreateNewsEventDto> => ({
  type: entry.type,
  title: entry.title,
  date: entry.date,
  location: entry.location ?? '',
  summary: entry.summary,
  content: entry.content,
  keyHighlights: entry.keyHighlights ?? [],
  mainImage: entry.mainImage,
  image1: entry.image1,
  image2: entry.image2,
});

function resolveReturnPath(location: ReturnType<typeof useLocation>, typeHint?: string | null) {
  const state = location.state as { from?: string } | undefined;
  const params = new URLSearchParams(location.search);
  return state?.from ?? params.get('returnTo') ?? (typeHint === 'event' ? '/events' : '/news');
}

export default function NewsEventEditPage() {
  const { id = '' } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const newsEventQuery = useNewsEvent(id);
  const updateMutation = useUpdateNewsEvent();
  const routeTypeHint = location.pathname.includes('/events/') ? 'event' : 'news';
  const returnTo = resolveReturnPath(location, routeTypeHint);

  if (!id) return <ErrorState description="Missing entry id." title="Invalid route" />;
  if (newsEventQuery.isLoading) return <LoadingSpinner />;
  if (newsEventQuery.isError || !newsEventQuery.data) {
    return <ErrorState onRetry={() => newsEventQuery.refetch()} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        heading="Edit Entry"
        text="Update news or event details."
      >
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>
      <div className="h-[calc(100vh-14rem)] min-h-[720px]">
        <NewsEventWizard
          defaultValues={toDefaultValues(newsEventQuery.data)}
          inline
          isLoading={updateMutation.isPending}
          mode="edit"
          onOpenChange={(open) => {
            if (!open) navigate(returnTo);
          }}
          onSubmit={(dto) => {
            updateMutation.mutate(
              { id, dto },
              { onSuccess: () => navigate(returnTo, { replace: true }) }
            );
          }}
        />
      </div>
    </div>
  );
}
