import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
  useNetworkRelations,
  useDeleteNetworkRelation,
} from './useNetworkRelations';
import { NetworkRelationDialog } from './NetworkRelationDialog';
import type { NetworkRelation } from '@/types/corporate-network.types';

export default function NetworkRelationsPage() {
  const { data: relations, isLoading } = useNetworkRelations();
  const deleteMutation = useDeleteNetworkRelation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRelation, setSelectedRelation] =
    useState<NetworkRelation | null>(null);

  const handleEdit = (relation: NetworkRelation) => {
    setSelectedRelation(relation);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedRelation(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Relation Types"
        text="Define types of relationships between entities (e.g., Strategic Partner, Controlled)."
      >
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Relation Type
        </Button>
      </PageHeader>

      <DataTable
        data={relations || []}
        loading={isLoading}
        columns={[
          {
            header: 'Name',
            accessorKey: 'name',
          },
          {
            header: 'Label',
            accessorKey: 'label',
          },
          {
            header: 'Description',
            accessorKey: 'description',
            cell: ({ row }) => (
              <span className="text-muted-foreground italic">
                {row.original.description || 'No description'}
              </span>
            ),
          },
          {
            header: 'Sort Order',
            accessorKey: 'sortOrder',
          },
          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(row.original)}
                  className="h-8 gap-1"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <ConfirmDialog
                  title="Delete Relation Type"
                  description="Are you sure you want to delete this relation type? This action cannot be undone and will fail if any entities are assigned to it."
                  onConfirm={() => deleteMutation.mutate(row.original.id)}
                  isLoading={deleteMutation.isPending}
                  trigger={
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
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

      <NetworkRelationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        relation={selectedRelation}
      />
    </div>
  );
}
