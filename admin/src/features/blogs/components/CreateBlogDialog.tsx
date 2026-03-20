import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useCreateBlog } from '../useBlogs'
import BlogWizard from './BlogWizard'

export default function CreateBlogDialog() {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateBlog()

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Blog</Button>
      <BlogWizard
        isLoading={createMutation.isPending}
        mode="create"
        onOpenChange={setOpen}
        open={open}
        onSubmit={(dto) => {
          createMutation.mutate(dto, {
            onSuccess: () => setOpen(false),
          })
        }}
      />
    </>
  )
}
