'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Award as AwardIcon } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface Award {
  id: number;
  title: string;
  organization: string;
  year: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
}

const awards: Award[] = [
  {
    id: 1,
    title: 'Excellence in Healthcare Innovation',
    organization: 'Healthcare Industry Association',
    year: '2024',
    category: 'Innovation',
    description:
      'Recognized for pioneering advancements in healthcare technology and patient care solutions.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    imageAlt: 'Team receiving Excellence in Healthcare Innovation Award 2024',
  },
  {
    id: 2,
    title: 'Outstanding Patient Care',
    organization: 'Patient Choice Awards',
    year: '2024',
    category: 'Service',
    description:
      'Awarded for exceptional patient satisfaction and outstanding care delivery excellence.',
    image: 'https://images.unsplash.com/photo-1576765607924-3a7bd1c70d84',
    imageAlt: 'Care team receiving Outstanding Patient Care Award 2024',
  },
  {
    id: 3,
    title: 'Environmental Leadership in Healthcare',
    organization: 'Green Healthcare Council',
    year: '2023',
    category: 'Sustainability',
    description:
      'Honored for our commitment to sustainable practices and reducing environmental impact in healthcare.',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c7983',
    imageAlt: 'Executive receiving Environmental Leadership Award 2023',
  },
  {
    id: 4,
    title: 'Fastest Growing Healthcare Network',
    organization: 'Healthcare Business Awards',
    year: '2023',
    category: 'Growth',
    description:
      'Recognized for rapid expansion and leadership in the healthcare industry.',
    image: 'https://images.unsplash.com/photo-1742415888265-d5044039d8e6',
    imageAlt:
      'Leadership team receiving Fastest Growing Healthcare Network Award 2023',
  },
  {
    id: 5,
    title: 'Workplace Excellence in Healthcare',
    organization: 'Healthcare HR Awards',
    year: '2023',
    category: 'Human Resources',
    description:
      'Awarded for fostering an outstanding workplace culture and employee development programs.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    imageAlt: 'HR team receiving Workplace Excellence Award 2023',
  },
  {
    id: 6,
    title: 'Quality Management Excellence',
    organization: 'Healthcare Standards Institute',
    year: '2022',
    category: 'Quality',
    description:
      'Certified for maintaining the highest standards of quality management and patient safety.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    imageAlt: 'Quality team receiving Quality Management Excellence Award 2022',
  },
];

export default function AwardsSection() {
  const ITEMS_PER_PAGE = 3;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(awards.map((a) => a.category)))],
    []
  );

  const filteredAwards = useMemo(() => {
    return selectedCategory === 'All'
      ? awards
      : awards.filter((award) => award.category === selectedCategory);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, filteredAwards.length)
    );
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-4"
          >
            Awards & Recognition
          </SectionHeading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Our dedication to advancing healthcare has earned us prestigious
            accolades from industry leaders, reflecting our commitment to
            innovation, quality, and patient care.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex justify-end mb-8">
          <label className="sr-only" htmlFor="category-filter">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm
               hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Awards Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAwards.slice(0, visibleCount).map((award) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="group border-none shadow-lg hover:shadow-xl hover:-translate-y-2 rounded-xl overflow-hidden transition-all duration-300 py-0">
                {/* Image Top Half */}
                <div className="relative w-full h-56">
                  <Image
                    src={award.image}
                    alt={award.imageAlt}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/400x300/1e40af/ffffff?text=${encodeURIComponent(
                        award.title
                      )}`;
                    }}
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-white/90 text-gray-700 font-semibold px-3 py-1 rounded-full shadow-sm">
                      {award.category}
                    </Badge>
                  </div>
                </div>

                {/* Content Bottom Half */}
                <CardContent className="p-6 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors duration-300">
                    {award.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 font-medium">
                    {award.organization} • {award.year}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm flex-1">
                    {award.description}
                  </p>

                  <button
                    onClick={() => setSelectedAward(award)}
                    className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <AwardIcon className="w-4 h-4 mr-2" />
                    View Certificate
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredAwards.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Load More
            </button>
          </div>
        )}

        {/* Certificate Modal */}
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 translate-y-8"
            onClick={() => setSelectedAward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <Image
                  src={selectedAward.image}
                  alt={selectedAward.imageAlt}
                  width={700}
                  height={500}
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/700x500/1e40af/ffffff?text=${encodeURIComponent(
                      selectedAward.title
                    )}`;
                  }}
                />
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedAward.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedAward.organization} • {selectedAward.year}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-300 shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
