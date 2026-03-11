import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useDivisionCategories } from '@/features/division-categories/useDivisionCategories'
import { useServiceCategories } from '@/features/service-categories/useServiceCategories'
import { usePagination } from '@/hooks/usePagination'
import type { Division } from '@/types/services.types'
import { Edit, Eye, FilterX, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CreateDivisionWizard } from './CreateDivisionWizard'
import { EditDivisionDialog } from './EditDivisionDialog'
import { useDeleteDivision, useDivisions } from './useDivisions'

export default function DivisionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { page, perPage, setPage } = usePagination()

  const serviceCategoryId = searchParams.get('serviceCategoryId') || undefined
  const divisionCategoryId = searchParams.get('divisionCategoryId') || undefined
  const isActiveParam = searchParams.get('isActive')
  const isActive = isActiveParam === 'true' ? true : isActiveParam === 'false' ? false : undefined

  const { data: divisionsData, isLoading } = useDivisions({
    page,
    perPage,
    serviceCategoryId,
    divisionCategoryId,
    isActive,
  })

  const { data: serviceCategories } = useServiceCategories({ perPage: 100 })
  const { data: divisionCategories } = useDivisionCategories()
  const deleteMutation = useDeleteDivision()

  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [editingDivision, setEditingDivision] = useState<Division | null>(null)

  const updateFilters = (key: string, value: string | boolean | undefined) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === undefined || value === 'all' || value === '') {
      newParams.delete(key)
    } else {
      newParams.set(key, value.toString())
    }
    setSearchParams(newParams)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchParams(new URLSearchParams())
    setPage(1)
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Divisions" text="Manage clinical divisions, administrative departments and hospital units.">
        <Button onClick={() => setIsWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Division
        </Button>
      </PageHeader>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-xs">Service Category</Label>
            <Select
              value={serviceCategoryId || 'all'}
              onValueChange={(v) => updateFilters('serviceCategoryId', v || undefined)}
            >
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="All Service Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories?.data.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Division Category</Label>
            <Select
              value={divisionCategoryId || 'all'}
              onValueChange={(v) => updateFilters('divisionCategoryId', v || undefined)}
            >
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="All Division Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {divisionCategories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 h-9 px-3 border rounded-md">
            <Label htmlFor="active-toggle" className="text-xs">Active Only</Label>
            <Switch
              id="active-toggle"
              checked={isActive === true}
              onCheckedChange={(checked) => updateFilters('isActive', checked ? 'true' : 'all')}
            />
          </div>

          <Button variant="ghost" size="sm" className="h-9" onClick={clearFilters}>
            <FilterX className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <DataTable
        data={divisionsData?.data || []}
        loading={isLoading}
        pagination={{
          page,
          perPage,
          total: divisionsData?.total || 0,
          onPageChange: setPage,
        }}
        columns={[
          {
            header: 'Division',
            accessorKey: 'name',
            cell: ({ row }: { row: { original: Division } }) => (
              <div className="flex items-center gap-3">
                {row.original.logo ? (
                  <img src={row.original.logo} className="h-8 w-8 rounded-full object-cover border" alt="" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                    {row.original.shortName}
                  </div>
                )}
                <div>
                  <p className="font-medium leading-none">{row.original.name}</p>
                  <p className="text-xs text-muted-foreground">{row.original.shortName}</p>
                </div>
              </div>
            ),
          },
          {
            header: 'Category',
            id: 'category',
            cell: ({ row }: { row: { original: Division } }) => (
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase">{row.original.serviceCategory?.title}</p>
                <p className="text-xs font-medium">{row.original.divisionCategory?.label}</p>
              </div>
            ),
          },
          {
            header: 'Status',
            id: 'status',
            cell: ({ row }: { row: { original: Division } }) => (
              <StatusBadge type="active" isActive={row.original.isActive} />
            ),
          },
          {
            header: 'Contacts',
            id: 'contacts',
            cell: ({ row }: { row: { original: Division } }) => (
              <div className="text-xs space-y-0.5">
                {row.original.contact?.phone && <p>{row.original.contact.phone}</p>}
                {row.original.contact?.email && <p className="text-muted-foreground">{row.original.contact.email}</p>}
              </div>
            ),
          },
          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: { original: Division } }) => (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Button size="icon" variant="ghost" asChild title="View Details">
                  <Link to={`/divisions/${row.original.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingDivision(row.original)} title="Quick Edit">
                  <Edit className="h-4 w-4" />
                </Button>
                <ConfirmDialog
                  title="Delete Division"
                  description={`Are you sure you want to delete ${row.original.name}? All associated data will be removed.`}
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
        ]}
      />

      <CreateDivisionWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />

       {editingDivision && (
         <EditDivisionDialog
           division={editingDivision}
           open={!!editingDivision}
           onOpenChange={(open: boolean) => !open && setEditingDivision(null)}
         />
       )}
    </div>
  )
}
