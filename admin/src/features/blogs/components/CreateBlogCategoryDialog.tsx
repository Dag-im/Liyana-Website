import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateBlogCategory } from '../useBlogs'

export default function CreateBlogCategoryDialog({ onCreated }: { onCreated?: (categoryId: string) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const createMutation = useCreateBlogCategory()

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button variant="outline" size="sm">Create Category</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Blog Category</DialogTitle>
          <DialogDescription>Add a new category for blog posts.</DialogDescription>
        </DialogHeader>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" />
        <DialogFooter>
          <Button
            onClick={() =>
              createMutation.mutate(name.trim(), {
                onSuccess: (category) => {
                  setOpen(false)
                  setName('')
                  onCreated?.(category.id)
                },
              })
            }
            disabled={createMutation.isPending || name.trim().length < 2}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
