import ServiceDetailPageClient from '@/app/services/[slug]/ServiceDetailPageClient';
import { getDivisions } from '@/lib/api/services.api';

type PageProps = {
  params: Promise<{ slug: string }>;
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

export default function ServiceDetailPage(props: PageProps) {
  return <ServiceDetailPageClient {...props} />;
}
