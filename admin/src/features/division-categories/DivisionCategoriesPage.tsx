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
import type { DivisionCategory } from '@/types/services.types'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useCreateDivisionCategory, useDeleteDivisionCategory, useDivisionCategories, useUpdateDivisionCategory } from './useDivisionCategories'

export default function DivisionCategoriesPage() {
  const { data: categories, isLoading } = useDivisionCategories()
  const createMutation = useCreateDivisionCategory()
  const updateMutation = useUpdateDivisionCategory()
  const deleteMutation = useDeleteDivisionCategory()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<DivisionCategory | null>(null)
  const [formData, setFormData] = useState({ name: '', label: '', description: '' })

  const handleOpenCreate = () => {
    setEditingCategory(null)
    setFormData({ name: '', label: '', description: '' })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (category: DivisionCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      label: category.label,
      description: category.description || '',
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, dto: formData },
        { onSuccess: () => setIsDialogOpen(false) }
      )
    } else {
      createMutation.mutate(formData, { onSuccess: () => setIsDialogOpen(false) })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Division Categories" text="Manage major categories of medical and administrative divisions.">
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
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
                <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(row.original)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <ConfirmDialog
                  title="Delete Category"
                  description={`Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`}
                  confirmLabel="Delete"
                  isLoading={deleteMutation.isPending}
                  onConfirm={() => deleteMutation.mutate(row.original.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category details.' : 'Add a new category to the system.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name (Slug-like)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="e.g. inpatient-care"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="label">Display Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. Inpatient Care"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
