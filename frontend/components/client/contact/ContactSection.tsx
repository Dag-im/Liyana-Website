'use client';

import SimpleGoogleMap from '@/components/shared/maps'; // <-- import the iframe map
import { SectionHeading } from '@/components/shared/sectionHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { FAQAccordion } from './FAQAccordion';

// ---------------------- Contact Form ----------------------
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
    <motion.div
      className="rounded-2xl border border-gray-200 bg-white shadow-md p-8 flex flex-col justify-between h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">{title}</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field, idx) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
            >
              {field.type === 'textarea' ? (
                <Textarea
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="h-28 resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all"
                />
              ) : (
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all"
                />
              )}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 text-base font-semibold rounded-md bg-gradient-to-r from-cyan-400 to-cyan-700 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {status === 'submitting'
                ? 'Sending...'
                : status === 'success'
                ? 'Message Sent!'
                : buttonText}
              <Send className="w-4 h-4" />
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}

// ---------------------- Contact Section (Form + Map) ----------------------
export default function ContactSection() {
  return (
    <div className="pt-32">
      <SectionHeading
        variant="large"
        align="center"
        weight="bold"
        className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
      >
        Contact Us
      </SectionHeading>
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Form */}
        <ContactForm
          title="Get in Touch"
          description="Have a project in mind? Let’s talk. We’ll get back to you shortly."
          fields={[
            {
              id: 'name',
              placeholder: 'Your Name',
              type: 'text',
              required: true,
            },
            {
              id: 'email',
              placeholder: 'Email Address',
              type: 'email',
              required: true,
            },
            {
              id: 'message',
              placeholder: 'Message',
              type: 'textarea',
              required: true,
            },
          ]}
          buttonText="Send Message"
          onSubmit={async (data) => {
            console.log('Form Submitted:', data);
            await new Promise((r) => setTimeout(r, 1000));
          }}
        />

        {/* Right: Simple Google Maps iframe */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white h-[450px]">
          <SimpleGoogleMap width="100%" height="100%" />
        </div>
      </section>
      <FAQAccordion />
    </div>
  );
}
