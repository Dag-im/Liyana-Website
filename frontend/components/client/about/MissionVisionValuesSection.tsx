'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { motion, Transition, Variants } from 'framer-motion';
import {
  Eye,
  Leaf,
  Rocket,
  ShieldCheck,
  Star,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';
import { ReactElement } from 'react';

// ---------- TYPES ----------
interface CoreValue {
  title: string;
  description: string;
  icon: ReactElement;
}

interface MissionVision {
  title: string;
  description: string;
  icon: ReactElement;
}

// ---------- CONTENT ----------
const missionVision: { mission: MissionVision; vision: MissionVision } = {
  mission: {
    title: 'Our Mission',
    description:
      'To empower businesses and individuals through innovative solutions, exceptional service, and unwavering commitment to excellence, while creating sustainable value for all our stakeholders.',
    icon: <Target size={36} className="text-cyan-600" />,
  },
  vision: {
    title: 'Our Vision',
    description:
      'To be the leading force in our industry, recognized for innovation, integrity, and impact, while building a future where technology serves humanity and creates lasting positive change.',
    icon: <Eye size={36} className="text-cyan-600" />,
  },
};

const coreValues: CoreValue[] = [
  {
    title: 'Excellence',
    description:
      'We strive for the highest standards in everything we do, delivering exceptional quality and results.',
    icon: <Star size={28} className="text-cyan-600" />,
  },
  {
    title: 'Innovation',
    description:
      'We embrace new ideas and technologies to create cutting-edge solutions for our clients.',
    icon: <Rocket size={28} className="text-cyan-600" />,
  },
  {
    title: 'Integrity',
    description:
      'We maintain the highest ethical standards and build trust through honest, transparent relationships.',
    icon: <ShieldCheck size={28} className="text-cyan-600" />,
  },
  {
    title: 'Collaboration',
    description:
      'We believe in the power of teamwork and partnerships to achieve extraordinary outcomes.',
    icon: <Users size={28} className="text-cyan-600" />,
  },
  {
    title: 'Sustainability',
    description:
      'We are committed to environmental responsibility and long-term value creation.',
    icon: <Leaf size={28} className="text-cyan-600" />,
  },
  {
    title: 'Customer Focus',
    description:
      'We put our clients first, understanding their needs and exceeding their expectations.',
    icon: <UserCheck size={28} className="text-cyan-600" />,
  },
];

// ---------- MOTION VARIANTS ----------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.08,
      duration: 0.5,
      ease: 'easeOut',
    } as Transition,
  }),
};

// ---------- COMPONENT ----------
export default function MissionVisionValuesSection() {
  return (
    <section className="relative py-24 px-4 bg-gray-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 mb-6"
          >
            Our Mission, Vision & Values
          </SectionHeading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the driving force behind our organization and the
            principles that guide our every decision.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {[missionVision.mission, missionVision.vision].map((item, idx) => (
            <motion.div
              key={idx}
              custom={idx + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative bg-white rounded-3xl shadow-lg p-10 pt-20 text-center hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Icon circle */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-500 flex items-center justify-center shadow-md">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-4">
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Values Heading */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Core Values</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The fundamental principles that shape our culture and drive our
            success.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-14">
          {coreValues.map((value, idx) => (
            <motion.div
              key={idx}
              custom={idx + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl shadow-md p-8 pt-20 text-center hover:shadow-xl transition-shadow duration-300"
            >
              {/* Icon circle */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-500 flex items-center justify-center shadow-md">
                {value.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                {value.title}
              </h4>
              <p className="text-gray-600 text-base leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
