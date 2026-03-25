import { useState } from 'react'
import { Edit } from 'lucide-react'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import type { CreateBlogDto } from '@/api/blogs.api'
import type { Blog } from '@/types/blogs.types'
import { useBlog, useUpdateBlog } from '../useBlogs'
import BlogWizard from './BlogWizard'

const toDefaultValues = (blog: Blog): Partial<CreateBlogDto> => ({
  title: blog.title,
  excerpt: blog.excerpt,
  content: blog.content,
  image: blog.image,
  categoryId: blog.categoryId,
})

type Props = {
  blogId: string
  trigger?: React.ReactElement
}

export default function EditBlogDialog({ blogId, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const blogQuery = useBlog(blogId)
  const updateMutation = useUpdateBlog()

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="icon"
          aria-label="Edit blog"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      {blogQuery.isLoading ? (
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <LoadingSpinner />
          </div>
        )
      ) : blogQuery.isError || !blogQuery.data ? (
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
             <div className="bg-background rounded-xl border shadow-sm p-6 max-w-md w-full">
                <ErrorState onRetry={() => blogQuery.refetch()} />
                <Button onClick={() => setOpen(false)} className="mt-4 w-full" variant="ghost">Close</Button>
             </div>
          </div>
        )
      ) : (
        <BlogWizard
          defaultValues={toDefaultValues(blogQuery.data)}
          isLoading={updateMutation.isPending}
          mode="edit"
          onOpenChange={setOpen}
          open={open}
          onSubmit={(dto) => {
            updateMutation.mutate(
              { id: blogId, dto },
              { onSuccess: () => setOpen(false) }
            )
          }}
        />
      )}
    </>
  )
}
