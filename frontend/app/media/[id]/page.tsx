import MediaFolderPageClient from '@/app/media/[id]/MediaFolderPageClient';

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 3600;

export default function MediaFolderPage(props: Props) {
  return <MediaFolderPageClient {...props} />;
}
