import { useMemo, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import ConfirmDialog from '@/components/shared/ConfirmDialog';
import DataTable from '@/components/shared/DataTable';
import { FileImage } from '@/components/shared/FileImage';
import PageHeader from '@/components/shared/PageHeader';
import Pagination from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import type { Award } from '@/types/awards.types';
import { useAwards, useDeleteAward } from './useAwards';

export default function AwardsPage() {
  const { page, perPage, setPage, resetPage, setPerPage } = usePagination();
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [deleteAward, setDeleteAward] = useState<Award | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedCategory = useDebounce(categoryFilter, 400);

  const awardsQuery = useAwards({
    page,
    perPage,
    search: debouncedSearch || undefined,
    year: yearFilter === 'all' ? undefined : yearFilter,
    category: debouncedCategory || undefined,
  });

  const deleteMutation = useDeleteAward();

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    (awardsQuery.data?.data ?? []).forEach((award) => years.add(award.year));
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [awardsQuery.data?.data]);

  const columns = useMemo(
    () => [
      {
        header: 'Image',
        id: 'image',
        cell: ({ row }: { row: { original: Award } }) => (
          <FileImage
            path={row.original.image}
            alt={row.original.imageAlt || row.original.title}
            className="h-15 w-15 rounded-md object-cover"
            fallback={<div className="h-15 w-15 rounded-md bg-muted" />}
          />
        ),
      },
      {
        header: 'Title',
        id: 'title',
        cell: ({ row }: { row: { original: Award } }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.organization}
            </p>
          </div>
        ),
      },
      {
        header: 'Year',
        id: 'year',
        cell: ({ row }: { row: { original: Award } }) => (
          <Badge variant="secondary">{row.original.year}</Badge>
        ),
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
            <Button asChild size="icon" variant="ghost">
              <Link
                state={{ from: '/awards' }}
                to={`/awards/${row.original.id}/edit`}
              >
                <Edit className="h-4 w-4" />
              </Link>
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
  );

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Awards"
        text="Manage award entries shown on the public site."
      >
        <Button asChild>
          <Link state={{ from: '/awards' }} to="/awards/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Award
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Search title or organization..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            resetPage();
          }}
        />

        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={yearFilter}
          onChange={(event) => {
            setYearFilter(event.target.value);
            resetPage();
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
            setCategoryFilter(event.target.value);
            resetPage();
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
          onPerPageChange={setPerPage}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteAward)}
        onClose={() => setDeleteAward(null)}
        onConfirm={() => {
          if (!deleteAward) return;
          deleteMutation.mutate(deleteAward.id, {
            onSuccess: () => setDeleteAward(null),
          });
        }}
        title="Delete Award"
        description="Are you sure you want to delete this award? The associated image will be permanently deleted."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
