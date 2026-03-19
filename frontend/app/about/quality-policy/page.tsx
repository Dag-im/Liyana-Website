import QualityPolicy from '@/components/client/about/qualityPolicy';
import { JsonLd } from '@/components/shared/JsonLd';
import { getQualityPolicy } from '@/lib/api/cms.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { Metadata } from 'next';

export const revalidate = 86400;

const CMS_FETCH_TIMEOUT_MS = 3000;

async function withTimeout<T>(promise: Promise<T>, ms = CMS_FETCH_TIMEOUT_MS): Promise<T> {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('CMS fetch timeout')), ms);
    }),
  ]);
}

export const metadata: Metadata = {
  title: 'Quality Policy',
  description:
    "Liyana Healthcare's quality policy - our commitment to clinical excellence, patient safety, and continuous improvement across all facilities and services.",
  openGraph: {
    title: 'Quality Policy | Liyana Healthcare',
    description:
      'Our formal commitment to quality, patient safety, and continuous improvement.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/quality-policy`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about/quality-policy`,
  },
};

export default async function QualityPolicyPage() {
  let policies: { lang: string; goals: string[] }[] = [];

  try {
    const data = await withTimeout(getQualityPolicy());
    policies = data.map((policy) => ({
      lang: policy.lang,
      goals: policy.goals,
    }));
  } catch {
    policies = [];
  }

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    {
      name: 'Quality Policy',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/quality-policy`,
    },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <QualityPolicy policies={policies} />
    </>
  );
}
