export type MediaItemType = 'image' | 'video';

export type MediaTag = {
  id: string;
  name: string;
  slug: string;
};

export type MediaItem = {
  id: string;
  title: string;
  type: MediaItemType;
  url: string;
  thumbnail: string | null;
  sortOrder: number;
  folderId: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaFolder = {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  sortOrder: number;
  tag: MediaTag;
  items?: MediaItem[];
  mediaCount: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
};
