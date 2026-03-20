import MeetTheTeam from '@/components/client/about/MeetTheTeam';
import { JsonLd } from '@/components/shared/JsonLd';
import { getTeamMembers } from '@/lib/api/team.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { TeamMember } from '@/types/team.types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Leadership Team',
  description:
    "Meet the executive leadership and division heads driving Liyana Healthcare's mission of clinical excellence and innovation across Ethiopia and East Africa.",
  openGraph: {
    title: 'Leadership Team | Liyana Healthcare',
    description:
      'The executive team and division leaders behind Liyana Healthcare.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/leadership`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about/leadership`,
  },
};

export default async function LeadershipPage() {
  let members: TeamMember[] = [];

  try {
    const res = await getTeamMembers({ perPage: 100 });
    members = res.data;
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    {
      name: 'Leadership',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/leadership`,
    },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <MeetTheTeam members={members} />
    </>
  );
}
