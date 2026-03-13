import { useState } from 'react';

import type { CreateNewsEventDto } from '@/api/news-events.api';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={trigger ?? <Button variant="outline">Edit</Button>}
      />
      <DialogContent className="max-w-7xl w-200 h-[92vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogDescription>
            Update the news or event entry using the guided steps.
          </DialogDescription>
        </DialogHeader>
        {newsEventQuery.isLoading ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : newsEventQuery.isError || !newsEventQuery.data ? (
          <ErrorState onRetry={() => newsEventQuery.refetch()} />
        ) : (
          <NewsEventWizard
            defaultValues={toDefaultValues(newsEventQuery.data)}
            isLoading={updateMutation.isPending}
            mode="edit"
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
      </DialogContent>
    </Dialog>
  );
}
