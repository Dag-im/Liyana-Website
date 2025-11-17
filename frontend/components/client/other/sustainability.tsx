'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Award,
  Briefcase,
  Globe,
  Handshake,
  Heart,
  Scale,
  Stethoscope,
  Users,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const sustainabilityInterventions = [
  {
    text: 'Proactively responding to existing and evolving societal healthcare needs through the delivery of rare and highly demanded services and products.',
    icon: <Stethoscope className="w-7 h-7 text-cyan-600" />,
  },
  {
    text: 'Locally availing advanced healthcare services that often are the reasons citizens travel lengthy distances as far as overseas for.',
    icon: <Globe className="w-7 h-7 text-cyan-600" />,
  },
  {
    text: 'Exercising economy-of-scale and value chain optimization through integration of services and products to enable the delivery of services and products at affordable fees.',
    icon: <Wrench className="w-7 h-7 text-cyan-600" />,
  },
  {
    text: 'Upholding partnership business model and taking the lead to engage actors in the healthcare value chain to help render services and products to the wider national and regional public at affordable fees.',
    icon: <Handshake className="w-7 h-7 text-cyan-600" />,
  },
  {
    text: 'Ensuring healthcare quality through the implementation of national and global operational quality standards as well as fostering the training of competent healthcare workforce.',
    icon: <Award className="w-7 h-7 text-cyan-600" />,
  },
  {
    text: 'Creating job opportunities for a growing number of citizens.',
    icon: <Briefcase className="w-7 h-7 text-cyan-600" />,
  },
  {
    text: 'Providing technical, financial, and material assistance for the public good during regular times and crises such as the COVID pandemic.',
    icon: <Heart className="w-7 h-7 text-cyan-600" />,
  },
  {
    text: 'Delivering services free of charge and at subsidized rates for economically disadvantaged segments of communities.',
    icon: <Users className="w-7 h-7 text-cyan-600" />,
  },
  {
    text: 'Demonstrating the utmost compliance to regulatory and statutory standards.',
    icon: <Scale className="w-7 h-7 text-cyan-600" />,
  },
];

const sustainabilityImages = [
  {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop&crop=center',
    alt: 'Healthcare partners collaborating',
    caption: 'Strategic Partnerships',
  },
  {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop&crop=center',
    alt: 'Healthcare partners collaborating',
    caption: 'Strategic Partnerships',
  },
  {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop&crop=center',
    alt: 'Healthcare partners collaborating',
    caption: 'Strategic Partnerships',
  },
  {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop&crop=center',
    alt: 'Healthcare partners collaborating',
    caption: 'Strategic Partnerships',
  },
  {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop&crop=center',
    alt: 'Healthcare partners collaborating',
    caption: 'Strategic Partnerships',
  },
];

export default function Sustainability() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate heading
      const heading = sectionRef.current?.querySelector('h1');
      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Animate intro paragraph
      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate list items with stagger
      listRefs.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.98 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.9,
              ease: 'power4.out',
              delay: index * 0.15,
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

      // Animate gallery images with parallax effect
      const galleryImages =
        galleryRef.current?.querySelectorAll('.gallery-image');
      if (galleryImages) {
        galleryImages.forEach((image) => {
          gsap.fromTo(
            image,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: image,
                start: 'top 90%',
                scrub: 0.5,
                toggleActions: 'play none none reverse',
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
      className="py-32 px-6 bg-gradient-to-br from-gray-50 via-blue-50/70 to-indigo-50/70 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent)] opacity-60" />

      <div className="container mx-auto max-w-7xl relative">
        {/* Heading */}
        <div className="text-center mb-20">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
          >
            Sustainability at LHC
          </SectionHeading>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide">
            Advancing Healthcare, Empowering Communities
          </p>
        </div>

        {/* Intro Paragraph */}
        <div className="mb-24">
          <p
            ref={introRef}
            className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto font-medium tracking-wide"
          >
            LHC firmly believes in carrying out its operations in a societally
            and environmentally sustainable manner. As a company whose mission
            is providing integrated healthcare solutions for the wellbeing of
            humanity, delivering on its commitment to societal and environmental
            sustainability constitutes the core philosophy of its business.
          </p>
        </div>

        {/* Interventions List with Icons */}
        <div className="mb-24">
          <h2 className="text-4xl font-semibold text-gray-900 text-center mb-12">
            Our Sustainability Interventions
          </h2>
          <ul className="space-y-4 max-w-4xl mx-auto">
            {sustainabilityInterventions.map((item, index) => (
              <li
                key={index}
                ref={(el) => {
                  listRefs.current[index] = el;
                }}
                className="group"
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-xl">
                  <CardContent className="p-6 flex items-start gap-5">
                    <div className="flex-shrink-0 p-2 bg-indigo-50 rounded-full">
                      {item.icon}
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed font-medium">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="my-16 border-t border-gray-200 max-w-2xl mx-auto" />

        {/* Image Gallery */}
        <div ref={galleryRef} className="">
          <h2 className="text-4xl font-semibold text-cyan-800 text-center mb-12">
            Our Commitment in Action
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sustainabilityImages.map((image, index) => (
              <div
                key={index}
                className="gallery-image relative rounded-xl overflow-hidden shadow-lg group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMC45MTMgMTUwIDIzNy41IDEzMy40MTMgMjM3LjUgMTEyLjVDMjM3LjUgOTEuNTg3IDIyMC45MTMgNzUgMjAwIDc1QzE3OS4wODcgNzUgMTYyLjUgOTEuNTg3IDE2Mi41IDExMi41QzE2Mi41IDEzMy40MTMgMTc5LjA4NyAxNTAgMjAwIDE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4=';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <p className="text-white text-sm font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.caption}
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
