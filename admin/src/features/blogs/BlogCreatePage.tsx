import { Link, useLocation, useNavigate } from 'react-router-dom';

import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import BlogWizard from '@/features/blogs/components/BlogWizard';
import { useCreateBlog } from '@/features/blogs/useBlogs';

function resolveReturnPath(location: ReturnType<typeof useLocation>) {
  const state = location.state as { from?: string } | undefined;
  const params = new URLSearchParams(location.search);
  return state?.from ?? params.get('returnTo') ?? '/blogs';
}

export default function BlogCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const createMutation = useCreateBlog();
  const returnTo = resolveReturnPath(location);

  return (
    <div className="space-y-4">
      <PageHeader
        heading="Create Blog"
        text="Create a new blog post with guided steps."
      >
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>
      <div className="h-[calc(100vh-14rem)] min-h-180">
        <BlogWizard
          inline
          isLoading={createMutation.isPending}
          mode="create"
          onOpenChange={(open) => {
            if (!open) navigate(returnTo);
          }}
          onSubmit={(dto) => {
            createMutation.mutate(dto, {
              onSuccess: () => navigate(returnTo, { replace: true }),
            });
          }}
        />
      </div>
    </div>
  );
}
