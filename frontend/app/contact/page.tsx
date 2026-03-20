import ContactSection from '@/components/client/contact/ContactSection';
import { JsonLd } from '@/components/shared/JsonLd';
import { submitContact } from '@/lib/api/contact.api';
import { getFaqCategories, getFaqs } from '@/lib/api/faqs.api';
import {
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
} from '@/lib/seo/structured-data';
import type { Faq } from '@/types/faq.types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Liyana Healthcare — reach our corporate communications team for inquiries about our services, facilities, partnerships, or patient care across Ethiopia and East Africa.',
  openGraph: {
    title: 'Contact Us | Liyana Healthcare',
    description: 'Reach our corporate communications team for any inquiries.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
  },
};

export default async function ContactPage() {
  let faqGroups: { category: string; faqs: { question: string; answer: string }[] }[]
    = [];
  let allFaqs: Faq[] = [];

  try {
    const [faqs, categories] = await Promise.all([
      getFaqs({ perPage: 100 }),
      getFaqCategories(),
    ]);

    allFaqs = faqs.data;

    faqGroups = categories
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        category: category.name,
        faqs: faqs.data
          .filter((faq) => faq.categoryId === category.id)
          .sort((a, b) => a.position - b.position)
          .map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
      }))
      .filter((group) => group.faqs.length > 0);
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    { name: 'Contact', url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact` },
  ]);

  const faqSchema =
    allFaqs.length > 0
      ? faqPageSchema(
          allFaqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          }))
        )
      : null;

  async function handleContactSubmit(data: {
    name: string;
    email: string;
    message: string;
  }) {
    'use server';
    await submitContact(data);
  }

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumb,
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />
      <ContactSection
        faqGroups={faqGroups}
        onSubmit={handleContactSubmit}
      />
    </>
  );
}
