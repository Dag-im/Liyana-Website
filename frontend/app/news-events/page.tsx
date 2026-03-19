import NewsEventsPageClient from '@/app/news-events/NewsEventsPageClient';

export const revalidate = 600;

export default function NewsEventsPage() {
  return <NewsEventsPageClient />;
}
