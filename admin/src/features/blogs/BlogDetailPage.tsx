import { ArrowLeft, Edit, Star, Trash2, UploadCloud } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { FileImage } from '@/components/shared/FileImage'
import RichTextViewer from '@/components/shared/RichTextViewer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/useAuth'
import { formatDate } from '@/lib/utils'
import { useBlog, useDeleteBlog, useFeatureBlog, usePublishBlog, useSubmitBlog, useUnfeatureBlog } from './useBlogs'
import BlogStatusBadge from './components/BlogStatusBadge'
import RejectBlogDialog from './components/RejectBlogDialog'

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const authQuery = useAuth()
  const user = authQuery.data
  const isAdminOrComm = user?.role === 'ADMIN' || user?.role === 'COMMUNICATION'
  const isBlogger = user?.role === 'BLOGGER'

  const blogQuery = useBlog(id ?? '')
  const submitMutation = useSubmitBlog()
  const publishMutation = usePublishBlog()
  const featureMutation = useFeatureBlog()
  const unfeatureMutation = useUnfeatureBlog()
  const deleteMutation = useDeleteBlog()

  if (blogQuery.isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (blogQuery.isError || !blogQuery.data) {
    return <ErrorState onRetry={() => blogQuery.refetch()} />
  }

  const blog = blogQuery.data
  const canEdit = isAdminOrComm || (isBlogger && blog.authorId === user?.id && (blog.status === 'DRAFT' || blog.status === 'REJECTED'))

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/blogs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <PageHeader heading={blog.title} />
            <div className="mt-2 flex items-center gap-2">
              <BlogStatusBadge status={blog.status} />
              {blog.featured ? <Badge className="bg-amber-100 text-amber-700">Featured</Badge> : null}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {canEdit ? (
            <Button size="sm" variant="outline" asChild>
              <Link to={`/blogs/${blog.id}/edit`} state={{ from: `/blogs/${blog.id}` }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          ) : null}
          {isBlogger && blog.authorId === user?.id && (blog.status === 'DRAFT' || blog.status === 'REJECTED') ? (
            <Button size="sm" variant="secondary" onClick={() => submitMutation.mutate(blog.id)}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Submit
            </Button>
          ) : null}
          {isAdminOrComm && (blog.status === 'PENDING_REVIEW' || blog.status === 'DRAFT') ? (
            <>
              <Button size="sm" onClick={() => publishMutation.mutate(blog.id)}>Publish</Button>
              <RejectBlogDialog blogId={blog.id} disabled={blog.status !== 'PENDING_REVIEW'} />
            </>
          ) : null}
          {isAdminOrComm && blog.status === 'PUBLISHED' ? (
            blog.featured ? (
              <Button size="sm" variant="secondary" onClick={() => unfeatureMutation.mutate(blog.id)}>
                Unfeature
              </Button>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => featureMutation.mutate(blog.id)}>
                <Star className="mr-2 h-4 w-4" />
                Feature
              </Button>
            )
          ) : null}
          {user?.role === 'ADMIN' ? (
            <ConfirmDialog
              title="Delete Blog"
              description="This will permanently delete the blog post and its image."
              onConfirm={() => deleteMutation.mutate(blog.id, { onSuccess: () => navigate('/blogs') })}
              isLoading={deleteMutation.isPending}
              trigger={
                <Button size="sm" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              }
            />
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><span className="text-muted-foreground">Category:</span> {blog.category?.name}</div>
          <div><span className="text-muted-foreground">Author:</span> {blog.authorName} ({blog.authorRole})</div>
          <div><span className="text-muted-foreground">Created:</span> {formatDate(blog.createdAt)}</div>
          <div><span className="text-muted-foreground">Updated:</span> {formatDate(blog.updatedAt)}</div>
          <div><span className="text-muted-foreground">Published:</span> {blog.publishedAt ? formatDate(blog.publishedAt) : '—'}</div>
          {blog.rejectionReason ? (
            <div><span className="text-muted-foreground">Rejection reason:</span> {blog.rejectionReason}</div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 rounded-md border overflow-hidden bg-muted">
            <FileImage
              path={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Excerpt</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{blog.excerpt}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextViewer content={blog.content} />
        </CardContent>
      </Card>
    </div>
  )
}
