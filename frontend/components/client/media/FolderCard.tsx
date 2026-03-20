'use client';

import BackendImage from '@/components/shared/BackendImage';
import type { MediaFolder } from '@/types/media.types';
import Link from 'next/link';
import { TagBadge } from './TagBadge';

export const FolderCard = ({ folder }: { folder: MediaFolder }) => {
  function formatMediaDate(post: MediaFolder) {
    const raw = post.lastUpdated;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return raw;
    }
    return parsed.toLocaleDateString('en-GB', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
  }
  return (
    <Link
      href={`/media/${folder.id}`}
      className="
        block group rounded-xl overflow-hidden border border-gray-200 bg-white
        shadow-md hover:shadow-2xl transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
      "
    >
      <div className="relative h-48 w-full">
        <BackendImage
          src={folder.coverImage}
          alt={folder.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-5 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {folder.name}
        </h3>

        <div className="flex items-center justify-between">
          <TagBadge tag={folder.tag} />
          <span className="text-sm text-gray-500">
            {folder.mediaCount} {folder.mediaCount === 1 ? 'file' : 'files'}
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Updated {formatMediaDate(folder)}
        </p>
      </div>
    </Link>
  );
};
