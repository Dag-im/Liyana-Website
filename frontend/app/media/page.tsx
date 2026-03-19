import MediaGalleryPageClient from '@/app/media/MediaGalleryPageClient';

export const revalidate = 3600;

export default function MediaGalleryPage() {
  return <MediaGalleryPageClient />;
}
