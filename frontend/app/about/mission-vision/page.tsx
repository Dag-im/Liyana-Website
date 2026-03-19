import MissionVisionValuesSection from '@/components/client/about/MissionVisionValuesSection';
import { JsonLd } from '@/components/shared/JsonLd';
import { getCoreValues, getMissionVision } from '@/lib/api/cms.api';
import { organizationSchema } from '@/lib/seo/structured-data';
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
  title: 'Mission, Vision & Values',
  description:
    'Discover the mission, vision, and core values that drive Liyana Healthcare - our commitment to clinical excellence, innovation, and compassionate care across Ethiopia and East Africa.',
  openGraph: {
    title: 'Mission, Vision & Values | Liyana Healthcare',
    description:
      'Our mission, vision, and the core values that define every aspect of Liyana Healthcare.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/mission-vision`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about/mission-vision`,
  },
};

export default async function MissionVisionPage() {
  let mv = {
    missionTitle: 'Our Mission',
    missionDescription:
      'To empower businesses and individuals through innovative solutions, exceptional service, and unwavering commitment to excellence.',
    missionIcon: 'Target',
    visionTitle: 'Our Vision',
    visionDescription:
      'To be the leading force in our industry, recognized for innovation, integrity, and impact.',
    visionIcon: 'Eye',
    updatedAt: new Date().toISOString(),
  };

  let values: { title: string; description: string; icon: string }[] = [];

  try {
    mv = await withTimeout(getMissionVision());
  } catch {}

  try {
    const coreValues = await withTimeout(getCoreValues());
    values = coreValues.map((value) => ({
      title: value.title,
      description: value.description,
      icon: value.icon,
    }));
  } catch {}

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <MissionVisionValuesSection
        missionTitle={mv.missionTitle}
        missionDescription={mv.missionDescription}
        missionIcon={mv.missionIcon}
        visionTitle={mv.visionTitle}
        visionDescription={mv.visionDescription}
        visionIcon={mv.visionIcon}
        coreValues={values}
      />
    </>
  );
}
