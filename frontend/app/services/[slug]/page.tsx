'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { Division, SERVICES_DATA } from '@/data/services';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  Variants,
} from 'framer-motion';
import { CheckCircle, ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { use, useEffect, useMemo, useRef, useState } from 'react';

// ---------- UTILS ----------
const cn = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(' ');

// ---------- ANIMATION VARIANTS ----------
const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};
const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  hover: { scale: 1.02, transition: { duration: 0.18 } },
};

// ---------------- COMPONENT ----------------
export default function DivisionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  // container & scroll transforms
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // find division from SERVICES_DATA (populates page)
  const division: Division | undefined = useMemo(() => {
    for (const category of SERVICES_DATA) {
      const d = category.divisions.find((x) => x.slug === slug);
      if (d) return d;
    }
    return undefined;
  }, [slug]);

  // Refs for inView detection
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const staffRef = useRef<HTMLDivElement>(null);

  const isHeroInView = useInView(heroRef, { once: false, margin: '-100px' });
  const isAboutInView = useInView(aboutRef, { once: false, margin: '-100px' });
  const isContactInView = useInView(contactRef, {
    once: false,
    margin: '-100px',
  });
  const isStaffInView = useInView(staffRef, { once: false, margin: '-100px' });

  // fallback if not found
  if (!division) {
    notFound();
  }

  // images & carousel state (from division)
  const images = useMemo(
    () =>
      division.images && division.images.length > 0
        ? division.images
        : ['/placeholder.jpg'],
    [division.images]
  );

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  // scroll to about
  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-gray-50 text-gray-900"
    >
      <main className="pt-16">
        {/* HERO SECTION */}
        <motion.section
          id="hero"
          ref={heroRef}
          style={{ y }}
          initial="hidden"
          animate={isHeroInView ? 'visible' : 'hidden'}
          variants={fadeInVariants}
          className="relative h-[90vh] w-full flex flex-col items-center justify-center text-center px-6 md:px-12 overflow-hidden"
        >
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === currentImage ? 1 : 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            >
              <Image
                src={img}
                alt={`${division.name} image ${i + 1}`}
                fill
                className="object-cover brightness-75"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/55" />
            </motion.div>
          ))}

          <div className="relative z-10 max-w-5xl mx-auto w-full">
            {/* Title stays centered */}
            <SectionHeading
              variant="large"
              align="center"
              weight="bold"
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600 mb-6"
            >
              {division.name}
            </SectionHeading>

            {/* Core services: vertical, left-aligned (up to 6), while title remains centered */}
            {division.coreServices?.length > 0 && (
              <motion.div
                variants={staggerContainerVariants}
                className="mt-8 flex flex-col items-baseline gap-3 max-w-md mx-auto md:mx-0 md:text-left text-left"
              >
                {division.coreServices.slice(0, 6).map((service, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex items-center gap-3 text-white/90"
                  >
                    <CheckCircle className="h-5 w-5 text-cyan-400 shrink-0" />
                    <p className="text-sm md:text-base">{service}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Navigation dots (clickable) */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                aria-label={`Show image ${i + 1}`}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-200 focus:outline-none',
                  i === currentImage
                    ? 'bg-cyan-400 scale-110 shadow-[0_0_10px_#06b6d4]'
                    : 'bg-white/40'
                )}
              />
            ))}
          </div>

          {/* Scroll down button */}
          <motion.button
            onClick={scrollToAbout}
            whileHover={{ y: 4 }}
            className="absolute bottom-3 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ChevronDown className="w-10 h-10 animate-bounce" />
          </motion.button>
        </motion.section>

        {/* ABOUT SECTION */}
        <motion.section
          id="about"
          ref={aboutRef}
          initial="hidden"
          animate={isAboutInView ? 'visible' : 'hidden'}
          variants={staggerContainerVariants}
          className="py-20 px-6 md:px-12 bg-white"
        >
          <div className="max-w-4xl mx-auto border-l-4 border-cyan-500 pl-6">
            <SectionHeading
              variant="large"
              weight="bold"
              className="mb-8 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent"
            >
              About {division.name.split('(')[0]}
            </SectionHeading>
            <div className="space-y-6 text-gray-700">
              {division.description?.map((block, i) => (
                <motion.p
                  key={i}
                  variants={slideInRightVariants}
                  className="text-lg leading-relaxed"
                >
                  {block}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CONTACT / LOCATION SECTION (polished cards) */}
        {division.contact && (
          <motion.section
            id="contact"
            ref={contactRef}
            initial="hidden"
            animate={isContactInView ? 'visible' : 'hidden'}
            variants={staggerContainerVariants}
            className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-blue-50/50"
          >
            <SectionHeading
              variant="large"
              align="center"
              weight="bold"
              className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-10"
            >
              Contact Us
            </SectionHeading>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {[
                {
                  icon: MapPin,
                  title: 'Address',
                  text: division.contact.address,
                },
                { icon: Phone, title: 'Phone', text: division.contact.phone },
                { icon: Mail, title: 'Email', text: division.contact.email },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl border border-cyan-100 shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* icon circle (top center) */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-md">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>

                  <div className="mt-8 text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{item.text}</p>
                  </div>

                  {/* decorative gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-50/30 to-transparent opacity-0 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* STAFF / GROUP PHOTO SECTION */}
        {division.groupPhoto && (
          <motion.section
            id="staff"
            ref={staffRef}
            initial="hidden"
            animate={isStaffInView ? 'visible' : 'hidden'}
            variants={fadeInVariants}
            className="pt-12 bg-gray-50"
          >
            <SectionHeading
              variant="large"
              align="center"
              weight="bold"
              className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
            >
              Our Staff
            </SectionHeading>
            <div className="relative w-full h-[40vh] md:h-[80vh]">
              <Image
                src={division.groupPhoto}
                alt="Staff group photo"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
