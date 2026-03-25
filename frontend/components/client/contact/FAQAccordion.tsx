'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const FAQ_DATA = {
  title: 'Frequently Asked Questions',
  subtitle: 'Knowledge Base',
  description:
    'Find clear answers to the most common inquiries regarding our healthcare services, operational facilities, and patient care approach.',
};

interface FAQGroup {
  category: string;
  faqs: { question: string; answer: string }[];
}

interface FAQAccordionProps {
  groups?: FAQGroup[];
}

const DEFAULT_FAQ_GROUPS: FAQGroup[] = [
  {
    category: 'General',
    faqs: [
      {
        question: 'What services does Liyana Healthcare provide?',
        answer:
          'We deliver subspecialized medical care, advanced diagnostics, and therapeutic solutions across multiple healthcare sectors, ensuring patient-centered excellence backed by international standards.',
      },
      {
        question: 'Where are your facilities located?',
        answer:
          'Our headquarters is centrally located in Addis Ababa, Ethiopia. This hub is supported by a network of regional branches strategically placed to ensure comprehensive and convenient access to our services.',
      },
      {
        question: 'Do you accept international patients?',
        answer:
          'Yes. We operate a dedicated international patient desk that offers full end-to-end support for medical travel, including consultation coordination, translation services, and post-treatment continuity of care.',
      },
    ],
  },
];

export function FAQAccordion({ groups = DEFAULT_FAQ_GROUPS }: FAQAccordionProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="block text-[#0880b9] font-semibold text-[11px] uppercase tracking-[0.18em] mb-3">
            {FAQ_DATA.subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            {FAQ_DATA.title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {FAQ_DATA.description}
          </p>
        </motion.div>

        {/* Structured FAQ Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm"
        >
          <Accordion type="single" collapsible className="space-y-0">
            {groups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#0880b9] mb-4">
                  {group.category}
                </h3>
                {group.faqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={`${groupIndex}-${faqIndex}`}
                    value={`item-${groupIndex}-${faqIndex}`}
                    className={`border-slate-200 border-b ${
                      faqIndex === group.faqs.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <AccordionTrigger className="py-6 text-left text-base font-semibold text-slate-900 hover:text-[#0880b9] transition-colors no-underline hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-slate-500 text-sm leading-relaxed pr-12">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
