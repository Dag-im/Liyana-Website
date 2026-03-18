import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Faq } from '@/types/faq.types'
import { useFaqCategories, useUpdateFaq } from './useFaqs'

type Props = {
  faq: Faq
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditFaqDialog({ faq, open, onOpenChange }: Props) {
  const { data: categories = [] } = useFaqCategories()
  const updateMutation = useUpdateFaq()

  const [question, setQuestion] = useState(faq.question)
  const [answer, setAnswer] = useState(faq.answer)
  const [categoryId, setCategoryId] = useState(faq.categoryId)
  const [position, setPosition] = useState(String(faq.position))

  const resetForm = () => {
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setCategoryId(faq.categoryId)
    setPosition(String(faq.position))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    updateMutation.mutate(
      {
        id: faq.id,
        dto: {
          question,
          answer,
          categoryId,
          position: position ? Number(position) : undefined,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (nextOpen) {
          resetForm()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit FAQ</DialogTitle>
          <DialogDescription>Update this FAQ item.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-faq-question">Question</Label>
            <Textarea
              id="edit-faq-question"
              required
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-faq-answer">Answer</Label>
            <Textarea
              id="edit-faq-answer"
              required
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={(value) => setCategoryId(value ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-faq-position">Position</Label>
            <Input
              id="edit-faq-position"
              type="number"
              min={0}
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending || !categoryId}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
