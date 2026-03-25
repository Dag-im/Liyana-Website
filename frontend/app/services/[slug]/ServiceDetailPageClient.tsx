'use client';

import BackendImage from '@/components/shared/BackendImage';
import RichTextViewer from '@/components/shared/RichTextViewer';
import type { Division as SharedDivision } from '@/types/services.types';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Clock, Globe, MapPin, Phone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Division = Omit<SharedDivision, 'contact'> & {
  contact: NonNullable<SharedDivision['contact']>;
  type: string;
};

const ACCENT = '#009ad6';
const ACCENT_MID = '#0880b9';
const ACCENT_DARK = '#01649c';

const SectionTitle = ({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) => (
  <div className="mb-12">
    {subtitle && (
      <span
        className="block font-semibold text-[11px] uppercase tracking-[0.18em] mb-3"
        style={{ color: ACCENT_MID }}
      >
        {subtitle}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
      {children}
    </h2>
    <div
      className="h-[2px] w-10 mt-5 rounded-full"
      style={{ backgroundColor: ACCENT_MID }}
    />
  </div>
);

export default function DivisionDetailPageClient({
  division,
}: {
  division: Division;
}) {
  const divisionType = division.type || division.divisionCategory?.name || '';
  const normalizedDivisionType = divisionType.toLowerCase();
  const isEdu = normalizedDivisionType.includes('education');
  const contact = division.contact;

  const heroImages = useMemo(() => {
    const images = division.images.map((image) => image.path).filter(Boolean);
    if (images.length > 0) {
      return images;
    }
    if (division.groupPhoto) {
      return [division.groupPhoto];
    }
    if (division.logo) {
      return [division.logo];
    }
    return ['/images/logo.png'];
  }, [division.groupPhoto, division.images, division.logo]);

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-[#cceffa] selection:text-[#014f7a]">
      <div className="relative h-[90vh] w-full overflow-hidden flex flex-col justify-end pb-12 md:pb-20">
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
                src={heroImages[currentHeroIndex]}
                alt={`${division.name} Hero ${currentHeroIndex + 1}`}
                fill
                className="object-cover opacity-70"
                priority={currentHeroIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-b from-[#014f7a]/60 via-[#014f7a]/40 to-slate-950 lg:hidden" />

          {/* Desktop Gradient: Horizontal fade (Left Dark -> Right Clear) */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#014f7a]/40 via-[#014f7a]/70 to-transparent" />
        </div>

        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 grid lg:grid-cols-12 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="flex items-center gap-4">
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

              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="px-3 py-1 border text-[11px] font-bold uppercase tracking-widest rounded"
                  style={{
                    backgroundColor: 'rgba(0, 155, 217, 0.14)',
                    borderColor: 'rgba(0, 155, 217, 0.28)',
                    color: '#b8e6f7',
                  }}
                >
                  {division.type} Division
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-widest">
                  <MapPin size={11} style={{ color: ACCENT }} />
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

            <p className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-widest sm:hidden">
              <MapPin size={11} style={{ color: ACCENT }} />
              {division.location}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`tel:${division.contact.phone ?? ''}`}
                className="px-6 py-3 bg-white/8 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/15 transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <Phone size={15} />
                {division.contact.phone}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:block lg:col-span-4"
          >
            {division.stats && division.stats.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-7 shadow-2xl">
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
                    <p
                      className="text-[11px] font-semibold uppercase tracking-widest"
                      style={{ color: ACCENT }}
                    >
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

        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroImages.map((_, i) => (
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
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div>
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
                  <span
                    className="font-bold text-xs tracking-wide"
                    style={{ color: ACCENT_DARK }}
                  >
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
            {division.description && (
              <RichTextViewer
                content={division.description}
                className="text-[16px] font-normal leading-relaxed"
              />
            )}
          </div>

          <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl shadow-slate-900/8 border border-slate-100">
            <BackendImage
              src={heroImages[0]}
              alt="Interior"
              fill
              className="object-cover"
            />
            <div className="lg:hidden absolute inset-0 bg-slate-900/10" />
          </div>
        </section>

        <section className="bg-slate-50 -mx-6 px-6 py-20 md:rounded-2xl border border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span
                className="block font-semibold text-[11px] uppercase tracking-[0.18em] mb-3"
                style={{ color: ACCENT_MID }}
              >
                Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                {normalizedDivisionType.includes('health')
                  ? 'Clinical Specialties'
                  : 'What we Offer'}
              </h2>
              <div
                className="h-[2px] w-10 mt-5 mx-auto rounded-full"
                style={{ backgroundColor: ACCENT_MID }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {division.coreServices.map((service, i) => (
                <div
                  key={i}
                  className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-900/5 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-5 transition-colors"
                    style={{ color: ACCENT_MID }}
                  >
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

        {!isEdu &&
          division.requiresMedicalTeam &&
          division.doctors &&
          division.doctors.length > 0 && (
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
                      <p
                        className="text-[11px] font-bold uppercase tracking-widest mb-1.5"
                        style={{ color: ACCENT }}
                      >
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

        {division.groupPhoto && (
          <section>
            <div className="mb-10">
              <SectionTitle subtitle="Team Overview">
                The Faces of {division.shortName}
              </SectionTitle>
            </div>
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-xl shadow-slate-900/8 border border-slate-100 group">
              <BackendImage
                src={division.groupPhoto}
                alt={`${division.shortName} Group Photo`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">
                  Committed to Excellence
                </h3>
                <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                  Our dedicated team of professionals works collaboratively to
                  deliver the highest standard of service.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="relative rounded-2xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-xl shadow-slate-900/10">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 md:p-16 lg:p-20 space-y-10">
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
                    <MapPin style={{ color: ACCENT }} size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                      Address
                    </p>
                    <p className="text-base font-medium">{contact.address}</p>
                    <a
                      href={contact.googleMap ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold hover:text-white transition-colors"
                      style={{ color: ACCENT }}
                    >
                      Open in Google Maps <ArrowRight size={13} />
                    </a>
                  </div>
                </div>

                <div className="h-px bg-slate-800 w-full" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone style={{ color: ACCENT }} size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                        Phone
                      </p>
                      <a
                        href={`tel:${contact.phone ?? ''}`}
                        className="text-sm font-medium transition-colors"
                        style={{ color: 'white' }}
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Globe style={{ color: ACCENT }} size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                        Email
                      </p>
                      <a
                        href={`mailto:${contact.email ?? ''}`}
                        className="text-sm font-medium transition-colors"
                        style={{ color: 'white' }}
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-80 lg:h-auto bg-slate-800 group overflow-hidden border-l border-slate-800">
              <BackendImage
                src={division.groupPhoto || heroImages[0]}
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
                <div
                  className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 rounded-full transition-all cursor-pointer group-hover:scale-110 shadow-xl"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                >
                  <MapPin size={26} className="text-white" />
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
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
                <span
                  className="font-bold text-[10px]"
                  style={{ color: ACCENT_DARK }}
                >
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
