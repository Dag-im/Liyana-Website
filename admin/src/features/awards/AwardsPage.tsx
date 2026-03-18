import { useMemo, useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'

import { awardsApi } from '@/api/awards.api'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import { FileImage } from '@/components/shared/FileImage'
import { FileUpload } from '@/components/shared/FileUpload'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { Badge } from '@/components/ui/badge'
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
import { Textarea } from '@/components/ui/textarea'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import type { Award } from '@/types/awards.types'
import { useAwards, useCreateAward, useDeleteAward, useUpdateAward } from './useAwards'

type AwardFormData = {
  title: string
  organization: string
  year: string
  category: string
  description: string
  imageAlt: string
  image: string
  sortOrder: string
}

const defaultFormData: AwardFormData = {
  title: '',
  organization: '',
  year: '',
  category: '',
  description: '',
  imageAlt: '',
  image: '',
  sortOrder: '0',
}

function toCreateDto(values: AwardFormData) {
  return {
    title: values.title,
    organization: values.organization,
    year: values.year,
    category: values.category,
    description: values.description,
    imageAlt: values.imageAlt,
    image: values.image,
    sortOrder: Number(values.sortOrder) || 0,
  }
}

export default function AwardsPage() {
  const { page, perPage, setPage, resetPage } = usePagination()
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [editingAward, setEditingAward] = useState<Award | null>(null)
  const [deleteAward, setDeleteAward] = useState<Award | null>(null)

  const debouncedSearch = useDebounce(search, 400)
  const debouncedCategory = useDebounce(categoryFilter, 400)

  const awardsQuery = useAwards({
    page,
    perPage,
    search: debouncedSearch || undefined,
    year: yearFilter === 'all' ? undefined : yearFilter,
    category: debouncedCategory || undefined,
  })

  const deleteMutation = useDeleteAward()

  const yearOptions = useMemo(() => {
    const years = new Set<string>()
    ;(awardsQuery.data?.data ?? []).forEach((award) => years.add(award.year))
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
  }, [awardsQuery.data?.data])

  const columns = useMemo(
    () => [
      {
        header: 'Image',
        id: 'image',
        cell: ({ row }: { row: { original: Award } }) => (
          <FileImage
            path={row.original.image}
            alt={row.original.imageAlt || row.original.title}
            className="h-[60px] w-[60px] rounded-md object-cover"
            fallback={<div className="h-[60px] w-[60px] rounded-md bg-muted" />}
          />
        ),
      },
      {
        header: 'Title',
        id: 'title',
        cell: ({ row }: { row: { original: Award } }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">{row.original.organization}</p>
          </div>
        ),
      },
      {
        header: 'Year',
        id: 'year',
        cell: ({ row }: { row: { original: Award } }) => <Badge variant="secondary">{row.original.year}</Badge>,
      },
      {
        header: 'Category',
        accessorKey: 'category',
      },
      {
        header: 'Sort Order',
        accessorKey: 'sortOrder',
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }: { row: { original: Award } }) => (
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => setEditingAward(row.original)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteAward(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader heading="Awards" text="Manage award entries shown on the public site.">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Award
        </Button>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Search title or organization..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            resetPage()
          }}
        />

        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={yearFilter}
          onChange={(event) => {
            setYearFilter(event.target.value)
            resetPage()
          }}
        >
          <option value="all">All Years</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <Input
          placeholder="Filter by category..."
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(event.target.value)
            resetPage()
          }}
        />
      </div>

      <div className="rounded-md border bg-white">
        <DataTable
          columns={columns}
          data={awardsQuery.data?.data ?? []}
          isLoading={awardsQuery.isLoading}
          isError={awardsQuery.isError}
          onRetry={() => awardsQuery.refetch()}
        />
        <Pagination
          page={page}
          perPage={perPage}
          total={awardsQuery.data?.total ?? 0}
          onPageChange={setPage}
        />
      </div>

      <CreateAwardDialog open={createOpen} onOpenChange={setCreateOpen} />

      {editingAward ? (
        <EditAwardDialog award={editingAward} open={Boolean(editingAward)} onOpenChange={(open) => !open && setEditingAward(null)} />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteAward)}
        onClose={() => setDeleteAward(null)}
        onConfirm={() => {
          if (!deleteAward) return
          deleteMutation.mutate(deleteAward.id, {
            onSuccess: () => setDeleteAward(null),
          })
        }}
        title="Delete Award"
        description="Are you sure you want to delete this award? The associated image will be permanently deleted."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

function CreateAwardDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createMutation = useCreateAward()
  const [formData, setFormData] = useState<AwardFormData>(defaultFormData)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createMutation.mutate(toCreateDto(formData), {
      onSuccess: () => {
        onOpenChange(false)
        setFormData(defaultFormData)
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) {
          setFormData(defaultFormData)
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Award</DialogTitle>
          <DialogDescription>Add a new award entry.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="award-title">Title</Label>
              <Input
                id="award-title"
                required
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="award-org">Organization</Label>
              <Input
                id="award-org"
                required
                value={formData.organization}
                onChange={(event) => setFormData((prev) => ({ ...prev, organization: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="award-year">Year</Label>
              <Input
                id="award-year"
                required
                maxLength={4}
                value={formData.year}
                onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="award-category">Category</Label>
              <Input
                id="award-category"
                required
                value={formData.category}
                onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="award-description">Description</Label>
              <Textarea
                id="award-description"
                required
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="award-alt">Image Alt</Label>
              <Input
                id="award-alt"
                required
                value={formData.imageAlt}
                onChange={(event) => setFormData((prev) => ({ ...prev, imageAlt: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="award-sort">Sort Order</Label>
              <Input
                id="award-sort"
                type="number"
                min={0}
                value={formData.sortOrder}
                onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Image</Label>
              <FileUpload
                onUpload={awardsApi.uploadAwardImage}
                onSuccess={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                currentPath={formData.image}
                label="Upload award image"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Award'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditAwardDialog({
  award,
  open,
  onOpenChange,
}: {
  award: Award
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const updateMutation = useUpdateAward()
  const [formData, setFormData] = useState<AwardFormData>({
    title: award.title,
    organization: award.organization,
    year: award.year,
    category: award.category,
    description: award.description,
    imageAlt: award.imageAlt,
    image: award.image,
    sortOrder: String(award.sortOrder),
  })

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateMutation.mutate(
      {
        id: award.id,
        dto: toCreateDto(formData),
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (nextOpen) {
          setFormData({
            title: award.title,
            organization: award.organization,
            year: award.year,
            category: award.category,
            description: award.description,
            imageAlt: award.imageAlt,
            image: award.image,
            sortOrder: String(award.sortOrder),
          })
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Award</DialogTitle>
          <DialogDescription>Update the selected award details.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-award-title">Title</Label>
              <Input
                id="edit-award-title"
                required
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-award-org">Organization</Label>
              <Input
                id="edit-award-org"
                required
                value={formData.organization}
                onChange={(event) => setFormData((prev) => ({ ...prev, organization: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-award-year">Year</Label>
              <Input
                id="edit-award-year"
                required
                maxLength={4}
                value={formData.year}
                onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-award-category">Category</Label>
              <Input
                id="edit-award-category"
                required
                value={formData.category}
                onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-award-description">Description</Label>
              <Textarea
                id="edit-award-description"
                required
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-award-alt">Image Alt</Label>
              <Input
                id="edit-award-alt"
                required
                value={formData.imageAlt}
                onChange={(event) => setFormData((prev) => ({ ...prev, imageAlt: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-award-sort">Sort Order</Label>
              <Input
                id="edit-award-sort"
                type="number"
                min={0}
                value={formData.sortOrder}
                onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Image</Label>
              <FileUpload
                onUpload={awardsApi.uploadAwardImage}
                onSuccess={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                currentPath={formData.image}
                label="Replace award image"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
