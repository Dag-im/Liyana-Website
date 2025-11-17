'use client';

import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface EventDetailProps {
  title: string;
  date: string;
  location: string;
  content: string[];
  mainImage: string;
  image1: string;
  image2: string;
}

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
      gsap.from('.fade', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="max-w-7xl mx-auto px-6 lg:px-12 py-24 space-y-20"
    >
      {/* === HERO SECTION === */}
      <div className="relative h-[420px] w-full overflow-hidden rounded-3xl shadow-xl fade">
        <Image
          src={mainImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[92%]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 flex flex-col justify-end px-10 py-12 text-white">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight fade">
            {title}
          </h1>
          <p className="text-gray-200 mt-3 fade">
            {date} • {location}
          </p>
        </div>
      </div>

      {/* === GRID CONTENT === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* === MAIN CONTENT === */}
        <div className="lg:col-span-2 space-y-8 fade">
          {content.map((para, i) => (
            <p
              key={i}
              className="text-[1.1rem] leading-relaxed text-gray-700 font-light"
            >
              {para}
            </p>
          ))}
        </div>

        {/* === EVENT SIDEBAR === */}
        <aside className="space-y-10 fade">
          {/* Event Details */}
          <div className="border-l-4 border-cyan-700 pl-5">
            <h3 className="text-lg font-semibold text-gray-900">
              Event Details
            </h3>

            <ul className="mt-4 space-y-3 text-gray-600 text-sm">
              <li>
                <span className="font-medium text-gray-800">Date:</span> {date}
              </li>
              <li>
                <span className="font-medium text-gray-800">Location:</span>{' '}
                {location}
              </li>
            </ul>
          </div>

          {/* Gallery */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>

            {[image1, image2].map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl shadow-lg aspect-[4/3]"
              >
                <Image
                  src={img}
                  alt={`Event gallery ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
