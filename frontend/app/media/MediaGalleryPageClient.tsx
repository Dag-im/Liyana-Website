'use client';

import { FolderCard } from '@/components/client/media/MediaComponents';
import { SectionHeading } from '@/components/shared/sectionHeading';
import type { MediaFolder } from '@/types/media.types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

export default function MediaGalleryPage({ folders }: { folders: MediaFolder[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          '.gsap-folder-card',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
            clearProps: 'all',
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-[#cceffa] selection:text-[#014f7a] pb-24">
      {/* Corporate Header */}
      <header className="bg-white border-b border-slate-200 pt-8 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#0880b9]" />
            <span className="text-[#01649c] font-bold uppercase tracking-widest text-sm">
              Press & Assets
            </span>
          </div>
          <SectionHeading
            variant="large"
            align="left"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#01649c] via-[#33bde9] to-[#0880b9] mb-6"
          >
            Media Library
          </SectionHeading>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
            Curated, high-resolution visual assets including executive
            portraits, facility photography, and financial presentations.
          </p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {folders.map((folder) => (
            <div key={folder.id} className="gsap-folder-card h-full">
              <FolderCard folder={folder} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
