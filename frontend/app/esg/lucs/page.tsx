import LucsInquiryForm from '@/app/esg/lucs/LucsInquiryForm';
import BackendImage from '@/components/shared/BackendImage';
import { JsonLd } from '@/components/shared/JsonLd';
import RichTextViewer from '@/components/shared/RichTextViewer';
import {
  getLucsCta,
  getLucsHero,
  getLucsMission,
  getLucsPillarIntro,
  getLucsPillars,
  getLucsWhoWeAre,
} from '@/lib/api/lucs.api';
import { getCmsIcon } from '@/lib/icons';
import {
  breadcrumbSchema,
  organizationSchema,
} from '@/lib/seo/structured-data';
import type { LucsPillar } from '@/types/lucs.types';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liyanahealthcare.com';

export const metadata: Metadata = {
  title: 'LUCS — Liyana Universal Community Service',
  description:
    'Liyana Universal Community Service advances healthcare access, partnerships, and community wellbeing through targeted social impact programs.',
  openGraph: {
    title: 'LUCS | Liyana Healthcare',
    description:
      'Liyana Universal Community Service advances healthcare access and community wellbeing through targeted social impact programs.',
    url: `${SITE_URL}/esg/lucs`,
  },
  alternates: {
    canonical: `${SITE_URL}/esg/lucs`,
  },
};

async function safeFetch<T>(request: Promise<T>, fallback: T): Promise<T> {
  try {
    return await request;
  } catch {
    return fallback;
  }
}

export default async function LucsPage() {
  const [hero, whoWeAre, mission, pillarIntro, pillars, cta] =
    await Promise.all([
      safeFetch(getLucsHero(), null),
      safeFetch(getLucsWhoWeAre(), null),
      safeFetch(getLucsMission(), null),
      safeFetch(getLucsPillarIntro(), null),
      safeFetch<LucsPillar[]>(getLucsPillars(), []),
      safeFetch(getLucsCta(), null),
    ]);

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'ESG', url: `${SITE_URL}/esg` },
    { name: 'LUCS', url: `${SITE_URL}/esg/lucs` },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />

      <main className="bg-white">
        {hero ? (
          <section className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-900 px-6 py-32 text-white">
            {hero.backgroundImage ? (
              <div className="absolute inset-0">
                <BackendImage
                  src={hero.backgroundImage}
                  alt={hero.tagline}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/72" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#0c4a6e_100%)]" />
            )}
            <div className="relative mx-auto max-w-7xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                {hero.tagline}
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                Liyana Universal Community Service
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200 md:text-lg">
                {hero.subtitle}
              </p>
            </div>
          </section>
        ) : null}

        {whoWeAre ? (
          <section className="border-b border-slate-200 bg-white px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                Who We Are
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Who We Are
              </h2>
              <RichTextViewer
                className="mt-10 prose-headings:text-slate-900 prose-a:text-[#0880b9]"
                content={whoWeAre.content}
              />
            </div>
          </section>
        ) : null}

        {mission ? (
          <section className="border-b border-slate-200 bg-slate-50 px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                  Mission & Vision
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Mission & Vision
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {[
                  {
                    title: mission.missionTitle,
                    description: mission.missionDescription,
                    icon: mission.missionIcon,
                  },
                  {
                    title: mission.visionTitle,
                    description: mission.visionDescription,
                    icon: mission.visionIcon,
                  },
                ].map((item) => {
                  const Icon = getCmsIcon(item.icon);

                  return (
                    <article
                      key={item.title}
                      className="border border-slate-200 bg-white p-8 shadow-sm"
                    >
                      <div className="mb-6 inline-flex border border-cyan-100 bg-cyan-50 p-3 text-[#0880b9]">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-base leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {pillarIntro || pillars.length ? (
          <section className="border-b border-slate-200 bg-white px-6 py-24">
            <div className="mx-auto max-w-7xl">
              {pillarIntro ? (
                <div className="mb-12 max-w-3xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                    What We Do
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                    {pillarIntro.title}
                  </h2>
                  {pillarIntro.description ? (
                    <p className="mt-5 text-base leading-relaxed text-slate-600">
                      {pillarIntro.description}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {pillars.length ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {pillars.map((pillar) => {
                    const Icon = getCmsIcon(pillar.icon);

                    return (
                      <article
                        key={pillar.id}
                        className="border border-slate-200 bg-slate-50 p-8 shadow-sm"
                      >
                        <div className="mb-6 inline-flex border border-slate-200 bg-white p-3 text-[#0880b9]">
                          <Icon size={24} />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                          {pillar.title}
                        </h3>
                        {pillar.description ? (
                          <p className="mt-4 text-sm leading-relaxed text-slate-600">
                            {pillar.description}
                          </p>
                        ) : null}
                        {pillar.bulletPoints.length ? (
                          <ul className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                            {pillar.bulletPoints.map((point) => (
                              <li key={point.id} className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#0880b9]" />
                                <div>
                                  <p className="text-sm font-medium text-slate-900">
                                    {point.point}
                                  </p>
                                  {point.description ? (
                                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                      {point.description}
                                    </p>
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {cta ? (
          <section className="border-b border-slate-200 bg-[#0880b9] px-6 py-24 text-white">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Call To Action
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                {cta.title}
              </h2>
              {cta.description ? (
                <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-cyan-50">
                  {cta.description}
                </p>
              ) : null}
              <Link
                href={
                  cta.ctaType === 'phone'
                    ? `tel:${cta.ctaValue}`
                    : cta.ctaType === 'email'
                      ? `mailto:${cta.ctaValue}`
                      : cta.ctaValue
                }
                target={cta.ctaType === 'url' ? '_blank' : undefined}
                className="mt-8 inline-flex border border-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#0880b9]"
              >
                {cta.ctaLabel}
              </Link>
            </div>
          </section>
        ) : null}

        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                Get In Touch
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Get In Touch
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Connect with the LUCS team about partnerships, outreach, and
                community impact initiatives.
              </p>
            </div>
            <LucsInquiryForm />
          </div>
        </section>
      </main>
    </>
  );
}
