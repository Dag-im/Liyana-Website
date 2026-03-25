'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { getCmsIcon } from '@/lib/icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

interface MissionVisionValuesSectionProps {
  missionTitle?: string;
  missionDescription?: string;
  missionIcon?: string;
  visionTitle?: string;
  visionDescription?: string;
  visionIcon?: string;
  coreValues?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

// ---------- COMPONENT ----------
export default function MissionVisionValuesSection({
  missionTitle = 'Our Mission',
  missionDescription = 'To empower businesses and individuals through innovative solutions, exceptional service, and unwavering commitment to excellence, while creating sustainable value for all our stakeholders.',
  missionIcon = 'Target',
  visionTitle = 'Our Vision',
  visionDescription = 'To be the leading force in our industry, recognized for innovation, integrity, and impact, while building a future where technology serves humanity and creates lasting positive change.',
  visionIcon = 'Eye',
  coreValues = [
    {
      title: 'Excellence',
      description:
        'We strive for the highest standards in everything we do, delivering exceptional quality and results.',
      icon: 'Star',
    },
    {
      title: 'Innovation',
      description:
        'We embrace new ideas and technologies to create cutting-edge solutions for our clients.',
      icon: 'Rocket',
    },
    {
      title: 'Integrity',
      description:
        'We maintain the highest ethical standards and build trust through honest, transparent relationships.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Collaboration',
      description:
        'We believe in the power of teamwork and partnerships to achieve extraordinary outcomes.',
      icon: 'Users',
    },
    {
      title: 'Sustainability',
      description:
        'We are committed to environmental responsibility and long-term value creation.',
      icon: 'Leaf',
    },
    {
      title: 'Customer Focus',
      description:
        'We put our clients first, understanding their needs and exceeding their expectations.',
      icon: 'UserCheck',
    },
  ],
}: MissionVisionValuesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // Fade in Mission/Vision
      gsap.from('.gsap-mv-card', {
        scrollTrigger: {
          trigger: '.gsap-mv-container',
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        clearProps: 'all',
      });

      // Fade in Core Values
      gsap.from('.gsap-value-card', {
        scrollTrigger: {
          trigger: '.gsap-values-container',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-10 pb-24 px-6 bg-white selection:bg-[#cceffa] selection:text-[#014f7a] border-t border-slate-200"
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#0880b9] via-[#33bde9] to-[#01649c] mb-6"
          >
            Our Mission, Vision & Values
          </SectionHeading>
          <p className="text-lg text-slate-600 leading-relaxed">
            Discover the driving force behind our organization and the
            principles that guide our every strategic decision.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="gsap-mv-container grid lg:grid-cols-2 gap-8 mb-32">
          {[
            {
              title: missionTitle,
              description: missionDescription,
              icon: missionIcon,
            },
            {
              title: visionTitle,
              description: visionDescription,
              icon: visionIcon,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="gsap-mv-card bg-slate-50 border border-slate-200 p-10 md:p-12 flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="shrink-0 p-4 bg-white border border-slate-200 shadow-sm rounded-sm">
                {(() => {
                  const Icon = getCmsIcon(item.icon);
                  return <Icon className="text-[#01649c]" size={32} />;
                })()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="gsap-values-container">
          <div className="mb-12 flex items-center gap-6">
            <h3 className="text-3xl font-bold text-slate-900 whitespace-nowrap">
              Core Values
            </h3>
            <div className="h-[1px] w-full bg-slate-200" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className="gsap-value-card bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="mb-6 inline-flex p-3 bg-slate-50 border border-slate-100 rounded-sm group-hover:bg-[#e6f7fc] group-hover:border-[#cceffa] transition-colors">
                  {(() => {
                    const Icon = getCmsIcon(value.icon);
                    return <Icon className="text-[#01649c]" size={24} />;
                  })()}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {value.title}
                </h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
