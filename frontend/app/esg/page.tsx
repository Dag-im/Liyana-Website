import EsgReportsSection from '@/app/esg/EsgReportsSection';
import AnimatedStats from '@/components/client/home/AnimatedStats';
import BackendImage from '@/components/shared/BackendImage';
import { JsonLd } from '@/components/shared/JsonLd';
import RichTextViewer from '@/components/shared/RichTextViewer';
import { getFileUrl } from '@/lib/api-client';
import {
  getEsgGovernance,
  getEsgHero,
  getEsgLucsBridge,
  getEsgMetrics,
  getEsgPillars,
  getEsgReports,
  getEsgStrategy,
} from '@/lib/api/esg.api';
import { getCmsIcon } from '@/lib/icons';
import {
  breadcrumbSchema,
  organizationSchema,
} from '@/lib/seo/structured-data';
import type { Stat } from '@/types/cms.types';
import type {
  EsgGovernanceItem,
  EsgMetric,
  EsgPillar,
  EsgReport,
} from '@/types/esg.types';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liyanahealthcare.com';

export const metadata: Metadata = {
  title: 'Environmental, Social & Governance',
  description:
    "Liyana Healthcare's commitment to ESG excellence — sustainable operations, community impact, and governance transparency across Ethiopia and East Africa.",
  openGraph: {
    title: 'Environmental, Social & Governance | Liyana Healthcare',
    description:
      "Liyana Healthcare's commitment to ESG excellence across sustainable operations, community impact, and governance transparency.",
    url: `${SITE_URL}/esg`,
  },
  alternates: {
    canonical: `${SITE_URL}/esg`,
  },
};

async function safeFetch<T>(request: Promise<T>, fallback: T): Promise<T> {
  try {
    return await request;
  } catch {
    return fallback;
  }
}

function mapMetricsToStats(metrics: EsgMetric[]): Stat[] {
  return metrics
    .map((metric, index) => ({
      id: metric.id,
      label: metric.label,
      value: Number(metric.value.replace(/[^\d.-]/g, '')) || 0,
      suffix: metric.suffix,
      sortOrder: metric.sortOrder ?? index,
    }))
    .filter((metric) => Number.isFinite(metric.value));
}

function groupGovernance(items: EsgGovernanceItem[]) {
  return {
    policy: items.filter((item) => item.type === 'policy'),
    certification: items.filter((item) => item.type === 'certification'),
    risk: items.filter((item) => item.type === 'risk'),
  };
}

export default async function EsgPage() {
  const [hero, strategy, bridge, pillars, metrics, governance, reports] =
    await Promise.all([
      safeFetch(getEsgHero(), null),
      safeFetch(getEsgStrategy(), null),
      safeFetch(getEsgLucsBridge(), null),
      safeFetch<EsgPillar[]>(getEsgPillars(), []),
      safeFetch<EsgMetric[]>(getEsgMetrics(), []),
      safeFetch<EsgGovernanceItem[]>(getEsgGovernance(), []),
      safeFetch<EsgReport[]>(getEsgReports(), []),
    ]);

  const groupedGovernance = groupGovernance(governance);
  const stats = mapMetricsToStats(metrics);
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'ESG', url: `${SITE_URL}/esg` },
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
                <div className="absolute inset-0 bg-slate-900/70" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#0c4a6e_100%)]" />
            )}
            <div className="relative mx-auto max-w-7xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Environmental, Social & Governance
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                {hero.tagline}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200 md:text-lg">
                {hero.subtitle}
              </p>
            </div>
          </section>
        ) : null}

        {pillars.length ? (
          <section className="border-b border-slate-200 px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                  ESG Pillars
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Our ESG Pillars
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pillars.map((pillar) => {
                  const Icon = getCmsIcon(pillar.icon);

                  return (
                    <article
                      key={pillar.id}
                      className="border border-slate-200 bg-white p-8 shadow-sm"
                    >
                      <div className="mb-6 inline-flex border border-slate-200 bg-slate-50 p-3 text-[#0880b9]">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {pillar.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600">
                        {pillar.description}
                      </p>
                      {pillar.initiatives.length ? (
                        <ul className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                          {pillar.initiatives.map((initiative) => (
                            <li
                              key={initiative.id}
                              className="flex gap-3 text-sm text-slate-600"
                            >
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-[#0880b9]" />
                              <span>{initiative.text}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {pillar.document ? (
                        <Link
                          href={getFileUrl(pillar.document) ?? '#'}
                          target="_blank"
                          className="mt-8 inline-flex border border-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
                        >
                          Download Document
                        </Link>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {strategy ? (
          <section className="border-b border-slate-200 bg-slate-50 px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                Our Strategy
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Our ESG Strategy
              </h2>
              <RichTextViewer
                className="mt-10 prose-headings:text-slate-900 prose-a:text-[#0880b9]"
                content={strategy.content}
              />
            </div>
          </section>
        ) : null}

        {stats.length ? <AnimatedStats stats={stats} /> : null}

        {governance.length ? (
          <section className="border-b border-slate-200 px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                  Governance & Compliance
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Governance & Compliance
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { title: 'Policies', items: groupedGovernance.policy },
                  {
                    title: 'Certifications',
                    items: groupedGovernance.certification,
                  },
                  { title: 'Risk Controls', items: groupedGovernance.risk },
                ].map((group) =>
                  group.items.length ? (
                    <div
                      key={group.title}
                      className="border border-slate-200 bg-white"
                    >
                      <div className="border-b border-slate-200 px-6 py-4">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {group.title}
                        </h3>
                      </div>
                      <div className="space-y-6 p-6">
                        {group.items.map((item) => (
                          <article
                            key={item.id}
                            className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0"
                          >
                            <h4 className="text-lg font-semibold text-slate-900">
                              {item.title}
                            </h4>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                              {item.description}
                            </p>
                            {item.document ? (
                              <Link
                                href={getFileUrl(item.document) ?? '#'}
                                target="_blank"
                                className="mt-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]"
                              >
                                Download PDF
                              </Link>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </section>
        ) : null}

        {reports.length ? (
          <section className="border-b border-slate-200 bg-slate-50 px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                  Reports & Downloads
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Reports & Downloads
                </h2>
              </div>
              <EsgReportsSection reports={reports} />
            </div>
          </section>
        ) : null}

        {bridge ? (
          <section className="px-6 py-24">
            <div className="mx-auto max-w-7xl border border-cyan-200 bg-[#0880b9] px-8 py-12 text-white md:px-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                LUCS
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                {bridge.title}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-cyan-50">
                {bridge.description}
              </p>
              <Link
                href="/esg/lucs"
                className="mt-8 inline-flex border border-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#0880b9]"
              >
                {bridge.buttonText}
              </Link>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
