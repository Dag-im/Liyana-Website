import { useState } from 'react'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={trigger ?? <Button variant="outline">Edit</Button>} />
      <DialogContent className="max-w-7xl w-[98vw] h-[92vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Edit Blog</DialogTitle>
          <DialogDescription>Update the blog post using the guided steps.</DialogDescription>
        </DialogHeader>
        {blogQuery.isLoading ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : blogQuery.isError || !blogQuery.data ? (
          <ErrorState onRetry={() => blogQuery.refetch()} />
        ) : (
          <BlogWizard
            defaultValues={toDefaultValues(blogQuery.data)}
            isLoading={updateMutation.isPending}
            mode="edit"
            onSubmit={(dto) => {
              updateMutation.mutate(
                { id: blogId, dto },
                { onSuccess: () => setOpen(false) }
              )
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
