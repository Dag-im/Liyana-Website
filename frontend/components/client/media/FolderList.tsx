'use client';

import type { MediaFolder } from '@/types/media.types';
import { FolderCard } from './FolderCard';

export const FolderList = ({ folders }: { folders: MediaFolder[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  );
};
