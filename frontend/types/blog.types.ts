export type BlogStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Blog = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  featured: boolean;
  status: BlogStatus;
  authorId: string;
  authorName: string | null;
  authorRole: string | null;
  categoryId: string;
  category: BlogCategory;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
