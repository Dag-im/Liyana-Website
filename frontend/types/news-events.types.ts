export type NewsEventType = 'news' | 'event';
export type NewsEventStatus = 'DRAFT' | 'PUBLISHED';

export type NewsEvent = {
  id: string;
  type: NewsEventType;
  title: string;
  date: string;
  location: string | null;
  summary: string;
  content: string[];
  keyHighlights: string[] | null;
  mainImage: string;
  image1: string;
  image2: string;
  status: NewsEventStatus;
  publishedAt: string | null;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
};
