import ConfirmDialog from '@/components/shared/ConfirmDialog';
import DataTable from '@/components/shared/DataTable';
import { FileImage } from '@/components/shared/FileImage';
import PageHeader from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateServiceCategoryDialog } from '@/features/service-categories/CreateServiceCategoryDialog';
import { EditServiceCategoryDialog } from '@/features/service-categories/EditServiceCategoryDialog';
import { usePagination } from '@/hooks/usePagination';
import type { ServiceCategory } from '@/types/services.types';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useDeleteServiceCategory,
  useServiceCategories,
} from './useServiceCategories';

export default function ServiceCategoriesPage() {
  const { page, perPage, setPage } = usePagination();
  const { data: categoriesData, isLoading } = useServiceCategories({
    page,
    perPage,
  });
  const deleteMutation = useDeleteServiceCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategory | null>(null);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        // toast already handled in mutation usually, but we check if we need to manually
      },
    });
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Service Categories"
        text="Manage diagnostic, clinical and administrative services offered."
      >
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </PageHeader>

      <DataTable
        data={categoriesData?.data || []}
        loading={isLoading}
        pagination={{
          page,
          perPage,
          total: categoriesData?.total || 0,
          onPageChange: setPage,
        }}
        columns={[
          {
            header: 'Name',
            accessorKey: 'title',
            cell: ({ row }: { row: { original: ServiceCategory } }) => (
              <div className="flex items-center gap-2">
                {row.original.heroImage && (
                  <FileImage
                    path={row.original.heroImage}
                    alt={row.original.title}
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
                <span className="font-medium">{row.original.title}</span>
              </div>
            ),
          },
          {
            header: 'Short Name',
            accessorKey: 'shortName',
          },
          {
            header: 'Divisions',
            id: 'divisionsCount',
            cell: ({ row }: { row: { original: ServiceCategory } }) => (
              <Badge variant="secondary">
                {row.original.divisions?.length || 0}
              </Badge>
            ),
          },
          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: { original: ServiceCategory } }) => (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  asChild
                  title="View Details"
                >
                  <Link to={`/service-categories/${row.original.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingCategory(row.original)}
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <ConfirmDialog
                  title="Delete Category"
                  description={`Are you sure you want to delete "${row.original.title}"? This will fail if there are divisions using this category.`}
                  onConfirm={() => handleDelete(row.original.id)}
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

      <CreateServiceCategoryDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {editingCategory && (
        <EditServiceCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open: boolean) => !open && setEditingCategory(null)}
        />
      )}
    </div>
  );
}
