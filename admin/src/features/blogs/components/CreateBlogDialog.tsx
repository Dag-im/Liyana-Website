import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCreateBlog } from '../useBlogs'
import BlogWizard from './BlogWizard'

export default function CreateBlogDialog() {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateBlog()

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button>Create Blog</Button>} />
      <DialogContent className="max-w-7xl w-[98vw] h-[92vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Create Blog</DialogTitle>
          <DialogDescription>Use the guided steps to craft a new blog post.</DialogDescription>
        </DialogHeader>
        <BlogWizard
          isLoading={createMutation.isPending}
          mode="create"
          onSubmit={(dto) => {
            createMutation.mutate(dto, {
              onSuccess: () => setOpen(false),
            })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
