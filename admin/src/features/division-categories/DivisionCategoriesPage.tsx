import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import type { DivisionCategory } from '@/types/services.types'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { handleMutationError } from '@/lib/error-utils'
import { Link } from 'react-router-dom'
import { useDeleteDivisionCategory, useDivisionCategories } from './useDivisionCategories'

export default function DivisionCategoriesPage() {
  const { data: categories, isLoading } = useDivisionCategories()
  const deleteMutation = useDeleteDivisionCategory()

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Division Categories" text="Manage major categories of medical and administrative divisions.">
        <Button asChild>
          <Link state={{ from: '/division-categories' }} to="/division-categories/new">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
          </Link>
        </Button>
      </PageHeader>

      <DataTable
        data={categories || []}
        loading={isLoading}
        columns={[
          {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ row }: { row: { original: DivisionCategory } }) => <div className="font-medium">{row.original.name}</div>,
          },
          {
            header: 'Label',
            accessorKey: 'label',
          },
          {
            header: 'Description',
            accessorKey: 'description',
            cell: ({ row }) => row.original.description || '-',
          },
          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: { original: DivisionCategory } }) => (
              <div className="flex items-center gap-2">
                <Button asChild size="icon" variant="ghost">
                  <Link
                    state={{ from: '/division-categories' }}
                    to={`/division-categories/${row.original.id}/edit`}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <ConfirmDialog
                  title="Delete Category"
                  description={`Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`}
                  confirmLabel="Delete"
                  isLoading={deleteMutation.isPending}
                  onConfirm={() =>
                    deleteMutation.mutate(row.original.id, {
                      onError: handleMutationError,
                    })
                  }
                  trigger={
                    <Button size="icon" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
