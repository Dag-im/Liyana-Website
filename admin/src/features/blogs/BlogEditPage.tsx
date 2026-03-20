import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import type { CreateBlogDto } from '@/api/blogs.api';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import BlogWizard from '@/features/blogs/components/BlogWizard';
import type { Blog } from '@/types/blogs.types';
import { useBlog, useUpdateBlog } from './useBlogs';

const toDefaultValues = (blog: Blog): Partial<CreateBlogDto> => ({
  title: blog.title,
  excerpt: blog.excerpt,
  content: blog.content,
  image: blog.image,
  categoryId: blog.categoryId,
});

function resolveReturnPath(location: ReturnType<typeof useLocation>) {
  const state = location.state as { from?: string } | undefined;
  const params = new URLSearchParams(location.search);
  return state?.from ?? params.get('returnTo') ?? '/blogs';
}

export default function BlogEditPage() {
  const { id = '' } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const blogQuery = useBlog(id);
  const updateMutation = useUpdateBlog();
  const returnTo = resolveReturnPath(location);

  if (!id)
    return <ErrorState description="Missing blog id." title="Invalid route" />;
  if (blogQuery.isLoading) return <LoadingSpinner />;
  if (blogQuery.isError || !blogQuery.data) {
    return <ErrorState onRetry={() => blogQuery.refetch()} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader heading="Edit Blog" text="Update blog details and content.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>
      <div className="h-[calc(100vh-14rem)] min-h-180">
        <BlogWizard
          defaultValues={toDefaultValues(blogQuery.data)}
          inline
          isLoading={updateMutation.isPending}
          mode="edit"
          onOpenChange={(open) => {
            if (!open) navigate(returnTo);
          }}
          onSubmit={(dto) => {
            updateMutation.mutate(
              { id, dto },
              { onSuccess: () => navigate(returnTo, { replace: true }) }
            );
          }}
        />
      </div>
    </div>
  );
}
