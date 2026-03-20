import { Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BlogCategory } from '@/types/blogs.types'
import {
  useBlogCategories,
  useCreateBlogCategory,
  useDeleteBlogCategory,
  useUpdateBlogCategory,
} from './useBlogCategories'

export default function BlogCategoriesPage() {
  const location = useLocation()
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
      header: 'Slug',
      accessorKey: 'slug',
      cell: ({ row }: { row: { original: BlogCategory } }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {row.original.slug}
        </code>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: { original: BlogCategory } }) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
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
              <Button size="icon" variant="ghost" className="text-destructive">
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
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Blog Categories"
        text="Manage categories used to organize blog posts."
      >
        <Button asChild variant="outline">
          <Link to="/blogs" state={{ from: location.pathname }}>
            Back to Blogs
          </Link>
        </Button>
        {!isCreating ? (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        ) : null}
      </PageHeader>

      {isCreating ? (
        <div className="flex items-center gap-2 rounded-lg border bg-slate-50/50 p-3">
          <Input
            autoFocus
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Category name (e.g. Wellness)"
            className="bg-white"
            onKeyDown={(event) => event.key === 'Enter' && handleCreate()}
          />
          <Button
            onClick={handleCreate}
            disabled={createMutation.isPending || newName.trim().length < 2}
          >
            Add
          </Button>
          <Button variant="ghost" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
        </div>
      ) : null}

      {editingCategory ? (
        <div className="flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50/30 p-3">
          <Input
            autoFocus
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            placeholder="Category name"
            className="bg-white"
            onKeyDown={(event) => event.key === 'Enter' && handleUpdate()}
          />
          <Button
            onClick={handleUpdate}
            disabled={updateMutation.isPending || editName.trim().length < 2}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={() => setEditingCategory(null)}>
            Cancel
          </Button>
        </div>
      ) : null}

      <div className="rounded-md border bg-white">
        <DataTable
          columns={columns}
          data={categories ?? []}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </div>
    </div>
  )
}
