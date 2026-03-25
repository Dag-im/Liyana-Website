'use client';

import { MediaItemCard } from '@/components/client/media/MediaComponents';
import BackendImage from '@/components/shared/BackendImage';
import type { MediaFolder } from '@/types/media.types';
import gsap from 'gsap';
import { ArrowLeft, Image as ImageIcon, Video } from 'lucide-react';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';

const formatMediaDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function MediaFolderPage({ folder }: { folder: MediaFolder }) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header elements
      gsap.from('.gsap-header-el', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
      });
      // Animate media grid
      gsap.from('.gsap-media-item', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.3,
        clearProps: 'all',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [folder?.id]);

  const imageCount = (folder.items ?? []).filter((m) => m.type === 'image').length;
  const videoCount = (folder.items ?? []).filter((m) => m.type === 'video').length;

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-slate-50 selection:bg-[#cceffa] selection:text-[#014f7a] pb-24"
    >
      {/* Top Navigation */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/media"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#01649c] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={16} /> Back to Library
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 pt-16 pb-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 w-full">
            <div className="gsap-header-el inline-block bg-slate-100 text-slate-800 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest mb-6 border border-slate-200">
              {folder.tag.name}
            </div>
            <h1 className="gsap-header-el text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              {folder.name}
            </h1>
            <p className="gsap-header-el text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              {folder.description}
            </p>

            <div className="gsap-header-el flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-[#0880b9]" /> {imageCount}{' '}
                Images
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="flex items-center gap-2">
                <Video size={16} className="text-[#0880b9]" /> {videoCount}{' '}
                Videos
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>Updated {formatMediaDate(folder.lastUpdated)}</div>
            </div>
          </div>

          <div className="gsap-header-el lg:w-1/3 w-full shrink-0">
            <div className="relative aspect-video rounded-sm overflow-hidden border border-slate-200 shadow-sm">
              <BackendImage
                src={folder.coverImage}
                alt={folder.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Media Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Assets
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {folder.items && folder.items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {folder.items.map((item) => (
              <div key={item.id} className="gsap-media-item">
                <MediaItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-sm">
            <p className="text-slate-500 text-lg">
              No media files currently available in this folder.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
