'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const FAQ_DATA = {
  title: 'Frequently Asked Questions',
  description:
    'Find clear answers to the most common inquiries about our healthcare services, facilities, and patient care approach.',
  items: [
    {
      id: 'q1',
      question: 'What services does Liyana Healthcare provide?',
      answer:
        'We deliver subspecialized medical care, advanced diagnostics, and therapeutic solutions across multiple healthcare sectors, ensuring patient-centered excellence.',
    },
    {
      id: 'q2',
      question: 'Where are your facilities located?',
      answer:
        'Our headquarters is located in Addis Ababa, Ethiopia, supported by several regional branches to ensure convenient access to our healthcare services.',
    },
    {
      id: 'q3',
      question: 'Do you accept international patients?',
      answer:
        'Yes, we welcome international patients and offer full support for medical travel, from consultation coordination to post-treatment care.',
    },
  ],
};

export function FAQAccordion() {
  return (
    <section className="relative py-24 bg-transparent">
      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="bg-gradient-to-r from-gray-800 via-cyan-600 to-cyan-700 bg-clip-text text-transparent mb-4"
          >
            {FAQ_DATA.title}
          </SectionHeading>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            {FAQ_DATA.description}
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_DATA.items.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 text-base md:text-lg font-medium text-cyan-600 hover:text-cyan-800 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-cyan-950 text-sm md:text-base leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
