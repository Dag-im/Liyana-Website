import { useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import type { FaqCategory } from '@/types/faq.types'
import {
  useDeleteFaqCategory,
  useFaqCategories,
} from './useFaqs'

export default function FaqCategoriesPage() {
  const categoriesQuery = useFaqCategories()
  const deleteMutation = useDeleteFaqCategory()

  const [deleteCategory, setDeleteCategory] = useState<FaqCategory | null>(null)

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
    },
    {
      header: 'Sort Order',
      accessorKey: 'sortOrder',
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: { original: FaqCategory } }) => (
        <div className="flex items-center gap-1">
          <Button
            asChild
            size="icon"
            variant="ghost"
          >
            <Link
              state={{ from: '/faq-categories' }}
              to={`/faq-categories/${row.original.id}/edit`}
            >
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteCategory(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader heading="FAQ Categories" text="Manage FAQ categories.">
        <Button asChild>
          <Link state={{ from: '/faq-categories' }} to="/faq-categories/new">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
          </Link>
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={categoriesQuery.data ?? []}
        isLoading={categoriesQuery.isLoading}
        isError={categoriesQuery.isError}
        onRetry={() => categoriesQuery.refetch()}
      />

      <ConfirmDialog
        open={Boolean(deleteCategory)}
        onClose={() => setDeleteCategory(null)}
        onConfirm={() => {
          if (!deleteCategory) return
          deleteMutation.mutate(deleteCategory.id, {
            onSuccess: () => setDeleteCategory(null),
          })
        }}
        title="Delete FAQ Category"
        description="Deleting this category is blocked when FAQs are assigned to it."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
