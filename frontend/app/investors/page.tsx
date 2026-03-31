import InvestorsInteractiveSections from '@/app/investors/InvestorsInteractiveSections';
import { JsonLd } from '@/components/shared/JsonLd';
import RichTextViewer from '@/components/shared/RichTextViewer';
import {
  getIrContact,
  getIrDocuments,
  getIrFinancialTable,
  getIrHero,
  getIrKpis,
  getIrStrategy,
} from '@/lib/api/ir.api';
import { getCmsIcon } from '@/lib/icons';
import {
  breadcrumbSchema,
  organizationSchema,
} from '@/lib/seo/structured-data';
import type {
  IrContact,
  IrDocument,
  IrFinancialColumn,
  IrFinancialRow,
  IrHero,
  IrKpi,
  IrStrategy,
} from '@/types/ir.types';
import type { Metadata } from 'next';

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liyanahealthcare.com';

export const metadata: Metadata = {
  title: 'Investor Relations',
  description:
    "Investment information, financial performance, and strategic outlook for Liyana Healthcare — Ethiopia's leading vertically integrated healthcare group.",
  openGraph: {
    title: 'Investor Relations | Liyana Healthcare',
    description:
      'Investment information, financial performance, and strategic outlook for Liyana Healthcare.',
    url: `${SITE_URL}/investors`,
  },
  alternates: {
    canonical: `${SITE_URL}/investors`,
  },
};

async function safeFetch<T>(request: Promise<T>, fallback: T): Promise<T> {
  try {
    return await request;
  } catch {
    return fallback;
  }
}

export default async function InvestorsPage() {
  const [
    hero,
    strategy,
    contact,
    kpis,
    financialTable,
    documents,
  ] = await Promise.all([
    safeFetch<IrHero | null>(getIrHero(), null),
    safeFetch<IrStrategy | null>(getIrStrategy(), null),
    safeFetch<IrContact | null>(getIrContact(), null),
    safeFetch<IrKpi[]>(getIrKpis(), []),
    safeFetch<{ columns: IrFinancialColumn[]; rows: IrFinancialRow[] }>(
      getIrFinancialTable(),
      { columns: [], rows: [] }
    ),
    safeFetch<IrDocument[]>(getIrDocuments(), []),
  ]);

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Investor Relations', url: `${SITE_URL}/investors` },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />

      <main className="bg-white pb-24">
        {hero ? (
          <section className="border-b border-slate-200 bg-slate-900 px-6 py-24 text-white">
            <div className="mx-auto max-w-7xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Investor Relations
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                {hero.tagline}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200 md:text-lg">
                {hero.subtitle}
              </p>

              {kpis.length ? (
                <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {kpis.slice(0, 6).map((kpi) => {
                    const Icon = getCmsIcon(kpi.icon);

                    return (
                      <article
                        key={kpi.id}
                        className="border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                            KPI
                          </p>
                          <Icon size={18} className="text-cyan-300" />
                        </div>
                        <p className="text-3xl font-semibold tracking-tight text-cyan-300">
                          {kpi.value}
                          {kpi.suffix ?? ''}
                        </p>
                        <p className="mt-3 text-sm text-slate-200">
                          {kpi.label}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {strategy ? (
          <section className="border-b border-slate-200 bg-white px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                Investment Strategy
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Investment Strategy
              </h2>
              <RichTextViewer
                className="mt-10 prose-headings:text-slate-900 prose-a:text-[#0880b9]"
                content={strategy.content}
              />
            </div>
          </section>
        ) : null}

        <InvestorsInteractiveSections
          contact={contact}
          financialTable={financialTable}
          documents={documents}
        />
      </main>
    </>
  );
}
