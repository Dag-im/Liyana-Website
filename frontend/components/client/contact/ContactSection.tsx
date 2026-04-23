'use client';

import SimpleGoogleMap from '@/components/shared/maps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Globe, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { FAQAccordion } from './FAQAccordion';

// ---------------------- Contact Form Component ----------------------
function ContactForm({
  title,
  description,
  fields,
  buttonText,
  onSubmit,
}: {
  title: string;
  description: string;
  fields: {
    id: string;
    label: string;
    placeholder: string;
    type: string;
    required?: boolean;
  }[];
  buttonText: string;
  onSubmit?: (data: Record<string, string>) => Promise<void> | void;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      setError(null);
      await onSubmit?.(formData);
      setSuccess(true);
      setFormData({});
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="bg-white border border-slate-200  shadow-sm overflow-hidden flex flex-col h-full relative">
      {/* Brand Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d62839] via-[#7f3aaf] to-[#33bde9]" />

      <div className="p-8 md:p-10 flex-1 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
            {title}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {success ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-slate-900 mb-2">
              Thank you for your message
            </p>
            <p className="text-slate-500 text-sm">
              Our team will be in touch shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex-1 flex flex-col"
          >
            <div className="space-y-5 flex-1">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label
                    htmlFor={field.id}
                    className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest"
                  >
                    {field.label}{' '}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="h-32 resize-none rounded-lg bg-slate-50 border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0880b9] focus:ring-1 focus:ring-[#0880b9] transition-colors shadow-none"
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="h-12 rounded-lg bg-slate-50 border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0880b9] focus:ring-1 focus:ring-[#0880b9] transition-colors shadow-none"
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full h-12 mt-6 text-sm font-semibold rounded-xs bg-[#0880b9] hover:bg-[#01649c] text-white shadow-none transition-colors flex items-center justify-center gap-2 group"
            >
              {status === 'submitting' ? 'Transmitting...' : buttonText}
              {status === 'idle' && (
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>

            {error && (
              <p className="text-sm text-red-600 mt-3 font-medium">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

// ---------------------- Main Contact Section ----------------------
interface ContactSectionProps {
  onSubmit?: (data: {
    name: string;
    email: string;
    message: string;
  }) => Promise<void>;
  faqGroups?: FAQGroup[];
}

interface FAQGroup {
  category: string;
  faqs: { question: string; answer: string }[];
}

const DEFAULT_FAQ_GROUPS: FAQGroup[] = [
  {
    category: 'General',
    faqs: [
      {
        question: 'What services does Liyana Healthcare provide?',
        answer:
          'We deliver subspecialized medical care, advanced diagnostics, and therapeutic solutions across multiple healthcare sectors.',
      },
      {
        question: 'Where are your facilities located?',
        answer:
          'Our headquarters is centrally located in Addis Ababa, Ethiopia, supported by a network of regional branches.',
      },
      {
        question: 'Do you accept international patients?',
        answer:
          'Yes. We operate a dedicated international patient desk with full end-to-end support for medical travel.',
      },
    ],
  },
];

export default function ContactSection({
  onSubmit,
  faqGroups = DEFAULT_FAQ_GROUPS,
}: ContactSectionProps) {
  return (
    <div className="pb-12 bg-white selection:bg-[#cceffa] selection:text-[#014f7a]">
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <span className="block text-[#0880b9] font-semibold text-[11px] uppercase tracking-[0.18em] mb-3">
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Contact Liyana Healthcare
          </h1>
          <div className="h-[2px] w-10 bg-[#0880b9] mt-5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Form (Takes up 5 columns on large screens) */}
          <div className="lg:col-span-5 h-full">
            <ContactForm
              title="Send an Inquiry"
              description="Please fill out the form below. Our corporate communications team will direct your inquiry to the appropriate department."
              fields={[
                {
                  id: 'name',
                  label: 'Full Name',
                  placeholder: 'e.g. Jane Doe',
                  type: 'text',
                  required: true,
                },
                {
                  id: 'email',
                  label: 'Email Address',
                  placeholder: 'jane.doe@company.com',
                  type: 'email',
                  required: true,
                },
                {
                  id: 'message',
                  label: 'Message',
                  placeholder: 'How can we assist you today?',
                  type: 'textarea',
                  required: true,
                },
              ]}
              buttonText="Submit Inquiry"
              onSubmit={async (data) => {
                if (onSubmit) {
                  await onSubmit({
                    name: data.name ?? '',
                    email: data.email ?? '',
                    message: data.message ?? '',
                  });
                }
              }}
            />
          </div>

          {/* Right: Map & Info (Takes up 7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-8 h-full">
            {/* Map Container */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 h-[300px] md:h-[400px] w-full relative group">
              <SimpleGoogleMap width="100%" height="100%" />
            </div>

            {/* Corporate Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-200">
              {/* HQ Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="text-[#0880b9]" size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">
                    Headquarters
                  </p>
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              {/* Direct Lines */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="text-[#0880b9]" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">
                      General Inquiries
                    </p>
                    <a
                      href="tel:+251937557878"
                      className="text-sm font-medium text-slate-900 hover:text-[#0880b9] transition-colors"
                    >
                      +251 937 55 78 78
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Globe className="text-[#0880b9]" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">
                      Email Support
                    </p>
                    <a
                      href="mailto:info@liyanahealthcare.com"
                      className="text-sm font-medium text-slate-900 hover:text-[#0880b9] transition-colors"
                    >
                      info@liyanahealthcare.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrate FAQ at the bottom */}
      <FAQAccordion groups={faqGroups} />
    </div>
  );
}
