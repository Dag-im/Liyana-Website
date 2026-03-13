import { useState } from 'react'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import type { BlogCategory } from '@/types/blogs.types'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useBlogCategories, useCreateBlogCategory, useDeleteBlogCategory, useUpdateBlogCategory } from './useBlogCategories'

export default function BlogCategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useBlogCategories()
  const createMutation = useCreateBlogCategory()
  const updateMutation = useUpdateBlogCategory()
  const deleteMutation = useDeleteBlogCategory()

  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [editName, setEditName] = useState('')

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Slug', accessorKey: 'slug' },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: { original: BlogCategory } }) => formatDate(row.original.createdAt),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: { original: BlogCategory } }) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-2"
            onClick={() => {
              setEditingCategory(row.original)
              setEditName(row.original.name)
            }}
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
          <ConfirmDialog
            title="Delete Category"
            description="This will permanently delete the blog category."
            onConfirm={() => deleteMutation.mutate(row.original.id)}
            isLoading={deleteMutation.isPending}
            trigger={
              <Button size="icon" variant="ghost" className="text-destructive" title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Blog Categories">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger render={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          } />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>Add a new blog category.</DialogDescription>
            </DialogHeader>
            <Input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Category name" />
            <DialogFooter>
              <Button
                disabled={createMutation.isPending || newName.trim().length < 2}
                onClick={() => {
                  const name = newName.trim()
                  createMutation.mutate(name, {
                    onSuccess: () => {
                      setCreateOpen(false)
                      setNewName('')
                    },
                  })
                }}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <DataTable
        columns={columns}
        data={categories ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />

      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the blog category name.</DialogDescription>
          </DialogHeader>
          <Input value={editName} onChange={(event) => setEditName(event.target.value)} placeholder="Category name" />
          <DialogFooter>
            <Button
              disabled={updateMutation.isPending || editName.trim().length < 2}
              onClick={() => {
                if (!editingCategory) return
                const name = editName.trim()
                updateMutation.mutate(
                  { id: editingCategory.id, name },
                  { onSuccess: () => setEditingCategory(null) }
                )
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
