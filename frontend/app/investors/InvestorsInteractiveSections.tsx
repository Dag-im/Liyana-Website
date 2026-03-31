'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getFileUrl } from '@/lib/api-client';
import { submitIrInquiry } from '@/lib/api/ir.api';
import type {
  IrContact,
  IrDocument,
  IrFinancialColumn,
  IrFinancialRow,
} from '@/types/ir.types';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

type InvestorsInteractiveSectionsProps = {
  contact: IrContact | null;
  financialTable: {
    columns: IrFinancialColumn[];
    rows: IrFinancialRow[];
  };
  documents: IrDocument[];
};

const PERIOD_FILTERS = [
  { label: 'Annual', value: 'annual' },
  { label: 'Quarterly', value: 'quarterly' },
] as const;

const DOCUMENT_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Reports', value: 'report' },
  { label: 'Presentations', value: 'presentation' },
  { label: 'Filings', value: 'filing' },
  { label: 'Other', value: 'other' },
] as const;

export default function InvestorsInteractiveSections({
  contact,
  financialTable,
  documents,
}: InvestorsInteractiveSectionsProps) {
  const [periodType, setPeriodType] =
    useState<(typeof PERIOD_FILTERS)[number]['value']>('annual');
  const [documentFilter, setDocumentFilter] =
    useState<(typeof DOCUMENT_FILTERS)[number]['value']>('all');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredRows = useMemo(
    () => financialTable.rows.filter((row) => row.periodType === periodType),
    [financialTable.rows, periodType]
  );

  const filteredDocuments = useMemo(() => {
    if (documentFilter === 'all') {
      return documents;
    }

    return documents.filter((document) => document.category === documentFilter);
  }, [documentFilter, documents]);

  const exportCsv = () => {
    const headers = [
      'Period',
      ...financialTable.columns.map((column) => column.label),
    ];
    const rows = filteredRows.map((row) => [
      row.period,
      ...financialTable.columns.map(
        (column) =>
          row.cells.find((cell) => cell.columnId === column.id)?.value ?? ''
      ),
    ]);

    const csv = [headers, ...rows]
      .map((line) =>
        line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `liyana-investor-${periodType}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printTable = () => {
    const markup = tableRef.current?.innerHTML;
    if (!markup) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Financial Performance</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
            th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Financial Performance</h1>
          ${markup}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  async function handleInquirySubmit(formData: FormData) {
    setStatus('submitting');
    setError(null);

    try {
      await submitIrInquiry({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        message: String(formData.get('message') ?? ''),
      });
      setStatus('success');
    } catch (submitError) {
      setStatus('idle');
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to send your inquiry right now.'
      );
    }
  }

  return (
    <>
      {financialTable.columns.length && financialTable.rows.length ? (
        <section className="border-t border-slate-200 bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                  Financial Performance
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Financial Overview
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Review our published reporting periods and export the current
                  view as CSV or PDF.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex border border-slate-200">
                  {PERIOD_FILTERS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setPeriodType(item.value)}
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        periodType === item.value
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 hover:text-[#0880b9]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 border-slate-200 uppercase tracking-[0.18em]"
                  onClick={printTable}
                >
                  Export PDF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 border-slate-200 uppercase tracking-[0.18em]"
                  onClick={exportCsv}
                >
                  Export CSV
                </Button>
              </div>
            </div>

            <div
              ref={tableRef}
              className="overflow-x-auto border border-slate-200 bg-white"
            >
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Period
                    </th>
                    {financialTable.columns.map((column) => (
                      <th
                        key={column.id}
                        className="border-b border-slate-200 px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-200 last:border-b-0"
                    >
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {row.period}
                      </td>
                      {financialTable.columns.map((column) => (
                        <td
                          key={column.id}
                          className="px-4 py-4 text-slate-600"
                        >
                          {row.cells.find((cell) => cell.columnId === column.id)
                            ?.value ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {documents.length ? (
        <section className="border-t border-slate-200 bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                Investor Resources
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Documents
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {DOCUMENT_FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setDocumentFilter(item.value)}
                  className={`border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    documentFilter === item.value
                      ? 'border-[#0880b9] bg-[#0880b9] text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-[#0880b9] hover:text-[#0880b9]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="grid gap-4">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col gap-4 border border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                      {document.year}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {document.title}
                    </h3>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {document.category}
                    </p>
                  </div>
                  <Link
                    href={getFileUrl(document.filePath) ?? '#'}
                    target="_blank"
                    download
                    className="inline-flex border border-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
                  >
                    Download
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {contact ? (
        <section className="border-t border-slate-200 bg-white px-6 py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                  Investor Relations
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Contact Investor Relations
                </h2>
              </div>

              <div className="space-y-5 border border-slate-200 bg-slate-50 p-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-2 block text-lg font-semibold text-slate-900"
                  >
                    {contact.email}
                  </a>
                </div>
                {contact.phone ? (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Phone
                    </p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="mt-2 block text-lg font-semibold text-slate-900"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ) : null}
                {contact.address ? (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Address
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-slate-700">
                      {contact.address}
                    </p>
                  </div>
                ) : null}
                {contact.description ? (
                  <p className="border-t border-slate-200 pt-5 text-sm leading-relaxed text-slate-600">
                    {contact.description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="border border-slate-200 bg-white p-8 shadow-sm">
              {status === 'success' ? (
                <div className="space-y-3 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0880b9]">
                    Inquiry Received
                  </p>
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Thank you for your message
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Our investor relations team will review your inquiry and
                    respond shortly.
                  </p>
                </div>
              ) : (
                <form action={handleInquirySubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                      htmlFor="ir-name"
                    >
                      Name
                    </label>
                    <Input
                      id="ir-name"
                      name="name"
                      required
                      className="h-12 border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                      htmlFor="ir-email"
                    >
                      Email
                    </label>
                    <Input
                      id="ir-email"
                      name="email"
                      type="email"
                      required
                      className="h-12 border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                      htmlFor="ir-message"
                    >
                      Message
                    </label>
                    <Textarea
                      id="ir-message"
                      name="message"
                      required
                      className="min-h-36 border-slate-200 bg-slate-50"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="h-12 w-full bg-[#0880b9] text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#01649c]"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
                  </Button>
                  {error ? (
                    <p className="text-sm font-medium text-red-600">{error}</p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
