'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Calendar, Lightbulb, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  location?: string;
  achievement?: string;
  image?: string;
  category?: 'milestone' | 'achievement' | 'expansion' | 'innovation';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  title?: string;
  subtitle?: string;
}

const Timeline = ({
  items,
  className = '',
  title,
  subtitle,
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'milestone':
        return 'from-blue-600 to-blue-400';
      case 'achievement':
        return 'from-emerald-600 to-emerald-400';
      case 'expansion':
        return 'from-purple-600 to-purple-400';
      case 'innovation':
        return 'from-amber-600 to-amber-400';
      default:
        return 'from-gray-600 to-gray-400';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'milestone':
        return <Calendar className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
      case 'expansion':
        return <MapPin className="w-5 h-5" />;
      case 'innovation':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full bg-white dark:bg-neutral-950 font-sans ${className}`}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        {title && (
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6 text-center"
          >
            {title}
          </SectionHeading>
        )}
        {subtitle && (
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-2xl mx-auto text-center">
            {subtitle}
          </p>
        )}
      </div>

      {/* Timeline body */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-start pt-10 md:pt-40 md:gap-10 relative"
          >
            {/* Sticky year + dot */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Timeline Dot */}
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
              </div>

              {/* Year badge (desktop) */}
              <Badge
                className={`hidden md:flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(
                  item.category
                )} text-white px-5 py-2 rounded-xl shadow-xl md:ml-20`}
              >
                {getCategoryIcon(item.category)}
                <span className="font-bold text-lg">{item.year}</span>
              </Badge>
            </div>

            {/* Timeline content */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              {/* Year (mobile) */}
              <Badge
                className={`md:hidden mb-4 flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(
                  item.category
                )} text-white px-5 py-2 rounded-xl shadow-xl`}
              >
                {getCategoryIcon(item.category)}
                <span className="font-bold text-lg">{item.year}</span>
              </Badge>

              {/* Card */}
              <Card className="overflow-hidden border border-gray-100 bg-white/90 rounded-2xl transition-all hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800">
                <CardContent className="p-8">
                  {item.image && (
                    <div className="mb-6 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={200}
                        height={75}
                        className="w-full h-56 object-cover transform transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                    {item.location && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-2 text-sm bg-gray-50 border-gray-200 text-gray-700 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700"
                      >
                        <MapPin className="w-4 h-4" />
                        {item.location}
                      </Badge>
                    )}
                    {item.achievement && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-2 text-sm bg-gray-50 border-gray-200 text-gray-700 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700"
                      >
                        <Award className="w-4 h-4" />
                        {item.achievement}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        {/* Animated vertical line */}
        <div
          style={{
            height: `${height}px`,
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px]
          bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
          from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]
          [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
