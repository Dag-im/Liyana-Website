'use client';

import BackendImage from '@/components/shared/BackendImage';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Check,
  Clock,
  Globe,
  MapPin,
  Phone,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Division as SharedDivision } from '@/types/services.types';

type Division = Omit<SharedDivision, 'contact'> & {
  contact: NonNullable<SharedDivision['contact']>;
  type: string;
};

// ---------- SUB-COMPONENTS ----------

const SectionTitle = ({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) => (
  <div className="mb-12">
    {subtitle && (
      <span className="block text-cyan-600 font-semibold text-[11px] uppercase tracking-[0.18em] mb-3">
        {subtitle}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
      {children}
    </h2>
    <div className="h-[2px] w-10 bg-cyan-600 mt-5 rounded-full" />
  </div>
);

// Booking wizard moved to components/client/services/BookingWizard.tsx

// ---------- PAGE COMPONENT ----------

export default function DivisionDetailPageClient({
  division,
}: {
  division: Division;
}) {

  // Logic
  const divisionType = division.type || division.divisionCategory?.name || '';
  const normalizedDivisionType = divisionType.toLowerCase();
  const isHealthcare = normalizedDivisionType.includes('health');
  const isEdu = normalizedDivisionType.includes('education');
  const contact = division.contact;

  // --- HERO SLIDER LOGIC ---
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (division.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % division.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [division.images.length]);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      {/* Booking temporarily disabled — will be wired in booking integration
      <BookingWizard division={division} />
      */}

      {/* 1. IMMERSIVE HERO */}
      <div className="relative h-[90vh] w-full overflow-hidden flex flex-col justify-end pb-12 md:pb-20">
        {/* Background Image Slider */}
        <div className="absolute inset-0 bg-slate-900">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <BackendImage
                src={division.images[currentHeroIndex].path}
                alt={`${division.name} Hero ${currentHeroIndex + 1}`}
                fill
                className="object-cover opacity-70"
                priority={currentHeroIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
          {/* Refined gradient overlays for a darker, more corporate look */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/65 to-slate-900/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/20 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 grid lg:grid-cols-12 gap-12 items-end">
          {/* Text Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Logo + Identity Bar */}
            <div className="flex items-center gap-4">
              {/* Division Logo */}
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden p-2 shrink-0">
                {division.logo ? (
                  <BackendImage
                    src={division.logo}
                    alt={`${division.shortName} logo`}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-white font-bold text-sm tracking-wide">
                    {division.shortName
                      .split(/[\s-]+/)
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 3)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold uppercase tracking-widest rounded">
                  {division.type} Division
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-widest">
                  <MapPin size={11} className="text-cyan-400" />
                  {division.location}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
              {division.name}
            </h1>

            <p className="text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              {division.overview}
            </p>

            {/* Slim location pill on mobile */}
            <p className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-widest sm:hidden">
              <MapPin size={11} className="text-cyan-400" />
              {division.location}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              {/* PRIMARY CTA: Only for Healthcare */}
              {/* Booking temporarily disabled — will be wired in booking integration */}

              {/* SECONDARY CTA: Phone */}
              <a
                href={`tel:${division.contact.phone}`}
                className="px-6 py-3 bg-white/8 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/15 transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <Phone size={15} />
                {division.contact.phone}
              </a>
            </div>
          </motion.div>

          {/* Glass Stats Card (Desktop Only) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:block lg:col-span-4"
          >
            {division.stats && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-7 shadow-2xl">
                {/* Logo inside stats card */}
                <div className="flex items-center gap-3 pb-5 border-b border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden p-1.5">
                    {division.logo ? (
                      <BackendImage
                        src={division.logo}
                        alt={division.shortName}
                        width={32}
                        height={32}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-xs">
                        {division.shortName
                          .split(/[\s-]+/)
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 3)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">
                      {division.shortName}
                    </p>
                    <p className="text-slate-400 text-[11px] font-medium mt-0.5 uppercase tracking-wider">
                      Key Metrics
                    </p>
                  </div>
                </div>

                {division.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="border-b border-white/8 last:border-0 pb-6 last:pb-0"
                  >
                    <p className="text-3xl font-semibold text-white mb-1 tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-cyan-400 font-semibold uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </div>
                ))}
                <div className="pt-1">
                  <div className="text-[10px] text-slate-500 leading-tight font-medium uppercase tracking-wider">
                    Metrics verified by {new Date().getFullYear()} Annual Report
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Hero image dots indicator */}
        {division.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {division.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentHeroIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentHeroIndex
                    ? 'w-5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-28">
        {/* 2. ABOUT US SECTION */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            {/* Logo + Name lockup above section title */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-2 shrink-0">
                {division.logo ? (
                  <BackendImage
                    src={division.logo}
                    alt={`${division.shortName} logo`}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-cyan-700 font-bold text-xs tracking-wide">
                    {division.shortName
                      .split(/[\s-]+/)
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 3)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm leading-tight">
                  {division.shortName}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-widest">
                  {division.type} · {division.location}
                </p>
              </div>
            </div>

            <SectionTitle subtitle="About Us">
              Who We Are <br /> & What We Do
            </SectionTitle>
            <div className="space-y-5 text-[16px] text-slate-600 font-normal leading-relaxed">
              {division.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 shadow-sm shadow-slate-900/5 rounded-lg text-sm font-medium text-slate-700">
                <Globe size={16} className="text-cyan-600" />
                International Standards
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 shadow-sm shadow-slate-900/5 rounded-lg text-sm font-medium text-slate-700">
                <Award size={16} className="text-cyan-600" />
                Certified Care
              </div>
            </div>
          </div>

          <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl shadow-slate-900/8 border border-slate-100">
            <BackendImage
              src={
                division.images[0]?.path ||
                division.images[1]?.path ||
                division.images[2]?.path
              }
              alt="Interior"
              fill
              className="object-cover"
            />
            <div className="lg:hidden absolute inset-0 bg-slate-900/10" />
          </div>
        </section>

        {/* 3. SERVICES GRID */}
        <section className="bg-slate-50 -mx-6 px-6 py-20 md:rounded-2xl border border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="block text-cyan-600 font-semibold text-[11px] uppercase tracking-[0.18em] mb-3">
                Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                {isHealthcare ? 'Clinical Specialties' : 'What we Offer'}
              </h2>
              <div className="h-[2px] w-10 bg-cyan-600 mt-5 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {division.coreServices.map((service, i) => (
                <div
                  key={i}
                  className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-900/5 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-cyan-600 rounded-full flex items-center justify-center mb-5 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 transition-colors">
                    <Check size={18} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    World-class facilities and dedicated professionals ensuring
                    the best outcomes for {service.name.toLowerCase()}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. TEAM (CONDITIONAL) */}
        {!isEdu && division.doctors && (
          <section>
            <div className="flex justify-between items-end mb-10">
              <SectionTitle subtitle="Experts">
                Meet Our Specialists
              </SectionTitle>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {division.doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="group relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[3/4]"
                >
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <BackendImage
                      src={doc.image || '/images/logo.png'}
                      alt={doc.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-cyan-400 text-[11px] font-bold uppercase tracking-widest mb-1.5">
                      {doc.specialty}
                    </p>
                    <h4 className="text-xl font-semibold mb-3">{doc.name}</h4>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300 border-t border-white/20 pt-3 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      <Clock size={13} />
                      {doc.availability}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CONTACT / FOOTER MICROSITE */}
        <section className="relative rounded-2xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-xl shadow-slate-900/10">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 md:p-16 lg:p-20 space-y-10">
              {/* Contact section logo lockup */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden p-2.5 shrink-0">
                  {division.logo ? (
                    <BackendImage
                      src={division.logo}
                      alt={`${division.shortName} logo`}
                      width={44}
                      height={44}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm tracking-wide">
                      {division.shortName
                        .split(/[\s-]+/)
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 3)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Visit {division.shortName}
                  </h2>
                  <p className="text-slate-400 text-sm font-medium mt-0.5">
                    We are here to assist you.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="text-cyan-400" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                      Address
                    </p>
                    <p className="text-base font-medium">
                      {contact.address}
                    </p>
                    <a
                      href={contact.googleMap ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-cyan-400 text-sm font-semibold hover:text-white transition-colors"
                    >
                      Open in Google Maps <ArrowRight size={13} />
                    </a>
                  </div>
                </div>

                <div className="h-px bg-slate-800 w-full" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="text-cyan-400" size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                        Phone
                      </p>
                      <a
                        href={`tel:${contact.phone ?? ''}`}
                        className="text-sm font-medium hover:text-cyan-400 transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Globe className="text-cyan-400" size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                        Email
                      </p>
                      <a
                        href={`mailto:${contact.email ?? ''}`}
                        className="text-sm font-medium hover:text-cyan-400 transition-colors"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER CTA */}
              {/* Booking temporarily disabled — will be wired in booking integration */}
            </div>

            {/* Map Visual */}
            <div className="relative h-80 lg:h-auto bg-slate-800 group overflow-hidden border-l border-slate-800">
              <BackendImage
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                alt="Map"
                fill
                className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
              />
              <a
                href={contact.googleMap ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 rounded-full hover:bg-cyan-600 hover:border-cyan-600 transition-all cursor-pointer group-hover:scale-110 shadow-xl">
                  <MapPin size={26} className="text-white" />
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Division Footer */}
      <footer className="py-8 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-1.5">
              {division.logo ? (
                <BackendImage
                  src={division.logo}
                  alt={division.shortName}
                  width={24}
                  height={24}
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-cyan-700 font-bold text-[10px]">
                  {division.shortName
                    .split(/[\s-]+/)
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 3)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-slate-600 text-sm font-medium">
              {division.shortName}
            </p>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} {division.name}. Part of Liyana
            Healthcare Group.
          </p>
        </div>
      </footer>
    </div>
  );
}
