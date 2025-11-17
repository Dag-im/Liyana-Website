'use client';

import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TagBadge } from './TagBadge';
import { Folder, MediaItem } from './types';

export const FolderDetails = ({ folder }: { folder: Folder }) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/media"
          className="inline-flex items-center text-cyan-600 hover:text-cyan-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Library
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Text block */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{folder.name}</h1>
          <TagBadge tag={folder.tag} />
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">{folder.mediaCount}</strong>{' '}
            {folder.mediaCount === 1 ? 'file' : 'files'} total
          </p>
          <p className="text-sm text-gray-400">
            Last updated {folder.lastUpdated}
          </p>
        </div>

        {/* Cover image */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-inner">
          <Image
            src={folder.coverImage}
            alt={folder.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Media Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Media Files</h2>
        {folder.media && folder.media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {folder.media.map((item) => (
              <MediaItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No media files yet.</p>
        )}
      </section>
    </div>
  );
};

/* ---------- MediaItemCard (new) ---------- */
const MediaItemCard = ({ item }: { item: MediaItem }) => {
  const isImage = item.type === 'image';
  const isVideo = item.type === 'video';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video bg-gray-200">
        {isImage && (
          <Image
            src={item.url}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        )}
        {isVideo && item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover"
          />
        )}

        {/* Play icon overlay for videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-cyan-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          {item.title}
        </p>
        <span className="inline-block mt-1 text-xs text-gray-500 capitalize">
          {item.type}
        </span>
      </div>
    </a>
  );
};
