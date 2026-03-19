import ServiceGrid from '@/components/client/services/ServiceGrid';
import { JsonLd } from '@/components/shared/JsonLd';
import { getServiceCategories } from '@/lib/api/services.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { ServiceCategory } from '@/types/services.types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    "Explore Liyana Healthcare's full range of medical services and specialized divisions - from advanced diagnostics and surgical care to education and research across Ethiopia and East Africa.",
  openGraph: {
    title: 'Our Services | Liyana Healthcare',
    description:
      'Subspecialized medical services and healthcare divisions across Ethiopia and East Africa.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
  },
};

export default async function ServicesPage() {
  let categories: ServiceCategory[] = [];

  try {
    categories = await getServiceCategories();
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    { name: 'Services', url: `${process.env.NEXT_PUBLIC_SITE_URL}/services` },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <ServiceGrid categories={categories} />
    </>
  );
}
