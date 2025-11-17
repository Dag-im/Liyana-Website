'use client';

import { FolderCard } from './FolderCard';
import { Folder } from './types';

export const FolderList = ({ folders }: { folders: Folder[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  );
};
