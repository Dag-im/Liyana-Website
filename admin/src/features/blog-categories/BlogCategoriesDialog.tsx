import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, Plus, Trash2, FolderEdit } from 'lucide-react'
import { 
  useBlogCategories, 
  useCreateBlogCategory, 
  useDeleteBlogCategory, 
  useUpdateBlogCategory 
} from './useBlogCategories'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import type { BlogCategory } from '@/types/blogs.types'

type BlogCategoriesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BlogCategoriesDialog({ open, onOpenChange }: BlogCategoriesDialogProps) {
  const { data: categories, isLoading, isError, refetch } = useBlogCategories()
  const createMutation = useCreateBlogCategory()
  const updateMutation = useUpdateBlogCategory()
  const deleteMutation = useDeleteBlogCategory()

  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [editName, setEditName] = useState('')

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: { original: BlogCategory } }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingCategory(row.original)
              setEditName(row.original.name)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            title="Delete Category"
            description="This will permanently delete the blog category."
            onConfirm={() => deleteMutation.mutate(row.original.id)}
            isLoading={deleteMutation.isPending}
            trigger={
              <Button size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ),
    },
  ]

  const handleCreate = () => {
    const name = newName.trim()
    if (name.length < 2) return
    createMutation.mutate(name, {
      onSuccess: () => {
        setIsCreating(false)
        setNewName('')
      },
    })
  }

  const handleUpdate = () => {
    if (!editingCategory) return
    const name = editName.trim()
    if (name.length < 2) return
    updateMutation.mutate(
      { id: editingCategory.id, name },
      { onSuccess: () => setEditingCategory(null) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2">
                <FolderEdit className="h-5 w-5 text-cyan-600" />
                Manage Blog Categories
              </DialogTitle>
              <DialogDescription>
                Add, edit, or remove categories to organize your blog posts.
              </DialogDescription>
            </div>
            {!isCreating && (
              <Button size="sm" onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Category
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isCreating && (
            <div className="flex items-center gap-2 rounded-lg border bg-slate-50/50 p-3 animate-in fade-in slide-in-from-top-2">
              <Input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Category name (e.g. Wellness)"
                className="bg-white"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <Button size="sm" onClick={handleCreate} disabled={createMutation.isPending || newName.trim().length < 2}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          )}

          {editingCategory && (
            <div className="flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50/30 p-3">
              <Input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Category name"
                className="bg-white"
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              />
              <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isPending || editName.trim().length < 2}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
            </div>
          )}

          <div className="rounded-md border">
            <DataTable
              columns={columns}
              data={categories ?? []}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
