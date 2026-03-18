'use client';

import {
  SERVICES_DATA,
  type Division as LocalDivision,
  type DivisionType,
  type Doctor as LocalDoctor,
  type ServiceCategory as LocalServiceCategory,
} from '@/data/services';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Globe,
  MapPin,
  Phone,
  Search,
  Stethoscope,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';
import type { Division as SharedDivision } from '@/types/services.types';

type Division = Omit<SharedDivision, 'contact'> & {
  contact: NonNullable<SharedDivision['contact']>;
  type: DivisionType;
};

function mapDoctor(doctor: LocalDoctor, divisionId: string) {
  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    image: doctor.image,
    availability: doctor.availability,
    divisionId,
  };
}

function mapDivision(
  division: LocalDivision,
  serviceCategory: LocalServiceCategory
): Division {
  return {
    id: division.id,
    slug: division.slug,
    name: division.name,
    shortName: division.shortName,
    location: division.location ?? null,
    overview: division.overview,
    logo: division.logo ?? null,
    description: division.description,
    groupPhoto: division.groupPhoto ?? null,
    isActive: true,
    serviceCategoryId: serviceCategory.id,
    divisionCategoryId: division.type,
    divisionCategory: {
      id: division.type,
      name: division.type,
      label: division.type,
      description: null,
    },
    serviceCategory: {
      id: serviceCategory.id,
      title: serviceCategory.title,
      tagline: serviceCategory.tagline,
      heroImage: serviceCategory.heroImage,
      attributes: serviceCategory.attributes,
      createdAt: '',
      updatedAt: '',
    },
    images: division.images.map((path, index) => ({
      id: `${division.id}-image-${index}`,
      path,
      sortOrder: index,
    })),
    coreServices: division.coreServices.map((name, index) => ({
      id: `${division.id}-service-${index}`,
      name,
      sortOrder: index,
    })),
    stats: (division.stats ?? []).map((stat, index) => ({
      id: `${division.id}-stat-${index}`,
      label: stat.label,
      value: stat.value,
      sortOrder: index,
    })),
    doctors: (division.doctors ?? []).map((doctor) =>
      mapDoctor(doctor, division.id)
    ),
    contact: {
      id: `${division.id}-contact`,
      phone: division.contact.phone ?? null,
      email: division.contact.email ?? null,
      address: division.contact.address ?? null,
      googleMap: division.contact.googleMap ?? null,
    },
    createdAt: '',
    updatedAt: '',
    type: division.type,
  };
}

// ---------- DIVISION LOGO COMPONENT ----------
// Renders the division logo if available, otherwise falls back to a
// monogram badge built from the division shortName.

function DivisionLogo({
  division,
  size = 'md',
  theme = 'light',
}: {
  division: Division;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}) {
  const sizeMap = {
    sm: { wrapper: 'w-9 h-9', text: 'text-[10px]', img: 32 },
    md: { wrapper: 'w-14 h-14', text: 'text-xs', img: 56 },
    lg: { wrapper: 'w-20 h-20', text: 'text-sm', img: 80 },
  };
  const s = sizeMap[size];

  const initials = division.shortName
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  if (division.logo) {
    return (
      <div
        className={`${s.wrapper} relative shrink-0 flex items-center justify-center`}
      >
        <Image
          src={division.logo}
          alt={`${division.shortName} logo`}
          width={s.img}
          height={s.img}
          className="object-contain w-full h-full"
        />
      </div>
    );
  }

  // Fallback monogram
  return (
    <div
      className={`${s.wrapper} shrink-0 flex items-center justify-center rounded-lg font-bold tracking-wide ${
        theme === 'dark'
          ? 'bg-white/10 border border-white/20 text-white'
          : 'bg-cyan-50 border border-cyan-200 text-cyan-800'
      } ${s.text}`}
    >
      {initials}
    </div>
  );
}

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

// ---------- MULTI-STEP WIZARD MODAL ----------

type BookingSelection = {
  id: string;
  type: 'general' | 'service' | 'doctor';
  label: string;
  subLabel?: string;
  image?: string;
};

function BookingWizard({
  isOpen,
  onClose,
  division,
}: {
  isOpen: boolean;
  onClose: () => void;
  division: Division;
}) {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelection(null);
      setSearchQuery('');
      setFormData({ name: '', phone: '', email: '' });
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const general: BookingSelection = {
      id: 'general-booking',
      type: 'general',
      label: 'General Consultation',
      subLabel: 'Not sure who to see? Let us assign the best doctor.',
    };

    const services: BookingSelection[] = division.coreServices
      .filter((s) => s.name.toLowerCase().includes(query))
      .map((s) => ({
        id: s.id,
        type: 'service',
        label: s.name,
        subLabel: 'Department Service',
      }));

    const doctors: BookingSelection[] = (division.doctors || [])
      .filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.specialty.toLowerCase().includes(query)
      )
      .map((d) => ({
        id: d.id,
        type: 'doctor',
        label: d.name,
        subLabel: d.specialty,
        image: d.image ?? undefined,
      }));

    return {
      showGeneral: 'general consultation'.includes(query),
      generalOption: general,
      services,
      doctors,
    };
  }, [searchQuery, division]);

  const handleNext = () => {
    if (step === 1 && selection) setStep(2);
    if (step === 2 && formData.name && formData.phone) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-900/20 flex flex-col max-h-[85vh]"
          >
            {/* HEADER */}
            <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center shrink-0 z-10">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    onClick={handleBack}
                    className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-slate-600" />
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <DivisionLogo division={division} size="sm" />
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base leading-tight">
                      {step === 1 && 'Book Appointment'}
                      {step === 2 && 'Contact Details'}
                      {step === 3 && 'Booking Confirmed'}
                    </h3>
                    {step < 3 && (
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {division.shortName} · Step {step} of 2
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-0">
              {step === 1 && (
                <div className="flex flex-col h-full">
                  <div className="p-5 pb-2 sticky top-0 bg-white z-10 border-b border-slate-50">
                    <div className="relative">
                      <Search
                        className="absolute left-3.5 top-3.5 text-slate-400"
                        size={16}
                      />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search doctor, specialty, or service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-5 pt-4 space-y-6">
                    {filteredOptions.showGeneral && (
                      <button
                        onClick={() =>
                          setSelection(filteredOptions.generalOption)
                        }
                        className={`w-full p-4 rounded-lg border text-left flex items-center gap-4 transition-all group ${
                          selection?.id === 'general-booking'
                            ? 'border-cyan-600 bg-cyan-50/60 ring-1 ring-cyan-600/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                            selection?.id === 'general-booking'
                              ? 'bg-cyan-100 text-cyan-700'
                              : 'bg-slate-50 text-slate-400 border border-slate-200'
                          }`}
                        >
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            General Booking
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Not sure? We will help.
                          </p>
                        </div>
                        {selection?.id === 'general-booking' && (
                          <Check size={16} className="ml-auto text-cyan-600" />
                        )}
                      </button>
                    )}

                    {filteredOptions.doctors.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
                          Specialists
                        </p>
                        <div className="space-y-2">
                          {filteredOptions.doctors.map((doc) => (
                            <button
                              key={doc.id}
                              onClick={() => setSelection(doc)}
                              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                                selection?.id === doc.id
                                  ? 'border-cyan-600 bg-cyan-50/60 ring-1 ring-cyan-600/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-cyan-100 border border-slate-200/60">
                                {doc.image ? (
                                  <Image
                                    src={doc.image}
                                    alt={doc.label}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <User className="m-auto text-slate-400 h-full w-5" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900 text-sm">
                                  {doc.label}
                                </p>
                                <p className="text-xs text-cyan-600 font-medium mt-0.5">
                                  {doc.subLabel}
                                </p>
                              </div>
                              {selection?.id === doc.id && (
                                <Check size={16} className="text-cyan-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredOptions.services.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
                          Departments
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {filteredOptions.services.map((svc) => (
                            <button
                              key={svc.id}
                              onClick={() => setSelection(svc)}
                              className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between h-24 ${
                                selection?.id === svc.id
                                  ? 'border-cyan-600 bg-cyan-50/60 ring-1 ring-cyan-600/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <span className="font-semibold text-sm text-slate-800 leading-snug">
                                {svc.label}
                              </span>
                              <div className="flex justify-between items-end w-full">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                                  Service
                                </span>
                                {selection?.id === svc.id && (
                                  <Check size={14} className="text-cyan-600" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && selection && (
                <div className="p-6 space-y-6">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-md flex items-center justify-center text-cyan-600 shrink-0">
                      {selection.type === 'doctor' ? (
                        <Stethoscope size={18} />
                      ) : (
                        <Calendar size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                        Booking Request For
                      </p>
                      <p className="font-semibold text-slate-900 text-sm">
                        {selection.label}
                      </p>
                      {selection.subLabel && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {selection.subLabel}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User
                          size={15}
                          className="absolute left-3.5 top-3 text-slate-400"
                        />
                        <input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="John Doe"
                          className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-white transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone
                          size={15}
                          className="absolute left-3.5 top-3 text-slate-400"
                        />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-white transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Email Address{' '}
                        <span className="text-slate-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <div className="relative">
                        <Globe
                          size={15}
                          className="absolute left-3.5 top-3 text-slate-400"
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="name@company.com"
                          className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-white transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && selection && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                  <div className="w-14 h-14 bg-green-50 border border-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Check size={28} />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-2">
                    Request Received
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto mb-8">
                    Thank you,{' '}
                    <strong className="font-semibold text-slate-700">
                      {formData.name}
                    </strong>
                    .
                    <br />
                    <br /> We have received your request for{' '}
                    <strong className="font-semibold text-slate-700">
                      {selection.label}
                    </strong>
                    . Our team will contact you at{' '}
                    <span className="font-medium text-slate-800">
                      {formData.phone}
                    </span>{' '}
                    shortly to confirm the schedule.
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            {step < 3 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <DivisionLogo division={division} size="sm" />
                  <span className="text-xs font-medium text-slate-400">
                    {division.shortName}
                  </span>
                </div>
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !selection) ||
                    (step === 2 && (!formData.name || !formData.phone))
                  }
                  className="px-5 py-2.5 bg-cyan-700 text-white text-sm font-semibold rounded-lg hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {step === 1 ? 'Continue' : 'Confirm Request'}
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-center shrink-0">
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
                >
                  Close Window
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ---------- PAGE COMPONENT ----------

export default function DivisionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  // Data Retrieval
  let division: Division | undefined;
  for (const cat of SERVICES_DATA) {
    const d = cat.divisions.find((x) => x.slug === slug);
    if (d) {
      division = mapDivision(d, cat);
      break;
    }
  }

  if (!division) notFound();

  // Logic
  const isHealthcare = division.type === 'healthcare';
  const isEdu = division.type === 'education';
  const contact = division.contact;

  const [modalOpen, setModalOpen] = useState(false);

  // --- HERO SLIDER LOGIC ---
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (division && division.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % division!.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [division]);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      <BookingWizard
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        division={division}
      />

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
              <Image
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
                  <Image
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
              {isHealthcare && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-6 py-3 bg-white text-slate-900 text-sm font-semibold rounded-lg hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-2 group shadow-lg shadow-black/20"
                >
                  <Calendar
                    size={15}
                    className="text-cyan-600 group-hover:text-white transition-colors"
                  />
                  Book Appointment
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform ml-1"
                  />
                </button>
              )}

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
                      <Image
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
                  <Image
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
            <Image
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
                    <Image
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
                    <Image
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
              {isHealthcare && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors text-sm tracking-wide"
                >
                  Schedule Appointment
                </button>
              )}
            </div>

            {/* Map Visual */}
            <div className="relative h-80 lg:h-auto bg-slate-800 group overflow-hidden border-l border-slate-800">
              <Image
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
                <Image
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
