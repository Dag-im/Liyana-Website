import ServiceDetailPageClient from '@/app/services/[slug]/ServiceDetailPageClient';
import { JsonLd } from '@/components/shared/JsonLd';
import { getFileUrl } from '@/lib/api-client';
import { getDivisionBySlug, getDivisions } from '@/lib/api/services.api';
import { breadcrumbSchema, divisionSchema } from '@/lib/seo/structured-data';
import type { Division } from '@/types/services.types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ClientDivision = Omit<Division, 'contact'> & {
  contact: NonNullable<Division['contact']>;
  type: string;
};

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const divisions = await getDivisions({ isActive: true });
    return divisions.map((division) => ({ slug: division.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const division = await getDivisionBySlug(slug);
    if (!division) {
      return {};
    }

    return {
      title: division.name,
      description: division.overview,
      openGraph: {
        title: `${division.name} | Liyana Healthcare`,
        description: division.overview,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${division.slug}`,
        images: division.logo
          ? [{ url: getFileUrl(division.logo) ?? division.logo, alt: division.name }]
          : undefined,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${division.slug}`,
      },
    };
  } catch {
    return {};
  }
}

function toClientDivision(division: Division): ClientDivision {
  const divisionTypeName =
    division.divisionCategory?.label ||
    division.divisionCategory?.name ||
    division.divisionCategoryId;

  return {
    ...division,
    contact: division.contact ?? {
      id: `${division.id}-contact`,
      phone: null,
      email: null,
      address: null,
      googleMap: null,
    },
    type: divisionTypeName,
  };
}

export default async function DivisionDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let division: Division | null = null;
  try {
    division = await getDivisionBySlug(slug);
  } catch {}

  if (!division) {
    notFound();
  }

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    { name: 'Services', url: `${process.env.NEXT_PUBLIC_SITE_URL}/services` },
    {
      name: division.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${division.slug}`,
    },
  ]);

  const clinic = divisionSchema({
    name: division.name,
    slug: division.slug,
    overview: division.overview,
    location: division.location,
  });

  return (
    <>
      <JsonLd data={[clinic, breadcrumb]} />
      <ServiceDetailPageClient division={toClientDivision(division)} />
    </>
  );
}
