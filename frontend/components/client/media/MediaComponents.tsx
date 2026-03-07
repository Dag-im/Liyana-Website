'use client';

import { Folder, MediaItem } from '@/data/media';
import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- Tag Badge ---
export const TagBadge = ({ tag }: { tag: string }) => (
  <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
    {tag}
  </span>
);

// --- Folder Card ---
export const FolderCard = ({ folder }: { folder: Folder }) => {
  return (
    <Link
      href={`/media/${folder.id}`}
      className="group flex flex-col h-full bg-white border border-slate-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden shrink-0 border-b border-slate-200">
        <Image
          src={folder.coverImage}
          alt={folder.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 z-10">
          <TagBadge tag={folder.tag} />
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors line-clamp-2">
          {folder.name}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
          {folder.description}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {folder.mediaCount} Files
          </span>
          <span className="text-xs font-bold text-slate-400">
            {folder.lastUpdated}
          </span>
        </div>
      </div>
    </Link>
  );
};

// --- Media Item Card ---
export const MediaItemCard = ({ item }: { item: MediaItem }) => {
  const isVideo = item.type === 'video';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-200">
        <Image
          src={(isVideo ? item.thumbnail : item.url) || ''}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors">
            <div className="w-12 h-12 bg-white rounded-sm flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 text-cyan-700 ml-1" />
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-slate-800 uppercase tracking-wider rounded-sm shadow-sm border border-slate-200">
            {item.type}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-cyan-700 transition-colors">
          {item.title}
        </p>
      </div>
    </a>
  );
};
