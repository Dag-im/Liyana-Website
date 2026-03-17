import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/features/auth/useAuth'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { formatDate, truncate } from '@/lib/utils'
import type { Blog, BlogStatus } from '@/types/blogs.types'
import { Edit, Eye, Star, Trash2, UploadCloud } from 'lucide-react'
import { useBlogs, useDeleteBlog, useFeatureBlog, usePublishBlog, useSubmitBlog, useUnfeatureBlog } from './useBlogs'
import { useBlogCategories } from '@/features/blog-categories/useBlogCategories'
import BlogStatusBadge from './components/BlogStatusBadge'
import CreateBlogDialog from './components/CreateBlogDialog'
import EditBlogDialog from './components/EditBlogDialog'
import RejectBlogDialog from './components/RejectBlogDialog'
import BlogCategoriesDialog from '@/features/blog-categories/BlogCategoriesDialog'
import { FolderEdit } from 'lucide-react'

type StatusFilter = 'ALL' | BlogStatus

type FeaturedFilter = 'ALL' | 'FEATURED' | 'NOT_FEATURED'

export default function BlogsPage() {
  const authQuery = useAuth()
  const user = authQuery.data
  const isAdminOrComm = user?.role === 'ADMIN' || user?.role === 'COMMUNICATION'
  const isBlogger = user?.role === 'BLOGGER'

  const { page, perPage, setPage, resetPage } = usePagination()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [categoryId, setCategoryId] = useState('ALL')
  const [featured, setFeatured] = useState<FeaturedFilter>('ALL')
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 400)

  const { data: categories } = useBlogCategories()

  const blogsQuery = useBlogs({
    page,
    perPage,
    search: debouncedSearch || undefined,
    status: status === 'ALL' ? undefined : status,
    categoryId: categoryId === 'ALL' ? undefined : categoryId,
    featured: featured === 'ALL' ? undefined : featured === 'FEATURED',
  })

  const submitMutation = useSubmitBlog()
  const publishMutation = usePublishBlog()
  const featureMutation = useFeatureBlog()
  const unfeatureMutation = useUnfeatureBlog()
  const deleteMutation = useDeleteBlog()

  const canEditBlog = (blog: Blog) => {
    if (isAdminOrComm) return true
    if (isBlogger) {
      return blog.authorId === user?.id && (blog.status === 'DRAFT' || blog.status === 'REJECTED')
    }
    return false
  }

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        cell: ({ row }: { row: { original: Blog } }) => (
          <div>
            <p className="font-medium">{truncate(row.original.title, 60)}</p>
            <p className="text-xs text-muted-foreground">{row.original.readTime}</p>
          </div>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: ({ row }: { row: { original: Blog } }) => row.original.category?.name ?? '—',
      },
      {
        header: 'Author',
        accessorKey: 'authorName',
        cell: ({ row }: { row: { original: Blog } }) => row.original.authorName,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }: { row: { original: Blog } }) => (
          <div className="flex items-center gap-2">
            <BlogStatusBadge status={row.original.status} />
            {row.original.featured ? <Star className="h-3.5 w-3.5 text-amber-500" /> : null}
          </div>
        ),
      },
      {
        header: 'Updated',
        accessorKey: 'updatedAt',
        cell: ({ row }: { row: { original: Blog } }) => formatDate(row.original.updatedAt),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }: { row: { original: Blog } }) => {
          const blog = row.original
          return (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="icon" variant="ghost" asChild title="View">
                <Link to={`/blogs/${blog.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              {canEditBlog(blog) ? (
                <EditBlogDialog
                  blogId={blog.id}
                  trigger={
                    <Button size="sm" variant="outline" className="h-8 gap-2">
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  }
                />
              ) : null}
              {isBlogger && blog.authorId === user?.id && (blog.status === 'DRAFT' || blog.status === 'REJECTED') ? (
                <Button size="sm" variant="secondary" className="h-8" onClick={() => submitMutation.mutate(blog.id)}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              ) : null}
              {isAdminOrComm ? (
                <>
                  <Button
                    size="sm"
                    className="h-8"
                    disabled={!(blog.status === 'PENDING_REVIEW' || blog.status === 'DRAFT')}
                    onClick={() => publishMutation.mutate(blog.id)}
                  >
                    Publish
                  </Button>
                  <RejectBlogDialog
                    blogId={blog.id}
                    disabled={blog.status !== 'PENDING_REVIEW'}
                  />
                  {blog.featured ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8"
                      disabled={blog.status !== 'PUBLISHED'}
                      onClick={() => unfeatureMutation.mutate(blog.id)}
                    >
                      Unfeature
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8"
                      disabled={blog.status !== 'PUBLISHED'}
                      onClick={() => featureMutation.mutate(blog.id)}
                    >
                      Feature
                    </Button>
                  )}
                </>
              ) : null}
              {user?.role === 'ADMIN' ? (
                <ConfirmDialog
                  title="Delete Blog"
                  description="This will permanently delete the blog post and its image."
                  onConfirm={() => deleteMutation.mutate(blog.id)}
                  isLoading={deleteMutation.isPending}
                  trigger={
                    <Button size="icon" variant="ghost" className="text-destructive" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              ) : null}
            </div>
          )
        },
      },
    ],
    [canEditBlog, deleteMutation.isPending, featureMutation.isPending, isAdminOrComm, isBlogger, publishMutation.isPending, submitMutation.isPending, unfeatureMutation.isPending, user?.id, user?.role]
  )

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Blogs">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsCategoriesOpen(true)}>
            <FolderEdit className="mr-2 h-4 w-4" />
            Manage Categories
          </Button>
          {user?.role ? <CreateBlogDialog /> : null}
        </div>
      </PageHeader>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Status</label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus((value ?? 'ALL') as StatusFilter)
              resetPage()
            }}
          >
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Category</label>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value || 'ALL')
              resetPage()
            }}
          >
            <SelectTrigger className="w-56 h-9">
              <SelectValue placeholder="All categories">
                {categoryId === 'ALL'
                  ? 'All Categories'
                  : categories?.find((category) => category.id === categoryId)?.name ?? 'All Categories'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Featured</label>
          <Select
            value={featured}
            onValueChange={(value) => {
              setFeatured(value as FeaturedFilter)
              resetPage()
            }}
          >
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="FEATURED">Featured</SelectItem>
              <SelectItem value="NOT_FEATURED">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Search</label>
          <Input
            className="w-64"
            placeholder="Search blogs"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              resetPage()
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={blogsQuery.data?.data ?? []}
        isLoading={blogsQuery.isLoading}
        isError={blogsQuery.isError}
        onRetry={() => blogsQuery.refetch()}
      />

      <Pagination
        page={page}
        perPage={perPage}
        total={blogsQuery.data?.total ?? 0}
        onPageChange={setPage}
      />

      <BlogCategoriesDialog 
        open={isCategoriesOpen} 
        onOpenChange={setIsCategoriesOpen} 
      />
    </div>
  )
}
