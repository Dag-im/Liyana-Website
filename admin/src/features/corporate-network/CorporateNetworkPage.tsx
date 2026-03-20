import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutList,
  Network,
  Plus,
  Settings,
  Calendar,
  Layers,
  Activity,
} from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import {
  useNetworkTree,
  useNetworkMeta,
  useDeleteNetworkEntity,
} from './useNetworkEntities';
import { CorporateNetworkTreeView } from './CorporateNetworkTreeView';
import { CorporateNetworkListView } from './CorporateNetworkListView';
import { MoveNetworkEntityDialog } from './MoveNetworkEntityDialog';
import type { NetworkEntity } from '@/types/corporate-network.types';
import { Card } from '@/components/ui/card';

export default function CorporateNetworkPage() {
  const navigate = useNavigate();
  const { page, perPage, setPage } = usePagination();
  const [view, setView] = useState<'tree' | 'list'>('tree');

  const { data: treeData } = useNetworkTree();
  const { data: metaData } = useNetworkMeta();
  const deleteMutation = useDeleteNetworkEntity();

  // Dialog states
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedEntity, setSelectedEntity] = useState<NetworkEntity | null>(
    null
  );

  const handleAddRoot = () => {
    navigate('/corporate-network/new', { state: { from: '/corporate-network' } });
  };

  const handleAddChild = (parent: NetworkEntity) => {
    navigate(
      `/corporate-network/new?parentId=${encodeURIComponent(parent.id)}&parentName=${encodeURIComponent(parent.name)}`,
      { state: { from: '/corporate-network' } }
    );
  };

  const handleEdit = (entity: NetworkEntity) => {
    navigate(`/corporate-network/${entity.id}/edit`, {
      state: { from: '/corporate-network' },
    });
  };

  const handleMove = (entity: NetworkEntity) => {
    setSelectedEntity(entity);
    setIsMoveOpen(true);
  };

  const handleDeleteClick = (entity: NetworkEntity) => {
    setSelectedEntity(entity);
    setIsDeleteOpen(true);
  };

  const recursiveCount = (entity: NetworkEntity): number => {
    if (!entity.children) return 0;
    return (
      entity.children.length +
      entity.children.reduce((acc, child) => acc + recursiveCount(child), 0)
    );
  };

  const descendantCount = selectedEntity ? recursiveCount(selectedEntity) : 0;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Corporate Network"
        text="Manage companies, subsidiaries, and investment entities in a hierarchical structure."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('relations')}>
            <Settings className="mr-2 h-4 w-4" />
            Manage Relation Types
          </Button>
          <Button onClick={handleAddRoot}>
            <Plus className="mr-2 h-4 w-4" />
            Add Root Entity
          </Button>
        </div>
      </PageHeader>

      {/* Meta Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 bg-indigo-50/50 border-indigo-100">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-indigo-600/70 tracking-wider">
              Total Entities
            </p>
            <p className="text-2xl font-bold">{metaData?.totalEntities || 0}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 bg-cyan-50/50 border-cyan-100">
          <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-cyan-600/70 tracking-wider">
              Last Updated
            </p>
            <p className="text-sm font-medium">
              {metaData?.lastUpdated
                ? new Date(metaData.lastUpdated).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 bg-muted/50 border-muted">
          <div className="p-2 rounded-lg bg-background text-muted-foreground border">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Version
            </p>
            <p className="text-sm font-semibold">{metaData?.version || '1.0.0'}</p>
          </div>
        </Card>
      </div>

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as 'tree' | 'list')}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="tree" className="gap-2">
              <Network className="h-4 w-4" />
              Tree View
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <LayoutList className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tree" className="mt-0">
          <CorporateNetworkTreeView
            data={treeData || []}
            onEdit={handleEdit}
            onMove={handleMove}
            onAddChild={handleAddChild}
            onDelete={handleDeleteClick}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <CorporateNetworkListView
            params={{ page, perPage }}
            onPageChange={setPage}
            onEdit={handleEdit}
            onMove={handleMove}
            onDelete={handleDeleteClick}
          />
        </TabsContent>
      </Tabs>

      <MoveNetworkEntityDialog
        open={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
        entity={selectedEntity}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Network Entity"
        description={`This will permanently delete ${selectedEntity?.name}${
          descendantCount > 0
            ? ` and all its ${descendantCount} descendants.`
            : '.'
        } This action cannot be undone.`}
        confirmLabel="Delete Everything"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedEntity) {
            await deleteMutation.mutateAsync(selectedEntity.id);
            setIsDeleteOpen(false);
          }
        }}
      />
    </div>
  );
}
