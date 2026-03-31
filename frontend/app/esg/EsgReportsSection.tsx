'use client'

import { getFileUrl } from '@/lib/api-client'
import type { EsgReport } from '@/types/esg.types'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Annual', value: 'annual' },
  { label: 'ESG', value: 'esg' },
  { label: 'Sustainability', value: 'sustainability' },
] as const

export default function EsgReportsSection({ reports }: { reports: EsgReport[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['value']>('all')

  const filteredReports = useMemo(() => {
    if (filter === 'all') {
      return reports
    }

    return reports.filter((report) => report.type === filter)
  }, [filter, reports])

  if (!reports.length) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              filter === item.value
                ? 'border-[#0880b9] bg-[#0880b9] text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-[#0880b9] hover:text-[#0880b9]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredReports.map((report) => (
          <article
            key={report.id}
            className="border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                  {report.year}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                  {report.title}
                </h3>
              </div>
              <span className="border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {report.type}
              </span>
            </div>

            <Link
              href={getFileUrl(report.filePath) ?? '#'}
              target="_blank"
              className="inline-flex border border-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
            >
              Download Report
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
