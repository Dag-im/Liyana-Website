import ConfirmDialog from '@/components/shared/ConfirmDialog';
import DataTable from '@/components/shared/DataTable';
import { FileImage } from '@/components/shared/FileImage';
import PageHeader from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useDivisionCategories } from '@/features/division-categories/useDivisionCategories';
import { useServiceCategories } from '@/features/service-categories/useServiceCategories';
import { usePagination } from '@/hooks/usePagination';
import type { Division } from '@/types/services.types';
import { Edit, Eye, FilterX, Plus, Settings, Trash2 } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useDeleteDivision, useDivisions } from './useDivisions';

export default function DivisionsPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, perPage, setPage, setPerPage } = usePagination();

  const serviceCategoryId = searchParams.get('serviceCategoryId') || undefined;
  const divisionCategoryId =
    searchParams.get('divisionCategoryId') || undefined;
  const isActiveParam = searchParams.get('isActive');
  const isActive =
    isActiveParam === 'true'
      ? true
      : isActiveParam === 'false'
        ? false
        : undefined;

  const { data: divisionsData, isLoading } = useDivisions({
    page,
    perPage,
    serviceCategoryId,
    divisionCategoryId,
    isActive,
  });

  const { data: serviceCategories } = useServiceCategories({ perPage: 100 });
  const { data: divisionCategories } = useDivisionCategories();
  const deleteMutation = useDeleteDivision();

  const updateFilters = (key: string, value: string | boolean | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value.toString());
    }
    setSearchParams(newParams);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Divisions"
        text="Manage clinical divisions, administrative departments and hospital units."
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link
              to="/division-categories"
              state={{ from: `${location.pathname}${location.search}` }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage Division Categories
            </Link>
          </Button>
          <Button asChild>
            <Link
              to="/divisions/new"
              state={{ from: `${location.pathname}${location.search}` }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Division
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-xs">Service Category</Label>
            <Select
              value={serviceCategoryId || 'all'}
              onValueChange={(v) =>
                updateFilters('serviceCategoryId', v || undefined)
              }
            >
              <SelectTrigger className="w-50 h-9">
                <SelectValue placeholder="All Service Categories">
                  {serviceCategoryId && serviceCategoryId !== 'all'
                    ? (serviceCategories?.data.find(
                        (c) => c.id === serviceCategoryId
                      )?.title ?? 'All Service Categories')
                    : 'All Service Categories'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories?.data.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Division Category</Label>
            <Select
              value={divisionCategoryId || 'all'}
              onValueChange={(v) =>
                updateFilters('divisionCategoryId', v || undefined)
              }
            >
              <SelectTrigger className="w-50 h-9">
                <SelectValue placeholder="All Division Categories">
                  {divisionCategoryId && divisionCategoryId !== 'all'
                    ? (divisionCategories?.find(
                        (c) => c.id === divisionCategoryId
                      )?.label ?? 'All Division Categories')
                    : 'All Division Categories'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {divisionCategories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 h-9 px-3 border rounded-md">
            <Label htmlFor="active-toggle" className="text-xs">
              Active Only
            </Label>
            <Switch
              id="active-toggle"
              checked={isActive === true}
              onCheckedChange={(checked) =>
                updateFilters('isActive', checked ? 'true' : 'all')
              }
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={clearFilters}
          >
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
          onPerPageChange: setPerPage,
        }}
        columns={[
          {
            header: 'Division',
            accessorKey: 'name',
            cell: ({ row }: { row: { original: Division } }) => (
              <div className="flex items-center gap-3">
                {row.original.logo ? (
                  <FileImage
                    path={row.original.logo}
                    className="h-8 w-8 rounded-full object-cover border"
                    alt=""
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                    {row.original.shortName}
                  </div>
                )}
                <div>
                  <p className="font-medium leading-none">
                    {row.original.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {row.original.shortName}
                  </p>
                </div>
              </div>
            ),
          },
          {
            header: 'Category',
            id: 'category',
            cell: ({ row }: { row: { original: Division } }) => (
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase">
                  {row.original.serviceCategory?.title}
                </p>
                <p className="text-xs font-medium">
                  {row.original.divisionCategory?.label}
                </p>
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
            header: 'Medical Team',
            id: 'medicalTeam',
            cell: ({ row }: { row: { original: Division } }) => (
              <Badge
                variant={
                  row.original.requiresMedicalTeam ? 'default' : 'secondary'
                }
              >
                {row.original.requiresMedicalTeam ? 'Yes' : 'No'}
              </Badge>
            ),
          },

          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: { original: Division } }) => (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Button
                  size="icon"
                  variant="ghost"
                  asChild
                  title="View Details"
                >
                  <Link to={`/divisions/${row.original.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Edit division"
                  asChild
                >
                  <Link
                    to={`/divisions/${row.original.id}/edit`}
                    state={{ from: `${location.pathname}${location.search}` }}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <ConfirmDialog
                  title="Delete Division"
                  description={`Are you sure you want to delete ${row.original.name}? All associated data will be removed.`}
                  onConfirm={() => deleteMutation.mutate(row.original.id)}
                  isLoading={deleteMutation.isPending}
                  trigger={
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      title="Delete"
                    >
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
  );
}
