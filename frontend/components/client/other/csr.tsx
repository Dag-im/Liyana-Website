'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe,
  Handshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users2,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- New Modern CSR Pillars ---
const csrFocusAreas = [
  {
    title: 'Patient Safety & Quality',
    desc: 'We uphold the highest global clinical standards, ensuring every patient receives safe, effective, and compassionate care.',
    icon: <ShieldCheck className="w-7 h-7 text-cyan-700" />,
  },
  {
    title: 'Health Equity & Inclusion',
    desc: 'Making healthcare accessible to underserved communities through outreach, subsidies, and tailored service programs.',
    icon: <Users2 className="w-7 h-7 text-blue-700" />,
  },
  {
    title: 'Environmental Responsibility',
    desc: 'Minimizing our ecological footprint through energy-efficient operations, waste reduction, and green innovations.',
    icon: <Leaf className="w-7 h-7 text-green-700" />,
  },
  {
    title: 'Ethical & Transparent Governance',
    desc: 'We operate with accountability, ethical integrity, and strict compliance with regulatory frameworks.',
    icon: <Handshake className="w-7 h-7 text-indigo-700" />,
  },
  {
    title: 'Innovation for Better Health',
    desc: 'Investing in medical technologies, digital solutions, and research to transform patient outcomes nationwide.',
    icon: <Sparkles className="w-7 h-7 text-cyan-600" />,
  },
  {
    title: 'Global Health Collaboration',
    desc: 'Partnering with global health organizations to align with international sustainability and healthcare goals.',
    icon: <Globe className="w-7 h-7 text-teal-700" />,
  },
];

const csrShowcase = [
  {
    src: 'https://images.unsplash.com/photo-1584467735871-7b5d2f67a8c6?w=900&fit=crop',
    caption: 'Advanced Medical Technology',
  },
  {
    src: 'https://images.unsplash.com/photo-1584432810601-6c7f27d23897?w=900&fit=crop',
    caption: 'Community Outreach Programs',
  },
  {
    src: 'https://images.unsplash.com/photo-1581091870627-3b9c7e4f72b1?w=900&fit=crop',
    caption: 'Eco-Friendly Healthcare Facilities',
  },
];

export default function CorporateCSRModern() {
  // typed refs
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);
  const focusRefs = useRef<Array<HTMLDivElement | null>>([]);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      // Fade-in Title
      const heading = sec.querySelector('h1') as HTMLElement | null;
      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 90%',
            },
          }
        );
      }

      // Intro paragraph animation
      const introEl = introRef.current;
      if (introEl) {
        gsap.fromTo(
          introEl,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: introEl,
              start: 'top 88%',
            },
          }
        );
      }

      // Focus Areas Cards
      focusRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: index * 0.12,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
            },
          }
        );
      });

      // Gallery animation
      const galleryContainer = galleryRef.current;
      const galleryItems = galleryContainer
        ? (galleryContainer.querySelectorAll(
            '.csr-modern-img'
          ) as NodeListOf<HTMLElement>)
        : undefined;

      if (galleryItems && galleryItems.length) {
        galleryItems.forEach((img: HTMLElement) => {
          gsap.fromTo(
            img,
            { opacity: 0, scale: 0.95, y: 50 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: img,
                start: 'top 92%',
                scrub: 0.5,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-gradient-to-br from-gray-50 via-blue-50/70 to-cyan-50/70 relative overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-20">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
          >
            Our Corporate Responsibility
          </SectionHeading>
          <p
            ref={introRef}
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium mt-4"
          >
            We are committed to shaping a healthier future through ethical
            leadership, sustainable growth, and unwavering dedication to
            community wellbeing.
          </p>
        </div>

        {/* Focus Areas */}
        <div className="mb-28">
          <h2 className="text-4xl font-semibold text-gray-900 text-center mb-14">
            Our Focus Areas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {csrFocusAreas.map((item, i) => (
              <Card
                key={i}
                // callback ref must return void — do not return the assigned value
                ref={(el: HTMLDivElement | null) => {
                  focusRefs.current[i] = el;
                }}
                className="bg-white/90 backdrop-blur-sm border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl"
              >
                <CardContent className="p-7">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-cyan-50">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-20 border-t border-gray-200 max-w-2xl mx-auto" />

        {/* Gallery */}
        <div ref={galleryRef}>
          <h2 className="text-4xl font-semibold text-cyan-800 text-center mb-14">
            Impact in Action
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {csrShowcase.map((item, i) => (
              <div
                key={i}
                className="csr-modern-img relative group rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  width={500}
                  height={350}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <p className="text-white text-sm font-medium p-4">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
