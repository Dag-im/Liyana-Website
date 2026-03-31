import {
  BarChart3,
  FileText,
  HandCoins,
  LineChart,
  Mail,
  Newspaper,
  Phone,
} from 'lucide-react'

import OverviewCard from '@/components/shared/OverviewCard'
import PageHeader from '@/components/shared/PageHeader'
import { useIrDocuments, useIrInquiries, useIrKpis } from '../useIr'

export default function IrOverviewPage() {
  const kpisQuery = useIrKpis()
  const documentsQuery = useIrDocuments()
  const inquiriesQuery = useIrInquiries({ page: 1, perPage: 1, isReviewed: false })

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Investor Relations"
        text="Use dedicated pages for each IR workflow instead of the previous tab-heavy control surface."
      />

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <OverviewCard
          title="Hero"
          description="Maintain the IR headline, subtitle, and publish state."
          icon={Newspaper}
          meta="Singleton content page"
          to="/ir-admin/hero"
        />
        <OverviewCard
          title="KPIs"
          description="Manage investor KPI cards with dedicated create and edit pages."
          icon={BarChart3}
          meta={`${kpisQuery.data?.length ?? 0} KPI cards`}
          to="/ir-admin/kpis"
        />
        <OverviewCard
          title="Strategy"
          description="Edit the rich-text investor strategy section."
          icon={HandCoins}
          meta="Rich text content"
          to="/ir-admin/strategy"
        />
        <OverviewCard
          title="Financial Table"
          description="Manage financial metrics and periods in a simpler table editor."
          icon={LineChart}
          meta="Inline table editor"
          to="/ir-admin/financials"
        />
        <OverviewCard
          title="Documents"
          description="Upload and manage investor reports, filings, and presentations."
          icon={FileText}
          meta={`${documentsQuery.data?.length ?? 0} documents`}
          to="/ir-admin/documents"
        />
        <OverviewCard
          title="Contact"
          description="Update the public investor relations contact block."
          icon={Phone}
          meta="Singleton contact section"
          to="/ir-admin/contact"
        />
        <OverviewCard
          title="Inquiries"
          description="Review inbound investor messages and clear the unread queue."
          icon={Mail}
          meta={`${inquiriesQuery.data?.total ?? 0} unread inquiries`}
          to="/ir-admin/inquiries"
        />
      </div>
    </div>
  )
}
