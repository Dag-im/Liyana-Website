'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image?: string; // Optional image URL
  subsidiary: string; // Subsidiary or "Corporate"
}

// Sample team data for a healthcare company
const teamData: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    position: 'Chief Executive Officer',
    bio: 'Visionary leader overseeing strategic direction and growth of the healthcare organization.',
    image: 'https://images.unsplash.com/photo-1519085360753-af2c17f7c6f3',
    subsidiary: 'Corporate',
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Chief Medical Officer',
    bio: 'Leads medical strategy and ensures high standards of patient care across all facilities.',
    subsidiary: 'Corporate',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'Branch Manager - East Coast',
    bio: 'Manages operations and patient services for our East Coast healthcare facilities.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    subsidiary: 'East Coast Health Services',
  },
  {
    id: '4',
    name: 'Dr. David Kim',
    position: 'Chief Operating Officer',
    bio: 'Drives operational excellence and efficiency across all healthcare subsidiaries.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    subsidiary: 'Corporate',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    position: 'Branch Manager - West Coast',
    bio: 'Oversees operations and community outreach for West Coast healthcare facilities.',
    subsidiary: 'West Coast Medical Group',
  },
  {
    id: '6',
    name: 'James Wilson',
    position: 'Chief Financial Officer',
    bio: 'Manages financial strategy and ensures fiscal responsibility for the organization.',
    image: 'https://images.unsplash.com/photo-1519085360753-af2c17f7c6f3',
    subsidiary: 'Corporate',
  },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const imageVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export default function MeetTheTeam() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeSubsidiary, setActiveSubsidiary] = useState<string>('All');

  // Get unique subsidiaries
  const subsidiaries = [
    'All',
    ...Array.from(new Set(teamData.map((member) => member.subsidiary))),
  ];

  // Filter team members by subsidiary
  const filteredTeam =
    activeSubsidiary === 'All'
      ? teamData
      : teamData.filter((member) => member.subsidiary === activeSubsidiary);

  return (
    <section className="relative py-20 px-4 bg-transparent overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
          >
            Meet Our Leadership
          </SectionHeading>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover the dedicated executives and branch managers leading our
            healthcare mission.
          </p>
        </div>

        {/* Subsidiary Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {subsidiaries.map((subsidiary) => (
            <button
              key={subsidiary}
              onClick={() => setActiveSubsidiary(subsidiary)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeSubsidiary === subsidiary
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-700 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200'
              }`}
            >
              {subsidiary}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredTeam.map((member) => (
            <motion.div
              key={member.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Image container */}
              <div className="relative h-64 overflow-hidden">
                <motion.div
                  variants={imageVariants}
                  className="w-full h-full flex items-center justify-center"
                >
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-4xl text-white font-bold">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Subsidiary badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full shadow-sm">
                    {member.subsidiary}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-cyan-600 font-semibold mb-2">
                  {member.position}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Team Member Modal */}
      {selectedMember && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 p-6 rounded-t-2xl text-white">
                <div className="flex items-center gap-4">
                  {selectedMember.image ? (
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      width={50}
                      height={50}
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                      {selectedMember.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedMember.name}
                    </h2>
                    <p className="text-blue-100">{selectedMember.position}</p>
                    <p className="text-blue-200 text-sm">
                      {selectedMember.subsidiary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-600 leading-relaxed mb-6">
                  {selectedMember.bio}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-300"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
