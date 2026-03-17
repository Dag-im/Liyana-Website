import { useState } from 'react';
import { getNetworkIcon } from '@/lib/network-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Move,
  Plus,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NetworkEntity } from '@/types/corporate-network.types';
import { Card } from '@/components/ui/card';

type TreeViewProps = {
  data: NetworkEntity[];
  onEdit: (entity: NetworkEntity) => void;
  onMove: (entity: NetworkEntity) => void;
  onAddChild: (entity: NetworkEntity) => void;
  onDelete: (entity: NetworkEntity) => void;
};

export function CorporateNetworkTreeView({
  data,
  onEdit,
  onMove,
  onAddChild,
  onDelete,
}: TreeViewProps) {
  return (
    <div className="space-y-4">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onEdit={onEdit}
          onMove={onMove}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  depth = 0,
  onEdit,
  onMove,
  onAddChild,
  onDelete,
}: {
  node: NetworkEntity;
  depth?: number;
  onEdit: (entity: NetworkEntity) => void;
  onMove: (entity: NetworkEntity) => void;
  onAddChild: (entity: NetworkEntity) => void;
  onDelete: (entity: NetworkEntity) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 1); // Expand first level by default
  const Icon = getNetworkIcon(node.icon);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={cn('space-y-2', depth > 0 && 'ml-6')}>
      <Card
        className={cn(
          'group relative p-4 transition-all hover:shadow-md border-l-4',
          node.relation.name === 'Strategic'
            ? 'border-l-indigo-500'
            : 'border-l-cyan-500'
        )}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'mt-1 p-0.5 rounded-md hover:bg-accent opacity-60 hover:opacity-100 transition-opacity',
              !hasChildren && 'invisible'
            )}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <div className="p-2 rounded-lg bg-accent/50 text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{node.name}</h4>
              <Badge variant="secondary" className="text-[10px] h-4">
                {node.relation.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-snug">
              {node.summary}
            </p>

            {isExpanded && (
              <div className="pt-3 space-y-2 border-t mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm text-balance">{node.description}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    Insight
                  </label>
                  <p className="text-sm text-indigo-700 font-medium">
                    {node.insight}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onAddChild(node)}
              title="Add Child"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-indigo-600"
              onClick={() => onMove(node)}
              title="Move"
            >
              <Move className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onEdit(node)}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(node)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {isExpanded && hasChildren && (
        <div className="space-y-2">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onEdit={onEdit}
              onMove={onMove}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
