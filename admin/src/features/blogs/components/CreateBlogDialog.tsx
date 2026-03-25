import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCreateBlog } from '../useBlogs'
import BlogWizard from './BlogWizard'

export default function CreateBlogDialog() {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateBlog()

  return (
    <>
      <Button onClick={() => setOpen(true)} size="icon" aria-label="Create blog">
        <Plus className="h-4 w-4" />
      </Button>
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
