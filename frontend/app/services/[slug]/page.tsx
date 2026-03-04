'use client';

import { Division, SERVICES_DATA } from '@/data/services';
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
      <span className="block text-cyan-500 font-bold text-xs uppercase tracking-widest mb-2">
        {subtitle}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-light text-slate-900">
      {children}
    </h2>
    <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-transparent mt-4 rounded-full" />
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

export function BookingWizard({
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
      .filter((s) => s.toLowerCase().includes(query))
      .map((s) => ({
        id: s,
        type: 'service',
        label: s,
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
        image: d.image,
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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* HEADER */}
            <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center shrink-0 z-10">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    onClick={handleBack}
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-slate-600" />
                  </button>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">
                    {step === 1 && 'Book Appointment'}
                    {step === 2 && 'Contact Details'}
                    {step === 3 && 'Booking Confirmed'}
                  </h3>
                  {step < 3 && (
                    <p className="text-xs text-slate-400 font-medium">
                      Step {step} of 2
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-0">
              {step === 1 && (
                <div className="flex flex-col h-full">
                  <div className="p-5 pb-2 sticky top-0 bg-white z-10">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-3.5 text-slate-400"
                        size={18}
                      />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search doctor, specialty, or service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="p-5 pt-2 space-y-6">
                    {filteredOptions.showGeneral && (
                      <button
                        onClick={() =>
                          setSelection(filteredOptions.generalOption)
                        }
                        className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all group ${
                          selection?.id === 'general-booking'
                            ? 'border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500'
                            : 'border-slate-100 bg-white hover:border-cyan-200 hover:shadow-md'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            selection?.id === 'general-booking'
                              ? 'bg-cyan-200 text-cyan-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            General Booking
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Not sure? We will help.
                          </p>
                        </div>
                        {selection?.id === 'general-booking' && (
                          <Check size={18} className="ml-auto text-cyan-600" />
                        )}
                      </button>
                    )}

                    {filteredOptions.doctors.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
                          Specialists
                        </p>
                        <div className="space-y-3">
                          {filteredOptions.doctors.map((doc) => (
                            <button
                              key={doc.id}
                              onClick={() => setSelection(doc)}
                              className={`w-full p-3 rounded-xl border text-left flex items-center gap-4 transition-all group ${
                                selection?.id === doc.id
                                  ? 'border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500'
                                  : 'border-slate-100 bg-white hover:border-cyan-200 hover:shadow-md'
                              }`}
                            >
                              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-200">
                                {doc.image ? (
                                  <Image
                                    src={doc.image}
                                    alt={doc.label}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <User className="m-auto text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-slate-900 text-sm">
                                  {doc.label}
                                </p>
                                <p className="text-xs text-cyan-600 font-medium mt-0.5">
                                  {doc.subLabel}
                                </p>
                              </div>
                              {selection?.id === doc.id && (
                                <Check size={18} className="text-cyan-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredOptions.services.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
                          Departments
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredOptions.services.map((svc) => (
                            <button
                              key={svc.id}
                              onClick={() => setSelection(svc)}
                              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                                selection?.id === svc.id
                                  ? 'border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500'
                                  : 'border-slate-100 bg-white hover:border-cyan-200 hover:shadow-md'
                              }`}
                            >
                              <span className="font-bold text-sm text-slate-700">
                                {svc.label}
                              </span>
                              <div className="flex justify-between items-end">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">
                                  Service
                                </span>
                                {selection?.id === svc.id && (
                                  <Check size={16} className="text-cyan-600" />
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
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-cyan-600 shadow-sm shrink-0">
                      {selection.type === 'doctor' ? (
                        <Stethoscope size={20} />
                      ) : (
                        <Calendar size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">
                        Booking Request For
                      </p>
                      <p className="font-bold text-slate-900">
                        {selection.label}
                      </p>
                      {selection.subLabel && (
                        <p className="text-xs text-slate-500">
                          {selection.subLabel}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-3 top-3.5 text-slate-400"
                        />
                        <input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Full Name"
                          className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-3 top-3.5 text-slate-400"
                        />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="0911..."
                          className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Email Address{' '}
                        <span className="text-slate-400 font-normal lowercase">
                          (optional)
                        </span>
                      </label>
                      <div className="relative">
                        <Globe
                          size={18}
                          className="absolute left-3 top-3.5 text-slate-400"
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="name@email.com"
                          className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && selection && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Check size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">
                    Request Received!
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto mb-8">
                    Thank you, <strong>{formData.name}</strong>. <br /> <br />{' '}
                    We have received your request for{' '}
                    <strong>{selection.label}</strong>. Our team will call you
                    at{' '}
                    <span className="font-mono font-bold text-slate-700">
                      {formData.phone}
                    </span>{' '}
                    shortly to confirm the time.
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            {step < 3 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !selection) ||
                    (step === 2 && (!formData.name || !formData.phone))
                  }
                  className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                >
                  {step === 1 ? 'Next Step' : 'Confirm Request'}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-center shrink-0">
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-slate-900 font-bold text-sm"
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
      division = d;
      break;
    }
  }

  if (!division) notFound();

  // Logic
  const isHealthcare = division.type === 'healthcare';
  const isEdu = division.type === 'education';
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
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900 pt-10">
      <BookingWizard
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        division={division}
      />

      {/* 1. IMMERSIVE HERO */}
      <div className="relative h-[95vh] w-full overflow-hidden flex flex-col justify-end pb-12 md:pb-24">
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
                src={division.images[currentHeroIndex]}
                alt={`${division.name} Hero ${currentHeroIndex + 1}`}
                fill
                className="object-cover"
                priority={currentHeroIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Advanced Gradient Overlay (Sits on top of the images) */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/90 via-gray-900/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900 via-transparent to-transparent z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 grid lg:grid-cols-12 gap-12 items-end">
          {/* Text Area */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                {division.type} Division
              </span>
              <span className="flex items-center gap-1 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <MapPin size={12} className="text-cyan-400" />
                {division.location}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              {division.name}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-light">
              {division.overview}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              {/* PRIMARY CTA: Only for Healthcare */}
              {isHealthcare && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-8 py-4 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-lg shadow-white/10 flex items-center gap-2 group"
                >
                  <Calendar
                    size={18}
                    className="text-cyan-600 group-hover:text-white transition-colors"
                  />
                  Book Appointment
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform ml-1"
                  />
                </button>
              )}
              {/* SECONDARY CTA: Phone (Always Visible) */}
              <a
                href={`tel:${division.contact.phone}`}
                className="px-8 py-4 bg-transparent border border-white/30 text-white text-sm font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                <Phone size={18} />
                {division.contact.phone}
              </a>
            </div>
          </motion.div>

          {/* Glass Stats Card (Desktop Only) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:block lg:col-span-4"
          >
            {division.stats && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-8">
                {division.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="border-b border-white/10 last:border-0 pb-6 last:pb-0"
                  >
                    <p className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="text-xs text-slate-400 leading-tight">
                    Metrics verified by {new Date().getFullYear()} Annual
                    Report.
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {/* 2. ABOUT US SECTION (Renamed from Mission) */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTitle subtitle="About Us">
              Who We Are <br /> & What We Do
            </SectionTitle>
            <div className="space-y-6 text-lg text-slate-600 font-light leading-relaxed">
              {division.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm font-medium text-slate-700">
                <Globe size={16} className="text-cyan-500" />
                International Standards
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm font-medium text-slate-700">
                <Award size={16} className="text-cyan-500" />
                Certified Care
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
            {/* Show the second image if available, else first */}
            <Image
              src={
                division.images[0] || division.images[1] || division.images[2]
              } // Fallback to first image if second is missing
              alt="Interior"
              fill
              className="object-cover"
            />
            {/* Visual Stats for Mobile (If desktop hidden) */}
            <div className="lg:hidden absolute inset-0 bg-black/20" />
          </div>
        </section>

        {/* 3. SERVICES GRID */}
        <section className="bg-slate-50 -mx-6 px-6 py-24 md:rounded-[3rem]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <SectionTitle subtitle="Capabilities">
                {isEdu ? 'Academic Programs' : 'Clinical Specialties'}
              </SectionTitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {division.coreServices.map((service, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                    <Check size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {service}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    World-class facilities and dedicated professionals ensuring
                    the best outcomes for {service.toLowerCase()}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. TEAM (CONDITIONAL) */}
        {!isEdu && division.doctors && (
          <section>
            <div className="flex justify-between items-end mb-12">
              <SectionTitle subtitle="Experts">
                Meet Our Specialists
              </SectionTitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {division.doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="group relative rounded-3xl overflow-hidden bg-slate-100 aspect-[3/4]"
                >
                  <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 p-6 text-white w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                      {doc.specialty}
                    </p>
                    <h4 className="text-2xl font-bold mb-3">{doc.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-300 border-t border-white/20 pt-3 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      <Clock size={12} /> {doc.availability}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CONTACT / FOOTER MICROSITE */}
        <section className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white">
          <div className="grid lg:grid-cols-2">
            <div className="p-12 md:p-24 space-y-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Visit {division.shortName}
                </h2>
                <p className="text-slate-400 text-lg">
                  We are here to assist you.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-cyan-500 mt-1" />
                  <div>
                    <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">
                      Address
                    </p>
                    <p className="text-xl">{division.contact.address}</p>
                    <a
                      href={division.contact.googleMap}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-cyan-400 text-sm font-bold hover:text-white transition-colors"
                    >
                      Open in Google Maps <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
                <div className="h-px bg-slate-800 w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${division.contact.phone}`}
                      className="text-lg font-medium hover:text-cyan-400 transition-colors"
                    >
                      {division.contact.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${division.contact.email}`}
                      className="text-lg font-medium hover:text-cyan-400 transition-colors"
                    >
                      {division.contact.email}
                    </a>
                  </div>
                </div>
              </div>
              {/* FOOTER CTA */}
              {isHealthcare && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-colors mt-8"
                >
                  Schedule Appointment
                </button>
              )}
            </div>
            {/* Map Visual / Image */}
            <div className="relative h-96 lg:h-auto bg-slate-800 group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                alt="Map"
                fill
                className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              />
              <a
                href={division.contact.googleMap}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full hover:bg-cyan-600 hover:border-cyan-600 transition-all cursor-pointer group-hover:scale-110">
                  <MapPin size={32} className="text-white" />
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Global Footer specific to division */}
      <footer className="py-8 text-center border-t border-slate-100">
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} {division.name}. Part of Liyana
          Healthcare Group.
        </p>
      </footer>
    </div>
  );
}
