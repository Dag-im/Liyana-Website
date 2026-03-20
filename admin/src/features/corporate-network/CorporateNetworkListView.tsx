import DataTable from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNetworkIcon } from '@/lib/network-icons';
import { Edit, Move, Trash2 } from 'lucide-react';
import {
  useNetworkEntities,
  useNetworkTree,
} from './useNetworkEntities';
import type { NetworkEntity } from '@/types/corporate-network.types';
import { useNetworkRelations } from './useNetworkRelations';

type ListViewProps = {
  params: {
    page: number;
    perPage: number;
    search?: string;
    relationId?: string;
    parentId?: string;
  };
  onPageChange: (page: number) => void;
  onEdit: (entity: NetworkEntity) => void;
  onMove: (entity: NetworkEntity) => void;
  onDelete: (entity: NetworkEntity) => void;
};

export function CorporateNetworkListView({
  params,
  onPageChange,
  onEdit,
  onMove,
  onDelete,
}: ListViewProps) {
  const { data: entities, isLoading } = useNetworkEntities(params);
  const { data: treeData } = useNetworkTree();
  const { data: relations } = useNetworkRelations();

  const flattenTree = (nodes: NetworkEntity[]): NetworkEntity[] => {
    const result: NetworkEntity[] = [];
    const walk = (node: NetworkEntity) => {
      result.push(node);
      node.children?.forEach(walk);
    };
    nodes.forEach(walk);
    return result;
  };

  const flatTree = flattenTree(treeData ?? []);
  const parentNameById = new Map(flatTree.map((node) => [node.id, node.name]));
  const relationLabelById = new Map(
    (relations ?? []).map((relation) => [relation.id, relation.label]),
  );

  return (
    <DataTable
      data={entities?.data || []}
      loading={isLoading}
      pagination={{
        page: params.page,
        perPage: params.perPage,
        total: entities?.total || 0,
        onPageChange,
      }}
      columns={[
        {
          header: 'Icon',
          id: 'icon',
          cell: ({ row }) => {
            const Icon = getNetworkIcon(row.original.icon);
            return (
              <div className="p-2 rounded-md bg-accent/50 w-fit">
                <Icon className="h-4 w-4" />
              </div>
            );
          },
        },
        {
          header: 'Name',
          accessorKey: 'name',
          cell: ({ row }) => (
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                {row.original.summary}
              </p>
            </div>
          ),
        },
        {
          header: 'Relation',
          id: 'relation',
          cell: ({ row }) => (
            <Badge variant="outline" className="text-[10px]">
              {relationLabelById.get(row.original.relationId) ??
                row.original.relation?.label ??
                'Unknown'}
            </Badge>
          ),
        },
        {
          header: 'Parent',
          id: 'parent',
          cell: ({ row }) => {
            const parentName = row.original.parentId
              ? (parentNameById.get(row.original.parentId) ?? 'Unknown')
              : 'Root';
            return (
              <Badge
                variant={parentName === 'Root' ? 'secondary' : 'outline'}
                className="text-[10px]"
              >
                {parentName}
              </Badge>
            );
          },
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
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-indigo-600"
                onClick={() => onMove(row.original)}
                title="Move"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onEdit(row.original)}
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(row.original)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
