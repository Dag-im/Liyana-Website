import { Link } from 'react-router-dom'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { useCreateIrFinancialColumn, useCreateIrFinancialRow, useDeleteIrFinancialColumn, useDeleteIrFinancialRow, useIrFinancialRows, usePublishIrFinancialRow, useUnpublishIrFinancialRow, useUpdateIrFinancialColumn, useUpdateIrFinancialRow } from '../useIr'
import IrFinancialWorkbench from '../components/IrFinancialWorkbench'

export default function IrFinancialsPage() {
  const tableQuery = useIrFinancialRows()
  const createColumn = useCreateIrFinancialColumn()
  const updateColumn = useUpdateIrFinancialColumn()
  const deleteColumn = useDeleteIrFinancialColumn()
  const createRow = useCreateIrFinancialRow()
  const updateRow = useUpdateIrFinancialRow()
  const deleteRow = useDeleteIrFinancialRow()
  const publishRow = usePublishIrFinancialRow()
  const unpublishRow = useUnpublishIrFinancialRow()

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="IR Financial Workbench"
        text="Edit the full financial grid in draft mode and save all updates together."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'Financial Table' },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/ir-admin">Back to Overview</Link>
          </Button>
        }
      />

      <IrFinancialWorkbench
        columns={tableQuery.data?.columns ?? []}
        rows={tableQuery.data?.rows ?? []}
        isLoading={tableQuery.isLoading}
        createColumn={createColumn.mutateAsync}
        updateColumn={updateColumn.mutateAsync}
        deleteColumn={deleteColumn.mutateAsync}
        createRow={createRow.mutateAsync}
        updateRow={updateRow.mutateAsync}
        deleteRow={deleteRow.mutateAsync}
        publishRow={publishRow.mutateAsync}
        unpublishRow={unpublishRow.mutateAsync}
      />
    </div>
  )
}
