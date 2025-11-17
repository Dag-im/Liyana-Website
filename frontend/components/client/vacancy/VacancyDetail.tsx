'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { Vacancy } from './VacancyList';

interface VacancyDetailProps {
  vacancy: Vacancy;
  onApply: () => void;
}

export default function VacancyDetail({
  vacancy,
  onApply,
}: VacancyDetailProps) {
  return (
    <div className="max-w-4xl mx-auto pb-16 px-6">
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-4 text-cyan-700"
      >
        {vacancy.title}
      </motion.h1>

      <div className="flex flex-wrap gap-6 mb-8 text-cyan-600">
        <div className="flex items-center gap-2">
          <MapPin size={18} /> {vacancy.location}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} /> {vacancy.type}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose max-w-none mb-12"
      >
        <p>{vacancy.description}</p>
      </motion.div>

      <button
        onClick={onApply}
        className="px-6 py-3 bg-linear-to-r from-cyan-500 to-cyan-700 text-white rounded-xl shadow-md hover:shadow-lg transition font-bold"
      >
        Apply Now
      </button>
    </div>
  );
}
