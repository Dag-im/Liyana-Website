import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { TeamMember } from '@/types/team.types';

export type TeamListPayload = {
  data: TeamMember[];
  total: number;
};

export async function getTeamMembers(params?: {
  divisionId?: string;
  isCorporate?: boolean;
  perPage?: number;
}): Promise<TeamListPayload> {
  const query = new URLSearchParams();
  query.set('perPage', String(params?.perPage ?? 100));

  if (params?.divisionId) {
    query.set('divisionId', params.divisionId);
  }

  if (params?.isCorporate !== undefined) {
    query.set('isCorporate', String(params.isCorporate));
  }

  return apiRequest<TeamListPayload>(`/team?${query.toString()}`, {
    next: { revalidate: REVALIDATE.SERVICES, tags: ['team'] },
  });
}
