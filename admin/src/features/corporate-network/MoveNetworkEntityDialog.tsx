import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import type { NetworkEntity } from '@/types/corporate-network.types';
import { useNetworkTree, useMoveNetworkEntity } from './useNetworkEntities';

type MoveNetworkEntityDialogProps = {
  open: boolean;
  onClose: () => void;
  entity: NetworkEntity | null;
};

export function MoveNetworkEntityDialog({
  open,
  onClose,
  entity,
}: MoveNetworkEntityDialogProps) {
  const { data: tree } = useNetworkTree();
  const moveMutation = useMoveNetworkEntity();

  const [newParentId, setNewParentId] = useState<string | null>(null);
  const [isMakeRoot, setIsMakeRoot] = useState(false);

  // Helper to flat list of entities excluding the current one and its descendants
  const availableParents = useMemo(() => {
    if (!tree || !entity) return [];

    const descendantIds = new Set<string>();
    const collectDescendants = (nodes: NetworkEntity[]) => {
      nodes.forEach((node) => {
        descendantIds.add(node.id);
        if (node.children) collectDescendants(node.children);
      });
    };

    // Find the current entity in the tree to get its children
    const findAndCollect = (nodes: NetworkEntity[]) => {
      for (const node of nodes) {
        if (node.id === entity.id) {
          if (node.children) collectDescendants(node.children);
          return true;
        }
        if (node.children && findAndCollect(node.children)) return true;
      }
      return false;
    };

    findAndCollect(tree);
    descendantIds.add(entity.id);

    const flatList: { id: string; name: string }[] = [];
    const flatten = (nodes: NetworkEntity[]) => {
      nodes.forEach((node) => {
        if (!descendantIds.has(node.id)) {
          flatList.push({ id: node.id, name: node.name });
        }
        if (node.children) flatten(node.children);
      });
    };
    flatten(tree);
    return flatList;
  }, [tree, entity]);

  const handleSubmit = async () => {
    if (!entity) return;
    await moveMutation.mutateAsync({
      id: entity.id,
      dto: { parentId: isMakeRoot ? null : newParentId },
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Entity</DialogTitle>
          <DialogDescription>
            Change the parent of <strong>{entity?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="make-root"
              checked={isMakeRoot}
              onCheckedChange={setIsMakeRoot}
            />
            <Label htmlFor="make-root" className="text-sm font-medium">
              Make this a Root Entity
            </Label>
          </div>

          {!isMakeRoot && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select New Parent</Label>
              <Select
                value={newParentId || ''}
                onValueChange={setNewParentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an entity..." />
                </SelectTrigger>
                <SelectContent>
                  {availableParents.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="p-3 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-sm flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>
              Moving this entity will also move all its descendants. Cycle
              detection is enabled to prevent invalid hierarchies.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              moveMutation.isPending || (!isMakeRoot && !newParentId)
            }
          >
            Move Entity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
