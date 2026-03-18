'use client';

import gsap from 'gsap';
import type { NewsEvent } from '@/types/news-events.types';
import { Calendar, Clock, MapPin, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

type EventDetailProps = NewsEvent;

export function EventDetail({
  title,
  date,
  location,
  content,
  mainImage,
  image1,
  image2,
}: EventDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.animate-up', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={containerRef} className="bg-white min-h-screen pb-20">
      {/* Corporate Header - Solid Color or Minimal Image */}
      <div className="bg-slate-900 pt-20 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="animate-up inline-block px-3 py-1 mb-6 bg-cyan-900/50 border border-cyan-700/50 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded-sm">
            Corporate Event
          </span>
          <h1 className="animate-up text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Hero Image */}
            <div className="animate-up relative h-[400px] w-full overflow-hidden rounded-sm shadow-xl border-4 border-white">
              <Image
                src={mainImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Text */}
            <div className="animate-up prose prose-lg prose-slate max-w-none text-slate-700">
              {content.map((para, i) => (
                <p key={i} className="leading-8">
                  {para}
                </p>
              ))}
            </div>

            {/* Gallery Grid */}
            {(image1 || image2) && (
              <div className="animate-up pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Event Gallery
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {image1 && (
                    <div className="relative h-64 bg-slate-100 rounded-sm overflow-hidden">
                      <Image
                        src={image1}
                        alt="Gallery 1"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {image2 && (
                    <div className="relative h-64 bg-slate-100 rounded-sm overflow-hidden">
                      <Image
                        src={image2}
                        alt="Gallery 2"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="animate-up sticky top-24 bg-slate-50 border border-slate-200 p-8 rounded-sm shadow-sm space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-4 mb-6">
                  Event Details
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="text-cyan-600 mt-1" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Date
                      </p>
                      <p className="font-semibold text-slate-900">{date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="text-cyan-600 mt-1" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Time
                      </p>
                      <p className="font-semibold text-slate-900">
                        09:00 AM - 05:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="text-cyan-600 mt-1" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Location
                      </p>
                      <p className="font-semibold text-slate-900">
                        {location || 'Location TBD'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-cyan-700 hover:bg-cyan-800 text-white font-bold uppercase tracking-wider text-sm transition-colors shadow-md">
                Register Now
              </button>

              <div className="pt-6 border-t border-slate-200">
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-cyan-700 transition-colors">
                  <Share2 size={16} /> Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
