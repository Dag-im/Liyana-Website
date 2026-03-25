import { useState } from 'react';
import { Edit } from 'lucide-react';

import type { CreateNewsEventDto } from '@/api/news-events.api';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import type { NewsEvent } from '@/types/news-events.types';
import { useNewsEvent, useUpdateNewsEvent } from '../useNewsEvents';
import NewsEventWizard from './NewsEventWizard';

export type EditNewsEventDialogProps = {
  newsEventId: string;
  trigger?: React.ReactElement;
};

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

export default function EditNewsEventDialog({
  newsEventId,
  trigger,
}: EditNewsEventDialogProps) {
  const [open, setOpen] = useState(false);
  const newsEventQuery = useNewsEvent(newsEventId);
  const updateMutation = useUpdateNewsEvent();

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="icon"
          aria-label="Edit entry"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      {newsEventQuery.isLoading ? (
        open && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
             <LoadingSpinner />
           </div>
        )
      ) : newsEventQuery.isError || !newsEventQuery.data ? (
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
             <div className="bg-background rounded-xl border shadow-sm p-6 max-w-md w-full">
                <ErrorState onRetry={() => newsEventQuery.refetch()} />
                <Button onClick={() => setOpen(false)} className="mt-4 w-full" variant="ghost">Close</Button>
             </div>
          </div>
        )
      ) : (
        <NewsEventWizard
          defaultValues={toDefaultValues(newsEventQuery.data)}
          isLoading={updateMutation.isPending}
          mode="edit"
          onOpenChange={setOpen}
          open={open}
          onSubmit={(dto) => {
            updateMutation.mutate(
              { id: newsEventId, dto },
              {
                onSuccess: () => {
                  setOpen(false);
                },
              }
            );
          }}
        />
      )}
    </>
  );
}
