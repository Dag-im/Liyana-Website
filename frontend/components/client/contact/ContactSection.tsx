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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    'idle'
  );

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await onSubmit?.(formData);
      setStatus('success');
      setFormData({});
      (e.target as HTMLFormElement).reset();
    } finally {
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-white border border-slate-200  shadow-sm overflow-hidden flex flex-col h-full relative">
      {/* Brand Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d62839] via-[#7f3aaf] to-cyan-500" />

      <div className="p-8 md:p-10 flex-1 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
            {title}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {description}
          </p>
        </div>

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
                    className="h-32 resize-none rounded-lg bg-slate-50 border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-colors shadow-none"
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="h-12 rounded-lg bg-slate-50 border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-colors shadow-none"
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full h-12 mt-6 text-sm font-semibold rounded-xs bg-cyan-600 hover:bg-cyan-700 text-white shadow-none transition-colors flex items-center justify-center gap-2 group"
          >
            {status === 'submitting'
              ? 'Transmitting...'
              : status === 'success'
                ? 'Message Received'
                : buttonText}
            {status === 'idle' && (
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ---------------------- Main Contact Section ----------------------
export default function ContactSection() {
  return (
    <div className="pb-12 bg-white selection:bg-cyan-100 selection:text-cyan-900">
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <span className="block text-cyan-600 font-semibold text-[11px] uppercase tracking-[0.18em] mb-3">
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Contact Liyana Healthcare
          </h1>
          <div className="h-[2px] w-10 bg-cyan-600 mt-5 rounded-full" />
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
                console.log('Form Submitted:', data);
                await new Promise((r) => setTimeout(r, 1000));
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
                  <MapPin className="text-cyan-600" size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">
                    Headquarters
                  </p>
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                    Addis Ababa, Ethiopia
                    <br />
                    Global Corporate Center
                  </p>
                </div>
              </div>

              {/* Direct Lines */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="text-cyan-600" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">
                      General Inquiries
                    </p>
                    <a
                      href="tel:+251911000000"
                      className="text-sm font-medium text-slate-900 hover:text-cyan-600 transition-colors"
                    >
                      +251 911 000 000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Globe className="text-cyan-600" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">
                      Email Support
                    </p>
                    <a
                      href="mailto:contact@liyanahc.com"
                      className="text-sm font-medium text-slate-900 hover:text-cyan-600 transition-colors"
                    >
                      contact@liyanahc.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrate FAQ at the bottom */}
      <FAQAccordion />
    </div>
  );
}
