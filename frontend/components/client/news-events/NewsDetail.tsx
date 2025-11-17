'use client';

import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface NewsDetailProps {
  title: string;
  date: string;
  content: string[];
  mainImage: string;
  keyHighlights: string[];
  image1: string;
  image2: string;
}

export function NewsDetail({
  title,
  date,
  content,
  mainImage,
  keyHighlights,
  image1,
  image2,
}: NewsDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade', {
        opacity: 0,
        y: 20,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={containerRef}
      className="max-w-7xl mx-auto px-6 lg:px-12 py-20 space-y-20 pt-24"
    >
      {/* === Hero Section === */}
      <section className="space-y-8 fade">
        <div className="w-full h-[50vh] min-h-[400px] relative">
          <Image
            src={mainImage}
            alt={title}
            fill
            priority
            className="object-cover brightness-95"
          />
        </div>

        <div className="flex flex-col gap-4 border-b pb-10">
          <span className="text-sm uppercase tracking-widest text-cyan-700 font-semibold">
            Corporate News
          </span>

          <h1 className="text-4xl lg:text-5xl font-light tracking-tight leading-tight text-gray-900">
            {title}
          </h1>

          <p className="text-gray-500 text-sm">{date}</p>
        </div>
      </section>

      {/* === Main Grid === */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Content */}
        <div className="lg:col-span-2 flex flex-col gap-8 fade">
          {content.map((para, i) => (
            <p
              key={i}
              className="text-[1.1rem] leading-relaxed text-gray-700 font-light"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-10">
          {/* Key Highlights */}
          <div className="border-l-4 border-cyan-700 pl-5 fade">
            <h3 className="text-lg font-semibold text-gray-900">
              Key Highlights
            </h3>

            <ul className="mt-4 space-y-3 text-gray-600 text-sm">
              {keyHighlights.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Side Images */}
          <div className="flex flex-col gap-6 fade">
            {[image1, image2].map((img, i) => (
              <div key={i} className="relative h-56 w-full bg-gray-100">
                <Image
                  src={img}
                  alt={`Highlight ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </aside>
      </section>
    </article>
  );
}
