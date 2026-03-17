export type NetworkRelation = {
  id: string;
  name: string;
  label: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type NetworkEntity = {
  id: string;
  name: string;
  summary: string;
  description: string;
  insight: string;
  icon: string;
  sortOrder: number;
  parentId: string | null;
  relationId: string;
  relation: NetworkRelation;
  children?: NetworkEntity[];
  createdAt: string;
  updatedAt: string;
};

export type NetworkMeta = {
  totalEntities: number;
  lastUpdated: string | null;
  version: string;
};
