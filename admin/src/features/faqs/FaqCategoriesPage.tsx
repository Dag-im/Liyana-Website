import { useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FaqCategory } from '@/types/faq.types'
import {
  useCreateFaqCategory,
  useDeleteFaqCategory,
  useFaqCategories,
  useUpdateFaqCategory,
} from './useFaqs'

export default function FaqCategoriesPage() {
  const categoriesQuery = useFaqCategories()
  const createMutation = useCreateFaqCategory()
  const updateMutation = useUpdateFaqCategory()
  const deleteMutation = useDeleteFaqCategory()

  const [createOpen, setCreateOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<FaqCategory | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<FaqCategory | null>(null)

  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

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
            size="icon"
            variant="ghost"
            onClick={() => {
              setEditingCategory(row.original)
              setName(row.original.name)
              setSortOrder(String(row.original.sortOrder))
            }}
          >
            <Edit className="h-4 w-4" />
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

  const resetCreateForm = () => {
    setName('')
    setSortOrder('0')
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="FAQ Categories" text="Manage FAQ categories.">
        <Button
          onClick={() => {
            resetCreateForm()
            setCreateOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={categoriesQuery.data ?? []}
        isLoading={categoriesQuery.isLoading}
        isError={categoriesQuery.isError}
        onRetry={() => categoriesQuery.refetch()}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create FAQ Category</DialogTitle>
            <DialogDescription>Add a new FAQ category.</DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              createMutation.mutate(
                {
                  name,
                  sortOrder: Number(sortOrder) || 0,
                },
                {
                  onSuccess: () => {
                    setCreateOpen(false)
                    resetCreateForm()
                  },
                }
              )
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-sort">Sort Order</Label>
              <Input
                id="category-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {editingCategory ? (
        <Dialog
          open={Boolean(editingCategory)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCategory(null)
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit FAQ Category</DialogTitle>
              <DialogDescription>Update this category.</DialogDescription>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (!editingCategory) return

                updateMutation.mutate(
                  {
                    id: editingCategory.id,
                    dto: {
                      name,
                      sortOrder: Number(sortOrder) || 0,
                    },
                  },
                  {
                    onSuccess: () => setEditingCategory(null),
                  }
                )
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Name</Label>
                <Input
                  id="edit-category-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category-sort">Sort Order</Label>
                <Input
                  id="edit-category-sort"
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}

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
