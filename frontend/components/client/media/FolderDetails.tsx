'use client';

import type { MediaFolder } from '@/types/media.types';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TagBadge, MediaItemCard } from './MediaComponents';

export const FolderDetails = ({ folder }: { folder: MediaFolder }) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/media"
          className="inline-flex items-center text-cyan-600 hover:text-cyan-800 transition-colors font-semibold"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Library
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
        {/* Text block */}
        <div className="space-y-6">
          <div className="space-y-2">
            <TagBadge tag={folder.tag} />
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {folder.name}
            </h1>
          </div>
          
          <p className="text-slate-600 leading-relaxed text-lg">
            {folder.description}
          </p>

          <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Files</p>
              <p className="text-xl font-bold text-slate-900">{folder.mediaCount}</p>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Updated</p>
              <p className="text-sm font-bold text-slate-600">{folder.lastUpdated}</p>
            </div>
          </div>
        </div>

        {/* Cover image */}
        <div className="relative aspect-[16/10] rounded-sm overflow-hidden shadow-2xl bg-slate-100 border border-slate-200">
          <Image
            src={folder.coverImage}
            alt={folder.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Media Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">Media Assets</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{folder.mediaCount} Items Total</span>
        </div>
        
        {folder.items && folder.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {folder.items.map((item) => (
              <MediaItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-sm">
            <p className="text-slate-500 font-medium italic">No media files found in this collection.</p>
          </div>
        )}
      </section>
    </div>
  );
};
