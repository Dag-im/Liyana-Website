import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { MediaFolder, MediaItem, MediaItemType } from '@/types/media.types';

export type MediaFolderListPayload = {
  data: MediaFolder[];
  total: number;
};

export type MediaItemListPayload = {
  data: MediaItem[];
  total: number;
  page: number;
  perPage: number;
};

export async function getMediaFolders(params?: {
  perPage?: number;
  tagId?: string;
}): Promise<MediaFolderListPayload> {
  const query = new URLSearchParams();
  query.set('perPage', String(params?.perPage ?? 50));

  if (params?.tagId) {
    query.set('tagId', params.tagId);
  }

  return apiRequest<MediaFolderListPayload>(`/media-folders?${query.toString()}`, {
    next: { revalidate: REVALIDATE.MEDIA, tags: ['media-folders'] },
  });
}

export async function getMediaFolder(id: string): Promise<MediaFolder> {
  return apiRequest<MediaFolder>(`/media-folders/${id}`, {
    next: {
      revalidate: REVALIDATE.MEDIA,
      tags: ['media-folders', `media-folder-${id}`],
    },
  });
}

export async function getMediaItems(
  folderId: string,
  params?: {
    page?: number;
    perPage?: number;
    type?: MediaItemType;
  },
): Promise<MediaItemListPayload> {
  const query = new URLSearchParams();

  if (params?.page) {
    query.set('page', String(params.page));
  }

  query.set('perPage', String(params?.perPage ?? 50));

  if (params?.type) {
    query.set('type', params.type);
  }

  return apiRequest<MediaItemListPayload>(
    `/media-folders/${folderId}/items?${query.toString()}`,
    {
      next: {
        revalidate: REVALIDATE.MEDIA,
        tags: ['media-folders', `media-folder-${folderId}`],
      },
    },
  );
}
