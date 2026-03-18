export type TeamMember = {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string | null;
  isCorporate: boolean;
  divisionId: string | null;
  division: {
    id: string;
    name: string;
    isActive: boolean;
  } | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
