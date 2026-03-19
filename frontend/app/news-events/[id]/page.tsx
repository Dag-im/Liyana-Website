import NewsEventDetailPageClient from '@/app/news-events/[id]/NewsEventDetailPageClient';
import { getNewsEvents } from '@/lib/api/news-events.api';

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const result = await getNewsEvents({ perPage: 200 });
    return result.data.map((item) => ({ id: item.id }));
  } catch {
    return [];
  }
}

export default function NewsEventDetailPage() {
  return <NewsEventDetailPageClient />;
}
