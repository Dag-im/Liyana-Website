import { FolderDetails } from '@/components/client/media/FolderDetails';
import { notFound } from 'next/navigation';
import { mediaFolders } from '../data';
import { use } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function MediaFolderPage(props: Props) {
  const { id } = use(props.params);
  const folder = mediaFolders.find((f) => f.id === id);

  if (!folder) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
      <FolderDetails folder={folder} />
    </div>
  );
}
